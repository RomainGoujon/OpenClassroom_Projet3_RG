// Lien api
const apiUrl = "http://localhost:5678/api";

// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modalsSuppr");
const openGalleryModalBtn = document.querySelector("#projectEdit");
const closeGalleryModalBtn = document.querySelector("#fermer-suppr");

// Variables pour la modal ajout de projets
const modalAddWork = document.querySelector("#modalsAjout");
const openAddWork = document.querySelector("#AjoutPhoto");
const previousBtn = document.querySelector(".precedent");
const closeAddWorkModalBtn = document.querySelector("#fermer-ajout")

// Variable pour background modal
const backgroundModal = document.querySelector("#modals");

// Variables pour upload une image
const uploadImageInput = document.querySelector("#imageUpload");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#validerAjout");

const addProjectForm = document.querySelector("#ajout-form");

// Bouton pour appliquer les changements
const publishChangesBtn = document.querySelector("#changements");

// Fonction pour ouvrir modal galerie pour supprimer un projet et celle pour ajouter un projet
function openGalleryModal() {
    modalDeleteWork.style.display = "flex";
    backgroundModal.style.display = "block";
    renderModalGallery();
}

function openAddWorkModal() {
    modalAddWork.style.display = "flex";
    backgroundModal.style.display = "block";
}

// Fonction pour fermeture des modals
function closeGalleryModal() {
    modalDeleteWork.style.display = "none";
    backgroundModal.style.display = "none";
}

function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backgroundModal.style.display = "none";
}

// Ouvrir les modals
if (openGalleryModalBtn) openGalleryModalBtn.addEventListener("click", openGalleryModal);
if (openAddWork) openAddWork.addEventListener("click", function() {
    closeGalleryModal();
    openAddWorkModal();
})

// Fermer les modals et précédent
closeGalleryModalBtn.addEventListener("click", closeGalleryModal);
closeAddWorkModalBtn.addEventListener("click", closeAddWorkModal);

previousBtn.addEventListener("click", function() {
    closeAddWorkModal();
    openGalleryModal();
    renderModalGallery();
});

window.onclick = function (event) {
    if (event.target == backgroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
    }
}

// Variable pour controler les ajouts ou suppression
let action = null;

// Supprimer des photos
async function deleteWork(id) {
    const response = await fetch(apiUrl + "/works/{id}", {
        method: "DELETE",
        headers: {
            Accept: "*/*",
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
    console.log(response);
    if (response.ok) {
    // Supprimer l'élément correspondant dans le DOM
        const element = document.querySelector(`[data-id="${id}"]`);
        element.remove();
        action = "delete";
    } else {
        console.log(`Erreur lors de la suppression du travail avec ID ${id}`);
    }
}

// Fonction pour envoyer les données de la photo
async function sendWorkData(data) {
    console.log("avant envoie api");
    const response = await fetch(apiUrl + "/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        body: data,
    });
    console.log("Apres reponse api");
    return response.json();
}

// Fonction pour gérer l'envoi du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis
    if (!addProjectForm.checkValidity()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire
    const title = addProjectForm.querySelector("#titreAjout").value;
    const category = addProjectForm.querySelector("#selectCategorie").value;
    const file = uploadImageInput.files[0];

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoyer les données et afficher la réponse
    try {
        const response = await sendWorkData(formData);
        console.log(response);
        action = "add";
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Ajout des événements pour gérer l'upload de photos
uploadImageInput.addEventListener("change", function () {
    uploadImage();
});

addProjectForm.addEventListener("submit", handleFormSubmit);

// Fonction pour afficher l'aperçu de l'image
function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        uploadContent .style.display = "none";
        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}

// Bouton pour publier les changements sur le site
publishChangesBtn.addEventListener("click", function(event) {
    event.preventDefault();

    if (action === "delete") {
        deleteChanges();
    } else if (action === "add") {
        addChanges();
    }

    closeAddWorkModal();
    closeGalleryModal();
});