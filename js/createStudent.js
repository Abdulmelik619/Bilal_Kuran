async function getStarted() {
  let studentSections = document.getElementById("studentClass");
  let backendStudentSections = await fetch(
    "http://localhost:3000/student/getallsections",
    {
      method: "GET",
    }
  );
  backendStudentSections = await backendStudentSections.json();
  backendStudentSections.forEach((eachSection) => {
    studentSections.innerHTML += `<option>${eachSection.sectionName}</option>
    `;
  });

  let studentFilterClass = document.getElementById("studentFilterClass");
  studentFilterClass.innerHTML += "<option>All Sections</option>";
  backendStudentSections.forEach((backendSection) => {
    studentFilterClass.innerHTML += `
    <option>${backendSection.sectionName}</option>
    `;
  });

  let studentsTable = document.getElementById("studentsBody");
  studentsTable.innerHTML = "";
  let result = await fetch("http://localhost:3000/student/getallstudents", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  result = await result.json();
  let i = 0;
  result.forEach((student) => {
    i++;
    studentsTable.innerHTML += `
    <tr>
      <td>${i}</td>
      <td>${student.firstName}</td>
      <td>${student.middleName}</td>
      <td>${student.lastName}</td>
      <td>${student.studentAge}</td>
      <td>${student.studentClass}</td>
      <td>${student.dateCreated}</td>
      <td>
          <i data-id = ${student._id} onclick = 'editProfile(this)' class="fas fa-fw fa-edit"></i>
      </td>
      <td><i data-id = ${student._id} onclick = 'deleteProfile(this)' class="fas fa-fw fa-trash"></i></td>
      </tr>
    `;
  });
}

getStarted();

// ################################### Create Student #############################
let createFirstName = document.getElementById("firstName");
let createMiddleName = document.getElementById("middleName");
let createLastName = document.getElementById("lastName");
let createStudentAge = document.getElementById("age");
let createStudentClass = document.getElementById("studentClass");
let saveBtn = document.getElementById("createBtn");
let today = new Date().toISOString().slice(0, 10);

saveBtn.addEventListener("click", async () => {
  let result = await fetch("http://localhost:3000/student/addstudent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: createFirstName.value,
      middleName: createMiddleName.value,
      lastName: createLastName.value,
      studentAge: createStudentAge.value,
      studentClass:
        createStudentClass.options[createStudentClass.selectedIndex].text,
      dateCreated: today,
    }),
  });
  location.reload();
  return false;
});

// ###############################Edit Profile######################################
let edit = document.getElementById("editProfile");
async function editProfile(caller) {
  let backendStudentSections = await fetch(
    "http://localhost:3000/student/getallsections",
    {
      method: "GET",
    }
  );
  backendStudentSections = await backendStudentSections.json();

  backendStudentSections.forEach((element) => {
    studentClass.innerHTML += `<option>${element.sectionName}</option>
    `;
  });
  edit.dataset.id = `${caller.dataset.id}`;
  edit.style.visibility = "visible";
  edit.style.top = "50%";
  edit.style.transform = "translate(-50%, -50%) scale(1)";
}

let editSaveBtn = document.getElementById("editSaveBtn");
let firstName = document.getElementById("editFirstName");
let middleName = document.getElementById("editMiddleName");
let lastName = document.getElementById("editLastName");
let studentAge = document.getElementById("editAge");
let studentClass = document.getElementById("editStudentClass");

editSaveBtn.addEventListener("click", async () => {
  let result = await fetch("http://localhost:3000/student/editstudent", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentId: edit.dataset.id,
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
      studentAge: studentAge.value,
      studentClass: studentClass.options[studentClass.selectedIndex].text,
    }),
  });

  location.reload();
  return false;
});

let editCloseBtn = document.getElementById("editCloseBtn");
editCloseBtn.addEventListener("click", () => {
  edit.dataset.id = "";
  edit.style.visibility = "hidden";
  edit.style.top = "0";
  edit.style.transform = "translate(-50%, -50%) scale(0.1)";
});

// ##################################### Delete Profile ###########################################
let delProfile = document.getElementById("deleteProfile");
function deleteProfile(caller) {
  delProfile.dataset.id = `${caller.dataset.id}`;
  delProfile.style.visibility = "visible";
  delProfile.style.top = "50%";
  delProfile.style.transform = "translate(-50%, -50%) scale(1)";
}

let deleteNo = document.getElementById("deleteNo");
deleteNo.addEventListener("click", () => {
  delProfile.dataset.id = "";
  delProfile.style.visibility = "hidden";
  delProfile.style.top = "0";
  delProfile.style.transform = "translate(-50%, -50%) scale(0.1)";
});

let deleteYes = document.getElementById("deleteYes");
deleteYes.addEventListener("click", async () => {
  let result = await fetch("http://localhost:3000/student/deletestudent", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentId: delProfile.dataset.id,
    }),
  });
  result = await result.json();
  location.reload();
  return false;
});

// ############################ Filter Classes ####################################
let filterBtn = document.getElementById("filterClass");
let filteredClass = document.getElementById("studentFilterClass");
filterBtn.addEventListener("click", async () => {
  if (
    filteredClass.options[filteredClass.selectedIndex].text == "All Sections"
  ) {
    location.reload();
    return false;
  }
  let result = await fetch(
    "http://localhost:3000/student/getstudentsbysection",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sectionName: filteredClass.options[filteredClass.selectedIndex].text,
      }),
    }
  );
  result = await result.json();
  let studentsBody = document.getElementById("studentsBody");
  studentsBody.innerHTML = "";
  let i = 0;
  result.forEach((student) => {
    i++;
    studentsBody.innerHTML += `<tr>
    <td>${i}</td>
    <td>${student.firstName}</td>
    <td>${student.middleName}</td>
    <td>${student.lastName}</td>
    <td>${student.studentAge}</td>
    <td>${student.studentClass}</td>
    <td>${student.dateCreated}</td>
    <td>
        <i data-id = ${student._id} onclick = 'editProfile(this)' class="fas fa-fw fa-edit"></i>
    </td>
    <td><i data-id = ${student._id} onclick = 'deleteProfile(this)' class="fas fa-fw fa-trash"></i></td>
    </tr>
    `;
  });
});
