// Firebase Configuration & Initialization (Exact match from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBJ7gw3JRcvYIft5vA-4nxhE1AVPrpTDmw",
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

const defaultData = {
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
    registrations: {},
    matrixScores: {},
    pointPreset: "5-3-1",
    manualScoreOverride: { enabled: false, teamA: 0, teamB: 0 }
};

let appData = JSON.parse(JSON.stringify(defaultData));
let isAdmin = false;
let currentPosterLayout = "layout-model-1";
let computedGrandTotals = {
    teamA: 0,
    teamB: 0,
    medalsA: { gold: 0, silver: 0, bronze: 0 },
    medalsB: { gold: 0, silver: 0, bronze: 0 }
};

let GROUP_EVENTS_LIST = [
    "GROUP SONG", "PATRIOTIC SONG", "BURDA", "MOULID", "QAWWALI",
    "DUFF MUTTU", "KOLKKALI", "ARABANA MUTTU", "VATTAPPATTU",
    "QUIZ", "DEBATE", "MAGAZINE", "WALL POSTER", "DOCUMENTARY",
    "FOOTBALL", "CRICKET", "VOLLEYBALL", "TUG OF WAR", "RELAY", "KABBADI", "SHUTTLE DOUBLES"
];

window.addEventListener("DOMContentLoaded", () => {
    ensureAdminModalExists();

    auth.onAuthStateChanged((user) => {
        if (user) {
            isAdmin = true;
            document.body.classList.add("admin-mode");
            const adminBar = document.getElementById("adminBar");
            if (adminBar) adminBar.style.display = "flex";
            const loginBtn = document.getElementById("adminLoginBtn");
            if (loginBtn) loginBtn.textContent = "✅ Admin";
        } else {
            isAdmin = false;
            document.body.classList.remove("admin-mode");
            const adminBar = document.getElementById("adminBar");
            if (adminBar) adminBar.style.display = "none";
            const loginBtn = document.getElementById("adminLoginBtn");
            if (loginBtn) loginBtn.textContent = "🔐 Admin";
        }
        refreshAllPageViews();
    });

    initRealtimeSync();

    const savedTheme = localStorage.getItem("eid_theme") || document.documentElement.getAttribute("data-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleButton(savedTheme);
});

function ensureAdminModalExists() {
    let modal = document.getElementById("adminLoginModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "adminLoginModal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }
    if (!document.getElementById("adminEmailInput") || !document.getElementById("adminPassInput")) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeAdminLoginModal()">&times;</span>
                <h3 style="margin: 0 0 12px; font-weight: 900; color: var(--accent-gold);">🔐 Admin Login</h3>
                <div class="form-group">
                    <label>Admin Email:</label>
                    <input type="email" id="adminEmailInput" class="form-control" placeholder="admin@irshad.com" style="margin-bottom:10px;">
                    <label>Password:</label>
                    <input type="password" id="adminPassInput" class="form-control" placeholder="പാസ്‌വേഡ് നൽകുക">
                </div>
                <button class="btn-submit" onclick="submitAdminLogin()">Login</button>
            </div>
        `;
    }
}

function openAdminLoginModal() {
    ensureAdminModalExists();
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

function initRealtimeSync() {
    db.collection("fiesta2k26").doc("mainData").onSnapshot((doc) => {
        if (doc.exists) {
            const cloudData = doc.data() || {};
            appData = Object.assign({}, JSON.parse(JSON.stringify(defaultData)), cloudData);
            appData.teams = normalizeTeamsData(appData.teams);
            appData.programs = normalizeProgramsData(appData.programs);
            if (!appData.registrations) appData.registrations = {};
            if (!appData.matrixScores) appData.matrixScores = {};
            if (!Array.isArray(appData.results)) {
                appData.results = appData.results ? Object.values(appData.results) : [];
            }
            if (!appData.manualScoreOverride) {
                appData.manualScoreOverride = { enabled: false, teamA: 0, teamB: 0 };
            }
        }
        refreshAllPageViews();
    }, (err) => {
        console.error("Realtime sync error:", err);
    });
}

function refreshAllPageViews() {
    calculateAndDisplayHomeScores();
    if (typeof updateUIOnDataLoad === "function") updateUIOnDataLoad();
    if (typeof renderRegistrationMatrix === "function") renderRegistrationMatrix();
    if (typeof renderMasterScoreMatrix === "function") renderMasterScoreMatrix();
    if (typeof renderPublishedResults === "function") renderPublishedResults();
    if (typeof onResultCategoryChange === "function" && document.getElementById("resCatSelect")) {
        const currentProg = document.getElementById("resProgSelect")?.value;
        onResultCategoryChange();
        if (currentProg && document.getElementById("resProgSelect")) {
            document.getElementById("resProgSelect").value = currentProg;
        }
        if (typeof updatePosterPreview === "function") updatePosterPreview();
    }
    if (typeof renderTeamsRosterWithPoints === "function") renderTeamsRosterWithPoints();
}

function saveAppData(showAlert = true, customData = null, callback = null) {
    if (!isAdmin) {
        alert("അഡ്മിൻ ലോഗിൻ ആവശ്യമാണ്! മുകളിലുള്ള 🔐 Admin ബട്ടൺ വഴി ലോഗിൻ ചെയ്യുക.");
        openAdminLoginModal();
        return;
    }
    const dataToSave = customData || appData;
    db.collection("fiesta2k26").doc("mainData").set(dataToSave, { merge: true }).then(() => {
        appData = dataToSave;
        refreshAllPageViews();
        if (showAlert) alert("മാറ്റങ്ങൾ വിജയകരമായി സേവ് ചെയ്തു!");
        if (callback) callback(true);
    }).catch((err) => {
        console.error("Save error:", err);
        if (showAlert) alert("സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു: " + err.message);
    });
}

// Helper & Normalization Functions
function normalizeCategoryKey(cat) {
    const raw = String(cat || "senior").toLowerCase().replace(/[\s_-]+/g, "");
    if (raw.includes("subjunior") || raw.includes("sub")) return "subjunior";
    if (raw.includes("junior")) return "junior";
    if (raw.includes("general")) return "general";
    return "senior";
}

function resolveTeamKey(teamVal) {
    const val = String(teamVal || "").trim().toLowerCase();
    if (val === "teamb" || val.includes("iznik") || val === "b" || val === "team b") return "teamB";
    return "teamA";
}

function formatTeamDisplayName(teamVal) {
    return resolveTeamKey(teamVal) === "teamB" ? "Team IZNIK" : "Team ZELLIJ";
}

function buildCellKey(catKey, progName) {
    return `${normalizeCategoryKey(catKey)}__${String(progName || "").trim()}`;
}

function normalizeTeamsData(teams) {
    const fallback = JSON.parse(JSON.stringify(defaultData.teams));
    if (!teams || typeof teams !== "object") return fallback;
    ["teamA", "teamB"].forEach(tKey => {
        if (!teams[tKey] || typeof teams[tKey] !== "object") {
            teams[tKey] = fallback[tKey];
        } else {
            ["senior", "junior", "subjunior", "general"].forEach(cKey => {
                if (!Array.isArray(teams[tKey][cKey])) teams[tKey][cKey] = [];
            });
        }
    });
    return teams;
}

function normalizeProgramsData(programs) {
    const fallback = JSON.parse(JSON.stringify(defaultData.programs));
    if (!programs || typeof programs !== "object") return fallback;
    ["senior", "junior", "subjunior", "general"].forEach(cKey => {
        const catObj = programs[cKey];
        if (!catObj || typeof catObj !== "object" || Array.isArray(catObj)) {
            programs[cKey] = {
                onStage: Array.isArray(catObj) ? catObj : [],
                offStage: [],
                sports: []
            };
        } else {
            if (!Array.isArray(catObj.onStage)) catObj.onStage = [];
            if (!Array.isArray(catObj.offStage)) catObj.offStage = [];
            if (!Array.isArray(catObj.sports)) catObj.sports = [];
        }
    });
    return programs;
}

function getPointsMapForProgram(progName) {
    if (appData.pointPreset === "10-5-3") {
        return { 1: 10, 2: 5, 3: 3 };
    }
    const upperProg = String(progName || "").trim().toUpperCase();
    const isGroup = GROUP_EVENTS_LIST.some(g => upperProg.includes(g));
    return isGroup ? { 1: 10, 2: 6, 3: 3 } : { 1: 5, 2: 3, 3: 1 };
}

function getProgramScoresForCell(catKey, progName) {
    const cKey = normalizeCategoryKey(catKey);
    const cellKey = buildCellKey(cKey, progName);

    if (appData.matrixScores && appData.matrixScores[cellKey]) {
        const m = appData.matrixScores[cellKey];
        return {
            teamA: Array.isArray(m.teamA) ? m.teamA.map(Number).filter(n => Number.isFinite(n) && n > 0) : [],
            teamB: Array.isArray(m.teamB) ? m.teamB.map(Number).filter(n => Number.isFinite(n) && n > 0) : []
        };
    }

    const teamAScores = [];
    const teamBScores = [];
    const results = Array.isArray(appData.results) ? appData.results : [];
    const targetProg = String(progName || "").trim().toLowerCase();

    results.forEach(res => {
        if (!res || !res.program) return;
        const resCat = normalizeCategoryKey(res.category);
        const resProg = String(res.program).trim().toLowerCase();
        if (resCat === cKey && resProg === targetProg) {
            const ptsMap = getPointsMapForProgram(res.program);
            const t1 = resolveTeamKey(res.win1Team || res.team1);
            const t2 = resolveTeamKey(res.win2Team || res.team2);
            const t3 = resolveTeamKey(res.win3Team || res.team3);

            if (res.win1Name) {
                if (t1 === "teamA") teamAScores.push(ptsMap[1]);
                else teamBScores.push(ptsMap[1]);
            }
            if (res.win2Name) {
                if (t2 === "teamA") teamAScores.push(ptsMap[2]);
                else teamBScores.push(ptsMap[2]);
            }
            if (res.win3Name) {
                if (t3 === "teamA") teamAScores.push(ptsMap[3]);
                else teamBScores.push(ptsMap[3]);
            }
        }
    });

    return { teamA: teamAScores, teamB: teamBScores };
}

function calculateAndDisplayHomeScores() {
    let ptsA = 0, ptsB = 0;
    let medalsA = { gold: 0, silver: 0, bronze: 0 };
    let medalsB = { gold: 0, silver: 0, bronze: 0 };

    const results = Array.isArray(appData.results) ? appData.results : Object.values(appData.results || {});
    const countedCellKeys = new Set();

    results.forEach(res => {
        if (!res || !res.program) return;
        const cKey = normalizeCategoryKey(res.category);
        const cellKey = buildCellKey(cKey, res.program);
        const ptsMap = getPointsMapForProgram(res.program);

        const t1 = resolveTeamKey(res.win1Team || res.team1);
        const t2 = resolveTeamKey(res.win2Team || res.team2);
        const t3 = resolveTeamKey(res.win3Team || res.team3);

        if (res.win1Name) {
            if (t1 === "teamA") { medalsA.gold++; if (!appData.matrixScores?.[cellKey]) ptsA += ptsMap[1]; }
            else { medalsB.gold++; if (!appData.matrixScores?.[cellKey]) ptsB += ptsMap[1]; }
        }
        if (res.win2Name) {
            if (t2 === "teamA") { medalsA.silver++; if (!appData.matrixScores?.[cellKey]) ptsA += ptsMap[2]; }
            else { medalsB.silver++; if (!appData.matrixScores?.[cellKey]) ptsB += ptsMap[2]; }
        }
        if (res.win3Name) {
            if (t3 === "teamA") { medalsA.bronze++; if (!appData.matrixScores?.[cellKey]) ptsA += ptsMap[3]; }
            else { medalsB.bronze++; if (!appData.matrixScores?.[cellKey]) ptsB += ptsMap[3]; }
        }
    });

    if (appData.matrixScores && typeof appData.matrixScores === "object") {
        Object.keys(appData.matrixScores).forEach(k => {
            if (countedCellKeys.has(k)) return;
            countedCellKeys.add(k);
            const entry = appData.matrixScores[k];
            if (entry) {
                if (Array.isArray(entry.teamA)) ptsA += entry.teamA.reduce((a, b) => a + (Number(b) || 0), 0);
                if (Array.isArray(entry.teamB)) ptsB += entry.teamB.reduce((a, b) => a + (Number(b) || 0), 0);
            }
        });
    }

    if (appData.manualScoreOverride && appData.manualScoreOverride.enabled) {
        ptsA = Number(appData.manualScoreOverride.teamA) || 0;
        ptsB = Number(appData.manualScoreOverride.teamB) || 0;
    }

    computedGrandTotals = { teamA: ptsA, teamB: ptsB, medalsA, medalsB };
    updateIndexScoreboard(ptsA, ptsB);

    // Update points.html elements if present
    const bigPtsA = document.getElementById("bigPtsA");
    const bigPtsB = document.getElementById("bigPtsB");
    const medalsAEl = document.getElementById("medalsA");
    const medalsBEl = document.getElementById("medalsB");

    if (bigPtsA) bigPtsA.textContent = ptsA;
    if (bigPtsB) bigPtsB.textContent = ptsB;
    if (medalsAEl) medalsAEl.textContent = `🥇${medalsA.gold} 🥈${medalsA.silver} 🥉${medalsA.bronze}`;
    if (medalsBEl) medalsBEl.textContent = `🥇${medalsB.gold} 🥈${medalsB.silver} 🥉${medalsB.bronze}`;

    const manualToggle = document.getElementById("manualScoreToggle");
    const manualInputA = document.getElementById("manualPtsAInput");
    const manualInputB = document.getElementById("manualPtsBInput");
    const presetSelect = document.getElementById("pointPresetSelect");

    if (manualToggle && appData.manualScoreOverride) {
        manualToggle.checked = !!appData.manualScoreOverride.enabled;
    }
    if (manualInputA && document.activeElement !== manualInputA) {
        manualInputA.value = appData.manualScoreOverride?.teamA ?? ptsA;
    }
    if (manualInputB && document.activeElement !== manualInputB) {
        manualInputB.value = appData.manualScoreOverride?.teamB ?? ptsB;
    }
    if (presetSelect && appData.pointPreset) {
        presetSelect.value = appData.pointPreset;
    }
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

// Scoreboard Matrix Cell Editing & Controls (points.html)
function openCellScoreModal(catKey, progName) {
    if (!isAdmin) return;
    const cellKey = buildCellKey(catKey, progName);
    const current = getProgramScoresForCell(catKey, progName);

    const modal = document.getElementById("cellScoreModal");
    const title = document.getElementById("cellModalTitle");
    const keyInput = document.getElementById("editCellKey");
    const inputA = document.getElementById("editCellTeamA");
    const inputB = document.getElementById("editCellTeamB");

    if (title) title.textContent = `${catKey.toUpperCase()} • ${progName}`;
    if (keyInput) keyInput.value = cellKey;
    if (inputA) inputA.value = current.teamA.join(", ");
    if (inputB) inputB.value = current.teamB.join(", ");
    if (modal) modal.style.display = "flex";
}

function closeCellScoreModal() {
    const modal = document.getElementById("cellScoreModal");
    if (modal) modal.style.display = "none";
}

function saveCellScoreModal() {
    if (!isAdmin) return;
    const cellKey = document.getElementById("editCellKey")?.value;
    if (!cellKey) return;

    const parseMarks = (str) => String(str || "")
        .split(",")
        .map(s => Number(s.trim()))
        .filter(n => Number.isFinite(n) && n > 0);

    const arrA = parseMarks(document.getElementById("editCellTeamA")?.value);
    const arrB = parseMarks(document.getElementById("editCellTeamB")?.value);

    let cloned = JSON.parse(JSON.stringify(appData));
    if (!cloned.matrixScores) cloned.matrixScores = {};
    cloned.matrixScores[cellKey] = { teamA: arrA, teamB: arrB };

    saveAppData(false, cloned, () => {
        closeCellScoreModal();
    });
}

function clearCellScoreModal() {
    if (!isAdmin) return;
    const cellKey = document.getElementById("editCellKey")?.value;
    if (!cellKey) return;

    let cloned = JSON.parse(JSON.stringify(appData));
    if (cloned.matrixScores && cloned.matrixScores[cellKey]) {
        delete cloned.matrixScores[cellKey];
    }
    saveAppData(false, cloned, () => {
        closeCellScoreModal();
    });
}

function changePointPreset(presetVal) {
    if (!isAdmin) return;
    let cloned = JSON.parse(JSON.stringify(appData));
    cloned.pointPreset = presetVal;
    saveAppData(false, cloned);
}

function saveManualScoreFromUI() {
    if (!isAdmin) return;
    const enabled = !!document.getElementById("manualScoreToggle")?.checked;
    const ptsA = Number(document.getElementById("manualPtsAInput")?.value) || 0;
    const ptsB = Number(document.getElementById("manualPtsBInput")?.value) || 0;

    let cloned = JSON.parse(JSON.stringify(appData));
    cloned.manualScoreOverride = { enabled, teamA: ptsA, teamB: ptsB };
    saveAppData(true, cloned);
}

function toggleTvFullscreenMode() {
    document.body.classList.toggle("tv-live-mode");
    const isTv = document.body.classList.contains("tv-live-mode");
    const btn = document.getElementById("tvModeBtn");
    if (btn) {
        btn.textContent = isTv ? "❌ Exit TV" : "📺 TV Mode";
    }
}

// Poster PNG Download Function (results.html)
function downloadResultPoster() {
    const posterEl = document.getElementById("posterCanvas");
    if (!posterEl) return;
    if (typeof html2canvas !== "function") {
        alert("Poster generator library ലോഡ് ആയിട്ടില്ല. ദയവായി പേജ് റീഫ്രഷ് ചെയ്യുക.");
        return;
    }
    html2canvas(posterEl, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
    }).then((canvas) => {
        const link = document.createElement("a");
        const resNo = document.getElementById("resNoInput")?.value || "01";
        link.download = `EID-E-IRSHAD-Result-${resNo}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch((err) => {
        console.error("Poster download error:", err);
        alert("പോസ്റ്റർ ഡൗൺലോഡ് ചെയ്യുന്നതിൽ പിശക് നേരിട്ടു.");
    });
}

function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "eid_irshad_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
