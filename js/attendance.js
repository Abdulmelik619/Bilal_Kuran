let studentsList = [];
let today = new Date().toISOString().slice(0, 10);
async function run() {
  let takenDates = await fetch("http://localhost:3000/student/gettakendays", {
    method: "GET",
  });
  takenDates = await takenDates.json();
  if (takenDates.indexOf(today) != -1) {
    let home = document.getElementById("home");
    home.innerHTML =
      "<h1 class= 'text-center'>Today's attendance already taken</h1>";
    return;
  } else {
    let studentSections = document.getElementById("studentClass");
    let backendStudentSections = await fetch(
      "http://localhost:3000/student/getallsections",
      {
        method: "GET",
      }
    );
    backendStudentSections = await backendStudentSections.json();
    studentSections.innerHTML += "<option>All Sections</option>";
    backendStudentSections.forEach((eachSection) => {
      studentSections.innerHTML += `<option>${eachSection.sectionName}</option>
      `;
    });

    let result = await fetch("http://localhost:3000/student/getallstudents", {
      method: "GET",
    });
    result = await result.json();

    let attendanceBody = document.getElementById("attendanceBody");
    attendanceBody.innerHTML = "";
    let i = 0;
    result.forEach((student) => {
      studentsList.push(student._id);
      i++;
      attendanceBody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${student.firstName}</td>
      <td>${student.middleName}</td>
      <td>${student.lastName}</td>
      <td>${student.studentAge}</td>
      <td>${student.studentClass}</td>
      <td><input
      name="check"
      type="checkbox"
      class="form-control"
      data-id = ${student._id}
      onclick = 'registerAttendance(this)'
    /></td>
      `;
    });
  }

  let filterBtn = document.getElementById("filterAttendance");
  let filteredClass = document.getElementById("studentClass");
  filterBtn.addEventListener("click", async () => {
    if (
      filteredClass.options[filteredClass.selectedIndex].text == "All Sections"
    ) {
      location.reload();
      return false;
    }
    studentsList = [];
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
    let attendanceBody = document.getElementById("attendanceBody");
    attendanceBody.innerHTML = "";
    let i = 0;
    result.forEach((student) => {
      studentsList.push(student._id);
      i++;
      attendanceBody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${student.firstName}</td>
      <td>${student.middleName}</td>
      <td>${student.lastName}</td>
      <td>${student.studentAge}</td>
      <td>${student.studentClass}</td>
      <td><input
      name="check"
      type="checkbox"
      class="form-control"
      data-id = ${student._id}
      onclick = 'registerAttendance(this)'
    /></td>
      `;
    });
  });

  let attendance = [];
  function registerAttendance(caller) {
    attendance.push(caller.dataset.id);
  }

  let attendanceBtn = document.getElementById("takeAttendace");
  attendanceBtn.addEventListener("click", async () => {
    for (let i = 0; i < studentsList.length; i++) {
      ele = studentsList[i];
      if (attendance.indexOf(ele) == -1) {
        let result = await fetch("http://localhost:3000/student/addabscent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: ele,
            dateofabscent: today,
          }),
        });
        result = await result.json();
      }
    }
    await fetch("http://localhost:3000/student/addDate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: today,
      }),
    });
    let doneAttendance = document.getElementById("done");
    doneAttendance.style.visibility = "visible";
    doneAttendance.style.top = "50%";
    doneAttendance.style.transform = "translate(-50%, -50%) scale(1)";
  });

  let closeSuccess = document.getElementById("closeSuccess");
  closeSuccess.addEventListener("click", () => {
    location.reload();
    return false;
  });
}

run();
