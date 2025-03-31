    const socket = io('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000');

    const token = localStorage.getItem('token'); // Get token from local storage
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const groupSelect = document.getElementById('groupSelect')
    const openChats = document.getElementById('openChatsButton');
    const userName = localStorage.getItem('username');
    const fileUploadSection = document.getElementById('fileUploadSection');
    const sendFileButton = document.getElementById('sendFileButton');


    document.addEventListener('DOMContentLoaded', loadDetails);
    openChats.addEventListener('click', loadChats);
    sendButton.addEventListener('click', handleSendMessage);
    sendFileButton.addEventListener('click',handleFileSharing);




    function loadDetails() {
      axios.get('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/group/getAllGroups', {headers: { "authorisation": token }})
      .then(response=>{
        const names = [];
        response.data.groups.forEach(element => {
                names.push(element.name) 
            });
        console.log(names)
        populateGroupList(names);
        console.log(response.data);
      })
      .catch(err=>{
        console.log(err);
      })}


    function loadChats(event){
      const oldmessageButton = document.getElementById('olderMessage')
      if (oldmessageButton){
        oldmessageButton.remove();
      }
      const selectedGroup = document.getElementById('groupSelect');
      const selectedGroupText = selectedGroup.options[selectedGroup.selectedIndex].text
      const adminButton = document.getElementById('adminSuperpowersButton');
      console.log("selectedGroup,", selectedGroupText)
      socket.emit('join-room',selectedGroupText);

      socket.removeAllListeners('recieve-message');

      socket.on('recieve-message', (message)=> {
        console.log(message);
        handleNewMessages([message]);
      })

      localStorage.removeItem('groupToken');
      localStorage.removeItem('chats');
      localStorage.removeItem('lastMessageId');

      const oldestMessageId = localStorage.getItem('oldestMessageId');
      const todayFirstMessage = localStorage.getItem('todayFirstMessage')

      // messagesDiv.innerHTML = '';

      if (selectedGroup.selectedIndex === 0) {
        alert('Please select a group.');
      }
      else{
       //chatInterval = setInterval(()=>{
       //console.log("selectedGroup,", selectedGroupText)
        //const messages = JSON.parse(localStorage.getItem('chats'));
        axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/group/getchat',{groupName: selectedGroupText}, {headers: { "authorisation": token }, params: { oldestMessageId: oldestMessageId, todayFirstMessage }})
          .then(response => {
            console.log(response.data)
            // console.log(oldestMessageId)
              if(response.data.isAdmin){
                adminButton.style.display = 'inline-block';
              } 
              if(!response.data.isAdmin){
                adminButton.style.display = 'none';
              } 
              if(response.data.todayFirstMessage){
                localStorage.setItem('todayFirstMessage', true)
              }

              fileUploadSection.style.display = 'inline-block';

              localStorage.setItem('groupToken', response.data.groupToken); 
              localStorage.setItem('chats',JSON.stringify(response.data.messages));
              localStorage.setItem('oldestMessageId',JSON.stringify(response.data.oldestMessageId))
              handleNewMessages(response.data.messages);
            })
          .catch(err => {
            if(err.response.data.isAdmin){
                adminButton.style.display = 'inline-block';
              } 
              if(!err.response.data.isAdmin){
                adminButton.style.display = 'none';
              } 
            if(err.response.data.message ==='No chats yet'){
              if (!localStorage.getItem('groupToken')){
                localStorage.setItem('groupToken', err.response.data.groupToken); 
                localStorage.setItem('chats',JSON.stringify(err.response.data.messages));
                localStorage.setItem('lastMessageId',JSON.stringify(err.response.data.latestMessageId)) 
              }
            }
            else{
              console.log(err);
            }
          })
        }}

  function handleSendMessage(event){
      const message = messageInput.value.trim();
      const groupToken = localStorage.getItem('groupToken')
      const selectedGroup = document.getElementById('groupSelect');
      const selectedGroupText = selectedGroup.options[selectedGroup.selectedIndex].text
      const data = {
        message : message,
        name : userName
      }
      handleNewMessages([data])

      socket.emit('send-message',data,selectedGroupText);

      if(groupToken === null){
        alert('please select a group')
      }
      if (!message) {
        alert('Please enter a message.');
        return;
      }
      axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/group/postchat', { message }, {
        headers: { "authorisation": token , "groupToken" : groupToken }
      })
      .then(response => {
        messageInput.value = '';
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error sending message:', error);
        alert('Failed to send the message.');
      });
    }

    function handleNewMessages(newChats){
      //let currentChat = [];

      /*const storedChats = localStorage.getItem('chats');

      if (storedChats) {
        try {
          currentChat = JSON.parse(storedChats);
        } catch (e) {
          currentChat = [];  // Reset to empty array if parsing fails
          }
      }*/

      newChats.forEach(element => {
        const newMessage = document.createElement('div');
        const nameContainer = document.createElement('span');
        nameContainer.textContent = `${element.name}`;

        if (element.message.startsWith('https://') || element.message.startsWith('http://')) {
        const linkElement = document.createElement('a');
        linkElement.href = element.message;
        linkElement.textContent = 'Open Link';
        linkElement.download = '';  // Open in a new tab
        nameContainer.appendChild(linkElement);  // Add the link next to the name
    } else {
        nameContainer.textContent += element.message;  // Append the message to the name
    }
        newMessage.appendChild(nameContainer);
        messagesDiv.prepend(newMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; 
    //    currentChat.push(element)
    //    currentChat.shift()
      });
    //  localStorage.setItem('chats', JSON.stringify(currentChat))
    const olderMessages = document.createElement('button');
    olderMessages.textContent = 'load older messages';
    olderMessages.id = 'olderMessage'
    olderMessages.onclick = loadChats;
    messagesDiv.prepend(olderMessages);
    }

    function populateGroupList(names) {
      groupSelect.innerHTML = '<option selected disabled >Select a group</option>';  // Clear any existing options
      names.forEach((name, index) => {
        const option = document.createElement('option');
        option.value = name.toLowerCase();  // Use lowercase for unique values
        option.textContent = name;  // Display member name
        groupSelect.appendChild(option);  // Append to dropdown
      });
    }

    function handleFileSharing(event){
      const groupToken = localStorage.getItem('groupToken')
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];  
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('username');
      const selectedGroup = document.getElementById('groupSelect');
      const selectedGroupText = selectedGroup.options[selectedGroup.selectedIndex].text;

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    if (file.size > 20 * 1024 * 1024) {
        alert('The file is too large. Please upload a file smaller than 20MB.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    axios.post('https://ec2-13-234-76-163.ap-south-1.compute.amazonaws.com:3000/file/sendFile',formData,{headers: { "authorisation": token, "groupToken" : groupToken }})
    .then(response => {
      const fileLink = response.data.fileUrl;
      const data = {
        message : fileLink,
        name : userName
      }
      handleNewMessages([data])
      socket.emit('send-message',data,selectedGroupText);
      
    })
    .catch(err => {
      console.log(err)
    })
    }
