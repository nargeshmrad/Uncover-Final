// Configuration for each hotspot:
const hotspots = [
    {
      id: 'hotspot1',
      audioSrc: '../assets/classroomFaces/classroomVoice1.mp3',
      textboxId: 'textbox1',
      position: { top: '8%', left: '12%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    },
    {
      id: 'hotspot2',
      audioSrc: '../assets/classroomFaces/classroomVoice2.mp3',
      textboxId: 'textbox2',
      position: { top: '8%', left: '40%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    },
    {
      id: 'hotspot3',
      audioSrc: '../assets/classroomFaces/classroomVoice3.mp3',
      textboxId: 'textbox3',
      position: { top: '8%', left: '67%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    },
    {
      id: 'hotspot4',
      audioSrc: '../assets/classroomFaces/classroomVoice4.mp3',
      textboxId: 'textbox4',
      position: { top: '50%', left: '12%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    },
    {
      id: 'hotspot5',
      audioSrc: '../assets/classroomFaces/classroomVoice5.mp3',
      textboxId: 'textbox5',
      position: { top: '50%', left: '40%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    },
    {
      id: 'hotspot6',
      audioSrc: '../assets/classroomFaces/classroomVoice6.mp3',
      textboxId: 'textbox6',
      position: { top: '50%', left: '70%' },
      size: { width: '330px', height: '260px' },
      textboxPosition: { top: '85%', left: '36%' },
      textboxSize: { width: '500px', height: 'auto' }
    }
  ];
  
  const container = document.getElementById('container');
  
  let currentAudio = null;
  let fadeInterval = null;
  
  hotspots.forEach(hotspot => {
    // Create hotspot element
    const div = document.createElement('div');
    div.id = hotspot.id;
    div.classList.add('hotspot');
  
    // Set hotspot position and size
    div.style.top = hotspot.position.top;
    div.style.left = hotspot.position.left;
    div.style.width = hotspot.size.width;
    div.style.height = hotspot.size.height;
  
    // Append hotspot to container
    container.appendChild(div);
  
    // Setup audio
    const audio = new Audio(hotspot.audioSrc);
  
    // Get textbox element
    const textbox = document.getElementById(hotspot.textboxId);
  
    // Set textbox position and size
    textbox.style.top = hotspot.textboxPosition.top;
    textbox.style.left = hotspot.textboxPosition.left;
    textbox.style.width = hotspot.textboxSize.width;
    textbox.style.height = hotspot.textboxSize.height;
  
    // Mouse enter event
    div.addEventListener('mouseenter', () => {
      // Stop any existing audio and clear fade intervals
      if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if(fadeInterval){
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
      // Hide all textboxes
      hotspots.forEach(h => {
        const tb = document.getElementById(h.textboxId);
        tb.style.opacity = 0;
        tb.style.display = 'none';
      });
  
      // Show current textbox
      textbox.style.display = 'block';
      textbox.style.opacity = 1;
  
      // Play audio
      currentAudio = audio;
      currentAudio.play();
  
      // When audio ends fade out textbox
      currentAudio.onended = () => {
        let opacity = 1;
        const fadeDuration = 1000; // ms
        const fadeStep = 50; // ms per interval
        const fadeAmount = fadeStep / fadeDuration;
  
        fadeInterval = setInterval(() => {
          opacity -= fadeAmount;
          if (opacity <= 0) {
            textbox.style.opacity = 0;
            textbox.style.display = 'none';
            clearInterval(fadeInterval);
            fadeInterval = null;
          } else {
            textbox.style.opacity = opacity;
          }
        }, fadeStep);
      };
    });
  
    // Optional: stop and hide if mouse leaves hotspot early
    div.addEventListener('mouseleave', () => {
      if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      if(fadeInterval){
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
      textbox.style.opacity = 0;
      textbox.style.display = 'none';
    });
  });
  