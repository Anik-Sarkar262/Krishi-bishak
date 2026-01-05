// const state = {
//   scans: [
//     {
//       crop: "Tomato",
//       disease: "Healthy",
//       date: "2025-12-24",
//       conf: "99%",
//       type: "good",
//     },
//     {
//       crop: "Potato",
//       disease: "Early Blight",
//       date: "2025-12-22",
//       conf: "88%",
//       type: "bad",
//     },
//     {
//       crop: "Corn",
//       disease: "Healthy",
//       date: "2025-12-20",
//       conf: "96%",
//       type: "good",
//     },
//   ],
//   tasks: [
//     {
//       id: 1,
//       text: "Apply Fungicide on Potato Row A",
//       date: "2025-12-25",
//       done: false,
//       tag: "Urgent",
//     },
//     {
//       id: 2,
//       text: "Irrigate Tomato Sector 2",
//       date: "2025-12-26",
//       done: false,
//       tag: "Routine",
//     },
//   ],

//   currentScanResult: null,
//   smsEnabled: false,
// };

// --- Navigation ---
function showView(viewName) {
  // Hide all
  ["dashboard", "scanner", "community", "tasks", "settings"].forEach((v) => {
    document.getElementById(`${v}-view`).classList.add("hidden");
  });
  // Show target
  document.getElementById(`${viewName}-view`).classList.remove("hidden");

  // Active Link
  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // Refresh specific components
  if (viewName === "tasks") renderTasks();
  if (viewName === "community") renderCommunity();
  if (viewName === "dashboard") renderHistory();

  // Mobile menu close
  document.getElementById("sidebar").classList.remove("active");
}

// --- Rendering ---
function renderHistory() {
  const tbody = document.getElementById("history-table-body");
  tbody.innerHTML = state.scans
    .map(
      (s) => `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${s.crop}</td>
                <td style="padding:10px; color:${
                  s.type === "bad" ? "var(--danger)" : "var(--primary)"
                }">${s.disease}</td>
                <td style="padding:10px;">${s.date}</td>
                <td style="padding:10px;"><button class="btn-outline" style="padding:2px 8px; font-size:0.8rem;">View</button></td>
            </tr>
        `
    )
    .join("");

  // Update Widget
  const pending = state.tasks.filter((t) => !t.done)[0];
  const widget = document.getElementById("next-task-display");
  const widgetDate = document.getElementById("next-task-date");
  if (pending) {
    widget.textContent = pending.text;
    widgetDate.textContent = `Due: ${pending.date}`;
    widgetDate.style.color = "var(--danger)";
  } else {
    widget.textContent = "No pending tasks.";
    widgetDate.textContent = "";
  }
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = state.tasks
    .map(
      (t) => `
            <div class="task-item" style="opacity: ${t.done ? "0.5" : "1"}">
                <input type="checkbox" class="task-checkbox" ${
                  t.done ? "checked" : ""
                } onchange="toggleTask(${t.id})">
                <div class="task-info">
                    <div class="task-title" style="text-decoration: ${
                      t.done ? "line-through" : "none"
                    }">${t.text}</div>
                    <div class="task-date">Due: ${
                      t.date
                    } <span class="task-tag">${t.tag}</span></div>
                </div>
            </div>
        `
    )
    .join("");
}


function processUpload(input) 
  const file = input.files[0];
  if (!file) return;

  document.getElementById("upload-zone").classList.add("hidden");
  document.getElementById("processing-ui").classList.remove("hidden");

  // Simulate Steps
  const bar = document.getElementById("process-bar");
  const txt = document.getElementById("process-text");
  let width = 0;

  const interval = setInterval() => 
    if (width >= 100) {
      clearInterval(interval);
      
      showResultModal();
      // Reset UI
  //     setTimeout(() => {
  //       document.getElementById("upload-zone").classList.remove("hidden");
  //       document.getElementById("processing-ui").classList.add("hidden");
  //       input.value = "";
  //       bar.style.width = "0%";
  //     }, 500);
  //   } else {
  //     width += 5;
  //     bar.style.width = width + "%";
  //     if (width < 30) txt.textContent = "Uploading to Python Server...";
  //     else if (width < 70) txt.textContent = "AI Model Analyzing (CNN)...";
  //     else txt.textContent = "Comparing with database...";
  //   }
  // }, 100);
}

// --- Modal & Actions ---
function showResultModal() {
  document.getElementById("modal-title").textContent =
    state.currentScanResult.name;
  document.getElementById("modal-conf").textContent =
    state.currentScanResult.conf;
  document.getElementById("modal-desc").textContent =
    state.currentScanResult.desc;
  document.getElementById("modal-treat").textContent =
    state.currentScanResult.treat;
  document.getElementById("result-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("result-modal").style.display = "none";
  showView("dashboard"); // Go back home
}

function addToTrackerFromModal() {
  const newTask = {
    id: Date.now(),
    text: `Treat: ${state.currentScanResult.name}`,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
    done: false,
    tag: "Urgent",
  };
  state.tasks.unshift(newTask);
  showToast("Task added to tracker!");
  closeModal();
}

// function askCommunity() {
//   const post = {
//     id: Date.now(),
//     user: "You (John Doe)",
//     crop: "Unknown",
//     issue: state.currentScanResult.name,
//     votes: 0,
//     img: "https://picsum.photos/seed/new/80/80",
//   };
//   state.community.unshift(post);
//   showToast("Posted to Community for validation!");
//   closeModal();
// }

// --- Task Management ---
// function toggleTask(id) {
//   const task = state.tasks.find((t) => t.id === id);
//   if (task) task.done = !task.done;
//   renderTasks();
//   renderHistory(); // Update widget
// }

// function addManualTask() {
//   const text = prompt("Enter task description:");
//   if (text) {
//     state.tasks.unshift({
//       id: Date.now(),
//       text: text,
//       date: new Date().toISOString().split("T")[0],
//       done: false,
//       tag: "Manual",
//     });
//     renderTasks();
//   }
// }

// // --- SMS & Alerts Logic ---
// function toggleSMS() {
//   state.smsEnabled = document.getElementById("sms-toggle").checked;
//   if (state.smsEnabled) showToast("SMS Alerts Enabled");
// }

// function savePhone() {
//   showToast("Phone number updated!");
// }

// function vote(btn) {
//   // Visual feedback only
//   if (btn.classList.contains("active")) {
//     btn.classList.remove("active");
//   } else {
//     // Remove active from sibling
//     const parent = btn.parentElement;
//     parent
//       .querySelectorAll(".vote-btn")
//       .forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");

//     if (state.smsEnabled && Math.random() > 0.5) {
//       setTimeout(
//         () => showToast("📲 SMS Sent: Neighbor posted new case"),
//         1000
//       );
//     }
//   }
// }

// function showToast(msg) {
//   const t = document.getElementById("toast");
//   const msgSpan = document.getElementById("toast-msg");
//   msgSpan.textContent = msg;

  
//   if (msg.includes("SMS")) {
//     t.classList.remove("toast-success");
//     t.classList.add("toast-sms");
//   } else {
//     t.classList.remove("toast-sms");
//     t.classList.add("toast-success");
//   }

//   t.classList.add("show");
//   setTimeout(() => t.classList.remove("show"), 3000);
// }

// --- Init ---
// document.getElementById("current-date").textContent = new Date().toDateString();
// renderHistory();
