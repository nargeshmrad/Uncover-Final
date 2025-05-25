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

  function makeDraggable(item, replacementImage) {
    let isDragging = false;
    let startX, startY;
    let hasRevealed = false;

    // Ensure draggable has absolute positioning
    item.style.position = 'absolute';

    // Use named handlers for removal
    item._dragStartHandler = dragStart;
    window._dragHandler = drag;
    window._dragEndHandler = dragEnd;
    item.addEventListener('mousedown', item._dragStartHandler);
    window.addEventListener('mousemove', window._dragHandler);
    window.addEventListener('mouseup', window._dragEndHandler);

    function dragStart(e) {
      if (e.button !== 0) return; // Only left mouse button
      if (item.classList.contains('faded')) return; // Don't drag if faded
      isDragging = true;
      item.style.cursor = 'grabbing';
      const rect = item.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      // Bring to top while dragging
      item.style.zIndex = 10;
      hasRevealed = false;
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const container = item.parentElement;
      const containerRect = container.getBoundingClientRect();
      const itemW = item.offsetWidth;
      const itemH = item.offsetHeight;
      let newX = e.clientX - containerRect.left - startX;
      let newY = e.clientY - containerRect.top - startY;
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
          hasRevealed = true;
        }
        if (!isOverDropzone && hasRevealed) {
          // Optionally: revert to original image if you want preview only while hovering
          // workClothes.src = ...original image...
          // hasRevealed = false;
        }
      }
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      item.style.cursor = 'grab';
      item.style.zIndex = 2;
      // Do not reset position; leave at last drag location

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
        item.removeEventListener('mousedown', item._dragStartHandler);
        window.removeEventListener('mousemove', window._dragHandler);
        window.removeEventListener('mouseup', window._dragEndHandler);
      }
    }
  }

  makeDraggable(kimono, "../assets/workClothes/WorkClothes2.png");
  makeDraggable(coat,   "../assets/workClothes/WorkClothes3.png");
};
