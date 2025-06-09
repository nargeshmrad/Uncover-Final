document.addEventListener('DOMContentLoaded', () => {
    const picture = document.getElementById('picture');
    const hotspot = document.getElementById('reachHotspot');
    const reachRightText = document.getElementById('reachRightText');
    const reachAudio = document.getElementById('reachAudio');
    const images = [
      { el: document.getElementById('money1'), x: 10, y: 20, size: 10},
      { el: document.getElementById('money2'), x: 70,  y: 17, size: 10 },
      { el: document.getElementById('flightTicket'), x: 30,  y: 45, size: 20 },
      { el: document.getElementById('cake'), x: 75,  y: 40, size: 23 },
    ];
  
    images.forEach(({el, x, y, size}) => {
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.style.width = size ? `${size}%` : 'auto';
      el.style.transform = 'translate(-50%, -50%)';
    });
  
    let floatAngles = new Array(images.length).fill(0);
    let floating = false;
    let fadeInTimeouts = [];
  
    function animateFloat() {
      if (!floating) return;
      images.forEach(({el}, i) => {
        floatAngles[i] += 0.01 + i*0.005; // different speeds
        const offsetX = Math.sin(floatAngles[i]) * 3; // px
        const offsetY = Math.cos(floatAngles[i]) * 2; // px
        el.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      });
      requestAnimationFrame(animateFloat);
    }
  
    function fadeInSequence() {
      images.forEach(({el}, i) => {
        fadeInTimeouts[i] = setTimeout(() => {
          el.style.opacity = '1';
        }, i * 700);
      });
    }
  
    function fadeOutAll() {
      fadeInTimeouts.forEach(timeout => clearTimeout(timeout));
      images.forEach(({el}) => {
        el.style.opacity = '0';
        el.style.transform = 'translate(-50%, -50%)'; // reset float
      });
    }
  
    function showTextOverlay() {
      reachRightText.style.display = 'block';
      reachRightText.style.opacity = '1';
    }
  
    function hideTextOverlay() {
      reachRightText.style.display = 'none';
      reachRightText.style.opacity = '0';
    }
  
    function playAudio() {
      reachAudio.currentTime = 0;
      reachAudio.play();
    }
  
    function stopAudio() {
      reachAudio.pause();
      reachAudio.currentTime = 0;
    }
  
    hotspot.addEventListener('mouseenter', () => {
      if (floating) return; // already animating
      floating = true;
      fadeInSequence();
      animateFloat();
      playAudio();
      showTextOverlay();
    });
  
    hotspot.addEventListener('mouseleave', () => {
      floating = false;
      fadeOutAll();
      stopAudio();
      hideTextOverlay();
    });
  });