async function run() {
  let allClasses = await fetch("http://localhost:3000/student/getallsections", {
    method: "GET",
  });
  allClasses = await allClasses.json();
  let classesBody = document.getElementById("classesBody");
  let i = 0;
  allClasses.forEach((classN) => {
    i++;
    classesBody.innerHTML += `<tr>
        <td>${i}</td>
        <td>${classN.sectionName}</td>
        <td>${classN.dateCreated}</td>
        <td><i data-id = ${classN._id} onclick = 'editClassProfile(this)' class="fas fa-fw fa-edit"></i></td>
        <td><i data-id = ${classN._id} onclick = 'deleteClassProfile(this)' class="fas fa-fw fa-trash"></i></td>
    <tr>`;
  });
}

//   ########################### edit profile #################################
let edit = document.getElementById("editProfile");
function editClassProfile(caller) {
  edit.dataset.id = `${caller.dataset.id}`;
  edit.style.visibility = "visible";
  edit.style.top = "50%";
  edit.style.transform = "translate(-50%, -50%) scale(1)";
}

let editSaveBtn = document.getElementById("editSaveBtn");
let className = document.getElementById("editclassName");
editSaveBtn.addEventListener("click", async () => {
  let result = await fetch("http://localhost:3000/student/editclass", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: edit.dataset.id,
      className: className.value,
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
function deleteClassProfile(caller) {
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
  let result = await fetch("http://localhost:3000/student/deleteclass", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: delProfile.dataset.id,
    }),
  });
  location.reload();
  return false;
});

// ######################### Create Class ###############################
let today = new Date().toISOString().slice(0, 10);
let createBtn = document.getElementById("createBtn");
let sectionName = document.getElementById("sectionName");
createBtn.addEventListener("click", async () => {
  let classes = await fetch("http://localhost:3000/student/createsection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sectionName: sectionName.value,
      dateCreated: today,
    }),
  });
  location.reload();
  return false;
});

run();
