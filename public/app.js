'use strict';

let allWebsites = [];
let uniqueTags = [];

document.getElementById('menu').style.display = 'none';
document.getElementById('gallery').style.display = 'none';
document.getElementById('add-website').style.display = 'none';
document.getElementById('website-detail').style.display = 'none';
document.getElementById('signup-wrapper').style.display = 'none';
document.getElementById('logout').style.display = 'none';

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
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  })
  .catch((err) => {
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
  .then(response => document.getElementById('notification').innerHTML = response.message);
});

function getDataFromApi() {
  document.getElementById('gallery').innerHTML = '';
  let token = localStorage.getItem('authToken');
  let username = localStorage.getItem('username');
  return fetch(`/websites/${username}`, {
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
  document.getElementById('logout').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('gallery').innerHTML = '';
  document.getElementById('notification').innerHTML = '';
  for (let i = allWebsites.length - 1; i >= 0; i--) {
    let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
    let eachWebsite = `
      <div class='each-website' onclick='renderDetailScreen(${[i]})'>
        <img src='https://res.cloudinary.com/dgdn7zsw8/image/upload/v1526873950/${allWebsites[i]._id}.png' class='website-image' alt='screenshot of website' />
        <div class='overlay'>
          <p class='text website-title'>${allWebsites[i].title}</p><br />
          <p class='text website-tags label-margin'>${tagDisplay}</p><br />
          <p class='text website-notes label-margin'>${allWebsites[i].notes}</p>
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
      <input type='checkbox' value='${uniqueTags[i]}' class='checkbox' onclick='handleFilterClick()' />
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

// Render checkboxes for new website
document.getElementById('add-link').addEventListener('click', function(e){
  e.preventDefault();
  document.getElementById('menu').style.display = 'none';
  document.getElementById('add-website').style.display = 'block';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('logout').style.display = 'none';
  document.getElementById('url').value = '';
  document.getElementById('customTag').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('tag-checkboxes').innerHTML = '';
  for (let i = 0; i < uniqueTags.length; i++) {
  $('#tag-checkboxes').append(`
    <input type='checkbox' value='${uniqueTags[i]}' name='tags' class='checkbox' />
    <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
    <br>
  `)}
});

// POST a new website
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
    console.log(response);
    document.getElementById('notification').innerHTML = response.message;
  }
};

function renderDetailScreen(i) {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('logout').style.display = 'none';
  document.getElementById('website-detail').style.display = 'block';
  document.getElementById('gallery').innerHTML = '';
  document.getElementById('website-detail').innerHTML = '';
  let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
  $('#gallery').append(`
    <div class='website-detail'>
      <span title='Click to visit website'> 
        <a href='${allWebsites[i].url}' target='_blank' >  
          <img src='https://res.cloudinary.com/dgdn7zsw8/image/upload/v1526873950/${allWebsites[i]._id}.png' alt='screenshot of website' class='detail-image website-image'/>
        </a>
      </span>
    </div>
  `);
  $('#website-detail').append(`
      <div class='detail-wrapper'>
        <p class='website-title'>${allWebsites[i].title}</p>
        <p class='website-tags label-margin'>${tagDisplay}</p>
        <p class='website-notes label-margin'>${allWebsites[i].notes}</p>
      </div>
      <button onclick='renderWebsiteEditor(${i})' class='border-top'>Edit</button>
      <button onclick='renderGallery(allWebsites)' class='border-top border-bottom'>Close</button>
  `);
};

function renderWebsiteEditor(i) {
  document.getElementById('website-detail').innerHTML = '';
  $('#website-detail').append(`
    <form>
      <fieldset>
        <div class='padding-div'>
          <legend>Edit tags:</legend>
          <div id='edit-tags' class='checkbox-wrapper'></div>
          <label for='custom-tag' class='label-margin'>Add a custom tag:</label>
          <input type='text' id='edit-customTag' class='text-input' />
          <label for='notes' class='label-margin'>Edit notes:</label>
          <input type='text' id='edit-notes' class='text-input' name='notes' placeholder='${allWebsites[i].notes}' />
        </div>
        <a onclick='editWebsite(${[i]})' class='submit'>Submit changes</a>
      </fieldset>
    </form>
    <button onclick='deleteWebsite(${[i]})' class='border-top delete'>Delete website</button>
    <button onclick='renderDetailScreen(${i})' class='border-top border-bottom'>Close</button>
  `);
  for (let t = 0; t < uniqueTags.length; t++) {
    $('#edit-tags').append(`
      <input type='checkbox' id='${uniqueTags[t]}' value='${uniqueTags[t]}' name='tags' class='checkbox' />
      <label for='${uniqueTags[t]}'>${uniqueTags[t]}</label>
      <br>
    `);
    if ((`${allWebsites[i].tags}`).includes(`${uniqueTags[t]}`)) {
      document.getElementById(`${uniqueTags[t]}`).checked = true
    }
  }
};

function editWebsite(i) {
  let tags = [];
  let checkbox = document.getElementsByName('tags');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      tags.push(checkbox[i].value)
    }
  };
  let customTag = document.getElementById('edit-customTag').value;
  if (customTag) {
    tags.push(customTag)
  };
  let editedWebsite = {};
    editedWebsite.id = allWebsites[i]._id;
    editedWebsite.tags = tags;
    editedWebsite.notes = document.getElementById('edit-notes').value;
  
  let token = localStorage.getItem('authToken');
  return fetch(`/websites/${editedWebsite.id}`, {
    method: 'PUT',
    body: JSON.stringify(editedWebsite),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(checkStatus)
    .then(console.log(`Edited`))
    .then(getDataFromApi())
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
