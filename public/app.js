'use strict';

/*
const MOCK_SITE_DATA = {
  "siteData": [
		{
			"userId": 1111111,
			"url": "https://readymag.com/repponen/20inventions/",
      "title": "‘20 Most Important Inventions of All Time’ by Anton Repponen | Readymag",
			"desktopImg": "desktop1.png",
			"mobileImg": "mobile1.png",
			"tags": ["color", "font", "animation"],
			"added": 1470010176609
		},
		{
			"userId": 2222222,
			"url": "https://letsmuseeum.com/",
      "title": "#letsmuseeum: Stell dir vor, du scrollst durch ein Museum – in echt.",
			"desktopImg": "desktop2.png",
			"mobileImg": "mobile2.png",
			"tags": ["color", "layout", "animation"],
			"added": 1470010276609
		},
		{
			"userId": 3333333,
			"url": "http://marinarachello.com/",
      "title": "Marina Rachello – Portfolio",
			"desktopImg": "desktop3.png",
			"mobileImg": "mobile3.png",
			"tags": ["color", "layout", "images"],
			"added": 1470010376609
		},
		{
			"userId": 4444444,
			"url": "http://christopherbabb.com/#navigation-desktop",
      "title": "Christopher Babb",
			"desktopImg": "desktop4.png",
			"mobileImg": "mobile4.png",
			"tags": ["images", "responsiveness"],
			"added": 1470010476609
		},
		{
			"userId": 5555555,
			"url": "http://belentenorio.com/",
      "title": "Belen Tenorio",
			"desktopImg": "desktop5.png",
			"mobileImg": "mobile5.png",
			"tags": ["layout", "images"],
			"added": 1470010576609
		},
	],
  
};
*/

const tags = ['color', 'font', 'layout', 'images', 'responsiveness', 'usability'];

function getDataFromApi(response) {
  fetch('/websites')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    renderWebsiteGallery(data);
  })
  .catch(function() {
      console.log('API request error');
  });
};

const clickedFilters = [];
function handleFilterClick() {
  console.log('handleFilterClick ran')
  let checkbox = document.forms[0];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      clickedFilters.push(checkbox[i].value);
    }
  };
  renderWebsiteGallery();
};

function renderWebsiteGallery(data) {
  console.log('renderWebsiteGallery ran');
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'none';
  $('#gallery').empty();
  if (clickedFilters.length === 0) {
    renderWebsites(data);
  }
  else {
    for (let i = 0; i < allWebsites.length; i++) {
      if (allWebsites[i].tags.includes(clickedFilters)) {
      console.log(allWebsites[i]);
      }
    }
  };
  renderMenu(data);
};

// clickedFilters.every(r=> allWebsites[i].tags.indexOf(r) >= 0);

const allWebsites = [];
function renderWebsites(data) {
  for (let i = 0; i < data.length; i++) {
    allWebsites.push(data[i]);
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
console.log(allWebsites);

function renderMenu(data) {
  console.log('renderMenu ran')
  $('#menu').html(`
    <p>Click an element to filter</p>
    <form id='filters'></form>
    <p>Click <a onclick='renderAddWebsiteScreen()' class='text-link'>here</a> to add a new website</p>
  `);
  renderTagFilters(data);
}

function renderTagFilters(data) {
  console.log('renderTagFilters ran');
  $('#filters').empty();
  for (let i = 0; i < data.length; i++) {
    $('#filters').append(`
        <input type='checkbox' id='${tags[i]}' value='${tags[i]}' />
        <label for='${tags[i]}'>${tags[i]}</label>
    `);
  }
  $('#filters').append(`
    <a onclick='handleFilterClick()' class='text-link'>Submit</a>
  `)
};

function renderAddWebsiteScreen() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'block';
  document.getElementById('website-detail').style.display = 'none';
  $('#add-website').append(`
    <a onclick='renderWebsiteGallery(data)'>Close</a>
    <form class='new-website'>
      <fieldset name='new-url'>
        <legend>Add a new website</legend>
        <label for='url-input'>Enter a URL</label>
        <input type='text' class='url-input' />
        <label for='tag-checkboxes'>Tag website elements</label>
        <div id='tag-checkboxes'></div>
      </fieldset>
    </form>
    <a onclick='handleNewUrlSubmit()'>Submit</a>
  `);
  renderTagEditor()
};

function renderTagEditor() {
  console.log('renderTagEdit ran');
  for (let i = 0; i < data.tags.length; i++) {
  $('#tag-checkboxes').append(`
    <div>
      <input type='checkbox' id='${data.tags[i]}' value='${data.tags[i]}' />
      <label for='${data.tags[i]}'>${data.tags[i]}</label>
    </div>
  `)}
};

function handleNewUrlSubmit() {
  console.log('handleNewUrlSubmit ran')
  // get, store, and render title
  // get, store, and render screenshots
  // get, store, and render tags
  // get and store notes field
};

function renderDetailScreen(i) {
  console.log('handleThumbnailClick ran');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'block';
   $('#website-detail').empty().append(`
      <div class='each-website' onclick=''>
        <a onclick='renderWebsiteGallery(data)' class='text-link'>Close</a>
        <h1 class='website-title'>${data[i].title}</h1><a href='${data[i].url}' target="_blank">Visit</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${data[i].tags}</h1><a onclick='renderEditScreen(${i})' class='text-link'>Edit</a>
      </div>
    `);
};

function renderEditScreen(i) {
  $('#website-detail').append(`
    <a onclick='renderWebsiteGallery(data)' class='text-link'>Close</a>
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

function handleEditSubmit() {
  console.log('handleEditSubmit ran')
  // get, store, and render tags
  // get and store notes field
};


getDataFromApi();