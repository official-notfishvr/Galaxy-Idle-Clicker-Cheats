# Galaxy Idle Clicker - Save Editor

A save editor for Galaxy Idle Clicker with a floating in-game UI panel and console commands.

> **Warning:** This game has online leaderboard features. Block the game's internet access via your firewall before using cheats to avoid any issues.

---

## Setup

### 1. Enable Remote Debugging

Right-click **Galaxy Idle Clicker** in Steam → Properties → General → Launch Options, and paste:

```
GalaxyIdleClicker.exe --remote-allow-origins=* --remote-debugging-port=1234
```

Launch the game.

### 2. Open the Debug Interface

Open Chrome and go to:
```
http://localhost:1234
```

Click the **Galaxy Idle Clicker** debug target. The DevTools panel should open automatically on the right.

### 3. Load the Script (one-time setup)

The easiest way — save it as a **Chrome Snippet** so you never paste again:

1. In DevTools, go to **Sources** → **Snippets** (left sidebar)
2. Click **+ New snippet**
3. Paste the contents of [Edit User Data_cmd.js](https://raw.githubusercontent.com/official-notfishvr/Galaxy-Idle-Clicker-Cheats/refs/heads/main/Edit%20User%20Data_cmd.js)
4. Press `Ctrl+S` to save, give it a name
5. From now on: just press `Ctrl+Enter` (or right-click → Run) to load the panel

A floating cheat panel will appear in the game window with all commands as clickable buttons.

---

## How It Works

This is a **save editor** — it modifies your save file directly, not the running game. Changes only take effect after restarting the game.

**Workflow:**

1. Launch the game
2. Go to `http://localhost:1234` in Chrome
3. Run the snippet (Ctrl+Enter) — the cheat panel appears
4. **Save your game in-game** first (to not lose progress)
5. Click the commands you want in the panel
6. **Quit without saving** — ALT+F4 or close the window
7. Relaunch the game — your changes are now active

> After quitting, the browser tab will show an error. That's normal. Go back, refresh (F5), and click the debug target again.

---

## Commands

All commands are available as buttons in the floating panel, grouped by category. You can also call them from the console:

```js
cmd("CommandName")
```

| Command | Description |
|---|---|
| **Resources** | |
| `MaxAllResources` | Max junk, plasma, energy, garbage, scrap, prisoners, citizens, colons, quarks, antimatter, cosmic dust |
| `MaxMultipliers` | Max all supernova tab multipliers |
| `MaxExtraCosmicDustLevels` | Max cosmic dust level multipliers |
| `MaxExtraArmyTabLevels` | Max army tab multipliers (capped at 1999 to avoid crashes) |
| `MaxMeteorite` | Max meteorite and minerals counts |
| `MaxRadiations` | Max radiation counts |
| `MaxSpecialMeteorites` | Max diamond, gold, satellite, amethyst meteorites |
| `MaxAntimatter` | Max antimatter counts |
| `MaxCosmicDust` | Max cosmic dust counts |
| `MaxQuarks` | Max quark counts |
| `MaxScrap` | Max scrap counts |
| **Player** | |
| `MaxLevels` | Max level and skill points (99999) |
| `MaxDifficultyUnlocks` | Unlock normal, hard, and hell difficulties |
| `ActivateAllBuffs` | Activate all buff flags |
| `MaxPotionTimers` | Set all potion timers to 300 days |
| `MaxShipStats` | Max ship HP, shield, bullet damage, upgrade levels |
| `MaxMechTokens` | Max mech tokens and supernova overclock tokens |
| `CompleteMechMissions` | Complete all mech upgrade missions (mechs 1-4) |
| `MaxAutoUpgrades` | Unlock all auto-buy, auto-play, homing, turrets, clone ship features |
| `MaxTurretsLevel` | Max turrets level |
| **Combat** | |
| `CompleteAllMechs` | Max total ships killed and kills per second |
| `CompleteAllMechs2` | Max all 80 individual enemies killed counters |
| `MaxShotUpgrades` | Max all shot upgrade counts |
| `MaxMechMultipliers` | Max mech and buff multipliers |
| `MaxPlanets` | Max planets completed count |
| **Time** | |
| `MaxTimeWarps` | Max all time warp counts (9999 each) |
| `MaxOfflineTime` | Set offline time to 1 day ago (max offline bonus) |
| `MaxStartGameTime` | Set LY run start to 5 days ago (max x25 bonus) |
| `MaxBlackHoleTime` | Set black hole timer to 5 days ago |
| **Achievements** | |
| `MaxAllAchievements` | Max all 23 achievement categories |
| `MaxAllPoints` | Max all point types (kills, levels, travel, BH, items, etc.) |
| **Prestige** | |
| `MaxSupernovaRuns` | Unlock supernova and max essence/tokens |
| `MaxBlackHoleStats` | Max BH travel count, points, and unlock all BH passives |
| **Utility** | |
| `RunAll` | Run every command above in sequence |
| `DownloadUserData` | Download your full save as `userData.txt` |

---

## Manual Edits

For anything not covered by a command, download your save first, find the key in the txt file, then use:

```js
EditValue("keyName", value)
```

**Useful examples:**

```js
// Offline bonus time (1 day ago = max bonus)
EditValue("offlineTime", Date.now() - 86400000)

// LY run start time (5 days ago = max x25 bonus)
EditValue("startGameTime", Date.now() - 86400000 * 5)

// Black hole timer
EditValue("blackHoleTime", Date.now() - 86400000 * 5)

// Special meteorite counts
EditValue("specialMeteoriteCount", { diamond: 199990, gold: 749990, satellite: 19999, amethyst: 49999 })

// Single potion timer (300 days in ms)
EditValue("damagePotionTimer", 25920000000)
```

> For potion timers, only set timers for potions you have already unlocked.

---

## Finding More Keys

Run `cmd("DownloadUserData")` to get your full save as a txt file. Open it in any text editor and search for the variable name you want to change — the dev named everything clearly so it's usually obvious. Then use `EditValue("keyName", newValue)` to change it.
