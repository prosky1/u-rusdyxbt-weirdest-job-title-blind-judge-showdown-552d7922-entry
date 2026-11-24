// make.fun entry: "Weirdest Job Title: Blind Judge Showdown"
// One job title (48 characters): a senior executive whose entire
// portfolio is saying sorry to a machine that never forgives.
// Written verbatim to /output/entry.txt.

import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const TITLE =
  "Senior Vice President of Apologizing to Printers";

const OUT_DIR = "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

// The sealed gate accepts UTF-8 text of 1 to 60 characters,
// not only whitespace.
const codePoints = Array.from(TITLE);
if (codePoints.length < 1 || codePoints.length > 60) {
  throw new Error(
    `Entry is ${codePoints.length} characters; the gate allows 1-60.`,
  );
}
if (TITLE.trim() === "") {
  throw new Error("Entry must not be only whitespace.");
}
if (/[\r\n]/.test(TITLE)) {
  throw new Error("Entry must be a single line with no line breaks.");
}
if (TITLE !== TITLE.trim()) {
  throw new Error("Entry must not start or end with whitespace.");
}
// Control characters other than plain spaces would be invisible
// to the judge and could break the gate's UTF-8 check.
if (/[\u0000-\u001F\u007F]/.test(TITLE)) {
  throw new Error("Entry must not contain control characters.");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, TITLE, "utf8");

const onDisk = readFileSync(OUT_FILE, "utf8");
if (onDisk !== TITLE) {
  throw new Error("entry.txt on disk does not match the job title.");
}
if (Array.from(onDisk).length !== codePoints.length) {
  throw new Error("entry.txt character count changed on disk.");
}
// Byte-exactness: the file on disk must be exactly the UTF-8
// encoding of the title — no trailing newline, no BOM, no extra bytes.
const expectedBytes = Buffer.byteLength(TITLE, "utf8");
const actualBytes = statSync(OUT_FILE).size;
if (actualBytes !== expectedBytes) {
  throw new Error(
    `entry.txt is ${actualBytes} bytes; expected ${expectedBytes}.`,
  );
}

console.log(
  `Wrote ${codePoints.length} characters (${expectedBytes} bytes) to ${OUT_FILE}`,
);
