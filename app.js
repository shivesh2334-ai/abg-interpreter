const $ = id => document.getElementById(id);
const num = id => { const v = parseFloat($(id).value); return isNaN(v) ? null : v; };
const r1 = x => Math.round(x * 10) / 10;
const NAMES = { racid: 'respiratory acidosis', ralk: 'respiratory alkalosis', metacid: 'metabolic acidosis', metalk: 'metabolic alkalosis' };

const EXAMPLES = {
  dka:   { ph: 7.15, pco2: 22, hco3: 8, na: 138, cl: 100, tm: 'unknown' },
  copd:  { ph: 7.32, pco2: 70, hco3: 35, na: 140, cl: 98, tm: 'chronic' },
  vomit: { ph: 7.52, pco2: 48, hco3: 38, na: 138, cl: 90, tm: 'unknown' },
  asa:   { ph: 7.45, pco2: 20, hco3: 14, na: 140, cl: 100, tm: 'acute' }
};

// Differentials and the clinical findings that support each one
const DX = {
  AGMA: { title: 'Elevated anion gap metabolic acidosis', items: [
    ['Diabetic ketoacidosis', ['Known diabetes or missed insulin', 'Polyuria and polydipsia', 'Very high glucose', 'Ketones in blood or urine', 'Deep rapid (Kussmaul) breathing', 'Abdominal pain, nausea or vomiting']],
    ['Lactic acidosis', ['Hypotension or shock', 'Signs of sepsis or infection', 'Cool, mottled skin (poor perfusion)', 'Elevated lactate', 'Recent seizure, bowel ischemia or cardiac arrest', 'Metformin use or liver failure']],
    ['Uremia / renal failure', ['Raised creatinine and BUN', 'Oliguria or anuria', 'History of chronic kidney disease', 'Confusion, pericardial rub or asterixis']],
    ['Alcoholic or starvation ketoacidosis', ['Heavy alcohol use', 'Poor oral intake for days', 'Vomiting', 'Normal or low glucose', 'Ketones present']],
    ['Toxic alcohol (methanol, ethylene glycol)', ['Ingestion history or intoxicated appearance', 'Osmolal gap above 10', 'Visual disturbance', 'Acute kidney injury or oxalate crystals in urine', 'Flank pain or hypocalcemia']],
    ['Salicylate toxicity', ['Aspirin or salicylate ingestion', 'Tinnitus', 'Rapid breathing (respiratory alkalosis component)', 'Fever or sweating', 'Nausea and vomiting']],
    ['Isoniazid or paraldehyde', ['Taking isoniazid or overdose', 'Seizures', 'Sedative or paraldehyde use']]
  ]},
  NAGMA: { title: 'Normal anion gap (hyperchloremic) metabolic acidosis', items: [
    ['GI bicarbonate loss', ['Diarrhea', 'Ileostomy, proximal colostomy or ureteral diversion', 'Low potassium']],
    ['Renal tubular acidosis', ['Low potassium', 'Kidney stones or nephrocalcinosis', 'Urine pH above 5.5 despite acidosis', 'Autoimmune disease or hyperkalemia (type 4)']],
    ['Drug-induced (acetazolamide, aldosterone inhibitors)', ['Taking acetazolamide', 'Taking spironolactone, ACE inhibitor or trimethoprim', 'Hyperkalemia']],
    ['Saline load or TPN', ['Large-volume normal saline', 'On total parenteral nutrition']],
    ['Kidney disease (ATN, CKD)', ['Reduced GFR or raised creatinine', 'Hyperkalemia', 'Recent AKI insult']]
  ]},
  METALK: { title: 'Metabolic alkalosis', items: [
    ['Vomiting or gastric suction (chloride-responsive)', ['Vomiting or NG suction', 'Volume depletion or orthostasis', 'Urine chloride below 20 mEq/L', 'Low potassium']],
    ['Diuretic use (chloride-responsive)', ['On loop or thiazide diuretics', 'Volume depletion', 'Low potassium']],
    ['Post-hypercapnia', ['Recent chronic CO2 retention', 'Recently started mechanical ventilation']],
    ['Edematous states (heart failure, cirrhosis, nephrotic)', ['Peripheral edema or ascites', 'Known heart failure, cirrhosis or nephrotic syndrome', 'On diuretics']],
    ['Mineralocorticoid excess (aldosteronism, Cushing, steroids)', ['Hypertension', 'Severe hypokalemia', 'Cushingoid features or steroid use', 'Urine chloride above 20 mEq/L']],
    ['Bicarbonate administration', ['Recent IV or oral bicarbonate or citrate', 'Massive transfusion']],
    ['Renal artery stenosis', ['Resistant hypertension', 'Abdominal bruit', 'High renin']]
  ]},
  RACID: { title: 'Respiratory acidosis', items: [
    ['COPD or asthma', ['Smoker or known COPD/asthma', 'Wheeze and prolonged expiration', 'Barrel chest or accessory muscle use', 'Productive cough or recent exacerbation']],
    ['CNS depression', ['Opioid or sedative use', 'Reduced consciousness', 'Slow, shallow breathing', 'Pinpoint pupils or head injury']],
    ['Neuromuscular weakness', ['Progressive limb or bulbar weakness', 'Guillain-Barre, myasthenia or ALS', 'Poor cough, weak sniff', 'Low forced vital capacity']],
    ['Sleep-disordered breathing (OSA/OHS)', ['Obesity', 'Snoring or witnessed apneas', 'Daytime sleepiness', 'Morning headache']],
    ['Upper airway obstruction', ['Stridor', 'Choking or foreign body', 'Angioedema or neck swelling']],
    ['Restrictive chest wall or lung disease', ['Kyphoscoliosis or chest wall deformity', 'Flail chest or rib fractures', 'Large pleural effusion or pneumothorax']],
    ['Increased CO2 production', ['Fever, rigors or seizures', 'Malignant hyperthermia risk', 'High carbohydrate feeding']],
    ['Ventilator settings too low', ['Patient on mechanical ventilation', 'Low minute ventilation set']]
  ]},
  RALK: { title: 'Respiratory alkalosis', items: [
    ['Anxiety, pain or fear', ['Anxious, tingling around mouth or hands', 'Acute pain', 'Normal oxygen saturation']],
    ['Hypoxemia', ['Low SpO2 or PaO2', 'High altitude or low FiO2', 'Severe anemia', 'Underlying lung disease']],
    ['Pulmonary embolism', ['Pleuritic chest pain or hemoptysis', 'Recent surgery, immobility, cancer or DVT', 'Tachycardia', 'Sudden dyspnea']],
    ['Pneumonia, pulmonary edema, pneumothorax', ['Cough, fever or crackles', 'Orthopnea or leg edema', 'Sudden pleuritic pain, reduced breath sounds', 'Pleural effusion']],
    ['CNS stimulation', ['Stroke, head trauma, tumor or infection', 'Fever', 'Neurological deficit']],
    ['Salicylates or other drugs', ['Aspirin ingestion', 'Tinnitus', 'Catecholamines, progestins or medroxyprogesterone']],
    ['Sepsis, liver disease, pregnancy, hyperthyroidism', ['Infection signs or hypotension', 'Cirrhosis stigmata', 'Pregnancy', 'Tremor, weight loss or goiter']],
    ['Ventilator settings too high', ['Patient on mechanical ventilation', 'High minute ventilation set']]
  ]}
};

function analyze(v) {
  const steps = [], dis = new Set(), groups = new Set(), notes = [];
  const { ph, pco2, hco3 } = v;
  const add = (title, status, label, text) => steps.push({ title, status, label, text });

  // Step 1
  const hCalc = 24 * pco2 / hco3, hExp = Math.pow(10, 9 - ph), dev = Math.abs(hCalc - hExp) / hExp;
  const valid = dev <= 0.1;
  add('Step 1. Internal consistency', valid ? 'ok' : 'bad', valid ? 'Consistent' : 'Inconsistent',
    `Henderson-Hasselbalch: [H+] = 24 × PaCO₂ / HCO₃⁻ = 24 × ${pco2} / ${hco3} = ${r1(hCalc)} nmol/L. A pH of ${ph} corresponds to about ${r1(hExp)} nmol/L. ` +
    (valid ? 'The values agree within 10%, so the gas is internally consistent.' : `They differ by ${Math.round(dev * 100)}%. The ABG is probably not valid: recheck the entered values or the sample.`));

  // Step 2
  const state = ph < 7.35 ? 'acidemia' : ph > 7.45 ? 'alkalemia' : 'normal';
  add('Step 2. Acidemia or alkalemia?', state === 'normal' ? 'info' : 'warn', state === 'normal' ? 'pH normal' : state[0].toUpperCase() + state.slice(1),
    state === 'normal' ? `pH ${ph} is within 7.35 to 7.45. An acidosis or alkalosis can still be present, or two opposing disorders may cancel out, so PaCO₂, HCO₃⁻ and the anion gap are checked below.`
      : `pH ${ph} is ${state === 'acidemia' ? 'below 7.35' : 'above 7.45'}, which means ${state}. This usually reflects the primary disorder.`);

  // Step 3
  const side = ph < 7.35 ? 'acid' : ph > 7.45 ? 'alk' : (ph < 7.40 ? 'acid' : 'alk');
  const pAbn = pco2 > 45 ? 'acid' : pco2 < 35 ? 'alk' : null, hAbn = hco3 < 22 ? 'acid' : hco3 > 26 ? 'alk' : null;
  let resp = side === 'acid' ? pco2 > 40 : pco2 < 40, met = side === 'acid' ? hco3 < 24 : hco3 > 24;
  if (state === 'normal') { if (!pAbn && !hAbn) resp = met = false; else if (!resp && !met) { resp = !!pAbn; met = !!hAbn; } }
  let primary = [];
  if (resp) primary.push(side === 'acid' ? 'racid' : 'ralk');
  if (met) primary.push(side === 'acid' ? 'metacid' : 'metalk');
  const dirTxt = `pH is ${ph < 7.40 ? 'low' : 'high'} and PaCO₂ is ${pco2 > 40 ? 'high' : pco2 < 40 ? 'low' : 'normal'} (${pco2} mmHg); HCO₃⁻ is ${hco3 < 24 ? 'low' : hco3 > 24 ? 'high' : 'normal'} (${hco3} mEq/L). Respiratory disorders move pH and PaCO₂ in opposite directions; metabolic disorders move them in the same direction.`;
  if (!primary.length) add('Step 3. Respiratory or metabolic?', 'ok', 'No primary disorder', dirTxt + ' No primary acid-base disturbance is evident from pH, PaCO₂ and HCO₃⁻. A hidden anion gap disorder is still checked below.');
  else if (primary.length === 2) add('Step 3. Respiratory or metabolic?', 'bad', 'Mixed disorder', dirTxt + ` Both PaCO₂ and HCO₃⁻ push pH the same way: combined ${NAMES[primary[0]]} and ${NAMES[primary[1]]}.`);
  else add('Step 3. Respiratory or metabolic?', 'warn', 'Primary ' + NAMES[primary[0]], dirTxt + ` The pattern indicates a primary ${NAMES[primary[0]]}.`);
  primary.forEach(p => dis.add(p));

  // Step 4
  const tm = v.tm;
  if (primary.length === 1) {
    const p = primary[0]; let txt = '', status = 'ok', label = 'Appropriate';
    if (p === 'metacid') {
      const e = 1.5 * hco3 + 8, d = pco2 - e;
      txt = `Expected PaCO₂ = 1.5 × ${hco3} + 8 = ${r1(e)} ± 2 (range ${r1(e - 2)} to ${r1(e + 2)}). Observed ${pco2}.`;
      if (d > 2) { dis.add('racid'); status = 'bad'; label = 'Extra respiratory acidosis'; txt += ' PaCO₂ is higher than expected: inadequate respiratory compensation, meaning a concurrent respiratory acidosis.'; }
      else if (d < -2) { dis.add('ralk'); status = 'bad'; label = 'Extra respiratory alkalosis'; txt += ' PaCO₂ is lower than expected: a concurrent respiratory alkalosis.'; }
      else txt += ' Compensation is appropriate.';
    } else if (p === 'metalk') {
      const e = 40 + 0.6 * (hco3 - 24), d = pco2 - e;
      txt = `Expected PaCO₂ = 40 + 0.6 × (${hco3} − 24) = ${r1(e)} (tolerance of ±3 assumed). Observed ${pco2}.`;
      if (d > 3) { dis.add('racid'); status = 'bad'; label = 'Extra respiratory acidosis'; txt += ' PaCO₂ is higher than expected: a concurrent respiratory acidosis.'; }
      else if (d < -3) { dis.add('ralk'); status = 'bad'; label = 'Extra respiratory alkalosis'; txt += ' PaCO₂ is lower than expected: a concurrent respiratory alkalosis.'; }
      else txt += ' Compensation is appropriate.';
    } else {
      const dP = Math.abs(pco2 - 40), acid = p === 'racid';
      const ac = acid ? [24 + dP / 10 - 3, 24 + dP / 10 + 3] : [24 - 2 * dP / 10 - 3, 24 - 2 * dP / 10 + 3];
      const ch = acid ? [24 + 3.5 * dP / 10 - 3, 24 + 3.5 * dP / 10 + 3] : [24 - 7 * dP / 10 - 2, 24 - 5 * dP / 10 + 2];
      const inR = r => hco3 >= r[0] && hco3 <= r[1];
      txt = `PaCO₂ differs from 40 by ${r1(dP)}. Expected HCO₃⁻: acute ${r1(ac[0])} to ${r1(ac[1])}; chronic ${r1(ch[0])} to ${r1(ch[1])}. Observed ${hco3}.`;
      const hiEdge = acid ? Math.max(ac[1], ch[1]) : ac[1], loEdge = acid ? ac[0] : ch[0];
      let cls;
      if (tm === 'acute') cls = inR(ac) ? 'acute' : hco3 > ac[1] ? 'high' : 'low';
      else if (tm === 'chronic') cls = inR(ch) ? 'chronic' : (acid ? hco3 > ch[1] : hco3 > ac[1]) ? 'high' : 'low';
      else cls = inR(ac) ? 'acute' : inR(ch) ? 'chronic' : (hco3 > Math.min(ac[1], ch[1]) && hco3 < Math.max(ac[0], ch[0])) ? 'sub' : hco3 > hiEdge ? 'high' : 'low';
      if (cls === 'acute' || cls === 'chronic') txt += ` Fits an ${cls} ${NAMES[p]} with appropriate compensation.` + (tm === 'unknown' ? ' Timing was inferred from HCO₃⁻; confirm it clinically.' : '');
      else if (cls === 'sub') { status = 'info'; label = 'Subacute'; txt += ' HCO₃⁻ falls between the acute and chronic ranges: partial compensation, likely subacute.'; }
      else if (cls === 'high') { dis.add('metalk'); status = 'bad'; label = 'Extra metabolic alkalosis'; txt += ' HCO₃⁻ is higher than expected: a concurrent metabolic alkalosis.'; }
      else { dis.add('metacid'); status = 'bad'; label = 'Extra metabolic acidosis'; txt += ' HCO₃⁻ is lower than expected: a concurrent metabolic acidosis.'; }
      if (cls === 'acute' || cls === 'chronic') label = 'Appropriate (' + cls + ')';
    }
    add('Step 4. Compensation', status, label, txt + ' Compensation usually does not return pH fully to normal.');
  } else add('Step 4. Compensation', primary.length ? 'warn' : 'info', 'Not applicable', primary.length ? 'With two primary disorders, expected-compensation formulas cannot be applied. Interpret the combined pattern as shown in Step 3.' : 'No primary disorder to compensate.');

  // Step 5 and 6
  let ag = null, base = 12, elevated = false;
  if (v.na != null && v.cl != null) {
    ag = v.na - (v.cl + hco3);
    if (v.alb != null && v.alb < 4) base = 12 - 2.5 * (4 - v.alb);
    elevated = ag > base + 2;
    let t = `AG = Na − (Cl + HCO₃⁻) = ${v.na} − (${v.cl} + ${hco3}) = ${r1(ag)} mEq/L. Normal is about 12 ± 2` +
      (base !== 12 ? `; adjusted for albumin ${v.alb} g/dL the expected normal is about ${r1(base)} ± 2.` : '.');
    t += elevated ? ' The gap is elevated: an anion gap metabolic acidosis is present, even if pH looks normal.' : ' The gap is not elevated.';
    if (elevated) dis.add('metacid');
    if (v.osm != null && v.glu != null && v.bun != null) {
      const calc = 2 * v.na + v.glu / 18 + v.bun / 2.8, og = v.osm - calc;
      t += ` Osmolal gap = ${v.osm} − ${r1(calc)} = ${r1(og)} (normal below 10). ` + (og >= 10 ? 'Elevated: consider toxic alcohols (methanol, ethylene glycol), ethanol, or an unmeasured osmole.' : 'Normal.');
    } else if (elevated) t += ' If the cause is not obvious (DKA, lactic acidosis, renal failure) or a toxic ingestion is suspected, add glucose, BUN and measured osmolality to calculate the osmolal gap.';
    add('Step 5. Anion gap', elevated ? 'bad' : 'ok', elevated ? 'Elevated' : 'Normal', t);
    if (elevated) {
      groups.add('AGMA');
      const dAG = ag - base, dH = 24 - hco3;
      if (dH <= 0) { dis.add('metalk'); add('Step 6. Delta ratio', 'bad', 'Concurrent metabolic alkalosis', `ΔAG = ${r1(dAG)} but HCO₃⁻ (${hco3}) has not fallen below 24. A raised gap without a matching fall in bicarbonate suggests a concurrent metabolic alkalosis.`); }
      else {
        const ratio = dAG / dH;
        let s = 'ok', l = 'Uncomplicated AG acidosis', x = 'This is within 1.0 to 2.0: an uncomplicated anion gap metabolic acidosis.';
        if (ratio < 1) { groups.add('NAGMA'); s = 'bad'; l = 'Plus non-AG acidosis'; x = 'Below 1.0: a concurrent non-anion gap metabolic acidosis is likely.'; }
        else if (ratio > 2) { dis.add('metalk'); s = 'bad'; l = 'Plus metabolic alkalosis'; x = 'Above 2.0: a concurrent metabolic alkalosis is likely.'; }
        add('Step 6. Delta ratio', s, l, `ΔAG/ΔHCO₃⁻ = ${r1(dAG)} / ${r1(dH)} = ${r1(ratio)}. ${x}`);
      }
    } else add('Step 6. Delta ratio', 'info', 'Not needed', 'The anion gap is not elevated, so the ΔAG/ΔHCO₃⁻ ratio is not calculated.');
    if (dis.has('metacid') && !elevated) groups.add('NAGMA');
  } else {
    add('Step 5. Anion gap', 'info', 'Na⁺ and Cl⁻ needed', 'Enter Na⁺ and Cl⁻ to calculate the anion gap. It is most important when a metabolic acidosis is present, and can uncover a hidden one when pH is normal.');
    add('Step 6. Delta ratio', 'info', 'Needs anion gap', 'The delta ratio requires an elevated anion gap.');
    if (dis.has('metacid')) groups.add('NAGMA'), groups.add('AGMA');
  }
  if (dis.has('metalk')) groups.add('METALK');
  if (dis.has('racid')) groups.add('RACID');
  if (dis.has('ralk')) groups.add('RALK');

  // Summary
  const list = [...dis].map(k => NAMES[k]);
  let sum = [];
  if (!valid) sum.push('The gas is internally inconsistent, so treat this interpretation with caution.');
  if (!list.length && !elevated) sum.push('No acid-base disorder is identified from these values.');
  else {
    sum.push(`${state === 'normal' ? 'pH is normal' : 'Patient has ' + state}${primary.length === 1 ? ', with a primary ' + NAMES[primary[0]] : ''}.`);
    const extra = list.filter(n => !(primary.length === 1 && n === NAMES[primary[0]]));
    if (primary.length === 2 || !primary.length) sum.push('Disorders identified: ' + list.join(', ') + '.');
    else if (extra.length) sum.push('Additional disorder(s): ' + extra.join(', ') + ', so this is a mixed acid-base disturbance.');
    else sum.push('Compensation is appropriate: a simple disorder.');
  }
  if (ag != null) sum.push(`Anion gap ${r1(ag)} (${elevated ? 'elevated' : 'normal'}).`);
  return { steps, sum, groups: [...['AGMA', 'NAGMA', 'METALK', 'RACID', 'RALK'].filter(g => groups.has(g))] };
}

const checked = new Set();
function renderDx(groups) {
  const el = $('dx'); el.innerHTML = '';
  if (!groups.length) { el.innerHTML = '<p class="hint">No disorder identified, so no differential is listed.</p>'; return; }
  groups.forEach(g => {
    const scored = DX[g].items.map(([name, fs]) => ({ name, fs, n: fs.filter(f => checked.has(g + '|' + name + '|' + f)).length }));
    scored.sort((a, b) => b.n / b.fs.length - a.n / a.fs.length);
    el.insertAdjacentHTML('beforeend', `<div class="grp">${DX[g].title}</div>`);
    scored.forEach(d => {
      const det = document.createElement('details'); det.className = 'dx' + (d.n ? ' hit' : ''); det.open = d.n > 0 || scored.indexOf(d) < 2;
      det.innerHTML = `<summary><span>${d.name}</span><span class="sc">${d.n} of ${d.fs.length} findings</span></summary>` +
        d.fs.map(f => { const k = g + '|' + d.name + '|' + f; return `<label><input type="checkbox" data-k="${k}" ${checked.has(k) ? 'checked' : ''}>${f}</label>`; }).join('');
      det.querySelectorAll('input').forEach(i => i.addEventListener('change', () => { i.checked ? checked.add(i.dataset.k) : checked.delete(i.dataset.k); renderDx(groups); }));
      el.appendChild(det);
    });
  });
}

function run() {
  const v = { ph: num('ph'), pco2: num('pco2'), hco3: num('hco3'), na: num('na'), cl: num('cl'), alb: num('alb'), glu: num('glu'), bun: num('bun'), osm: num('osm'), tm: $('tm').value };
  $('err').textContent = '';
  if (v.ph == null || v.pco2 == null || v.hco3 == null) { $('err').textContent = 'Enter pH, PaCO₂ and HCO₃⁻ to continue.'; return; }
  if (v.ph < 6.5 || v.ph > 8 || v.pco2 <= 0 || v.hco3 <= 0) { $('err').textContent = 'One or more values are outside a plausible range. Check the units.'; return; }
  const r = analyze(v);
  $('summary').innerHTML = '<h2>Summary interpretation</h2>' + r.sum.map(s => `<p>${s}</p>`).join('');
  $('steps').innerHTML = r.steps.map(s => `<div class="step"><h3>${s.title}<span class="pill ${s.status}">${s.label}</span></h3><p>${s.text}</p></div>`).join('');
  checked.clear(); renderDx(r.groups);
  $('out').hidden = false; $('summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('go').addEventListener('click', run);
$('reset').addEventListener('click', () => { document.querySelectorAll('input[type=number]').forEach(i => i.value = ''); $('tm').value = 'unknown'; $('out').hidden = true; $('err').textContent = ''; });
document.querySelectorAll('[data-ex]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('input[type=number]').forEach(i => i.value = '');
  const e = EXAMPLES[b.dataset.ex]; Object.keys(e).forEach(k => $(k).value = e[k]); run();
}));
document.querySelectorAll('input[type=number]').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') run(); }));
