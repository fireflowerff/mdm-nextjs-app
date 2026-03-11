// src/lib/member-actions.js
"use server";
import { auth } from "@/auth"; // Import the auth helper
import pool from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { withAuth, withAdmin } from "./action-utils";

export async function getMemberById(id) {
  try {
    const result = await pool.query(
      "SELECT id, member_code, first_name, last_name, email FROM members WHERE id = $1",
      [id],
    );
    return result.rows[0]; // Returns the object or undefined
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch member.");
  }
}

export async function updateMember(formData) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id");
  const firstName = formData.get("first_name");
  const lastName = formData.get("last_name");
  const email = formData.get("email");

  // Use .name to match your other functions
  const modifier = session.user.name || session.user.email;

  try {
    await pool.query(
      `UPDATE members 
       SET first_name = $1, 
           last_name = $2, 
           email = $3, 
           last_modified_by = $4, 
           updated_at = NOW() 
       WHERE id = $5`,
      [firstName, lastName, email, modifier, id],
    );

    return { success: true };
  } catch (error) {
    console.error("Database Update Error:", error);
    return { error: "Failed to update record in PostgreSQL." };
  }
}

// Function to fetch all members from PostgreSQL
export async function getMembers(query, page = 1) {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  try {
    const sql = query
      ? `SELECT * FROM members 
         WHERE status != 'DELETED' 
         AND (member_code ILIKE $1 OR first_name ILIKE $1) 
         ORDER BY member_code 
         LIMIT $2 OFFSET $3`
      : `SELECT * FROM members 
         WHERE status != 'DELETED' 
         ORDER BY member_code 
         LIMIT $1 OFFSET $2`;

    const values = query
      ? [`%${query}%`, pageSize, offset]
      : [pageSize, offset];

    const res = await pool.query(sql, values);

    // Also get the total count for the UI
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM members WHERE status != 'DELETED'",
    );
    const totalPages = Math.ceil(parseInt(countRes.rows[0].count) / pageSize);

    return { data: res.rows, totalPages, error: null };
  } catch (err) {
    return { data: [], totalPages: 0, error: err.message };
  }
}

export async function updateMemberStatus(id, currentStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await pool.query("UPDATE members SET status = $1 WHERE id = $2", [
    newStatus,
    id,
  ]);
  revalidatePath("/members"); // Refreshes the UI automatically
}

export async function toggleMemberStatus(id, currentStatus) {
  return withAuth(async (user) => {
    // 1. Determine the new status
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const modifier = user.name || user.email;

    try {
      // 2. Update PostgreSQL
      await pool.query(
        `UPDATE members 
         SET status = $1, 
             last_modified_by = $2, 
             updated_at = NOW() 
         WHERE id = $3`,
        [newStatus, modifier, id],
      );

      // 3. Refresh the UI
      revalidatePath("/members");
      return { success: true };
    } catch (err) {
      console.error("Status Toggle Error:", err);
      return { error: "Failed to toggle member status." };
    }
  });
}

export async function getMemberByCode(code) {
  try {
    const res = await pool.query(
      "SELECT id, member_code, first_name, last_name, email, status, created_at, updated_at FROM members WHERE member_code = $1",
      [code],
    );
    return { data: res.rows[0], error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function createMember(formData) {
  return withAuth(async (user) => {
    // 1. Extract values from formData
    const code = formData.get("member_code")?.trim();
    const first = formData.get("first_name")?.trim();
    const last = formData.get("last_name")?.trim();
    const email = formData.get("email")?.trim();

    // 2. Mandatory Field Validation (Business Logic)
    if (!code || !first) {
      return { error: "Member Code and First Name are mandatory fields." };
    }

    // 3. Audit Info (using .name as per your consistency rule)
    const modifier = user.name || user.email;

    try {
      await pool.query(
        `INSERT INTO members (
          member_code, 
          first_name, 
          last_name, 
          email, 
          last_modified_by, 
          status, 
          updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW())`,
        [code, first, last, email, modifier],
      );

      // 4. Refresh the dashboard so the new member appears
      revalidatePath("/members");
      return { success: true };
    } catch (err) {
      console.error("Database Insert Error:", err);

      // PostgreSQL Unique Constraint Violation (Error Code 23505)
      if (err.code === "23505") {
        return { error: `Member Code "${code}" already exists in the system.` };
      }

      return { error: "An unexpected database error occurred." };
    }
  });
}

export async function deleteMember(id) {
  return withAdmin(async (user) => {
    const modifier = user.name || user.email;

    try {
      // Soft delete by setting status to 'DELETED'
      await pool.query(
        `UPDATE members 
         SET status = 'DELETED', 
             last_modified_by = $1, 
             updated_at = NOW() 
         WHERE id = $2`,
        [modifier, id],
      );

      revalidatePath("/members");
      return { success: true };
    } catch (err) {
      console.error("Archive Error:", err);
      return { error: "Database error: Could not archive the member." };
    }
  });
}

export async function recoverMember(id) {
  return withAdmin(async (user) => {
    const modifier = user.name || user.email;

    try {
      await pool.query(
        `UPDATE members 
         SET status = 'ACTIVE', 
             last_modified_by = $1, 
             updated_at = NOW() 
         WHERE id = $2`,
        [modifier, id],
      );
      revalidatePath("/members/archive");
      revalidatePath("/members");
      return { success: true };
    } catch (err) {
      return { error: "Failed to restore member." };
    }
  });
}

export async function getArchivedMembers() {
  try {
    const res = await pool.query(
      "SELECT * FROM members WHERE status = 'DELETED' ORDER BY member_code",
    );
    return { data: res.rows, error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

// src/lib/member-actions.js
export async function authenticate(formData) {
  try {
    // Add 'redirectTo' to force the navigation to the member list
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/members",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // ... same error handling as before ...
      return redirect("/login?error=CredentialsSignin");
    }
    throw error;
  }
}
