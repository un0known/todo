"use client";

import { FormEvent, useMemo, useState } from "react";

type Filter = "all" | "active" | "completed";
type Todo = { id: number; title: string; completed: boolean };

const starterTodos: Todo[] = [
  { id: 1, title: "Review quarterly goals", completed: true },
  { id: 2, title: "Prepare the project brief", completed: false },
  { id: 3, title: "Send feedback to the design team", completed: false },
];

function CheckIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  ) : null;
}

const all = () => {

  const [todos, setTodos] = useState<Todo[]>(starterTodos);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;

    setTodos((current) => [
      ...current,
      { id: Date.now(), title, completed: false },
    ]);
    setDraft("");
  }

  function toggleTodo(id: number) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: number) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditDraft(todo.title);
  }

  function saveEdit(id: number) {
    const title = editDraft.trim();
    if (!title) return;

    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
    setEditingId(null);
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
          {visibleTodos.map((todo) => (
            <article className={todo.completed ? "task completed" : "task"} key={todo.id}>
              <button
                type="button"
                className="check-button"
                aria-label={todo.completed ? `Mark ${todo.title} active` : `Mark ${todo.title} complete`}
                aria-pressed={todo.completed}
                onClick={() => toggleTodo(todo.id)}
              >
                <CheckIcon checked={todo.completed} />
              </button>

              {editingId === todo.id ? (
                <form
                  className="edit-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveEdit(todo.id);
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

              {editingId !== todo.id && (
                <div className="task-actions">
                  <button type="button" onClick={() => startEditing(todo)}>Edit</button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
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
  )
}

export default all