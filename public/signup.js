document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Gather form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  const data = {
    name: name,
    email: email,
    phone: phone,
    password: password
  };
  console.log(data);

  // Make the Axios POST request
  axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/user/signup', data)
    .then(response => {
      console.log(response.data);
      alert(`${response.data.message}`);
    })
    .catch(error => {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    });
});