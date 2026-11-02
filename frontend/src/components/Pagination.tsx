// Inputs supplied by the todo page; page changes are handled by its state.
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Hide navigation when every todo fits on one page.
  if (totalPages <= 1) return null;

  // Keep the first, last, and nearby pages visible; skipped ranges become ellipses.
  const pages = new Set<number>([1, totalPages]);
  console.log("pages = ", pages)
  for (
    let page = Math.max(1, currentPage - 1);
    page <= Math.min(totalPages, currentPage + 1);
    page += 1
  ) {
    pages.add(page);
  }

  const visiblePages = [...pages].sort((a, b) => a - b);
  console.log("visiblePages = ",visiblePages)

  // Buttons call the parent callback; disabled bounds prevent invalid navigation.
  return (
    <nav className="pagination" aria-label="Todo list pages">
      <button
        className="pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination-pages">
        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const hasGap = previousPage !== undefined && page - previousPage > 1;

          return (
            <span className="pagination-page-group" key={page}>
              {hasGap && (
                <span className="pagination-ellipsis" aria-hidden="true">
                  ...
                </span>
              )}
              <button
                className={
                  page === currentPage
                    ? "pagination-page active"
                    : "pagination-page"
                }
                type="button"
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </span>
          );
        })}
      </div>

      <button
        className="pagination-button"
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}
