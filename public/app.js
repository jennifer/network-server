'use strict';

let allWebsites = [];
let uniqueTags = [];

document.getElementById('menu').style.display = 'none';
document.getElementById('gallery').style.display = 'none';
document.getElementById('add-website').style.display = 'none';
document.getElementById('website-detail').style.display = 'none';

document.getElementById('login-form').addEventListener('submit', function(e){
  e.preventDefault();
  let user = {};
  user.username = document.getElementById('username').value;
  user.password = document.getElementById('password').value;
  console.log(user);
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
    console.log(token);
    console.log('Logged in');
    getDataFromApi();
  })
  .catch(() => {
    console.log('Login failed')
  })
});

document.getElementById('signup-form').addEventListener('submit', function(e){
  e.preventDefault();
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
  .then((token) => {
    console.log('Signed up')
  })
  .catch(() => {
    console.log('Signup failed')
  })
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
  console.log('renderGallery ran');
  document.getElementById('auth-forms').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  document.getElementById('gallery').innerHTML = '';
  for (let i = 0; i < allWebsites.length; i++) {
    let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
    let eachWebsite = `
      <div class='each-website' onclick='renderDetailScreen(${[i]})'>
        <h1 class='website-title'>${allWebsites[i].title}</h1>
        <img src='data:image/png;utf8,${allWebsites[i].fullsizeImg.data.data.toString('utf8')}' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${tagDisplay}</h1>
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
  console.log('handleFilterClick ran')
  let clickedFilters = [];
  let checkbox = document.forms[2];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      clickedFilters.push(checkbox[i].value);
    }
  };
  console.log(clickedFilters);
  document.getElementById('gallery').innerHTML = '';
  for (let i = 0; i < allWebsites.length; i++) {
    let tagDisplay = (allWebsites[i].tags).sort().join(' | ');
    if (clickedFilters.every(val => (allWebsites[i].tags).indexOf(val) >= 0)) {
      let eachWebsite = `
        <div class='each-website' onclick='renderDetailScreen(${[i]})'>
          <h1 class='website-title'>${allWebsites[i].title}</h1>
          <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
          <h1 class='website-tags'>${tagDisplay}</h1>
        </div>
      `;
      $('#gallery').append(eachWebsite);
    }
  };
  if (document.getElementById('gallery').innerHTML === '') {
    $('#gallery').html('<p>No results. Try deselecting a filter.</p>')
  }
};

function renderAddWebsiteScreen() {
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
};

// refactor get form data
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
  console.log(tags);
  //if (tags) tags = tags.substring(1);

  let newWebsite = {};
    newWebsite.url = document.getElementById('url').value;
    newWebsite.tags = tags;
    newWebsite.notes = document.getElementById('notes').value;
    console.log(newWebsite);

  let token = localStorage.getItem('authToken');
  return fetch('/websites', {
    method: 'POST',
    body: JSON.stringify(newWebsite),
    success: getDataFromApi(),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(checkStatus)
  .then(()=>console.log(`Added ${url}`))
  .then(getDataFromApi());
});

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

function renderDetailScreen(i) {
  console.log('handleThumbnailClick ran');
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
            <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
          </a>
        </span>
        <p class='website-tags'>${tagDisplay}</p>
        <p class='notes'>${allWebsites[i].notes}</p>
        <a onclick='showHideWebsiteEditor()' class='text-link'>Edit</a>
        <div id='website-editor'></div>
      </div>
    `);
  // Website editing tools
  document.getElementById('website-editor').style.display = 'none';
  $('#website-editor').append(`
    <a onclick='getDataFromApi()' class='text-link'>Close</a>
    <div id='edit-tags'></div>
    <label for='custom-tag'>Add a custom tag</label><input type='text' id='customTag' class='text-input' name='tags' /><br>
    <label for='notes'>Notes:</label><input type='text' id='notes' class='text-input' name='notes' placeholder='${allWebsites[i].notes}' /><br>
    <a onclick='getEditFormData(${[i]})' class='text-link'>Submit</a>
    <a onclick='deleteWebsite(${[i]})' class='text-link'>DELETE WEBSITE</a>
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

function getEditFormData(i) {
  let id = allWebsites[i]._id;
  let tags = '';
  let customTag = document.getElementById('customTag').value;
  let notes = document.getElementById('notes').value;
  let checkbox = document.getElementsByName('tags');
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      tags += ',' + checkbox[i].value;
    }
  };
  tags += ',' + customTag;
  if (tags) tags = tags.substring(1);
  console.log(id);
  console.log(tags);
  console.log(notes);
  let token = localStorage.getItem('authToken');
  let editedWebsite = {
    'id': id,
    'tags': tags,
    'notes': notes
  };
  console.log(editedWebsite);
  putWebsiteUpdate(editedWebsite)
};


function putWebsiteUpdate(editedWebsite) {
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