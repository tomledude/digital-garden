// Aurora Fields - Colorful Generative Art using Perlin Noise
// Creates flowing, aurora-like patterns with vibrant colors

class AuroraFields {
    constructor(canvasId, buttonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.button = document.getElementById(buttonId);
        
        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 600;
        
        // Perlin noise parameters
        this.permutation = [];
        this.p = [];
        
        // Initialize and bind events
        this.initializeNoise();
        this.generate();
        this.button.addEventListener('click', () => this.generate());
    }
    
    // Initialize Perlin noise permutation table
    initializeNoise() {
        // Create permutation array (simplified Perlin noise)
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = Math.floor(Math.random() * 256);
        }
        
        // Duplicate the permutation array
        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i % 256];
        }
    }
    
    // Fade function for smooth interpolation
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    // Linear interpolation
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    // Gradient function
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    // 2D Perlin noise function
    noise(x, y) {
        // Find unit grid cell containing point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        
        // Get relative x,y coordinates of point within that cell
        x -= Math.floor(x);
        y -= Math.floor(y);
        
        // Compute fade curves for each coordinate
        const u = this.fade(x);
        const v = this.fade(y);
        
        // Hash coordinates of the 4 grid corners
        const a = this.p[X] + Y;
        const aa = this.p[a];
        const ab = this.p[a + 1];
        const b = this.p[X + 1] + Y;
        const ba = this.p[b];
        const bb = this.p[b + 1];
        
        // Add blended results from 4 corners of the grid
        return this.lerp(v, 
            this.lerp(u, this.grad(this.p[aa], x, y), this.grad(this.p[ba], x - 1, y)),
            this.lerp(u, this.grad(this.p[ab], x, y - 1), this.grad(this.p[bb], x - 1, y - 1))
        );
    }
    
    // Fractal/Octave noise for more complex patterns
    fractalNoise(x, y, octaves = 4, persistence = 0.5, scale = 0.1) {
        let value = 0;
        let amplitude = 1;
        let frequency = scale;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            value += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return value / maxValue;
    }
    
    // Generate color palettes
    generateColorPalettes() {
        const palettes = [
            // Aurora Borealis
            [
                { r: 0, g: 255, b: 127 },   // Aurora green
                { r: 64, g: 224, b: 255 },  // Sky blue
                { r: 138, g: 43, b: 226 },  // Purple
                { r: 255, g: 20, b: 147 },  // Deep pink
                { r: 0, g: 191, b: 255 }    // Electric blue
            ],
            // Sunset Dreams
            [
                { r: 255, g: 94, b: 77 },   // Coral
                { r: 255, g: 154, b: 0 },   // Orange
                { r: 255, g: 206, b: 84 },  // Golden
                { r: 255, g: 107, b: 107 }, // Pink
                { r: 78, g: 84, b: 200 }    // Twilight purple
            ],
            // Ocean Depths
            [
                { r: 72, g: 209, b: 204 },  // Turquoise
                { r: 64, g: 224, b: 255 },  // Sky blue
                { r: 0, g: 123, b: 255 },   // Blue
                { r: 106, g: 90, b: 205 },  // Slate blue
                { r: 138, g: 43, b: 226 }   // Blue violet
            ],
            // Cosmic Fire
            [
                { r: 255, g: 71, b: 87 },   // Red
                { r: 255, g: 154, b: 0 },   // Orange
                { r: 255, g: 193, b: 7 },   // Gold
                { r: 199, g: 0, b: 57 },    // Crimson
                { r: 144, g: 19, b: 254 }   // Electric purple
            ],
            // Psychedelic
            [
                { r: 255, g: 0, b: 255 },   // Magenta
                { r: 0, g: 255, b: 255 },   // Cyan
                { r: 255, g: 255, b: 0 },   // Yellow
                { r: 255, g: 0, b: 128 },   // Hot pink
                { r: 128, g: 255, b: 0 }    // Lime
            ]
        ];
        
        return palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    // Interpolate between colors
    interpolateColor(color1, color2, factor) {
        return {
            r: Math.round(color1.r + (color2.r - color1.r) * factor),
            g: Math.round(color1.g + (color2.g - color1.g) * factor),
            b: Math.round(color1.b + (color2.b - color1.b) * factor)
        };
    }
    
    // Get color from palette based on noise value
    getColorFromNoise(noiseValue, palette) {
        // Normalize noise value to [0, 1]
        const normalizedValue = (noiseValue + 1) / 2;
        
        // Map to palette index
        const paletteIndex = normalizedValue * (palette.length - 1);
        const lowerIndex = Math.floor(paletteIndex);
        const upperIndex = Math.min(lowerIndex + 1, palette.length - 1);
        const factor = paletteIndex - lowerIndex;
        
        return this.interpolateColor(palette[lowerIndex], palette[upperIndex], factor);
    }
    
    generate() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#000014';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reinitialize noise for new pattern
        this.initializeNoise();
        
        // Generate color palette
        const palette = this.generateColorPalettes();
        
        // Random parameters for this generation
        const artStyle = Math.floor(Math.random() * 4);
        
        switch (artStyle) {
            case 0:
                this.generateAuroraFlow(palette);
                break;
            case 1:
                this.generateColorFields(palette);
                break;
            case 2:
                this.generatePsychedelicWaves(palette);
                break;
            case 3:
                this.generateIridescentClouds(palette);
                break;
        }
        
        // Add atmospheric effects
        this.addAtmosphericEffects(palette);
    }
    
    generateAuroraFlow(palette) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale = Math.random() * 0.008 + 0.003;
        const timeOffset = Math.random() * 1000;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Multiple layers of flowing noise
                const flow1 = this.fractalNoise(x, y + timeOffset, 6, 0.5, scale);
                const flow2 = this.fractalNoise(x + 500, y + timeOffset * 0.7, 4, 0.6, scale * 1.5);
                const flow3 = this.fractalNoise(x + 1000, y + timeOffset * 0.3, 8, 0.4, scale * 0.8);
                
                // Combine flows for aurora-like movement
                const combinedFlow = (flow1 + flow2 * 0.7 + flow3 * 0.5) / 2.2;
                
                // Add vertical bias for aurora effect
                const verticalBias = Math.sin((y / this.canvas.height) * Math.PI * 2) * 0.3;
                const finalNoise = combinedFlow + verticalBias;
                
                const color = this.getColorFromNoise(finalNoise, palette);
                
                // Apply aurora-like alpha based on noise intensity
                const intensity = Math.abs(finalNoise);
                const alpha = Math.min(255, Math.max(0, intensity * 200 + 50));
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = color.r;
                data[index + 1] = color.g;
                data[index + 2] = color.b;
                data[index + 3] = alpha;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateColorFields(palette) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale1 = Math.random() * 0.012 + 0.004;
        const scale2 = Math.random() * 0.008 + 0.002;
        const warpStrength = Math.random() * 100 + 50;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Domain warping for interesting field distortions
                const warpX = x + this.fractalNoise(x * 0.005, y * 0.005, 3, 0.5, 0.01) * warpStrength;
                const warpY = y + this.fractalNoise(x * 0.005 + 100, y * 0.005 + 100, 3, 0.5, 0.01) * warpStrength;
                
                // Multiple noise layers for complex color fields
                const field1 = this.fractalNoise(warpX, warpY, 6, 0.5, scale1);
                const field2 = this.fractalNoise(warpX + 200, warpY + 200, 4, 0.6, scale2);
                
                // Blend fields
                const blendedField = (field1 + field2 * 0.8) / 1.8;
                
                const color = this.getColorFromNoise(blendedField, palette);
                
                // Smooth alpha variations
                const alpha = Math.min(255, Math.max(100, (Math.abs(blendedField) + 0.5) * 200));
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = color.r;
                data[index + 1] = color.g;
                data[index + 2] = color.b;
                data[index + 3] = alpha;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generatePsychedelicWaves(palette) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const waveScale = Math.random() * 0.08 + 0.03;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Distance and angle from center
                const dx = x - centerX;
                const dy = y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                
                // Combine radial and angular patterns with noise
                const radialWave = Math.sin(dist * waveScale + this.fractalNoise(x, y, 4, 0.5, 0.01) * 8);
                const angularWave = Math.cos(angle * 6 + this.fractalNoise(x + 300, y + 300, 3, 0.6, 0.015) * 5);
                const noiseLayer = this.fractalNoise(x, y, 8, 0.4, 0.012);
                
                // Combine for psychedelic effect
                const combined = (radialWave + angularWave + noiseLayer) / 3;
                
                const color = this.getColorFromNoise(combined, palette);
                
                // Vibrant alpha with pulsing effect
                const pulse = Math.sin(dist * 0.02 + combined * 4) * 0.3 + 0.7;
                const alpha = Math.min(255, Math.max(80, pulse * 255));
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = color.r;
                data[index + 1] = color.g;
                data[index + 2] = color.b;
                data[index + 3] = alpha;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateIridescentClouds(palette) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale = Math.random() * 0.015 + 0.005;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Multi-layer cloud formation
                const cloud1 = this.fractalNoise(x, y, 8, 0.5, scale);
                const cloud2 = this.fractalNoise(x + 1000, y + 1000, 6, 0.6, scale * 1.5);
                const cloud3 = this.fractalNoise(x + 2000, y + 2000, 4, 0.7, scale * 2);
                
                // Iridescent color shifting
                const colorPhase = (cloud1 + cloud2 * 0.5) * Math.PI;
                const iridescence = Math.sin(colorPhase) * 0.5 + 0.5;
                
                // Blend clouds
                const cloudDensity = (cloud1 + cloud2 * 0.7 + cloud3 * 0.5) / 2.2;
                
                // Modify color based on iridescence
                const baseColor = this.getColorFromNoise(cloudDensity, palette);
                const shiftedColor = this.getColorFromNoise(cloudDensity + iridescence, palette);
                
                const finalColor = this.interpolateColor(baseColor, shiftedColor, iridescence);
                
                // Cloud-like alpha
                const alpha = Math.min(255, Math.max(0, (Math.abs(cloudDensity) + 0.2) * 180));
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = finalColor.r;
                data[index + 1] = finalColor.g;
                data[index + 2] = finalColor.b;
                data[index + 3] = alpha;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    addAtmosphericEffects(palette) {
        // Add some glowing particles
        const particleCount = Math.floor(Math.random() * 80) + 40;
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 4 + 1;
            const colorIndex = Math.floor(Math.random() * palette.length);
            const color = palette[colorIndex];
            
            // Create glow effect
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
            
            this.ctx.save();
            this.ctx.fillStyle = gradient;
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // Add some flowing light streaks
        const streakCount = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < streakCount; i++) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 150 + 100;
            const colorIndex = Math.floor(Math.random() * palette.length);
            const color = palette[colorIndex];
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.3 + Math.random() * 0.4;
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
            this.ctx.lineWidth = Math.random() * 3 + 1;
            this.ctx.lineCap = 'round';
            
            // Add glow to the line
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(
                startX + Math.cos(angle) * length,
                startY + Math.sin(angle) * length
            );
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Aurora Fields...');
    const canvas = document.getElementById('auroraFieldsCanvas');
    const button = document.getElementById('auroraFieldsRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating AuroraFields instance');
        new AuroraFields('auroraFieldsCanvas', 'auroraFieldsRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Aurora Fields', {canvas, button});
    }
})(); 