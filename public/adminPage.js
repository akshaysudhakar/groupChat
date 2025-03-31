  const adminList = document.getElementById('admin-list');
  const memberList = document.getElementById('member-list');
  const addMemberSelect = document.getElementById('add-member-select');
  const manageMemberSelect = document.getElementById('manage-member-select');

  const token = localStorage.getItem('token');
  const groupToken = localStorage.getItem('groupToken');

  document.addEventListener("DOMContentLoaded", ()=> {
      console.log('token',token,"groupToken",groupToken);
      axios.get('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/admin/loadDetails', {headers: { "authorisation": token, "groupToken" : groupToken }})
      .then(response=> {
          console.log(response.data)
          populateAdmins(response.data.groupAdmins);
          populateMembers(response.data.groupMembers,response.data.allUsers,response.data.groupDetails);
      }).catch(err=>{
          console.log(err);
      })
  })

  // Function placeholders for adding and managing members
  function populateAdmins(admins) {
      admins.forEach(element => {
          let li = document.createElement('li');

          li.textContent = `${element.name}`;
          
          const removeButton = document.createElement('button');
          removeButton.textContent = "Remove as Admin";
          removeButton.className = "btn btn-danger btn-sm ml-2";
          removeButton.style.display = 'none';

          removeButton.onclick = () => {
              const adminName = element.name.trim()
              removeAdmin(adminName);  // Function to remove admin (defined separately)
          };
          li.onclick = () => {
              removeButton.style.display = removeButton.style.display === 'none' ? 'block' : 'none';
          };

      li.appendChild(removeButton);
      adminList.appendChild(li);
  });
}

  function removeAdmin(adminName){
    axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/admin/removeAdmin',{adminName},{headers: { "authorisation": token, "groupToken" : groupToken }})
    .then(response=> {
      console.log(response.data);
      alert(`${response.data.message}`)
    }).catch(err=>{
      console.log(err)
      alert(`${err.response.data.message}`);
    })
  }
  
  function populateMembers(members,users,groupDetails) {
      users.forEach(element=> {
          const option3 = document.createElement('option');

          option3.value = element.name.toLowerCase();

          option3.textContent = element.name;

          addMemberSelect.appendChild(option3);
      });
      members.forEach(element => {
          const option1 = document.createElement('option');
          const option2 = document.createElement('option');

          option1.value = element.name.toLowerCase();  // Use lowercase for unique values
          option2.value = element.name.toLowerCase(); 

          option1.textContent = element.name;
          option2.textContent = element.name;

          memberList.appendChild(option1);
          manageMemberSelect.appendChild(option2);
      });
      //populate group details
      const groupName = document.getElementById('group-name');
      groupName.textContent += `${groupDetails.name}`;
      const groupDescription = document.getElementById('group-description')
      groupDescription.textContent += `${groupDetails.description}`;
  }
  
  // Example function to handle adding a member
  document.getElementById('add-member-btn').addEventListener('click', () => {
    const newMembers = Array.from(document.getElementById('add-member-select').selectedOptions).map(option => option.value);
    const data = {
      newMembers:newMembers
    }
    axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/admin/addNewMembers',data,{headers: { "authorisation": token, "groupToken" : groupToken }})
    .then(response=> {
      console.log(response.data);
      alert(`${response.data.message}`)
    }).catch(err=>{
      console.log(err)
      alert(`${err.response.data.message}`);
    })
  });
  
  document.getElementById('remove-member-btn').addEventListener('click', () => {
    const removeMembers = Array.from(document.getElementById('manage-member-select').selectedOptions).map(option => option.value);
    const data = {
      removeMembers:removeMembers
    }
    axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/admin/removeMembers',data,{headers: { "authorisation": token, "groupToken" : groupToken }})
    .then(response=> {
      console.log(response.data);
      alert(`${response.data.message}`)
    }).catch(err=>{
      console.log(err)
      alert(`${err.response.data.message}`);
    })
  });
  
  document.getElementById('make-admin-btn').addEventListener('click', () => {
    const adminMembers = Array.from(document.getElementById('manage-member-select').selectedOptions).map(option => option.value);
    const data = {
      adminMembers:adminMembers
    }
    axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/admin/makeAdmin',data,{headers: { "authorisation": token, "groupToken" : groupToken }})
    .then(response=> {
      console.log(response.data);
      alert(`${response.data.message}`)
    }).catch(err=>{
      console.log(err)
      alert(`${err.response.data.message}`);
    })
  });
