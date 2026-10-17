// ============================================================================
// 1. FIREBASE CONFIGURATION
// ============================================================================
const firebaseConfig = {
    apiKey: "AIzaSyAJ7gwJjRcvYIft6vA-4nxhE1AVPrpTDmv",
    authDomain: "eid-e-irshad-2k26.firebaseapp.com",
    projectId: "eid-e-irshad-2k26",
    storageBucket: "eid-e-irshad-2k26.appspot.com",
    messagingSenderId: "926291213815",
    appId: "1:926291213815:web:50729ca345f6d6b0d002f2"
};

let auth = null;
let db = null;
let isFirebaseConfigured = false;

if (typeof firebase !== "undefined") {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = firebase.auth();
        db = firebase.firestore();
        isFirebaseConfigured = true;
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
}

// ============================================================================
// 2. DEFAULT SOURCE DATA
// ============================================================================
const defaultData = {
    programs: {
        senior: {
            onstage: [
                { no: "01", name: "ഖിറാഅത്ത്", teamA: "", teamB: "" },
                { no: "02", name: "മലയാള പ്രസംഗം", teamA: "", teamB: "" },
                { no: "03", name: "അറബിക് പ്രസംഗം", teamA: "", teamB: "" },
                { no: "04", name: "മധുരമലയാളം", teamA: "", teamB: "" },
                { no: "05", name: "ഖുർആൻ പ്രഭാഷണം", teamA: "", teamB: "" },
                { no: "06", name: "അനൗൺസ്മെന്റ്", teamA: "", teamB: "" },
                { no: "07", name: "മലയാള ഗാനം", teamA: "", teamB: "" },
                { no: "08", name: "അറബി ഗാനം", teamA: "", teamB: "" },
                { no: "09", name: "നിമിഷ പ്രസംഗം", teamA: "", teamB: "" },
                { no: "10", name: "സംഘഗാനം", teamA: "", teamB: "" }
            ],
            offstage: [
                { no: "01", name: "മലയാള പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "02", name: "ഇംഗ്ലീഷ് പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "03", name: "അറബിക് പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "04", name: "മലയാളം കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "05", name: "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "06", name: "അറബിക് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "07", name: "ചിത്ര രചന", teamA: "", teamB: "" },
                { no: "08", name: "പോസ്റ്റർ ഡിസൈൻ", teamA: "", teamB: "" },
                { no: "09", name: "അറബി വായന", teamA: "", teamB: "" },
                { no: "10", name: "കഥാരചന", teamA: "", teamB: "" },
                { no: "11", name: "അടിക്കുറിപ്പ് രചന", teamA: "", teamB: "" },
                { no: "12", name: "Al Poster Design", teamA: "", teamB: "" },
                { no: "13", name: "സുഡോക്കോ", teamA: "", teamB: "" },
                { no: "14", name: "ഹിഫ്ള്", teamA: "", teamB: "" },
                { no: "15", name: "കാലിഗ്രഫി", teamA: "", teamB: "" },
                { no: "16", name: "കമ്പ്യൂട്ടർ ടൈപ്പിംഗ്", teamA: "", teamB: "" },
                { no: "17", name: "ട്രാൻസിലേഷൻ M to A", teamA: "", teamB: "" },
                { no: "18", name: "ട്രാൻസിലേഷൻ M to E", teamA: "", teamB: "" },
                { no: "19", name: "അറബിക് പദപ്പയറ്റ്", teamA: "", teamB: "" },
                { no: "20", name: "ക്വിസ്", teamA: "", teamB: "" },
                { no: "21", name: "Writing", teamA: "", teamB: "" },
                { no: "22", name: "മദ്ഹ്ഗാന രചന", teamA: "", teamB: "" }
            ],
            sports: [
                { no: "01", name: "100m Race", teamA: "", teamB: "" },
                { no: "02", name: "Long Jump", teamA: "", teamB: "" },
                { no: "03", name: "Shot Put", teamA: "", teamB: "" },
                { no: "04", name: "Cut Post Shoot", teamA: "", teamB: "" },
                { no: "05", name: "Discus Throw", teamA: "", teamB: "" }
            ]
        },
        junior: {
            onstage: [
                { no: "01", name: "ഖിറാഅത്ത്", teamA: "", teamB: "" },
                { no: "02", name: "മലയാള പ്രസംഗം", teamA: "", teamB: "" },
                { no: "03", name: "ഇംഗ്ലീഷ് പ്രസംഗം", teamA: "", teamB: "" },
                { no: "04", name: "മധുരമലയാളം", teamA: "", teamB: "" },
                { no: "05", name: "അനൗൺസ്മെന്റ്", teamA: "", teamB: "" },
                { no: "06", name: "മലയാള ഗാനം", teamA: "", teamB: "" },
                { no: "07", name: "അറബി ഗാനം", teamA: "", teamB: "" },
                { no: "08", name: "കവിത പാരായണം", teamA: "", teamB: "" },
                { no: "09", name: "സംഘഗാനം", teamA: "", teamB: "" }
            ],
            offstage: [
                { no: "01", name: "മലയാള പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "02", name: "ഇംഗ്ലീഷ് പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "03", name: "അറബിക് പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "04", name: "മലയാളം കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "05", name: "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "06", name: "അറബിക് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "07", name: "ചിത്ര രചന", teamA: "", teamB: "" },
                { no: "08", name: "പോസ്റ്റർ ഡിസൈൻ", teamA: "", teamB: "" },
                { no: "09", name: "അറബി വായന", teamA: "", teamB: "" },
                { no: "10", name: "കഥാരചന", teamA: "", teamB: "" },
                { no: "11", name: "അടിക്കുറിപ്പ് രചന", teamA: "", teamB: "" },
                { no: "12", name: "ഇംഗ്ലീഷ് വായന", teamA: "", teamB: "" },
                { no: "13", name: "IQ Test", teamA: "", teamB: "" },
                { no: "14", name: "അറബിക് പദപ്പയറ്റ്", teamA: "", teamB: "" },
                { no: "15", name: "ഹിഫ്ള്", teamA: "", teamB: "" },
                { no: "16", name: "കാലിഗ്രഫി", teamA: "", teamB: "" },
                { no: "17", name: "ക്വിസ്", teamA: "", teamB: "" }
            ],
            sports: [
                { no: "01", name: "100m Race", teamA: "", teamB: "" },
                { no: "02", name: "Long Jump", teamA: "", teamB: "" },
                { no: "03", name: "Shot Put", teamA: "", teamB: "" },
                { no: "04", name: "Cut Post Shoot", teamA: "", teamB: "" },
                { no: "05", name: "Lemon & Spoon Race", teamA: "", teamB: "" }
            ]
        },
        subjunior: {
            onstage: [
                { no: "01", name: "ഖിറാഅത്ത്", teamA: "", teamB: "" },
                { no: "02", name: "മലയാള പ്രസംഗം", teamA: "", teamB: "" },
                { no: "03", name: "കഥ പറയൽ", teamA: "", teamB: "" },
                { no: "04", name: "ബാങ്ക് വിളി", teamA: "", teamB: "" },
                { no: "05", name: "മലയാള ഗാനം", teamA: "", teamB: "" },
                { no: "06", name: "അറബി ഗാനം", teamA: "", teamB: "" },
                { no: "07", name: "സംഘഗാനം", teamA: "", teamB: "" }
            ],
            offstage: [
                { no: "01", name: "മലയാള പ്രബന്ധം", teamA: "", teamB: "" },
                { no: "02", name: "പെൻസിൽ ഡ്രോയിംഗ്", teamA: "", teamB: "" },
                { no: "03", name: "ഇംഗ്ലീഷ് വായന", teamA: "", teamB: "" },
                { no: "04", name: "മലയാളം കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "05", name: "ഇംഗ്ലീഷ് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "06", name: "അറബിക് കയ്യെഴുത്ത്", teamA: "", teamB: "" },
                { no: "07", name: "ചിത്ര രചന", teamA: "", teamB: "" },
                { no: "08", name: "മലയാളം വായന", teamA: "", teamB: "" },
                { no: "09", name: "കാലിഗ്രഫി", teamA: "", teamB: "" },
                { no: "10", name: "ഖുർആൻ മെമ്മറി", teamA: "", teamB: "" },
                { no: "11", name: "കഥാരചന", teamA: "", teamB: "" },
                { no: "12", name: "ക്വിസ്", teamA: "", teamB: "" },
                { no: "13", name: "മെമ്മറി ടെസ്റ്റ്", teamA: "", teamB: "" }
            ],
            sports: [
                { no: "01", name: "50m Race", teamA: "", teamB: "" },
                { no: "02", name: "Long Jump", teamA: "", teamB: "" },
                { no: "03", name: "Biscuit Eating", teamA: "", teamB: "" },
                { no: "04", name: "Cut Post Shoot", teamA: "", teamB: "" },
                { no: "05", name: "Filling a Bottle", teamA: "", teamB: "" }
            ]
        },
        general: {
            onstage: [
                { no: "01", name: "മോട്ടിവേഷൻ സ്പീച്ച്", teamA: "", teamB: "" },
                { no: "02", name: "കഥാപ്രസംഗം", teamA: "", teamB: "" },
                { no: "03", name: "ബുർദ", teamA: "", teamB: "" },
                { no: "04", name: "റീൽ മേക്കിങ്", teamA: "", teamB: "" },
                { no: "05", name: "ക്യാമ്പസ് സോങ്", teamA: "", teamB: "" },
                { no: "06", name: "തദ്‌രീസ്", teamA: "", teamB: "" },
                { no: "07", name: "ഖുതുബ & മആശറ", teamA: "", teamB: "" },
                { no: "08", name: "സയൻസ് പ്രൊജക്ട്", teamA: "", teamB: "" },
                { no: "09", name: "Table Talk", teamA: "", teamB: "" },
                { no: "10", name: "ഖവാലി", teamA: "", teamB: "" },
                { no: "11", name: "സ്പോട്ട് മാഗസിൻ", teamA: "", teamB: "" }
            ],
            offstage: [],
            sports: [
                { no: "01", name: "Penalty Shootout", teamA: "", teamB: "" },
                { no: "02", name: "Tug of War", teamA: "", teamB: "" },
                { no: "03", name: "Relay Race", teamA: "", teamB: "" }
            ]
        }
    },
    teams: {
        teamA: {
            senior: [
                "300. Safwan (C)",
                "301. Ramees (Vc)",
                "302. fayiz (Vc)",
                "303. Thangal",
                "304. Asaf",
                "305. Thasnif",
                "306. Thwahir",
                "307. Irfan"
            ],
            junior: [
                "308. Qasim",
                "309. Sinan MT",
                "310. Ashiq",
                "311. Saeed"
            ],
            subjunior: [
                "312. Shahin",
                "313. Muhsin",
                "314. Razi",
                "315. Anshid"
            ]
        },
        teamB: {
            senior: [
                "100. Shibili (C)",
                "101. Ismail (Vc)",
                "102. Abdul vahab (Vc)",
                "103. Sinan P.k",
                "104. Adhil",
                "105. Rahees",
                "106. Amir",
                "107. Afsal"
            ],
            junior: [
                "108. Sinan edayoor",
                "109. Sinan cherushola",
                "110. Aslam",
                "111. Hijaz",
                "112. Jazeel"
            ],
            subjunior: [
                "113. Nijad",
                "114. Farhan",
                "115. Nusaif"
            ]
        }
    },
    results: []
};

// ============================================================================
// 3. STATE MANAGEMENT & DATA LOADING
// ============================================================================
let appData = JSON.parse(JSON.stringify(defaultData));
let currentCategory = "senior";
let currentType = "onstage";
let isAdmin = localStorage.getItem("eid_irshad_admin_logged") === "true";
let editingIndex = null;

async function loadAppData() {
    if (isFirebaseConfigured && db) {
        try {
            const docRef = db.collection("fiesta2k26").doc("mainData");
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                appData = docSnap.data();
                if (!appData.results) appData.results = [];
            } else {
                await docRef.set(defaultData);
            }
        } catch (err) {
            console.warn("Firestore Load Error:", err);
            const saved = localStorage.getItem("eid_irshad_2k26_data");
            if (saved) {
                appData = JSON.parse(saved);
                if (!appData.results) appData.results = [];
            }
        }
    } else {
        const saved = localStorage.getItem("eid_irshad_2k26_data");
        if (saved) {
            appData = JSON.parse(saved);
            if (!appData.results) appData.results = [];
        }
    }
    renderAll();
    if (document.getElementById("resCatSelect")) {
        initPosterBuilder();
    }
}

async function saveAppData() {
    localStorage.setItem("eid_irshad_2k26_data", JSON.stringify(appData));
    if (isFirebaseConfigured && db && isAdmin) {
        try {
            await db.collection("fiesta2k26").doc("mainData").set(appData);
        } catch (err) {
            console.warn("Firebase Save Warning:", err.message);
        }
    }
    renderAll();
}

// ============================================================================
// 4. UI RENDERING FUNCTIONS
// ============================================================================
function renderAll() {
    renderPublishedResults();
    updateLiveScoreboard();
    updateAdminUI();
}

function updateAdminUI() {
    const adminBar = document.getElementById("adminBar");
    const adminBtn = document.getElementById("adminBtn");
    const adminOnlyBtns = document.querySelectorAll(".admin-only-btn");
    const posterBuilderCard = document.getElementById("posterBuilderCard");

    if (isAdmin) {
        if (adminBar) adminBar.style.display = "flex";
        if (adminBtn) adminBtn.style.display = "none";
        adminOnlyBtns.forEach(btn => btn.style.display = "inline-block");
        if (posterBuilderCard) posterBuilderCard.style.display = "block";
    } else {
        if (adminBar) adminBar.style.display = "none";
        if (adminBtn) adminBtn.style.display = "inline-block";
        adminOnlyBtns.forEach(btn => btn.style.display = "none");
        if (posterBuilderCard) posterBuilderCard.style.display = "none";
    }
}

// ============================================================================
// 5. RESULT POSTER MAKER, THEME SWITCHER & LIVE SCOREBOARD CALCULATION
// ============================================================================
function initPosterBuilder() {
    const resNoInput = document.getElementById("resNoInput");
    if (resNoInput && appData.results) {
        resNoInput.value = String(appData.results.length + 1).padStart(2, "0");
    }
    onPosterCategoryChange();
}

window.onPosterCategoryChange = function() {
    const catSelect = document.getElementById("resCatSelect");
    const typeSelect = document.getElementById("resTypeSelect");
    const progSelect = document.getElementById("resProgSelect");
    if (!catSelect || !typeSelect || !progSelect) return;

    const cat = catSelect.value;
    let type = typeSelect.value;

    if (cat === "general" && type === "offstage") {
        typeSelect.value = "onstage";
        type = "onstage";
    }

    const progList = (appData.programs[cat] && appData.programs[cat][type]) || [];
    progSelect.innerHTML = "";
    progList.forEach(p => {
        progSelect.innerHTML += `<option value="${p.name}">${p.no}. ${p.name}</option>`;
    });

    populateWinnerDropdowns(cat);
    onPosterProgramSelect();
};

function populateWinnerDropdowns(cat) {
    const getTeamStudents = (teamKey, teamLabel) => {
        let list = [];
        if (cat === "general") {
            list = [
                ...(appData.teams[teamKey].senior || []),
                ...(appData.teams[teamKey].junior || []),
                ...(appData.teams[teamKey].subjunior || [])
            ];
        } else {
            list = appData.teams[teamKey][cat] || [];
        }
        return list.map(s => ({ label: `${s} (${teamLabel})`, name: s.replace(/\(C\)|\(Vc\)/gi, "").trim(), team: teamLabel }));
    };

    const allStudents = [
        ...getTeamStudents("teamA", "TEAM A"),
        ...getTeamStudents("teamB", "TEAM B")
    ];

    [1, 2, 3].forEach(rank => {
        const sel = document.getElementById(`selWinner${rank}`);
        if (!sel) return;
        sel.innerHTML = `<option value="">-- വിദ്യാർത്ഥിയെ തിരഞ്ഞെടുക്കുക --</option>`;
        allStudents.forEach(st => {
            sel.innerHTML += `<option value="${st.name}|${st.team}">${st.label}</option>`;
        });
    });
}

window.onPosterProgramSelect = function() {
    const progSelect = document.getElementById("resProgSelect");
    const progCustom = document.getElementById("resProgCustom");
    if (progSelect && progCustom) {
        progCustom.value = progSelect.value || "";
    }
    updatePosterPreview();
};

window.onWinnerSelect = function(rank) {
    const sel = document.getElementById(`selWinner${rank}`);
    const nameInput = document.getElementById(`win${rank}Name`);
    const teamInput = document.getElementById(`win${rank}Team`);
    if (!sel || !sel.value) return;

    const [name, team] = sel.value.split("|");
    if (nameInput) nameInput.value = name.toUpperCase();
    if (teamInput) teamInput.value = team.toUpperCase();
    updatePosterPreview();
};

window.updatePosterPreview = function() {
    const resNo = document.getElementById("resNoInput")?.value || "01";
    const catVal = document.getElementById("resCatSelect")?.value || "senior";
    const progName = document.getElementById("resProgCustom")?.value || "പ്രോഗ്രാം";

    const catLabels = {
        subjunior: "SUB JUNIOR",
        junior: "JUNIOR",
        senior: "SENIOR",
        general: "GENERAL"
    };

    const setElText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setElText("previewResNo", resNo);
    setElText("previewCat", catLabels[catVal] || "SENIOR");
    setElText("previewProg", progName);

    setElText("previewWin1Name", document.getElementById("win1Name")?.value || "-");
    setElText("previewWin1Team", document.getElementById("win1Team")?.value || "");

    setElText("previewWin2Name", document.getElementById("win2Name")?.value || "-");
    setElText("previewWin2Team", document.getElementById("win2Team")?.value || "");

    setElText("previewWin3Name", document.getElementById("win3Name")?.value || "-");
    setElText("previewWin3Team", document.getElementById("win3Team")?.value || "");
};

window.changePosterTheme = function() {
    const themeSelect = document.getElementById("themeStyleSelect");
    const posterCanvas = document.getElementById("posterCanvas");
    if (!themeSelect || !posterCanvas) return;

    posterCanvas.classList.remove("theme-milad", "theme-sahityotsav", "theme-alif");
    posterCanvas.classList.add(themeSelect.value);
};

// Calculate Category-wise and Total Points for Live Scoreboard
function updateLiveScoreboard() {
    let totals = { A: 0, B: 0 };
    let cats = {
        senior: { A: 0, B: 0 },
        junior: { A: 0, B: 0 },
        subjunior: { A: 0, B: 0 },
        general: { A: 0, B: 0 }
    };

    if (appData.results && appData.results.length > 0) {
        appData.results.forEach(r => {
            const getPts = (rank) => (rank === 1 ? 5 : rank === 2 ? 3 : 1);
            
            let cKey = "senior";
            let cText = (r.category || "").toUpperCase();
            if (cText.includes("JUNIOR") && !cText.includes("SUB")) cKey = "junior";
            else if (cText.includes("SUB")) cKey = "subjunior";
            else if (cText.includes("GENERAL") || cText.includes("SPORTS")) cKey = "general";

            const processWin = (teamStr, rank) => {
                if (!teamStr) return;
                let pts = getPts(rank);
                let t = teamStr.toUpperCase();
                if (t.includes("TEAM A") || t.includes("A")) {
                    totals.A += pts;
                    if (cats[cKey]) cats[cKey].A += pts;
                } else if (t.includes("TEAM B") || t.includes("B")) {
                    totals.B += pts;
                    if (cats[cKey]) cats[cKey].B += pts;
                }
            };

            processWin(r.win1Team, 1);
            processWin
