const form = document.getElementsByClassName("form-login")[0].elements;
const messageError = document.getElementById("msg-error");
const loginURL = "http://localhost:5678/api/users/login";

// Se connecter lorque l'on clic sur le bouton
form["submit-login"].addEventListener("click",function (event) {
event.preventDefault();

    fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            email: form.email.value,
            password: form.password.value,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
      
      localStorage.setItem('auth', JSON.stringify(data));
      
      window.location = "index.html";
      
    })
    .catch((error) => {
      console.error('Error:', error);
    });
})
