'use strict';

let allWebsites = [];
let uniqueTags = [];

document.getElementById('menu').style.display = 'none';
document.getElementById('gallery').style.display = 'none';
document.getElementById('add-website').style.display = 'none';
document.getElementById('website-detail').style.display = 'none';
document.getElementById('signup-wrapper').style.display = 'none';

document.getElementById('signup-link').addEventListener('click', function(e){
  document.getElementById('login-wrapper').style.display = 'none';
  document.getElementById('signup-wrapper').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('notification').innerHTML = '';
  let user = {};
  user.username = document.getElementById('username').value;
  user.password = document.getElementById('password').value;
  return fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    } 
  })
  .then(res => res.json())
  .then((token) => {
    localStorage.setItem('authToken', token.authToken);
    localStorage.setItem('username', user.username);
    console.log('Logged in');
    getDataFromApi();
  })
  .catch((err) => {
    console.log(err);
    document.getElementById('notification').innerHTML = 'Login failed. Try again or click below to sign up';
  })
});

document.getElementById('signup-form').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('notification').innerHTML = '';
  let user = {};
  user.username = document.getElementById('signup-username').value;
  user.password = document.getElementById('signup-password').value;
  return fetch('/api/users', {
    method: 'POST',      
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
});

function getDataFromApi() {
  document.getElementById('gallery').innerHTML = '';
  let token = localStorage.getItem('authToken');
  return fetch('/websites', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    allWebsites = data;
    renderGallery(allWebsites);
    renderMenu(allWebsites);
  })
  .catch(function() {
    console.log('API request error');
  })
};

function renderGallery(allWebsites) {
  document.getElementById('auth-forms').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('gallery').innerHTML = '';
  for (let i = allWebsites.length - 1; i >= 0; i--) {
    let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
    let eachWebsite = `
      <div class='each-website' onclick='renderDetailScreen(${[i]})'>
        <img src='https://res.cloudinary.com/dgdn7zsw8/image/upload/v1526873950/${allWebsites[i]._id}.png' class='website-image' alt='screenshot of website' />
        <div class='overlay'>
          <h1 class='text website-title'>${allWebsites[i].title}</h1><br />
          <h2 class='text website-tags'>${tagDisplay}</h2>
        </div>
      </div>
    `;
    $('#gallery').append(eachWebsite);
  }
};

function renderMenu(data) {
  let tagArr = ['color', 'font', 'images', 'layout'];
  for (let i = 0; i < allWebsites.length; i++) {
    tagArr.push.apply(tagArr, allWebsites[i].tags);
  }
  uniqueTags = ([...new Set(tagArr)]).sort();
  document.getElementById('filters').innerHTML = '';
  for (let i = 0; i < uniqueTags.length; i++) {
    $('#filters').append(`
      <input type='checkbox' value='${uniqueTags[i]}' onclick='handleFilterClick()' />
      <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
      <br>
    `);
  };
};

function handleFilterClick() {
  let clickedFilters = [];
  let checkbox = document.forms[2];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      clickedFilters.push(checkbox[i].value);
    }
  };
  document.getElementById('gallery').innerHTML = '';
  document.getElementById('notification').innerHTML = '';
  for (let i = 0; i < allWebsites.length; i++) {
    let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
    if (clickedFilters.every(val => (allWebsites[i].tags).indexOf(val) >= 0)) {
      let eachWebsite = `
      <div class='each-website' onclick='renderDetailScreen(${[i]})'>
        <img src='https://res.cloudinary.com/dgdn7zsw8/image/upload/v1526873950/${allWebsites[i]._id}.png' class='website-image' alt='screenshot of website' />
        <div class='overlay'>
          <h1 class='text website-title'>${allWebsites[i].title}</h1><br />
          <h2 class='text website-tags'>${tagDisplay}</h2>
        </div>
      </div>
    `;
      $('#gallery').append(eachWebsite);
    }
  };
  if (document.getElementById('gallery').innerHTML === '') {
    document.getElementById('notification').innerHTML = 'No results. Try deselecting a filter.'
  }
};

document.getElementById('add-link').addEventListener('click', function(e){
  e.preventDefault();
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'block';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('url').value = '';
  document.getElementById('customTag').value = '';
  document.getElementById('tag-checkboxes').innerHTML = '';
  for (let i = 0; i < uniqueTags.length; i++) {
  $('#tag-checkboxes').append(`
    <input type='checkbox' value='${uniqueTags[i]}' name='tags' />
    <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
    <br>
  `)}
});

document.getElementById('new-website').addEventListener('submit', function(e){
  e.preventDefault();
  let tags = [];
  let checkbox = document.getElementsByName('tags');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      tags.push(checkbox[i].value)
    }
  };
  if (document.getElementById('customTag').value) {
    tags.push(document.getElementById('customTag').value)
  };

  let newWebsite = {};
    newWebsite.username = localStorage.getItem('username');
    newWebsite.url = document.getElementById('url').value;
    newWebsite.tags = tags;
    newWebsite.notes = document.getElementById('notes').value;

  let token = localStorage.getItem('authToken');
  return fetch('/websites', {
    method: 'POST',
    body: JSON.stringify(newWebsite),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
   })
  .then(checkStatus)
  .then(setTimeout(function(){getDataFromApi()},9000))
});

function checkStatus(response) {
  document.getElementById('notification').innerHTML = '';
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.message);
    document.getElementById('notification') = error;
  }
};

function renderDetailScreen(i) {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'block';
  let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
   $('#website-detail').empty().append(`
      <div class='each-website' onclick=''>
        <a onclick='renderGallery(allWebsites)' class='text-link'>Close</a>
        <span title='Click to visit website'> 
          <a href='${allWebsites[i].url}' target='_blank' >
            <h1 class='website-title'>${allWebsites[i].title}</h1>  
            <img src='https://res.cloudinary.com/dgdn7zsw8/image/upload/v1526873950/${allWebsites[i]._id}.png' class='website-image' alt='screenshot of website' />
          </a>
        </span>
        <p class='website-tags'>${tagDisplay}</p>
        <p class='notes'>${allWebsites[i].notes}</p>
        <button onclick='showHideWebsiteEditor()'>Edit</button>
        <div id='website-editor'></div>
      </div>
    `);
  // Website editing tools
  document.getElementById('website-editor').style.display = 'none';
  $('#website-editor').append(`
    <button onclick='renderGallery(allWebsites)'>Close</button>
    <form>
      <fieldset>
      <legend>Edit website elements</legend>
        <div id='edit-tags'></div>
        <label for='custom-tag'>Add a custom tag</label><input type='text' id='customTag' class='text-input' /><br>
        <label for='notes'>Notes:</label><input type='text' id='notes' class='text-input' name='notes' placeholder='${allWebsites[i].notes}' /><br>
        <a onclick='editWebsite(${[i]})'>Submit</a>
      </fieldset>
    </form>
    <button onclick='deleteWebsite(${[i]})'>DELETE WEBSITE</button>
  `);
  for (let t = 0; t < uniqueTags.length; t++) {
    $('#edit-tags').append(`
      <input type='checkbox' id='${uniqueTags[t]}' value='${uniqueTags[t]}' name='tags' />
      <label for='${uniqueTags[t]}'>${uniqueTags[t]}</label>
      <br>
    `);
    if ((`${allWebsites[i].tags}`).includes(`${uniqueTags[t]}`)) {
      document.getElementById(`${uniqueTags[t]}`).checked = true
    }
  }
};

function showHideWebsiteEditor() {
  let editor = document.getElementById('website-editor');
  if (editor.style.display === 'none') {
      editor.style.display = 'block';
  } else {
      editor.style.display = 'none';
  }
};

function editWebsite(i) {
  let id = allWebsites[i]._id;
  let tags = [];
  let customTag = document.getElementById('customTag').value;
  console.log(customTag);
  let notes = document.getElementById('notes').value;
  console.log(notes);
  let checkbox = document.getElementsByName('tags');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      tags.push(checkbox[i].value)
    }
  };
  if (customTag) {
    tags.push(customTag)
  }
  let editedWebsite = {
    'id': id,
    'tags': tags,
    'notes': notes
  };
  console.log(tags);
  let token = localStorage.getItem('authToken');
  return fetch(`/websites/${editedWebsite.id}`, {
    method: 'PUT',
    body: JSON.stringify(editedWebsite),
    success: getDataFromApi(),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(checkStatus)
    .then(console.log(`Edited`));
};

function deleteWebsite(i) {
  let token = localStorage.getItem('authToken');
  fetch(`/websites/${allWebsites[i]._id}`, {
    method: 'DELETE',
    success: getDataFromApi(),
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
};

document.getElementById('gallery-link').addEventListener('click', function(e){
  e.preventDefault();
  getDataFromApi() 
});

document.getElementById('close-link').addEventListener('click', function(e){
  e.preventDefault();
  renderGallery(allWebsites)
});

document.getElementById('logout').addEventListener('click', function(e){
  e.preventDefault();
  localStorage.setItem('authToken', '');
  localStorage.setItem('username', '');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('auth-forms').style.display = 'block';
});
