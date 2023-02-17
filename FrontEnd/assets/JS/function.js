// fonction pour récuperer l'id utilisateur et le token
function getUserId() {
    return localStorage.getItem("userId");
}

function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

// Fonction pour voir si l'utilisateur est connecté
function isConnected() {
    const connecting = getToken() ? true : false;
    return connecting
}

// Fonction pour récupere titres et catégories
function getTitle() {
  return document.getElementById("titreAjout").value;
}

function getCategoryId() {
  return document.getElementById("selectCategorie").value;
}
