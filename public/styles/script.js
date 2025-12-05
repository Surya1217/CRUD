document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("min-rating");
  const bookItems = Array.from(document.querySelectorAll(".book-item"));

  if (!filterSelect) return;

  filterSelect.addEventListener("change", () => {
    const min = parseInt(filterSelect.value, 10);

    bookItems.forEach(item => {
      const rating = parseInt(item.dataset.rating || "0", 10);
      if (rating >= min) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
});
