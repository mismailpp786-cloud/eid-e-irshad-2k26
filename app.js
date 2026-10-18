
/* =========================================
   EID-E IRSHAD — CAMPUS FEST 2K26
   Main JavaScript
========================================= */

"use strict";

const STORAGE_KEY = "eidIrshadAdvanced_v1";

/* ---------- STORAGE ---------- */

function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Could not read saved data:", error);
    return {};
  }
}

function saveData(updates) {
  const current = readData();
  const updated = { ...current, ...updates };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Could not save data:", error);
    showToast("Could not save data in this browser.");
    return false;
  }
}

/* ---------- TOAST NOTIFICATION ---------- */

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* ---------- MOBILE NAVIGATION ---------- */

function initNavigation() {
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");

  if (!menuBtn || !mainNav) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "×" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !mainNav.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      mainNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "☰";
    }
  });
}

/* ---------- DARK / LIGHT MODE ---------- */

function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const savedTheme = readData().theme;
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const initialTheme =
    savedTheme || (prefersLight ? "light" : "dark");

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-mode")
      ? "dark"
      : "light";

    applyTheme(nextTheme);
    saveData({ theme: nextTheme });
  });
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);

  const toggle = document.getElementById("themeToggle");

  if (toggle) {
    toggle.textContent = isLight ? "☾" : "☀";
    toggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
  }
}

/* ---------- FESTIVAL COUNTDOWN ---------- */

function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Countdown target: 27 November 2026, 00:00 local time.
  const targetDate = new Date(2026, 10, 27, 0, 0, 0);

  function updateCountdown() {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ---------- TEAM SCOREBOARD ---------- */

function initLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  if (!leaderboard) return;

  renderLeaderboard();

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      renderLeaderboard();
    }
  });
}

function renderLeaderboard() {
  const data = readData();

  const zellijScore = Math.max(
    0,
    Number(data.zellijScore) || 0
  );

  const iznikScore = Math.max(
    0,
    Number(data.iznikScore) || 0
  );

  const zellijEl = document.getElementById("zellijScore");
  const iznikEl = document.getElementById("iznikScore");
  const zellijBar = document.getElementById("zellijBar");
  const iznikBar = document.getElementById("iznikBar");

  if (!zellijEl || !iznikEl || !zellijBar || !iznikBar) return;

  zellijEl.textContent = zellijScore;
  iznikEl.textContent = iznikScore;

  const maximum = Math.max(zellijScore, iznikScore, 1);

  zellijBar.style.width =
    `${(zellijScore / maximum) * 100}%`;

  iznikBar.style.width =
    `${(iznikScore / maximum) * 100}%`;
}

/*
  Score values are currently read from localStorage.
  A secure, shared admin points-entry system must be
  added separately before real event use.
*/

/* ---------- AUDIENCE POLL ---------- */

function initPoll() {
  const buttons = document.querySelectorAll("[data-vote]");
  if (!buttons.length) return;

  renderPoll();

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTeam = button.dataset.vote;

      if (!["zellij", "iznik"].includes(selectedTeam)) return;

      const data = readData();

      if (data.pollVoted) {
        showToast("You have already voted on this browser.");
        return;
      }

      const poll = {
        zellij: Math.max(0, Number(data.pollZellij) || 0),
        iznik: Math.max(0, Number(data.pollIznik) || 0)
      };

      poll[selectedTeam] += 1;

      const success = saveData({
        pollZellij: poll.zellij,
        pollIznik: poll.iznik,
        pollVoted: true
      });

      if (success) {
        renderPoll();
        showToast("Thank you for supporting your team!");
      }
    });
  });
}

function renderPoll() {
  const data = readData();

  const zellijVotes = Math.max(0, Number(data.pollZellij) || 0);
  const iznikVotes = Math.max(0, Number(data.pollIznik) || 0);
  const totalVotes = zellijVotes + iznikVotes;

  const zellijPercent = document.getElementById("zellijPercent");
  const iznikPercent = document.getElementById("iznikPercent");
  const message = document.getElementById("pollMessage");

  if (!zellijPercent || !iznikPercent || !message) return;

  const zellijValue = totalVotes
    ? Math.round((zellijVotes / totalVotes) * 100)
    : 0;

  const iznikValue = totalVotes
    ? Math.round((iznikVotes / totalVotes) * 100)
    : 0;

  zellijPercent.textContent = totalVotes
    ? `${zellijValue}%`
    : "Vote";

  iznikPercent.textContent = totalVotes
    ? `${iznikValue}%`
    : "Vote";

  message.textContent = data.pollVoted
    ? `Your vote is recorded on this browser. Total votes: ${totalVotes}`
    : totalVotes
      ? `Total votes: ${totalVotes}. Cast your vote!`
      : "Cast your vote for your team.";
}

/* ---------- ADMIN LOGIN MODAL ---------- */

function initAdminModal() {
  const modal = document.getElementById("adminModal");
  const form = document.getElementById("loginForm");
  const error = document.getElementById("loginError");

  if (!modal || !form) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const email = document.getElementById("adminEmail");
    if (email) email.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    form.reset();

    if (error) error.textContent = "";
  }

  document.querySelectorAll("[data-admin-open]").forEach((button) => {
    button.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-admin-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("adminEmail")?.value.trim();
    const password = document.getElementById("adminPassword")?.value;

    /*
      DEMO ONLY:
      Credentials in client-side JavaScript are NOT secure.
      Do not use this login to protect real admin data.
    */
    const validEmail = "admin@irshad.com";
    const validPassword = "irshad2k26";

    if (email === validEmail && password === validPassword) {
      sessionStorage.setItem("eidIrshadDemoAdmin", "true");
      closeModal();
      showToast("Demo login successful.");

      // Points-entry admin panel will be added separately.
      window.dispatchEvent(new CustomEvent("eid-admin-login"));
    } else {
      if (error) {
        error.textContent = "Incorrect email or password.";
      }
    }
  });
}

/* ---------- ANNOUNCEMENT TICKER ---------- */

function initTicker() {
  const ticker = document.getElementById("tickerText");
  if (!ticker) return;

  ticker.textContent =
    "EID-E IRSHAD — CAMPUS FEST 2K26 | " +
    "NOVEMBER 27, 28 & 29 | " +
    "RAHMANIYYA ARABIC COLLEGE, ATTASSERY";
}

/* ---------- INITIALISE ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTheme();
  initCountdown();
  initLeaderboard();
  initPoll();
  initAdminModal();
  initTicker();

  console.log("EID-E IRSHAD CAMPUS FEST 2K26 loaded.");
});
