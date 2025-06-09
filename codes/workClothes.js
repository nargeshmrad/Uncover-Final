window.initWorkClothesDrag = function() {
  const workClothes = document.getElementById('workClothes');
  const dropzone = document.getElementById('dropzone');
  const kimono = document.getElementById('kimono');
  const coat = document.getElementById('coat');

  // Utility to convert % top/left to px and set as inline style
  function setInitialPixelPosition(item) {
    const container = item.parentElement;
    const containerRect = container.getBoundingClientRect();
    // Get computed styles
    const computed = window.getComputedStyle(item);
    // Parse % values
    let left = computed.left;
    let top = computed.top;
    if (left && left.includes('%')) {
      const leftPercent = parseFloat(left) / 100;
      item.style.left = (containerRect.width * leftPercent) + 'px';
    }
    if (top && top.includes('%')) {
      const topPercent = parseFloat(top) / 100;
      item.style.top = (containerRect.height * topPercent) + 'px';
    }
  }

  setInitialPixelPosition(kimono);
  setInitialPixelPosition(coat);

  function makeDraggable(item, replacementImage, isKimono = false) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let hasRevealed = false;

    // Ensure draggable has absolute positioning
    item.style.position = 'absolute';
    item.style.cursor = 'grab';

    function dragStart(e) {
      if (e.button !== 0) return; // Only left mouse button
      if (item.classList.contains('faded')) return; // Don't drag if faded
      // --- Fix: set left/top as px before dragging ---
      const computed = window.getComputedStyle(item);
      const container = item.parentElement;
      const containerRect = container.getBoundingClientRect();
      // Convert % to px if needed
      ['left', 'top'].forEach((prop) => {
        let val = computed[prop];
        if (val && val.includes('%')) {
          let percent = parseFloat(val) / 100;
          let px = (prop === 'left' ? containerRect.width : containerRect.height) * percent;
          item.style[prop] = px + 'px';
        }
      });
      // --- End fix ---
      isDragging = true;
      item.style.cursor = 'grabbing';
      const rect = item.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      // Bring to top while dragging
      item.style.zIndex = 10;
      hasRevealed = false;
      document.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', dragEnd);
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const container = item.parentElement;
      const containerRect = container.getBoundingClientRect();
      const itemW = item.offsetWidth;
      const itemH = item.offsetHeight;
      let newX = e.clientX - containerRect.left - offsetX;
      let newY = e.clientY - containerRect.top - offsetY;
      // Clamp within container boundaries
      newX = Math.max(0, Math.min(containerRect.width - itemW, newX));
      newY = Math.max(0, Math.min(containerRect.height - itemH, newY));
      // Set position in pixels
      item.style.left = `${newX}px`;
      item.style.top = `${newY}px`;

      // Reveal effect: if over dropzone, swap the workClothes layer (only if not already faded)
      if (!item.classList.contains('faded')) {
        const itemRect = item.getBoundingClientRect();
        const dropzoneRect = dropzone.getBoundingClientRect();
        const isOverDropzone = !(
          itemRect.right < dropzoneRect.left ||
          itemRect.left > dropzoneRect.right ||
          itemRect.bottom < dropzoneRect.top ||
          itemRect.top > dropzoneRect.bottom
        );
        if (isOverDropzone && !hasRevealed) {
          workClothes.src = replacementImage;
          item.classList.add('faded');
          hasRevealed = true;
          // If this is the coat, show textbox and play audio
          if (isKimono) {
            const textbox = document.getElementById('wearKimonoText');
            const audio = document.getElementById('kimonoWorkAudio');
            if (textbox) {
              textbox.style.opacity = 1;
            }
            if (audio) {
              audio.currentTime = 0;
              audio.play();
              audio.onended = function() {
                if (textbox) textbox.style.opacity = 0;
              };
            }
          } else {
            const textbox = document.getElementById('wearCoatText');
            const audio = document.getElementById('coatWorkAudio');
            if (textbox) {
              textbox.style.opacity = 1;
            }
            if (audio) {
              audio.currentTime = 0;
              audio.play();
              // When audio ends, hide the textbox
              audio.onended = function() {
                if (textbox) textbox.style.opacity = 0;
              };
            }
          }
          // Remove listeners so it can't be dragged again
          item.removeEventListener('mousedown', dragStart);
          document.removeEventListener('mousemove', drag);
          window.removeEventListener('mouseup', dragEnd);
        }
      }
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      item.style.cursor = 'grab';
      item.style.zIndex = 2;
      document.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', dragEnd);
      // Dropzone logic: if dropped inside, reveal and fade
      const itemRect = item.getBoundingClientRect();
      const dropzoneRect = dropzone.getBoundingClientRect();
      const isDroppedInside = !(
        itemRect.right < dropzoneRect.left ||
        itemRect.left > dropzoneRect.right ||
        itemRect.bottom < dropzoneRect.top ||
        itemRect.top > dropzoneRect.bottom
      );
      if (isDroppedInside && !item.classList.contains('faded')) {
        workClothes.src = replacementImage;
        item.classList.add('faded');
        // Remove listeners so it can't be dragged again
        item.removeEventListener('mousedown', dragStart);
      }
    }

    item.addEventListener('mousedown', dragStart);
  }

  makeDraggable(kimono, "../assets/workClothes2/WorkClothes2.png", true);
  makeDraggable(coat,   "../assets/workClothes2/WorkClothes3.png", false);
};
