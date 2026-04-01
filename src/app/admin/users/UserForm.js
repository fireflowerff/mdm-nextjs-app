"use client";

import { useState, useActionState, useEffect } from "react";
import { saveUser } from "@/lib/actions/users";
import { toast } from "sonner";

export default function UserForm({ initialData = null, groups }) {
  const [show, setShow] = useState(false);
  const [state, formAction, isPending] = useActionState(saveUser, null);
  const isEdit = !!initialData;

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
          isEdit
            ? "text-blue-600 hover:underline text-sm"
            : "bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
        }
      >
        {isEdit ? "Edit" : "+ Add User"}
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <form action={formAction} className="space-y-4">
              <h2 className="text-xl font-bold border-b pb-2">
                {isEdit
                  ? `Edit User: ${initialData.username}`
                  : "Create New User"}
              </h2>

              <input type="hidden" name="id" value={initialData?.id || ""} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Username
                  </label>
                  <input
                    name="username"
                    defaultValue={initialData?.username || ""}
                    required
                    disabled={isEdit}
                    className="w-full border p-2 rounded mt-1 bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue={initialData?.role || "USER"}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={initialData?.email || ""}
                  required
                  className="w-full border p-2 rounded mt-1"
                />
              </div>

              {!isEdit && (
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full border p-2 rounded mt-1"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={initialData?.status || "ACTIVE"}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-500">
                    Menu Group
                  </label>
                  <select
                    name="menu_group_id"
                    defaultValue={initialData?.menu_group_id || ""}
                    className="w-full border p-2 rounded mt-1"
                  >
                    <option value="">-- No Menu --</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.menu_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
