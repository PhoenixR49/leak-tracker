const passwordInputs = document.querySelectorAll("#password-input");

// eslint-disable-next-line no-restricted-syntax
for (const passwordInput of passwordInputs) {
  passwordInput.addEventListener("click", () => {
    console.log(passwordInput.firstElementChild);
    if (
      passwordInput.parentElement.querySelector("input").type === "password"
    ) {
      passwordInput.parentElement.querySelector("input").type = "text";
      passwordInput.firstElementChild.classList.replace(
        "bi-eye",
        "bi-eye-slash"
      );
    } else {
      passwordInput.parentElement.querySelector("input").type = "password";
      passwordInput.firstElementChild.classList.replace(
        "bi-eye-slash",
        "bi-eye"
      );
    }
  });
}
