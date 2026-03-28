// ============================================================
//  Galaxy Idle Clicker - Save Editor
//
//  HOW TO USE WITHOUT PASTING EVERY TIME:
//  1. Open Chrome and go to http://localhost:1234
//  2. Open DevTools (F12) > Sources tab > Snippets (left sidebar)
//  3. Click "+ New snippet", paste this entire file, save (Ctrl+S)
//  4. To run: right-click the snippet > Run  (or Ctrl+Enter)
//  5. A cheat panel will appear in the game window - click any button!
//
//  You only paste this ONCE. After that just hit Run in Snippets.
// ============================================================

// ============================================================
//  CORE IPC
// ============================================================

async function loadAllUsers() {
    const userList = await window.ipcRenderer.invoke('list-user-data');
    const identifiers = [];
    userList.forEach(user => {
        const index = parseInt(user.split(' ')[2]) - 1;
        identifiers[index] = user;
    });
    return identifiers.filter(Boolean);
}

async function loadUser(identifier) {
    const response = await window.ipcRenderer.invoke('load-user-data', identifier);
    return response ? JSON.parse(response) : null;
}

async function saveUser(identifier, userData) {
    await window.ipcRenderer.invoke('save-user-data', identifier, userData);
    console.log('[SaveEditor] Saved: ' + identifier);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function beginBatch() {
    const ids = await loadAllUsers();
    _batchUsers = {};
    for (const id of ids) {
        const data = await loadUser(id);
        if (data) _batchUsers[id] = data;
    }
}

function applyPatch(patch) {
    for (const [identifier, userData] of Object.entries(_batchUsers)) {
        for (const [key, value] of Object.entries(patch)) {
            let found = false;
            for (const ctx of _CONTEXTS) {
                if (userData[ctx] && Object.prototype.hasOwnProperty.call(userData[ctx], key)) {
                    userData[ctx][key] = value;
                    found = true;
                }
            }
            if (!found) console.warn('[SaveEditor] Key not found: ' + key + ' (' + identifier + ')');
        }
    }
}

async function flushPatch() {
    for (const [identifier, userData] of Object.entries(_batchUsers)) {
        await saveUser(identifier, userData);
    }
    await delay(2350);
    _batchUsers = null;
}

async function withBatch(patchFn) {
    await beginBatch();
    patchFn();
    await flushPatch();
}

async function EditValue(key, value) {
    await withBatch(() => applyPatch({ [key]: value }));
}

function patchFromKeys(keys, value) {
    const patch = {};
    for (const k of keys) patch[k] = value;
    return patch;
}

// ============================================================
//  HELPERS
// ============================================================

function generateEnemiesKilledKeys(count) {
    const words = [
        'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
        'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
        'Eighteen','Nineteen','Twenty','TwentyOne','TwentyTwo','TwentyThree',
        'TwentyFour','TwentyFive','TwentySix','TwentySeven','TwentyEight',
        'TwentyNine','Thirty','ThirtyOne','ThirtyTwo','ThirtyThree','ThirtyFour',
        'ThirtyFive','ThirtySix','ThirtySeven','ThirtyEight','ThirtyNine','Fourty',
        'FourtyOne','FourtyTwo','FourtyThree','FourtyFour','FourtyFive','FourtySix',
        'FourtySeven','FourtyEight','FourtyNine','Fifty','FiftyOne','FiftyTwo',
        'FiftyThree','FiftyFour','FiftyFive','FiftySix','FiftySeven','FiftyEight',
        'FiftyNine','Sixty','SixtyOne','SixtyTwo','SixtyThree','SixtyFour',
        'SixtyFive','SixtySix','SixtySeven','SixtyEight','SixtyNine','Seventy',
        'SeventyOne','SeventyTwo','SeventyThree','SeventyFour','SeventyFive',
        'SeventySix','SeventySeven','SeventyEight','SeventyNine','Eighty'
    ];
    return words.slice(0, count).map(w => 'enemiesKilled' + w);
}

async function loadAllUsers() {
    const userList = await window.ipcRenderer.invoke('list-user-data');
    const identifiers = [];
    userList.forEach(user => {
        const index = parseInt(user.split(' ')[2]) - 1;
        identifiers[index] = user;
    });
    return identifiers.filter(Boolean);
}

async function loadUser(identifier) {
    const response = await window.ipcRenderer.invoke('load-user-data', identifier);
    return response ? JSON.parse(response) : null;
}

async function saveUser(identifier, userData) {
    await window.ipcRenderer.invoke('save-user-data', identifier, userData);
    console.log('[SaveEditor] Saved: ' + identifier);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var _CONTEXTS = ['extraContext', 'gameContext', 'meteorContext'];
var _batchUsers = null;

async function beginBatch() {
    var ids = await loadAllUsers();
    _batchUsers = {};
    for (var i = 0; i < ids.length; i++) {
        var data = await loadUser(ids[i]);
        if (data) _batchUsers[ids[i]] = data;
    }
}

function applyPatch(patch) {
    var keys = Object.keys(patch);
    var entries = Object.keys(_batchUsers);
    for (var e = 0; e < entries.length; e++) {
        var identifier = entries[e];
        var userData = _batchUsers[identifier];
        for (var k = 0; k < keys.length; k++) {
            var key = keys[k];
            var value = patch[key];
            var found = false;
            for (var c = 0; c < _CONTEXTS.length; c++) {
                var ctx = _CONTEXTS[c];
                if (userData[ctx] && Object.prototype.hasOwnProperty.call(userData[ctx], key)) {
                    userData[ctx][key] = value;
                    found = true;
                }
            }
            if (!found) console.warn('[SaveEditor] Key not found: ' + key);
        }
    }
}

async function flushPatch() {
    var entries = Object.keys(_batchUsers);
    for (var i = 0; i < entries.length; i++) {
        await saveUser(entries[i], _batchUsers[entries[i]]);
    }
    await delay(2350);
    _batchUsers = null;
}

async function withBatch(patchFn) {
    await beginBatch();
    patchFn();
    await flushPatch();
}

async function EditValue(key, value) {
    var patch = {};
    patch[key] = value;
    await withBatch(function() { applyPatch(patch); });
}

function patchFromKeys(keys, value) {
    var patch = {};
    for (var i = 0; i < keys.length; i++) patch[keys[i]] = value;
    return patch;
}

function generateEnemiesKilledKeys(count) {
    var words = [
        'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
        'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen',
        'Eighteen','Nineteen','Twenty','TwentyOne','TwentyTwo','TwentyThree',
        'TwentyFour','TwentyFive','TwentySix','TwentySeven','TwentyEight',
        'TwentyNine','Thirty','ThirtyOne','ThirtyTwo','ThirtyThree','ThirtyFour',
        'ThirtyFive','ThirtySix','ThirtySeven','ThirtyEight','ThirtyNine','Fourty',
        'FourtyOne','FourtyTwo','FourtyThree','FourtyFour','FourtyFive','FourtySix',
        'FourtySeven','FourtyEight','FourtyNine','Fifty','FiftyOne','FiftyTwo',
        'FiftyThree','FiftyFour','FiftyFive','FiftySix','FiftySeven','FiftyEight',
        'FiftyNine','Sixty','SixtyOne','SixtyTwo','SixtyThree','SixtyFour',
        'SixtyFive','SixtySix','SixtySeven','SixtyEight','SixtyNine','Seventy',
        'SeventyOne','SeventyTwo','SeventyThree','SeventyFour','SeventyFive',
        'SeventySix','SeventySeven','SeventyEight','SeventyNine','Eighty'
    ];
    var result = [];
    for (var i = 0; i < count; i++) result.push('enemiesKilled' + words[i]);
    return result;
}

var COMMANDS = {

    MaxMultipliers: {
        label: 'Max Multipliers', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['multiplyMinigamesSupernovaTab','multiplyResroucesSupernovaTab','multiplyLYSupernovaTab'], 999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxAllResources: {
        label: 'Max All Resources', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['junkCount','plasmaCount','energyCount','garbageCount','scrapCount','quarkCount','antimatterCount','cosmicDustCount','supernovaEssenceCount','lightYearsTravelCount','totalAntimatterCount','antimatterMeteoriteCount','totalCosmicDustCount','totalQuarkCount','totalScrapCount'], Number.MAX_SAFE_INTEGER)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxMeteorite: {
        label: 'Max Meteorite & Minerals', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['meteoriteCount','totalMeteoriteCount','mineralsCount','totalMineralsCount'], Number.MAX_SAFE_INTEGER)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxRadiations: {
        label: 'Max Radiations', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['baseValueRadiations','totalRadiationCount','radiationCount'], Number.MAX_SAFE_INTEGER)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxSpecialMeteorites: {
        label: 'Max Special Meteorites', group: 'Resources',
        _patch: function() { applyPatch({ specialMeteoriteCount: { diamond: 199990, gold: 749990, satellite: 19999, amethyst: 49999 } }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxExtraCosmicDustLevels: {
        label: 'Max Cosmic Dust Levels', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['extraCosmicDustResourcesMultiplier','extraCosmicDustDmgHpMultiplier','extraCosmicDustMinigamesMultiplier','extraCosmicDustItemsMultiplier','extraCosmicDustCurrentRunLYMultiplier'], Number.MAX_SAFE_INTEGER)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxExtraArmyTabLevels: {
        label: 'Max Army Tab Levels', group: 'Resources',
        _patch: function() { applyPatch(patchFromKeys(['junkExtraMultiplierArmyTab','expExtraMultiplierArmyTab','plasmaExtraMultiplierArmyTab','prisonersExtraMultiplierArmyTab','garbageExtraMultiplierArmyTab','dmgHpExtraMultiplierArmyTab','energyExtraMultiplierArmyTab','citizensExtraMultiplierArmyTab','scrapExtraMultiplierArmyTab','mineralsExtraMultiplierArmyTab','radiationsExtraMultiplierArmyTab','meteoriteExtraMultiplierArmyTab','lightYearsExtraMultiplierArmyTab'], 1999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxLevels: {
        label: 'Max Level & Skill Points', group: 'Player',
        _patch: function() { applyPatch({ level: 99999, skillPoints: 99999 }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxDifficultyUnlocks: {
        label: 'Unlock All Difficulties', group: 'Player',
        _patch: function() { applyPatch(patchFromKeys(['normalDifficultyUnlockedMilestone','hardDifficultyUnlockedMilestone','hellDifficultyUnlockedMilestone'], true)); },
        run: function() { return withBatch(this._patch); }
    },

    ActivateAllBuffs: {
        label: 'Activate All Buffs', group: 'Player',
        _patch: function() { applyPatch(patchFromKeys(['canRefund','timeSkipBlackMatter','shockwaveCDHalved','shieldPassiveCDHalved','cloneShipCDHalved','hpBuffActive','damageBuffActive','autoMineDamageBoost','junkBuffActive','plasmaBuffActive','energyBuffActive','expBuffActive','garbageBuffActive','prisonersBuffActive','citizensBuffActive','itemsDropRarityBlackMatter'], true)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxPotionTimers: {
        label: 'Max Potion Timers (300 days)', group: 'Player',
        _patch: function() { applyPatch(patchFromKeys(['damagePotionTimer','hpPotionTimer','junkPotionTimer','plasmaPotionTimer','garbagePotionTimer','expPotionTimer','prisonersPotionTimer','citizensPotionTimer','meteoritePotionTimer','mineralsPotionTimer'], 25920000000)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxShipStats: {
        label: 'Max Ship Stats', group: 'Player',
        _patch: function() { applyPatch(patchFromKeys(['playerShipMaxHP','maxPlayerShipMaxHP','bulletDamage','maxBulletDamage'], 999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxMechTokens: {
        label: 'Max Mech Tokens', group: 'Player',
        _patch: function() { applyPatch({ mechTokens: 99999, mechMissionTokens: 99999 }); },
        run: function() { return withBatch(this._patch); }
    },

    CompleteMechMissions: {
        label: 'Complete All Mech Missions', group: 'Player',
        _patch: function() {
            var mechs = ['One','Two','Three','Four'];
            var types = ['JunkUpgradeMission','PlasmaUpgradeMission','ExpUpgradeMission','DmgUpgradeMission','HpUpgradeMission','PrisonersUpgradeMission','CitizensUpgradeMission','GarbageUpgradeMission','LightYearsUpgradeMission','EnergyUpgradeMission','MeteoriteUpgradeMission','MineralsUpgradeMission','MinigamesUpgradeMission','RadiationsUpgradeMission','ResourcesOneUpgradeMission','ResourcesTwoUpgradeMission'];
            var completedMission = { inMission: false, inPause: false, missionsCompleted: 9999 };
            var mechMissions = {};
            for (var m = 0; m < mechs.length; m++)
                for (var t = 0; t < types.length; t++)
                    mechMissions['mech' + mechs[m] + types[t]] = completedMission;
            applyPatch({ mechMissions: mechMissions });
        },
        run: function() { return withBatch(this._patch); }
    },

    MaxAutoUpgrades: {
        label: 'Unlock All Auto Features', group: 'Player',
        _patch: function() { applyPatch(patchFromKeys(['autoBuyEnergyAcquired','autoBuyGarbageAcquired','autoClickShotAcquired','autoMoveRadiationAcquired','autoPlayRadiationAcquired','autoPlayMeteoriteAcquired','autoPlayMeteoriteShopAcquired','autoPlayRadiationShopAcquired','autoProgressionAcquired','autoLootPrisonersAcquired','autoMoveUpgradeAcquired','smokeTrailAcquired','turretsAcquired','homingUpgradeAcquired','doubleHomingUpgradeAcquired','tripleHomingUpgradeAcquired','quadHomingUpgradeAcquired','cloneShipAcquired','newDoubleShotAcquired','newTripleShotAcquired','newQuadShotAcquired'], true)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxTurretsLevel: {
        label: 'Max Turrets Level', group: 'Player',
        _patch: function() { applyPatch({ turretsLevel: 99999 }); },
        run: function() { return withBatch(this._patch); }
    },

    CompleteAllMechs: {
        label: 'Max Ships Killed & KPS', group: 'Combat',
        _patch: function() { applyPatch({ totalEnemyShipsKilledCountEver: 999999999999999, killsPerSecond: 999999.999 }); },
        run: function() { return withBatch(this._patch); }
    },

    CompleteAllMechs2: {
        label: 'Max All Enemies Killed (x80)', group: 'Combat',
        _patch: function() { applyPatch(patchFromKeys(generateEnemiesKilledKeys(80), 999999999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxShotUpgrades: {
        label: 'Max Shot Upgrade Counts', group: 'Combat',
        _patch: function() { applyPatch(patchFromKeys(['newNormalShotUpgradeCount','newDoubleShotUpgradeCount','newTripleShotUpgradeCount','newQuadShotUpgradeCount','clickShotUpgradeCount'], 99999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxMechMultipliers: {
        label: 'Max Mech Multipliers', group: 'Combat',
        _patch: function() { applyPatch(patchFromKeys(['firstMechMultiplierScrapTab','secondMechMultiplierScrapTab','thirdMechMultiplierScrapTab','fourthMechMultiplierScrapTab','fifthMechMultiplierScrapTab','buffsMultiplierSixthMech','mechsMultiplierBlackMatter'], 999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxPlanets: {
        label: 'Max Planets Completed', group: 'Combat',
        _patch: function() { applyPatch({ planetsCompletedCount: 999999999 }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxTimeWarps: {
        label: 'Max Time Warps', group: 'Time',
        _patch: function() { applyPatch(patchFromKeys(['thirtyMinTimeSkipBlackMatter','oneHTimeskipBlackMatter','threeHTimeskipBlackMatter','sixHTimeskipBlackMatter','nineHTimeskipBlackMatter','twelveHTimeskipBlackMatter'], 9999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxOfflineTime: {
        label: 'Max Offline Bonus (1 day)', group: 'Time',
        _patch: function() { applyPatch({ offlineTime: Date.now() - 86400000 }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxStartGameTime: {
        label: 'Max LY Run Time (5 days)', group: 'Time',
        _patch: function() { applyPatch({ startGameTime: Date.now() - (86400000 * 5) }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxBlackHoleTime: {
        label: 'Max Black Hole Time (5 days)', group: 'Time',
        _patch: function() { applyPatch({ blackHoleTime: Date.now() - (86400000 * 5) }); },
        run: function() { return withBatch(this._patch); }
    },

    MaxAllAchievements: {
        label: 'Max All Achievement Points', group: 'Achievements',
        _patch: function() { applyPatch(patchFromKeys(['killsAchievement','levelAchievement','mechsAchievement','mechUpgradesAchievement','junkAchievement','plasmaAchievement','energyAchievement','garbageAchievement','prisonersAchievement','citizensAchievement','armyAchievement','meteoriteAchievement','mineralsAchievement','radiationsAchievement','itemsAchievement','lightYearAchievement','blackHoleAchievement','supernovaAchievement','zoneAchievement','bigBangAchievement','antimatterGeneratedAchievement','antimatterMeteoriteAchievement'], 999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxAllPoints: {
        label: 'Max All Points', group: 'Achievements',
        _patch: function() { applyPatch(patchFromKeys(['lightTravelPoints','totalLightTravelPoints','totalRunLightTravelPoints','blackHoleTravelPoints','allTimeLightYearsPoints'], 999999999)); },
        run: function() { return withBatch(this._patch); }
    },

    MaxSupernovaRuns: {
        label: 'Max Supernova Stats', group: 'Prestige',
        _patch: function() {
            applyPatch(patchFromKeys(['supernovaUnlocked','tripleCosmicDustSupernovaTab','shieldDecreaseSupernovaTab','reduceCorrosiveDamageSupernovaTab','enemyStunShotsDisabledSupernovaTab'], true));
            applyPatch({ supernovaEssenceCount: 99999 });
        },
        run: function() { return withBatch(this._patch); }
    },

    MaxBlackHoleStats: {
        label: 'Max Black Hole Stats', group: 'Prestige',
        _patch: function() {
            applyPatch(patchFromKeys(['blackHoleTravelCount','blackHoleTravelPoints'], 999999999));
            applyPatch(patchFromKeys(['keepLevelsBlackMatter','areaSkipBlackMatter','armyBlackMatter','bossDelayBlackMatter','itemsDropRarityBlackMatter','timeSkipBlackMatter'], true));
        },
        run: function() { return withBatch(this._patch); }
    },

    RunAll: {
        label: 'RUN ALL COMMANDS', group: 'Utility',
        run: async function() {
            var skip = { RunAll: true, DownloadUserData: true };
            uiSetStatus('Loading save data...', '#ffeb3b');
            await beginBatch();
            var keys = Object.keys(COMMANDS);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (skip[key] || !COMMANDS[key]._patch) continue;
                uiSetStatus('Patching: ' + key, '#ffeb3b');
                COMMANDS[key]._patch();
            }
            uiSetStatus('Saving...', '#ffeb3b');
            await flushPatch();
        }
    },

    DownloadUserData: {
        label: 'Download Save Data (.txt)', group: 'Utility',
        run: async function() {
            var users = await loadAllUsers();
            var output = '';
            for (var i = 0; i < users.length; i++) {
                var userData = await loadUser(users[i]);
                if (userData) output += 'User Data for ' + users[i] + ':\n' + JSON.stringify(userData, null, 2) + '\n\n';
            }
            if (output) {
                var blob = new Blob([output], { type: 'text/plain' });
                var link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'userData.txt';
                link.click();
                console.log('[SaveEditor] Downloaded.');
            }
        }
    }
};

// ============================================================
//  CMD ENTRY POINT
// ============================================================

async function cmd(command) {
    var entry = COMMANDS[command];
    if (!entry) {
        console.error('[SaveEditor] Unknown command: "' + command + '"');
        console.log('[SaveEditor] Available: ' + Object.keys(COMMANDS).join(', '));
        return;
    }
    try {
        console.log('[SaveEditor] Running: ' + command);
        await entry.run();
        console.log('[SaveEditor] Done: ' + command);
        uiSetStatus(command + ' done!', '#4caf50');
    } catch (err) {
        console.error('[SaveEditor] Failed: ' + command, err);
        uiSetStatus(command + ' FAILED - check console', '#f44336');
    }
}

// ============================================================
//  FLOATING UI PANEL
// ============================================================

function uiSetStatus(msg, color) {
    var el = document.getElementById('__se_status');
    if (el) { el.textContent = msg; el.style.color = color || '#fff'; }
}

function injectUI() {
    if (document.getElementById('__save_editor_panel')) return;

    var GROUP_COLORS = {
        Resources:    '#1565c0',
        Player:       '#6a1b9a',
        Combat:       '#b71c1c',
        Time:         '#e65100',
        Achievements: '#f57f17',
        Prestige:     '#4a148c',
        Utility:      '#2e7d32'
    };

    var groups = {};
    var cmdKeys = Object.keys(COMMANDS);
    for (var i = 0; i < cmdKeys.length; i++) {
        var key = cmdKeys[i];
        var entry = COMMANDS[key];
        if (!entry || !entry.label) continue;
        var g = entry.group || 'Other';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ key: key, label: entry.label });
    }

    var panel = document.createElement('div');
    panel.id = '__save_editor_panel';
    Object.assign(panel.style, {
        position: 'fixed', top: '10px', right: '10px', zIndex: '999999',
        background: '#1a1a2e', border: '1px solid #444', borderRadius: '8px',
        padding: '10px', width: '240px', fontFamily: 'monospace', fontSize: '12px',
        color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
        maxHeight: '90vh', overflowY: 'auto', userSelect: 'none'
    });

    var header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '8px',
        borderBottom: '1px solid #444', paddingBottom: '6px', cursor: 'move'
    });
    header.innerHTML = '<span style="font-weight:bold;font-size:13px;">Save Editor</span>';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
        background: '#c0392b', border: 'none', color: '#fff',
        borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '11px'
    });
    closeBtn.onclick = function() { panel.remove(); };
    header.appendChild(closeBtn);
    panel.appendChild(header);

    var status = document.createElement('div');
    status.id = '__se_status';
    Object.assign(status.style, { marginBottom: '8px', minHeight: '16px', fontSize: '11px', color: '#aaa' });
    status.textContent = 'Ready.';
    panel.appendChild(status);

    var groupNames = Object.keys(groups);
    for (var gi = 0; gi < groupNames.length; gi++) {
        var groupName = groupNames[gi];
        var cmds = groups[groupName];

        var groupLabel = document.createElement('div');
        groupLabel.textContent = groupName;
        Object.assign(groupLabel.style, {
            marginTop: '8px', marginBottom: '4px',
            fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px'
        });
        panel.appendChild(groupLabel);

        for (var ci = 0; ci < cmds.length; ci++) {
            (function(cmdKey, cmdLabel) {
                var btn = document.createElement('button');
                btn.textContent = cmdLabel;
                Object.assign(btn.style, {
                    display: 'block', width: '100%', marginBottom: '3px',
                    padding: '5px 8px', background: GROUP_COLORS[groupName] || '#333',
                    color: '#fff', border: 'none', borderRadius: '4px',
                    cursor: 'pointer', textAlign: 'left', fontSize: '11px'
                });
                if (cmdKey === 'RunAll') {
                    Object.assign(btn.style, {
                        background: 'linear-gradient(135deg, #b71c1c, #4a148c)',
                        fontWeight: 'bold', fontSize: '12px',
                        padding: '7px 8px', marginTop: '4px', marginBottom: '6px',
                        border: '1px solid #ff5252'
                    });
                }
                btn.onmouseenter = function() { btn.style.opacity = '0.8'; };
                btn.onmouseleave = function() { btn.style.opacity = '1'; };
                btn.onclick = async function() {
                    btn.disabled = true;
                    btn.textContent = '...running';
                    uiSetStatus('Running: ' + cmdLabel, '#ffeb3b');
                    await cmd(cmdKey);
                    btn.disabled = false;
                    btn.textContent = cmdLabel;
                };
                panel.appendChild(btn);
            })(cmds[ci].key, cmds[ci].label);
        }
    }

    var dragging = false, ox = 0, oy = 0;
    header.onmousedown = function(e) { dragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop; };
    document.onmousemove = function(e) { if (dragging) { panel.style.left = (e.clientX - ox) + 'px'; panel.style.top = (e.clientY - oy) + 'px'; panel.style.right = 'auto'; } };
    document.onmouseup = function() { dragging = false; };

    document.body.appendChild(panel);
    console.log('[SaveEditor] Panel ready. Use cmd("CommandName") or click buttons.');
}

injectUI();
