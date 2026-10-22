import fs from 'fs';

const html1 = fs.readFileSync('./test/ALL_40_TEST_CASES_REPORT.html', 'utf8');
const idMatches1 = [...html1.matchAll(/Test Case ID:<\/strong>\s*(TC_[A-Z0-9_]+)/gi)].map(m => m[1]);
const titleMatches1 = [...html1.matchAll(/Test Title:<\/strong>\s*([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

console.log(`ALL_40_TEST_CASES_REPORT.html (${idMatches1.length} test records):`);
idMatches1.forEach((id, i) => console.log(`  ${i+1}. ${id} -> ${titleMatches1[i]}`));

const html2 = fs.readFileSync('./test/STEP_LOG_EXECUTION_REPORT.html', 'utf8');
const idMatches2 = [...html2.matchAll(/data-tc="([a-z0-9_]+)"/gi)].map(m => m[1].toUpperCase());
const titleMatches2 = [...html2.matchAll(/class="summary-module">([\s\S]*?)<\/span>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

console.log(`\nSTEP_LOG_EXECUTION_REPORT.html (${idMatches2.length} test records):`);
idMatches2.forEach((id, i) => console.log(`  ${i+1}. ${id} -> ${titleMatches2[i]}`));
