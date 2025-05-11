document.addEventListener('DOMContentLoaded', () => {
    const shadow = document.getElementById('shadow');
    const textbox = document.getElementById('textbox');
    const light = document.getElementById('light');
    const shadowMusic = document.getElementById('shadowMusic');
    const shadowVoice = document.getElementById('shadowVoice');
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');

    let resetTimer;
    let voiceTimer;
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let isPlaying = false;
    let hasPlayedVoice = false;
    let xOffset = 0;
    let yOffset = 0;
    let shadowOpacity = 1;
    let hasTransitioned = false;

    // Set up music to loop
    shadowMusic.loop = true;

    function checkCollision(light, shadow) {
        const lightRect = light.getBoundingClientRect();
        const shadowRect = shadow.getBoundingClientRect();

        return !(
            lightRect.right < shadowRect.left ||
            lightRect.left > shadowRect.right ||
            lightRect.bottom < shadowRect.top ||
            lightRect.top > shadowRect.bottom
        );
    }

    // Set initial position of light
    light.style.top = '5%';
    light.style.left = '50%';
    light.style.transform = 'translate(-50%, -50%)';

    function dragStart(e) {
        if (light.style.opacity === '1') {
            e.preventDefault();
            const rect = light.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            
            if (e.target === light) {
                isDragging = true;
                light.classList.add('dragging');
            }
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, light);

            // Check if light is touching shadow
            if (checkCollision(light, shadow)) {
                // Decrease shadow opacity very slowly
                shadowOpacity = Math.max(0, shadowOpacity - 0.002);
                shadow.style.opacity = shadowOpacity;

                // If shadow is completely faded
                if (shadowOpacity === 0 && !hasTransitioned) {
                    hasTransitioned = true;
                    shadow.style.display = 'none';
                    
                    // Start background transition
                    bg2.style.opacity = '1';
                    
                    // Optional: Remove the light after transition
                    setTimeout(() => {
                        light.style.opacity = '0';
                    }, 2000); // Same duration as background transition
                }
            }
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(0, 0)`;
        el.style.left = `${xPos}px`;
        el.style.top = `${yPos}px`;
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        light.classList.remove('dragging');
    }

    // Add the event listeners
    light.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Prevent light from triggering shadow events
    light.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
    });

    shadow.addEventListener('mouseenter', async () => {
        if (isPlaying) return; // Prevent multiple plays
        isPlaying = true;

        try {
            // Only start music if it's not already playing
            if (shadowMusic.paused) {
                await shadowMusic.play();
            }

            // Only play voice and show textbox if they haven't played yet
            if (!hasPlayedVoice) {
                // After 2 seconds, play voice and show textbox
                voiceTimer = setTimeout(async () => {
                    try {
                        shadowVoice.currentTime = 0;
                        await shadowVoice.play();
                        textbox.style.opacity = '1';
                        hasPlayedVoice = true;

                        // Show light when voice ends
                        resetTimer = setTimeout(() => {
                            textbox.style.opacity = '0';
                            light.style.opacity = '1';
                            isPlaying = false; // Reset playing state when everything is done
                        }, shadowVoice.duration * 1000);
                    } catch (error) {
                        console.log('Voice playback interrupted');
                        isPlaying = false;
                    }
                }, 2000);
            } else {
                // If voice has already played, just make sure light is visible
                light.style.opacity = '1';
                isPlaying = false;
            }
        } catch (error) {
            console.log('Music playback interrupted');
            isPlaying = false;
        }
    });

    shadow.addEventListener('mouseleave', () => {
        if (!isDragging) {
            // Only reset light position if not dragging
            light.style.top = '5%';
            light.style.left = '50%';
            light.style.transform = 'translate(-50%, -50%)';
        }
    });
});
