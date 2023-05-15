
// List with handle
var sortable = Sortable.create(listWithHandle, {
  handle: '.bi-arrows-move',
  animation: 150,
  onEnd: function(event) {
    console.log('순서가변경됨');
    var sortedItems = sortable.toArray();
    console.log(sortedItems);
  }
});


///////////////////////////////
let modalEvent;
let newNote;
let noteEditTarget;
const noteNameModal = document.getElementById('noteNameModal')

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
    xhr.open('GET', 'noteNameSample.html', false); // 동기식으로 설정
    xhr.send();
  
    if (xhr.status === 200) {
      // 불러온 HTML 코드를 파싱합니다.
      const parser = new DOMParser();
      const doc = parser.parseFromString(xhr.responseText, 'text/html');
  
      // noteNameSample.html에서 원하는 요소를 선택합니다.
      newNote = doc.querySelector('.card.list-group-item');
  
      // 부모 요소에 자식 요소로 추가합니다.
      const parentElement = document.getElementById('listWithHandle');
      parentElement.appendChild(newNote);
    } else {
      console.error('파일을 불러오는 중 오류가 발생했습니다:', xhr.status);
    }
  };
  

// 단어장 추가 모달창 오픈
const noteCreateModalOpen = function(event){
    modalEvent = 'noteNameCreate';    
    // const button = event.relatedTarget
    // const recipient = button.getAttribute('data-bs-whatever')
    const modalTitle = noteNameModal.querySelector('.modal-title')
    const modalBodyInput = noteNameModal.querySelector('.modal-body input')

    modalTitle.textContent = `단어장 이름 (추가)`
    modalBodyInput.value = ''
}

// 단어장 수정 모달창 오픈 
const noteEditModalOpen = function(event){
    console.log(event.target);
    modalEvent = 'noteNameEdit';
    const modalTitle = noteNameModal.querySelector('.modal-title')
    const modalBodyInput = noteNameModal.querySelector('.modal-body input')

    modalTitle.textContent = `단어장 이름 (수정)`;
    noteEditTarget = event.target.previousElementSibling;
    modalBodyInput.value = noteEditTarget.textContent;
}


// 단어장 모달창 입력 완료
var noteNameDone = document.querySelector('#submit-note-name');
noteNameDone.addEventListener("click", (event) => {
    if (modalEvent === 'noteNameEdit') {
        noteEditTarget.textContent = noteNameModal.querySelector('.modal-body input').value;
    } else {
        createNote();
        newNote.querySelector('h3').textContent = noteNameModal.querySelector('.modal-body input').value;
        // 단어장 수정 이벤트리스너 연결
        document.querySelectorAll('.bi-pencil-fill').forEach(edit => {
            edit.addEventListener("click", noteEditModalOpen)
        })
    };
})


// 기존에 있는 단어장 가져오기
createNote();
createNote();


// 단어장 수정 이벤트리스너 연결
document.querySelectorAll('.bi-pencil-fill').forEach(edit => {
    edit.addEventListener("click", noteEditModalOpen)
})

// 단어장 추가 모달창 오픈 이벤트리스너 연결
document.querySelector('#add-note').addEventListener("click", noteCreateModalOpen)