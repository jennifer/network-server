'use strict';

function getDataFromApi(response) {
  $('#gallery').empty();
  fetch('/websites')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    renderGallery(data);
    createGalleryArray(data);
    createTagsArray(data);
  })
  .catch(function() {
      console.log('API request error');
  });
};

const gallerySites = [];
function createGalleryArray(data) {
  for (let i = 0; i < data.length; i++) {
    gallerySites.push(data[i]);
  }
  renderMenu(data);
};

function createTagsArray(data) {
  const allTags = [];
  for (let i = 0; i < data.length; i++) {
    let tagStr = data[i].tags;
    let tagArr = tagStr.split(',');
    allTags.push(...tagArr);
  }
  let uniqueTags = ([...new Set(allTags)]).sort();
  renderFilters(data, uniqueTags)
};

const clickedFilters = [];
function handleFilterClick() {
  console.log('handleFilterClick ran')
  clickedFilters.length = 0;
  let checkbox = document.forms[0];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      clickedFilters.push(checkbox[i].value);
    }
  };
  if (clickedFilters.length === 0) {
    renderGallery(gallerySites);
  }
  else {
    console.log(clickedFilters);
    renderGallery();
  }
};

function renderGallery(data) {
  console.log('renderGallery ran');
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  $('#gallery').empty();
  if (clickedFilters.length === 0) {
    populateGallery(data);
  }
  else {
    const filteredWebsites = [];
    for (let i = 0; i < gallerySites.length; i++) {
      if (gallerySites[i].tags.includes(clickedFilters)) {
        filteredWebsites.push(gallerySites[i]);
      }
    }
    if (filteredWebsites.length === 0) {
      $('#gallery').html('<p>No results. Try deselecting a filter.</p>')
    }
    else {
      populateGallery(filteredWebsites)
    }
  };
};


// clickedFilters.every(r=> gallerySites[i].tags.indexOf(r) >= 0);

// const gallerySites = [];
function populateGallery(data, filteredWebsites) {
  for (let i = 0; i < data.length; i++) {
    // gallerySites.push(data[i]);
    let eachWebsite = `
      <div class='each-website' onclick='renderDetailScreen(${[i]})'>
        <h1 class='website-title'>${data[i].title}</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${data[i].tags}</h1>
      </div>
    `;
    $('#gallery').append(eachWebsite);
  }
};

function renderMenu(data) {
  console.log('renderMenu ran')
  $('#menu').html(`
    <p>Select elements and submit to filter.</p>
    <form id='filters'></form>
    <p>Click <a onclick='renderAddScreen()' class='text-link'>here</a> to add a new website.</p>
  `);
}

function renderFilters(data, uniqueTags) {
  console.log('renderFilters ran');
  $('#filters').empty();
  for (let i = 0; i < data.length; i++) {
    $('#filters').append(`
        <input type='checkbox' id='${uniqueTags[i]}' value='${uniqueTags[i]}' />
        <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
        <br>
    `);
  }
  $('#filters').append(`
    <a onclick='handleFilterClick()' class='text-link'>Submit</a>
  `)
};

function renderAddScreen() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'block';
  document.getElementById('website-detail').style.display = 'none';
  $('#add-website').empty();
  $('#add-website').append(`
    <a onclick='getDataFromApi()'class='text-link'>Close</a>
    <form class='new-website' method='POST' action='/websites'>
      <fieldset name='new-url'>
        <legend>Add a new website</legend>
        <label for='url-input'>Enter a URL</label>
        <input type='text' class='url-input' name='url' /><br>
        <label for='tag-checkboxes'>Tag website elements</label>
        <div id='tag-checkboxes'></div>
        <label for='notes'>Notes:</label>
        <input type='text' class='notes' name='notes' /><br>
        <input type='submit' value='Submit' class='text-link'>
      </fieldset>
    </form>
  `);
  renderTagEditor()
};

function renderTagEditor() {
  console.log('renderTagEdit ran');
  $('#tag-checkboxes').empty();
  for (let i = 0; i < tags.length; i++) {
  $('#tag-checkboxes').append(`
    <input type='checkbox' id='${tags[i]}' value='${tags[i]}' name='tags' />
    <label for='${tags[i]}'>${tags[i]}</label>
    <br>
  `)}
};

function renderDetailScreen(i) {
  console.log('handleThumbnailClick ran');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'block';
   $('#website-detail').empty().append(`
      <div class='each-website' onclick=''>
        <a onclick='getDataFromApi()' class='text-link'>Close</a>
        <h1 class='website-title'>${gallerySites[i].title}</h1><a href='${gallerySites[i].url}' target="_blank">Visit</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${gallerySites[i].tags}</h1><a onclick='renderEditScreen(${i})' class='text-link'>Edit</a>
      </div>
    `);
};

function renderEditScreen(i) {
  $('#website-detail').append(`
    <a onclick='getDataFromApi()' class='text-link'>Close</a>
    <div id='edit-tags'></div>
    <a onclick='handleEditSubmit()' class='text-link'>Submit</a>
  `);
  for (let i = 0; i < data.tags.length; i++) {
    $('#edit-tags').append(`
      <input type='checkbox' id='${data.tags[i]}' value='${data.tags[i]}' />
      <label for='${data.tags[i]}'>${data.tags[i]}</label>
    `)
  }
}

getDataFromApi();