localStorage.clear();

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Collect form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const data = { email, password };

  // Make Axios POST request to login API
  axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/user/login', data)
    .then(response => {
        const token = response.data.token;
        const userName = response.data.name;
        localStorage.setItem("token" ,token)
        localStorage.setItem("username",userName)
        console.log(token)
        if(token){
            window.location.href = "/chat.html"
        } 
        else{
            alert(`${response.data.message}`)
            window.location.href = "/chat.html"

        }
    })
    .catch(error => {
      console.log(error);
      alert(`${error.response.data.message}`);
    });
});

// Handle signup button click
document.getElementById('signupButton').addEventListener('click', function() {
  window.location.href = '/signup.html'; // Redirect to signup page
});