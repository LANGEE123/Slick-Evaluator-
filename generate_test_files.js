const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const testDir = path.join(__dirname, "test_data");
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Helper to generate BITS ID
function getBitsId(year, discipline, num, campus = "P") {
  return `${year}${discipline}PS${String(num).padStart(4, "0")}${campus}`;
}

// 1. Standard Dataset
const disciplines = ["A7", "A3", "AA", "A8", "A4", "A1", "B3", "B4"];
const standardRows = [];

// CS F111 (45 students)
for (let i = 1; i <= 45; i++) {
  const disc = disciplines[i % disciplines.length];
  // Normal distribution around 68
  const u1 = Math.random() || 0.1;
  const u2 = Math.random() || 0.1;
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let mark = Math.round(68 + z * 15);
  mark = Math.max(15, Math.min(98, mark));
  standardRows.push({
    "BITS ID": getBitsId(2024, disc, 100 + i),
    "Course": "CS F111",
    "Total Marks": mark
  });
}

// MATH F111 (38 students)
for (let i = 1; i <= 38; i++) {
  const disc = disciplines[(i + 2) % disciplines.length];
  const u1 = Math.random() || 0.1;
  const u2 = Math.random() || 0.1;
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let mark = Math.round(62 + z * 18);
  mark = Math.max(10, Math.min(99, mark));
  standardRows.push({
    "BITS ID": getBitsId(2024, disc, 200 + i),
    "Course": "MATH F111",
    "Total Marks": mark
  });
}

// EEE F111 (30 students)
for (let i = 1; i <= 30; i++) {
  const disc = disciplines[(i + 4) % disciplines.length];
  const u1 = Math.random() || 0.1;
  const u2 = Math.random() || 0.1;
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let mark = Math.round(71 + z * 13);
  mark = Math.max(25, Math.min(97, mark));
  standardRows.push({
    "BITS ID": getBitsId(2024, disc, 300 + i),
    "Course": "EEE F111",
    "Total Marks": mark
  });
}

const wb1 = XLSX.utils.book_new();
const ws1 = XLSX.utils.json_to_sheet(standardRows);
XLSX.utils.book_append_sheet(wb1, ws1, "Marks");
XLSX.writeFile(wb1, path.join(testDir, "bits_sample_standard.xlsx"));
console.log("Created bits_sample_standard.xlsx with", standardRows.length, "records");

// 2. Multi-course Dataset (120+ students across 4 courses)
const multiCourses = [
  "CS F211 - Data Structures",
  "ECON F211 - Principles of Economics",
  "BIO F111 - General Biology",
  "BITS F110 - Engineering Graphics"
];
const multiRows = [];
let studentCount = 1;
multiCourses.forEach((cName, cIdx) => {
  const numStudents = 28 + (cIdx * 5);
  for (let i = 0; i < numStudents; i++) {
    const disc = disciplines[(studentCount + i) % disciplines.length];
    const mark = Math.floor(Math.random() * 75) + 25; // 25 to 99
    multiRows.push({
      "BITS ID": getBitsId(2023, disc, studentCount++),
      "Course": cName,
      "Total Marks": mark
    });
  }
});

const wb2 = XLSX.utils.book_new();
const ws2 = XLSX.utils.json_to_sheet(multiRows);
XLSX.utils.book_append_sheet(wb2, ws2, "Grades");
XLSX.writeFile(wb2, path.join(testDir, "bits_sample_multi_course.xlsx"));
console.log("Created bits_sample_multi_course.xlsx with", multiRows.length, "records");

// 3. Edge Cases Dataset (Fractional, duplicate IDs, boundary tests, alternate header names)
const edgeRows = [
  // Fractional marks (testing BITS rule: round to nearest integer, e.g. 80.2 -> 81 or round)
  { "Student's BITS ID": "2024A7PS0001P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 80.2 },
  { "Student's BITS ID": "2024A7PS0002P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 69.8 },
  { "Student's BITS ID": "2024A7PS0003P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 49.5 },
  // Exact boundary scores (radar detection)
  { "Student's BITS ID": "2024A7PS0004P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 79 },
  { "Student's BITS ID": "2024A7PS0005P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 69 },
  { "Student's BITS ID": "2024A7PS0006P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 59 },
  { "Student's BITS ID": "2024A7PS0007P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 39 },
  // Duplicate student in same course (health audit)
  { "Student's BITS ID": "2024A7PS0008P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 85 },
  { "Student's BITS ID": "2024A7PS0008P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 88 },
  // Extremes
  { "Student's BITS ID": "2024A7PS0009P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 100 },
  { "Student's BITS ID": "2024A7PS0010P", "Course": "CS F111 Edge", "Total Marks (out of 100)": 0 },
  // Uniform course (all identical marks -> std dev = 0)
  { "Student's BITS ID": "2024B1PS0101P", "Course": "MATH F111 Uniform", "Total Marks (out of 100)": 85 },
  { "Student's BITS ID": "2024B1PS0102P", "Course": "MATH F111 Uniform", "Total Marks (out of 100)": 85 },
  { "Student's BITS ID": "2024B1PS0103P", "Course": "MATH F111 Uniform", "Total Marks (out of 100)": 85 },
  // Single-student course
  { "Student's BITS ID": "2024B2PS0201P", "Course": "PHY F111 Solo", "Total Marks (out of 100)": 92 }
];

const wb3 = XLSX.utils.book_new();
const ws3 = XLSX.utils.json_to_sheet(edgeRows);
XLSX.utils.book_append_sheet(wb3, ws3, "EdgeCases");
XLSX.writeFile(wb3, path.join(testDir, "bits_sample_edge_cases.xlsx"));
console.log("Created bits_sample_edge_cases.xlsx with", edgeRows.length, "records");

// Also export embedded JSON so the app can bundle it for 1-click Demo loading!
const demoExport = {
  standard: standardRows,
  edgeCases: edgeRows
};
fs.writeFileSync(path.join(__dirname, "demo_data.js"), `window.BITS_DEMO_DATA = ${JSON.stringify(demoExport, null, 2)};\n`);
console.log("Created demo_data.js with embedded datasets for 1-click loading.");
