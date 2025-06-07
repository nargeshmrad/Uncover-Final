document.addEventListener('DOMContentLoaded', () => {
    const shadow = document.getElementById('shadow');
    const textbox = document.getElementById('textbox');
    const textbox2 = document.getElementById('textbox2');
    const light = document.getElementById('light');
    const shadowMusic = document.getElementById('shadowMusic');
    const shadowVoice = document.getElementById('shadowVoice');
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');
    const container = document.querySelector('.container');

    let resetTimer;
    let voiceTimer;
    let isPlaying = false;
    let hasPlayedVoice = false;
    let shadowOpacity = 1;
    let hasTransitioned = false;
    let hasLightCursor = false;
    let fadingShadow = false;

    // Set up music to loop
    shadowMusic.loop = true;


    // Remove the light image from the DOM (or hide it)
    light.style.display = 'none';



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
                // After 2 seconds, play voice and show textbox1 for 6s, then textbox2 for rest of voice
                voiceTimer = setTimeout(async () => {
                    try {
                        shadowVoice.currentTime = 0;
                        await shadowVoice.play();
                        textbox.style.opacity = '1';
                        textbox2.style.opacity = '0';
                        hasPlayedVoice = true;

                        // Hide textbox1 after 6s, show textbox2 for remainder of voice
                        setTimeout(() => {
                            textbox.style.opacity = '0';
                            textbox2.style.opacity = '1';
                        }, 7000);

                        // After voice ends, hide textbox2 and enable light cursor
                        resetTimer = setTimeout(() => {
                            textbox2.style.opacity = '0';
                            hasLightCursor = true;
                            fadingShadow = false;
                            document.body.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
                            container.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
                            shadow.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
                            // Fade in the light image (cursor)
                            light.classList.add('visible');
                            isPlaying = false; // Reset playing state when everything is done
                        }, shadowVoice.duration * 1000);
                    } catch (error) {
                        console.log('Voice playback interrupted');
                        isPlaying = false;
                    }
                }, 2000);
            } else {
                // If voice has already played, just enable light cursor
                hasLightCursor = true;
                fadingShadow = false;
                container.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
                isPlaying = false;
            }
        } catch (error) {
            console.log('Music playback interrupted');
            isPlaying = false;
        }
    });

    // Fade shadow on hover with light-cursor
    shadow.addEventListener('mousemove', (e) => {
        if (!hasLightCursor || hasTransitioned || fadingShadow) return;
        fadingShadow = true;
        function fade() {
            if (!hasLightCursor || hasTransitioned) { fadingShadow = false; return; }
            shadowOpacity = Math.max(0, shadowOpacity - 0.001);
            shadow.style.opacity = shadowOpacity;
            if (shadowOpacity === 0 && !hasTransitioned) {
                hasTransitioned = true;
                shadow.style.display = 'none';
                bg2.style.opacity = '1';
                // Fade out the light cursor smoothly using CSS overlay
                document.body.classList.add('light-cursor-fadeout');
                document.body.classList.add('fading');
                container.style.cursor = 'default';
                shadow.style.cursor = 'default';
                hasLightCursor = false;
                fadingShadow = false;

                // --- Fade out shadowMusic 5 seconds after bg2 appears ---
                if (!shadowMusic.paused) {
                    setTimeout(() => {
                        let fadeDuration = 2000; // 1 second
                        let fadeSteps = 20;
                        let fadeStepTime = fadeDuration / fadeSteps;
                        let originalVolume = shadowMusic.volume;
                        let currentStep = 0;
                        let fadeInterval = setInterval(() => {
                            currentStep++;
                            shadowMusic.volume = Math.max(0, originalVolume * (1 - currentStep / fadeSteps));
                            if (currentStep >= fadeSteps) {
                                clearInterval(fadeInterval);
                                shadowMusic.pause();
                                shadowMusic.volume = originalVolume; // Reset for next play
                                // Free the resource immediately after fadeout
                                shadowMusic.src = '';
                            }
                        }, fadeStepTime);
                    }, 5000); // Wait 5 seconds before starting fadeout
                }
                // --- End fadeout logic ---

                setTimeout(() => {
                    document.body.classList.remove('light-cursor-fadeout');
                    document.body.classList.remove('fading');
                    document.body.style.cursor = 'default';
                }, 1000); // Duration matches CSS transition
                return;
            }
            if (hasLightCursor && !hasTransitioned) {
                requestAnimationFrame(fade);
            } else {
                fadingShadow = false;
            }
        }
        requestAnimationFrame(fade);
    });

    // Remove light cursor if user leaves shadow
    shadow.addEventListener('mouseleave', () => {
        fadingShadow = false;
        if (hasLightCursor && !hasTransitioned) {
            document.body.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
            container.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
            shadow.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
        } else {
            document.body.style.cursor = 'default';
            container.style.cursor = 'default';
            shadow.style.cursor = 'default';
        }
    });

    // Ensure cursor is set on mouseenter for shadow and container after light mode enabled
    shadow.addEventListener('mouseenter', () => {
        if (hasLightCursor && !hasTransitioned) {
            document.body.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
            container.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
            shadow.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
        }
    });
    container.addEventListener('mouseenter', () => {
        if (hasLightCursor && !hasTransitioned) {
            document.body.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
            container.style.cursor = "url('../assets/ShadowAlbum/light.png'), auto";
        }
    });

    // Debug: Check if cursor image is accessible
    const testImg = new window.Image();
    testImg.src = '../assets/ShadowAlbum/light.png';
    testImg.onerror = () => { console.warn('Light cursor image failed to load: ../assets/ShadowAlbum/light.png'); };

});
