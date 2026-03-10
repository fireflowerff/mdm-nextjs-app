// src/lib/member-actions.js
"use server";
import { auth } from "@/auth"; // Import the auth helper
import pool from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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

// Update member status (Server Action)
export async function toggleMemberStatus(id, currentStatus) {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  await pool.query("UPDATE members SET status = $1 WHERE id = $2", [
    newStatus,
    id,
  ]);

  // This tells Next.js to clear the cache and show the updated data
  revalidatePath("/members");
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
  // 1. Log EVERYTHING to the terminal
  console.log("--- SERVER ACTION TRIGGERED ---");

  const rawData = {
    member_code: formData.get("member_code"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
  };

  console.log("Form Data Received:", rawData);

  // 2. Simple Validation Check
  if (!rawData.member_code || !rawData.first_name) {
    console.error("Validation Failed: Missing required fields");
    return { error: "Member Code and First Name are required." };
  }

  const session = await auth();
  const userName = session?.user?.name || "System";

  try {
    console.log("Attempting PostgreSQL Insert...");

    const result = await pool.query(
      "INSERT INTO members (member_code, first_name, last_name, email, status, last_modified_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        rawData.member_code,
        rawData.first_name,
        rawData.last_name,
        rawData.email,
        "ACTIVE",
        userName,
      ],
    );

    console.log("Insert Successful! New ID:", result.rows[0].id);

    revalidatePath("/members");
    return { success: true };
  } catch (err) {
    console.error("PostgreSQL Error Details:", err.message);
    console.error("Error Code:", err.code);
    return { error: `Database error: ${err.message}` };
  }
}

export async function deleteMember(id) {
  const session = await auth();

  // 1. Security Gate: Only ADMIN can delete
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized: Only administrators can delete members." };
  }

  const modifier = session.user.name || session.user.email;

  try {
    // 2. Soft Delete: Update status to 'DELETED' instead of removing the row
    // This matches your "View Archived/Deleted Members" logic
    await pool.query(
      `UPDATE members 
       SET status = 'DELETED', 
           last_modified_by = $1, 
           updated_at = NOW() 
       WHERE id = $2`,
      [modifier, id],
    );

    // 3. Refresh the Dashboard data immediately
    revalidatePath("/members");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Database Error: Could not archive member." };
  }
}

export async function recoverMember(id) {
  const session = await auth();
  const userName = session?.user?.name || "System";

  try {
    await pool.query(
      "UPDATE members SET status = 'ACTIVE', last_modified_by = $1 WHERE id = $2",
      [userName, id],
    );

    revalidatePath("/members");
    revalidatePath("/members/archive");
    return { success: true };
  } catch (err) {
    return { error: "Failed to recover member." };
  }
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
