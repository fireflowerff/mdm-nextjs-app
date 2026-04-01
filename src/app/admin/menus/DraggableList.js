"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { updateMenuSequence } from "@/lib/actions/menus"; // We will create this action
import { toast } from "sonner";
import MenuDeleteButton from "@/components/MenuDeleteButton";
import { deleteMenuItem } from "@/lib/actions/menus";

export default function DraggableList({
  items,
  MenuItemForm,
  functions,
  groups,
  groupId,
}) {
  const [list, setList] = useState(items);

  // Keep internal state in sync with server data
  useEffect(() => {
    setList(items);
  }, [items]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const newItems = Array.from(list);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    // Optimistically update the UI
    setList(newItems);

    // Calculate new sequences (e.g., 10, 20, 30...)
    const updates = newItems.map((item, index) => ({
      id: item.id,
      seq: (index + 1) * 10,
    }));

    const res = await updateMenuSequence(updates);
    if (res.success) {
      toast.success("Sequence updated");
    } else {
      toast.error("Failed to save order");
      setList(items); // Revert on failure
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="menu-items">
        {(provided) => (
          <tbody
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="divide-y divide-gray-100"
          >
            {list.map((item, index) => (
              <Draggable
                key={item.id.toString()}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided) => (
                  <tr
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="hover:bg-gray-50 bg-white"
                  >
                    <td
                      {...provided.dragHandleProps}
                      className="p-4 w-12 text-gray-400 cursor-grab active:cursor-grabbing"
                    >
                      ⠿
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {item.menu_item_seq}
                    </td>
                    <td className="p-4 font-medium">{item.menu_item_name}</td>
                    <td className="p-4">
                      {item.app_function_id ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Func: {item.function_name}
                        </span>
                      ) : (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          Sub: {item.sub_menu_name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <MenuItemForm
                        initialData={item}
                        groupId={groupId}
                        functions={functions}
                        groups={groups}
                      />

                      <MenuDeleteButton
                        id={item.id}
                        label={item.menu_item_name}
                        onDelete={deleteMenuItem}
                      />
                    </td>
                  </tr>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </tbody>
        )}
      </Droppable>
    </DragDropContext>
  );
}
