export const ele = {
  form: document.querySelector("form"),
  result_list: document.querySelector("#results"),
  recipe_area: document.querySelector("#recipe"),
  like_list: document.querySelector(".dropdown"),
  basket_list: document.querySelector("#basket"),
  clear_btn: document.querySelector("#clear"),
};

export const notify = (text) => {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #fbda61, #ff5acd)",
    },
  }).showToast();
};

export const renderLoader = (outlet) => {
  outlet.innerHTML = `
    <div class="wrapper">
    <div class="loader">
    <div class="panWrapper">
    <div class="pan">
      <div class="food"></div>
      <div class="panBase"></div>
      <div class="panHandle"></div>
    </div>
    <div class="panShadow"></div>
  </div>
</div>
</div>

`;
};

export const renderResults = (results) => {
  ele.result_list.innerHTML = results
    .map(
      (recipe) => `
    <a href="#${recipe.recipe_id}">
          <div class="img-wrapper">
            <img
              src="${recipe.image_url}"
              alt=""
            />
          </div>
          <div class="info">
            <h4>${recipe.title}</h4>
            <p>${recipe.publisher}</p>
          </div>
        </a>`
    )
    .join("");
};
