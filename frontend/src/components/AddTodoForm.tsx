import { useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "@/types/todo";

type AddTodoFormProps = {
  onTodoCreated: (todo: Todo) => void;
  onPageReset: () => void;
  onError: (message: string | null) => void;
};

export default function AddTodoForm({
  onTodoCreated,
  onPageReset,
  onError,
}: AddTodoFormProps) {
  const [draft, setDraft] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  async function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();

    if (!title) return;

    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!response.ok) {
        throw new Error("Todo create nahi hua");
      }

      const newTodo: Todo = await response.json();
      onTodoCreated(newTodo);
      onPageReset();
      setDraft("");
      onError(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <form className="add-form" onSubmit={addTodo}>
      <label htmlFor="new-task">Add a task</label>
      <div className="input-row">
        <input
          id="new-task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What needs to get done?"
          autoComplete="off"
        />
        <button className="add-button" type="submit" disabled={!draft.trim()}>
          <span aria-hidden="true">+</span>
          Add task
        </button>
      </div>
    </form>
  );
}
