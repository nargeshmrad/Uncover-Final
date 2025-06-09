document.addEventListener('DOMContentLoaded', () => {
  // Map each CD id to its audio id
  const cdAudioPairs = [
    { cd: 'cd', audio: 'setar' },
    { cd: 'cd2', audio: 'santour' },
    { cd: 'cd3', audio: 'kamanche' },
    { cd: 'cd4', audio: 'setar2' },
  ];

  let currentAudio = null;
  let fadeInterval = null;
  let spinning = {};
  let angles = {};
  let animationIds = {};

  function stopAllAudio() {
    cdAudioPairs.forEach(({ audio }) => {
      const a = document.getElementById(audio);
      if (!a.paused) a.pause();
      a.currentTime = 0;
      a.volume = 1;
    });
  }

  function fadeInAudio(audio) {
    clearInterval(fadeInterval);
    audio.volume = 0;
    audio.play();
    fadeInterval = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(audio.volume + 0.05, 1);
      } else {
        clearInterval(fadeInterval);
      }
    }, 30);
  }

  function fadeOutAudio(audio) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(audio.volume - 0.05, 0);
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
      }
    }, 30);
  }

  function rotate(cdId) {
    if (!spinning[cdId]) return;
    angles[cdId] = (angles[cdId] || 0) + 2;
    if (angles[cdId] > 100000) angles[cdId] = 0;
    const cd = document.getElementById(cdId);
    cd.style.transform = `translate(-50%, -50%) rotate(${angles[cdId]}deg)`;
    animationIds[cdId] = requestAnimationFrame(() => rotate(cdId));
  }

  cdAudioPairs.forEach(({ cd: cdId, audio: audioId }) => {
    const cd = document.getElementById(cdId);
    const audio = document.getElementById(audioId);
    angles[cdId] = 0;
    spinning[cdId] = false;

    cd.addEventListener('mouseenter', (e) => {
      // Only trigger if mouse is inside .ear-zone
      const earZone = document.querySelector('.ear-zone');
      const rect = earZone.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        return;
      }
      // Stop all other audio and spinning
      stopAllAudio();
      Object.keys(spinning).forEach(id => {
        spinning[id] = false;
        if (animationIds[id]) {
          cancelAnimationFrame(animationIds[id]);
          animationIds[id] = null;
        }
      });
      spinning[cdId] = true;
      rotate(cdId);
      fadeInAudio(audio);
      currentAudio = audio;
    });

    cd.addEventListener('mouseleave', () => {
      spinning[cdId] = false;
      if (animationIds[cdId]) {
        cancelAnimationFrame(animationIds[cdId]);
        animationIds[cdId] = null;
      }
      fadeOutAudio(audio);
    });
  });
});