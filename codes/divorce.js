document.addEventListener('DOMContentLoaded', () => {
  const tears = document.querySelectorAll('.tear');
  const tear1 = document.getElementById('tear1');
  const tear2 = document.getElementById('tear2');
  const divorceAudio = document.getElementById('divorceAudio');
  let tearsHaveMoved = false;

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
