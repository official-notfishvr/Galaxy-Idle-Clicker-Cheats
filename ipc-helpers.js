// --- lits all users and log their data ---
function listAllUserData() {
    window.ipcRenderer.invoke('list-user-data').then(userList => {
        const identifiers = [];
        userList.forEach(user => {
            const index = parseInt(user.split(' ')[2]) - 1;
            identifiers[index] = user;
        });

        console.log('User Identifiers:', identifiers);

        identifiers.forEach(identifier => {
            if (identifier) {
                window.ipcRenderer.invoke('load-user-data', identifier).then(response => {
                    if (response) {
                        console.log('User Data for', identifier, ':', JSON.parse(response));
                    }
                });
            }
        });
    });
}

// --- load a single save file by name ---
function loadSaveFile(identifier) {
    identifier = identifier || 'Save File 1';
    window.ipcRenderer.invoke('load-user-data', identifier).then(response => {
        if (response) {
            console.log('User Data:', JSON.parse(response));
        } else {
            console.log('No data found for:', identifier);
        }
    });
}

// --- download all user data as a .txt file ---
function downloadAllUserData() {
    window.ipcRenderer.invoke('list-user-data').then(userList => {
        const identifiers = [];
        userList.forEach(user => {
            const index = parseInt(user.split(' ')[2]) - 1;
            identifiers[index] = user;
        });

        let allUserData = '';

        identifiers.forEach(identifier => {
            if (identifier) {
                window.ipcRenderer.invoke('load-user-data', identifier).then(response => {
                    if (response) {
                        const userData = JSON.parse(response);
                        allUserData += 'User Data for ' + identifier + ':\n' + JSON.stringify(userData, null, 2) + '\n\n';
                        if (allUserData) {
                            const blob = new Blob([allUserData], { type: 'text/plain' });
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = 'userData.txt';
                            link.click();
                        }
                    }
                });
            }
        });
    });
}

// --- save data to a specific save file ---
// example: saveSaveFile('Save File 1', { gameContext: { level: 99 } })
function saveSaveFile(identifier, userData) {
    identifier = identifier || 'Save File 1';
    window.ipcRenderer.invoke('save-user-data', identifier, userData)
        .then(() => {
            console.log('************* PROTTO GAMES SAYS *************');
            console.log('Data Saved for ' + identifier);
            console.log('************* PROTTO GAMES CYA! *************');
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
}

// --- examples ---
// listAllUserData();
// loadSaveFile('Save File 1');
// downloadAllUserData();
// saveSaveFile('Save File 1', { gameContext: { level: 99 } });
