'use strict';

const MOCK_SITE_DATA = {
  "siteData": [
		{
			"id": 1111111,
			"URL": "https://readymag.com/repponen/20inventions/",
      "title": "‘20 Most Important Inventions of All Time’ by Anton Repponen | Readymag",
			"desktopImg": "desktop1.png",
			"mobileImg": "mobile1.png",
			"tags": ["color", "font", "animation"],
			"added": 1470010176609
		},
		{
			"id": 2222222,
			"URL": "https://letsmuseeum.com/",
      "title": "#letsmuseeum: Stell dir vor, du scrollst durch ein Museum – in echt.",
			"desktopImg": "desktop2.png",
			"mobileImg": "mobile2.png",
			"tags": ["color", "layout", "animation"],
			"added": 1470010276609
		},
		{
			"id": 3333333,
			"URL": "http://marinarachello.com/",
      "title": "Marina Rachello – Portfolio",
			"desktopImg": "desktop3.png",
			"mobileImg": "mobile3.png",
			"tags": ["color", "layout", "images"],
			"added": 1470010376609
		},
		{
			"id": 4444444,
			"URL": "http://christopherbabb.com/#navigation-desktop",
      "title": "Christopher Babb",
			"desktopImg": "desktop4.png",
			"mobileImg": "mobile4.png",
			"tags": ["images", "responsiveness"],
			"added": 1470010476609
		},
		{
			"id": 5555555,
			"URL": "http://belentenorio.com/",
      "title": "Belen Tenorio",
			"desktopImg": "desktop5.png",
			"mobileImg": "mobile5.png",
			"tags": ["layout", "images"],
			"added": 1470010576609
		},
	],
  "tags": ['color', 'font', 'layout', 'images', 'responsiveness', 'usability']
};

function getDataFromApi(callback) {
  // Get data from mongo db
};

function renderWebsiteGallery(MOCK_SITE_DATA) {
  console.log('renderWebsiteGallery ran');
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('menu').style.display = 'block';
  document.getElementById('add-website').style.display = 'none';
  for (let i = 0; i < MOCK_SITE_DATA.siteData.length; i++) {
    let eachWebsite = 
      `<div class='each-website' onclick='handleThumbnailClick(${[i]})'>
        <h1 class='website-title'>${MOCK_SITE_DATA.siteData[i].title}</h1>
        <img src='./test-images/sample-site.png' class='website-image' alt='screenshot of website' />
        <h1 class='website-tags'>${MOCK_SITE_DATA.siteData[i].tags}</h1>
      </div>`;
    $('.gallery').append(eachWebsite);
    // let gallery = document.getElementById('gallery');
    // document.gallery.insertAdjacentHTML('afterend', eachWebsite);
  };
  renderTagFilters();
};

function renderTagFilters() {
  console.log('renderTagFilters ran');
  for (let i = 0; i < MOCK_SITE_DATA.tags.length; i++) {
    $('.filters').append(
      `<div>
        <input type='checkbox' id='${MOCK_SITE_DATA.tags[i]}' value='${MOCK_SITE_DATA.tags[i]}' />
        <label for='${MOCK_SITE_DATA.tags[i]}'>${MOCK_SITE_DATA.tags[i]}</label>
      </div>`
    );
  }
};

function handleFilterClick() {
  // check against sites db collection
};

function handleAddWebsiteClick() {
  // renderNewUrlScreen
};

function renderNewUrlScreen() {
  document.getElementById('add-website').style.display = 'block';
  document.getElementById('gallery').style.display = "none";
  document.getElementById('menu').style.display = "none";
};

function renderTagEditor() {
  console.log('renderTagEdit ran');
  for (let i = 0; i < MOCK_SITE_DATA.tags.length; i++) {
  $('.tag-checkboxes').append(
    `<div>
      <input type='checkbox' id='${MOCK_SITE_DATA.tags[i]}' value='${MOCK_SITE_DATA.tags[i]}' />
      <label for='${MOCK_SITE_DATA.tags[i]}'>${MOCK_SITE_DATA.tags[i]}</label>
    </div>`
  )}
};

function handleNewUrlSubmit() {
  console.log('handleNewUrlSubmit ran')
  // get, store, and render title
  // get, store, and render screenshots
  // get, store, and render tags
  // get and store notes field
};

function handleThumbnailClick(index) {
  console.log('handleThumbnailClick ran');
  console.log(index)
  // renderEditScreen
};

function renderDetailScreen() {
  // hide website gallery
  // show large screenshot, notes, tags
  // show visit and edit links
};

function handleEditSubmit() {
  // get, store, and render tags
  // get and store notes field
};


renderWebsiteGallery(MOCK_SITE_DATA);
// renderTagFilters(MOCK_SITE_DATA);
renderTagEditor(MOCK_SITE_DATA);