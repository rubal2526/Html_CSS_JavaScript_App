//전역변수
const API_BASE_URL = "http://localhost:8080";

//DOM 엘리먼트 가져오기
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function() {
    loadStudents();
});
//StudentForm 의 Submit 이벤트 처리하기
studentForm.addEventListener("submit", function(event){
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함
    event.preventDefault();
    console.log("Form 이 체출 되었음....")

    //FormData 객체생성 <form>엘리먼트를 객체로 변환
    const stuFormData = new FormData(studentForm);
    stuFormData.forEach((value, key) => {
        console.log(key + ' = ' +  value);
    });

    //사용자 정의 Student Object Literal 객체생성 (공백 제거 trim())
    const studentData = {
        name: stuFormData.get("name").trim(),
        studentNumber: stuFormData.get("studentNumber").trim(),
        address: stuFormData.get("address").trim(),
        phoneNumber: stuFormData.get("phoneNumber").trim(),
        email: stuFormData.get("email").trim(),
        dateOfBirth: stuFormData.get("dateOfBirth"),
    }

}); //submit 이벤트

    //Student(학생) 목록을 Load 하는 함수
    function loadStudents() {
        console.log("학생 목록 Load 중.....");
    }