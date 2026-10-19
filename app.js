/* ==========================================================================
   EID-E IRSHAD — CAMPUS FEST 2K26 | FINAL SECURE PRODUCTION APP LOGIC (app.js)
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
let isAdmin = false;
let currentPosterTheme = "theme-green";
let currentPosterLayout = "layout-model-1";
let isPosterBuilderInitialized = false;

function initFirebaseAndLoad() {
    const cached = localStorage.getItem("eid_irshad_app_data_v2");
    if (cached) { try { mergeLoadedData(JSON.parse(cached)); } catch (e) {} }
    renderAll(false);

    if (typeof firebase !== "undefined") {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            if (firebase.auth) {
                auth = firebase.auth();
                
                auth.signInAnonymously().catch((err) => {
                    console.warn("Anonymous auth sign-in warning:", err.message);
                });

                auth.onAuthStateChanged((user) => {
                    if (user && user.email) {
                        const allowedAdmins = ["admin@irshad.com"];
                        if (allowedAdmins.includes(user.email.toLowerCase()) && user.emailVerified) {
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

            unsubscribeFirestore = db.collection("fiesta2k26").doc("mainData").onSnapshot((docSnap) => {
                if (docSnap.exists) {
                    mergeLoadedData(docSnap.data());
                    localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
                    renderAll(true);
                }
            }, (err) => {
                console.warn("Firestore sync warning:", err.message);
            });
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
                console.error("Firestore write failed:", err.message);
                alert("ഫയർബേസ് സേവ് പരാജയപ്പെട്ടു: " + err.message);
                if (typeof callback === "function") callback(false);
            });
    } else {
        if (!isPublicAction) {
            alert("ഫയർബേസ് കണക്ഷൻ ലഭ്യമല്ല. ക്ലൗഡിലേക്ക് സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല.");
            if (typeof callback === "function") callback(false);
        } else {
            localStorage.setItem("eid_irshad_app_data_v2", JSON.stringify(appData));
            renderAll(true);
            if (typeof callback === "function") callback(true);
        }
    }
}

function renderAll(isBackgroundSync = false) {
    updateAdminUI();
    updateLiveScoreboard();
    initPosterBuilder(isBackgroundSync);
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
                
                if (allowedAdmins.includes(userEmail) && user.emailVerified) {
                    isAdmin = true;
                    closeAdminModal();
                    renderAll(false);
                    alert("Admin Login വിജയകരമായി പൂർത്തിയായി!");
                } else {
                    auth.signOut();
                    if (errEl) errEl.textContent = "ഈ അക്കൗണ്ടിന് അഡ്മിൻ അനുമതിയില്ല അല്ലെങ്കിൽ ഇമെയിൽ വെരിഫൈ ചെയ്തിട്ടില്ല!";
                }
            })
            .catch((error) => {
                if (errEl) errEl.textContent = "ലോഗിൻ പരാജയപ്പെട്ടു: " + error.message;
            });
    } else {
        if (errEl) errEl.textContent = "Firebase Authentication ലഭ്യമായില്ല!";
    }
}

function logoutAdmin() {
    isAdmin = false;
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
    dlAnchor.setAttribute("download", `eid_e_irshad_backup_${new Date().toISOString().slice(0,10)}.json`);
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

    if (document.getElementById("ptsA")) document.getElementById("ptsA").textContent = totals.teamA;
    if (document.getElementById("ptsB")) document.getElementById("ptsB").textContent = totals.teamB;
    const grand = totals.teamA + totals.teamB;
    if (document.getElementById("barA")) document.getElementById("barA").style.width = (grand > 0 ? (totals.teamA / grand) * 100 : 50) + "%";
    if (document.getElementById("barB")) document.getElementById("barB").style.width = (grand > 0 ? (totals.teamB / grand) * 100 : 50) + "%";
}

function votePoll(team) {
    if (team !== "zellij" && team !== "iznik") {
        alert("തെറ്റായ ടീം തിരഞ്ഞെടുപ്പ്!");
        return;
    }

    if (localStorage.getItem("eid_has_voted")) {
        if (document.getElementById("pollMsg")) document.getElementById("pollMsg").textContent = "നിങ്ങൾ ഇതിനകം വോട്ട് രേഖപ്പെടുത്തിയിട്ടുണ്ട്!";
        return;
    }

    if (!auth || !auth.currentUser) {
        alert("സെഷൻ തയ്യാറായിട്ടില്ല. ദയവായി പേജ് റിഫ്രഷ് ചെയ്യുക.");
        return;
    }

    if (!db) {
        alert("ഡാറ്റാബേസ് കണക്ഷൻ ലഭ്യമല്ല!");
        return;
    }

    const userId = auth.currentUser.uid;
    const voteRef = db.collection("fiesta2k26").doc("mainData").collection("votes").doc(userId);

    voteRef.get().then((doc) => {
        if (doc.exists) {
            localStorage.setItem("eid_has_voted", "true");
            if (document.getElementById("pollMsg")) document.getElementById("pollMsg").textContent = "നിങ്ങൾ ഇതിനകം വോട്ട് രേഖപ്പെടുത്തിയിട്ടുണ്ട്!";
            return;
        }

        voteRef.set({ team: team, timestamp: Date.now() }).then(() => {
            localStorage.setItem("eid_has_voted", "true");
            if (document.getElementById("pollMsg")) {
                document.getElementById("pollMsg").textContent = "നന്ദി! വോട്ട് വിജയകരമായി രേഖപ്പെടുത്തി.";
                if (typeof confetti === "function") confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            }
        }).catch(err => {
            alert("വോട്ട് സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു: " + err.message);
        });
    }).catch(err => {
        alert("റീഡ് പിശക്: " + err.message);
    });
}

function initPosterBuilder(isBackgroundSync = false) {
    const catSelect = document.getElementById("resCatSelect");
    const progSelect = document.getElementById("resProgSelect");
    if (!catSelect || !progSelect) return;

    if (isBackgroundSync && isPosterBuilderInitialized) {
        return;
    }

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
    
    progSelect.innerHTML = "";
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "-- പ്രോഗ്രാം തിരഞ്ഞെടുക്കുക --";
    progSelect.appendChild(defaultOpt);

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
            sel.innerHTML = "";
            const defWinOpt = document.createElement("option");
            defWinOpt.value = "";
            defWinOpt.textContent = "-- വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക --";
            sel.appendChild(defWinOpt);

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
    
    for (let i = 1; i <= 3; i++) {
        if (i !== rank) {
            const otherNameInput = document.getElementById(`win${i}Name`);
            if (otherNameInput && otherNameInput.value.trim().toLowerCase() === name.toLowerCase()) {
                alert("ഈ വിദ്യാർത്ഥിയെ ഇതിനകം മറ്റൊരു സ്ഥാനത്തേക്ക് തിരഞ്ഞെടുത്തു!");
                sel.value = "";
                return;
            }
        }
    }

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
        canvas.className = `${currentPosterLayout} ${cur
