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
let isAdmin = false;
let currentPosterTheme = "theme-green";
let currentPosterLayout = "layout-model-1";
let isPosterBuilderInitialized = false;
let currentProgramCat = "senior";

function initFirebaseAndLoad() {
    const cached = localStorage.getItem("eid_irshad_app_data_v2");
    if (cached) {
        try { mergeLoadedData(JSON.parse(cached)); } catch (e) {}
    }
    renderAll(false);

    if (typeof firebase !== "undefined") {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            if (firebase.firestore) {
                db = firebase.firestore();
            }
            if (firebase.auth) {
                auth = firebase.auth();
                auth.onAuthStateChanged((user) => {
                    if (user && user.email) {
                        const allowedAdmins = ["admin@irshad.com"];
                        if (allowedAdmins.includes(user.email.toLowerCase())) {
                            isAdmin = true;
                        } else {
                            isAdmin = false;
                        }
                    } else {
                        isAdmin = false;
                    }
                    updateAdminUI();
                    renderAll(false);
                });
            }

            if (db) {
                unsubscribeFirestore = db.collection("fiesta2k26").doc("mainData").onSnapshot((docSnap) => {
                    if (docSnap.exists) {
                        mergeLoadedData(docSnap.data());
                        localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                        renderAll(true);
                    }
                }, (err) => {
                    console.warn("Firestore sync warning:", err.message);
                });
            }
        } catch (err) {
            console.warn("Firebase initialization error:", err);
        }
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

function saveAppData(isPublicAction = false, updatedPayload = null, callback = null) {
    const dataToSave = updatedPayload ? updatedPayload : appData;

    if (!isPublicAction && !isAdmin) {
        alert("അഡ്മിൻ അനുമതി ഇല്ലാത്തതിനാൽ ഈ പ്രവർത്തനം സാധ്യമല്ല!");
        if (typeof callback === "function") callback(false);
        return;
    }

    if (db) {
        db.collection("fiesta2k26").doc("mainData").set(dataToSave, { merge: true })
            .then(() => {
                appData = JSON.parse(JSON.stringify(dataToSave));
                localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                renderAll(true);
                if (!isPublicAction) alert("ഡാറ്റ ഫയർബേസിലേക്ക് വിജയകരമായി സേവ് ചെയ്തു!");
                if (typeof callback === "function") callback(true);
            })
            .catch((err) => {
                appData = JSON.parse(JSON.stringify(dataToSave));
                localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                renderAll(true);
                alert("ലോക്കലായി സേവ് ചെയ്തു (ഫയർബേസ് മുന്നറിയിപ്പ്: " + err.message + ")");
                if (typeof callback === "function") callback(true);
            });
    } else {
        appData = JSON.parse(JSON.stringify(dataToSave));
        localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
        renderAll(true);
        if (!isPublicAction) alert("ഡാറ്റ സേവ് ചെയ്തു!");
        if (typeof callback === "function") callback(true);
    }
}

function renderAll(isBackgroundSync = false) {
    updateAdminUI();
    updateLiveScoreboard();
    updatePollUI();
    initPosterBuilder(isBackgroundSync);
    renderPublishedResults();
    renderTeamsRoster();
    if (document.getElementById("listOnStage")) {
        switchProgramTab(currentProgramCat);
    }
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

function updateCountdown() {
    const eventDate = new Date("2026-11-27T09:00:00+05:30").getTime();
    const now = new Date().getTime();
    const diff = eventDate - now;

    const daysEl = document.getElementById("cdDays");
    const hoursEl = document.getElementById("cdHours");
    const minsEl = document.getElementById("cdMins");
    const secsEl = document.getElementById("cdSecs");

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minsEl) minsEl.textContent = String(mins).padStart(2, "0");
        if (secsEl) secsEl.textContent = String(secs).padStart(2, "0");
    } else {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minsEl) minsEl.textContent = "00";
        if (secsEl) secsEl.textContent = "00";
    }
}

function updateAdminUI() {
    if (localStorage.getItem("eid_admin_logged_in") === "true") {
        isAdmin = true;
    }
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
    if (err) err.textContent = "";
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
        if (errEl) errEl.textContent = "ഇമെയിലും പാസ്‌വേഡും നൽകുക!";
        return;
    }

    if (auth) {
        auth.signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
                const user = userCredential.user;
                const userEmail = user.email.toLowerCase();
                const allowedAdmins = ["admin@irshad.com"];

                if (allowedAdmins.includes(userEmail)) {
                    isAdmin = true;
                    localStorage.setItem("eid_admin_logged_in", "true");
                    closeAdminModal();
                    renderAll(false);
                    alert("Admin Login വിജയകരമായി പൂർത്തിയായി!");
                } else {
                    auth.signOut();
                    if (errEl) errEl.textContent = "ഈ അക്കൗണ്ടിന് അഡ്മിൻ അനുമതിയില്ല!";
                }
            })
            .catch((error) => {
                if (errEl) errEl.textContent = "ലോഗിൻ പരാജയപ്പെട്ടു: " + error.message;
            });
    } else {
        if (errEl) errEl.textContent = "Firebase സ്ക്രിപ്റ്റുകൾ ലോഡ് ആയിട്ടില്ല. പേജ് റീഫ്രഷ് ചെയ്യുക!";
    }
}

function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem("eid_admin_logged_in");
    if (auth && auth.currentUser) {
        auth.signOut().catch(() => {});
    }
    renderAll(false);
    alert("Admin ലോഗൗട്ട് ചെയ്തു.");
}

function exportBackupJSON() {
    if (!isAdmin) {
        alert("അഡ്മിൻ അനുമതി ആവശ്യമാണ്!");
        return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "eid_e_irshad_backup.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
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
        const groupMode = res.isGroup === true || GROUP_EVENTS_LIST.includes(res.program);
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

    if (document.getElementById("ptsA")) document.getElementById("ptsA").textContent = totals.teamA;
    if (document.getElementById("ptsB")) document.getElementById("ptsB").textContent = totals.teamB;
    const grand = totals.teamA + totals.teamB;
    if (document.getElementById("barA")) document.getElementById("barA").style.width = (grand > 0 ? (totals.teamA / grand) * 100 : 50) + "%";
    if (document.getElementById("barB")) document.getElementById("barB").style.width = (grand > 0 ? (totals.teamB / grand) * 100 : 50) + "%";
}

function updatePollUI() {
    const zEl = document.getElementById("voteZellijCount");
    const iEl = document.getElementById("voteIznikCount");
    if (zEl) zEl.textContent = ((appData.poll && appData.poll.zellij) || 0) + " votes";
    if (iEl) iEl.textContent = ((appData.poll && appData.poll.iznik) || 0) + " votes";
}

function votePoll(team) {
    if (localStorage.getItem("eid_has_voted")) {
        if (document.getElementById("pollMsg")) document.getElementById("pollMsg").textContent = "നിങ്ങൾ ഇതിനകം വോട്ട് രേഖപ്പെടുത്തിയിട്ടുണ്ട്!";
        return;
    }
    if (!appData.poll) appData.poll = { zellij: 12, iznik: 15 };
    if (team === "zellij") appData.poll.zellij = (appData.poll.zellij || 0) + 1;
    if (team === "iznik") appData.poll.iznik = (appData.poll.iznik || 0) + 1;

    localStorage.setItem("eid_has_voted", "true");
    localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
    updatePollUI();
    if (document.getElementById("pollMsg")) {
        document.getElementById("pollMsg").textContent = "നന്ദി! വോട്ട് വിജയകരമായി രേഖപ്പെടുത്തി.";
        if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
}

function handleGlobalSearch(event, query) {
    const dropdown = document.getElementById("searchResultsDropdown");
    if (!dropdown) return;
    const q = (query || "").trim().toLowerCase();
    if (!q) {
        dropdown.style.display = "none";
        return;
    }

    let matches = [];
    Object.keys(appData.programs || {}).forEach(cat => {
        const cData = appData.programs[cat];
        [...(cData.onStage || []), ...(cData.offStage || []), ...(cData.sports || [])].forEach(p => {
            if (p.toLowerCase().includes(q)) {
                matches.push({ text: `📋 ${p} (${cat.toUpperCase()})`, link: "programs.html" });
            }
        });
    });

    ["teamA", "teamB"].forEach(tKey => {
        const t = appData.teams[tKey];
        if (!t) return;
        ["senior", "junior", "subjunior"].forEach(sec => {
            (t[sec] || []).forEach(member => {
                if (member.toLowerCase().includes(q)) {
                    matches.push({ text: `👤 ${member} — ${t.name}`, link: "teams.html" });
                }
            });
        });
    });

    dropdown.innerHTML = "";
    if (matches.length === 0) {
        dropdown.innerHTML = "<div class='search-result-item'>ഫലങ്ങളൊന്നും കണ്ടെത്തിയില്ല</div>";
    } else {
        matches.slice(0, 8).forEach(m => {
            const div = document.createElement("div");
            div.className = "search-result-item";
            div.textContent = m.text;
            div.onclick = () => { location.href = m.link; };
            dropdown.appendChild(div);
        });
    }
    dropdown.style.display = "block";
}

function switchProgramTab(catKey) {
    currentProgramCat = catKey;
    const catData = (appData.programs && appData.programs[catKey]) || { onStage: [], offStage: [], sports: [] };
    const fillList = (elementId, items) => {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.innerHTML = "";
        if (!items || items.length === 0) {
            el.innerHTML = "<li style='color:var(--text-muted); font-weight:normal;'>മത്സരങ്ങൾ ലഭ്യമല്ല</li>";
            return;
        }
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            el.appendChild(li);
        });
    };
    fillList("listOnStage", catData.onStage);
    fillList("listOffStage", catData.offStage);
    fillList("listSports", catData.sports);
}

function renderTeamsRoster() {
    if (!appData || !appData.teams) return;
    const renderTeamBox = (teamKey, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const team = appData.teams[teamKey];
        if (!team) return;

        let html = `<p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">Short Name: <strong>${team.shortName}</strong></p>`;
        const sections = [
            { key: "senior", label: "Senior Roster" },
            { key: "junior", label: "Junior Roster" },
            { key: "subjunior", label: "Sub Junior Roster" }
        ];
        sections.forEach(sec => {
            const members = team[sec.key] || [];
            if (members.length > 0) {
                html += `<div style="margin-bottom:12px;">
                    <h4 style="margin:0 0 5px; font-size:0.9rem; color:var(--accent-gold);">${sec.label}</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">`;
                members.forEach(m => {
                    html += `<span style="background:var(--bg-color); border:1px solid var(--border-color); padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:700;">${m}</span>`;
                });
                html += `</div></div>`;
            }
        });
        container.innerHTML = html;
    };
    renderTeamBox("teamA", "zellijRosterContent");
    renderTeamBox("teamB", "iznikRosterContent");
}

function initPosterBuilder(isBackgroundSync = false) {
    const catSelect = document.getElementById("resCatSelect");
    const progSelect = document.getElementById("resProgSelect");
    if (!catSelect || !progSelect) return;
    if (isBackgroundSync && isPosterBuilderInitialized) return;
    onResultCategoryChange();
    isPosterBuilderInitialized = true;
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

    progSelect.innerHTML = "<option value=''>-- പ്രോഗ്രാം തിരഞ്ഞെടുക്കുക --</option>";
    allProgs.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        progSelect.appendChild(opt);
    });

    const rosterKey = cKey === "general" ? "senior" : cKey;
    const combined = [
        ...(appData.teams.teamA[rosterKey] || []).map(s => ({ name: s.replace(/(\(C\)|\(Vc\))/g, "").trim(), team: "teamA", label: `🔴 ${s} (ZELLIJ)` })),
        ...(appData.teams.teamB[rosterKey] || []).map(s => ({ name: s.replace(/(\(C\)|\(Vc\))/g, "").trim(), team: "teamB", label: `🔵 ${s} (IZNIK)` }))
    ];

    [1, 2, 3].forEach(rank => {
        const sel = document.getElementById(`selWinner${rank}`);
        if (sel) {
            sel.innerHTML = "<option value=''>-- വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക --</option>";
            combined.forEach(st => {
                const winOpt = document.createElement("option");
                winOpt.value = `${st.name}|${st.team}`;
                winOpt.textContent = st.label;
                sel.appendChild(winOpt);
            });
        }
    });
    updatePosterPreview();
}

function onWinnerStudentSelect(rank) {
    const sel = document.getElementById(`selWinner${rank}`);
    if (!sel || !sel.value) return;
    const [name, teamKey] = sel.value.split("|");
    if (document.getElementById(`win${rank}Name`)) document.getElementById(`win${rank}Name`).value = name;
    if (document.getElementById(`win${rank}Team`)) document.getElementById(`win${rank}Team`).value = teamKey;
    updatePosterPreview();
}

function setPosterTheme(themeClass) {
    currentPosterTheme = themeClass;
    const canvas = document.getElementById("posterCanvas");
    if (canvas) canvas.className = `${currentPosterLayout} ${currentPosterTheme}`;
}

function setPosterLayout(layoutClass) {
    currentPosterLayout = layoutClass;
    const canvas = document.getElementById("posterCanvas");
    if (canvas) {
        canvas.className = `${currentPosterLayout} ${currentPosterTheme}`;
        if (document.getElementById("layoutModel1Container")) document.getElementById("layoutModel1Container").style.display = (layoutClass === "layout-model-1") ? "block" : "none";
        if (document.getElementById("layoutModel2Container")) document.getElementById("layoutModel2Container").style.display = (layoutClass === "layout-model-2") ? "block" : "none";
        if (document.getElementById("layoutModel3Container")) document.getElementById("layoutModel3Container").style.display = (layoutClass === "layout-model-3") ? "block" : "none";
    }
    updatePosterPreview();
}

function updatePosterPreview() {
    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    const cat = document.getElementById("resCatSelect")?.value || "SENIOR";
    const progDrop = document.getElementById("resProgSelect")?.value || "";
    const progCustom = (document.getElementById("resProgCustom")?.value || "").trim();
    const progName = progCustom || progDrop || "മത്സരത്തിന്റെ പേര്";

    const w1Name = (document.getElementById("win1Name")?.value || "Winner 1").trim();
    const w1Team = formatTeamDisplayName(document.getElementById("win1Team")?.value || "teamA");
    const w2Name = (document.getElementById("win2Name")?.value || "Winner 2").trim();
    const w2Team = formatTeamDisplayName(document.getElementById("win2Team")?.value || "teamB");
    const w3Name = (document.getElementById("win3Name")?.value || "").trim();
    const w3Team = formatTeamDisplayName(document.getElementById("win3Team")?.value || "teamA");

    ["previewResNo", "previewResNo2", "previewResNo3"].forEach(id => { if (document.getElementById(id)) document.getElementById(id).textContent = String(resNo).padStart(2, "0"); });
    ["previewCat", "previewCat2", "previewCat3"].forEach(id => { if (document.getElementById(id)) document.getElementById(id).textContent = cat.toUpperCase(); });
    ["previewProg", "previewProg2", "previewProg3"].forEach(id => { if (document.getElementById(id)) document.getElementById(id).textContent = progName.toUpperCase(); });

    if (document.getElementById("previewWin1Name")) document.getElementById("previewWin1Name").textContent = w1Name;
    if (document.getElementById("previewWin1Team")) document.getElementById("previewWin1Team").textContent = w1Team;
    if (document.getElementById("previewWin2Name")) document.getElementById("previewWin2Name").textContent = w2Name;
    if (document.getElementById("previewWin2Team")) document.getElementById("previewWin2Team").textContent = w2Team;
    if (document.getElementById("previewWin3Name")) document.getElementById("previewWin3Name").textContent = w3Name;
    if (document.getElementById("previewWin3Team")) document.getElementById("previewWin3Team").textContent = w3Team;
    if (document.getElementById("previewWin3Card")) document.getElementById("previewWin3Card").style.display = w3Name ? "flex" : "none";
}

function downloadResultPoster() {
    const canvasEl = document.getElementById("posterCanvas");
    if (!canvasEl || typeof html2canvas === "undefined") {
        alert("ഡൗൺലോഡ് ടൂൾ ലഭ്യമായില്ല!");
        return;
    }
    const resNo = (document.getElementById("resNoInput")?.value || "01").trim();
    html2canvas(canvasEl, { scale: 3, useCORS: true, backgroundColor: null })
        .then(canvas => {
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
    const w1Name = (document.getElementById("win1Name")?.value || "").trim();
    const w2Name = (document.getElementById("win2Name")?.value || "").trim();
    const w3Name = (document.getElementById("win3Name")?.value || "").trim();

    if (!prog || !w1Name) {
        alert("പ്രോഗ്രാമിന്റെ പേരും ഒന്നാം സ്ഥാനക്കാരന്റെ പേരും നൽകണം!");
        return;
    }

    const newResult = {
        id: "res_" + Date.now(),
        resNo, category, program: prog,
        win1Name: w1Name, win1Team: document.getElementById("win1Team")?.value || "teamA",
        win2Name: w2Name, win2Team: document.getElementById("win2Team")?.value || "teamB",
        win3Name: w3Name, win3Team: document.getElementById("win3Team")?.value || "teamA",
        timestamp: Date.now()
    };

    let clonedData = JSON.parse(JSON.stringify(appData));
    clonedData.results.unshift(newResult);
    saveAppData(false, clonedData, (success) => {
        if (success && typeof confetti === "function") {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
    });
}

function deleteResult(resultId) {
    if (!isAdmin) return;
    if (confirm("ഈ ഫലം നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?")) {
        let clonedData = JSON.parse(JSON.stringify(appData));
        clonedData.results = clonedData.results.filter(r => r.id !== resultId);
        saveAppData(false, clonedData);
    }
}

function renderPublishedResults() {
    const container = document.getElementById("publishedResultsContainer");
    if (!container) return;
    const list = appData.results || [];
    if (list.length === 0) {
        container.innerHTML = "<div style='grid-column: 1/-1; text-align:center; padding:30px; color:var(--text-muted);'>ഇതുവരെ ഫലങ്ങളൊന്നും പ്രസിദ്ധീകരിച്ചിട്ടില്ല.</div>";
        return;
    }
    container.innerHTML = "";
    list.forEach((res, idx) => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <div class="result-card-head">
                <div>
                    <span style="font-size:0.75rem; background:#fbbf24; color:#0f172a; padding:2px 8px; border-radius:4px; font-weight:800;">RESULT #${res.resNo || (idx + 1)}</span>
                    <h3 style="margin:6px 0 0; font-size:1.05rem;">${res.program}</h3>
                </div>
                ${isAdmin ? `<button class="btn-action-sm" onclick="deleteResult('${res.id}')">🗑️</button>` : ""}
            </div>
            ${res.win1Name ? `<div class="winner-row"><span>🥇 ${res.win1Name}</span><span class="${resolveTeamKey(res.win1Team) === 'teamA' ? 'team-badge-a' : 'team-badge-b'}">${formatTeamDisplayName(res.win1Team)}</span></div>` : ""}
            ${res.win2Name ? `<div class="winner-row"><span>🥈 ${res.win2Name}</span><span class="${resolveTeamKey(res.win2Team) === 'teamA' ? 'team-badge-a' : 'team-badge-b'}">${formatTeamDisplayName(res.win2Team)}</span></div>` : ""}
            ${res.win3Name ? `<div class="winner-row"><span>🥉 ${res.win3Name}</span><span class="${resolveTeamKey(res.win3Team) === 'teamA' ? 'team-badge-a' : 'team-badge-b'}">${formatTeamDisplayName(res.win3Team)}</span></div>` : ""}
        `;
        container.appendChild(card);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    initFirebaseAndLoad();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
