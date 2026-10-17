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
    renderPrograms();
    renderTeams();
    renderPublishedResults();
    updateLiveScoreboard();
    updateAdminUI();
}

function renderPrograms() {
    const tbody = document.getElementById("programListBody");
    if (!tbody) return;

    const titleEl = document.getElementById("programTableTitle");
    const offstageBtn = document.querySelector('.type-btn[data-type="offstage"]');

    if (currentCategory === "general") {
        if (offstageBtn) offstageBtn.style.display = "none";
        if (currentType === "offstage") currentType = "onstage";
    } else {
        if (offstageBtn) offstageBtn.style.display = "inline-block";
    }

    const catNames = { senior: "SENIOR", junior: "JUNIOR", subjunior: "SUB JUNIOR", general: "GENERAL" };
    const typeNames = {
        onstage: currentCategory === "general" ? "GENERAL PROGRAMS" : "ON STAGE",
        offstage: "OFF STAGE",
        sports: "SPORTS"
    };

    if (titleEl) titleEl.textContent = `${catNames[currentCategory]} — ${typeNames[currentType]}`;

    const list = (appData.programs[currentCategory] && appData.programs[currentCategory][currentType]) || [];
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">പ്രോഗ്രാമുകൾ ചേർത്തിട്ടില്ല.</td></tr>`;
        return;
    }

    list.forEach((item, index) => {
        const tr = document.createElement("tr");
        const editButtonHTML = isAdmin
            ? `<button class="edit-row-btn" onclick="openEditProgramModal(${index})">✏️ Edit</button>`
            : "";

        tr.innerHTML = `
            <td><strong>${item.no}</strong></td>
            <td><strong>${item.name}</strong> ${editButtonHTML}</td>
            <td>${item.teamA || '<span style="color:#aaa;">-</span>'}</td>
            <td>${item.teamB || '<span style="color:#aaa;">-</span>'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTeams() {
    const renderTeamColumn = (teamKey, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        const categories = [
            { key: "senior", label: "Senior" },
            { key: "junior", label: "Junior" },
            { key: "subjunior", label: "Sub Junior" }
        ];

        categories.forEach(cat => {
            const heading = document.createElement("div");
            heading.className = "team-cat-title";
            heading.textContent = cat.label;
            container.appendChild(heading);

            const students = (appData.teams[teamKey] && appData.teams[teamKey][cat.key]) || [];
            students.forEach((student, idx) => {
                const div = document.createElement("div");
                div.className = "student-item";
                const adminBtns = isAdmin
                    ? `<div>
                        <button class="edit-row-btn" onclick="editStudent('${teamKey}', '${cat.key}', ${idx})">✏️</button>
                        <button class="edit-row-btn" style="background:#dc2626;" onclick="deleteStudent('${teamKey}', '${cat.key}', ${idx})">🗑️</button>
                       </div>`
                    : "";
                div.innerHTML = `<span>${student}</span> ${adminBtns}`;
                container.appendChild(div);
            });
        });
    };

    renderTeamColumn("teamA", "teamAContainer");
    renderTeamColumn("teamB", "teamBContainer");
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
            processWin(r.win2Team, 2);
            processWin(r.win3Team, 3);
        });
    }

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    setEl("barScoreA", totals.A);
    setEl("barScoreB", totals.B);

    setEl("srPtsA", cats.senior.A);
    setEl("srPtsB", cats.senior.B);

    setEl("jrPtsA", cats.junior.A);
    setEl("jrPtsB", cats.junior.B);

    setEl("subPtsA", cats.subjunior.A);
    setEl("subPtsB", cats.subjunior.B);

    setEl("genPtsA", cats.general.A);
    setEl("genPtsB", cats.general.B);

    const barA = document.getElementById("verticalBarA");
    const barB = document.getElementById("verticalBarB");
    
    if (barA && barB) {
        let maxVal = Math.max(totals.A, totals.B, 10);
        let heightA = Math.max(15, Math.round((totals.A / maxVal) * 100));
        let heightB = Math.max(15, Math.round((totals.B / maxVal) * 100));

        barA.style.height = heightA + "%";
        barB.style.height = heightB + "%";
    }
}

window.downloadResultPoster = async function() {
    const posterEl = document.getElementById("posterCanvas");
    if (!posterEl || typeof html2canvas === "undefined") {
        alert("ഡൗൺലോഡ് തയ്യാറാകുന്നുണ്ട്, ദയവായി കാത്തിരിക്കുക.");
        return;
    }
    try {
        const canvas = await html2canvas(posterEl, { scale: 3, useCORS: true, backgroundColor: null });
        const link = document.createElement("a");
        const resNo = document.getElementById("resNoInput")?.value || "01";
        link.download = `EID-E-IRSHAD-Result-${resNo}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    } catch (err) {
        alert("ഡൗൺലോഡ് ചെയ്യുന്നതിൽ പിശക്: " + err.message);
    }
};

window.publishResultToSite = async function() {
    const themeSelect = document.getElementById("themeStyleSelect");
    const resObj = {
        resNo: document.getElementById("resNoInput")?.value || "01",
        category: document.getElementById("previewCat")?.textContent || "SENIOR",
        program: document.getElementById("resProgCustom")?.value || "",
        win1Name: document.getElementById("win1Name")?.value || "-",
        win1Team: document.getElementById("win1Team")?.value || "",
        win2Name: document.getElementById("win2Name")?.value || "-",
        win2Team: document.getElementById("win2Team")?.value || "",
        win3Name: document.getElementById("win3Name")?.value || "-",
        win3Team: document.getElementById("win3Team")?.value || "",
        themeClass: themeSelect ? themeSelect.value : "theme-alif"
    };

    if (!appData.results) appData.results = [];
    appData.results.unshift(resObj);
    await saveAppData();
    initPosterBuilder();
    alert("മത്സരഫലം വിജയകരമായി വെബ്സൈറ്റിൽ സേവ് ചെയ്തു!");
};

function renderPublishedResults() {
    const container = document.getElementById("publishedResultsContainer");
    if (!container) return;

    const list = appData.results || [];
    if (list.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding:15px;">മത്സര ഫലങ്ങൾ ഒന്നും തന്നെ പ്രസിദ്ധീകരിച്ചിട്ടില്ല.</p>`;
        return;
    }

    container.innerHTML = "";
    list.forEach((r, idx) => {
        const card = document.createElement("div");
        card.className = `published-res-card ${r.themeClass || 'theme-alif'}`;
        const delBtn = isAdmin
            ? `<button class="edit-row-btn" style="background:#dc2626; margin-top:10px;" onclick="deletePublishedResult(${idx})">🗑️ ഒഴിവാക്കുക</button>`
            : "";

        card.innerHTML = `
            <span class="pub-res-badge">#${r.resNo}</span>
            <div class="ref-cat-label">${r.category}</div>
            <div class="ref-prog-label" style="margin-bottom:10px;">${r.program}</div>
            <div class="ref-winner-row"><div class="rank-num rank-1">01<sup>st</sup></div><div class="rank-dot">•</div><div class="rank-details"><div class="rank-name">${r.win1Name}</div><div class="rank-place">${r.win1Team}</div></div></div>
            <div class="ref-winner-row"><div class="rank-num rank-2">02<sup>nd</sup></div><div class="rank-dot">•</div><div class="rank-details"><div class="rank-name">${r.win2Name}</div><div class="rank-place">${r.win2Team}</div></div></div>
            <div class="ref-winner-row"><div class="rank-num rank-3">03<sup>rd</sup></div><div class="rank-dot">•</div><div class="rank-details"><div class="rank-name">${r.win3Name}</div><div class="rank-place">${r.win3Team}</div></div></div>
            ${delBtn}
        `;
        container.appendChild(card);
    });
}

window.deletePublishedResult = async function(idx) {
    if (!confirm("ഈ റിസൾട്ട് ഒഴിവാക്കണോ?")) return;
    appData.results.splice(idx, 1);
    await saveAppData();
};

// ============================================================================
// 6. PROGRAM & STUDENT EDITING FUNCTIONS (ADMIN)
// ============================================================================
window.selectCategory = function(cat, btnEl) {
    currentCategory = cat;
    document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderPrograms();
};

window.selectType = function(type, btnEl) {
    currentType = type;
    document.querySelectorAll(".type-btn").forEach(btn => btn.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");
    renderPrograms();
};

window.openEditProgramModal = function(index) {
    editingIndex = index;
    const item = appData.programs[currentCategory][currentType][index];

    const nameField = document.getElementById("editProgName");
    const inputA = document.getElementById("editTeamAInput");
    const inputB = document.getElementById("editTeamBInput");
    const modal = document.getElementById("editModal");

    if (nameField) nameField.value = item.name;
    if (inputA) inputA.value = item.teamA;
    if (inputB) inputB.value = item.teamB;

    populateStudentDropdowns();
    if (modal) modal.style.display = "flex";
};

function populateStudentDropdowns() {
    const selA = document.getElementById("selectTeamA");
    const selB = document.getElementById("selectTeamB");
    if (!selA || !selB) return;

    selA.innerHTML = '<option value="">-- Team A ലിസ്റ്റിൽ നിന്ന് തിരഞ്ഞെടുക്കുക --</option>';
    selB.innerHTML = '<option value="">-- Team B ലിസ്റ്റിൽ നിന്ന് തിരഞ്ഞെടുക്കുക --</option>';

    const getStudentsForCat = (teamKey) => {
        if (currentCategory === "general") {
            return [
                ...appData.teams[teamKey].senior,
                ...appData.teams[teamKey].junior,
                ...appData.teams[teamKey].subjunior
            ];
        }
        return appData.teams[teamKey][currentCategory] || [];
    };

    getStudentsForCat("teamA").forEach(st => {
        selA.innerHTML += `<option value="${st}">${st}</option>`;
    });
    getStudentsForCat("teamB").forEach(st => {
        selB.innerHTML += `<option value="${st}">${st}</option>`;
    });
}

window.appendStudent = function(team) {
    const selectEl = document.getElementById(`select${team}`);
    const inputEl = document.getElementById(`edit${team}Input`);
    if (!selectEl || !inputEl) return;

    const selectedVal = selectEl.value;
    if (!selectedVal) return;

    if (inputEl.value.trim() === "") {
        inputEl.value = selectedVal;
    } else {
        inputEl.value += ", " + selectedVal;
    }
    selectEl.value = "";
};

window.closeEditModal = function() {
    const modal = document.getElementById("editModal");
    if (modal) modal.style.display = "none";
};

window.saveProgramChanges = async function() {
    if (editingIndex === null) return;
    const item = appData.programs[currentCategory][currentType][editingIndex];
    
    const nameField = document.getElementById("editProgName");
    const inputA = document.getElementById("editTeamAInput");
    const inputB = document.getElementById("editTeamBInput");

    if (nameField) item.name = nameField.value.trim();
    if (inputA) item.teamA = inputA.value.trim();
    if (inputB) item.teamB = inputB.value.trim();

    closeEditModal();
    await saveAppData();
};

window.deleteCurrentProgram = async function() {
    if (editingIndex === null) return;
    if (!confirm("ഈ പ്രോഗ്രാം ലിസ്റ്റിൽ നിന്ന് ഒഴിവാക്കണോ?")) return;

    appData.programs[currentCategory][currentType].splice(editingIndex, 1);
    appData.programs[currentCategory][currentType].forEach((it, idx) => {
        it.no = String(idx + 1).padStart(2, "0");
    });

    closeEditModal();
    await saveAppData();
};

window.addNewProgram = async function() {
    const name = prompt("പുതിയ പ്രോഗ്രാമിന്റെ പേര് നൽകുക:");
    if (!name || !name.trim()) return;

    , list = appData.programs[currentCategory][currentType];
    const nextNo = String(list.length + 1).padStart(2, "0");
    list.push({ no: nextNo, name: name.trim(), teamA: "", teamB: "" });
    await saveAppData();
};

window.addNewStudent = async function(teamKey) {
    const cat = prompt("ഏത് വിഭാഗത്തിലാണ് ചേർക്കേണ്ടത്? (senior / junior / subjunior):", "senior");
    if (!cat || !["senior", "junior", "subjunior"].includes(cat.toLowerCase())) {
        alert("ദയവായി senior, junior, അല്ലെങ്കിൽ subjunior എന്ന് കൃത്യമായി നൽകുക.");
        return;
    }
    const name = prompt("വിദ്യാർത്ഥിയുടെ കോഡും പേരും നൽകുക (ഉദാ: 316. Muhammed):");
    if (!name || !name.trim()) return;

    appData.teams[teamKey][cat.toLowerCase()].push(name.trim());
    await saveAppData();
};

window.editStudent = async function(teamKey, catKey, idx) {
    const currentVal = appData.teams[teamKey][catKey][idx];
    const updated = prompt("പേര് തിരുത്തുക:", currentVal);
    if (updated && updated.trim()) {
        appData.teams[teamKey][catKey][idx] = updated.trim();
        await saveAppData();
    }
};

window.deleteStudent = async function(teamKey, catKey, idx) {
    if (!confirm("ഈ വിദ്യാർത്ഥിയെ ലിസ്റ്റിൽ നിന്ന് ഒഴിവാക്കണോ?")) return;
    appData.teams[teamKey][catKey].splice(idx, 1);
    await saveAppData();
};

// ============================================================================
// 7. ADMIN AUTHENTICATION & LOGIN (INSTANT BYPASS)
// ============================================================================
window.openAdminModal = function() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
};

window.closeAdminModal = function() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
};

window.loginAdmin = function() {
    isAdmin = true;
    localStorage.setItem("eid_irshad_admin_logged", "true");
    closeAdminModal();
    renderAll();
};

window.logoutAdmin = function() {
    isAdmin = false;
    localStorage.removeItem("eid_irshad_admin_logged");
    renderAll();
};

window.resetToDefaultData = async function() {
    if (!confirm("ശ്രദ്ധിക്കുക: നിങ്ങൾ വരുത്തിയ മാറ്റങ്ങൾ മാഞ്ഞ് ആദ്യത്തെ ലിസ്റ്റിലേക്ക് തിരിച്ചുപോകും. തുടരണോ?")) return;
    appData = JSON.parse(JSON.stringify(defaultData));
    await saveAppData();
};

// Start App
loadAppData();
