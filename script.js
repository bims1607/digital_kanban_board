const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContaiers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

const listColumn = document.querySelectorAll(".drag-item-list");
const backLogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

let updatedOnLoad = false;

let backLogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backLogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backLogListArray = ["Release the course", "sit back and relax"];
    progressListArray = ["work on projct", "listen to music"];
    completeListArray = ["being cool", "getting stuff done"];
    onHoldListArray = ["being uncool"];
  }
}

getSavedColumns();

function updateSavedColumns() {
  listArrays = [
    backLogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

updateSavedColumns();

// createing dom element for each list item

function createItemEL(columnEl, column, item, index) {
  //   console.log("columnEl", columnEl);
  //   console.log("column", column);
  //   console.log("item", item);
  //   console.log("index", index);

  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  backLogList.textContent = null;
  backLogListArray.forEach((backlogItem, index) => {
    createItemEL(backLogList, 0, backlogItem, index);
  });

  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEL(progressList, 1, progressItem, index);
  });

  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEL(completeList, 2, completeItem, index);
  });

  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEL(onHoldList, 3, onHoldItem, index);
  });
  updatedOnLoad = true;
  updateSavedColumns();
}
//dragging function

function drag(e) {
  draggedItem = e.target;
  console.log("draggedItem:", draggedItem);
}

//columns allow items to drop

//when item on column area

function dragEnter(column) {
  listColumn[column].classList.add("over");
  currentColumn = column;
}

function allowDrop(e) {
  e.preventDefault();
}

function addTocolumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContaiers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContaiers[column].style.display = "none";
  addTocolumn(column);
}

//allow arrays to reflect drag and drop items
function rebuildArrays() {
  backLogListArray = [];
  for (let i = 0; i < backLogList.children.length; i++) {
    backLogListArray.push(backLogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

//droping item in column
function drop(e) {
  e.preventDefault();
  //remover over class
  listColumn.forEach((column) => {
    column.classList.remove("over");
  });
  //add item to column
  const parent = listColumn[currentColumn];
  parent.appendChild(draggedItem);
  rebuildArrays();
}
updateDOM();
