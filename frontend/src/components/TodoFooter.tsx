type TodoFooterProps = {
  totalCount: number;
  completedCount: number;
};

export default function TodoFooter({
  totalCount,
  completedCount,
}: TodoFooterProps) {
  return (
    <footer className="app-footer">
      <span>{totalCount} total</span>
      <span>{completedCount} completed</span>
    </footer>
  );
}
