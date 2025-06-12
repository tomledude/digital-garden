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
        // Vary BPM between songs for uniqueness (round number)
        this.bpm = Math.floor(60 + Math.random() * 40); // BPM between 60-99 (whole numbers)
        this.beatDuration = 60 / this.bpm;
        
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
        
        // Generate different drum patterns for variety
        const patterns = [
            'basic', 'syncopated', 'complex', 'minimal'
        ];
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        for (let measure = 0; measure < 8; measure++) {
            const measureStart = measure * 4;
            
            // Kick drum patterns
            this.addKickPattern(measureStart, selectedPattern);
            
            // Snare drum on beats 2 and 4 (classic)
            this.addSnarePattern(measureStart, selectedPattern);
            
            // Hi-hat patterns with variation
            this.addHiHatPattern(measureStart, selectedPattern);
            
            // Additional percussion elements
            if (Math.random() > 0.6) {
                this.addPerussionFills(measureStart, selectedPattern);
            }
        }
    }
    
    addKickPattern(measureStart, pattern) {
        switch(pattern) {
            case 'basic':
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
                break;
                
            case 'syncopated':
                // Kick on 1, 2.5, 4
                this.percussion.push({
                    type: 'kick',
                    start: measureStart,
                    velocity: 0.8
                });
                this.percussion.push({
                    type: 'kick',
                    start: measureStart + 2.5,
                    velocity: 0.6
                });
                this.percussion.push({
                    type: 'kick',
                    start: measureStart + 3.75,
                    velocity: 0.7
                });
                break;
                
            case 'complex':
                // More intricate kick pattern
                this.percussion.push({
                    type: 'kick',
                    start: measureStart,
                    velocity: 0.8
                });
                this.percussion.push({
                    type: 'kick',
                    start: measureStart + 1.5,
                    velocity: 0.6
                });
                this.percussion.push({
                    type: 'kick',
                    start: measureStart + 2.75,
                    velocity: 0.7
                });
                break;
                
            case 'minimal':
                // Just beat 1
                this.percussion.push({
                    type: 'kick',
                    start: measureStart,
                    velocity: 0.8
                });
                break;
        }
    }
    
    addSnarePattern(measureStart, pattern) {
        switch(pattern) {
            case 'basic':
            case 'minimal':
                // Classic snare on 2 and 4
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 1,
                    velocity: 0.7
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 3,
                    velocity: 0.7
                });
                break;
                
            case 'syncopated':
                // Snare with some syncopation
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 1,
                    velocity: 0.7
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 2.25,
                    velocity: 0.5
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 3,
                    velocity: 0.7
                });
                break;
                
            case 'complex':
                // More complex snare pattern
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 1,
                    velocity: 0.7
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 1.75,
                    velocity: 0.4
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 3,
                    velocity: 0.7
                });
                this.percussion.push({
                    type: 'snare',
                    start: measureStart + 3.5,
                    velocity: 0.5
                });
                break;
        }
    }
    
    addHiHatPattern(measureStart, pattern) {
        switch(pattern) {
            case 'basic':
                // Standard eighth note hi-hats
                for (let beat = 0; beat < 4; beat += 0.5) {
                    this.percussion.push({
                        type: 'hihat',
                        start: measureStart + beat,
                        velocity: 0.4 + Math.random() * 0.2,
                        closed: beat % 1 !== 0 // Closed on off-beats
                    });
                }
                break;
                
            case 'syncopated':
                // More interesting hi-hat rhythm
                const syncoHiHats = [0, 0.25, 0.75, 1, 1.5, 2, 2.25, 2.75, 3, 3.25, 3.75];
                syncoHiHats.forEach(beat => {
                    this.percussion.push({
                        type: 'hihat',
                        start: measureStart + beat,
                        velocity: 0.3 + Math.random() * 0.3,
                        closed: Math.random() > 0.3
                    });
                });
                break;
                
            case 'complex':
                // Sixteenth note patterns with gaps
                for (let beat = 0; beat < 4; beat += 0.25) {
                    if (Math.random() > 0.3) { // Skip some hits for groove
                        this.percussion.push({
                            type: 'hihat',
                            start: measureStart + beat,
                            velocity: 0.25 + Math.random() * 0.35,
                            closed: Math.random() > 0.4
                        });
                    }
                }
                break;
                
            case 'minimal':
                // Just on quarter notes
                for (let beat = 0; beat < 4; beat++) {
                    this.percussion.push({
                        type: 'hihat',
                        start: measureStart + beat,
                        velocity: 0.5 + Math.random() * 0.2,
                        closed: true
                    });
                }
                break;
        }
    }
    
    addPerussionFills(measureStart, pattern) {
        // Add occasional percussion fills and accents
        if (Math.random() > 0.7) {
            // Crash cymbal at start of some measures
            this.percussion.push({
                type: 'crash',
                start: measureStart,
                velocity: 0.6
            });
        }
        
        if (Math.random() > 0.8) {
            // Rim shot accent
            this.percussion.push({
                type: 'rimshot',
                start: measureStart + 1.5 + Math.random() * 1,
                velocity: 0.5
            });
        }
        
        if (Math.random() > 0.85) {
            // Tambourine shake
            this.percussion.push({
                type: 'tambourine',
                start: measureStart + 2 + Math.random() * 1.5,
                velocity: 0.4
            });
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
        const currentTime = this.audioContext.currentTime;
        
        // Schedule melody
        this.melody.forEach(note => {
            const startTime = this.startTime + note.start * this.beatDuration;
            const duration = note.duration * this.beatDuration;
            // Only schedule if startTime is in the future
            if (startTime > currentTime) {
                try {
                    this.playNote(note.note, startTime, duration, note.velocity, 'sine');
                } catch (e) {
                    console.warn('Failed to schedule melody note:', e);
                }
            }
        });
        
        // Schedule bass
        this.bassLine.forEach(note => {
            const startTime = this.startTime + note.start * this.beatDuration;
            const duration = note.duration * this.beatDuration;
            if (startTime > currentTime) {
                try {
                    this.playNote(note.note, startTime, duration, note.velocity, 'triangle');
                } catch (e) {
                    console.warn('Failed to schedule bass note:', e);
                }
            }
        });
        
        // Schedule pad chords
        this.padChords.forEach(chord => {
            const startTime = this.startTime + chord.start * this.beatDuration;
            const duration = chord.duration * this.beatDuration;
            if (startTime > currentTime) {
                chord.notes.forEach(note => {
                    try {
                        this.playNote(note, startTime, duration, chord.velocity, 'sawtooth');
                    } catch (e) {
                        console.warn('Failed to schedule pad note:', e);
                    }
                });
            }
        });
        
        // Schedule percussion
        this.percussion.forEach(hit => {
            const startTime = this.startTime + hit.start * this.beatDuration;
            if (startTime > currentTime) {
                try {
                    if (hit.type === 'kick') {
                        this.playKick(startTime, hit.velocity);
                    } else if (hit.type === 'hihat') {
                        this.playHiHat(startTime, hit.velocity, hit.closed);
                    } else if (hit.type === 'snare') {
                        this.playSnare(startTime, hit.velocity);
                    } else if (hit.type === 'crash') {
                        this.playCrash(startTime, hit.velocity);
                    } else if (hit.type === 'rimshot') {
                        this.playRimshot(startTime, hit.velocity);
                    } else if (hit.type === 'tambourine') {
                        this.playTambourine(startTime, hit.velocity);
                    }
                } catch (e) {
                    console.warn('Failed to schedule percussion:', hit.type, e);
                }
            }
        });
    }
    
    playNote(midiNote, startTime, duration, velocity, waveform = 'sine') {
        // Validate timing to prevent audio scheduling issues
        if (startTime < this.audioContext.currentTime) {
            console.warn('Attempted to schedule note in the past, skipping');
            return;
        }
        
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
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
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
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(oscillator);
    }
    
    playHiHat(startTime, velocity, closed = true) {
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        // Closed hi-hats are higher frequency, open hi-hats are lower
        filter.frequency.value = closed ? 10000 : 6000;
        
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity * 0.3, startTime);
        // Open hi-hats ring longer than closed ones
        const decayTime = closed ? 0.05 : 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + decayTime);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(startTime);
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(noise);
    }
    
    playSnare(startTime, velocity) {
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 100;
        oscillator.frequency.exponentialRampToValueAtTime(50, startTime + 0.1);
        
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(oscillator);
    }
    
    playCrash(startTime, velocity) {
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(startTime);
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(noise);
    }
    
    playRimshot(startTime, velocity) {
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const gain = this.audioContext.createGain();
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(startTime);
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(noise);
    }
    
    playTambourine(startTime, velocity) {
        // Validate timing
        if (startTime < this.audioContext.currentTime) {
            return;
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 200;
        oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);
        
        gain.gain.value = 0;
        gain.gain.setValueAtTime(velocity, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(this.masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
        
        // Track this node so it can be stopped
        this.scheduledNotes.push(oscillator);
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