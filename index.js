// Get the search input element...
let input = document.getElementById("keyword");
let searchForm = document.getElementById("search-form");

// Check if the favorites List exists in localStorage, if not, initialize it as an empty array...
if (localStorage.getItem("favoritesList") == null) {
    localStorage.setItem("favoritesList", JSON.stringify([]));
}

// Event handler for keyup event for search bar...
input.addEventListener('keyup', showMeals);

// Event handler for submit event for search bar...
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  showMeals();
});

// Check if there is a keyword in the input box when the page loads...
window.addEventListener('load', function() {
  let inputKeyword = document.getElementById("keyword").value.trim();
  if (inputKeyword !== "") {
    // Fire the submit event to display the search results
    searchForm.dispatchEvent(new Event('submit'));
  }
});

// Function to fetch meals from the API
async function fetchMealsFromApi(url, keyword) {
  const response = await fetch(url + keyword);
  if (!response.ok) {
    throw new Error('Failed to fetch meals from the API');
  }
  const data = await response.json();
  return data;
}

// Display the searched meal...
function showMeals() {
    let inputKeyword = document.getElementById("keyword").value.trim();
    let arr = JSON.parse(localStorage.getItem("favoritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";

    let meals = fetchMealsFromApi(url, inputKeyword);
    meals.then((data) => {
      if (data.meals) {
        console.log(data.meals);
        data.meals.forEach((element) => {
          let isFav = false;
          for (let index = 0; index < arr.length; index++) {
            if (arr[index] == element.idMeal) {
              isFav = true;
            }
          }
          if (isFav) {
            html += `
              <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title ">${element.strMeal}</h5>
                  <div class="d-flex justify-content-between mt-4">
                      <button type="button" class="btn btn-warning" onclick="showMealsDetails(${element.idMeal})">Recipe</button>
                      <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                  </div>
                </div>
              </div>
            `;
          } else {
            html += `
              <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${element.strMeal}</h5>
                  <div class="d-flex justify-content-between mt-4">
                    <button type="button" class="btn btn-warning" onclick="showMealsDetails(${element.idMeal})">Recipe</button>
                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                  </div>
                </div>
              </div>
            `;
          }
        });
      } else {
        html += `
          <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                  <div class="mb-4 lead white">
                       "Sorry, we didn't find any meal!"
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }
      document.getElementById("recipe-list").innerHTML = html;
    });
}

// Display full meal details in the main section...
async function showMealsDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  let queryParams = new URLSearchParams(window.location.search);
  let keyword = queryParams.get('keyword');
  console.log("showMealsDetails", keyword);
  console.log("id", id);

  await fetchMealsFromApi(url, id).then(data => {
      html += `
          <div class="container py-3">
              <div class="card p-lg-5 p-md-2">
                  <div class="row">
                      <div class="col-md-4 align-self-center">
                          <img src="${data.meals[0].strMealThumb}" class="w-100">
                      </div>
                      <div class="col-md-8 px-3 align-self-center">
                          <div class="card-block px-3">
                              <div id="heading" class="text-center"></div>
                              <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                              <p id="category">Category: ${data.meals[0].strCategory}</p>
                              <p id="area">Area: ${data.meals[0].strArea}</p>
                              <h5>Instruction:</h5>
                              <p class="card-text" id="recipe-intro">${data.meals[0].strInstructions}</p>
                              <div class="d-flex justify-content-between mt-5 mb-4">
                                   <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-warning">Video</a>
                                   <a href="#recipe-list" onclick="showMeals()" class="btn btn-warning">Close</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
  });
  document.getElementById("recipe-list").innerHTML = html;
}


// Show all favorite meals in the favorites body...
async function  showFavMeals() {
  console.log("hello");
  console.log(localStorage.getItem("favoritesList"));
  let arr = JSON.parse(localStorage.getItem("favoritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
      html += `
          <div class="page-wrap d-flex flex-row align-items-center">
              <div class="container">
                  <div class="row justify-content-center">
                      <div class="col-md-12 text-center">
                          <div class="mb-4 lead heading2 white">
                                 Your favorites list is empty!
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `;
  } else {
      for (let index = 0; index < arr.length; index++) {
          await fetchMealsFromApi(url, arr[index]).then(data => {
              html += `
                  <div id="card" class="card mt-3 mb-3" style="width: 20rem;">
                      <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                      <div class="card-body">
                          <h5 class="card-title">${data.meals[0].strMeal}</h5>
                          <div class="d-flex justify-content-between mt-4">
                              <button type="button" class="btn btn-warning" onclick="showFavMealDetails(${data.meals[0].idMeal})">Recipe</button>
                              <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa fa-trash" aria-hidden="true"></i>
                              </button>
                          </div>
                      </div>
                  </div>
              `;
          });
      }
  }
  document.getElementById("favorite-list").innerHTML = html;
}

// Show full meal details of a favorite...
async function showFavMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    let queryParams = new URLSearchParams(window.location.search);
    let keyword = queryParams.get('keyword');
    console.log("showFavMealsDetailskeyword" ,keyword);

    await fetchMealsFromApi(url, id).then(data => {
        html += `
            <div class="container py-3">
                <div class="card p-lg-5 p-md-2">
                    <div class="row">
                        <div class="col-md-4 align-self-center">
                            <img src="${data.meals[0].strMealThumb}" class="w-100">
                        </div>
                        <div class="col-md-8 px-3 align-self-center">
                          <div class="card-block px-3">
                              <div id="heading" class="text-center"></div>
                              <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                              <p id="category">Category: ${data.meals[0].strCategory}</p>
                              <p id="area">Area: ${data.meals[0].strArea}</p>
                              <h5>Instruction:</h5>
                              <p class="card-text" id="recipe-intro">${data.meals[0].strInstructions}</p>
                              <div class="d-flex justify-content-between mt-5 mb-4">
                                  <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-warning">Video</a>
                                  <a href="#favorite-list" onclick="showFavMeals()" class="btn btn-warning">Close</a>
                              </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById("favorite-list").innerHTML = html;
}

// Add or remove a meal from the favorites list...
function addRemoveToFavList(id) {
    let arr = JSON.parse(localStorage.getItem("favoritesList"));
    let contain = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contain = true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Your meal has been removed from your favorites list.");
    } else {
        arr.push(id);
        alert("Your meal has been added to your favorites list.");
    }
    localStorage.setItem("favoritesList", JSON.stringify(arr));
    showFavMeals();
    showMeals();
}

