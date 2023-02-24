const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');
// Background Image Btn
const backgroundImageBtn = document.getElementById('backgroundImage-Btn');

// Items
let updateOnLoad = false;
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// For background Image
// index we use for pictures array
let index = 0;
//shorthand variable for document body
const BODY = document.body;

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns = () => {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
};

// Set localStorage Arrays
const updateSavedColumns = () => {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, i) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
  });
};

// Filter Arrays to remove empty items
const filterArray = (array) => {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
};

// Create DOM Elements for each list item
const createItemEl = (columnEl, column, item, index) => {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.id = index;
  // listEl.contentEditable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.setAttribute('onclick', 'editable(event)');
  // Append
  columnEl.appendChild(listEl);
};

// additional function to handle click and make it also work in firefox
const editable = (el) => {
  // set the clicked list element as editable
  el.target.contentEditable = true;
  //set the focus on this element in order to be able to change the text
  // and to keep the drag functionality working
  el.target.focus();
};

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = () => {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
};

// Update Item - Delete if necessary, or update Array value
const updateItem = (id, column) => {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
  selectedArray[id] === selectedColumnEl[id].textContent ? updateDOM() : false;
};

// Add to Column List, Reset
const addToColumn = (column) => {
  const itemtext = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemtext);
  addItems[column].textContent = '';
  updateDOM();
};

// show/Hide Input functionality
const showHideInputBox = (column, visibility, display1, display2) => {
  addBtns[column].style.visibility = visibility;
  saveItemBtns[column].style.display = display1;
  addItemContainers[column].style.display = display2;
};

// Show Add item Input Box
const showInputBox = (column) => {
  showHideInputBox(column, 'hidden', 'flex', 'flex');
};

// Hide Add item Input Box
const hideInputBox = (column) => {
  showHideInputBox(column, 'visible', 'none', 'none');
  addToColumn(column);
};

// Allows arrays to reflect Drag and Drop Items
const rebuildArrays = () => {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map((i) => i.textContent);
  completeListArray = Array.from(completeList.children).map((i) => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);
  updateDOM();
};

// When Item Starts Dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

// Column Allows for Item to Drop
const allowDrop = (e) => {
  e.preventDefault();
};

// When Item Enters Column Area
const dragEnter = (column) => {
  listColumns[column].classList.add('over');
  currentColumn = column;
};

// Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add Item to Column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
};

//for applying CSS styles
const applyCssStyles = () => {
  BODY.style.backgroundPosition = 'center';
  BODY.style.backgroundSize = 'cover';
  BODY.style.backgroundAttachment = 'fixed';
};

// ↓ (optional) sets initial background value if first time visiting
// BODY.style.background = `url("./img/${pictures[0].name}.jpg")`;
// applyCssStyles();

const getUserImage = () => {
  const localImage = localStorage.getItem('userImage');
  //checks if user has made changes to their localstorage
  //if truthy grabs image and applies css
  localImage ? (BODY.style.background = `url("./img/${localImage}.jpg")`) : null;
  applyCssStyles();
};

const showImageOnClick = () => {
  index++;
  index > pictures.length - 1 ? (index = 0) : false;
  //variable we hold for the pictures.name at any given index we are at.
  const imageName = pictures[index].name;
  BODY.style.background = `url("./img/${imageName}.jpg")`;
  applyCssStyles();
  //everytime the click event happens we overwrite the image we want to store to localStorage
  localStorage.setItem('userImage', imageName);
};

// Event Listeners
backgroundImageBtn.addEventListener('click', showImageOnClick);

// On Load
updateDOM();
getUserImage();
