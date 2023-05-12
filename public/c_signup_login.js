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
  //Type of http method = POST as opposed to GET(request type)
  $.ajax({
    type: "POST",    
    contentType: "application/json", //header property of http request, which tells the server what type of data to 
    //expect in the BODY of the POST message (standard is plaintext)
    data: JSON.stringify({ userName: username, password: password }), //data sent (converted to JSON)
    url: "./login" //URL that the POST is sent to
  }).done(function (res) {
    if(res.status === 'Valid')
    {
      window.location.href = res.href;
    }
    else
    {
      alert('Invalid login')
    }
  });
});
