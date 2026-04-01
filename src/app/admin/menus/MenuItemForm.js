"use client";
import { useState, useActionState, useEffect } from "react";
import { saveMenuItem } from "@/lib/actions/menus";
import { toast } from "sonner";

export default function MenuItemForm({
  groupId,
  functions,
  groups,
  initialData = null,
}) {
  const [show, setShow] = useState(false);
  const [type, setType] = useState(
    initialData?.app_function_id ? "FUNCTION" : "SUBMENU",
  );
  const [state, formAction, isPending] = useActionState(saveMenuItem, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setShow(false);
    }
  }, [state]);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className={
          initialData
            ? "text-blue-600 hover:underline text-sm"
            : "bg-blue-600 text-white px-4 py-2 rounded-lg"
        }
      >
        {initialData ? "Edit" : "+ Add Item"}
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <form
            action={formAction}
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
          >
            <h2 className="text-lg font-bold">
              {initialData ? "Edit Item" : "New Menu Item"}
            </h2>
            <input type="hidden" name="id" value={initialData?.id || ""} />
            <input type="hidden" name="menu_group_id" value={groupId} />

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="text-xs font-bold uppercase">Seq</label>
                <input
                  name="seq"
                  type="number"
                  defaultValue={initialData?.menu_item_seq || 10}
                  className="w-full border p-2 rounded mt-1"
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs font-bold uppercase">Label</label>
                <input
                  name="name"
                  defaultValue={initialData?.menu_item_name || ""}
                  className="w-full border p-2 rounded mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase">Item Type</label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="FUNCTION">🔗 Page Function</option>
                <option value="SUBMENU">📁 Sub-menu Group</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase">
                Target {type === "FUNCTION" ? "Function" : "Menu Group"}
              </label>
              <select
                name="target_id"
                className="w-full border p-2 rounded mt-1"
                defaultValue={
                  initialData?.app_function_id ||
                  initialData?.sub_menu_group_id ||
                  ""
                }
              >
                <option value="">-- Select --</option>
                {type === "FUNCTION"
                  ? functions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.function_name}
                      </option>
                    ))
                  : groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.menu_name}
                      </option>
                    ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 p-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={isPending}
                className="flex-1 p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
