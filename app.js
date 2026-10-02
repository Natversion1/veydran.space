(() => {
  'use strict';

  // Vmail Terran mirror: intentionally no authentication backend.
  // Credentials are never transmitted or stored. Password content is never read;
  // only its local character count is checked so the absurd Veydran rule can display.
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
  const languageToggle = document.getElementById('languageToggle');
  const captchaTiles = [...document.querySelectorAll('[data-captcha-tile]')];

  const glyphMap = {
    A:'∆', B:'β', C:'Ͼ', D:'Ð', E:'Ξ', F:'Ϝ', G:'Ǥ', H:'Ħ', I:'ɪ', J:'ʆ', K:'Ҡ', L:'Ł', M:'Ϻ',
    N:'И', O:'Θ', P:'Ƥ', Q:'Ҩ', R:'Я', S:'Ϟ', T:'Ŧ', U:'Ս', V:'Ѵ', W:'Ш', X:'Ж', Y:'Ұ', Z:'Ȥ'
  };

  const englishTitle = 'Vmail — Veydran Communications';
  function getSharedLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)vey_lang=(en|vey)(?:;|$)/);
    return match ? match[1] : 'vey';
  }

  function setSharedLanguage(value) {
    document.cookie = 'vey_lang=' + value + '; Domain=veydran.space; Path=/; Max-Age=31536000; SameSite=Lax; Secure';
  }

  let language = getSharedLanguage();
  let loginAttempts = 0;
  let puzzleAttempts = 0;

  const translatableTextNodes = [];
  const translatablePlaceholders = [];

  function toVeydran(text) {
    return [...text].map((char) => {
      const upper = char.toUpperCase();
      return glyphMap[upper] || char;
    }).join('');
  }

  function collectLanguageContent() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('[data-no-vey="true"]')) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      translatableTextNodes.push({ node, english: node.nodeValue });
    }

    document.querySelectorAll('input[placeholder]').forEach((input) => {
      translatablePlaceholders.push({ input, english: input.placeholder });
    });
  }

  function applyLanguage() {
    const veydran = language === 'vey';
    translatableTextNodes.forEach(({ node, english }) => {
      node.nodeValue = veydran ? toVeydran(english) : english;
    });
    translatablePlaceholders.forEach(({ input, english }) => {
      input.placeholder = veydran ? toVeydran(english) : english;
    });
    languageToggle.textContent = veydran ? 'ENGLISH' : 'VEYDRAN';
    document.documentElement.lang = veydran ? 'x-vey' : 'en';
    document.title = veydran ? toVeydran(englishTitle) : englishTitle;
  }

  function localise(text) {
    return language === 'vey' ? toVeydran(text) : text;
  }

  function showResult(el, text) {
    el.textContent = localise(text);
    el.classList.add('active');
  }

  function showToast(text) {
    toast.textContent = localise(text);
    toast.classList.remove('hidden');
    window.setTimeout(() => toast.classList.add('hidden'), 5000);
  }

  languageToggle.addEventListener('click', () => {
    language = language === 'vey' ? 'en' : 'vey';
    setSharedLanguage(language);
    applyLanguage();

    [loginResult, puzzleResult, toast].forEach((el) => {
      if (el.dataset.englishMessage) {
        el.textContent = localise(el.dataset.englishMessage);
      }
    });
  });

  captchaTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      tile.classList.toggle('selected');
      tile.setAttribute('aria-pressed', tile.classList.contains('selected') ? 'true' : 'false');
    });
  });

  const failures = [
    'AUTHORIZATION DENIED // BIOLOGICAL SIGNATURE NOT PRESENT IN IMPERIAL DIRECTORY.',
    'HANDSHAKE REJECTED // TERRAN CRYPTOGRAPHIC ENTROPY BELOW MINIMUM THRESHOLD.',
    'IDENTITY FAILURE // CARDIAC ORGAN COUNT DOES NOT MATCH VEYDRAN BASELINE.',
    'ACCESS REFUSED // LOCAL SPECIES CLASSIFICATION: UNVERIFIED MEAT SACK.',
    'CREDENTIALS INVALID // REQUEST FORWARDED TO AUTOMATED SUSPICION ENGINE.'
  ];

  function setLiveResult(el, english) {
    el.dataset.englishMessage = english;
    showResult(el, english);
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cipher = loginForm.elements.cipher;
    const length = cipher.value.length;
    const selected = captchaTiles.filter((tile) => tile.classList.contains('selected')).length;

    if (length < 150 || length > 500) {
      setLiveResult(loginResult, 'PLEASE ENTER A PASSWORD BETWEEN 150 AND 500 CHARACTERS.');
      cipher.value = '';
      return;
    }

    if (selected === 0) {
      setLiveResult(loginResult, 'SPECIES VERIFICATION FAILED // NO TILES SELECTED. THIS RESPONSE IS ALSO INCORRECT.');
      loginForm.reset();
      return;
    }

    setLiveResult(loginResult, 'SPECIES VERIFICATION FAILED // SELECTED GLYPHS WERE PRESENT. PLEASE SELECT ONLY GLYPHS WHICH ARE NOT PRESENT.');
    captchaTiles.forEach((tile) => tile.classList.remove('selected'));
    loginForm.reset();

    loginAttempts += 1;
    if (loginAttempts > 2) {
      window.setTimeout(() => {
        setLiveResult(loginResult, failures[(loginAttempts - 1) % failures.length] + ' // REPEATED ACCESS ATTEMPTS HAVE BEEN CATALOGUED.');
      }, 850);
    }
  });

  requestAccount.addEventListener('click', () => {
    puzzlePanel.classList.remove('hidden');
    puzzlePanel.setAttribute('aria-hidden', 'false');
    puzzlePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  recover.addEventListener('click', () => {
    const message = 'CIPHER RECOVERY REQUIRES VERIFICATION BY BROOD-MOTHER, COMMANDING OFFICER, OR SURVIVING CLONE.';
    toast.dataset.englishMessage = message;
    showToast(message);
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
    setLiveResult(puzzleResult, stages[Math.min(puzzleAttempts - 1, stages.length - 1)]);
  });

  collectLanguageContent();
  applyLanguage();
  document.body.classList.remove('vey-loading');
})();
