"use strict";

console.log("Starting JS");

/* ---------- Single Page Application ---------- */

// hide all pages
/* function hideAllPages() {
  let pages = document.querySelectorAll(".page");
  for (let page of pages) {
    page.style.display = "none";
  }
} */

// show page or tab
/* function showPage(pageId) {
  hideAllPages();
  document.querySelector(`${pageId}`).style.display = "block";
  showLoader(false);
} */

// navigate to a new view/page by changing href
/*
function navigateTo(pageId) {
  location.href = `${pageId}`;
}
*/

//Creating a variables to reset the search input field and value on page change
/*
let searchInput = document.querySelector('#search-field');
let searchQuery = "";
*/

// set default page or given page by the hash url
// function is called 'onhashchange'
/* function pageChange() {
  showLoader(true);
  let page = "#information-page";
  if (location.hash) {
    page = location.hash;
  }
  //resetSearch();
  showPage(page);

  console.log("changing page");
} */

// pageChange(); // called by default when the app is loaded for the first time


/* ---------- Change information function ---------- */

let mapHtmlTemplate = "";

function changeDestination(givenDestinationId) {
  let theDestination;
  let chaptersHtmlTemplate = "";
  let breadcrumbsHtmlTemplate = "";

  for (const destination of _information) {
    if (destination.id == givenDestinationId) {
      theDestination = destination;
    }
  }

  if (theDestination != null) {

    if (theDestination.mapImg != null) {
      mapHtmlTemplate = "";

      if (theDestination.mapImg == "") {
        document.getElementById("interactive-map-container").style.height = "70vh";
        document.getElementById("interactive-map-container").style.width = "100%";
        
        mapHtmlTemplate += /*html*/`
          <p id="missing-map">This area is missing a map</p>
        `;
      } else {
        document.getElementById("interactive-map-container").style.height = "auto";
        document.getElementById("interactive-map-container").style.width = "auto";

        mapHtmlTemplate += /*html*/`
          ${theDestination.mapImg}
        `;
      }
    }

    if (theDestination.onTheMap != null) {
      for (const element of theDestination.onTheMap) {
        mapHtmlTemplate += /*html*/`
          <a id="${element.id}" style="top: ${element.top}; left: ${element.left};" onclick="changeDestination('${element.id}')">${element.name}</a>
        `;
      }
    }

    if (theDestination.breadcrumbs != null) {
      for (const breadcrumb of theDestination.breadcrumbs) {
        breadcrumbsHtmlTemplate += /*html*/`
          <a onclick="changeDestination('${breadcrumb.id}')">${breadcrumb.name}</a>
          <img src="img/arrow-right.svg" alt="">
        `;
      }
      if (theDestination.bottomName == "") {
        breadcrumbsHtmlTemplate += /*html*/`
          <a id="last-breadcrumb">${theDestination.topName}</a>
        `;
      }
      else {
        breadcrumbsHtmlTemplate += /*html*/`
          <a id="last-breadcrumb">${theDestination.bottomName}</a>
        `;
      }
    }

    chaptersHtmlTemplate += /*html*/`
      <div class="line-container">
        <span class="dot1"></span>
        <span class="dot2"></span>
        <span class="line"></span>
        <span class="dot2"></span>
        <span class="dot1"></span>
      </div>
    `;
    if (theDestination.chapters != null) {
      for (const chapter of theDestination.chapters) {
        chaptersHtmlTemplate += /*html*/`
          <a id="${chapter.chapterId}" onclick="changeChapter('${theDestination.id}','${chapter.chapterId}')">${chapter.chapterName}</a>
          <div class="line-container">
            <span class="dot1"></span>
            <span class="dot2"></span>
            <span class="line"></span>
            <span class="dot2"></span>
            <span class="dot1"></span>
          </div>
        `;
      }
    }

    document.querySelector('#top-name').innerHTML = theDestination.topName;
    document.querySelector('#interactive-map-container').innerHTML = mapHtmlTemplate;
    document.querySelector('#breadcrumbs').innerHTML = breadcrumbsHtmlTemplate;
    document.querySelector('#bottom-name').innerHTML = theDestination.bottomName;
    document.querySelector('#chapter-menu').innerHTML = chaptersHtmlTemplate;
    document.querySelector('#chapter-text').innerHTML = "";

    //Calling chapter function to set a default start chapter
    if (theDestination.chapters != null) {
      changeChapter(theDestination.id, theDestination.chapters[0].chapterId);
    }
  }
}


/* ---------- Change chapter function ---------- */

function changeChapter(activeDestinationId, givenChapterId) {
  let activeDestination;
  let theChapter;
  let htmlTemplate = "";
  let developmentNotesHtmlTemplate = "";

  for (const destination of _information) {
    if (destination.id == activeDestinationId) {
      activeDestination = destination;
    }
  }

  for (const chapter of activeDestination.chapters) {
    if (chapter.chapterId == givenChapterId) {
      theChapter = chapter;
    }
  }

  for (const note of theChapter.chapterDevelopmentNotes) {
    developmentNotesHtmlTemplate += /*html*/`
      <li>
        <div class="development-note-flex">
          <p class="development-note-date">${note.date}</p>
          <p class="development-note-text">${note.description}</p>
        </div>
      </li>
    `;
  }
  
  htmlTemplate += /*html*/`
    <h3>${theChapter.chapterName}</h3>
    <p>${theChapter.chapterText}</p>
    <div id="development-notes">
      <h3>Development Notes</h3>
      <ul>${developmentNotesHtmlTemplate}</ul>
    </div>
  `;

  // sets chapter menu item active
  let chapters = document.querySelectorAll("#chapter-menu a");

  for (let chapter of chapters) {
    if (theChapter.chapterId === chapter.getAttribute("id")) {
      chapter.classList.add("chapter-menu-active");
    } else {
      chapter.classList.remove("chapter-menu-active");
    }
  }


  document.querySelector('#chapter-text').innerHTML = htmlTemplate;
}


/* ---------- Loading animation show/hide function ---------- */

function showLoader(show) {
    let loader = document.querySelector('#loader');
    if (show) {
      loader.classList.remove("hide");
    } else {
      loader.classList.add("hide");
    }
}


/* ---------- Fetch json file ---------- */

let _information = [];

//Fetching the information from my json file
fetch('json/information.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    _information = json

    //Calling function to set a default start page
    changeDestination('w');
    showLoader(false);
  });

console.log("Reached the bottom of JS");



/* --- Alternative way to display specific information on the map. --- */
// This could work instead of having variables onTheMap
// and Breadcrumbs in every object of information.json.

/*
let _testObject = [
  {
    id: '1',
    text: '1. outer object',
    objects: [
      {
        id: '1A',
        text: '1. outer object - 1. middle object',
        objects: [
          {
            id: '1Aa',
            text: '1. outer object - 1. middle object - 1. inner object'
          },
          {
            id: '1Ab',
            text: '1. outer object - 1. middle object - 2. inner object'
          },
          {
            id: '1Ac',
            text: '1. outer object - 1. middle object - 3. inner object'
          }
        ]
      },
      {
        id: '1B',
        text: '1. outer object - 2. middle object',
        objects: [
          {
            id: '1Ba',
            text: '1. outer object - 2. middle object - 1. inner object'
          },
          {
            id: '1Bb',
            text: '1. outer object - 2. middle object - 2. inner object'
          },
          {
            id: '1Bc',
            text: '1. outer object - 2. middle object - 3. inner object'
          }
        ]
      },
      {
        id: '1C',
        text: '1. outer object - 3. middle object',
        objects: [
          {
            id: '1Ca',
            text: '1. outer object - 3. middle object - 1. inner object'
          },
          {
            id: '1Cb',
            text: '1. outer object - 3. middle object - 2. inner object'
          },
          {
            id: '1Cc',
            text: '1. outer object - 3. middle object - 3. inner object'
          }
        ]
      }
    ]
  }
];

let theInformation;

function findTheInformation(givenOuterId, givenMiddleId, givenInnerId) {

  for (const outer of _testObject) {
    if (outer.id === givenOuterId) {
      theInformation = outer;
    }
  }

  if (givenMiddleId != null) {
    for (const middle of theInformation.objects) {
      if (middle.id === givenMiddleId) {
        theInformation = middle;
      }
    }
  }
  
  if (givenInnerId != null) {
    for (const inner of theInformation.objects) {
      if (inner.id === givenInnerId) {
        theInformation = inner;
      }
    }
  }

  console.log (theInformation);
  testChangeInfo();
}

function testChangeInfo () {
  let testHtmlTemplate = "";
  let testArrayObjectHtmlTemplate = "";

  if (theInformation.objects != null) {
    
    for (const object of theInformation.objects) {
      
      testArrayObjectHtmlTemplate += /*html*//*`
        <li>${object.text}</li>
      `;
    }
  }
  

  testHtmlTemplate += /*html*//*`
    <h3>${theInformation.text}</h3>
    <p>${theInformation.id}</p>
    <ul>
      ${testArrayObjectHtmlTemplate}
    </ul>
  `;

  document.querySelector('#test-container').innerHTML = testHtmlTemplate;
}

findTheInformation('1', '1C', '1Ca');
*/
