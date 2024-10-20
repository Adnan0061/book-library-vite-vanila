import homePageContent from "./home-page/home-page";
import wishlistPageContent from "./wishlist-page/wishlist-page";
import detailsPageContent from "./details-page";

function router() {
  const path = window.location.pathname;
  if (path == "/") return homePageContent();
  if (path == "/wishlist") return wishlistPageContent();
  if (path.includes("/book/"))
    return detailsPageContent(path.split("/book/")[1]);
  return notFoundContent();
}

function notFoundContent() {
  return "<h1>404 - Page Not Found</h1>";
}

export default router;
