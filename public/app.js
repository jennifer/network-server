const MOCK_SITE_DATA = {
	"siteData": [
        {
            "id": 1111111,
            "URL": "https://readymag.com/repponen/20inventions/",
            "desktopImg": "desktop1.png",
            "mobileImg": "mobile1.png",
            "tags": ["color", "font", "animation"]
            "added": 1470010176609
        },
        {
            "id": 2222222,
            "URL": "https://letsmuseeum.com/",
            "desktopImg": "desktop2.png",
            "mobileImg": "mobile2.png",
            "tags": ["color", "layout", "animation"]
            "added": 1470010276609
        },
        {
            "id": 3333333,
            "URL": "http://marinarachello.com/",
            "desktopImg": "desktop3.png",
            "mobileImg": "mobile3.png",
            "tags": ["color", "layout", "images"]
            "added": 1470010376609
        },
        {
            "id": 4444444,
            "URL": "http://christopherbabb.com/#navigation-desktop",
            "desktopImg": "desktop4.png",
            "mobileImg": "mobile4.png",
            "tags": ["images", "responsiveness"]
            "added": 1470010476609
        },
        {
            "id": 5555555,
            "URL": "http://belentenorio.com/",
            "desktopImg": "desktop5.png",
            "mobileImg": "mobile5.png",
            "tags": ["layout", "images"]
            "added": 1470010576609
        },
    ]
};

// GET all stored websites
  // Display all website images (screenshots) and their tags
    // Desktop: on hover, option to open or edit
    // Mobile: tap image to open or edit
function getAllWebsites(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_SITE_DATA)}, 1);
};



// POST a new webiste

// PUT edit existing tags (GET/POST/DELETE)

// DELETE a website

// Feature: toggle to show mobile or desktop screenshots
