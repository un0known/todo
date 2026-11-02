import { useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  onTodoUpdated: (todo: Todo) => void;
  onTodoDeleted: (id: string) => void;
  onError: (message: string | null) => void;
};

function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  ) : null;
}

export default function TodoItem({
  todo,
  isEditing,
  onToggle,
  onStartEditing,
  onCancelEditing,
  onTodoUpdated,
  onTodoDeleted,
  onError,
}: TodoItemProps) {
  const [editDraft, setEditDraft] = useState(todo.title);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  function startEditing() {
    setEditDraft(todo.title);
    onStartEditing(todo);
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = editDraft.trim();

    if (!title) return;

    try {
      const response = await fetch(`${apiUrl}/todos/${todo._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Todo update nahi hua");
      }

      const updatedTodo: Todo = await response.json();
      onTodoUpdated(updatedTodo);
      onCancelEditing();
      onError(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function deleteTodo() {
    try {
      const response = await fetch(`${apiUrl}/todos/${todo._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Todo delete nahi hua");
      }

      onTodoDeleted(todo._id);
      onError(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <article className={todo.completed ? "task completed" : "task"}>
      <button
        type="button"
        className="check-button"
        aria-label={
          todo.completed
            ? `Mark ${todo.title} active`
            : `Mark ${todo.title} complete`
        }
        aria-pressed={todo.completed}
        onClick={() => onToggle(todo._id)}
      >
        <CheckIcon checked={todo.completed} />
      </button>

      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <input
            aria-label="Edit task"
            value={editDraft}
            onChange={(event) => setEditDraft(event.target.value)}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Escape") onCancelEditing();
            }}
          />
          <button type="submit" disabled={!editDraft.trim()}>
            Save
          </button>
          <button type="button" onClick={onCancelEditing}>
            Cancel
          </button>
        </form>
      ) : (
        <span className="task-title">{todo.title}</span>
      )}

      {!isEditing && (
        <div className="task-actions">
          <button type="button" onClick={startEditing}>
            Edit
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={deleteTodo}
            aria-label={`Delete ${todo.title}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
            </svg>
          </button>
        </div>
      )}
    </article>
  );
}
