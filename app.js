(() => {
  'use strict';

  // Vmail Terran mirror: intentionally no authentication backend.
  // Form values are never transmitted, stored, logged, or evaluated.
  console.log('%cTERRAN NOTICE', 'color:#39d6ff;font-weight:bold;font-size:18px');
  console.log('You are examining a Veydran communications node. Your curiosity has been noted.');
  console.log('No Earth credentials are stored or transmitted by this site.');

  const loginForm = document.getElementById('loginForm');
  const loginResult = document.getElementById('loginResult');
  const puzzlePanel = document.getElementById('puzzlePanel');
  const puzzleForm = document.getElementById('puzzleForm');
  const puzzleResult = document.getElementById('puzzleResult');
  const requestAccount = document.getElementById('requestAccount');
  const recover = document.getElementById('recover');
  const toast = document.getElementById('toast');

  const failures = [
    'AUTHORIZATION DENIED // BIOLOGICAL SIGNATURE NOT PRESENT IN IMPERIAL DIRECTORY.',
    'HANDSHAKE REJECTED // TERRAN CRYPTOGRAPHIC ENTROPY BELOW MINIMUM THRESHOLD.',
    'IDENTITY FAILURE // CARDIAC ORGAN COUNT DOES NOT MATCH VEYDRAN BASELINE.',
    'ACCESS REFUSED // LOCAL SPECIES CLASSIFICATION: UNVERIFIED MEAT SACK.',
    'CREDENTIALS INVALID // REQUEST FORWARDED TO AUTOMATED SUSPICION ENGINE.'
  ];

  let loginAttempts = 0;
  let puzzleAttempts = 0;

  function showResult(el, text) {
    el.textContent = text;
    el.classList.add('active');
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove('hidden');
    window.setTimeout(() => toast.classList.add('hidden'), 5000);
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginAttempts += 1;
    // Clear immediately; no values are inspected.
    loginForm.reset();
    const msg = failures[(loginAttempts - 1) % failures.length];
    showResult(loginResult, msg + (loginAttempts >= 3 ? ' // REPEATED ACCESS ATTEMPTS HAVE BEEN CATALOGUED.' : ''));
  });

  requestAccount.addEventListener('click', () => {
    puzzlePanel.classList.remove('hidden');
    puzzlePanel.setAttribute('aria-hidden', 'false');
    puzzlePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  recover.addEventListener('click', () => {
    showToast('CIPHER RECOVERY REQUIRES VERIFICATION BY BROOD-MOTHER, COMMANDING OFFICER, OR SURVIVING CLONE.');
  });

  puzzleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    puzzleAttempts += 1;
    puzzleForm.reset();
    const stages = [
      'SEQUENCE REJECTED // CHECKSUM A CONFLICTS WITH CHECKSUM B.',
      'SEQUENCE REJECTED // CHECKSUM B AGREES WITH CHECKSUM A. THIS IS PROHIBITED.',
      'SEQUENCE REJECTED // GLYPH PRESENCE DETECTED.',
      'ASSESSMENT FAILED // CRYPTOGRAPHIC COMPETENCY REMAINS UNPROVEN.'
    ];
    showResult(puzzleResult, stages[Math.min(puzzleAttempts - 1, stages.length - 1)]);
  });
})();
