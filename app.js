// Firebase Configuration & Initialization
const firebaseConfig = {
    // Firebase credentials placeholder
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let appData = {
    teams: {
        teamA: { name: "ZELLIJ", senior: [], junior: [], subjunior: [], general: [] },
        teamB: { name: "IZNIK", senior: [], junior: [], subjunior: [], general: [] }
    },
    programs: {
        senior: { onStage: [], offStage: [], sports: [] },
        junior: { onStage: [], offStage: [], sports: [] },
        subjunior: { onStage: [], offStage: [], sports: [] },
        general: { onStage: [], offStage: [], sports: [] }
    },
    results: [],
    registrations: {}
};

let isAdmin = false;
const ADMIN_PASSCODE = "1234"; // Adjust passcode if needed

window.addEventListener("DOMContentLoaded", () => {
    checkAdminStatus();
    loadAppDataFromCloud();
});

function checkAdminStatus() {
    const adminSession = localStorage.getItem("eid_admin_logged");
    if (adminSession === "true") {
        isAdmin = true;
        document.body.classList.add("admin-mode");
        const adminBar = document.getElementById("adminBar");
        if (adminBar) adminBar.style.display = "flex";
    } else {
        isAdmin = false;
        document.body.classList.remove("admin-mode");
        const adminBar = document.getElementById("adminBar");
        if (adminBar) adminBar.style.display = "none";
    }
}

function openAdminLoginModal() {
    const modal = document.getElementById("adminLoginModal");
    if (modal) modal.style.display = "flex";
}

function closeAdminLoginModal() {
    const modal = document.getElementById("adminLoginModal");
    if (modal) modal.style.display = "none";
}

function submitAdminLogin() {
    const input = document.getElementById("adminPassInput");
    if (!input) return;
    if (input.value === ADMIN_PASSCODE) {
        localStorage.setItem("eid_admin_logged", "true");
        isAdmin = true;
        input.value = "";
        closeAdminLoginModal();
        checkAdminStatus();
        alert("അഡ്മിൻ ലോഗിൻ വിജയം!");
        location.reload();
    } else {
        alert("തെറ്റായ പാസ്‌വേഡ്!");
    }
}

function logoutAdmin() {
    localStorage.removeItem("eid_admin_logged");
    isAdmin = false;
    checkAdminStatus();
    alert("അഡ്മിൻ മോഡ് ലോഗ്ഔട്ട് ചെയ്തു.");
    location.reload();
}

function loadAppDataFromCloud() {
    db.collection("festival").doc("mainData").get().then((doc) => {
        if (doc.exists) {
            appData = doc.data();
            if (!appData.registrations) appData.registrations = {};
            if (typeof updateUIOnDataLoad === "function") updateUIOnDataLoad();
            if (typeof renderRegistrationMatrix === "function") renderRegistrationMatrix();
        }
    }).catch((err) => {
        console.log("Cloud load error:", err);
    });
}

function saveAppData(showAlert = true, customData = null, callback = null) {
    const dataToSave = customData || appData;
    db.collection("festival").doc("mainData").set(dataToSave).then(() => {
        if (showAlert) alert("മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!");
        if (callback) callback();
    }).catch((err) => {
        console.error("Save error:", err);
        if (showAlert) alert("സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു!");
    });
}

function normalizeTeamsData(teams) {
    if (!teams) return appData.teams;
    return teams;
}

function normalizeProgramsData(programs) {
    if (!programs) return appData.programs;
    return programs;
}

const GROUP_EVENTS_LIST = [];

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("eid_theme", next);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("eid_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
});
