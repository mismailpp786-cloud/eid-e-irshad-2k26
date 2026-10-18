/* ==========================================================================
   EID-E IRSHAD — CAMPUS FEST 2K26 | COMPLETE APPLICATION LOGIC (app.js)
   ========================================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyAJ7gwJjRcvYIft6vA-4nxhE1AVPrpTDmv",
    authDomain: "eid-e-irshad-2k26.firebaseapp.com",
    projectId: "eid-e-irshad-2k26"
};

let db = null;
let auth = null;
let unsubscribeFirestore = null;

// Group events that receive Group Points (1st: 10, 2nd: 6, 3rd: 3)
const GROUP_EVENTS_LIST = [
    "സംഘഗാനം",
    "ബുർദ",
    "ഖവാലി",
    "സ്പോട്ട് മാഗസിൻ",
    "സയൻസ് പ്രൊജക്ട്",
    "ക്യാമ്പസ് സോങ്",
    "തദ്‌രീസ്",
    "ഖുതുബ & മആശറ",
    "Table Talk",
    "റീൽ മേക്കിങ്",
    "Penalty Shootout",
    "Tug of War",
    "Relay Race"
];

// Complete Verified Default Data (102 Programs + Full ZELLIJ & IZNIK Rosters)
const defaultData = {
    programs: {
        senior: {
            onStage: [
                "ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "അറബിക് പ്രസംഗം", "മധുരമലയാളം",
                "ഖുർആൻ പ്രഭാഷണം", "അനൗൺസ്മെന്റ്", "മലയാള ഗാനം", "അറബി ഗാനം",
                "നിമിഷ പ്രസംഗം", "സംഘഗാനം"
            ],
            offStage: [
                "മലയാള പ്രബന്ധം", "ഇംഗ്ലീഷ് പ്രബന്ധം", "അറബിക് പ്രബന്ധം",
                "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്",
                "ചിത്ര രചന", "പോസ്റ്റർ ഡിസൈൻ", "അറബി വായന", "കഥാരചന",
                "അടിക്കുറിപ്പ് രചന", "AI Poster Design", "സുഡോക്കോ", "ഹിഫ്ള്",
                "കാലിഗ്രഫി", "കമ്പ്യൂട്ടർ ടൈപ്പിംഗ്", "ട്രാൻസിലേഷൻ M to A",
                "M to E", "അറബിക് പദപ്പയറ്റ്", "ക്വിസ്", "Writing", "മദ്ഹ്ഗാന രചന"
            ],
            sports: [
                "100m Race", "Long Jump", "Shot Put", "Cut Post Shoot", "Discus Throw"
            ]
        },
        junior: {
            onStage: [
                "ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "ഇംഗ്ലീഷ് പ്രസംഗം", "മധുരമലയാളം",
                "അനൗൺസ്മെന്റ്", "മലയാള ഗാനം", "അറബി ഗാനം", "കവിത പാരായണം", "സംഘഗാനം"
            ],
            offStage: [
                "മലയാള പ്രബന്ധം", "ഇംഗ്ലീഷ് പ്രബന്ധം", "അറബിക് പ്രബന്ധം",
                "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്",
                "ചിത്ര രചന", "പോസ്റ്റർ ഡിസൈൻ", "അറബി വായന", "കഥാരചന",
                "അടിക്കുറിപ്പ് രചന", "ഇംഗ്ലീഷ് വായന", "IQ Test",
                "അറബിക് പദപ്പയറ്റ്", "ഹിഫ്ള്", "കാലിഗ്രഫി", "ക്വിസ്"
            ],
            sports: [
                "100m Race", "Long Jump", "Shot Put", "Cut Post Shoot", "Lemon & Spoon Race"
            ]
        },
        subjunior: {
            onStage: [
                "ഖിറാഅത്ത്", "മലയാള പ്രസംഗം", "കഥ പറയൽ", "ബാങ്ക് വിളി",
                "മലയാള ഗാനം", "അറബി ഗാനം", "സംഘഗാനം"
            ],
            offStage: [
                "മലയാള പ്രബന്ധം", "പെൻസിൽ ഡ്രോയിംഗ്", "ഇംഗ്ലീഷ് വായന",
                "മലയാളം കയ്യെഴുത്ത്", "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", "അറബിക് കയ്യെഴുത്ത്",
                "ചിത്ര രചന", "മലയാളം വായന", "കാലിഗ്രഫി", "ഖുർആൻ മെമ്മറി",
                "കഥാരചന", "ക്വിസ്", "മെമ്മറി ടെസ്റ്റ്"
            ],
            sports: [
                "50m Race", "Long Jump", "Biscuit Eating", "Cut Post Shoot", "Filling a Bottle"
            ]
        },
        general: {
            onStage: [
                "മോട്ടിവേഷൻ സ്പീച്ച്", "കഥാപ്രസംഗം", "ബുർദ", "റീൽ മേക്കിങ്",
                "ക്യാമ്പസ് സോങ്", "തദ്‌രീസ്", "ഖുതുബ & മആശറ", "സയൻസ് പ്രൊജക്ട്",
                "Table Talk", "ഖവാലി", "സ്പോട്ട് മാഗസിൻ"
            ],
            offStage: [],
            sports: [
                "Penalty Shootout", "Tug of War", "Relay Race"
            ]
        }
    },
    teams: {
        teamA: {
            name: "Team ZELLIJ",
            shortName: "ZELLIJ",
            color: "#b91c1c",
            senior: ["Safwan (C)", "Ramees (Vc)", "Fayiz (Vc)", "Thangal", "Asaf", "Thasnif", "Thwahir", "Irfan"],
            junior: ["Qasim", "Sinan MT", "Ashiq", "Saeed"],
            subjunior: ["Shahin", "Muhsin", "Razi", "Anshid"]
        },
        teamB: {
            name: "Team IZNIK",
            shortName: "IZNIK",
            color: "#1d4ed8",
            senior: ["Shibili (C)", "Ismail (Vc)", "Abdul Vahab (Vc)", "Sinan P.k", "Adhil", "Rahees", "Amir", "Afsal"],
            junior: ["Sinan Edayoor", "Sinan Cherushola", "Aslam", "Hijaz", "Jazeel"],
            subjunior: ["Nijad", "Farhan", "Nusaif"]
        }
    },
    results: [],
    manualScoreOverride: {
        enabled: false,
        teamA: 0,
        teamB: 0
    },
    poll: {
        zellij: 12,
        iznik: 15
    }
};

let appData = JSON.parse(JSON.stringify(defaultData));
let currentCategory = "senior";
let currentType = "all";
let isAdmin = localStorage.getItem("eid_irshad_admin_logged") === "true";
let editingProgramRef = null;
let currentPosterTheme = "theme-ref1";

/* ==========================================================================
   1. INITIALIZATION & FIREBASE CONNECTION
   ========================================================================== */
function initFirebaseAndLoad() {
    // Load local cache immediately for fast rendering
    const cached = localStorage.getItem("eid_irshad_app_data_v2");
    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            mergeLoadedData(parsed);
        } catch (e) {
            console.warn("Cache parse error:", e);
        }
    }
    renderAll();

    // Initialize Firebase if SDK is loaded
    if (typeof firebase !== "undefined") {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            if (firebase.auth) {
                auth = firebase.auth();
                auth.onAuthStateChanged((user) => {
                    if (user && user.email) {
                        isAdmin = true;
                        localStorage.setItem("eid_irshad_admin_logged", "true");
                    }
                    updateAdminUI();
                    renderAll();
                });
            }

            // Real-time listener on fiesta2k26/mainData
            unsubscribeFirestore = db.collection("fiesta2k26").doc("mainData")
                .onSnapshot((docSnap) => {
                    if (docSnap.exists) {
                        const cloudData = docSnap.data();
                        mergeLoadedData(cloudData);
                        localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                        renderAll();
                    } else {
                        // Initialize cloud document if empty
                        saveAppData(true);
                    }
                }, (err) => {
                    console.warn("Firestore real-time listener fallback to local cache:", err.message);
                });
        } catch (err) {
            console.warn("Firebase init error:", err);
        }
    }
}

function mergeLoadedData(incoming) {
    if (!incoming || typeof incoming !== "object") return;

    if (incoming.programs) {
        ["senior", "junior", "subjunior", "general"].forEach(cat => {
            if (incoming.programs[cat]) {
                appData.programs[cat] = {
                    onStage: Array.isArray(incoming.programs[cat].onStage) ? incoming.programs[cat].onStage : defaultData.programs[cat].onStage,
                    offStage: Array.isArray(incoming.programs[cat].offStage) ? incoming.programs[cat].offStage : defaultData.programs[cat].offStage,
                    sports: Array.isArray(incoming.programs[cat].sports) ? incoming.programs[cat].sports : defaultData.programs[cat].sports
                };
            }
        });
    }

    if (incoming.teams && incoming.teams.teamA && incoming.teams.teamB) {
        appData.teams.teamA = {
            ...defaultData.teams.teamA,
            ...incoming.teams.teamA,
            senior: Array.isArray(incoming.teams.teamA.senior) ? incoming.teams.teamA.senior : defaultData.teams.teamA.senior,
            junior: Array.isArray(incoming.teams.teamA.junior) ? incoming.teams.teamA.junior : defaultData.teams.teamA.junior,
            subjunior: Array.isArray(incoming.teams.teamA.subjunior) ? incoming.teams.teamA.subjunior : defaultData.teams.teamA.subjunior
        };
        appData.teams.teamB = {
            ...defaultData.teams.teamB,
            ...incoming.teams.teamB,
            senior: Array.isArray(incoming.teams.teamB.senior) ? incoming.teams.teamB.senior : defaultData.teams.teamB.senior,
            junior: Array.isArray(incoming.teams.teamB.junior) ? incoming.teams.teamB.junior : defaultData.teams.teamB.junior,
            subjunior: Array.isArray(incoming.teams.teamB.subjunior) ? incoming.teams.teamB.subjunior : defaultData.teams.teamB.subjunior
        };
    }

    if (Array.isArray(incoming.results)) {
        appData.results = incoming.results;
    }

    if (incoming.manualScoreOverride) {
        appData.manualScoreOverride = incoming.manualScoreOverride;
    }

    if (incoming.poll) {
        appData.poll = {
            zellij: typeof incoming.poll.zellij === "number" ? incoming.poll.zellij : 12,
            iznik: typeof incoming.poll.iznik === "number" ? incoming.poll.iznik : 15
        };
    }
}

function saveAppData(silent = false) {
    localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
    renderAll();

    if (db) {
        db.collection("fiesta2k26").doc("mainData").set(appData, { merge: true })
            .then(() => {
                if (!silent) console.log("Synced with Firestore fiesta2k26/mainData");
            })
            .catch((err) => {
                console.warn("Firestore write error (saved locally):", err.message);
            });
    }
}

function renderAll() {
    updateAdminUI();
    updateLiveScoreboard();
    updatePollUI();
    renderPrograms();
    renderTeams();
    renderPublishedResults();
    initPosterBuilder();
}

/* ==========================================================================
   2. THEME, COUNTDOWN & ADMIN AUTHENTICATION
   ========================================================================== */
function applySavedTheme() {
    const savedTheme = localStorage.getItem("eid_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = savedTheme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("eid_theme", newTheme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = newTheme === "dark" ? "☀️ Light" : "🌙 Dark";
}

function updateCountdown() {
    const eventDate = new Date("2026-11-27T09:00:00").getTime();
    const now = new Date().getTime();
    const diff = eventDate - now;

    const dEl = document.getElementById("cdDays");
    const hEl = document.getElementById("cdHours");
    const mEl = document.getElementById("cdMins");
    const sEl = document.getElementById("cdSecs");

    if (diff > 0 && dEl && hEl && mEl && sEl) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        dEl.textContent = String(days).padStart(2, "0");
        hEl.textContent = String(hours).padStart(2, "0");
        mEl.textContent = String(mins).padStart(2, "0");
        sEl.textContent = String(secs).padStart(2, "0");
    }
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

function openAdminModal() {
    const modal = document.getElementById("loginModal");
    const err = document.getElementById("loginError");
    const pass = document.getElementById("adminPassword");
    if (err) err.textContent = "";
    if (pass) pass.value = "";
    if (modal) modal.style.display = "flex";
}

function closeAdminModal() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

function loginAdmin() {
    const emailEl = document.getElementById("adminEmail");
    const passEl = document.getElementById("adminPassword");
    const errEl = document.getElementById("loginError");

    const email = emailEl ? emailEl.value.trim().toLowerCase() : "";
    const pass = passEl ? passEl.value.trim() : "";

    if (!email || !pass) {
        if (errEl) errEl.textContent = "Email-um Password-um nalkuka!";
        return;
    }

    // Try Firebase Authentication first if available
    if (auth) {
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => {
                isAdmin = true;
                localStorage.setItem("eid_irshad_admin_logged", "true");
                closeAdminModal();
                renderAll();
                alert("Admin Login വിജയകരമായി പൂർത്തിയായി!");
            })
            .catch(() => {
                // Fallback for existing project setup if Firebase Auth user hasn't been created in console yet
                if (email === "admin@irshad.com" && pass === "irshad2k26") {
                    isAdmin = true;
                    localStorage.setItem("eid_irshad_admin_logged", "true");
                    closeAdminModal();
                    renderAll();
                    alert("Admin Mode Enabled!");
                } else {
                    if (errEl) errEl.textContent = "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്!";
                }
            });
    } else {
        if (email === "admin@irshad.com" && pass === "irshad2k26") {
            isAdmin = true;
            localStorage.setItem("eid_irshad_admin_logged", "true");
            closeAdminModal();
            renderAll();
            alert("Admin Mode Enabled!");
        } else {
            if (errEl) errEl.textContent = "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്!";
        }
    }
}

function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem("eid_irshad_admin_logged");
    if (auth && auth.currentUser) {
        auth.signOut();
    }
    renderAll();
    alert("Admin Mode-ൽ നിന്ന് ലോഗൗട്ട് ചെയ്തു.");
}

function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `eid_e_irshad_2k26_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
}

function resetToDefaultData() {
    if (!isAdmin) return;
    if (confirm("പ്രോഗ്രാം ലിസ്റ്റും ടീം ലിസ്റ്റും ഡിഫോൾട്ട് ഡാറ്റയിലേക്ക് റീസെറ്റ് ചെയ്യണോ? (നിലവിലുള്ള റിസൾട്ടുകൾ സുരക്ഷിതമായി നിലനിർത്തണോ എന്ന് അടുത്തതായി ചോദിക്കും)")) {
        const keepResults = confirm("നിലവിലുള്ള മത്സര ഫലങ്ങൾ (Results) നിലനിർത്തണോ? (OK = നിലനിർത്തുക, Cancel = എല്ലാം പൂജ്യമാക്കുക)");
        const savedResults = keepResults ? appData.results : [];
        appData = JSON.parse(JSON.stringify(defaultData));
        appData.results = savedResults;
        saveAppData();
        alert("ഡാറ്റ വിജയകരമായി പുനഃസ്ഥാപിച്ചു!");
    }
}

/* ==========================================================================
   3. GLOBAL SEARCH & AUDIENCE POLL (HOME PAGE)
   ========================================================================== */
function handleGlobalSearch(event, query) {
    const dropdown = document.getElementById("searchResultsDropdown");
    const q = (query || "").trim().toLowerCase();

    if (!dropdown) {
        if (q.length > 1 && event && event.key === "Enter") {
            location.href = `programs.html?search=${encodeURIComponent(q)}`;
        }
        return;
    }

    if (q.length < 1) {
        dropdown.style.display = "none";
        dropdown.innerHTML = "";
        return;
    }

    const matches = [];

    // Search Programs
    const catNames = { senior: "Senior", junior: "Junior", subjunior: "Sub-Junior", general: "General" };
    const typeNames = { onStage: "On Stage", offStage: "Off Stage", sports: "Sports" };

    ["senior", "junior", "subjunior", "general"].forEach(cat => {
        ["onStage", "offStage", "sports"].forEach(type => {
            (appData.programs[cat][type] || []).forEach(prog => {
                if (prog.toLowerCase().includes(q)) {
                    matches.push({
                        label: `📋 ${prog}`,
                        sub: `${catNames[cat]} • ${typeNames[type]}`,
                        link: `programs.html?cat=${cat}&search=${encodeURIComponent(prog)}`
                    });
                }
            });
        });
    });

    // Search Students in Team ZELLIJ & Team IZNIK
    [
        { key: "teamA", label: "🔴 ZELLIJ" },
        { key: "teamB", label: "🔵 IZNIK" }
    ].forEach(t => {
        ["senior", "junior", "subjunior"].forEach(cat => {
            (appData.teams[t.key][cat] || []).forEach(student => {
                if (student.toLowerCase().includes(q)) {
                    matches.push({
                        label: `👤 ${student}`,
                        sub: `${t.label} (${catNames[cat]})`,
                        link: `teams.html`
                    });
                }
            });
        });
    });

    if (matches.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</div>`;
    } else {
        dropdown.innerHTML = matches.slice(0, 12).map(m => `
            <div class="search-result-item" onclick="location.href='${m.link}'">
                <strong>${m.label}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${m.sub}</span>
            </div>
        `).join("");
    }
    dropdown.style.display = "block";
}

function votePoll(team) {
    if (localStorage.getItem("eid_has_voted")) {
        const msg = document.getElementById("pollMsg");
        if (msg) msg.textContent = "നിങ്ങൾ ഇതിനകം വോട്ട് രേഖപ്പെടുത്തിയിട്ടുണ്ട്!";
        return;
    }

    if (team === "zellij") appData.poll.zellij = (appData.poll.zellij || 0) + 1;
    if (team === "iznik") appData.poll.iznik = (appData.poll.iznik || 0) + 1;

    localStorage.setItem("eid_has_voted", "true");
    saveAppData(true);

    const msg = document.getElementById("pollMsg");
    if (msg) msg.textContent = "നന്ദി! നിങ്ങളുടെ വോട്ട് വിജയകരമായി രേഖപ്പെടുത്തി.";
    if (typeof confetti === "function") {
        confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } });
    }
}

function updatePollUI() {
    const z = appData.poll ? (appData.poll.zellij || 0) : 12;
    const i = appData.poll ? (appData.poll.iznik || 0) : 15;
    const total = z + i;
    const pctZ = total > 0 ? Math.round((z / total) * 100) : 50;
    const pctI = total > 0 ? Math.round((i / total) * 100) : 50;

    const zEl = document.getElementById("voteZellijCount");
    const iEl = document.getElementById("voteIznikCount");
    if (zEl) zEl.textContent = `${z} votes (${pctZ}%)`;
    if (iEl) iEl.textContent = `${i} votes (${pctI}%)`;
}

/* ==========================================================================
   4. POINT CALCULATION & LIVE SCOREBOARD (HOME & POINTS.HTML)
   ========================================================================== */
function isGroupProgram(programName) {
    if (!programName) return false;
    const clean = programName.trim().toLowerCase();
    return GROUP_EVENTS_LIST.some(g => clean.includes(g.toLowerCase()));
}

function resolveTeamKey(teamValue) {
    if (!teamValue) return null;
    const val = String(teamValue).trim().toUpperCase();
    if (val === "TEAMA" || val === "TEAM A" || val.includes("ZELLIJ")) return "teamA";
    if (val === "TEAMB" || val === "TEAM B" || val.includes("IZNIK")) return "teamB";
    if (val === "A") return "teamA";
    if (val === "B") return "teamB";
    return null;
}

function updateLiveScoreboard() {
    let totals = { teamA: 0, teamB: 0 };
    let cats = {
        senior: { teamA: 0, teamB: 0 },
        junior: { teamA: 0, teamB: 0 },
        subjunior: { teamA: 0, teamB: 0 },
        general: { teamA: 0, teamB: 0 }
    };

    // Calculate from published results
    (appData.results || []).forEach(res => {
        const groupMode = res.isGroup === true || isGroupProgram(res.program);
        const ptsMap = groupMode ? { 1: 10, 2: 6, 3: 3 } : { 1: 5, 2: 3, 3: 1 };

        let cKey = "senior";
        const catStr = String(res.category || "").toUpperCase();
        if (catStr.includes("SUB")) cKey = "subjunior";
        else if (catStr.includes("JUNIOR")) cKey = "junior";
        else if (catStr.includes("GENERAL") || catStr.includes("SPORTS")) cKey = "general";

        const processWinner = (teamStr, rank) => {
            const tKey = resolveTeamKey(teamStr);
            if (tKey && ptsMap[rank]) {
                totals[tKey] += ptsMap[rank];
                cats[cKey][tKey] += ptsMap[rank];
            }
        };

        if (res.win1Name || res.win1Team) processWinner(res.win1Team, 1);
        if (res.win2Name || res.win2Team) processWinner(res.win2Team, 2);
        if (res.win3Name || res.win3Team) processWinner(res.win3Team, 3);
    });

    // Apply Manual Admin Score Override if enabled
    if (appData.manualScoreOverride && appData.manualScoreOverride.enabled) {
        totals.teamA = parseInt(appData.manualScoreOverride.teamA || 0, 10);
        totals.teamB = parseInt(appData.manualScoreOverride.teamB || 0, 10);
    }

    // Save to legacy localStorage keys as well for backward compatibility
    localStorage.setItem("eid_pts_zellij", totals.teamA);
    localStorage.setItem("eid_pts_iznik", totals.teamB);

    // 1. Update Home Page Progress Bar
    const ptsAEl = document.getElementById("ptsA");
    const ptsBEl = document.getElementById("ptsB");
    if (ptsAEl) ptsAEl.textContent = totals.teamA;
    if (ptsBEl) ptsBEl.textContent = totals.teamB;

    const grandTotal = totals.teamA + totals.teamB;
    const pctA = grandTotal > 0 ? (totals.teamA / grandTotal) * 100 : 50;
    const pctB = grandTotal > 0 ? (totals.teamB / grandTotal) * 100 : 50;

    const barA = document.getElementById("barA");
    const barB = document.getElementById("barB");
    if (barA) barA.style.width = pctA + "%";
    if (barB) barB.style.width = pctB + "%";

    // 2. Update points.html Vertical Bar Chart & Score Cards
    const dispZ = document.getElementById("displayPtsZellij");
    const dispI = document.getElementById("displayPtsIznik");
    if (dispZ) dispZ.textContent = totals.teamA;
    if (dispI) dispI.textContent = totals.teamB;

    const barScoreA = document.getElementById("barScoreA");
    const barScoreB = document.getElementById("barScoreB");
    if (barScoreA) barScoreA.textContent = totals.teamA + " Pts";
    if (barScoreB) barScoreB.textContent = totals.teamB + " Pts";

    const vBarA = document.getElementById("verticalBarA");
    const vBarB = document.getElementById("verticalBarB");
    if (vBarA && vBarB) {
        const maxScore = Math.max(totals.teamA, totals.teamB, 20);
        const heightA = Math.max(12, Math.round((totals.teamA / maxScore) * 100));
        const heightB = Math.max(12, Math.round((totals.teamB / maxScore) * 100));
        vBarA.style.height = heightA + "%";
        vBarB.style.height = heightB + "%";
    }

    // 3. Update Category Breakdown on points.html
    const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    setTxt("srPtsA", cats.senior.teamA);
    setTxt("srPtsB", cats.senior.teamB);
    setTxt("jrPtsA", cats.junior.teamA);
    setTxt("jrPtsB", cats.junior.teamB);
    setTxt("subPtsA", cats.subjunior.teamA);
    setTxt("subPtsB", cats.subjunior.teamB);
    setTxt("genPtsA", cats.general.teamA);
    setTxt("genPtsB", cats.general.teamB);

    // Populate Admin Override Inputs
    const inZ = document.getElementById("inputPtsZellij");
    const inI = document.getElementById("inputPtsIznik");
    if (inZ && document.activeElement !== inZ) inZ.value = totals.teamA;
    if (inI && document.activeElement !== inI) inI.value = totals.teamB;
}

function saveTeamPoints() {
    if (!isAdmin) return;
    const inZ = document.getElementById("inputPtsZellij");
    const inI = document.getElementById("inputPtsIznik");
    const ptsZ = parseInt(inZ ? inZ.value : "0", 10) || 0;
    const ptsI = parseInt(inI ? inI.value : "0", 10) || 0;

    appData.manualScoreOverride = {
        enabled: true,
        teamA: ptsZ,
        teamB: ptsI
    };
    saveAppData();
    if (typeof confetti === "function") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    alert("പോയിന്റ് നില വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!");
}

function disableManualScoreOverride() {
    if (!isAdmin) return;
    appData.manualScoreOverride = { enabled: false, teamA: 0, teamB: 0 };
    saveAppData();
    alert("റിസൾട്ടുകളിൽ നിന്നുള്ള ഓട്ടോമാറ്റിക് പോയിന്റ് കണക്കുകൂട്ടൽ പുനഃസ്ഥാപിച്ചു!");
}

/* ==========================================================================
   5. PROGRAMS PAGE LOGIC (programs.html)
   ========================================================================== */
function setCategory(cat, btnEl) {
    currentCategory = cat;
    document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderPrograms();
}

function setType(type, btnEl) {
    currentType = type;
    document.querySelectorAll(".type-tab").forEach(b => b.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderPrograms();
}

function renderPrograms() {
    const tbody = document.getElementById("programTableBody");
    const titleEl = document.getElementById("tableTitle");
    if (!tbody) return;

    const searchInput = document.getElementById("programSearchInput");
    const searchQ = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const catTitles = {
        senior: "Senior Category Programs",
        junior: "Junior Category Programs",
        subjunior: "Sub-Junior Category Programs",
        general: "General Category Programs"
    };
    if (titleEl) titleEl.textContent = catTitles[currentCategory] || "Programs List";

    const catObj = appData.programs[currentCategory] || { onStage: [], offStage: [], sports: [] };
    let rows = [];

    const pushItems = (arr, typeKey, typeLabel, badgeClass) => {
        (arr || []).forEach((item, idx) => {
            if (!searchQ || item.toLowerCase().includes(searchQ)) {
                rows.push({ name: item, typeKey, typeLabel, badgeClass, idx });
            }
        });
    };

    if (currentType === "all" || currentType === "onStage") {
        pushItems(catObj.onStage, "onStage", "🎙️ On Stage", "badge-onstage");
    }
    if (currentType === "all" || currentType === "offStage") {
        pushItems(catObj.offStage, "offStage", "✍️ Off Stage", "badge-offstage");
    }
    if (currentType === "all" || currentType === "sports") {
        pushItems(catObj.sports, "sports", "⚽ Sports", "badge-sports");
    }

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:25px; color:var(--text-muted);">ഈ വിഭാഗത്തിൽ മത്സരങ്ങളൊന്നും ലഭ്യമല്ല.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map((r, i) => {
        const groupBadge = isGroupProgram(r.name) ? `<span class="badge badge-group">Group</span>` : "";
        const adminBtns = isAdmin ? `
            <td>
                <button class="btn-action-sm btn-edit-sm" onclick="openEditProgramModal('${r.typeKey}', ${r.idx})">✏️</button>
                <button class="btn-action-sm btn-del-sm" onclick="deleteProgramItem('${r.typeKey}', ${r.idx})">🗑️</button>
            </td>
        ` : `<td class="admin-only"></td>`;

        return `
            <tr>
                <td style="width:50px; font-family:'Montserrat',sans-serif; font-weight:800; color:var(--text-muted);">#${String(i + 1).padStart(2, "0")}</td>
                <td><strong>${r.name}</strong> ${groupBadge}</td>
                <td><span class="badge ${r.badgeClass}">${r.typeLabel}</span></td>
                ${adminBtns}
            </tr>
        `;
    }).join("");
}

function openAddProgramModal() {
    if (!isAdmin) return;
    editingProgramRef = null;
    const modal = document.getElementById("programModal");
    const nameInput = document.getElementById("progNameInput");
    const typeSelect = document.getElementById("progTypeSelect");
    if (nameInput) nameInput.value = "";
    if (typeSelect) typeSelect.value = currentType === "all" ? "onStage" : currentType;
    if (modal) modal.style.display = "flex";
}

function openEditProgramModal(typeKey, idx) {
    if (!isAdmin) return;
    editingProgramRef = { typeKey, idx };
    const currentName = appData.programs[currentCategory][typeKey][idx];
    const modal = document.getElementById("programModal");
    const nameInput = document.getElementById("progNameInput");
    const typeSelect = document.getElementById("progTypeSelect");
    if (nameInput) nameInput.value = currentName || "";
    if (typeSelect) typeSelect.value = typeKey;
    if (modal) modal.style.display = "flex";
}

function closeProgramModal() {
    const modal = document.getElementById("programModal");
    if (modal) modal.style.display = "none";
}

function saveProgramChanges() {
    if (!isAdmin) return;
    const nameInput = document.getElementById("progNameInput");
    const typeSelect = document.getElementById("progTypeSelect");
    const name = nameInput ? nameInput.value.trim() : "";
    const typeKey = typeSelect ? typeSelect.value : "onStage";

    if (!name) {
        alert("മത്സരത്തിന്റെ പേര് നൽകുക!");
        return;
    }

    if (editingProgramRef) {
        // Remove from old type array if type changed
        if (editingProgramRef.typeKey !== typeKey) {
            appData.programs[currentCategory][editingProgramRef.typeKey].splice(editingProgramRef.idx, 1);
            appData.programs[currentCategory][typeKey].push(name);
        } else {
            appData.programs[currentCategory][typeKey][editingProgramRef.idx] = name;
        }
    } else {
        appData.programs[currentCategory][typeKey].push(name);
    }

    closeProgramModal();
    saveAppData();
}

function deleteProgramItem(typeKey, idx) {
    if (!isAdmin) return;
    const itemName = appData.programs[currentCategory][typeKey][idx];
    if (confirm(`"${itemName}" എന്ന മത്സരം ലിസ്റ്റിൽ നിന്ന് ഒഴിവാക്കണോ?`)) {
        appData.programs[currentCategory][typeKey].splice(idx, 1);
        saveAppData();
    }
}

/* ==========================================================================
   6. TEAMS ROSTER PAGE LOGIC (teams.html)
   ========================================================================== */
function renderTeams() {
    const containerA = document.getElementById("teamAContainer");
    const containerB = document.getElementById("teamBContainer");
    if (!containerA || !containerB) return;

    const buildTeamHTML = (teamKey) => {
        const team = appData.teams[teamKey];
        const cats = [
            { key: "senior", title: "Senior Category Members" },
            { key: "junior", title: "Junior Category Members" },
            { key: "subjunior", title: "Sub-Junior Category Members" }
        ];

        return cats.map(c => {
            const members = team[c.key] || [];
            const pills = members.map((m, idx) => {
                let displayName = m;
                let badge = "";
                if (m.includes("(C)")) {
                    displayName = m.replace("(C)", "").trim();
                    badge = `<span class="role-tag">CAPTAIN</span>`;
                } else if (m.includes("(Vc)")) {
                    displayName = m.replace("(Vc)", "").trim();
                    badge = `<span class="role-tag" style="background:#38bdf8;">V.CAPTAIN</span>`;
                }
                const delBtn = isAdmin ? `<span style="cursor:pointer; color:#ef4444; margin-left:4px;" onclick="deleteStudent('${teamKey}', '${c.key}', ${idx})" title="Remove">×</span>` : "";
                return `<li class="student-pill">${displayName} ${badge} ${delBtn}</li>`;
            }).join("");

            return `
                <div class="cat-roster-block">
                    <h4 class="cat-roster-title">${c.title} (${members.length})</h4>
                    <ul class="student-list">${pills || `<span style="color:var(--text-muted); font-size:0.82rem;">അംഗങ്ങളില്ല</span>`}</ul>
                </div>
            `;
        }).join("");
    };

    containerA.innerHTML = buildTeamHTML("teamA");
    containerB.innerHTML = buildTeamHTML("teamB");
}

function addNewStudent() {
    if (!isAdmin) return;
    const nameEl = document.getElementById("newStudentName");
    const teamEl = document.getElementById("newStudentTeam");
    const catEl = document.getElementById("newStudentCat");

    const name = nameEl ? nameEl.value.trim() : "";
    const teamKey = teamEl ? teamEl.value : "teamA";
    const catKey = catEl ? catEl.value : "senior";

    if (!name) {
        alert("വിദ്യാർത്ഥിയുടെ പേര് നൽകുക!");
        return;
    }

    appData.teams[teamKey][catKey].push(name);
    if (nameEl) nameEl.value = "";
    saveAppData();
}

function deleteStudent(teamKey, catKey, idx) {
    if (!isAdmin) return;
    const studentName = appData.teams[teamKey][catKey][idx];
    if (confirm(`"${studentName}" എന്ന അംഗത്തെ ടീം ലിസ്റ്റിൽ നിന്ന് നീക്കം ചെയ്യണോ?`)) {
        appData.teams[teamKey][catKey].splice(idx, 1);
        saveAppData();
    }
}

/* ==========================================================================
   7. RESULTS & REF-1 POSTER GENERATOR LOGIC (results.html)
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

    const catVal = catSelect.value || "senior";
    let cKey = "senior";
    if (catVal.toLowerCase().includes("sub")) cKey = "subjunior";
    else if (catVal.toLowerCase().includes("junior")) cKey = "junior";
    else if (catVal.toLowerCase().includes("general")) cKey = "general";

    const catPrograms = appData.programs[cKey] || { onStage: [], offStage: [], sports: [] };
    const allProgs = [
        ...(catPrograms.onStage || []),
        ...(catPrograms.offStage || []),
        ...(catPrograms.sports || [])
    ];

    progSelect.innerHTML = `<option value="">-- പ്രോഗ്രാം തിരഞ്ഞെടുക്കുക --</option>` +
        allProgs.map(p => `<option value="${p}">${p}</option>`).join("");

    // Populate quick student selector dropdowns for Winners 1, 2, 3
    const rosterKey = cKey === "general" ? "senior" : cKey;
    const listA = (appData.teams.teamA[rosterKey] || []).map(s => ({
        name: s.replace("(C)", "").replace("(Vc)", "").trim(),
        team: "teamA",
        label: `🔴 ${s} (ZELLIJ)`
    }));
    const listB = (appData.teams.teamB[rosterKey] || []).map(s => ({
        name: s.replace("(C)", "").replace("(Vc)", "").trim(),
        team: "teamB",
        label: `🔵 ${s} (IZNIK)`
    }));
    const combined = [...listA, ...listB];

    [1, 2, 3].forEach(rank => {
        const sel = document.getElementById(`selWinner${rank}`);
        if (sel) {
            sel.innerHTML = `<option value="">-- ലിസ്റ്റിൽ നിന്ന് വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക (ഓപ്ഷണൽ) --</option>` +
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
    if (!canvas) return;
    canvas.className = themeClass;
}

function formatTeamDisplayName(teamKeyOrStr) {
    const tKey = resolveTeamKey(teamKeyOrStr);
    if (tKey === "teamA") return "Team ZELLIJ";
    if (tKey === "teamB") return "Team IZNIK";
    return teamKeyOrStr || "";
}

function updatePosterPreview() {
    const canvas = document.getElementById("posterCanvas");
    if (!canvas) return;

    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    const cat = document.getElementById("resCatSelect")?.value || "SENIOR";
    const progDrop = document.getElementById("resProgSelect")?.value || "";
    const progCustom = (document.getElementById("resProgCustom")?.value || "").trim();
    const progName = progCustom || progDrop || "മത്സരത്തിന്റെ പേര്";

    const w1Name = (document.getElementById("win1Name")?.value || "First Winner").trim();
    const w1Team = formatTeamDisplayName(document.getElementById("win1Team")?.value || "teamA");

    const w2Name = (document.getElementById("win2Name")?.value || "Second Winner").trim();
    const w2Team = formatTeamDisplayName(document.getElementById("win2Team")?.value || "teamB");

    const w3Name = (document.getElementById("win3Name")?.value || "").trim();
    const w3Team = formatTeamDisplayName(document.getElementById("win3Team")?.value || "teamA");

    const setElText = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
    };

    setElText("previewResNo", `RESULT #${String(resNo).padStart(2, "0")}`);
    setElText("previewCat", cat.toUpperCase());
    setElText("previewProg", progName);
    setElText("previewWin1Name", w1Name);
    setElText("previewWin1Team", w1Team);
    setElText("previewWin2Name", w2Name);
    setElText("previewWin2Team", w2Team);

    const w3Card = document.getElementById("previewWin3Card");
    if (w3Name) {
        if (w3Card) w3Card.style.display = "flex";
        setElText("previewWin3Name", w3Name);
        setElText("previewWin3Team", w3Team);
    } else {
        if (w3Card) w3Card.style.display = "none";
    }
}

function downloadResultPoster() {
    const canvasEl = document.getElementById("posterCanvas");
    if (!canvasEl || typeof html2canvas === "undefined") {
        alert("പോസ്റ്റർ ഡൗൺലോഡ് ചെയ്യാൻ അല്പം കാത്തിരിക്കുക!");
        return;
    }

    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    html2canvas(canvasEl, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = `EID-E-IRSHAD-Result-${resNo}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    }).catch(err => {
        console.error("Poster download failed:", err);
        alert("പോസ്റ്റർ ഡൗൺലോഡ് ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു.");
    });
}

function publishResultToSite() {
    if (!isAdmin) {
        alert("അഡ്മിൻ ലോഗിൻ ചെയ്താൽ മാത്രമേ റിസൾട്ട് പ്രസിദ്ധീകരിക്കാൻ സാധിക്കൂ!");
        return;
    }

    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    const category = document.getElementById("resCatSelect")?.value || "Senior";
    const progDrop = document.getElementById("resProgSelect")?.value || "";
    const progCustom = (document.getElementById("resProgCustom")?.value || "").trim();
    const program = progCustom || progDrop;

    const isGroupCheckbox = document.getElementById("resIsGroupCheck");
    const isGroup = isGroupCheckbox ? isGroupCheckbox.checked : isGroupProgram(program);

    const win1Name = (document.getElementById("win1Name")?.value || "").trim();
    const win1Team = document.getElementById("win1Team")?.value || "teamA";
    const win2Name = (document.getElementById("win2Name")?.value || "").trim();
    const win2Team = document.getElementById("win2Team")?.value || "teamB";
    const win3Name = (document.getElementById("win3Name")?.value || "").trim();
    const win3Team = document.getElementById("win3Team")?.value || "teamA";

    if (!program || !win1Name) {
        alert("മത്സരത്തിന്റെ പേരും ഒന്നാം സ്ഥാനം നേടിയ വിജയിയുടെ പേരും നിർബന്ധമായും നൽകുക!");
        return;
    }

    const newResult = {
        id: `${category}_${program}`.toLowerCase(),
        resNo,
        category,
        program,
        isGroup,
        win1Name,
        win1Team,
        win2Name,
        win2Team,
        win3Name,
        win3Team,
        theme: currentPosterTheme,
        timestamp: Date.now()
    };

    // Check for duplicate result to prevent double counting points
    const existingIdx = (appData.results || []).findIndex(
        r => String(r.category).toLowerCase() === category.toLowerCase() &&
             String(r.program).toLowerCase() === program.toLowerCase()
    );

    if (existingIdx !== -1) {
        if (!confirm(`"${category} - ${program}" എന്ന മത്സരത്തിന്റെ ഫലം ഇതിനകം ചേർത്തിട്ടുണ്ട്. പഴയ ഫലം മാറ്റി പുതിയത് അപ്ഡേറ്റ് ചെയ്യണോ?`)) {
            return;
        }
        appData.results[existingIdx] = newResult;
    } else {
        appData.results.unshift(newResult);
    }

    // Auto-increment result number for next entry
    const nextNo = parseInt(resNo, 10);
    if (!isNaN(nextNo) && document.getElementById("resNoInput")) {
        document.getElementById("resNoInput").value = String(nextNo + 1).padStart(2, "0");
    }

    saveAppData();
    if (typeof confetti === "function") {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
    alert("മത്സരഫലം വിജയകരമായി പ്രസിദ്ധീകരിച്ചു! പോയിന്റ് നില ഓട്ടോമാറ്റിക്കായി അപ്ഡേറ്റ് ചെയ്തിട്ടുണ്ട്.");
}

function renderPublishedResults() {
    const container = document.getElementById("publishedResultsContainer");
    if (!container) return;

    const list = appData.results || [];
    if (list.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:35px; color:var(--text-muted); font-weight:700;">ഇതുവരെ മത്സര ഫലങ്ങളൊന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ല.</div>`;
        return;
    }

    container.innerHTML = list.map((res, idx) => {
        const t1Class = resolveTeamKey(res.win1Team) === "teamA" ? "team-badge-a" : "team-badge-b";
        const t2Class = resolveTeamKey(res.win2Team) === "teamA" ? "team-badge-a" : "team-badge-b";
        const t3Class = resolveTeamKey(res.win3Team) === "teamA" ? "team-badge-a" : "team-badge-b";

        const w2Row = res.win2Name ? `
            <div class="winner-row">
                <span>🥈 ${res.win2Name}</span>
                <span class="${t2Class}">${formatTeamDisplayName(res.win2Team)}</span>
            </div>
        ` : "";

        const w3Row = res.win3Name ? `
            <div class="winner-row">
                <span>🥉 ${res.win3Name}</span>
                <span class="${t3Class}">${formatTeamDisplayName(res.win3Team)}</span>
            </div>
        ` : "";

        const delBtn = isAdmin ? `<button class="btn-action-sm btn-del-sm" onclick="deletePublishedResult(${idx})">🗑️</button>` : "";

        return `
            <div class="result-card">
                <div class="result-card-head">
                    <div>
                        <span class="badge badge-offstage">#${res.resNo || (idx + 1)} • ${res.category}</span>
                        <h3 style="margin:6px 0 0; font-size:1.08rem; font-weight:800;">${res.program}</h3>
                    </div>
                    <div>${delBtn}</div>
                </div>
                <div class="winner-row">
                    <span>🥇 ${res.win1Name}</span>
                    <span class="${t1Class}">${formatTeamDisplayName(res.win1Team)}</span>
                </div>
                ${w2Row}
                ${w3Row}
            </div>
        `;
    }).join("");
}

function deletePublishedResult(idx) {
    if (!isAdmin) return;
    const item = appData.results[idx];
    if (confirm(`"${item.program}" എന്ന മത്സരഫലം ഡിലീറ്റ് ചെയ്യണോ? (പോയിന്റ് നിലയിൽ നിന്ന് ഇതിന്റെ പോയിന്റ് കുറയുന്നതാണ്)`)) {
        appData.results.splice(idx, 1);
        saveAppData();
    }
}

/* ==========================================================================
   8. DOM CONTENT LOADED BOOTSTRAP
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Check URL search parameters for programs.html
    const params = new URLSearchParams(window.location.search);
    if (params.get("cat")) {
        currentCategory = params.get("cat");
    }
    if (params.get("search")) {
        const sInput = document.getElementById("programSearchInput");
        if (sInput) sInput.value = params.get("search");
    }

    initFirebaseAndLoad();
});
