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
    renderGallery(data);
    createGalleryArray(data);
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
  renderFilters(data);
};

const clickedFilters = [];
function handleFilterClick() {
  console.log('handleFilterClick ran')
  // if (clickedFilters.length !== 0) {
    // clickedFilters = []
  // };
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

function renderFilters(data) {
  console.log('renderFilters ran');
  $('#filters').empty();
  for (let i = 0; i < data.length; i++) {
    $('#filters').append(`
        <input type='checkbox' id='${tags[i]}' value='${tags[i]}' />
        <label for='${tags[i]}'>${tags[i]}</label>
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
    <a onclick='renderGallery(gallerySites)'class='text-link'>Close</a>
    <form class='new-website' method='POST' action='/websites'>
      <fieldset name='new-url'>
        <legend>Add a new website</legend>
        <label for='url-input'>Enter a URL</label>
        <input type='text' class='url-input' name='url' /><br>
        <label for='tag-checkboxes'>Tag website elements</label>
        <div id='tag-checkboxes'></div>
        <input type='submit' value='Submit' class='text-link'>
      </fieldset>
    </form>
  `);
  renderTagEditor()
};

//<a onclick='handleNewUrlSubmit(url)' class='text-link'>Submit</a>

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

function handleNewUrlSubmit(data) {
  console.log('handleNewUrlSubmit ran');
  console.log('Adding ' + url);
  
};

/*
fetch('/websites', {
    method: 'POST',
    body: JSON.stringify('NEW WEBSITE'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
  .then(res=>res.json())
  .then(res => console.log(res))
 
  .catch(function() {
    console.log('API request error');
  });
*/
// get, store, and render title
// get, store, and render screenshots
// get, store, and render tags
// get and store notes field
/*
$.ajax({
    method: 'POST',
    url: RECIPES_URL,
    data: JSON.stringify(recipe),
    success: function(data) {
      getAndDisplayRecipes();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
*/

/*
function getWebsiteByID(value) {
  console.log(value);
};
*/

function renderDetailScreen(i) {
  console.log('handleThumbnailClick ran');
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('add-website').style.display = 'none';
  document.getElementById('website-detail').style.display = 'block';
   $('#website-detail').empty().append(`
      <div class='each-website' onclick=''>
        <a onclick='renderGallery(data)' class='text-link'>Close</a>
        <h1 class='website-title'>${gallerySites[i].title}</h1><a href='${gallerySites[i].url}' target="_blank">Visit</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${gallerySites[i].tags}</h1><a onclick='renderEditScreen(${i})' class='text-link'>Edit</a>
      </div>
    `);
};

function renderEditScreen(i) {
  $('#website-detail').append(`
    <a onclick='renderGallery(data)' class='text-link'>Close</a>
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