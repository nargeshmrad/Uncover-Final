document.addEventListener('DOMContentLoaded', () => {
  const tears = document.querySelectorAll('.tear');
  const tear1 = document.getElementById('tear1');
  const tear2 = document.getElementById('tear2');
  const divorceAudio = document.getElementById('divorceAudio');
  let tearsHaveMoved = false;

  // Fade out audio when user leaves or hides the page
  function fadeOutAudio(audio, duration = 1000) {
    if (!audio || audio.paused || audio.volume === 0) return;
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;
    let localFading = true;
    isFading = true; // Mark global state as fading
    function step() {
      // If mouse returned, cancel fade and restore volume
      if (!isFading) {
        audio.volume = startVolume;
        return;
      }
      currentStep++;
      audio.volume = Math.max(0, startVolume * (1 - currentStep / steps));
      if (currentStep < steps && !audio.paused) {
        setTimeout(step, stepTime);
      } else {
        // Only pause/reset if still fading
        if (isFading) {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = startVolume; // Reset for next play
        }
      }
    }
    step();
  }

  // Fade out when mouse leaves the background image
  const container = document.getElementById('interactionArea');
  let fadeOutTimeout = null;
  let isFading = false;

  container.addEventListener('mouseleave', () => {
    if (!divorceAudio.paused && !isFading) {
      isFading = true;
      fadeOutAudio(divorceAudio, 1000);
    }
  });

  container.addEventListener('mouseenter', () => {
    // Cancel fade out if mouse returns before fade completes
    if (isFading) {
      isFading = false;
    }
    // Always restart audio from beginning if tears have moved
    if (tearsHaveMoved) {
      divorceAudio.pause();
      divorceAudio.currentTime = 0;
      divorceAudio.volume = 1.0;
      divorceAudio.play();
    }
  });

  window.addEventListener('beforeunload', () => {
    fadeOutAudio(divorceAudio, 100);
  });

  function handleTearHover() {
    if (!tearsHaveMoved) {
      tear1.classList.add('moved-right');
      tear2.classList.add('moved-left');
      tearsHaveMoved = true;

      // Play audio
      divorceAudio.currentTime = 0; // Reset to start
      divorceAudio.play();
    }
  }

  tear1.addEventListener('mouseenter', handleTearHover);
  tear2.addEventListener('mouseenter', handleTearHover);

  // Dragging functionality (precise, only selected tear moves, stays at release position)
  let draggingTear = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let containerRect = null;

  tears.forEach(tear => {
    tear.addEventListener('mousedown', (e) => {
      draggingTear = tear;
      containerRect = tear.parentElement.getBoundingClientRect();
      dragOffsetX = e.clientX - tear.getBoundingClientRect().left;
      dragOffsetY = e.clientY - tear.getBoundingClientRect().top;
      tear.style.cursor = 'grabbing';
      // Prevent text/image dragging
      e.preventDefault();
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (draggingTear) {
      // Calculate new position in px relative to container
      const x = e.clientX - containerRect.left - dragOffsetX;
      const y = e.clientY - containerRect.top - dragOffsetY;
      // Convert px to % relative to container
      const leftPercent = (x / containerRect.width) * 100;
      const topPercent = (y / containerRect.height) * 100;
      draggingTear.style.left = `${leftPercent}%`;
      draggingTear.style.top = `${topPercent}%`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (draggingTear) {
      draggingTear.style.cursor = 'grab';
      draggingTear = null;
    }
  });
});
