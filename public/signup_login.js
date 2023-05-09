document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get user input
  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // Sign up process
  console.log(`User signed up: ${username}, ${email}, ${password}`);
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get user input
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  // Login process
  console.log(`User logged in: ${username}, ${password}`);
});
