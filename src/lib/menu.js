import pool from "./db";

export async function getAllMenuGroups() {
  const { rows } = await pool.query(
    "SELECT id, menu_name, menu_code FROM public.menu_group ORDER BY menu_name",
  );
  return rows;
}

export async function getAllFunctions() {
  const { rows } = await pool.query(
    "SELECT id, function_name FROM public.app_functions ORDER BY function_name",
  );
  return rows;
}

export async function getMenuItemsByGroup(groupId) {
  const { rows } = await pool.query(
    `SELECT mi.*, af.function_name, smg.menu_name as sub_menu_name
     FROM public.menu_items mi
     LEFT JOIN public.app_functions af ON mi.app_function_id = af.id
     LEFT JOIN public.menu_group smg ON mi.sub_menu_group_id = smg.id
     WHERE mi.menu_group_id = $1
     ORDER BY mi.menu_item_seq ASC`,
    [groupId],
  );
  return rows;
}

export async function getSidebarMenu(menuGroupId) {
  const query = `
    WITH RECURSIVE menu_tree AS (
        SELECT 
            mi.id,
            mi.menu_group_id,
            COALESCE(af.function_name, smg.menu_name) as display_name, 
            mi.menu_item_seq,
            mi.sub_menu_group_id,
            af.function_url,
            1 as level,
            ARRAY[mi.menu_item_seq] as sort_path
        FROM public.menu_items mi
        LEFT JOIN public.app_functions af ON mi.app_function_id = af.id
        LEFT JOIN public.menu_group smg ON mi.sub_menu_group_id = smg.id
        WHERE mi.menu_group_id = $1

        UNION ALL

        SELECT 
            child.id,
            child.menu_group_id,
            COALESCE(af.function_name, smg.menu_name) as display_name,
            child.menu_item_seq,
            child.sub_menu_group_id,
            af.function_url,
            parent.level + 1,
            parent.sort_path || child.menu_item_seq
        FROM public.menu_items child
        INNER JOIN menu_tree parent ON child.menu_group_id = parent.sub_menu_group_id
        LEFT JOIN public.app_functions af ON child.app_function_id = af.id
        LEFT JOIN public.menu_group smg ON child.sub_menu_group_id = smg.id
    )
    SELECT * FROM menu_tree ORDER BY sort_path;
  `;

  const { rows } = await pool.query(query, [menuGroupId]);
  return buildTree(rows);
}

function buildTree(rows) {
  const map = {};
  const roots = [];

  rows.forEach((row) => {
    map[row.id] = { ...row, children: [] };
  });

  rows.forEach((row) => {
    if (row.level === 1) {
      roots.push(map[row.id]);
    } else {
      // Find the parent: the menu_item that points to this item's menu_group_id
      const parentRow = rows.find(
        (r) => r.sub_menu_group_id === row.menu_group_id,
      );
      if (parentRow && map[parentRow.id]) {
        map[parentRow.id].children.push(map[row.id]);
      }
    }
  });

  return roots;
}
