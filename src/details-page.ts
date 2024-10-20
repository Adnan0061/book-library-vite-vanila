const baseUrl = "https://gutendex.com/books";

const detailsPage = (bookId: string) => {
  const appDom = document.querySelector<HTMLDivElement>("#app")!;

  appDom.innerHTML = `
    <main class="container">
      <h1 class="main-title">Book Details</h1>
      <div id="book-details" class="book-details">
        <!-- Book details will be dynamically added here -->
      </div>
    </main>
  `;

  // fetch book details from API
  const fetchBookDetails = async (id: string) => {
    const bookDetailsDom = document.getElementById("book-details");

    try {
      if (bookDetailsDom) {
        bookDetailsDom.innerHTML =
          '<p class="text-center">Loading book details...</p>';
      }
      const response = await fetch(`${baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const book = await response.json();
      if (bookDetailsDom) {
        bookDetailsDom.innerHTML = ""; // Clear the loading message
      }
      return book;
    } catch (error) {
      if (bookDetailsDom) {
        bookDetailsDom.innerHTML =
          '<p class="text-center text-red-500">Error loading book details. Please try again later.</p>';
      }
      throw error;
    }
  };

  // toggle wishlist function
  const toggleWishlist = (bookId: string) => {
    const wishlistBtnDom = document.getElementById(`wishlist-btn-${bookId}`);
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.includes(bookId)) {
      wishlist.push(bookId);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      wishlistBtnDom!.children[0].setAttribute("fill", "red");
    } else {
      const updatedWishlist = wishlist.filter((id: string) => id !== bookId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      wishlistBtnDom!.children[0].setAttribute("fill", "none");
    }
  };
  (window as any).toggleWishlist = toggleWishlist;

  // render book details to the DOM
  const renderBookDetails = (book: any) => {
    const bookDetailsDom = document.getElementById("book-details");
    if (!book) {
      console.error("No book details found");
      return;
    }

    const bookElement = document.createElement("div");
    bookElement.classList.add("book-detail-card");
    bookElement.innerHTML = `
      <div class="book-cover-container">
        <div class="book-cover-wrapper">
          <img src="${book.formats["image/jpeg"]}" alt="${
      book.title
    }" class="book-cover">
        </div>
        <div class="book-info">
            <h2 class="book-title">${book.title}</h2>
            <p class="book-authors">
            By ${book.authors
              .map((author: { name: string }) => author.name)
              .join(", ")}
            </p>
            <p class="book-genre"><span class="sub-heading">Genre:</span> ${
              book.bookshelves
                .slice(0, 3)
                .map((genre: string) => genre.replace(/^Browsing: /, ""))
                .join(", ") || "N/A"
            }</p>
            <p class="book-id"><span class="sub-heading">ID:</span> ${
              book.id
            }</p>
            <p class="book-languages"><span class="sub-heading">Languages:</span> ${book.languages.join(
              ", "
            )}</p>
            <p class="book-download-count"><span class="sub-heading">Download Count:</span> ${
              book.download_count
            }</p>
            <div class="book-actions">
                <button class="wishlist-btn" id="wishlist-btn-${
                  book.id
                }" onclick="toggleWishlist('${book.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="${
                      (localStorage.getItem("wishlist") ?? "[]").includes(
                        book.id
                      )
                        ? "red"
                        : "none"
                    }" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        </div>
      </div>
      
      <div class="book-description">
        <h3>Description</h3>
        <p>${book.description || "No description available."}</p>
      </div>
      <div class="book-download">
        <h3>Download</h3>
        <ul>
          ${Object.entries(book.formats)
            .map(
              ([format, url]) =>
                `<li><a href="${url}" target="_blank">${format}</a></li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    bookDetailsDom!.appendChild(bookElement);
  };
  (window as any).renderBookDetails = renderBookDetails;

  // initialize the app
  const appendBooks = async () => {
    const book = await fetchBookDetails(bookId);
    renderBookDetails(book);
  };

  appendBooks();
};

export default detailsPage;
