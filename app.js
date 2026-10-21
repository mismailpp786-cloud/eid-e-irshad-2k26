// Firebase Configuration & Initialization (From your Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBJ7gW3JRCvYIft5v4-4nxhE1AVPrpTDmw",
    authDomain: "eid-e-irshad-2k26.firebaseapp.com",
    projectId: "eid-e-irshad-2k26",
    storageBucket: "eid-e-irshad-2k26.firebasestorage.app",
    messagingSenderId: "926291213815",
    appId: "1:926291213815:web:50729ca345f5d6b0d002f2"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

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
let GROUP_EVENTS_LIST = [];

window.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
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
    });

    initRealtimeSync();

    const savedTheme = localStorage.getItem("eid_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleButton(savedTheme);
});

function openAdminLoginModal() {
    const modal = document.getElementById("adminLoginModal");
    if (modal) modal.style.display = "flex";
}

function closeAdminLoginModal() {
    const modal = document.getElementById("adminLoginModal");
    if (modal) modal.style.display = "none";
}

function submitAdminLogin() {
    const emailInput = document.getElementById("adminEmailInput");
    const passInput = document.getElementById("adminPassInput");
    
    if (!emailInput || !passInput) return;
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!email || !password) {
        alert("ദയവായി ജിമെയിലും പാസ്‌വേഡും നൽകുക!");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeAdminLoginModal();
            alert("അഡ്മിൻ ലോഗിൻ വിജയം!");
            location.reload();
        })
        .catch((error) => {
            alert("ലോഗിൻ പരാജയപ്പെട്ടു: " + error.message);
        });
}

function logoutAdmin() {
    auth.signOut().then(() => {
        alert("അഡ്മിൻ മോഡ് ലോഗ്ഔട്ട് ചെയ്തു.");
        location.reload();
    }).catch((error) => {
        console.error("Sign out error", error);
    });
}

// Real-time synchronization using correct Firestore path: fiesta2k26 / mainData
function initRealtimeSync() {
    db.collection("fiesta2k26").doc("mainData").onSnapshot((doc) => {
        if (doc.exists) {
            appData = doc.data();
            if (!appData.registrations) appData.registrations = {};
            if (!appData.results) appData.results = {};
            
            calculateAndDisplayHomeScores();
            if (typeof updateUIOnDataLoad === "function") updateUIOnDataLoad();
            if (typeof renderRegistrationMatrix === "function") renderRegistrationMatrix();
        }
    }, (err) => {
        console.error("Realtime sync error:", err);
    });
}

function saveAppData(showAlert = true, customData = null, callback = null) {
    if (!isAdmin) {
        alert("അഡ്മിൻ അനുമതി ആവശ്യമാണ്!");
        return;
    }
    const dataToSave = customData || appData;
    db.collection("fiesta2k26").doc("mainData").set(dataToSave).then(() => {
        if (showAlert) alert("മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!");
        if (callback) callback();
    }).catch((err) => {
        console.error("Save error:", err);
        if (showAlert) alert("സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു!");
    });
}

function calculateAndDisplayHomeScores() {
    let ptsA = 0, ptsB = 0;
    const results = appData.results || [];
    const resultsArray = Array.isArray(results) ? results : Object.values(results);

    resultsArray.forEach(res => {
        if (!res || !res.program) return;
        const isGroup = GROUP_EVENTS_LIST.includes(res.program);
        const ptsMap = isGroup ? { 1: 10, 2: 6, 3: 3 } : { 1: 5, 2: 3, 3: 1 };
        
        if (res.team1 === "teamA") ptsA += ptsMap[1];
        if (res.team1 === "teamB") ptsB += ptsMap[1];
        if (res.team2 === "teamA") ptsA += ptsMap[2];
        if (res.team2 === "teamB") ptsB += ptsMap[2];
        if (res.team3 === "teamA") ptsA += ptsMap[3];
        if (res.team3 === "teamB") ptsB += ptsMap[3];
    });

    updateIndexScoreboard(ptsA, ptsB);
}

function updateIndexScoreboard(ptsA, ptsB) {
    const validPtsA = Number(ptsA);
    const validPtsB = Number(ptsB);

    const finalPtsA = Number.isFinite(validPtsA) && validPtsA >= 0 ? validPtsA : 0;
    const finalPtsB = Number.isFinite(validPtsB) && validPtsB >= 0 ? validPtsB : 0;

    const elPtsA = document.getElementById("homePtsA");
    const elPtsB = document.getElementById("homePtsB");
    const elBarA = document.getElementById("homeBarA");
    const elBarB = document.getElementById("homeBarB");

    if (elPtsA) elPtsA.textContent = finalPtsA;
    if (elPtsB) elPtsB.textContent = finalPtsB;

    const total = finalPtsA + finalPtsB;
    let pctA = 50, pctB = 50;

    if (total > 0 && Number.isFinite(total)) {
        pctA = (finalPtsA / total) * 100;
        pctB = (finalPtsB / total) * 100;
    }

    if (elBarA) elBarA.style.width = pctA + "%";
    if (elBarB) elBarB.style.width = pctB + "%";
}

function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "eid_irshad_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function normalizeTeamsData(teams) {
    if (!teams) return appData.teams;
    return teams;
}

function normalizeProgramsData(programs) {
    if (!programs) return appData.programs;
    return programs;
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("eid_theme", next);
    updateThemeToggleButton(next);
}

function updateThemeToggleButton(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
        btn.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
    }
}
