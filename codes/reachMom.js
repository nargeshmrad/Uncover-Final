document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const images = [
      { el: document.getElementById('money1'), x: 10, y: 20, size: 10},
      { el: document.getElementById('money2'), x: 70,  y: 17, size: 10 },
      { el: document.getElementById('flightTicket'), x: 30,  y: 45, size: 20 },
      { el: document.getElementById('cake'), x: 75,  y: 40, size: 18 },
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
  
    container.addEventListener('mouseenter', () => {
      if (floating) return; // already animating
      floating = true;
      fadeInSequence();
      animateFloat();
    });
  
    container.addEventListener('mouseleave', () => {
      floating = false;
      fadeOutAll();
    });
  });
  