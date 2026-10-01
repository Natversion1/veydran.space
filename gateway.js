(() => {
  'use strict';

  const glyphMap = {
    A:'∆', B:'β', C:'Ͼ', D:'Ð', E:'Ξ', F:'Ϝ', G:'Ǥ', H:'Ħ', I:'ɪ', J:'ʆ', K:'Ҡ', L:'Ł', M:'Ϻ',
    N:'И', O:'Θ', P:'Ƥ', Q:'Ҩ', R:'Я', S:'Ϟ', T:'Ŧ', U:'Ս', V:'Ѵ', W:'Ш', X:'Ж', Y:'Ұ', Z:'Ȥ'
  };

  const languageToggle = document.getElementById('languageToggle');
  const toast = document.getElementById('toast');
  const ageModal = document.getElementById('ageModal');
  const singlesAd = document.getElementById('singlesAd');
  const closeAge = document.getElementById('closeAge');
  const claimAge = document.getElementById('claimAge');
  let language = 'vey';
  const textNodes = [];

  function toVeydran(text) {
    return [...text].map((char) => glyphMap[char.toUpperCase()] || char).join('');
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest('[data-no-vey="true"]')) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT','STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let node;
  while ((node = walker.nextNode())) textNodes.push({ node, english: node.nodeValue });

  function localise(text) {
    return language === 'vey' ? toVeydran(text) : text;
  }

  function applyLanguage() {
    const vey = language === 'vey';
    textNodes.forEach(({node, english}) => {
      node.nodeValue = vey ? toVeydran(english) : english;
    });
    languageToggle.textContent = vey ? 'ENGLISH' : 'VEYDRAN';
    document.documentElement.lang = vey ? 'x-vey' : 'en';
    document.title = vey ? toVeydran('Veydran Interstellar Authority') : 'Veydran Interstellar Authority';
    if (toast.dataset.englishMessage) toast.textContent = localise(toast.dataset.englishMessage);
  }

  function showToast(message) {
    toast.dataset.englishMessage = message;
    toast.textContent = localise(message);
    toast.classList.remove('hidden');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.add('hidden'), 5200);
  }

  languageToggle.addEventListener('click', () => {
    language = language === 'vey' ? 'en' : 'vey';
    applyLanguage();
  });

  document.querySelectorAll('.service[data-denied] button').forEach((button) => {
    button.addEventListener('click', () => {
      showToast(button.closest('.service').dataset.denied);
    });
  });

  document.querySelectorAll('[data-ad-message]').forEach((button) => {
    button.addEventListener('click', () => showToast(button.dataset.adMessage));
  });

  if (singlesAd) {
    singlesAd.addEventListener('click', () => {
      ageModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeAgeGate() {
    ageModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeAge) closeAge.addEventListener('click', closeAgeGate);

  if (claimAge) {
    claimAge.addEventListener('click', () => {
      closeAgeGate();
      showToast('AGE CLAIM REJECTED // ESTIMATED TERRAN LIFESPAN IS BELOW VEYDRAN ADULT THRESHOLD. NICE TRY.');
    });
  }

  if (ageModal) {
    ageModal.addEventListener('click', (event) => {
      if (event.target === ageModal) closeAgeGate();
    });
  }

  console.log('%cVEYDRAN PUBLIC NODE', 'color:#39d6ff;font-weight:bold;font-size:18px');
  console.log('Terran inspection detected. Curiosity has been added to your species profile.');

  applyLanguage();
  document.body.classList.remove('vey-loading');
})();
