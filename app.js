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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const isFirebaseConfigured = true;

// ============================================================================
// 2. DEFAULT SOURCE DATA (യഥാർത്ഥ പ്രോഗ്രാമുകളും ടീം ലിസ്റ്റുകളും)
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
    }
};

// ============================================================================
// 3. STATE MANAGEMENT & DATA LOADING
// ============================================================================
let appData = JSON.parse(JSON.stringify(defaultData));
let currentCategory = "senior";
let currentType = "onstage";
let isAdmin = false;
let editingIndex = null;

async function loadAppData() {
    if (isFirebaseConfigured && db) {
        try {
            const docRef = db.collection("fiesta2k26").doc("mainData");
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                appData = docSnap.data();
            } else {
                await docRef.set(defaultData);
            }
        } catch (err) {
            console.warn("Firestore Load Error, using local backup:", err);
            const saved = localStorage.getItem("eid_irshad_2k26_data");
            if (saved) appData = JSON.parse(saved);
        }
    } else {
        const saved = localStorage.getItem("eid_irshad_2k26_data");
        if (saved) appData = JSON.parse(saved);
    }
    renderAll();
}

async function saveAppData() {
    localStorage.setItem("eid_irshad_2k26_data", JSON.stringify(appData));
    if (isFirebaseConfigured && db && isAdmin) {
        try {
            await db.collection("fiesta2k26").doc("mainData").set(appData);
        } catch (err) {
            alert("Firebase-ൽ സേവ് ചെയ്യുന്നതിൽ പിശക്: " + err.message);
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
    updateAdminUI();
}

function renderPrograms() {
    const tbody = document.getElementById("programListBody");
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

    const list = appData.programs[currentCategory][currentType] || [];
    if (!tbody) return;
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

            const students = appData.teams[teamKey][cat.key] || [];
            students.forEach((student, idx) => {
                const div = document.createElement("div");
                div.className = "student-item";
                const adminBtns = isAdmin
                    ? `<div>
                        <button class="edit-row-btn" onclick="editStudent('${teamKey}', '${cat.key}', ${idx})">✏️</button>
                        <button class="edit-row-btn" style="background:#c0392b;" onclick="deleteStudent('${teamKey}', '${cat.key}', ${idx})">🗑️</button>
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

    if (isAdmin) {
        if (adminBar) adminBar.style.display = "flex";
        if (adminBtn) adminBtn.style.display = "none";
        adminOnlyBtns.forEach(btn => btn.style.display = "inline-block");
    } else {
        if (adminBar) adminBar.style.display = "none";
        if (adminBtn) adminBtn.style.display = "inline-block";
        adminOnlyBtns.forEach(btn => btn.style.display = "none");
    }
}

// ============================================================================
// 5. NAVIGATION & FILTER HANDLERS
// ============================================================================
window.switchTab = function(tabName, btnEl) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".main-nav .nav-btn").forEach(el => el.classList.remove("active"));

    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) targetTab.classList.add("active");
    if (btnEl) btnEl.classList.add("active");
};

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

// ============================================================================
// 6. ADMIN AUTHENTICATION & EDITING FUNCTIONS
// ============================================================================
window.openAdminModal = function() {
    const errEl = document.getElementById("loginError");
    const modal = document.getElementById("loginModal");
    if (errEl) errEl.textContent = "";
    if (modal) modal.style.display = "flex";
};

window.closeAdminModal = function() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
};

window.loginAdmin = async function() {
    const emailField = document.getElementById("adminEmail");
    const passField = document.getElementById("adminPassword");
    const errEl = document.getElementById("loginError");

    if (!emailField || !passField) return;
    const email = emailField.value.trim();
    const pass = passField.value.trim();

    if (isFirebaseConfigured && auth) {
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            closeAdminModal();
        } catch (err) {
            if (errEl) errEl.textContent = "ലോഗിൻ പരാജയപ്പെട്ടു! ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ് പരിശോധിക്കുക.";
        }
    }
};

window.logoutAdmin = async function() {
    if (isFirebaseConfigured && auth) {
        await auth.signOut();
    }
    isAdmin = false;
    renderAll();
};

if (isFirebaseConfigured && auth) {
    auth.onAuthStateChanged((user) => {
        isAdmin = !!user;
        renderAll();
    });
}

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

    const getStud
