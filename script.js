let subjects =
JSON.parse(localStorage.getItem("subjects"))
|| [];

let currentEditIndex = null;

displaySubjects();

/* ───────── SAVE DATA ───────── */

function saveData(){

  localStorage.setItem(
    "subjects",
    JSON.stringify(subjects)
  );
}

/* ───────── MODALS ───────── */

function openModal(){

  document.getElementById(
    "modal"
  ).style.display = "flex";
}

function closeModal(){

  document.getElementById(
    "modal"
  ).style.display = "none";
}

function openEditModal(index){

  currentEditIndex = index;

  document.getElementById(
    "editSubjectName"
  ).value = subjects[index].name;

  document.getElementById(
    "editAttended"
  ).value = subjects[index].attended;

  document.getElementById(
    "editTotal"
  ).value = subjects[index].total;

  document.getElementById(
    "editModal"
  ).style.display = "flex";
}

function closeEditModal(){

  document.getElementById(
    "editModal"
  ).style.display = "none";
}

/* ───────── SAVE SUBJECT ───────── */

function saveSubject(){

  let name =
  document.getElementById(
    "subjectName"
  ).value.trim();

  let attended =
  parseInt(
    document.getElementById(
      "attended"
    ).value
  );

  let total =
  parseInt(
    document.getElementById(
      "total"
    ).value
  );

  if(
    name === "" ||
    isNaN(attended) ||
    isNaN(total)
  ){

    alert("Fill all fields");
    return;
  }

  if(attended > total){

    alert(
      "Attended cannot exceed Total"
    );

    return;
  }

  subjects.push({

    name:name,
    attended:attended,
    total:total

  });

  saveData();

  displaySubjects();

  closeModal();

  document.getElementById(
    "subjectName"
  ).value = "";

  document.getElementById(
    "attended"
  ).value = 0;

  document.getElementById(
    "total"
  ).value = 0;
}

/* ───────── EDIT SUBJECT ───────── */

function saveEditedSubject(){

  let name =
  document.getElementById(
    "editSubjectName"
  ).value.trim();

  let attended =
  parseInt(
    document.getElementById(
      "editAttended"
    ).value
  );

  let total =
  parseInt(
    document.getElementById(
      "editTotal"
    ).value
  );

  if(
    name === "" ||
    isNaN(attended) ||
    isNaN(total)
  ){

    alert("Fill all fields");
    return;
  }

  if(attended > total){

    alert(
      "Attended cannot exceed Total"
    );

    return;
  }

  subjects[currentEditIndex] = {

    name:name,
    attended:attended,
    total:total

  };

  saveData();

  displaySubjects();

  closeEditModal();
}

/* ───────── DELETE SUBJECT ───────── */

function confirmDeleteSubject(){

  let ok =
  confirm(
    "Delete this subject?"
  );

  if(ok){

    subjects.splice(
      currentEditIndex,
      1
    );

    saveData();

    displaySubjects();

    closeEditModal();
  }
}

/* ───────── ATTENDED ───────── */

function increaseAttended(index){

  subjects[index].attended++;

  if(
    subjects[index].attended >
    subjects[index].total
  ){

    subjects[index].total =
    subjects[index].attended;
  }

  saveData();

  displaySubjects();
}

function decreaseAttended(index){

  if(
    subjects[index].attended > 0
  ){

    subjects[index].attended--;

    saveData();

    displaySubjects();
  }
}

/* ───────── TOTAL ───────── */

function increaseTotal(index){

  subjects[index].total++;

  saveData();

  displaySubjects();
}

function decreaseTotal(index){

  if(
    subjects[index].total > 0
  ){

    subjects[index].total--;

    if(
      subjects[index].attended >
      subjects[index].total
    ){

      subjects[index].attended =
      subjects[index].total;
    }

    saveData();

    displaySubjects();
  }
}

/* ───────── MODAL COUNTERS ───────── */

function modalIncrease(id){

  let input =
  document.getElementById(id);

  input.value =
  parseInt(input.value || 0) + 1;
}

function modalDecrease(id){

  let input =
  document.getElementById(id);

  let value =
  parseInt(input.value || 0);

  if(value > 0){

    input.value = value - 1;
  }
}

function editModalIncrease(id){

  let input =
  document.getElementById(id);

  input.value =
  parseInt(input.value || 0) + 1;
}

function editModalDecrease(id){

  let input =
  document.getElementById(id);

  let value =
  parseInt(input.value || 0);

  if(value > 0){

    input.value = value - 1;
  }
}

/* ───────── OVERALL ATTENDANCE ───────── */

function updateOverallAttendance(){

  let totalAttended = 0;

  let totalClasses = 0;

  subjects.forEach(subject => {

    totalAttended +=
    subject.attended;

    totalClasses +=
    subject.total;
  });

  let percent = 0;

  if(totalClasses > 0){

    percent =
    (
      (totalAttended /
      totalClasses)
      * 100
    ).toFixed(0);
  }

  document.getElementById(
    "overallPercent"
  ).innerText =
  percent + "%";

  document.getElementById(
    "totalAttended"
  ).innerText =
  totalAttended;

  document.getElementById(
    "totalClasses"
  ).innerText =
  totalClasses;

  let standing =
  document.getElementById(
    "standingText"
  );

  if(percent >= 75){

    standing.innerText =
    "Good Standing";

    standing.style.color =
    "#38ef7d";

  }else{

    standing.innerText =
    "Low Attendance";

    standing.style.color =
    "#ff453a";
  }
}

/* ───────── BUILD RING ───────── */

function buildRing(percent,color){

  let radius = 34;

  let circumference =
  2 * Math.PI * radius;

  let offset =
  circumference -
  (percent / 100)
  * circumference;

  return `

    <div class="ring-wrap">

      <svg
        width="94"
        height="94"
        viewBox="0 0 94 94"
      >

        <circle
          class="ring-bg"
          cx="47"
          cy="47"
          r="${radius}"
        />

        <circle
          class="ring-fill"
          cx="47"
          cy="47"
          r="${radius}"
          stroke="${color}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
        />

      </svg>

      <div class="ring-inner"></div>

      <div class="ring-text">

        ${percent}%

      </div>

    </div>
  `;
}

/* ───────── DISPLAY SUBJECTS ───────── */

function displaySubjects(){

  let container =
  document.getElementById(
    "subjectContainer"
  );

  container.innerHTML = "";

  if(subjects.length === 0){

    container.innerHTML = `

      <div class="empty-state">

        <div style="font-size:48px">

          📚

        </div>

        <p>

          No subjects added yet

          <br>

          Tap + to add

        </p>

      </div>
    `;

    updateOverallAttendance();

    return;
  }

  subjects.forEach(
    (subject,index) => {

    let percent = 0;

    if(subject.total > 0){

      percent =
      (
        (subject.attended /
        subject.total)
        * 100
      ).toFixed(0);
    }

    let ringColor =
    percent >= 75
    ? "#38ef7d"
    : "#ff453a";

    let canSkip = 0;

    if(percent >= 75){

      canSkip = Math.floor(
        (
          subject.attended -
          (0.75 * subject.total)
        ) / 0.75
      );

      if(canSkip < 0){

        canSkip = 0;
      }
    }

    container.innerHTML += `

      <div class="card">

        <div class="card-left">

          ${buildRing(
            percent,
            ringColor
          )}

          <div class="subject-info">

            <h2>

              ${subject.name}

            </h2>

            <p>

              <span
                class="att-count"
                style="
                color:${ringColor}
                "
              >

                ${subject.attended}

              </span>

              / ${subject.total}
              classes

            </p>

            <div class="skip-box">

              ${
                percent >= 75

                ?

                `<span class="skip-good">

                  Can skip
                  ${canSkip}
                  classes

                </span>`

                :

                `<span class="skip-bad">

                  Attendance Low

                </span>`
              }

            </div>

          </div>

        </div>

        <div class="card-right">

          <div class="control-group">

            <div class="control-row">

              <label>

                Attended

              </label>

              <div class="counter">

                <button
                  class="minus-green"
                  onclick="
                  decreaseAttended(${index})
                  "
                >

                  −

                </button>

                <div class="counter-value">

                  ${subject.attended}

                </div>

                <button
                  class="plus-green"
                  onclick="
                  increaseAttended(${index})
                  "
                >

                  +

                </button>

              </div>

            </div>

            <div class="control-row">

              <label>

                Total

              </label>

              <div class="counter">

                <button
                  class="minus-orange"
                  onclick="
                  decreaseTotal(${index})
                  "
                >

                  −

                </button>

                <div class="counter-value">

                  ${subject.total}

                </div>

                <button
                  class="plus-orange"
                  onclick="
                  increaseTotal(${index})
                  "
                >

                  +

                </button>

              </div>

            </div>

          </div>

          <button
            class="menu-btn"
            onclick="
            openEditModal(${index})
            "
          >

            ⋮

          </button>

        </div>

      </div>
    `;
  });

  updateOverallAttendance();
}

/* ───────── CLOSE MODAL ───────── */

window.onclick = function(event){

  let modal =
  document.getElementById(
    "modal"
  );

  let editModal =
  document.getElementById(
    "editModal"
  );

  if(event.target === modal){

    closeModal();
  }

  if(event.target === editModal){

    closeEditModal();
  }
};
