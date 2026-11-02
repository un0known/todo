import type { Todo, TodoFilter } from "@/types/todo";

type TodoToolbarProps = {
  filter: TodoFilter;
  searchQuery: string;
  pageSize: number;
  pageSizeOptions: number[];
  todos: Todo[];
  onFilterChange: (filter: TodoFilter) => void;
  onSearchChange: (query: string) => void;
  onPageSizeChange: (pageSize: number) => void;
  onTodosChange: (todos: Todo[]) => void;
  onPageReset: () => void;
};

const filters: TodoFilter[] = ["all", "active", "completed"];

export default function TodoToolbar({
  filter,
  searchQuery,
  pageSize,
  pageSizeOptions,
  todos,
  onFilterChange,
  onSearchChange,
  onPageSizeChange,
  onTodosChange,
  onPageReset,
}: TodoToolbarProps) {
  function changeFilter(nextFilter: TodoFilter) {
    onFilterChange(nextFilter);
    onPageReset();
  }

  function changeSearch(query: string) {
    onSearchChange(query);
    onPageReset();
  }

  function changePageSize(size: number) {
    onPageSizeChange(size);
    onPageReset();
  }

  function clearCompleted() {
    onTodosChange(todos.filter((todo) => !todo.completed));
    onPageReset();
  }

  return (
    <div className="toolbar">
      <div className="toolbar-browse">
        <label className="todo-search">
          <span className="visually-hidden">Search tasks</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Search tasks..."
          />
        </label>
        <div className="filters" aria-label="Filter tasks">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              className={filter === option ? "filter active" : "filter"}
              onClick={() => changeFilter(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="toolbar-actions">
        <label className="page-size-control" htmlFor="page-size">
          <span>Show</span>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => changePageSize(Number(event.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </label>
        {todos.some((todo) => todo.completed) && (
          <button
            className="clear-button"
            type="button"
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
