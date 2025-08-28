//전역변수
const API_BASE_URL = "http://localhost:8080";
let editingBookId = null;

//DOM 엘리먼트 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const submitButton = document.querySelector("button[type='submit']");
const cancelButton = document.querySelector(".cancel-btn");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});
//bookForm 의 Submit 이벤트 처리하기
bookForm.addEventListener("submit", function (event) {
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함
    event.preventDefault();
    console.log("Form 이 체출 되었음....")

    //FormData 객체생성 <form>엘리먼트를 객체로 변환
    const bookFormData = new FormData(bookForm);
    bookFormData.forEach((value, key) => {
        console.log(key + ' = ' + value);
    });

    //사용자 정의 Book Object Literal 객체생성 (공백 제거 trim())
    const bookData = {
        name: bookFormData.get("title").trim(),
        studentNumber: bookFormData.get("author").trim(),
        address: bookFormData.get("isbn").trim(),
        phoneNumber: bookFormData.get("price").trim(),
        email: bookFormData.get("publishDate") || null,
    }

    //유효성 체크하는 함수 호출하기
    if (!validateBook(bookData)) {
        //검증체크 실패하면 리턴하기
        return;
    }

}); //submit 이벤트

//Book 등록 함수
function createBook(bookData) {  
    fetch(`${API_BASE_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 등록에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            showSuccess("책이 성공적으로 등록되었습니다!");
            //입력 Form의 input의 값 초기화
            bookForm.reset();
            //resetForm();
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//createBook

//Book 삭제 함수
function deleteBook(bookId) {
    if (!confirm(`제목 = ${studentName} 책을 정말로 삭제하시겠습니까?`)) {
        return;
    }
    console.log('삭제처리 ...');
    fetch(`${API_BASE_URL}/api/books/${bookId}`, { 
        method: 'DELETE'
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 책입니다다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 삭제에 실패했습니다.')
                }
            }
            showSuccess("책이 성공적으로 삭제되었습니다!");
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//deleteBook

//책 수정전에 데이터를 로드하는 함수
function editBook(bookId) {
    fetch(`${API_BASE_URL}/api/students/${studentId}`)
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 학생입니다.');
                }
            }
            return response.json();
        })
        .then((student) => {
            //Form에 데이터 채우기
            bookForm.title.value = book.title;
            bookForm.author.value = book.author;
            bookForm.isbn.value = book.isbn;
            bookForm.price.value = book.price;
            studentForm.publishDate.value = student.publishDate || '';
            
            //수정 Mode 설정
            editingBookId = bookId;
            //버튼의 타이틀을 등록 => 수정으로 변경
            submitButton.textContent = "책 수정";
            //취소 버튼을 활성화
            cancelButton.style.display = 'inline-block';
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//editBook

//책 수정을 처리하는 함수
function updateBook(bookId, bookData) {
    fetch(`${API_BASE_URL}/api/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출 
                //errorData 객체는 서버의 ErrorObject와 매핑이 된다.
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(`${errorData.message} ( 에러코드: ${errorData.statusCode} )` || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '책 수정에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            showSuccess("책이 성공적으로 수정되었습니다!");
            //등록모드로 전환
            resetForm();
            //목록 새로 고침
            loadBooks();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//updateBook


//Book(책) 목록을 Load 하는 함수
function loadBooks() {
    console.log("책 목록 Load 중.....");
}

function validateBook(book) {// 필수 필드 검사
    if (!book.title) {
        alert("제목을 입력해주세요.");
        return false;
    }

    if (!book.author) {
        alert("저자를 입력해주세요.");
        return false;
    }

    if (!book.isbn) {
        alert("ISBN을 입력해주세요.");
        return false;
    }

    if (!book.price) {
        alert("가격을 입력해주세요.");
        return false;
    }
    return true;
}

function loadBooks() {
    console.log("책 목록 Load 중.....");
    fetch(`${API_BASE_URL}/api/books`) //Promise
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                throw new Error(`${errorData.message}`);
            }
            return response.json();
        })
        .then((books) => renderBookTable(books))
        .catch((error) => {
            console.log(error);
            alert(">>> 책 목록을 불러오는데 실패했습니다!.");
            //showError(error.message);
            bookTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #dc3545;">
                        오류: 데이터를 불러올 수 없습니다.
                    </td>
                </tr>
            `;
        });
};

function renderBookTable(books) {
    console.log(books);
    bookTableBody.innerHTML = "";
    // [{},{},{}] [] - students, {} - student
    books.forEach((book) => {
        //<tr> 엘리먼트를 생성하기 <tr><td>홍길동</td><td>aaa</td></tr>
        const row = document.createElement("tr");

        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.price}</td>
                    <td>${book.publishDate}</td>
                    <td>
                        <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
                        <button class="delete-btn" onclick="deleteBook(${book.id},'${sbook.title}')">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        bookTableBody.appendChild(row);
    });
}//renderStudentTable

//성공 메시지 출력
function showSuccess(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#28a745';
}
//에러 메시지 출력
function showError(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#dc3545';
}
//메시지 초기화
function clearMessages() {
    formErrorSpan.style.display = 'none';
}