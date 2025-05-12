
document.addEventListener('DOMContentLoaded', () => {
  const eraser = document.getElementById('eraser');
  const scribbles = document.getElementById('scribbles');
  const students1 = document.getElementById('students1');
  const students2 = document.getElementById('students2');
  const students3 = document.getElementById('students3');
  const foldedLetter = document.getElementById('foldedLetter');
  const openedLetter = document.getElementById('openedLetter');
  const openedLetter2 = document.getElementById('openedLetter2');
  const eraserSound = document.getElementById('eraserSound');
  const laughingSound = document.getElementById('laughingSound');
  const studentYardAudio = document.getElementById('studentYardAudio');
  const studentYardText = document.getElementById('studentYardText');

  // Set initial volume for laughing sound
  laughingSound.volume = 0.3; // 30% volume
  
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
});