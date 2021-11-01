import { loadPage } from "../products.js";

export const getItems = ({ page }) => {
  console.log(`API: getItems, page ${page}`);
  return new Promise((res) => {
    setTimeout(() => {
      const products = loadPage(page);
      res({ items: products, totalPages: 10 });
    }, 300);
  })
}