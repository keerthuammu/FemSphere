import fs from 'fs';

const html = fs.readFileSync('test/ALL_40_TEST_CASES_REPORT.html', 'utf8');
const targetIds = ['TC_AUTH_01', 'TC_APP_06', 'TC_WEAR_01', 'TC_TWIN_06', 'TC_REC_03'];
const blocks = html.split(/<!--\s*TC_/);
blocks.shift();

const results = [];
for (const b of blocks) {
  const m = b.match(/Test Case ID:<\/strong>\s*(TC_[A-Z0-9_]+)/i);
  if (!m || !targetIds.includes(m[1])) continue;
  
  const tcId = m[1];
  const banner = (b.match(/<div class="banner-title">([\s\S]*?)<\/div>/i) || [])[1]?.trim() || '';
  const designedBy = (b.match(/Test Designed By:<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'KEERTHANA M';
  const designedDate = (b.match(/Test Designed Date:<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '2026-10-16';
  const priority = (b.match(/Test Priority\(Low\/Medium\/High\):<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'High';
  const moduleName = (b.match(/Module Name:<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const executedBy = (b.match(/Test Executed By\s*:\s*<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'Amal K Jose';
  const title = (b.match(/Test Title\s*:\s*<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const execDate = (b.match(/Test Execution Date:<\/strong>\s*([\s\S]*?)<\/td>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '2026-10-16';
  const desc = (b.match(/<div class="desc-cell">[\s\S]*?<strong>Description:<\/strong>\s*([\s\S]*?)<\/div>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const precond = (b.match(/<div class="precond-cell">[\s\S]*?<strong>Pre-Condition\s*:\s*<\/strong>\s*([\s\S]*?)<\/div>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const postcond = (b.match(/<div class="postcond-cell">[\s\S]*?<strong>Post-Condition:<\/strong>\s*([\s\S]*?)<\/div>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  
  const steps = [];
  const tbody = (b.match(/<tbody>([\s\S]*?)<\/tbody>/i) || [])[1] || '';
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  let rm;
  while ((rm = rowRegex.exec(tbody)) !== null) {
    const cells = [...rm[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c => c[1].replace(/<[^>]+>/g, '').trim());
    if (cells.length >= 6) {
      steps.push({
        num: cells[0],
        step: cells[1],
        data: cells[2],
        expected: cells[3],
        actual: cells[4],
        status: cells[5]
      });
    }
  }
  
  results.push({
    tcId, banner, designedBy, designedDate, priority, moduleName, executedBy, title, execDate, desc, precond, postcond, steps
  });
}

// Sort in standard order
results.sort((a,b) => targetIds.indexOf(a.tcId) - targetIds.indexOf(b.tcId));
fs.writeFileSync('test/five_vital_cases_parsed.json', JSON.stringify(results, null, 2));
console.log('Successfully saved', results.length, 'parsed test cases.');
