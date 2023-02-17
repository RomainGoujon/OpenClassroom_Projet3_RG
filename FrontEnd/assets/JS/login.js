const form = document.getElementsByClassName("form-login")[0].elements;
const messageError = document.getElementById("msg-error");
const loginURL = "http://localhost:5678/api/users/login";

// Envoie des données de l'utilisateur
function getUserLog() {
const { email, password } = form;
return { email: email.value, password: password.value };
}

// Se connecter lorque l'on clic sur le bouton
form["submit-login"].addEventListener("click", async function (event) {
event.preventDefault();

    const user = getUserLog();

    try {
        const response = await fetch(loginURL, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        });

        if (!response.ok) {
            messageError.style.display = "flex";
            return;
        }
        const data = await response.json();
        if (data.userId) {
            connecting(data);
        }
    } catch (error) {
        console.log(error);
    }
});

function connecting(data) {
localStorage.setItem("userId", data.userId);
localStorage.setItem("token", data.token);

console.log(`Le token est : ${data.token}`);



// Redirection vers la page d'accueil
window.location.href = "index.html";
}
