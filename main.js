
let googleResponse;
function handleCredentialResponse(response) {
  console.log(response);
  if(response.credential){
    let jwt = response.credential;
    let user = JSON.parse(atob(jwt.split(".")[1]));
    console.log(user);
  }
}
window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "218511138494-r9tg3tm80vq1sdj546v9gatppoqf50io.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", size: "large" } // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialoga
};


// fetch("https://www.googleapis.com/drive/v3/files?q='root' in parents",{
//   method:'GET',
//   headers:new Headers({Authorization:"Bearer " + googleResponse.credential}),
// })
// .then((res) => res.json())
// .then((info) => {
//   console.log(info)
// })


////////////////////////////////// Indexed DB //////////////////////////////////

// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction =
  window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
window.IDBKeyRange =
  window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

if (!window.indexedDB) {
  window.alert(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
}
const dbVersion = 1;
const dbName = "flashcard";
const dbReq = indexedDB.open(dbName, dbVersion);
let db, dbTransaction;
let infoStore, dataStore;

dbReq.addEventListener("success", function (event) {
  db = event.target.result;
  dbTransaction = db.transaction(["info", "data"], "readwrite");
  infoStore = dbTransaction.objectStore("info");
  dataStore = dbTransaction.objectStore("data");
});

dbReq.addEventListener("error", function (event) {
  const error = event.target.error;
  console.log("error", error.name);
});
dbReq.addEventListener("upgradeneeded", function (event) {
  db = event.target.result;
  let oldVersion = event.oldVersion;
  if (oldVersion < 1) {
    infoStore = db.createObjectStore("info", { keyPath: "myKey" });
    dataStore = db.createObjectStore("data", {
      keyPath: "id",
      autoIncrement: true,
    });
    dataStore.createIndex("name", "name", { unique: false });
    dataStore.createIndex("email", "email", { unique: true });
  }
});

//////////////////////////////////

// List with handle
var sortable = Sortable.create(listWithHandle, {
  handle: ".bi-arrows-move",
  animation: 150,
  onEnd: function (event) {
    console.log("순서가변경됨");
    var sortedItems = sortable.toArray();
    console.log(sortedItems);
  },
});

///////////////////////////////
let modalEvent;
let newNote;
let noteEditTarget;
const noteNameModal = document.getElementById("noteNameModal");

// // 단어장 추가
// const createNote = function (){
//     // noteNameSample.html 파일을 불러옵니다.
//     fetch('noteNameSample.html')
//     .then(response => response.text())
//     .then(html => {
//         // 불러온 HTML 코드를 파싱합니다.
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, 'text/html');

//         // noteNameSample.html에서 원하는 요소를 선택합니다.
//         newNote = doc.querySelector('.card.list-group-item');

//         // 부모 요소에 자식 요소로 추가합니다.
//         const parentElement = document.getElementById('listWithHandle');
//         parentElement.appendChild(newNote);

//     })
//     .catch(error => {
//         console.error('파일을 불러오는 중 오류가 발생했습니다:', error);
//     });

// }

// 단어장 추가
const createNote = function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "noteNameSample.html", false); // 동기식으로 설정
  xhr.send();

  if (xhr.status === 200) {
    // 불러온 HTML 코드를 파싱합니다.
    const parser = new DOMParser();
    const doc = parser.parseFromString(xhr.responseText, "text/html");

    // noteNameSample.html에서 원하는 요소를 선택합니다.
    newNote = doc.querySelector(".card.list-group-item");

    // 부모 요소에 자식 요소로 추가합니다.
    const parentElement = document.getElementById("listWithHandle");
    parentElement.appendChild(newNote);
  } else {
    console.error("파일을 불러오는 중 오류가 발생했습니다:", xhr.status);
  }
};

// 단어장 추가 모달창 오픈
const noteCreateModalOpen = function (event) {
  modalEvent = "noteNameCreate";
  // const button = event.relatedTarget
  // const recipient = button.getAttribute('data-bs-whatever')
  const modalTitle = noteNameModal.querySelector(".modal-title");
  const modalBodyInput = noteNameModal.querySelector(".modal-body input");

  modalTitle.textContent = `단어장 이름 (추가)`;
  modalBodyInput.value = "";
};

// 단어장 수정 모달창 오픈
const noteEditModalOpen = function (event) {
  console.log(event.target);
  modalEvent = "noteNameEdit";
  const modalTitle = noteNameModal.querySelector(".modal-title");
  const modalBodyInput = noteNameModal.querySelector(".modal-body input");

  modalTitle.textContent = `단어장 이름 (수정)`;
  noteEditTarget = event.target.previousElementSibling;
  modalBodyInput.value = noteEditTarget.textContent;
};

// 단어장 모달창 입력 완료
var noteNameDone = document.querySelector("#submit-note-name");
noteNameDone.addEventListener("click", (event) => {
  if (modalEvent === "noteNameEdit") {
    noteEditTarget.textContent =
      noteNameModal.querySelector(".modal-body input").value;
  } else {
    createNote();
    newNote.querySelector("h3").textContent =
      noteNameModal.querySelector(".modal-body input").value;
    // 단어장 수정 이벤트리스너 연결
    document.querySelectorAll(".bi-pencil-fill").forEach((edit) => {
      edit.addEventListener("click", noteEditModalOpen);
    });
  }
});

// 기존에 있는 단어장 가져오기
createNote();
createNote();

// 단어장 수정 이벤트리스너 연결
document.querySelectorAll(".bi-pencil-fill").forEach((edit) => {
  edit.addEventListener("click", noteEditModalOpen);
});

// 단어장 추가 모달창 오픈 이벤트리스너 연결
document
  .querySelector("#add-note")
  .addEventListener("click", noteCreateModalOpen);
