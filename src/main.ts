import router from "./router.ts";
import "./style.css";
// const baseUrl = "https://gutendex.com/books";

const bodyDom = document.querySelector<HTMLDivElement>("body")!;
// const appDom = document.querySelector<HTMLDivElement>("#app")!;

// main section
export default function main() {
  // header section
  bodyDom.insertAdjacentHTML(
    "afterbegin",
    `
  <header class="header">
    <div class="container header-content">
      <h1>Book Library</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/wishlist">Wishlist</a></li>
        </ul>
      </nav>
    </div>
  </header>
  `
  );

  // footer section
  bodyDom.insertAdjacentHTML(
    "beforeend",
    `
  <footer class="header">
    <div class="container header-content">
      <h1>Book Library</h1>
      <p>Developed by: 
        <a
          href="https://github.com/Adnan0061"
          target="_blank"
          rel="noopener noreferrer"
        >Adnan Ahmed</a>
      </p>
    </div>
  </footer>
  `
  );
}

// Initial route
router();

main();

// Handle navigation
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("popstate", router);
});

// Intercept link clicks

// document.body.addEventListener("click", (e) => {
//   if (e.target.matches("a")) {
//     e.preventDefault();
//     history.pushState(null, "", e.target.href);
//     router();
//   }
// });
