import type { TodoFilter } from "@/types/todo";

type TodoEmptyStateProps = {
  filter: TodoFilter;
  searchQuery: string;
};

export default function TodoEmptyState({
  filter,
  searchQuery,
}: TodoEmptyStateProps) {
  const hasSearch = Boolean(searchQuery.trim());
  const title = hasSearch
    ? "No matching tasks"
    : filter === "completed"
      ? "No completed tasks yet"
      : "Your list is clear";
  const message = hasSearch
    ? "Try a different search term."
    : filter === "completed"
      ? "Finished tasks will appear here."
      : "Add a task when something comes up.";

  return (
    <div className="empty-state">
      <span aria-hidden="true">✓</span>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
