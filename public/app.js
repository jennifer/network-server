'use strict';

let allWebsites = [];

function getDataFromApi() {
  $('#gallery').empty();
  fetch('/websites')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    allWebsites = data;
    initiateGallery(data);
    createTagsArray(data);
  })
  .catch(function() {
    console.log('API request error');
  })
};

function createTagsArray() {
  let allTags = [];
  for (let i = 0; i < allWebsites.length; i++) {
    let tagStr = allWebsites[i].tags;
    let tagArr = tagStr.split(',');
    allTags.push(...tagArr);
  }
  let uniqueTags = ([...new Set(allTags)]).sort();
  renderMenu(uniqueTags)
};

function renderMenu(uniqueTags) {
  console.log('renderMenu ran')
  console.log(uniqueTags);
  $('#filters').empty();
  $('#menu').html(`
    <p>Select elements and submit to filter.</p>
    <form id='filters'></form>
    <p>Click <a onclick='renderAddWebsiteScreen()' class='text-link'>here</a> to add a new website.</p>
  `);
  for (let i = 0; i < uniqueTags.length; i++) {
    $('#filters').append(`
        <input type='checkbox' id='${uniqueTags[i]}' value='${uniqueTags[i]}' />
        <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
        <br>
    `);
  };
  $('#filters').append(`
    <a onclick='handleFilterClick()' class='text-link'>Submit</a>
  `)
};

function initiateGallery(data) {
  console.log('initiateGallery ran');
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  $('#gallery').empty();
  for (let i = 0; i < data.length; i++) {
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

function handleFilterClick() {
  console.log('handleFilterClick ran')
  let clickedFilters = [];
  let checkbox = document.forms[0];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      clickedFilters.push(checkbox[i].value);
    }
  };
  console.log(clickedFilters);
  $('#gallery').empty();
  for (let i = 0; i < allWebsites.length; i++) {
    let tagStr = allWebsites[i].tags;
    let tagArr = tagStr.split(',');
    if (clickedFilters.every(val => tagArr.indexOf(val) >= 0)) {
      let eachWebsite = `
        <div class='each-website' onclick='renderDetailScreen(${[i]})'>
          <h1 class='website-title'>${allWebsites[i].title}</h1>
          <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
          <h1 class='website-tags'>${allWebsites[i].tags}</h1>
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
  $('#tag-checkboxes').empty();
  for (let i = 0; i < uniqueTags.length; i++) {
  $('#tag-checkboxes').append(`
    <input type='checkbox' id='${uniqueTags[i]}' value='${uniqueTags[i]}' name='tags' />
    <label for='${uniqueTags[i]}'>${uniqueTags[i]}</label>
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
        <h1 class='website-title'>${allWebsites[i].title}</h1><a href='${allWebsites[i].url}' target="_blank">Visit</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <p class='website-tags'>${allWebsites[i].tags}</p>
        <p class='notes'>${allWebsites[i].notes}</p>
        <a onclick='renderEditWebsiteScreen(${i})' class='text-link'>Edit</a>
      </div>
    `)
};

function renderEditWebsiteScreen(i) {
  $('#website-detail').append(`
    <a onclick='getDataFromApi()' class='text-link'>Close</a>
    <div id='edit-tags'></div>
    <a onclick='handleEditSubmit()' class='text-link'>Submit</a>
    <a onclick='handleDelete()' class='text-link'>DELETE WEBSITE</a>
  `);
  for (let i = 0; i < data.tags.length; i++) {
    $('#edit-tags').append(`
      <input type='checkbox' id='${data.tags[i]}' value='${data.tags[i]}' />
      <label for='${data.tags[i]}'>${data.tags[i]}</label>
    `)
  }
};

getDataFromApi();