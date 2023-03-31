let attendaceByStudent = document.getElementById("attendaceByStudent");
let container = document.getElementById("container"); // the displayed option when a button is first clicked is added here
let printable = document.getElementById("printable"); //the printed content is stored here
let containerMain = document.getElementById("containerMain"); //it contains everything but must not be edited
attendaceByStudent.addEventListener("click", async () => {
  container.innerHTML = "";
  let students = await fetch("http://localhost:3000/student/getallstudents", {
    method: "GET",
  });
  students = await students.json();
  container.innerHTML += `
    <div class="table-responsive p-3">
        <table
            class="table align-items-center table-flush table-hover"
            id="dataTableHover"
            >
            <thead class="thead-light">
                <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Report</th>
                </tr>
            </thead>

            <tbody id="tableBody"></tbody>
        </table>
    </div>
  `;
  containerMain.style.display = "block";

  let tableBody = document.getElementById("tableBody");
  let i = 0;
  students.forEach((student) => {
    i++;
    tableBody.innerHTML += `
    <tr>
        <td>${i}</td>
        <td>${student.firstName}</td>
        <td>${student.middleName}</td>
        <td>${student.lastName}</td>
        <td>${student.studentAge}</td>
        <td>${student.studentClass}</td>
        <td><i style = 'cursor: pointer' 
                data-id = ${student._id}
                data-fname = ${student.firstName}
                data-mname = ${student.middleName}
                data-lname = ${student.lastName}
                data-studentage = ${student.studentAge}
                data-studentclass = ${student.studentClass.split(" ")}
                onclick = 'generateStudentAttendance(this)' class='bx bxs-report'></i></td>
    </tr>
  `;
  });
});

async function generateStudentAttendance(caller) {
  let report = await fetch("http://localhost:3000/student/getallabscentdays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentId: caller.dataset.id,
    }),
  });
  report = await report.json();
  let absents = [];
  for (rep of report) {
    absents.push(rep.dateofabscent);
  }

  let daysTaken = await fetch("http://localhost:3000/student/gettakendays", {
    method: "GET",
  });
  daysTaken = await daysTaken.json();

  printable.innerHTML = "";
  let className = caller.dataset.studentclass;
  printable.innerHTML += `
    <p class = 'font-weight-bold mb-2'>Name: ${caller.dataset.fname} ${
    caller.dataset.mname
  } ${caller.dataset.lname}</p>
    <p class = 'font-weight-bold mb-2'>Age: ${caller.dataset.studentage}</p>
    <p class = 'font-weight-bold'>Class: ${className.replace(/,/g, " ")}</p>
    <table class="table align-items-center table-flush table-hover">
        <thead class="thead-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Attendance</th>
            </tr>
        </thead>
        <tbody id="printBody"></tbody>
    </table>`;

  let printBody = document.getElementById("printBody");
  let j = 0;
  let status;
  for (day of daysTaken) {
    status = "Present";
    if (absents.includes(day)) {
      status = "Absent";
    }
    j++;
    printBody.innerHTML += `
      <tr>
      <td>${j}</td>
      <td>${day}</td>
      <td>${status}</td>
      </tr>
      `;
  }
  printable.style.display = "block";
  let contents = printable.innerHTML;
  let a = window.open("", "");
  a.document.write("<html>");
  a.document.write("<body>");
  a.document.write(contents);
  a.document.write("</body></html>");
  a.document.close();
  a.print();
}

// Grade Report
let gradeReport = document.getElementById("gradeReport");
gradeReport.addEventListener("click", async () => {
  container.innerHTML = "";
  let students = await fetch("http://localhost:3000/student/getallstudents", {
    method: "GET",
  });
  students = await students.json();
  container.innerHTML += `
    <div class="table-responsive p-3">
        <table
            class="table align-items-center table-flush table-hover"
            id="dataTableHover"
            >
            <thead class="thead-light">
                <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Class</th>
                <th>Report</th>
                </tr>
            </thead>

            <tbody id="tableBody"></tbody>
        </table>
    </div>
  `;
  containerMain.style.display = "block";

  let tableBody = document.getElementById("tableBody");
  let i = 0;
  students.forEach((student) => {
    i++;
    tableBody.innerHTML += `
    <tr>
        <td>${i}</td>
        <td>${student.firstName}</td>
        <td>${student.middleName}</td>
        <td>${student.lastName}</td>
        <td>${student.studentAge}</td>
        <td>${student.studentClass}</td>
        <td><i style = 'cursor: pointer' 
                data-id = ${student._id}
                data-fname = ${student.firstName}
                data-mname = ${student.middleName}
                data-lname = ${student.lastName}
                data-studentage = ${student.studentAge}
                data-studentclass = ${student.studentClass.split(" ")}
                onclick = 'generateStudentGrade(this)' class='bx bxs-report'></i></td>
    </tr>
  `;
  });
});

async function generateStudentGrade(caller) {
  let marks = await fetch("http://localhost:3000/student/gettotalmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentId: caller.dataset.id,
    }),
  });
  marks = await marks.json();

  printable.innerHTML = "";
  let className = caller.dataset.studentclass;
  printable.innerHTML += `
    <p class = 'font-weight-bold mb-2'>Name: ${caller.dataset.fname} ${
    caller.dataset.mname
  } ${caller.dataset.lname}</p>
    <p class = 'font-weight-bold mb-2'>Age: ${caller.dataset.studentage}</p>
    <p class = 'font-weight-bold'>Class: ${className.replace(/,/g, " ")}</p>
    <table class="table align-items-center table-flush table-hover">
        <thead class="thead-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Surah Name</th>
              <th>Starting Ayah</th>
              <th>Ending Ayah</th>
              <th>Score</th>
            </tr>
        </thead>
        <tbody id="printBody"></tbody>
    </table>`;

  printable.style.display = "block";
  let printBody = document.getElementById("printBody");
  let j = 0;
  for (let mark of marks) {
    j++;
    printBody.innerHTML += `
    <tr>
        <td>${j}</td>
        <td>${mark.date}</td>
        <td>${mark.surahName}</td>
        <td>${mark.startAyah}</td>
        <td>${mark.endAyah}</td>
        <td>${mark.scoreoutof10}</td>
    </tr>`;
  }
  let contents = printable.innerHTML;
  let a = window.open("", "");
  a.document.write("<html>");
  a.document.write("<body>");
  a.document.write(contents);
  a.document.write("</body></html>");
  a.document.close();
  a.print();
}
