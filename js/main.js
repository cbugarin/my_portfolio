// ===== Tabs =====
function setActiveTab(tab) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.tab === tab)
  );
  document.querySelectorAll(".file-item").forEach(f =>
    f.classList.toggle("active", f.dataset.tab === tab)
  );
  document.querySelectorAll(".view").forEach(v =>
    v.classList.toggle("active", v.id === `view-${tab}`)
  );
}

document.querySelectorAll("[data-tab]").forEach(el => {
  el.addEventListener("click", () => setActiveTab(el.dataset.tab));
});

// ===== Project preview panel =====
const projects = {
  flight: {
    title: "Flight Booking App",
    img: "images/flight-booking-form.png",
    desc: "Spring Boot project featuring a booking form UI and structured backend setup.",
    tags: ["Java", "Spring Boot", "Bootstrap", "MVC"],
    code: "https://github.com/cbugarin/FlightBookingApp",
    demo: ""
  },
  mern: {
    title: "MERN Auth + RBAC",
    img: "images/student_Dashboard.png",
    desc: "JWT + HTTPOnly cookies, protected API routes, and role-based access for Student/Admin using MVC architecture.",
    tags: ["MongoDB", "Express", "React", "Node", "JWT", "RBAC"],
    code: "https://github.com/cbugarin/EmeringTech_Assignment-1",
    demo: ""
  },
  sigmamd: {
    title: "SigmaMD-EMR",
    img: "images/sigma_login.png",
    video: "images/sigma_shortVid.mp4",
    desc: "Full-stack EMR system built with MERN. Supports role-based access, scheduling, and clinical workflow tools with secure authentication.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "RBAC"],
    code: "https://github.com/cbugarin/SigmaMD-EMR",
    demo: ""
  }
};

const panel = document.getElementById("projectPanel");
const closePanel = document.getElementById("closePanel");
const panelTitle = document.getElementById("panelTitle");
const panelImg = document.getElementById("panelImg");
const panelVideo = document.getElementById("panelVideo");
const panelDesc = document.getElementById("panelDesc");
const panelTags = document.getElementById("panelTags");
const panelCode = document.getElementById("panelCode");
const panelDemo = document.getElementById("panelDemo");

function resetPreviewMedia() {
  if (panelVideo) {
    panelVideo.pause();
    panelVideo.currentTime = 0;
    panelVideo.classList.add("hidden");
    panelVideo.removeAttribute("src");
    panelVideo.load();
    panelVideo.play().catch(() => {});
  }
  if (panelImg) {
    panelImg.classList.add("hidden");
    panelImg.src = "";
    panelImg.alt = "";
  }
}

function openProject(key) {
  const p = projects[key];
  if (!p || !panel) return;

  // Debug (keep this INSIDE the function)
  console.log("OPEN PROJECT:", key, p);

  if (panelTitle) panelTitle.textContent = p.title || "Project";
  if (panelDesc) panelDesc.textContent = p.desc || "";

  // Reset media every time
  resetPreviewMedia();

  // Show video if available, else image
  if (p.video && panelVideo) {
    panelVideo.classList.remove("hidden");
    panelVideo.src = p.video; // images/sigma_shortVid.mp4
    panelVideo.load();

    panelVideo.onerror = () => {
  console.log("Video failed to load:", panelVideo.src);

  // fallback to image
  panelVideo.classList.add("hidden");
  panelVideo.removeAttribute("src");
  panelVideo.load();

  if (panelImg) {
    panelImg.classList.remove("hidden");
    panelImg.src = p.img || "";
    panelImg.alt = p.title || "Project";
  }
};

  } else if (panelImg) {
    panelImg.classList.remove("hidden");
    panelImg.src = p.img || "";
    panelImg.alt = p.title || "Project";
  }

  // Tags
  if (panelTags) {
    panelTags.innerHTML = "";
    (p.tags || []).forEach(t => {
      const s = document.createElement("span");
      s.textContent = t;
      panelTags.appendChild(s);
    });
  }

  // Links
  if (panelCode) {
    panelCode.href = p.code || "#";
    panelCode.style.display = p.code ? "inline-flex" : "none";
  }
  if (panelDemo) {
    panelDemo.href = p.demo || "#";
    panelDemo.style.display = p.demo ? "inline-flex" : "none";
  }

  panel.classList.remove("hidden");
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Open from buttons
document.querySelectorAll("[data-project-open]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openProject(btn.dataset.projectOpen);
  });
});

// Make the whole project card clickable (thumbnail + text)
document.querySelectorAll(".project-card").forEach(card => {
  card.style.cursor = "pointer";

  card.addEventListener("click", (e) => {
    const clickedInsideAction =
      e.target.closest("[data-project-open]") ||
      e.target.closest("a") ||
      e.target.closest("button");

    if (clickedInsideAction) return;

    const key = card.getAttribute("data-project");
    if (key) openProject(key);
  });
});

// Close button: hide panel + stop video
if (closePanel && panel) {
  closePanel.addEventListener("click", () => {
    panel.classList.add("hidden");
    resetPreviewMedia();
  });
}

// ===== Toast =====
const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

// ===== Copy email button =====
const copyBtn = document.getElementById("copyEmailBtn");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const email = "cbugarin@my.centennialcollege.ca";

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied ✅");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Email copied ✅");
      } catch {
        showToast("Couldn’t copy — please copy manually");
      }
      document.body.removeChild(ta);
    }
  });
}
