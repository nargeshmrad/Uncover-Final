
document.addEventListener('DOMContentLoaded', () => {
  const eraser = document.getElementById('eraser');
  const scribblesCanvas = document.getElementById('scribblesCanvas');
  const students1 = document.getElementById('students1');
  const students2 = document.getElementById('students2');
  const students3 = document.getElementById('students3');
  const eraserSound = document.getElementById('eraserSound');
  const laughingSound = document.getElementById('laughingSound');

  // Set initial volume for laughing sound
  laughingSound.volume = 0.3; // 30% volume

  // Set up scribbles canvas
  const scribblesImg = new Image();
  scribblesImg.src = 'assets/optimized/scribbles.png';
  let scribblesErased = false;
  let transitionStage = 0;

  function resizeCanvas() {
    const container = scribblesCanvas.parentElement;
    const rect = container.getBoundingClientRect();
    scribblesCanvas.width = rect.width;
    scribblesCanvas.height = rect.height;
    drawScribbles();
  }

  function drawScribbles() {
    const ctx = scribblesCanvas.getContext('2d');
    ctx.clearRect(0, 0, scribblesCanvas.width, scribblesCanvas.height);
    if (scribblesImg.complete && scribblesImg.naturalWidth !== 0) {
      ctx.drawImage(scribblesImg, 0, 0, scribblesCanvas.width, scribblesCanvas.height);
    }

  }

  scribblesImg.onload = () => {
    resizeCanvas();
  };
  scribblesImg.onerror = () => {
    console.error('Failed to load scribbles.png. Check the path.');
  };
  window.addEventListener('resize', resizeCanvas);

  // Eraser drag logic (like sponge)
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  eraser.addEventListener('mousedown', (e) => {
    isDragging = true;
    eraser.style.cursor = 'grabbing';
    const rect = eraser.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const containerRect = eraser.parentElement.getBoundingClientRect();
    let newLeft = e.clientX - containerRect.left - offsetX;
    let newTop = e.clientY - containerRect.top - offsetY;
    // Clamp within container
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - eraser.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - eraser.offsetHeight));
    eraser.style.left = `${newLeft}px`;
    eraser.style.top = `${newTop}px`;

    // Map eraser center to canvas coordinates
    const eraserCenterX = newLeft + eraser.offsetWidth / 2;
    const eraserCenterY = newTop + eraser.offsetHeight / 2;
    const canvasRect = scribblesCanvas.getBoundingClientRect();
    const containerRect2 = eraser.parentElement.getBoundingClientRect();
    const canvasLeft = canvasRect.left - containerRect2.left;
    const canvasTop = canvasRect.top - containerRect2.top;
    const canvasX = ((eraserCenterX - canvasLeft) / scribblesCanvas.offsetWidth) * scribblesCanvas.width;
    const canvasY = ((eraserCenterY - canvasTop) / scribblesCanvas.offsetHeight) * scribblesCanvas.height;
    eraseScribbles(canvasX, canvasY, eraser.offsetWidth, eraser.offsetHeight);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    eraser.style.cursor = 'grab';
  });

  function eraseScribbles(centerX, centerY, w, h) {
    const ctx = scribblesCanvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(w, h) / 2.2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    // Play eraser sound
    if (eraserSound && eraserSound.paused) {
      try {
        eraserSound.currentTime = 0;
        eraserSound.play();
      } catch (e) {
        // ignore play errors
      }
    }
    // Check if scribbles mostly erased
    if (!scribblesErased && isCanvasMostlyErased()) {
      scribblesErased = true;
      // Add eye cursor only when hovering over students3 at the end
      students3.addEventListener('mouseenter', () => {
        students3.classList.add('eye-cursor-hover');
      });
      students3.addEventListener('mouseleave', () => {
        students3.classList.remove('eye-cursor-hover');
      });
      setTimeout(() => {
        students1.classList.add('hidden');
        students2.classList.remove('hidden');
        setTimeout(() => {
          students2.classList.add('hidden');
          students3.classList.remove('hidden');
          if (laughingSound) {
            try {
              laughingSound.currentTime = 0;
              laughingSound.play();
            } catch (e) {
              // ignore play errors
            }
          }
        }, 2000);
      }, 500);
    }
  }

  function isCanvasMostlyErased() {
    const ctx = scribblesCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, scribblesCanvas.width, scribblesCanvas.height).data;
    let erased = 0;
    for (let i = 3; i < imageData.length; i += 4) {
      if (imageData[i] === 0) erased++;
    }
    const percentErased = erased / (imageData.length / 4);
    return percentErased > 0.60; // 60% erased triggers transition
  }

  // Initial eraser position and style
  eraser.style.left = '70%';
  eraser.style.top = '10%';
  eraser.style.cursor = 'grab';

  // Responsive canvas setup
  setTimeout(resizeCanvas, 200);
});

// Remove any old, unreachable, or duplicate code below this point


  let isDragging = false;
  let startX, startY;
  let transitionStarted = false;

  // Eraser drag functionality
  eraser.addEventListener('mousedown', (e) => {
    isDragging = true;
    eraser.classList.add('dragging');
    
    // Calculate the offset from the mouse to the top-left of the eraser
    const eraserRect = eraser.getBoundingClientRect();
    startX = e.clientX - eraserRect.left;
    startY = e.clientY - eraserRect.top;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate new position
    const containerRect = eraser.parentElement.getBoundingClientRect();
    let newLeft = e.clientX - containerRect.left - startX;
    let newTop = e.clientY - containerRect.top - startY;

    // Keep eraser within container bounds
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - eraser.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - eraser.offsetHeight));

    eraser.style.left = `${newLeft}px`;
    eraser.style.top = `${newTop}px`;

    // Check for collision between eraser and scribbles
    const eraserRect = eraser.getBoundingClientRect();
    const scribblesRect = scribbles.getBoundingClientRect();

    // Check if the eraser overlaps with the scribbles
    const overlap = !(eraserRect.right < scribblesRect.left || 
                     eraserRect.left > scribblesRect.right || 
                     eraserRect.bottom < scribblesRect.top || 
                     eraserRect.top > scribblesRect.bottom);

    // If there's an overlap while dragging, start the transition sequence
    if (overlap && !transitionStarted) {
      transitionStarted = true;
      scribbles.style.opacity = '0';
      // Play eraser sound
      eraserSound.currentTime = 0; // Reset sound to start
      eraserSound.play();
      
      // Start the image transition sequence
      setTimeout(() => {
        // Hide first image and show second
        students1.classList.add('hidden');
        students2.classList.remove('hidden');
        
        // After 2 more seconds, show third image
        setTimeout(() => {
          students2.classList.add('hidden');
          students3.classList.remove('hidden');
          
          // Play student yard audio and show text when students3 appears
          studentYardAudio.currentTime = 0;
          studentYardAudio.play();
          setTimeout(() => {
            studentYardText.style.opacity = '1';
            // Fade out the text after 3 seconds
            setTimeout(() => {
              studentYardText.style.opacity = '0';
            }, 3000);
          }, 1000);

          // Show the folded letter after 5 more seconds
          setTimeout(() => {
            foldedLetter.classList.add('visible');
          }, 3000);
        }, 4000);
      }, 4000);
    }
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    eraser.classList.remove('dragging');
  });

  // Handle student hover sound effects
  const handleStudentHover = (isHovering) => {
    if (isHovering) {
      laughingSound.play();
    } else {
      // Fade out the laughing sound
      const fadeOut = setInterval(() => {
        if (laughingSound.volume > 0.01) {
          laughingSound.volume -= 0.05;
        } else {
          laughingSound.pause();
          laughingSound.volume = 0.3; // Reset volume for next play
          clearInterval(fadeOut);
        }
      }, 100);
    }
  };

  // Add hover listeners to all student images
  [students1, students2, students3].forEach(student => {
    student.addEventListener('mouseenter', () => handleStudentHover(true));
    student.addEventListener('mouseleave', () => handleStudentHover(false));
  });

  // Handle letter click and transition
  foldedLetter.addEventListener('click', () => {
    // Fade out folded letter
    foldedLetter.style.opacity = '0';
    
    // After folded letter fades out, show opened letter
    setTimeout(() => {
      foldedLetter.style.display = 'none'; // Hide completely after fade
      openedLetter.classList.add('visible');
      
      // Show second opened letter after 6 seconds
      setTimeout(() => {
        openedLetter2.classList.add('visible');
      }, 6000);
    }, 1000); // Wait for fade out to complete
  });

  // Handle clicking on opened letters to bring them to front
  openedLetter.addEventListener('click', () => {
    // Remove front class from other letter
    openedLetter2.classList.remove('front');
    // Add front class to clicked letter
    openedLetter.classList.add('front');
  });

  openedLetter2.addEventListener('click', () => {
    // Remove front class from other letter
    openedLetter.classList.remove('front');
    // Add front class to clicked letter
    openedLetter2.classList.add('front');
  });