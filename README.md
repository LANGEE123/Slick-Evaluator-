# 🎓 BITS Pilani Digital — Advanced Grading & Moderation Console (CodeForge v1.0)

> An artisanal, bespoke, and delightful academic grading console built for university instructors and evaluators. Engineered for mathematical precision, speed, safety, and visual serenity.

[![Status](https://img.shields.io/badge/Status-Complete%20%26%20Tested-059669?style=for-the-badge)]()
[![Theme](https://img.shields.io/badge/Theme-Celestial%20Obsidian-6366f1?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-d97706?style=for-the-badge)]()

---

## 📌 Executive Summary

Built for the **BITS Digital CodeForge V1.0** challenge, this console elevates a sample prototype into a world-class academic product:
1. **Stage 1 (Debug)**: Audited and systematically resolved **13 critical bugs** (including state duplication, inverted metrics, `NaN` divide-by-zero crashes, string concatenation errors, canvas rendering crashes, and scale range coverage).
2. **Stage 2 (Reimagine & Creative Design)**:
   - **Artisanal Aesthetics**: Custom *Midnight Celestial* dark theme with starlight particle depth, *Cinzel Decorative* typography, and sparkling silver star underlines.
   - **Evaluator Serenity**: Built-in mini Focus Ambient music player with the relaxing soundscape and a real-time digital system clock.
   - **Single-Line Contextual HUD**: Instant feature inspector radar that displays single-line guidance as you hover over any control.
   - **Projected Class CGPA & Pass Rate**: Computes class GPA impact on BITS' official 10.0 scale in real time.
   - **Smart Presets**: 1-click Gaussian statistical curve ($\mu \pm \sigma$), BITS standard, and lenient presets.
   - **Interactive Student Roster**: Live searchable table by BITS ID with instant grade filter tabs.
   - **Borderline Student Radar**: Alerts the instructor of candidates within 1 mark of grade promotions.
   - **Dual Export**: Sanitized portal CSV + formatted printable PDF Academic Summary Sheet.
   - **1-Click Demo Loader**: Instant testing with realistic BITS student marks without needing a file.
3. **Stage 3 (Deploy)**: 100% self-contained static single-page app (zero build complexity, zero backend cost, deployable anywhere for free).

---

## 🎨 Unique Theme & Creative Interface Highlights

### 1. ✦ Beautiful Typography & Sparkling Silver Star Underlines
- Rendered with **Cinzel Decorative** (for an authoritative university insignia feel) and **Plus Jakarta Sans** with **JetBrains Mono** for figures.
- Below the title rests an animated silver star divider with metallic gradient lines and twinkling celestial star accents (`✦ ✧ ✦ ─── ✧ ─── ✦ ✧ ✦`).

### 2. 🎵 Built-in Focus Ambient Music Player
- Located in the header toolbar to provide evaluators and professors with a relaxing, focus-enhancing background atmosphere while grading.
- Includes Play/Pause controls, live animated soundwave bars, and track status.

### 3. 🕒 Live Digital Clock & Date
- Displays real-time `HH:MM:SS` and date directly in the interface so evaluators can track time at a glance.

### 4. 💡 Contextual Single-Line HUD Inspector
- Hovering over any button, stat card, file input, or slider instantly renders a clear, non-intrusive single-line explanation in the HUD bar.

### 5. 🎓 Projected Class CGPA & Pass Rate KPIs
- Implements BITS Pilani's official 10-point academic scale:
  $$A = 10, A^- = 9, B = 8, B^- = 7, C = 6, C^- = 5, D = 4, E = 2$$
- As boundaries are moved, the projected Class CGPA and Pass Rate update live.

### 6. ⚡ Smart Grading Presets
- **BITS Standard**: Default 80, 70, 60, 50, 40, 30, 20 cutoffs.
- **Statistical Gaussian Curve**: Automatically fits cutoffs to class Mean ($\mu$) and Standard Deviation ($\sigma$).
- **Lenient Curve**: Accommodates challenging exam distributions.

### 7. 📋 Interactive Student Roster Search & Grade Filters
- Search by student roll number or BITS ID (e.g. `2024A7PS0011P`).
- Filter by grade tabs (`All`, `A`, `A-`, `B`, etc.) to view exactly which students receive which grade in real-time.

---

## 🐛 Comprehensive Bug Fix Log (Stage 1)

| # | Bug / Issue Identified | How User Reproduced It | Root Cause | Fix Implemented | How We Tested the Fix |
|---|---|---|---|---|---|
| **1** | Course dropdown duplicates course options when uploading files sequentially | Uploaded an Excel file, then uploaded another file sequentially | `<select id="course">` options were not cleared prior to reading new file | Cleared `course.innerHTML` to default placeholder before populating new courses | Uploaded 2 files sequentially; verified course list resets cleanly |
| **2** | Course dropdown lists the same course dozens of times for each student row | Uploaded a sheet with 45 students in `CS F111` | Code iterated over every student record without deduplicating course names | Extracted unique course titles using `[...new Set(...)]` before building option elements | Uploaded 45-student sheet; verified each course appears exactly once |
| **3** | File picker filter accepts only legacy `.xls` files, blocking `.xlsx` | Clicked "Choose File" on browser file dialog; `.xlsx` files were filtered out | `<input type="file" accept=".xls">` was missing `.xlsx` extension | Updated file input attribute to `accept=".xlsx, .xls"` | Opened file selector; verified `.xlsx` files are selectable |
| **4** | Inversion of "Min" and "Max" statistics display in the DOM | Selected a course with marks ranging 25 to 98 | DOM IDs were inverted (`<b id="max">` in Min card, `<b id="min">` in Max card) | Corrected IDs to `stat-min` and `stat-max`, and mapped values accurately | Loaded test course; verified lowest score displays under Min and highest under Max |
| **5** | Statistical calculations output `NaN` and crash when course has 0 students | Selected an empty course or dataset with no student records | Division by zero (`0/0 = NaN`) and `m[0]` undefined in average/median | Added empty dataset guard clause returning clean placeholders (`—`) | Tested with empty course; verified UI displays `—` without `NaN` or console errors |
| **6** | String concatenation corrupts Average and Mean calculations | Uploaded sheet where marks were formatted as strings in Excel | JavaScript `reduce((a,b)=>a+b, 0)` treats string marks as text concatenation (`0 + "80" = "080"`) | Explicitly coerced and validated marks using `Number(val)` and `Math.round()` | Uploaded strings `"80"`, `"70"`; verified average calculated to `75.00` instead of `4035` |
| **7** | Bell curve rendering crashes when all student marks are identical | Uploaded course where every student received identical marks (e.g. 85) | When all scores are identical, $\sigma = 0$. Gaussian formula yields division by zero (`Infinity`/`NaN`) | Added check for $\sigma = 0$; if detected, renders discrete indicator line safely | Uploaded uniform score dataset; verified canvas renders without throwing errors |
| **8** | Timer starts on page load rather than active grading session, and delays first second | Opened page and waited 2 minutes before uploading; clock had 1-second lag | `gradingStartTime` initialized on script load; interval waited 1000ms before first DOM paint | Start timer on active course selection; perform immediate zero-lag first paint | Verified timer resets to `00:00` on course selection and updates smoothly every second |
| **9** | Redundant double confirmation and `TypeError` crash on "Reset Range" before course selection | Clicked "Reset Range" on page load without selecting course | Two consecutive `confirm()` calls; referenced DOM elements (`g+"min"`) do not exist yet | Replaced with clean single confirmation dialog and checked element existence before assigning values | Clicked "Reset Range" on empty load; verified no errors thrown in console |
| **10** | Cascade Max logic assigns invalid negative value (`-1`) to grade dropdown | Reduced a grade minimum boundary (e.g., `D min`) to 0 | `cascadeMaxFrom` computed `prevMin - 1 = -1`, which does not exist in options (0–100) | Clamped cascaded max bounds to `Math.max(0, Math.min(100, prevMin - 1))` | Set grade min to 0; verified subsequent max clamps cleanly at 0 |
| **11** | Uncaught `TypeError` when closing file picker dialog with "Cancel" | Opened file dialog and clicked "Cancel" | `e.target.files[0]` is undefined; `readAsBinaryString(undefined)` threw uncaught exception | Added early return check `if (!e.target.files?.length) return;` and updated to `readAsArrayBuffer` | Clicked Cancel in file dialog; verified zero console errors |
| **12** | CSV export unescaped fields cause syntax corruption and URL object memory leak | Uploaded instructor/course names containing commas; downloaded CSV repeatedly | Values concatenated without RFC 4180 quoting; `URL.revokeObjectURL` was never called | Implemented proper CSV field escaping with quotes and added `revokeObjectURL` cleanup | Exported course named `"CS F111, Comp Prog"`; opened in Excel and verified proper columns |
| **13** | Grade scale validation allows ungradable gaps at 100 and 0 | Adjusted A max to 90 and E min to 10; validation succeeded | `validateRanges` checked only adjacent bounds, failing to verify full coverage [0, 100] | Added top-bound (`A max === 100`) and bottom-bound (`E min === 0`) validation rules | Adjusted boundaries with gaps; verified validation alert highlights missing coverage |

---

## 🧪 Synthetic Test Datasets Included

Located in `test_data/`:
1. `bits_sample_standard.xlsx`: 113 students across 3 BITS courses (`CS F111`, `MATH F111`, `EEE F111`) with natural Gaussian mark distributions.
2. `bits_sample_multi_course.xlsx`: 142 students across 4 major courses.
3. `bits_sample_edge_cases.xlsx`: 15 records testing fractional marks (`80.2`), borderline marks (`79`, `69`), duplicate BITS IDs, uniform scores ($\sigma = 0$), and extremes (`0`, `100`).
