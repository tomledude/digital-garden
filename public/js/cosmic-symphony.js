// Cosmic Symphony - Generative Music
// Creates ambient space-themed music with evolving melodies and harmonies

class CosmicSymphony {
    constructor(canvasId, playButtonId, stopButtonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.playButton = document.getElementById(playButtonId);
        this.stopButton = document.getElementById(stopButtonId);
        
        // Set canvas size for visualization
        this.canvas.width = 600;
        this.canvas.height = 300;
        
        // Audio context and nodes
        this.audioContext = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.scheduledNotes = [];
        this.startTime = null;
        
        // Musical parameters
        this.bpm = 80;
        this.beatDuration = 60 / this.bpm;
        this.currentBeat = 0;
        
        // Initialize
        this.initializeAudio();
        this.bindEvents();
        this.generateComposition();
        this.draw();
    }
    
    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3;
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }
    
    bindEvents() {
        this.playButton.addEventListener('click', () => this.play());
        this.stopButton.addEventListener('click', () => this.stop());
    }
    
    generateComposition() {
        this.generateScale();
        this.generateChordProgression();
        this.generateMelody();
        this.generateBass();
        this.generatePad();
        this.generatePercussion();
    }
    
    generateScale() {
        const scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            dorian: [0, 2, 3, 5, 7, 9, 10],
            mixolydian: [0, 2, 4, 5, 7, 9, 10],
            pentatonic: [0, 2, 4, 7, 9],
            blues: [0, 3, 5, 6, 7, 10]
        };
        
        const scaleNames = Object.keys(scales);
        const selectedScale = scaleNames[Math.floor(Math.random() * scaleNames.length)];
        
        const rootNotes = [60, 62, 64, 65, 67, 69, 71]; // C, D, E, F, G, A, B
        this.rootNote = rootNotes[Math.floor(Math.random() * rootNotes.length)];
        
        this.scale = scales[selectedScale].map(note => this.rootNote + note);
        this.scaleName = selectedScale;
    }
    
    generateChordProgression() {
        const progressions = [
            [0, 3, 5, 4], // I-vi-IV-V
            [0, 5, 3, 4], // I-IV-vi-V
            [0, 4, 5, 3], // I-V-vi-IV
            [0, 2, 5, 4], // I-iii-IV-V
        ];
        
        const selectedProgression = progressions[Math.floor(Math.random() * progressions.length)];
        this.chordProgression = selectedProgression.map(degree => {
            const chordRoot = this.scale[degree % this.scale.length];
            return this.buildChord(chordRoot, degree);
        });
    }
    
    buildChord(root, degree) {
        const chord = [root];
        const thirdIndex = this.scale.indexOf(root);
        if (thirdIndex !== -1) {
            chord.push(this.scale[(thirdIndex + 2) % this.scale.length] || root + 4);
            chord.push(this.scale[(thirdIndex + 4) % this.scale.length] || root + 7);
        }
        return chord;
    }
    
    generateMelody() {
        this.melody = [];
        const patterns = [
            [1, 1, 2], // eighth, eighth, quarter
            [2, 1, 1], // quarter, eighth, eighth
            [4], // whole note
            [1, 1, 1, 1], // four eighths
            [2, 2] // two quarters
        ];
        
        let currentBeat = 0;
        const totalBeats = 32;
        
        while (currentBeat < totalBeats) {
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            for (let duration of pattern) {
                if (currentBeat >= totalBeats) break;
                
                let noteIndex;
                if (this.melody.length === 0) {
                    noteIndex = Math.random() > 0.5 ? 0 : 4;
                } else {
                    const lastNoteIndex = this.melody[this.melody.length - 1].noteIndex;
                    const movement = Math.floor(Math.random() * 5) - 2;
                    noteIndex = Math.max(0, Math.min(this.scale.length - 1, lastNoteIndex + movement));
                }
                
                this.melody.push({
                    note: this.scale[noteIndex],
                    noteIndex: noteIndex,
                    start: currentBeat,
                    duration: duration * 0.5,
                    velocity: 0.6 + Math.random() * 0.3
                });
                
                currentBeat += duration * 0.5;
            }
        }
    }
    
    generateBass() {
        this.bassLine = [];
        
        for (let measure = 0; measure < 8; measure++) {
            const chord = this.chordProgression[measure % this.chordProgression.length];
            const bassNote = chord[0] - 24; // One octave lower
            
            this.bassLine.push({
                note: bassNote,
                start: measure * 4,
                duration: 2,
                velocity: 0.8
            });
            
            this.bassLine.push({
                note: bassNote,
                start: measure * 4 + 2,
                duration: 1.5,
                velocity: 0.7
            });
        }
    }
    
    generatePad() {
        this.padChords = [];
        
        for (let measure = 0; measure < 8; measure++) {
            const chord = this.chordProgression[measure % this.chordProgression.length];
            
            this.padChords.push({
                notes: chord.map(note => note + 12), // One octave higher
                start: measure * 4,
                duration: 4,
                velocity: 0.3
            });
        }
    }
    
    generatePercussion() {
        this.percussion = [];
        
        for (let measure = 0; measure < 8; measure++) {
            const measureStart = measure * 4;
            
            // Kick on beats 1 and 3
            this.percussion.push({
                type: 'kick',
                start: measureStart,
                velocity: 0.8
            });
            this.percussion.push({
                type: 'kick',
                start: measureStart + 2,
                velocity: 0.7
            });
            
            // Hi-hat on all beats
            for (let beat = 0; beat < 4; beat++) {
                this.percussion.push({
                    type: 'hihat',
                    start: measureStart + beat,
                    velocity: 0.65+ Math.random() * 0.2
                });
            }
        }
    }
    
    play() {
        if (!this.audioContext || this.isPlaying) return;
        
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        this.startTime = this.audioContext.currentTime + 0.1;
        this.playButton.disabled = true;
        this.stopButton.disabled = false;
        
        this.scheduleNotes();
        this.animate();
        
        setTimeout(() => {
            if (this.isPlaying) this.stop();
        }, (32 * this.beatDuration + 2) * 1000);
    }
    
    scheduleNotes() {
        // Schedule melody
        this.melody.forEach(note => {
            const startTime = this.startTime + note.start * this.beatDuration;
            const duration = note.duration * this.beatDuration;
            this.playNote(note.note, startTime, duration, note.velocity, 'sine');
        });
        
        // Schedule bass
        this.bassLine.forEach(note => {
            const startTime = this.startTime + note.start * this.beatDuration;
            const duration = note.duration * this.beatDuration;
            this.playNote(note.note, startTime, duration, note.velocity, 'triangle');
        });
        
        // Schedule pad chords
        this.padChords.forEach(chord => {
            const startTime = this.startTime + chord.start * this.beatDuration;
            const duration = chord.duration * this.beatDuration;
            chord.notes.forEach(note => {
                this.playNote(note, startTime, duration, chord.velocity, 'sawtooth');
            });
        });
        
        // Schedule percussion
        this.percussion.forEach(hit => {
            const startTime = this.startTime + hit.start * this.beatDuration;
            if (hit.type === 'kick') {
                this.playKick(startTime, hit.velocity);
            } else if (hit.type === 'hihat') {
                this.playHiHat(startTime, hit.velocity);
            }
        });
    }
    
    playNote(midiNote, startTime, duration, velocity, waveform = 'sine') {
        const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
        
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = waveform;
        oscillator.frequency.value = frequency;
        
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 1;
        
        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(velocity * 0.5, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(velocity * 0.1, startTime + duration * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
        
        this.scheduledNotes.push(oscillator);
    }
    
    playKick(startTime, velocity) {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 60;
        oscillator.frequency.exponentialRampToValueAtTime(30, startTime + 0.1);
        
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
    }
    
    playHiHat(startTime, velocity) {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(startTime);
    }
    
    stop() {
        this.isPlaying = false;
        this.playButton.disabled = false;
        this.stopButton.disabled = true;
        
        this.scheduledNotes.forEach(node => {
            try {
                node.stop();
            } catch (e) {
                // Node might already be stopped
            }
        });
        this.scheduledNotes = [];
        
        this.generateComposition();
        this.draw();
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        const currentTime = this.audioContext.currentTime - this.startTime;
        this.currentBeat = currentTime / this.beatDuration;
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    draw() {
        this.ctx.fillStyle = '#0a0a23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawWaveform();
        this.drawInfo();
        
        if (this.isPlaying) {
            this.drawProgress();
        }
    }
    
    drawWaveform() {
        const centerY = this.canvas.height / 2;
        const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
        
        for (let i = 0; i < 4; i++) {
            const amplitude = 20 + Math.random() * 30;
            const phase = Date.now() * 0.001 + i;
            
            this.ctx.strokeStyle = colors[i];
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            for (let x = 0; x < this.canvas.width; x += 2) {
                const wave = Math.sin((x * 0.02) + phase) * amplitude;
                const y = centerY + wave + i * 20 - 30;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            this.ctx.stroke();
        }
    }
    
    drawInfo() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Scale: ${this.scaleName.charAt(0).toUpperCase() + this.scaleName.slice(1)}`, 10, 25);
        this.ctx.fillText(`Root: ${this.rootNote}`, 10, 45);
        this.ctx.fillText(`BPM: ${this.bpm}`, 10, 65);
        
        if (this.isPlaying) {
            this.ctx.fillStyle = '#18FF92';
            this.ctx.fillText('♪ Playing...', 10, 85);
        }
    }
    
    drawProgress() {
        const progress = (this.currentBeat / 32) * this.canvas.width;
        this.ctx.fillStyle = 'rgba(255, 20, 97, 0.5)';
        this.ctx.fillRect(0, this.canvas.height - 5, progress, 5);
    }
}

// Initialize when DOM is ready
(function() {
    console.log('Initializing Cosmic Symphony...');
    const canvas = document.getElementById('cosmicSymphonyCanvas');
    const playButton = document.getElementById('cosmicSymphonyPlayBtn');
    const stopButton = document.getElementById('cosmicSymphonyStopBtn');
    
    if (canvas && playButton && stopButton) {
        console.log('Creating CosmicSymphony instance');
        new CosmicSymphony('cosmicSymphonyCanvas', 'cosmicSymphonyPlayBtn', 'cosmicSymphonyStopBtn');
    } else {
        console.error('Required elements not found for Cosmic Symphony', {canvas, playButton, stopButton});
    }
})(); 