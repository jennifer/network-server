'use strict';

const MOCK_SITE_DATA = {
	"siteData": [
		{
			"id": 1111111,
			"URL": "https://readymag.com/repponen/20inventions/",
      "title": "‘20 Most Important Inventions of All Time’ by Anton Repponen | Readymag"
			"desktopImg": "desktop1.png",
			"mobileImg": "mobile1.png",
			"tags": ["color", "font", "animation"]
			"added": 1470010176609
		},
		{
			"id": 2222222,
			"URL": "https://letsmuseeum.com/",
      "title": "#letsmuseeum: Stell dir vor, du scrollst durch ein Museum – in echt."
			"desktopImg": "desktop2.png",
			"mobileImg": "mobile2.png",
			"tags": ["color", "layout", "animation"]
			"added": 1470010276609
		},
		{
			"id": 3333333,
			"URL": "http://marinarachello.com/",
      "title": "Marina Rachello – Portfolio"
			"desktopImg": "desktop3.png",
			"mobileImg": "mobile3.png",
			"tags": ["color", "layout", "images"]
			"added": 1470010376609
		},
		{
			"id": 4444444,
			"URL": "http://christopherbabb.com/#navigation-desktop",
      "title": "Christopher Babb"
			"desktopImg": "desktop4.png",
			"mobileImg": "mobile4.png",
			"tags": ["images", "responsiveness"]
			"added": 1470010476609
		},
		{
			"id": 5555555,
			"URL": "http://belentenorio.com/",
      "title": "Belen Tenorio"
			"desktopImg": "desktop5.png",
			"mobileImg": "mobile5.png",
			"tags": ["layout", "images"]
			"added": 1470010576609
		},
	]
};



    `<div>
      <h1 class='website-title'>${MOCK_SITE_DATA.siteData.title}</h1>
      <img src='./test-images/sample-site.png' alt='screenshot of website' />
      <h1 class='website-tags'>${MOCK_SITE_DATA.siteData.tags}</h1>
    </div>`