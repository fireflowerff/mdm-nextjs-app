// src/lib/member-actions.js
"use server";
import { auth } from "@/auth"; // Import the auth helper
import pool from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

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
  // 1. Get the current session
  const session = await auth();
  const userName = session?.user?.name || "System";

  try {
    // 2. Update status AND the last_modified_by column
    await pool.query(
      "UPDATE members SET status = 'DELETED', last_modified_by = $1 WHERE id = $2",
      [userName, id],
    );

    revalidatePath("/members");
    return { success: true };
  } catch (err) {
    return { error: "Failed to delete member." };
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
