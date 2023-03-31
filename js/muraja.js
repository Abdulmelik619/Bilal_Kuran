let today = new Date().toISOString().slice(0, 10);
let students = new Map();
let filterBtn = document.getElementById("filterSection");
let filteredClass = document.getElementById("studentClass");
let studentsBody = document.getElementById("tableBody");

async function run() {
  let studentList = await fetch(
    "http://localhost:3000/student/getallstudents",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  studentList = await studentList.json();
  studentList.forEach((studentDetails) => {
    students.set(studentDetails._id, [
      studentDetails.firstName,
      studentDetails.middleName,
      studentDetails.lastName,
      studentDetails.studentAge,
      studentDetails.studentClass,
    ]);
  });
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

  let evaluatedStudents = await fetch(
    "http://localhost:3000/student/getdatemark",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: today,
      }),
    }
  );
  evaluatedStudents = await evaluatedStudents.json();
  let evaluatedBody = document.getElementById("evaluatedBody");
  let counter = 0;
  evaluatedStudents.forEach((evaluatedStudent) => {
    counter++;
    studentsDetail = students.get(evaluatedStudent.studentId);
    students.delete(evaluatedStudent.studentId);
    evaluatedBody.innerHTML += `
    <tr>
      <td>${counter}</td>
      <td>${studentsDetail[0]}</td>
      <td>${studentsDetail[1]}</td>
      <td>${studentsDetail[2]}</td>
      <td>${studentsDetail[4]}</td>
      <td>${evaluatedStudent.surahName}</td>
      <td>${evaluatedStudent.startAyah}</td>
      <td>${evaluatedStudent.endAyah}</td>
      <td>${evaluatedStudent.scoreoutof10}</td>
    </tr>`;
  });

  studentsBody.innerHTML = "";
  let i = 0;
  for (let details of students) {
    let student = details[1];
    i++;
    studentsBody.innerHTML += `
        <tr>
          <td>${i}</td>
          <td>${student[0]}</td>
          <td>${student[1]}</td>
          <td>${student[2]}</td>
          <td>${student[3]}</td>
          <td>${student[4]}</td>
          <td><i data-id = ${details[0]} onclick = 'doEvaluate(this)' class="bx bx-edit-alt"></i></td>
          </tr>
        `;
  }

  filterBtn.addEventListener("click", async () => {
    if (
      filteredClass.options[filteredClass.selectedIndex].text == "All Sections"
    ) {
      location.reload();
      return false;
    } else {
      studentsBody.innerHTML = "";
      let result = await fetch(
        "http://localhost:3000/student/getstudentsbysection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sectionName:
              filteredClass.options[filteredClass.selectedIndex].text,
          }),
        }
      );
      result = await result.json();
      studentsBody.innerHTML = "";
      let i = 0;
      result.forEach((student) => {
        if (students.get(student._id)) {
          i++;
          studentsBody.innerHTML += `
            <tr>
              <td>${i}</td>
              <td>${student.firstName}</td>
              <td>${student.middleName}</td>
              <td>${student.lastName}</td>
              <td>${student.studentAge}</td>
              <td>${student.studentClass}</td>
              <td><i data-id = ${student._id} onclick = 'doEvaluate(this)' class="bx bx-edit-alt"></i></td>
            </tr>
          `;
        }
      });
    }
  });
}
run();

let evaluateBody = document.getElementById("doEvaluate");
let surahName = document.getElementById("surahName");
async function doEvaluate(caller) {
  evaluateBody.dataset.id = `${caller.dataset.id}`;
  let chapters = await fetch("https://api.quran.com/api/v4/chapters", {
    method: "GET",
  });
  chapters = await chapters.json();
  for (let i = 0; i < chapters.chapters.length; i++) {
    surahName.innerHTML += `
        <option value = '${chapters.chapters[i].id}'>${chapters.chapters[i].name_simple}</option>`;
  }
  evaluateBody.style.visibility = "visible";
  evaluateBody.style.top = "50%";
  evaluateBody.style.transform = "translate(-50%, -50%) scale(1)";
}

let evaluationCloseBtn = document.getElementById("closeBtn");
evaluationCloseBtn.addEventListener("click", () => {
  evaluateBody.dataset.id = "";
  evaluateBody.style.visibility = "hidden";
  evaluateBody.style.top = "0";
  evaluateBody.style.transform = "translate(-50%, -50%) scale(0.1)";
});

let startAyah = document.getElementById("startAyah");
let endAyah = document.getElementById("endAyah");
async function surahSelected(caller) {
  if (caller.options[caller.selectedIndex].text == "---Choose a Surah---") {
    document.getElementById("error").style.display = "block";
  } else {
    document.getElementById("error").style.display = "none";
    let surahId = caller.options[caller.selectedIndex].value;
    let surahDetails = await fetch(
      `https://api.quran.com/api/v4/chapters/${surahId}`,
      {
        method: "GET",
      }
    );
    surahDetails = await surahDetails.json();
    let versesCount = surahDetails.chapter.verses_count;
    startAyah.innerHTML = "";
    endAyah.innerHTML = "";
    for (let i = 1; i <= versesCount; i++) {
      startAyah.innerHTML += `<option>${i}</option>`;
      endAyah.innerHTML += `<option>${i}</option>`;
    }
    startAyah.removeAttribute("disabled");
    endAyah.removeAttribute("disabled");
    document.getElementById("score").removeAttribute("disabled");
  }
}

let submitScore = document.getElementById("submitScore");
submitScore.addEventListener("click", async () => {
  let result = await fetch("http://localhost:3000/student/addscore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentId: evaluateBody.dataset.id,
      date: today,
      surahName: surahName.options[surahName.selectedIndex].text,
      startAyah: startAyah.options[startAyah.selectedIndex].text,
      endAyah: endAyah.options[endAyah.selectedIndex].text,
      score: document.getElementById("score").value,
    }),
  });
  result = await result.json();
  location.reload();
  return false;
});
