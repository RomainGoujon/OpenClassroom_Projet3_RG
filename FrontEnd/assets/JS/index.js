// Lien serveur pour page HTML
const worksURL = "http://localhost:5678/api/works";
const categoriesURL = "http://localhost:5678/api/categories";

// Variable commune const
const gallery = document.getElementsByClassName("gallery")[0];
let works;
const galleryModal = document.querySelector(".gallerymodal");

// Suppression des tous les projets dans le DOM
function resetDOM(element) {
    element.replaceChildren();
}

// Récupération de tous les projets par le serveur
async function displayWork() {
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
const promiseWorks = displayWork()
.then(function() {
    addAllWorks(works, gallery);
    addAllWorks(works, galleryModal);
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

// Ajout des projets sur la boite modale
function addWorkModal(work, element) {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");
    let deleteBtn = document.createElement("i");

    // Ajout des images et des titres sur la boîte modale
    element.appendChild(figure).appendChild(img)
    .setAttribute("src", work.imageUrl);

    img.setAttribute("alt", work.title);
    img.setAttribute("crossorigin", "anonymous");
    figure.appendChild(figcaption)
    .innerHTML = work.title;

    // Ajout des boutons pour supprimer
    figure.appendChild(deleteBtn)
    deleteBtn.classList.add("delete-btn");
    deleteBtn.classList.add("fas");
    deleteBtn.classList.add("fa-trash-can");

    return figure;
}

async function renderModalGallery() {
    // Supprime les projets existants dans la boîte modale
    resetDOM(galleryModal);

    // Récupération des projets pour la galerie modale
    await fetch(worksURL)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(works) {
        works.forEach(work => {
            // Figure qui contient les projets
            let modalFigure = document.createElement("figure");
            modalFigure.setAttribute("data-id", work.id);

            // Image pour les projets
            let modalImg = document.createElement("img");
            modalImg.setAttribute("src", work.imageUrl);
            modalImg.setAttribute("alt", work.title);
            modalImg.setAttribute("crossorigin", "anonymous");

            // Ajout de l'image à la figure
            modalFigure.appendChild(modalImg);

            // Ajout de la légende à la figure 
            modalFigure.appendChild(document.createElement("figcaption")).innerHTML = "éditer";

            // Créer l'icone de la poubelle pour supprimer
            let trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can");
            modalFigure.appendChild(trashIcon);

            // Ajouter un événement de suppression de projet sur l'icône de la poubelle
            trashIcon.addEventListener("click", async function () {

                // Récupérer l'ID du projet en utilisant son attribut data-id
                const id = modalFigure.getAttribute("data-id");

                // Demander à l'utilisateur de confirmer la suppression
                if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {

                    // Supprimer le projet en utilisant son ID
                    await deleteWork(id);
                }
            });

            galleryModal.appendChild(modalFigure);
        });
    })
    .catch(function(error) {
        console.log(error);
    });
}
