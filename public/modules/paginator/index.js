class Paginator {
  constructor({
    dataSource,
    pageSize = 10,
    renderContent,
    renderPagination,
    containerId,
    paginationId
  }) {
    this.dataSource = dataSource;  // Data source is the entire dataset, not a backend API call
    this.pageSize = pageSize;
    this.renderContent = renderContent;
    this.renderPagination = renderPagination;
    this.currentPage = 1;
    this.containerId = containerId || '#data-container';
    this.paginationId = paginationId || '#pagination-container';
  }

  init() {
    this.totalPages = Math.ceil(this.dataSource.length / this.pageSize);
    this.renderPagination(this.totalPages, this.currentPage, this);
    this.goToPage(this.currentPage);
  }

  goToPage(pageNumber) {
    this.currentPage = pageNumber;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedData = this.dataSource.slice(start, end); // Paginate the local data
    this.renderContent(paginatedData);
    this.renderPagination(this.totalPages, this.currentPage, this);
  }
}

export default Paginator;
