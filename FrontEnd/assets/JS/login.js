// lien pour login + variables pour page Login
const loginURL = "http://localhost:5678/api/users/login";
const form = document.getElementsByClassName("form-login")[0].elements;
const headers = {
    "Content-Type": "application/json",
};

// Fonction pour avoir le user

function getUserLog() {
    const { email, password } = form;
    return { email: email.value, password: password.value };
}


// EventListener pour la connexion

form["submit-login"].addEventListener('click', async function(event) {
    event.preventDefault();
    const user = getUserLog();
    try {
        const response = await fetch(loginURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });
        if (response.ok) {
            console.log("affichage de la valeur du token");
          
            const value = await response.json();
              console.log("le token est ", value.token)
            sessionStorage.setItem("token", value.token);
            window.location.href = "admin.html";
        } else {
            alert("Erreur dans l’identifiant ou le mot de passe");
        }
    } catch (error) {
        console.log(error);
    }
});