"use client";

import { useState, useActionState, useEffect } from "react";
import { saveMenuGroup } from "@/lib/actions/menus";
import { toast } from "sonner";

export default function MenuGroupForm({ initialData = null }) {
  const [show, setShow] = useState(false);
  const [state, formAction, isPending] = useActionState(saveMenuGroup, null);
  const isEdit = !!initialData;

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setShow(false);
    }
  }, [state]);

  const toggleModal = (e) => {
    if (e) e.preventDefault(); // Stop Link navigation if nested
    setShow(!show);
  };

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={toggleModal}
        className={
          isEdit
            ? "text-blue-600 hover:text-blue-800 text-sm font-medium"
            : "bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        }
      >
        {isEdit ? "Edit" : "+ New Group"}
      </button>

      {/* MODAL */}
      {show && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
            <form action={formAction} className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">
                {isEdit ? "Edit Menu Group" : "Create Menu Group"}
              </h3>

              <input type="hidden" name="id" value={initialData?.id || ""} />

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Code
                </label>
                <input
                  name="code"
                  defaultValue={initialData?.menu_code || ""}
                  required
                  disabled={isEdit}
                  className="w-full border p-2 rounded mt-1 font-mono text-sm bg-gray-50"
                />
                {isEdit && (
                  <input
                    type="hidden"
                    name="code"
                    value={initialData.menu_code}
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={initialData?.menu_name || ""}
                  required
                  className="w-full border p-2 rounded mt-1 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="flex-1 py-2 border rounded text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
