type TodoHeaderProps = {
  activeCount: number;
};

export default function TodoHeader({ activeCount }: TodoHeaderProps) {
  return (
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
  );
}
