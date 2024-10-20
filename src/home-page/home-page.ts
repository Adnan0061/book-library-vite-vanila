import "../style.css";
const baseUrl = "https://gutendex.com/books";
const formatedUrl = new URL(baseUrl);

const homePage = () => {
  const appDom = document.querySelector<HTMLDivElement>("#app")!;

  appDom.innerHTML = `
    <main class="container">
    <h1 class="main-title">Home</h1>

    <div class="search-filter">
        <input
          type="text"
          id="search"
          placeholder="Search books..."
          class="search-input"
        />
        <select id="genre-filter" class="genre-filter">
          <option value="">All Genres</option>
          <option value="Culture/Civilization/Society">Culture/Civilization/Society</option>
          <option value="Fiction">Fiction</option>
          <option value="Gender & Sexuality Studies">Gender & Sexuality Studies</option>
          <option value="Literature">Literature</option>
          <option value="Science-Fiction & Fantasy">Science-Fiction & Fantasy</option>
          <option value="Literature">Literature</option>
          <option value="Literature">Literature</option>
          <option value="Literature">Literature</option>
          <option value="Literature">Literature</option>
          <option value="Literature">Literature</option>
        </select>
        
        <select id="sort-filter" class="genre-filter">
          <option value="popular">popular</option>
          <option value="ascending">ascending</option>
          <option value="descending">descending</option>
        </select>
        <button id="save-filter-btn" class="save-filter-btn" onclick="saveFilters()">Save Filters</button>
    </div>

    <div id="book-list" class="book-list">
        <!-- Books will be dynamically added here -->
    </div>

    <div id="pagination" class="pagination">
        <!-- Pagination controls will be added here -->
    </div>
    </main>
`;

  // filter callback
  const filterCallback = async () => {
    const searchInputDom = document.getElementById("search");
    const topicFilterDom = document.getElementById("genre-filter");
    const sortFilterDom = document.getElementById("sort-filter");
    // const saveFilterDom = document.getElementById("save-filter-btn");

    // books update function
    const updateBooks = async (url: string) => {
      const updatedBooks = await fetchBooks(url);
      renderBooks(updatedBooks, url);
    };

    // search event listener
    searchInputDom!.addEventListener("input", async (e) => {
      const newSearchValue = (e.target as HTMLInputElement).value;
      formatedUrl.searchParams.set("search", newSearchValue);
      // console.log(newSearchValue);
      updateBooks(formatedUrl.toString());
    });

    // genre filter event listener
    topicFilterDom!.addEventListener("change", async (e) => {
      const newTopicValue = (e.target as HTMLInputElement).value;
      formatedUrl.searchParams.set("topic", newTopicValue);
      // console.log(newTopicValue);
      updateBooks(formatedUrl.toString());
    });

    // sort filter event listener
    sortFilterDom!.addEventListener("change", async (e) => {
      const newSortValue = (e.target as HTMLInputElement).value;
      formatedUrl.searchParams.set("sort", newSortValue);
      // console.log(newSortValue);
      updateBooks(formatedUrl.toString());
    });
  };

  const saveFilters = () => {
    console.log("save filters");
    const filterParam = formatedUrl.search;
    console.log(filterParam);
    localStorage.setItem("filterParam", filterParam);
  };
  (window as any).saveFilters = saveFilters;

  // next page function
  const nextPage = async (currentUrl: string, nextPageUrl: string) => {
    console.log(currentUrl, nextPageUrl);
    const updatedBooks = await fetchBooks(nextPageUrl);
    renderBooks(updatedBooks, nextPageUrl);
  };
  (window as any).nextPage = nextPage;

  // previous page function
  const previousPage = async (currentUrl: string, previousPage: string) => {
    console.log(currentUrl, previousPage);
    const updatedBooks = await fetchBooks(previousPage);
    renderBooks(updatedBooks, previousPage);
  };
  (window as any).previousPage = previousPage;

  // go to page function
  const goToPage = async (currentUrl: string, pageNumber: string) => {
    console.log(currentUrl, previousPage);
    const url = new URL(currentUrl);
    url.searchParams.set("page", pageNumber.toString());
    console.log("url", url);
    const updatedBooks = await fetchBooks(url.toString());
    renderBooks(updatedBooks, url.toString());
  };
  (window as any).goToPage = goToPage;

  // fetch books from API
  const fetchBooks = async (url: string) => {
    const bookListDom = document.getElementById("book-list");

    try {
      if (bookListDom) {
        bookListDom.innerHTML = '<p class="text-center">Loading books...</p>';
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const books = await response.json();
      if (bookListDom) {
        bookListDom.innerHTML = ""; // Clear the loading message
      }
      return books;
    } catch (error) {
      // console.error("Error fetching books:", error);
      if (bookListDom) {
        bookListDom.innerHTML =
          '<p class="text-center text-red-500">Error loading books. Please try again later.</p>';
      }
      throw error;
    }
  };

  // toggle wishlist function
  const toggleWishlist = async (bookId: string) => {
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

  // render books to the DOM
  const renderBooks = (books: any, currentUrl: string) => {
    const bookListDom = document.getElementById("book-list");
    const paginationDom = document.getElementById("pagination");
    if (!books) {
      console.error("No book list found");
      return;
    }

    // current page
    const searchParams = new URL(currentUrl).searchParams;
    const currentPage = searchParams.get("page");

    // total pages
    const pageCount = Math.ceil(books.count / 32);
    const pagination = () => {
      const currentPageNum = parseInt(currentPage || "1", 10);
      const visiblePages = 4;
      const halfVisible = Math.floor(visiblePages / 2);

      let startPage = Math.max(currentPageNum - halfVisible, 1);
      let endPage = Math.min(startPage + visiblePages - 1, pageCount);

      if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(endPage - visiblePages + 1, 1);
      }

      const pageButtons = [];

      if (startPage > 1) {
        pageButtons.push(
          `<button id="page-1" onclick="goToPage('${currentUrl}', 1)">1</button>`
        );
        if (startPage > 2) {
          pageButtons.push("<span>...</span>");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(`
    <button 
      id="page-${i}" 
      onclick="goToPage('${currentUrl}', ${i})"
      ${currentPageNum === i ? "class='active-pagination'" : ""}
    >
      ${i}
    </button>`);
      }

      if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
          pageButtons.push("<span>...</span>");
        }
        pageButtons.push(
          `<button id="page-${pageCount}" onclick="goToPage('${currentUrl}', ${pageCount})">${pageCount}</button>`
        );
      }

      return pageButtons.join("");
    };

    books.results.forEach((book: any) => {
      const bookElementDom = document.createElement("div");
      bookElementDom.classList.add("book-card");
      bookElementDom.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}"
      class="book-cover">
      <div class="book-info">
        <h2 class="book-title">${book.title}</h2>
        <p class="book-authors">
          By ${book.authors
            .map((author: { name: string }) => author.name)
            .join(",")}
        </p>
        <p class="book-genre"><span id="sub-heading">Genre:</span> ${
          book.bookshelves
            .slice(0, 3)
            .map((genre: string) => genre.replace(/^Browsing: /, ""))
            .join(", ") || "N/A"
        }</p>
        <p class="book-id"><span id="sub-heading">ID:</span> ${book.id}</p>
        <div class="book-actions">
          <button class="wishlist-btn" id="wishlist-btn-${
            book.id
          }" onclick="toggleWishlist('${book.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="${
              (localStorage.getItem("wishlist") ?? "[]").includes(book.id)
                ? "red"
                : "none"
            }" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <a class="details-btn" href='/book/${book.id}'>View Details</a>
        </div>
      </div>
    `;
      bookListDom!.appendChild(bookElementDom);
    });

    paginationDom!.innerHTML = `
        ${
          !!books.previous
            ? `<button id="previous-page" onclick="previousPage('${currentUrl}','${books.previous}')">Previous</button>`
            : ""
        }
        ${pagination()}
        ${
          books.next
            ? `<button id="next-page" onclick="nextPage('${currentUrl}','${books.next}')">Next</button>`
            : ""
        }
        `;
  };

  // initialize the app
  const appendBooks = async () => {
    const searchInputDom = document.getElementById("search");
    const topicFilterDom = document.getElementById("genre-filter");
    const sortFilterDom = document.getElementById("sort-filter");

    const filterParam = localStorage.getItem("filterParam");
    formatedUrl.search = filterParam || "";
    const searchValue = formatedUrl.searchParams.get("search");
    const topicValue = formatedUrl.searchParams.get("topic");
    const sortValue = formatedUrl.searchParams.get("sort");
    if (searchInputDom)
      (searchInputDom as HTMLInputElement).value = searchValue || "";
    if (topicFilterDom)
      (topicFilterDom as HTMLSelectElement).value = topicValue || "";
    if (sortFilterDom)
      (sortFilterDom as HTMLSelectElement).value = sortValue || "";
    const books = await fetchBooks(formatedUrl.toString());
    renderBooks(books, baseUrl);
  };

  appendBooks();
  filterCallback();
};

export default homePage;
