// ── DATA ─────────────────────────────────────────────────────────
const dimensions = [
  {
    id: 'regulatory',
    name: 'Regulatory',
    icon: '📋',
    color: '#2a6e48',
    bg: '#d4ede0',
    desc: 'Licensing, permits, and government approvals',
    detail: 'This dimension assesses whether your project has the legal foundation to operate and attract finance. Incomplete permits are one of the leading causes of stalled mini-grid investment.',
    questions: [
      {
        text: 'Do you hold all required national and local licences to generate and distribute electricity?',
        options: ['Yes, all licences are in place', 'Some licences are in place, others pending', 'Applications submitted, none approved yet', 'No licences obtained yet']
      },
      {
        text: 'Is your tariff structure approved by the relevant regulatory authority?',
        options: ['Yes, formally approved', 'Under review with regulator', 'Using interim tariff pending approval', 'No regulatory engagement yet']
      },
      {
        text: 'What is the status of your land rights or site lease agreement?',
        options: ['Formalised, long-term agreement signed', 'Verbal agreement with community leaders', 'Negotiations ongoing', 'No agreement in place']
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial',
    icon: '💰',
    color: '#b45309',
    bg: '#fef3c7',
    desc: 'Revenue model, costs, and financial projections',
    detail: 'Investors need to see that your revenue model is credible and your cost structure is understood. This dimension checks whether your financial foundations are solid enough to withstand due diligence.',
    questions: [
      {
        text: 'Do you have a financial model projecting cash flows over the project lifetime?',
        options: ['Yes, detailed model reviewed by external party', 'Yes, internal model in place', 'Partial, revenue estimated, costs incomplete', 'No financial model yet']
      },
      {
        text: 'How would you describe current or projected tariff collection rates?',
        options: ['Above 90% consistently', '75-90% with documented plan to improve', '50-75% with known barriers', 'Below 50% or unknown']
      },
      {
        text: 'Do you have audited financial statements or formal bookkeeping records?',
        options: ['Yes, audited accounts available', 'Internal accounts, not audited', 'Basic records only', 'No formal financial records']
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: '⚙️',
    color: '#1a3d5c',
    bg: '#dbeafe',
    desc: 'System design, performance, and O&M capacity',
    detail: 'Technical credibility signals to investors that the project will generate reliable revenue. Poor O&M records or unvalidated load assessments are common red flags during due diligence.',
    questions: [
      {
        text: 'Has a formal load assessment been conducted by a qualified engineer?',
        options: ['Yes, by a certified third party', 'Yes, conducted internally', 'Informal estimation only', 'No load assessment completed']
      },
      {
        text: 'Do you have an operations and maintenance plan?',
        options: ['Yes, documented with trained local technician', 'Yes, documented but no dedicated technician', 'Informal arrangements in place', 'No O&M plan']
      },
      {
        text: 'Are your system performance records (generation, outages) formally documented?',
        options: ['Yes, digital records updated monthly', 'Paper records maintained', 'Some records, gaps in data', 'No performance records']
      }
    ]
  },
  {
    id: 'social',
    name: 'Social',
    icon: '🤝',
    color: '#5b21b6',
    bg: '#ede9fe',
    desc: 'Community trust, demand, and stakeholder support',
    detail: 'Social licence is increasingly important to impact investors. Projects with strong community relationships have lower default risk and higher collection rates.',
    questions: [
      {
        text: 'Has a community needs assessment or demand survey been conducted?',
        options: ['Yes, formal survey with documented results', 'Informal consultations held', 'Assumed based on existing data', 'No community engagement conducted']
      },
      {
        text: 'Do community members understand how to use and pay for the energy service?',
        options: ['Yes, structured onboarding programme in place', 'Basic information shared at launch', 'Limited awareness outside early adopters', 'No awareness effort conducted']
      },
      {
        text: 'Is there formal support from local government or community leadership?',
        options: ['Yes, formal letters or MoUs signed', 'Verbal support confirmed', 'Neutral, no opposition, no endorsement', 'Opposition or unresolved conflicts']
      }
    ]
  },
  {
    id: 'risk',
    name: 'Risk',
    icon: '🛡',
    color: '#be185d',
    bg: '#fce7f3',
    desc: 'Risk identification, mitigation, and insurance',
    detail: 'A credible risk register shows investors you understand what could go wrong and have thought through how to respond. This is often the difference between a fundable and unfundable project.',
    questions: [
      {
        text: 'Do you have a documented risk register identifying key project risks?',
        options: ['Yes, with mitigation strategies for each risk', 'Yes, risks identified but mitigations partial', 'Informally discussed, not documented', 'No risk register']
      },
      {
        text: 'Does the project have any form of insurance coverage?',
        options: ['Yes, comprehensive coverage in place', 'Partial coverage (e.g. equipment only)', 'In negotiation with providers', 'No insurance in place']
      },
      {
        text: 'Have currency or forex risks been assessed if external financing is involved?',
        options: ['Yes, with hedging or mitigation strategy', 'Acknowledged but no formal strategy', 'Not yet considered', 'Not applicable, local currency financing only']
      }
    ]
  }
];

// Scoring: answer index 0=100, 1=66, 2=33, 3=0
const answerScores = { 0: 100, 1: 66, 2: 33, 3: 0 };

let currentDim = 0;
let answers = {};

// ── SCORING HELPERS ───────────────────────────────────────────────
function dimScore(dimId) {
  const dim = dimensions.find(d => d.id === dimId);
  if (!dim) return 0;
  let total = 0, count = 0;
  dim.questions.forEach((_, i) => {
    const key = `${dimId}-${i}`;
    if (answers[key] !== undefined) { total += answerScores[answers[key]]; count++; }
  });
  return count ? Math.round(total / count) : 0;
}

function overallScore() {
  return Math.round(dimensions.reduce((a, d) => a + dimScore(d.id), 0) / dimensions.length);
}

function dimComplete(dimId) {
  const dim = dimensions.find(d => d.id === dimId);
  return dim.questions.every((_, i) => answers[`${dimId}-${i}`] !== undefined);
}

function scoreBadgeClass(s) { return s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low'; }
function scoreColor(s)      { return s >= 70 ? '#2a6e48' : s >= 40 ? '#d97706' : '#c0392b'; }
function totalDims()        { return dimensions.length; }

// ── RENDER SIDEBAR ────────────────────────────────────────────────
function renderSidebar() {
  document.getElementById('sidebar-items').innerHTML = dimensions.map((d, i) => {
    const cls = i === currentDim ? 'active' : dimComplete(d.id) ? 'done' : '';
    const dot = dimComplete(d.id) ? '✓' : i + 1;
    return `<div class="sidebar-item ${cls}">
      <div class="sidebar-dot">${dot}</div>
      ${d.name}
    </div>`;
  }).join('');
}

// ── RENDER QUESTION PAGE ──────────────────────────────────────────
function renderQuestion() {
  const dim = dimensions[currentDim];

  document.getElementById('q-dim-label').textContent =
    `Dimension ${currentDim + 1} of ${totalDims()} · ${dim.name}`;
  document.getElementById('q-title').textContent = dim.name + ' Readiness';
  document.getElementById('q-desc').textContent  = dim.desc;

  const totalQ = dimensions.reduce((a, d) => a + d.questions.length, 0);
  const doneQ  = Object.keys(answers).length;
  document.getElementById('progress-fill').style.width = Math.round((doneQ / totalQ) * 100) + '%';
  document.getElementById('q-counter').textContent = `${doneQ} of ${totalQ} answered`;

  document.getElementById('questions-list').innerHTML = dim.questions.map((q, qi) => {
    const key   = `${dim.id}-${qi}`;
    const saved = answers[key];
    return `<div class="q-item">
      <div class="q-text">${qi + 1}. ${q.text}</div>
      <div class="q-options">
        ${q.options.map((opt, oi) => `
          <label class="q-opt">
            <input type="radio" name="q-${qi}" value="${oi}" ${saved === oi ? 'checked' : ''}
              onchange="saveAnswer('${key}', ${oi})">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>`;
  }).join('');

  const nextBtn = document.getElementById('btn-next');
  nextBtn.textContent = currentDim === totalDims() - 1 ? 'View Results →' : 'Continue →';
  nextBtn.disabled = !dimComplete(dim.id);

  document.getElementById('btn-back').style.visibility = currentDim === 0 ? 'hidden' : 'visible';

  renderSidebar();
}

function saveAnswer(key, val) {
  answers[key] = val;
  const totalQ = dimensions.reduce((a, d) => a + d.questions.length, 0);
  const doneQ  = Object.keys(answers).length;
  document.getElementById('q-counter').textContent = `${doneQ} of ${totalQ} answered`;
  document.getElementById('btn-next').disabled = !dimComplete(dimensions[currentDim].id);
}

function nextDim() {
  if (currentDim < totalDims() - 1) {
    currentDim++;
    renderQuestion();
    document.querySelector('.question-main').scrollTop = 0;
  } else {
    showResults();
  }
}

function prevDim() {
  if (currentDim > 0) { currentDim--; renderQuestion(); }
}

// ── RESULTS ───────────────────────────────────────────────────────
function showResults() {
  switchScreen('screen-results');

  const overall = overallScore();

  document.getElementById('results-date').textContent =
    'Assessment completed · ' + new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Animate gauge
  const arc    = document.getElementById('gauge-arc');
  const arcLen = 220;
  setTimeout(() => {
    arc.style.strokeDashoffset = arcLen - (overall / 100) * arcLen;
    arc.style.stroke = scoreColor(overall);
    let n = 0;
    const el    = document.getElementById('gauge-score');
    const timer = setInterval(() => { n = Math.min(n + 2, overall); el.textContent = n; if (n >= overall) clearInterval(timer); }, 20);
  }, 100);

  // Verdict copy
  let verdictClass, verdictText, title, summary;
  if (overall >= 70) {
    verdictClass = 'verdict-strong'; verdictText = 'Investment Ready';
    title   = 'Strong bankability profile';
    summary = 'Your project demonstrates solid foundations across most dimensions. Focus on the areas flagged below before your next investor conversation.';
  } else if (overall >= 40) {
    verdictClass = 'verdict-moderate'; verdictText = 'Approaching Readiness';
    title   = 'Moderate bankability profile';
    summary = 'Your project has real strengths, but several gaps may raise questions during due diligence. The priority actions on the right are your clearest path to improving readiness.';
  } else {
    verdictClass = 'verdict-weak'; verdictText = 'Early Stage';
    title   = 'Significant gaps identified';
    summary = 'Your project needs to address several foundational issues before approaching most investors. Use this report to prioritise where to focus your efforts first.';
  }
  document.getElementById('gauge-verdict').className   = `gauge-verdict ${verdictClass}`;
  document.getElementById('gauge-verdict').textContent = verdictText;
  document.getElementById('gauge-title').textContent   = title;
  document.getElementById('gauge-summary').textContent = summary;

  // Side nav
  document.getElementById('results-nav-items').innerHTML =
    [{ id: 'overview', name: 'Overview' }, ...dimensions].map((d, i) => {
      if (i === 0) return `<div class="results-nav-item active" onclick="scrollToDim('overview')">${d.name}</div>`;
      const s = dimScore(d.id);
      return `<div class="results-nav-item" onclick="scrollToDim('${d.id}')">
        ${d.name}
        <span class="score-badge ${scoreBadgeClass(s)}">${s}</span>
      </div>`;
    }).join('');

  // Dimension bars
  document.getElementById('dim-bars').innerHTML = dimensions.map(d => {
    const s = dimScore(d.id);
    const c = scoreColor(s);
    return `<div class="dim-bar-row" onclick="this.classList.toggle('expanded')">
      <div class="dim-bar-top">
        <div class="dim-icon" style="background:${d.bg}">${d.icon}</div>
        <div class="dim-name">${d.name}</div>
        <div class="dim-score-num" style="color:${c}">${s}/100</div>
      </div>
      <div class="dim-track">
        <div class="dim-fill" style="width:0%;background:${c}" data-target="${s}"></div>
      </div>
      <div class="dim-detail">${d.detail}</div>
    </div>`;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.dim-fill').forEach(el => { el.style.width = el.dataset.target + '%'; });
  }, 150);

  // Priority actions - lowest scoring dims first
  const sorted    = [...dimensions].sort((a, b) => dimScore(a.id) - dimScore(b.id));
  const priorities = [
    `Address ${sorted[0].name.toLowerCase()} gaps first (score: ${dimScore(sorted[0].id)}/100)`,
    `Strengthen ${sorted[1].name.toLowerCase()} documentation (score: ${dimScore(sorted[1].id)}/100)`,
    `Review ${sorted[2].name.toLowerCase()} position before investor meetings`
  ];
  document.getElementById('priority-list').innerHTML = priorities.map(p => `
    <div class="priority-item">
      <div class="priority-dot" style="background:#2a6e48"></div>
      <span>${p}</span>
    </div>`).join('');
}

// ── SCREEN SWITCHING ──────────────────────────────────────────────
function switchScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startAssessment() {
  switchScreen('screen-question');
  renderQuestion();
}

function restart() {
  answers     = {};
  currentDim  = 0;
  switchScreen('screen-intro');
}

function scrollToDim(id) {
  if (id === 'overview') {
    document.querySelector('.results-center').scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const idx = dimensions.findIndex(d => d.id === id);
  const bars = document.querySelectorAll('.dim-bar-row');
  if (bars[idx]) bars[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── EXPORT / SHARE ────────────────────────────────────────────────
function copyLink() {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
  showToast('Link copied to clipboard');
}

function downloadPDF() {
  showToast('PDF export coming in full version');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
