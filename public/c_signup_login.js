document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get user input
  const firstname = document.getElementById("signup-firstname").value;
  const lastname = document.getElementById("signup-lastname").value;
  const email = document.getElementById("signup-email").value.toLowerCase();
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("student").checked ? 'student' : 'teacher';

  // Concatenate firstname and lastname to create a username
  const name = firstname + " " + lastname;

  // Email validation
  if (role === 'student' && !email.endsWith("@students.wits.ac.za")) {
    alert("Please input a valid student email");
    return;
  } else if (role === 'teacher' && !email.endsWith("@wits.ac.za")) {
    alert("Please input a valid teacher email");
    return;
  }

  // Sign up process
  $.ajax({
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name: name, email: email, password: password, role: role }),
    url: "./signup"
  }).done(function (res) {
    if (res.status === 'Valid') {
      window.location.href = res.href;
    } else {
      // If status is 'Invalid', use the 'message' attribute for a specific error message
      alert(res.message || 'Invalid signup');
    }
  });
});


document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get user input
  const email = document.getElementById("login-email").value.toLowerCase();
  const password = document.getElementById("login-password").value;

  // Login process
  //Type of http method = POST as opposed to GET(request type)
  $.ajax({
    type: "POST",
    contentType: "application/json", //header property of http request, which tells the server what type of data to 
    //expect in the BODY of the POST message (standard is plaintext)
    data: JSON.stringify({ email: email, password: password }), //data sent (converted to JSON)
    url: "./login" //URL that the POST is sent to
  }).done(function (res) {
    if (res.status === 'Valid') {
      window.location.href = res.href;
    }
    else {
      alert('Invalid login')
    }
  });
});
