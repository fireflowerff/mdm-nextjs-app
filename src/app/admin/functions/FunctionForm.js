"use client";

import { useState, useActionState, useEffect } from "react";
import { saveAppFunction } from "@/lib/actions/functions";
import { toast } from "sonner";

export default function FunctionForm({ initialData = null }) {
  const [show, setShow] = useState(false);
  const [state, formAction, isPending] = useActionState(saveAppFunction, null);

  // Is this an Edit or a New record?
  const isEdit = !!initialData;

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setShow(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      {/* Dynamic Button Label */}
      <button
        onClick={() => setShow(true)}
        className={
          isEdit
            ? "text-blue-600 hover:text-blue-800 font-medium text-sm"
            : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
        }
      >
        {isEdit ? "Edit" : "+ Register Function"}
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {isEdit
                  ? `Edit: ${initialData.function_code}`
                  : "New App Function"}
              </h2>
              <button
                onClick={() => setShow(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              {/* HIDDEN ID FIELD: Crucial for the UPDATE logic in the Server Action */}
              {isEdit && (
                <input type="hidden" name="id" value={initialData.id} />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Function Code
                </label>
                <input
                  name="code"
                  required
                  disabled={isEdit} // Usually, we don't allow changing the Unique Code
                  defaultValue={initialData?.function_code || ""}
                  className={`w-full border p-2 rounded mt-1 font-mono ${isEdit ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"}`}
                  placeholder="F001"
                />
                {isEdit && (
                  <input
                    type="hidden"
                    name="code"
                    value={initialData.function_code}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  name="name"
                  required
                  defaultValue={initialData?.function_name || ""}
                  className="w-full border p-2 rounded mt-1"
                  placeholder="User List"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL Path
                </label>
                <input
                  name="url"
                  required
                  defaultValue={initialData?.function_url || ""}
                  className="w-full border p-2 rounded mt-1 font-mono text-sm"
                  placeholder="/admin/users"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending
                    ? "Saving..."
                    : isEdit
                      ? "Update Function"
                      : "Save Function"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
