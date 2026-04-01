"use server";
import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveMenuItem(prevState, formData) {
  const id = formData.get("id");
  const groupId = formData.get("menu_group_id");
  const seq = formData.get("seq");
  const name = formData.get("name");
  const type = formData.get("type"); // 'FUNCTION' or 'SUBMENU'
  const targetId = formData.get("target_id");
  const user = "admin";

  try {
    const appId = type === "FUNCTION" ? targetId : null;
    const subGrpId = type === "SUBMENU" ? targetId : null;

    if (id) {
      await pool.query(
        `UPDATE public.menu_items 
         SET menu_item_seq = $1, menu_item_name = $2, sub_menu_group_id = $3, 
             app_function_id = $4, updated_at = NOW(), last_modified_by = $5 
         WHERE id = $6`,
        [seq, name, subGrpId, appId, user, id],
      );
    } else {
      await pool.query(
        `INSERT INTO public.menu_items (menu_group_id, menu_item_seq, menu_item_name, sub_menu_group_id, app_function_id, last_modified_by) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [groupId, seq, name, subGrpId, appId, user],
      );
    }

    revalidatePath("/admin/menus");
    return { success: true, message: "Menu item updated." };
  } catch (e) {
    return { error: e.message };
  }
}

export async function updateMenuSequence(updates) {
  try {
    // Generate a bulk update query
    // updates = [{id: 1, seq: 10}, {id: 2, seq: 20}]
    for (const update of updates) {
      await pool.query(
        "UPDATE public.menu_items SET menu_item_seq = $1 WHERE id = $2",
        [update.seq, update.id],
      );
    }
    revalidatePath("/admin/menus");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: e.message };
  }
}

/**
 * Saves or Updates a Menu Group
 */
export async function saveMenuGroup(prevState, formData) {
  const id = formData.get("id");
  const code = formData.get("code");
  const name = formData.get("name");
  const user = "admin";

  try {
    if (id) {
      await pool.query(
        "UPDATE public.menu_group SET menu_code = $1, menu_name = $2, updated_at = NOW(), last_modified_by = $3 WHERE id = $4",
        [code, name, user, id],
      );
    } else {
      await pool.query(
        "INSERT INTO public.menu_group (menu_code, menu_name, last_modified_by) VALUES ($1, $2, $3)",
        [code, name, user],
      );
    }
    revalidatePath("/admin/menus");
    return { success: true, message: "Group saved successfully" };
  } catch (e) {
    return { error: e.message };
  }
}

/**
 * Deletes a Menu Item (No Restrictions)
 */
export async function deleteMenuItem(id) {
  try {
    await pool.query("DELETE FROM public.menu_items WHERE id = $1", [id]);
    revalidatePath("/admin/menus");
    return { success: true };
  } catch (e) {
    return { error: "Delete failed: " + e.message };
  }
}

/**
 * Deletes a Menu Group (With Integrity Checks)
 */
export async function deleteMenuGroup(id) {
  try {
    // 1. Check if used as a Sub-Menu in menu_items
    const itemCheck = await pool.query(
      "SELECT id FROM public.menu_items WHERE menu_group_id = $1 OR sub_menu_group_id = $1 LIMIT 1",
      [id],
    );
    if (itemCheck.rows.length > 0) {
      return {
        error: "Cannot delete: This group is being used by Menu Items.",
      };
    }

    // 2. Check if assigned to any Users
    const userCheck = await pool.query(
      "SELECT id FROM public.users WHERE menu_group_id = $1 LIMIT 1",
      [id],
    );
    if (userCheck.rows.length > 0) {
      return {
        error: "Cannot delete: This group is assigned to one or more Users.",
      };
    }

    // 3. If clear, delete
    await pool.query("DELETE FROM public.menu_group WHERE id = $1", [id]);
    revalidatePath("/admin/menus");
    return { success: true, message: "Group deleted successfully." };
  } catch (e) {
    return { error: "Database error: " + e.message };
  }
}
