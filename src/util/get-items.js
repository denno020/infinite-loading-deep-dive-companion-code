import { loadPage } from "../products.js";

const delay = 300;

export const getItems = ({ page }) => {
  return new Promise((res) => {
    setTimeout(() => {
      console.log(`API: getItems, page ${page}, loaded in ${delay}ms`);
      const products = loadPage(page);
      res({ items: products, totalPages: 10 });
    }, delay);
  })
}