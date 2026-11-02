"use client";

import { useEffect, useMemo, useState } from "react";
import AddTodoForm from "@/components/AddTodoForm";
import Pagination from "@/components/Pagination";
import TodoFooter from "@/components/TodoFooter";
import TodoHeader from "@/components/TodoHeader";
import TodoList from "@/components/TodoList";
import TodoToolbar from "@/components/TodoToolbar";
import type { Todo, TodoFilter } from "@/types/todo";

const PAGE_SIZE = 2;
const PAGE_SIZE_OPTIONS = [2, 5, 10, 15, 20];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(`${apiUrl}/todos`);

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
  }, [apiUrl]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return todos.filter((todo) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);
      const matchesSearch = todo.title.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, todos]);
  const totalPages = Math.max(1, Math.ceil(visibleTodos.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginatedTodos = useMemo(
    () => visibleTodos.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize, visibleTodos],
  );

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    setCurrentPage(1);
  }

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="todo-heading">
        <TodoHeader activeCount={activeCount} />
        <AddTodoForm
          onTodoCreated={(todo) => setTodos((current) => [...current, todo])}
          onPageReset={() => setCurrentPage(1)}
          onError={setError}
        />
        <TodoToolbar
          filter={filter}
          searchQuery={searchQuery}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          todos={todos}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
          onPageSizeChange={setPageSize}
          onTodosChange={setTodos}
          onPageReset={() => setCurrentPage(1)}
        />
        <TodoList
          todos={paginatedTodos}
          hasVisibleTodos={visibleTodos.length > 0}
          loading={loading}
          error={error}
          filter={filter}
          searchQuery={searchQuery}
          editingId={editingId}
          onToggle={toggleTodo}
          onStartEditing={(todo) => setEditingId(todo._id)}
          onCancelEditing={() => setEditingId(null)}
          onTodoUpdated={(updatedTodo) => {
            setTodos((current) =>
              current.map((todo) =>
                todo._id === updatedTodo._id
                  ? { ...todo, title: updatedTodo.title }
                  : todo,
              ),
            );
            setError(null);
          }}
          onTodoDeleted={(id) => {
            setTodos((current) => current.filter((todo) => todo._id !== id));
            setCurrentPage(1);
          }}
          onError={setError}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <TodoFooter
          totalCount={todos.length}
          completedCount={todos.filter((todo) => todo.completed).length}
        />
      </section>
    </main>
  );
}
