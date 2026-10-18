/* ==========================================================================
   EID-E IRSHAD — CAMPUS FEST 2K26 | APP LOGIC (app.js)
   ========================================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyAJ7gwJjRcvYIft6vA-4nxhE1AVPrpTDmv",
    authDomain: "eid-e-irshad-2k26.firebaseapp.com",
    projectId: "eid-e-irshad-2k26"
};

let db = null;
let auth = null;
let unsubscribeFirestore = null;

const GROUP_EVENTS_LIST = [
    "സംഘഗാനം", "ബുർദ", "ഖവാലി", "സ്പോട്ട് മാഗസിൻ", "സയൻസ് പ്രൊജക്ട്",
    "ക്യാമ്പസ് സോങ്", "തദ്‌രീസ്", "ഖുതുബ & മആശറ", "Table Talk", "റീൽ മേക്കിങ്",
    "Penalty Shootout", "Tug of War", "Relay Race"
];

const defaultData = {
    programs: {
        senior: {
            onStage: ["ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "അറബിക് പ്രസംഗം", "മധുരമലയാളം", "ഖുർആൻ പ്രഭാഷണം", "അനൗൺസ്മെന്റ്", "മലയാള ഗാനം", "അറബി ഗാനം", "നിമിഷ പ്രസംഗം", "സംഘഗാനം"],
            offStage: ["മലയാള പ്രബന്ധം", "ഇംഗ്ലീഷ് പ്രബന്ധം", "അറബിക് പ്രബന്ധം", "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്", "ചിത്ര രചന", "പോസ്റ്റർ ഡിസൈൻ", "അറബി വായന", "കഥാരചന", "അടിക്കുറിപ്പ് രചന", "AI Poster Design", "സുഡോക്കോ", "ഹിഫ്ള്", "കാലിഗ്രഫി", "കമ്പ്യൂട്ടർ ടൈപ്പിംഗ്", "ട്രാൻസിലേഷൻ M to A", "M to E", "അറബിക് പദപ്പയറ്റ്", "ക്വിസ്", "Writing", "മദ്ഹ്ഗാന രചന"],
            sports: ["100m Race", "Long Jump", "Shot Put", "Cut Post Shoot", "Discus Throw"]
        },
        junior: {
            onStage: ["ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "ഇംഗ്ലീഷ് പ്രസംഗം", "മധുരമലയാളം", "അനൗൺസ്മെന്റ്", "മലയാള ഗാനം", "അറബി ഗാനം", "കവിത പാരായണം", "സംഘഗാനം"],
            offStage: ["മലയാള പ്രബന്ധം", "ഇംഗ്ലീഷ് പ്രബന്ധം", "അറബിക് പ്രബന്ധം", "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്", "ചിത്ര രചന", "പോസ്റ്റർ ഡിസൈൻ", "അറബി വായന", "കഥാരചന", "അടിക്കുറിപ്പ് രചന", "ഇംഗ്ലീഷ് വായന", "IQ Test", "അറബിക് പദപ്പയറ്റ്", "ഹിഫ്ള്", "കാലിഗ്രഫി", "ക്വിസ്"],
            sports: ["100m Race", "Long Jump", "Shot Put", "Cut Post Shoot", "Lemon & Spoon Race"]
        },
        subjunior: {
            onStage: ["ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "കഥ പറയൽ", "ബാങ്ക് വിളി", "മലയാള ഗാനം", "അറബി ഗാനം", "സംഘഗാനം"],
            offStage: ["മലയാള പ്രബന്ധം", "പെൻസിൽ ഡ്രോയിംഗ്", "ഇംഗ്ലീഷ് വായന", "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്", "ചിത്ര രചന", "മലയാളം വായന", "കാലിഗ്രഫി", "ഖുർആൻ മെമ്മറി", "കഥാരചന", "ക്വിസ്", "മെമ്മറി ടെസ്റ്റ്"],
            sports: ["50m Race", "Long Jump", "Biscuit Eating", "Cut Post Shoot", "Filling a Bottle"]
        },
        general: {
            onStage: ["മോട്ടിവേഷൻ സ്പീച്ച്", "കഥാപ്രസംഗം", "ബുർദ", "റീൽ മേക്കിങ്", "ക്യാമ്പസ് സോങ്", "തദ്‌രീസ്", "ഖുതുബ & മആശറ", "സയൻസ് പ്രൊജക്ട്", "Table Talk", "ഖവാലി", "സ്പോട്ട് മാഗസിൻ"],
            offStage: [],
            sports: ["Penalty Shootout", "Tug of War", "Relay Race"]
        }
    },
    teams: {
        teamA: {
            name: "Team ZELLIJ", shortName: "ZELLIJ", color: "#b91c1c",
            senior: ["Safwan (C)", "Ramees (Vc)", "Fayiz (Vc)", "Thangal", "Asaf", "Thasnif", "Thwahir", "Irfan"],
            junior: ["Qasim", "Sinan MT", "Ashiq", "Saeed"],
            subjunior: ["Shahin", "Muhsin", "Razi", "Anshid"]
        },
        teamB: {
            name: "Team IZNIK", shortName: "IZNIK", color: "#1d4ed8",
            senior: ["Shibili (C)", "Ismail (Vc)", "Abdul Vahab (Vc)", "Sinan P.k", "Adhil", "Rahees", "Amir", "Afsal"],
            junior: ["Sinan Edayoor", "Sinan Cherushola", "Aslam", "Hijaz", "Jazeel"],
            subjunior: ["Nijad", "Farhan", "Nusaif"]
        }
    },
    results: [],
    manualScoreOverride: { enabled: false, teamA: 0, teamB: 0 },
    poll: { zellij: 12, iznik: 15 }
};

let appData = JSON.parse(JSON.stringify(defaultData));
let isAdmin = localStorage.getItem("eid_irshad_admin_logged") === "true";
let currentPosterTheme = "theme-green";
let currentPosterLayout = "layout-model-1";

function initFirebaseAndLoad() {
    const cached = localStorage.getItem("eid_irshad_app_data_v2");
    if (cached) { try { mergeLoadedData(JSON.parse(cached)); } catch (e) {} }
    renderAll();

    if (typeof firebase !== "undefined") {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            if (firebase.auth) {
                auth = firebase.auth();
                auth.onAuthStateChanged((user) => {
                    if (user && user.email) { isAdmin = true; localStorage.setItem("eid_irshad_admin_logged", "true"); }
                    updateAdminUI(); renderAll();
                });
            }
            unsubscribeFirestore = db.collection("fiesta2k26").doc("mainData").onSnapshot((docSnap) => {
                if (docSnap.exists) {
                    mergeLoadedData(docSnap.data());
                    localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                    renderAll();
                } else { saveAppData(true); }
            }, (err) => {});
        } catch (err) {}
    }
}

function mergeLoadedData(incoming) {
    if (!incoming || typeof incoming !== "object") return;
    if (incoming.programs) appData.programs = incoming.programs;
    if (incoming.teams) appData.teams = incoming.teams;
    if (Array.isArray(incoming.results)) appData.results = incoming.results;
    if (incoming.manualScoreOverride) appData.manualScoreOverride = incoming.manualScoreOverride;
    if (incoming.poll) appData.poll = incoming.poll;
}

function saveAppData(silent = false) {
    localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
    renderAll();
    if (db) { db.collection("fiesta2k26").doc("mainData").set(appData, { merge: true }).catch(() => {}); }
}

function renderAll() {
    updateAdminUI();
    updateLiveScoreboard();
    initPosterBuilder();
    renderPublishedResults();
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("eid_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = savedTheme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("eid_theme", newTheme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = newTheme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function updateAdminUI() {
    const bar = document.getElementById("adminBar");
    const btn = document.getElementById("adminBtn");
    if (bar) bar.style.display = isAdmin ? "flex" : "none";
    if (btn) btn.style.display = isAdmin ? "none" : "inline-block";
    document.querySelectorAll(".admin-only").forEach(el => {
        el.style.display = isAdmin ? (el.dataset.display || "block") : "none";
    });
}

function openAdminModal() { document.getElementById("loginModal").style.display = "flex"; }
function closeAdminModal() { document.getElementById("loginModal").style.display = "none"; }

function loginAdmin() {
    const email = document.getElementById("adminEmail").value.trim().toLowerCase();
    const pass = document.getElementById("adminPassword").value.trim();
    if (email === "admin@irshad.com" && pass === "irshad2k26") {
        isAdmin = true; localStorage.setItem("eid_irshad_admin_logged", "true");
        closeAdminModal(); renderAll(); alert("Admin Mode Enabled!");
    } else { document.getElementById("loginError").textContent = "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്!"; }
}

function logoutAdmin() {
    isAdmin = false; localStorage.removeItem("eid_irshad_admin_logged");
    renderAll(); alert("Logged out.");
}

function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `eid_e_irshad_backup.json`);
    document.body.appendChild(dlAnchor); dlAnchor.click(); dlAnchor.remove();
}

function resolveTeamKey(teamValue) {
    if (!teamValue) return null;
    const val = String(teamValue).trim().toUpperCase();
    if (val === "TEAMA" || val === "TEAM A" || val.includes("ZELLIJ")) return "teamA";
    if (val === "TEAMB" || val === "TEAM B" || val.includes("IZNIK")) return "teamB";
    return null;
}

function formatTeamDisplayName(teamKeyOrStr) {
    const tKey = resolveTeamKey(teamKeyOrStr);
    if (tKey === "teamA") return "Team ZELLIJ";
    if (tKey === "teamB") return "Team IZNIK";
    return teamKeyOrStr || "";
}

function updateLiveScoreboard() {
    let totals = { teamA: 0, teamB: 0 };
    (appData.results || []).forEach(res => {
        const groupMode = res.isGroup === true;
        const ptsMap = groupMode ? { 1: 10, 2: 6, 3: 3 } : { 1: 5, 2: 3, 3: 1 };
        const processWinner = (teamStr, rank) => {
            const tKey = resolveTeamKey(teamStr);
            if (tKey && ptsMap[rank]) totals[tKey] += ptsMap[rank];
        };
        if (res.win1Team) processWinner(res.win1Team, 1);
        if (res.win2Team) processWinner(res.win2Team, 2);
        if (res.win3Team) processWinner(res.win3Team, 3);
    });

    if (appData.manualScoreOverride && appData.manualScoreOverride.enabled) {
        totals.teamA = appData.manualScoreOverride.teamA;
        totals.teamB = appData.manualScoreOverride.teamB;
    }

    const ptsAEl = document.getElementById("ptsA");
    const ptsBEl = document.getElementById("ptsB");
    if (ptsAEl) ptsAEl.textContent = totals.teamA;
    if (ptsBEl) ptsBEl.textContent = totals.teamB;
}

/* ==========================================================================
   POSTER BUILDER & LAYOUT SWITCHER LOGIC
   ========================================================================== */
function initPosterBuilder() {
    const catSelect = document.getElementById("resCatSelect");
    const progSelect = document.getElementById("resProgSelect");
    if (!catSelect || !progSelect) return;
    onResultCategoryChange();
}

function onResultCategoryChange() {
    const catSelect = document.getElementById("resCatSelect");
    const progSelect = document.getElementById("resProgSelect");
    if (!catSelect || !progSelect) return;

    const catVal = catSelect.value || "Senior";
    let cKey = "senior";
    if (catVal.toLowerCase().includes("sub")) cKey = "subjunior";
    else if (catVal.toLowerCase().includes("junior")) cKey = "junior";
    else if (catVal.toLowerCase().includes("general")) cKey = "general";

    const catPrograms = appData.programs[cKey] || { onStage: [], offStage: [], sports: [] };
    const allProgs = [...(catPrograms.onStage || []), ...(catPrograms.offStage || []), ...(catPrograms.sports || [])];

    progSelect.innerHTML = `<option value="">-- പ്രോഗ്രാം തിരഞ്ഞെടുക്കുക --</option>` +
        allProgs.map(p => `<option value="${p}">${p}</option>`).join("");

    const rosterKey = cKey === "general" ? "senior" : cKey;
    const combined = [
        ...(appData.teams.teamA[rosterKey] || []).map(s => ({ name: s.replace(/(\(C\)|\(Vc\))/g, "").trim(), team: "teamA", label: `🔴 ${s} (ZELLIJ)` })),
        ...(appData.teams.teamB[rosterKey] || []).map(s => ({ name: s.replace(/(\(C\)|\(Vc\))/g, "").trim(), team: "teamB", label: `🔵 ${s} (IZNIK)` }))
    ];

    [1, 2, 3].forEach(rank => {
        const sel = document.getElementById(`selWinner${rank}`);
        if (sel) {
            sel.innerHTML = `<option value="">-- വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക --</option>` +
                combined.map(st => `<option value="${st.name}|${st.team}">${st.label}</option>`).join("");
        }
    });

    updatePosterPreview();
}

function onWinnerStudentSelect(rank) {
    const sel = document.getElementById(`selWinner${rank}`);
    if (!sel || !sel.value) return;
    const [name, teamKey] = sel.value.split("|");
    const nameInput = document.getElementById(`win${rank}Name`);
    const teamSelect = document.getElementById(`win${rank}Team`);
    if (nameInput) nameInput.value = name;
    if (teamSelect) teamSelect.value = teamKey;
    updatePosterPreview();
}

function setPosterTheme(themeClass) {
    currentPosterTheme = themeClass;
    const canvas = document.getElementById("posterCanvas");
    if (canvas) {
        canvas.className = `${currentPosterLayout} ${currentPosterTheme}`;
    }
}

function setPosterLayout(layoutClass) {
    currentPosterLayout = layoutClass;
    const canvas = document.getElementById("posterCanvas");
    if (canvas) {
        canvas.className = `${currentPosterLayout} ${currentPosterTheme}`;
        
        document.getElementById("layoutModel1Container").style.display = (layoutClass === "layout-model-1") ? "block" : "none";
        document.getElementById("layoutModel2Container").style.display = (layoutClass === "layout-model-2") ? "block" : "none";
        document.getElementById("layoutModel3Container").style.display = (layoutClass === "layout-model-3") ? "block" : "none";
    }
    updatePosterPreview();
}

function updatePosterPreview() {
    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    const cat = document.getElementById("resCatSelect")?.value || "SENIOR";
    const progDrop = document.getElementById("resProgSelect")?.value || "";
    const progCustom = (document.getElementById("resProgCustom")?.value || "").trim();
    const progName = progCustom || progDrop || "മത്സരത്തിന്റെ പേര്";

    const w1Name = (document.getElementById("win1Name")?.value || "Winner Name 1").trim();
    const w1Team = formatTeamDisplayName(document.getElementById("win1Team")?.value || "teamA");

    const w2Name = (document.getElementById("win2Name")?.value || "Winner Name 2").trim();
    const w2Team = formatTeamDisplayName(document.getElementById("win2Team")?.value || "teamB");

    const w3Name = (document.getElementById("win3Name")?.value || "").trim();
    const w3Team = formatTeamDisplayName(document.getElementById("win3Team")?.value || "teamA");

    const setElText = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
    };

    ["previewResNo", "previewResNo2", "previewResNo3"].forEach(id => setElText(id, String(resNo).padStart(2, "0")));
    ["previewCat", "previewCat2", "previewCat3"].forEach(id => setElText(id, cat.toUpperCase()));
    ["previewProg", "previewProg2", "previewProg3"].forEach(id => setElText(id, progName.toUpperCase()));

    setElText("previewWin1Name", w1Name); setElText("previewWin1Team", w1Team);
    setElText("previewWin2Name", w2Name); setElText("previewWin2Team", w2Team);
    setElText("previewWin3Name", w3Name); setElText("previewWin3Team", w3Team);

    setElText("previewWin1Name2", w1Name); setElText("previewWin1Team2", w1Team);
    setElText("previewWin2Name2", w2Name); setElText("previewWin2Team2", w2Team);
    setElText("previewWin3Name2", w3Name); setElText("previewWin3Team2", w3Team);

    setElText("previewWin1Name3", w1Name); setElText("previewWin1Team3", w1Team);
    setElText("previewWin2Name3", w2Name); setElText("previewWin2Team3", w2Team);
    setElText("previewWin3Name3", w3Name); setElText("previewWin3Team3", w3Team);

    const w3Card = document.getElementById("previewWin3Card");
    const w3Card2 = document.getElementById("previewWin3Card2");
    const w3Card3 = document.getElementById("previewWin3Card3");

    if (w3Name) {
        if (w3Card) w3Card.style.display = "flex";
        if (w3Card2) w3Card2.style.display = "flex";
        if (w3Card3) w3Card3.style.display = "flex";
    } else {
        if (w3Card) w3Card.style.display = "none";
        if (w3Card2) w3Card2.style.display = "none";
        if (w3Card3) w3Card3.style.display = "none";
    }
}

function downloadResultPoster() {
    const canvasEl = document.getElementById("posterCanvas");
    if (!canvasEl || typeof html2canvas === "undefined") {
        alert("ഡൗൺലോഡ് ചെയ്യാൻ അല്പം കാത്തിരിക്കുക!");
        return;
    }
    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    html2canvas(canvasEl, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement("a");
        link.download = `EID-E-IRSHAD-Result-${resNo}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

function publishResultToSite() {
    if (!isAdmin) { alert("അഡ്മിൻ ലോഗിൻ ചെയ്യുക!"); return; }
    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    const category = document.getElementById("resCatSelect")?.value || "Senior";
    const prog = document.getElementById("resProgCustom")?.value || document.getElementById("resProgSelect")?.value || "Event";

    const newResult = {
        id: `${category}_${prog}`.toLowerCase(),
        resNo, category, program: prog,
        win1Name: document.getElementById("win1Name")?.value || "",
        win1Team: document.getElementById("win1Team")?.value || "teamA",
        win2Name: document.getElementById("win2Name")?.value || "",
        win2Team: document.getElementById("win2Team")?.value || "teamB",
        win3Name: document.getElementById("win3Name")?.value || "",
        win3Team: document.getElementById("win3Team")?.value || "teamA",
        theme: currentPosterTheme, layout: currentPosterLayout, timestamp: Date.now()
    };

    appData.results.unshift(newResult);
    saveAppData();
    if (typeof confetti === "function") confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    alert("റിസൾട്ട് വിജയകരമായി പ്രസിദ്ധീകരിച്ചു!");
}

function renderPublishedResults() {
    const container = document.getElementById("publishedResultsContainer");
    if (!container) return;
    const list = appData.results || [];
    if (list.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);">ഇതുവരെ ഫലങ്ങളൊന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ല.</div>`;
        return;
    }
    container.innerHTML = list.map((res, idx) => `
        <div class="result-card">
            <div class="result-card-head">
                <div>
                    <span style="font-size:0.75rem; background:#fbbf24; color:#0f172a; padding:2px 8px; border-radius:4px; font-weight:800;">RESULT #${res.resNo || (idx+1)}</span>
                    <h3 style="margin:6px 0 0; font-size:1.05rem;">${res.program}</h3>
                </div>
                ${isAdmin ? `<button class="btn-action-sm btn-del-sm" onclick="appData.results.splice(${idx},1); saveAppData();">🗑️</button>` : ''}
            </div>
            <div class="winner-row"><span>🥇 ${res.win1Name}</span><span class="team-badge-a">${formatTeamDisplayName(res.win1Team)}</span></div>
            ${res.win2Name ? `<div class="winner-row"><span>🥈 ${res.win2Name}</span><span class="team-badge-b">${formatTeamDisplayName(res.win2Team)}</span></div>` : ''}
            ${res.win3Name ? `<div class="winner-row"><span>🥉 ${res.win3Name}</span><span class="team-badge-a">${formatTeamDisplayName(res.win3Team)}</span></div>` : ''}
        </div>
    `).join("");
}

window.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    initFirebaseAndLoad();
});
