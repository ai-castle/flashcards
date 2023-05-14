// Simple list
// Sortable.create(simpleList, { /* options */ });

// List with handle
var sortable = Sortable.create(listWithHandle, {
  handle: '.glyphicon-move',
  swapThreshold: 1,
  animation: 150,
  onEnd: function(event) {
    console.log('순서가변경됨');
    var sortedItems = sortable.toArray();
    console.log(sortedItems);
  }
});


const draggables = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

draggables.forEach(draggable => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach(container => {
  container.addEventListener("dragover", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientX);
    const draggable = document.querySelector(".dragging");
    if (afterElement === undefined) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      // console.log(offset);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}




const edits = document.querySelectorAll('.glyphicon-pencil');
console.log(edits)

edits.forEach(edit => {
    edit.addEventListener("click", (event) => {
      let inputText = prompt();
      console.log(inputText)
      console.log(event.target)
      console.log(event.target.previousElementSibling.textContent) = inputText
    });
});