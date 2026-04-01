import {
  getAllMenuGroups,
  getMenuItemsByGroup,
  getAllFunctions,
} from "@/lib/menu";
import Link from "next/link";
import MenuItemForm from "./MenuItemForm";
import MenuGroupForm from "./MenuGroupForm"; // Our simplified form
import DraggableList from "./DraggableList";
import { deleteMenuGroup } from "@/lib/actions/menus";
import MenuDeleteButton from "@/components/MenuDeleteButton";

export default async function MenuManagementPage({ searchParams }) {
  const params = await searchParams;
  const selectedGroupId = params.groupId ? parseInt(params.groupId) : null;

  const groups = await getAllMenuGroups();
  const functions = await getAllFunctions();
  const items = selectedGroupId
    ? await getMenuItemsByGroup(selectedGroupId)
    : [];

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* MASTER SIDE: Simple List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800">Menu Groups</h2>
          {/* Add Group Button */}
          <MenuGroupForm />
        </div>

        <div className="divide-y divide-gray-100">
          {groups.map((g) => (
            <div
              key={g.id}
              className={`flex items-center justify-between p-4 transition-colors ${
                selectedGroupId === g.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <Link href={`?groupId=${g.id}`} className="flex-1">
                <span
                  className={`block font-medium ${selectedGroupId === g.id ? "text-blue-700" : "text-gray-700"}`}
                >
                  {g.menu_name}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-mono">
                  {g.menu_code}
                </span>
              </Link>

              {/* Edit Group Button - Simple and Direct */}
              <div className="ml-2">
                <MenuGroupForm initialData={g} />
                <MenuDeleteButton
                  id={g.id}
                  label={g.menu_name}
                  onDelete={deleteMenuGroup}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL SIDE: Stays the same as your working version */}
      <div className="flex-1">
        {!selectedGroupId ? (
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            Select a Menu Group to manage items
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Items for Group #{selectedGroupId}
              </h2>
              <MenuItemForm
                groupId={selectedGroupId}
                functions={functions}
                groups={groups.filter((g) => g.id !== selectedGroupId)}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-500">
                  <tr>
                    <th className="p-4 w-12"></th>
                    <th className="p-4 w-16">Seq</th>
                    <th className="p-4">Label</th>
                    <th className="p-4">Points To</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <DraggableList
                  items={items}
                  MenuItemForm={MenuItemForm}
                  functions={functions}
                  groups={groups.filter((g) => g.id !== selectedGroupId)}
                  groupId={selectedGroupId}
                />
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
