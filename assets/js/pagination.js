let currentPage = 1;
const pageSize = 10;  // Customize page size

function paginateData(data) {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

function renderPaginationControls(totalItems) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginationContainer = document.getElementById('pagination');

  paginationContainer.innerHTML = '';  // Clear existing controls
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      renderGameList();  // Re-render the game list for the new page
    });
    paginationContainer.appendChild(pageButton);
  }
}
