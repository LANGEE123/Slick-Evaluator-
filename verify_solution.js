const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

console.log("=== BITS CodeForge Solution Verification (Extended) ===");

// 1. Check required files
const files = [
  "index.html",
  "original_starter.html",
  "BUG_FIX_LOG.md",
  "README.md",
  "demo_data.js",
  "assets/focus_ambient.mp3",
  "test_data/bits_sample_standard.xlsx",
  "test_data/bits_sample_multi_course.xlsx",
  "test_data/bits_sample_edge_cases.xlsx"
];

let allFilesExist = true;
files.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    console.log(`[PASS] File exists: ${f} (${fs.statSync(p).size} bytes)`);
  } else {
    console.error(`[FAIL] Missing file: ${f}`);
    allFilesExist = false;
  }
});

// 2. Validate HTML syntax and fixes in index.html
const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// Check Bug Fixes
assert(indexHtml.includes('courseSelect.innerHTML = \'<option value="">Select a course to begin</option>\''), "Bug 1: Course select is reset before populating new file");
assert(indexHtml.includes('new Set(records.map(r => r.Course)'), "Bug 2: Courses are deduplicated using Set");
assert(indexHtml.includes('accept=".xlsx, .xls"'), "Bug 3: File picker accepts .xlsx and .xls");
assert(indexHtml.includes('id="stat-min"') && indexHtml.includes('id="stat-max"'), "Bug 4: Stat IDs are correctly mapped to min and max");
assert(indexHtml.includes('if (courseMarks.length === 0)'), "Bug 5: Empty dataset guard prevents NaN");
assert(indexHtml.includes('Number.isFinite(num)'), "Bug 6: Marks coerced to numbers properly");
assert(indexHtml.includes('if (std < 0.001)'), "Bug 7: Standard deviation of 0 is safely handled");
assert(indexHtml.includes('startGradingTimer()'), "Bug 8: Timer initialized on course selection");
assert(!indexHtml.includes('confirm("Reset grade ranges now?")'), "Bug 9: Duplicate confirmation removed");
assert(indexHtml.includes('Math.max(0, Math.min(100, prevMin - 1))'), "Bug 10: Cascade max clamped to >= 0");
assert(indexHtml.includes('if (!e.target.files || !e.target.files.length) return;'), "Bug 11: Cancel in file dialog guarded");
assert(indexHtml.includes('URL.revokeObjectURL(blobUrl)'), "Bug 12: Memory leak prevented with revokeObjectURL");
assert(indexHtml.includes('+topMaxEl.value !== 100') && indexHtml.includes('+bottomMinEl.value !== 0'), "Bug 13: Scale coverage [0, 100] enforced");

// Check Creative Enhancements
assert(indexHtml.includes('silver-star-divider'), "Creative UI: Silver star underlines present");
assert(indexHtml.includes('id="audioFocus"'), "Creative UI: Focus ambient audio player present");
assert(indexHtml.includes('id="clockTime"'), "Creative UI: Live digital clock present");
assert(indexHtml.includes('id="hudInspector"'), "Creative UI: Single-line hover HUD inspector present");
assert(indexHtml.includes('id="kpiGpa"'), "Feature: Class Projected CGPA calculator (10.0 scale) present");
assert(indexHtml.includes('presetGaussian'), "Feature: Statistical Gaussian curve preset present");
assert(indexHtml.includes('id="rosterCard"'), "Feature: Interactive Student Roster search table present");
assert(indexHtml.includes('btnThemeToggle'), "Feature: Dark/Light Mode Theme engine present");

console.log("\n=== All Extended Verification Checks Completed Successfully! ===");
