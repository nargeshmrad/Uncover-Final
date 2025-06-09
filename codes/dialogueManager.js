// public/js/utils/dialogueManager.js

class DialogueSequence {
    constructor(dialogues, options = {}) {
      this.dialogues = dialogues.map(dialogue => ({
        ...dialogue,
        audio: new Audio(dialogue.audioSrc)
      }));
      
      this.backgroundAudio = null;
      if (options.backgroundSoundSrc) {
        this.backgroundAudio = new Audio(options.backgroundSoundSrc);
        this.backgroundAudio.loop = true;
        this.backgroundAudio.volume = options.backgroundSoundVolume || 1.0;
      }

      this.currentAudio = null;
      this.currentIndex = 0;
      this.isPlaying = false;
      this.activeTimers = new Set(); // Keep track of all active timers
    }
  
    play() {
      if (this.isPlaying || this.dialogues.length === 0) return;
      this.isPlaying = true;
      this.currentIndex = 0;
      
      if (this.backgroundAudio) {
        this.backgroundAudio.currentTime = 0;
        this.backgroundAudio.play().catch(e => console.error("Background audio play failed:", e));
      }

      this._playNext();
    }
  
    _playNext() {
      if (this.currentIndex >= this.dialogues.length) {
        if (!this.backgroundAudio) {
          this.stop();
        }
        return;
      }
  
      const dialogue = this.dialogues[this.currentIndex];
      const { textId, audio, delayBefore = 0, delayAfter = 0 } = dialogue;
  
      const preDelayTimer = setTimeout(() => {
        this.activeTimers.delete(preDelayTimer);
        if (!this.isPlaying) return;
  
        this.currentAudio = audio;
        this._showText(textId);
  
        audio.onended = () => {
          this._hideText(textId);
          
          const postDelayTimer = setTimeout(() => {
            this.activeTimers.delete(postDelayTimer);
            if (!this.isPlaying) return;
  
            this.currentIndex++;
            this._playNext();
          }, delayAfter);
          this.activeTimers.add(postDelayTimer);
        };
        
        audio.play().catch(e => console.error("Audio play failed:", e));
  
      }, delayBefore);
      this.activeTimers.add(preDelayTimer);
    }
  
    stop() {
      // Clear all scheduled timeouts to prevent them from firing later
      this.activeTimers.forEach(clearTimeout);
      this.activeTimers.clear();

      if (this.backgroundAudio) {
        this.backgroundAudio.pause();
        this.backgroundAudio.currentTime = 0;
      }

      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.dialogues.forEach(({ textId }) => this._hideText(textId));
      this.isPlaying = false;
    }
  
    _showText(id) {
      const el = document.getElementById(id);
      if (el) {
        // --- FIX: Cancel any pending hide timeout for this element ---
        if (el._hideTimeoutId) {
          clearTimeout(el._hideTimeoutId);
          delete el._hideTimeoutId;
        }
        // --- END FIX ---
        
        el.style.display = 'block';
        requestAnimationFrame(() => el.style.opacity = '1');
      }
    }
  
    _hideText(id) {
      const el = document.getElementById(id);
      if (el) {
        el.style.opacity = '0';
        
        // --- FIX: Store the timeout ID on the element ---
        // First, clear any previous timeout just in case
        if (el._hideTimeoutId) {
          clearTimeout(el._hideTimeoutId);
        }
        el._hideTimeoutId = setTimeout(() => {
          el.style.display = 'none';
          delete el._hideTimeoutId; // Clean up property
        }, 500);
        // --- END FIX ---
      }
    }
}
  
export function createDialogueHotspot(hotspotId, dialogues, options = {}) {
    const hotspot = document.getElementById(hotspotId);
    if (!hotspot) {
      console.error(`Hotspot with id ${hotspotId} not found.`);
      return;
    }
    
    const sequence = new DialogueSequence(dialogues, options);
  
    hotspot.addEventListener('mouseenter', () => sequence.play());
    hotspot.addEventListener('mouseleave', () => sequence.stop());
}