// Firebase Configuration & Initialization
const firebaseConfig = {
    // Firebase credentials placeholder
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
    loadAppDataFromCloud();
});

function openAdminLoginModal() {
    const modal = document.getElementById("adminLoginModal");
    if (modal) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeAdminLoginModal()">&times;</span>
                <h3 style="margin: 0 0 12px; font-weight: 900; color: var(--accent-gold);">🔐 Admin Gmail Login</h3>
                <div class="form-group">
                    <label>Admin Email:</label>
                    <input type="email" id="adminEmailInput" class="form-control" placeholder="Gmail നൽകുക" style="margin-bottom:10px;">
                    <label>Password:</label>
                    <input type="password" id="adminPassInput" class="form-control" placeholder="പാസ്‌വേഡ് നൽകുക">
                </div>
                <button class="btn-submit" onclick="submitAdminLogin()">Login</button>
            </div>
        `;
        modal.style.display = "flex";
    }
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
        .then((userCredential) => {
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
