// Lien api
const apiUrl = "http://localhost:5678/api";

// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modalsSuppr");
const openGalleryModalBtn = document.querySelector("#projectEdit");
const closeGalleryModalBtn = document.querySelector("#fermer-suppr");
const deleteWorksBtn = document.querySelector("#supprgalerie");

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
const uploadUnit = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#validerAjout");

const addProjectForm = document.querySelector("#ajout-form");

// Autres variables 
let tempImage;
let formDataArray = [];
let modifiedWorks = [];
const galleryModal = document.getElementsByClassName("gallerymodal")[0];

// Bouton pour appliquer les changements
const publishChangesBtn = document.querySelector("#changements");

// Récupération des données pour la galerie modal
async function getAllWorks(){
    try {
        let res = await fetch(apiUrl + "/works");
        return await res.json();
    } catch (error) {
        console.log(error);
    }
} 

// Initialisation des données  
async function initializeWorks() {
    works = await getAllWorks();
    works.forEach((work) => {
    let tempWork = {
        id: work.id,
        imageUrl: work.imageUrl,
        title: work.title,
        categoryId: work.category.id,
        method: "INITIAL",
    };
    modifiedWorks.push(tempWork);
});
}
initializeWorks();

function renderModalGallery() {
    let html = "";
    let htmlSegment = "";
    let imageUrl = "";
    modifiedWorks.forEach((modifiedWork) => {
        if (modifiedWork.method != "DELETE") {
        imageUrl = modifiedWork.imageUrl.replace(
            "http://localhost:5678",
            "../Backend"
        );
        htmlSegment =
            '<figure> <img src="' +
            imageUrl +
            '"alt="' +
            modifiedWork.title +
            '"> <figcaption> éditer </figcaption> <input type="checkbox" class="deleteCheckbox" id="' +
            modifiedWork.id + 
            '"> <i class="fa-solid fa-trash-can"> </i></figure>';
        html += htmlSegment;
        }
    });
    galleryModal.innerHTML = html;
}
  
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

// Supprimer un projet
function deleteWork(index) {
    for (let i = 0; i < modifiedWorks.length; i++) {
      if (modifiedWorks[i].id == index) {
        modifiedWorks[i].method = "DELETE";
      }
    }
}

async function DELETEWork(work) {
    try {
        await fetch(apiUrl + "/works/" + work.id, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (response.ok) {
                elements.forEach(elements => {
                    elements.remove();
                });
            }
        })
        .catch(error => {
            throw new Error(error);
        });
    } catch(error) {
        console.log(error)
    }
}

galleryModal.onclick = function () {
    console.log("cliked");
  let deleteCheckbox = document.getElementsByClassName("deleteCheckbox");
  for (let i = 0; i < deleteCheckbox.length; i++) {
    if (deleteCheckbox[i].checked) {
      console.log("cliked2");
      deleteWork(deleteCheckbox[i].id);
    }
  }
  //
  let fff = modifiedWorks.length - 1;
  console.log(modifiedWorks, modifiedWorks[fff].id);
  //
  renderModalGallery();
};

deleteWorksBtn.onclick = function () {
  for (let i = 0; i <= modifiedWorks.length; i++) {
    deleteWork(modifiedWorks[i].Id);
  }
  renderModalGallery();
};

// Ajout des photos
function addNewWork(inputPhoto, inputTitle, inputCategory) {
    let worksLenght = modifiedWorks.length - 1;
    let inputId = modifiedWorks[worksLenght].id + 1;
    let tempWork = {
      id: inputId,
      imageUrl: inputPhoto,
      title: inputTitle,
      categoryId: inputCategory,
      method: "POST",
    };
    modifiedWorks.push(tempWork);
}

function pushIntoFormDataArray(tempFormData) {
    let worksLenght = modifiedWorks.length - 1;
    let inputId = modifiedWorks[worksLenght].id;
    tempFormData.append("image", tempImage);
    tempFormData.append("id", inputId);
    formDataArray.push(tempFormData);
}

uploadImageInput.addEventListener("change", function () {
    uploadImage();
});

function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = e => {
            image.src = e.target.result;
            image.alt = fileName.split(".")[0];
        };

        uploadUnit.style.display = "none";
        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
    tempImage = uploadImageInput.files[0];
}

async function POSTWork(work) {
    let counter = 0;
    for (let i = 0; i < formDataArray.length; i++) {
    if (work.id == formDataArray[i].get("id")) {
        counter = i;
        formDataArray[i].delete("id");
        }
    }
    try {
        await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "*/*",
        },
        body: formDataArray[counter],
        });
    } catch (error) {
    console.log(error);
    }
}

addProjectForm.addEventListener("submit", function(event) {
    console.log("clicked");
    event.preventDefault();

    let title = getTitle();
    let categoryId = getCategoryId();
    let imageUrl = localStorage.getItem("imgUrl");
    imageUrl = imageUrl.replaceAll('"', "");
    if (title != "" && imageUrl != "") {
        tempFormData = new FormData(this);
        addNewWork(imageUrl, title, categoryId);
        pushIntoFormDataArray(tempFormData);
    }
});

// Appliquer les changements 
async function applyChanges() {
    modifiedWorks.forEach((modifiedWork) => {
      if (modifiedWork.method == "POST") {
        POSTWork(modifiedWork);
      } else if (modifiedWork.method == "DELETE") {
        DELETEWork(modifiedWork);
      }
    });
}

publishChangesBtn.onclick = function() {
    applyChanges();
};