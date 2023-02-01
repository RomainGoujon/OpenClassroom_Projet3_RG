// Variables globales
const apiUrl = "http://localhost:5678/api";

// Variable pour les bouttons
const exitModalBtn = document.getElementsByClassName("fermer");
const returnModalBtn = document.getElementsByClassName("precedent")[0];
const deleteWorksBtn = document.getElementById("supprgalerie");
const submitWorkBtn = document.getElementById("validerAjout");
const workImageBtn = document.getElementById("imageUpload");
const modifyGalleryBtn = document.getElementsByClassName("modifier")[2];
const addWorkBtn = document.getElementById("AjoutPhoto");
const publishChangesBtn = document.getElementById("changements");

// Variable pour les contenants
const galleryContainer = document.getElementsByClassName("gallery")[0];
const modalGalleryContainer = document.getElementsByClassName("gallerymodal")[0];
const workImageDetailsContainer = document.getElementById("previewdetails");
const workImagePreviewContainer = document.getElementById("previewImage");
const modalAddWorks = document.getElementById("modalsAjout");
const modalDeleteWorks = document.getElementById("modalsSuppr");
const modalsContainer = document.getElementById("modals");

let works;
let modifiedWorks = [];

// Variable pour les images temporaire;
let tempImage;
let formDataArray = [];

// Récupération du token
function getToken() {
  return localStorage.getItem("token");
}

// Récupération des données
async function getAllWorks() {
  try {
    let res = await fetch(apiUrl + "/works");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

function getTitle() {
  return document.getElementById("titreAjout").value;
}

function getCategoryId() {
  return document.getElementById("selectCategorie").value;
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
  renderGallery();
}
initializeWorks();

// Modifs temporaires
function previewImg() {
  let files = workImageBtn.files[0];
  if (files) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
      workImagePreviewContainer.innerHTML = '<img src="' + this.result + '" />';
      window.sessionStorage.setItem("imgUrl", JSON.stringify(this.result));
    });
    workImageDetailsContainer.style.display = "none";
    workImagePreviewContainer.style.display = "block";
    submitWorkBtn.style.backgroundColor = "#1D6154";
  }
  tempImage = workImageBtn.files[0];
}

function deleteWork(index) {
  for (let i = 0; i < modifiedWorks.length; i++) {
    if (modifiedWorks[i].id == index) {
      modifiedWorks[i].method = "DELETE";
    }
  }
}

function addWork(inputPhoto, inputTitle, inputCategory) {
  let worksLength = modifiedWorks.length - 1;
  let inputId = modifiedWorks[worksLength].id + 1;
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
  let worksLength = modifiedWorks.length - 1;
  let inputId = modifiedWorks[worksLength].id;
  tempFormData.append("image", tempImage);
  tempFormData.append("id", inputId);
  formDataArray.push(tempFormData);
}

// Publier ou supprimer des projets
async function POSTwork(work) {
  let counter = 0;
  for (let i = 0; i < formDataArray.length; i++) {
    if (work.id == formDataArray[i].get("id")) {
      counter = i;
      formDataArray[i].delete("id");
    }
  }
  try {
    await fetch(apiUrl + "/works", {
      method: work.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: formDataArray[counter],
    });
  } catch (error) {
    console.log(error);
  }
}

async function DELETEwork(work) {
  try {
    await fetch(apiUrl + "/works/" + work.id, {
      method: work.method,
      headers: { 
       "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function applyChanges() {
  modifiedWorks.forEach((modifiedWork) => {
    if (modifiedWork.method == "POST") {
      POSTwork(modifiedWork);
    } else if (modifiedWork.method == "DELETE") {
      DELETEwork(modifiedWork);
    }
  });
}

// Rendu des galeries
function renderGallery() {
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
        '"> <figcaption>' +
        modifiedWork.title +
        "</figcaption> </figure>";
      html += htmlSegment;
    }
  });
  galleryContainer.innerHTML = html;
}

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
  modalGalleryContainer.innerHTML = html;
}

function resetAddWork() {
  workImageDetailsContainer.style.display = "flex";
  workImagePreviewContainer.innerHTML = "";
}

// Ouvrir Modal
modifyGalleryBtn.onclick = function () {
  modalsContainer.style.display = "block";
  modalDeleteWorks.style.display = "flex";
  renderModalGallery();
};

addWorkBtn.onclick = function () {
  modalAddWorks.style.display = "flex";
  modalDeleteWorks.style.display = "none";
};

// Fermer modals
exitModalBtn[0].onclick = function () {
  modalsContainer.style.display = "none";
  modalDeleteWorks.style.display = "none";
  modalAddWorks.style.display = "none";
  resetAddWork();
  renderModalGallery();
};

exitModalBtn[1].onclick = function () {
  modalsContainer.style.display = "none";
  modalDeleteWorks.style.display = "none";
  modalAddWorks.style.display = "none";
  resetAddWork();
  renderModalGallery();
};

window.onclick = function (event) {
  if (event.target == modalsContainer) {
    modalsContainer.style.display = "none";
    modalAddWorks.style.display = "none";
    modalDeleteWorks.style.display = "none";
    resetAddWork();
    renderGallery();
  }
};

// Fleche précédent
returnModalBtn.onclick = function () {
  modalAddWorks.style.display = "none";
  modalDeleteWorks.style.display = "flex";
  renderModalGallery();
  resetAddWork();
};

// Supprimer des photos
modalGalleryContainer.onclick = function () {
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

//Preview des photos que l'on va poster
workImageBtn.onchange = function () {
  previewImg(this);
};

// Ajouter des photos
modalAddWorks.addEventListener("submit", function (event) {
    //console.log("clicked");
  event.preventDefault();
  let title = getTitle();
  let categoryId = getCategoryId();
  let imageUrl = sessionStorage.getItem("imgUrl");
  imageUrl = imageUrl.replaceAll('"', "");
  if (title != "" && imageUrl != "") {
    TempFormData = new FormData(this);
    addWork(imageUrl, title, categoryId);
    pushIntoFormDataArray(TempFormData);
    resetAddWork();
  }
});

// Publier changements
publishChangesBtn.onclick = function () {
  applyChanges();
};