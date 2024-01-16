import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify, renderLoader, renderResults } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";
import { v4 } from "https://jspm.dev//uuid";

//clasın örneğini oluşturma
const search = new Search();
const recipe = new Recipe();

//!olay izleyicileri

document.addEventListener("DOMContentLoaded", () => {
  const index = Math.floor(Math.random() * categories.length);
  getResults(categories[index]);
});

ele.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target[0].value;
  getResults(query);
});

window.addEventListener("DOMContentLoaded", () => {
  renderBasketItems();
  controlUrl();
});

window.addEventListener("hashchange", controlUrl);

ele.recipe_area.addEventListener("click", handleClick);

//!fonksiyonlar
//arama sonuçlarını alır ekrana basar

async function getResults(query) {
  // arama terimi var mı kontrol et
  if (!query.trim()) {
    return notify("Arama terimi giriniz!");
  }

  // loader bas
  renderLoader(ele.result_list);

  try {
    await search.fetchResults(query.trim());

    if (search.results.error) {
      notify("Aradığınız tarif bulunamadı");

      ele.result_list.innerHTML = "";
    } else {
      renderResults(search.results.recipes);
    }
  } catch (err) {
    notify("Bir sorun oluştu");

    ele.result_list.innerHTML = "";
  }
}

async function controlUrl() {
  const id = location.hash.slice(1);
  if (id) {
    renderLoader(ele.recipe_area);

    await recipe.getRecipe(id);

    recipe.renderRecipe(recipe.info);
  }
}

let basket = JSON.parse(localStorage.getItem("basket")) || [];

function handleClick(e) {
  if (e.target.id === "add-to-cart") {
    recipe.info.ingredients.forEach((title) => {
      const newItem = {
        id: v4(),
        title,
      };
      basket.push(newItem);
    });
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketItems();
  }
}

function renderBasketItems() {
  ele.basket_list.innerHTML = basket
    .map(
      (i) => `
  <li data-id="${i.id}">
    <i id="delete-item" class="bi bi-x"></i>
    <span>${i.title}</span>
  </li>
  `
    )
    .join(" ");
}

ele.clear_btn.addEventListener("click", () => {
  const res = confirm("Sepet temizlenecek emin misiniz?");

  if (res) {
    basket = [];
    localStorage.removeItem("basket");
    ele.basket_list.innerHTML = "";
  }
});

ele.basket_list.addEventListener("click", (e) => {
  if (e.target.id == "delete-item") {
    const parent = e.target.parentElement;
    const id = parent.dataset.id;

    basket = basket.filter((i) => i.id !== id);
    localStorage.setItem("basket", JSON.stringify(basket));
    parent.remove();
  }
});
