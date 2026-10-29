"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Filter = "all" | "active" | "completed";
type Todo = { _id: string; title: string; completed: boolean };

function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  ) : null;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");


  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

    
  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(`${API_URL}/todos`);

        if (!response.ok) {
          throw new Error("Todos fetch nahi ho paaye");
        }

        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchTodos();
  }, [API_URL]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  async function addTodo(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const title = draft.trim();

  if (!title) return;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/todos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          completed: false,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Todo create nahi hua");
    }

    const newTodo: Todo = await response.json();

    setTodos((current) => [...current, newTodo]);
    setDraft("");
    setError(null);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong",
    );
  }
}

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  async function deleteTodo(todo: Todo) {
    const response = await fetch(`${API_URL}/todos/${todo._id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Todo delete nahi hua");
    }

    setTodos((current) => current.filter((item) => item._id !== todo._id));
  }

  function startEditing(todo: Todo) {
    setEditingId(todo._id);
    setEditDraft(todo.title);
  }

  async function handleEdit(id: string) {
    const title = editDraft.trim();
    if (!title) return;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
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
      setTodos((current) =>
        current.map((todo) =>
          todo._id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="todo-heading">
        <header className="app-header">
          <div>
            <p className="eyebrow">Today</p>
            <h1 id="todo-heading">Make things happen.</h1>
          </div>
          <div className="progress" aria-label={`${activeCount} tasks remaining`}>
            <strong>{activeCount}</strong>
            <span>{activeCount === 1 ? "task" : "tasks"} left</span>
          </div>
        </header>

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

        <div className="toolbar">
          <div className="filters" aria-label="Filter tasks">
            {(["all", "active", "completed"] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? "filter active" : "filter"}
                onClick={() => setFilter(option)}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {todos.some((todo) => todo.completed) && (
            <button
              className="clear-button"
              type="button"
              onClick={() =>
                setTodos((current) => current.filter((todo) => !todo.completed))
              }
            >
              Clear completed
            </button>
          )}
        </div>

        <div className="task-list" aria-live="polite">
          {loading && <p>Loading todos...</p>}

          {error && <p role="alert">{error}</p>}

          {visibleTodos.map((todo) => (
            <article className={todo.completed ? "task completed" : "task"} key={todo._id}>
              <button
                type="button"
                className="check-button"
                aria-label={todo.completed ? `Mark ${todo.title} active` : `Mark ${todo.title} complete`}
                aria-pressed={todo.completed}
                onClick={() => toggleTodo(todo._id)}
              >
                <CheckIcon checked={todo.completed} />
              </button>

              {editingId === todo._id ? (
                <form
                  className="edit-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void handleEdit(todo._id);
                  }}
                >
                  <input
                    aria-label="Edit task"
                    value={editDraft}
                    onChange={(event) => setEditDraft(event.target.value)}
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setEditingId(null);
                    }}
                  />
                  <button type="submit" disabled={!editDraft.trim()}>Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <span className="task-title">{todo.title}</span>
              )}

              {editingId !== todo._id && (
                <div className="task-actions">
                  <button type="button" onClick={() => startEditing(todo)}>Edit</button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={()=>  deleteTodo(todo)}
                    aria-label={`Delete ${todo.title}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
                    </svg>
                  </button>
                </div>
              )}
            </article>
          ))}

          {visibleTodos.length === 0 && (
            <div className="empty-state">
              <span aria-hidden="true">✓</span>
              <h2>{filter === "completed" ? "No completed tasks yet" : "Your list is clear"}</h2>
              <p>{filter === "completed" ? "Finished tasks will appear here." : "Add a task when something comes up."}</p>
            </div>
          )}
        </div>

        <footer className="app-footer">
          <span>{todos.length} total</span>
          <span>{todos.filter((todo) => todo.completed).length} completed</span>
        </footer>
      </section>
    </main>
  );
}
