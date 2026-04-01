"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveUser(prevState, formData) {
  const id = formData.get("id");
  const username = formData.get("username");
  const email = formData.get("email");
  const role = formData.get("role");
  const status = formData.get("status");
  const menuGroupId = formData.get("menu_group_id") || null;
  const password = formData.get("password"); // Only used on Create or if changing

  try {
    if (id) {
      // UPDATE
      await pool.query(
        `UPDATE public.users 
         SET email = $1, role = $2, status = $3, menu_group_id = $4 
         WHERE id = $5`,
        [email, role, status, menuGroupId, id],
      );
    } else {
      // INSERT
      await pool.query(
        `INSERT INTO public.users (username, password_hash, email, role, status, menu_group_id) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [username, password, email, role, status, menuGroupId],
      );
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User saved successfully" };
  } catch (e) {
    return { error: "Database error: " + e.message };
  }
}
