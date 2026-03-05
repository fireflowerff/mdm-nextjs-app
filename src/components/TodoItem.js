"use server";

import pool from "@/lib/db";
import { revalidatePath } from "next/cache";

export default function TodoItem({ task }) {
  // This function runs ONLY on the server
  async function toggleStatus() {
    await pool.query("UPDATE tasks SET completed = $1 WHERE id = $2", [
      !task.completed,
      task.id,
    ]);

    // This refreshes the UI automatically
    revalidatePath("/");
  }

  return (
    <form action={toggleStatus}>
      <button type="submit">
        {task.text} - {task.completed ? "✅" : "❌"}
      </button>
    </form>
  );
}
