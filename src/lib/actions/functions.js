"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Saves or Updates an Application Function
 * Mimics an Oracle 'Upsert' procedure
 */
export async function saveAppFunction(prevState, formData) {
  const id = formData.get("id"); // Hidden field for updates
  const code = formData.get("code");
  const name = formData.get("name");
  const url = formData.get("url");
  const user = "admin"; // Hardcoded for now, pull from session later

  try {
    if (id) {
      // UPDATE Case
      await pool.query(
        `UPDATE public.app_functions 
         SET function_name = $1, function_url = $2, updated_at = NOW(), last_modified_by = $3 
         WHERE id = $4`,
        [name, url, user, id],
      );
    } else {
      // INSERT Case
      // Check for duplicate code first
      const exists = await pool.query(
        "SELECT id FROM app_functions WHERE function_code = $1",
        [code],
      );
      if (exists.rows.length > 0)
        return { error: `Code ${code} already exists.` };

      await pool.query(
        `INSERT INTO public.app_functions (function_code, function_name, function_url, last_modified_by) 
         VALUES ($1, $2, $3, $4)`,
        [code, name, url, user],
      );
    }

    revalidatePath("/admin/functions"); // Refresh the table data
    return { success: true, message: "Function saved successfully!" };
  } catch (e) {
    console.error("DB Error:", e);
    return { error: "Database failure: " + e.message };
  }
}
