
// Exmple array of members (replace this with real data from your server)

// Get the members dropdown element
const membersDropdown = document.getElementById('members');

const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', loadmembers);

function loadmembers(event){
    axios.get('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/group/getAllUsers',{ headers: { "authorisation": token }})
    .then(response =>{
        const names = []
        response.data.users.forEach(element => {
            names.push(element.name) 
        });
        console.log(names)
        populateMemberList(names);
    })
    .catch(err => {
        console.log(err)
    })
}

// Function to populate the multi-select dropdown
function populateMemberList(members) {
  membersDropdown.innerHTML = '';  // Clear any existing options
  members.forEach((member, index) => {
    const option = document.createElement('option');
    option.value = member.toLowerCase();  // Use lowercase for unique values
    option.textContent = member;  // Display member name
    membersDropdown.appendChild(option);  // Append to dropdown
  });
}



// Handle form submission
document.getElementById('createGroupForm').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent form from refreshing the page

  // Gather form data
  const groupName = document.getElementById('groupName').value;
  const groupDescription = document.getElementById('groupDescription').value;
  const selectedMembers = Array.from(membersDropdown.selectedOptions).map(option => option.value);

  // Prepare the request body
  const requestBody = {
    name : groupName,
    description : groupDescription,
    members: selectedMembers
  };

  // Make the POST request using Axios
  axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/group/createGroup', requestBody, { headers: { "authorisation": token }})  
    .then(response => {
      console.log('Group created successfully:', response.data);
      alert('Group created successfully!');
      // Optionally, redirect to a different page
      // window.location.href = '/someOtherPage';
    })
    .catch(error => {
      console.error('Error creating group:', error);
      console.log(requestBody)
      alert('Error creating group!');
    });
});
