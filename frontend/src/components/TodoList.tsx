import type { Todo, TodoFilter } from "@/types/todo";
import TodoEmptyState from "@/components/TodoEmptyState";
import TodoItem from "@/components/TodoItem";

type TodoListProps = {
  todos: Todo[];
  hasVisibleTodos: boolean;
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  searchQuery: string;
  editingId: string | null;
  onToggle: (id: string) => void;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  onTodoUpdated: (todo: Todo) => void;
  onTodoDeleted: (id: string) => void;
  onError: (message: string | null) => void;
};

export default function TodoList({
  todos,
  hasVisibleTodos,
  loading,
  error,
  filter,
  searchQuery,
  editingId,
  onToggle,
  onStartEditing,
  onCancelEditing,
  onTodoUpdated,
  onTodoDeleted,
  onError,
}: TodoListProps) {
  return (
    <div className="task-list" aria-live="polite">
      {loading && <p>Loading todos...</p>}
      {error && <p role="alert">{error}</p>}

      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          isEditing={editingId === todo._id}
          onToggle={onToggle}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onTodoUpdated={onTodoUpdated}
          onTodoDeleted={onTodoDeleted}
          onError={onError}
        />
      ))}

      {!hasVisibleTodos && (
        <TodoEmptyState filter={filter} searchQuery={searchQuery} />
      )}
    </div>
  );
}
