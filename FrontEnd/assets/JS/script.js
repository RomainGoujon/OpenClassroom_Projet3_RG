// Lien serveur pour page HTML
const worksURL = "http://localhost:5678/api/works";
const categoriesURL = "http://localhost:5678/api/categories";

// Variable communeconst
const gallery = document.getElementsByClassName("gallery")[0];
let works;

// Suppression des tous les projets dans le DOM
function resetDOM(element) {
    element.replaceChildren();
}

// Récupération de tous les projets par le serveur
async function getWorks() {
    await fetch(worksURL)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        works = value;
        return works;
    })
    .catch(function(error) {
        console.log("Une erreur sur la récupération des travaux est survenue");
        console.log(error);
    });
}

// Ajout de tous les projets sur le DOM
function addAllWorks(works, element) {
    works.forEach(work => {
        addWork(work, element, work.title);
    });
}

// Ajout des projets sur le DOM
function addWork(works, element, title) {

    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    // Ajout des images et des titres sur le DOM
    element.appendChild(figure).appendChild(img)
    .setAttribute("src", works.imageUrl);

    img.setAttribute("alt", works.title);
    img.setAttribute("crossorigin", "anonymous");
    figure.appendChild(figcaption)
    .innerHTML = title;
    return figure;
}

// Récupération des catégories par le serveur
async function getCategories() {
    const categories = [];
     await fetch(categoriesURL)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        value.forEach(category => {
            categories.push(category);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
    return categories;
}

// Ajout des catégories sur le DOM
function addCategories(categories) {
    let button = document.createElement("button");
    let categoryElt = document.getElementsByClassName("filters")[0];
    document.getElementsByClassName("filters")[0]
    .appendChild(button)
    .setAttribute("data-id", 0);
    button.innerHTML = "Tous";

    for (let i = 0; i < categories.length; i++) {
        let button = document.createElement("button");
        categoryElt.appendChild(button).setAttribute('data-id', categories[i].id);
        button.innerHTML = categories[i].name;
    }
}

// Ajout des event listeners pour les catégories
function addEventToCategories(works, element) {
    document.querySelectorAll(".filters button")
    .forEach(filter => {
        filter.addEventListener('click', function(value) {
            let categoryId = value.target.dataset.id;
            categoryId = parseInt(categoryId);

            //filtres catégorie au click
            filtersCategories(works, categoryId, element);
        })
    });
}

// Ajout des filtres catégories
function filtersCategories(works, categoryId, element) {
    resetDOM(gallery);

    if (categoryId == 0) {
        addAllWorks(works, element);
    }
    else {
        works.forEach(work => {
        if (work["categoryId"] == categoryId) {
            addWork(work, element, work.title);
        }
        });
    }
}

// Execution des fonctions
const promiseWorks = getWorks()
.then(function() {
    addAllWorks(works, gallery);
    return works;
})

.then(function(works) {
    getCategories()
    .then(function(categories) {
        addCategories(categories);
        addEventToCategories(works, gallery);
    });
    return works;
})

.catch(function(error) {
    console.log(error);
});