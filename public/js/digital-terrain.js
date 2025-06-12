// Digital Terrain - Generative Art using Perlin Noise
// Creates bold black and white patterns using Perlin noise algorithms

class DigitalTerrain {
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
    
    generate() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reinitialize noise for new pattern
        this.initializeNoise();
        
        // Random parameters for this generation
        const artStyle = Math.floor(Math.random() * 4);
        
        switch (artStyle) {
            case 0:
                this.generateTerrainMap();
                break;
            case 1:
                this.generateCloudFormation();
                break;
            case 2:
                this.generateAbstractPattern();
                break;
            case 3:
                this.generateWaveInterference();
                break;
        }
        
        // Add some post-processing effects
        this.addNoiseTexture();
    }
    
    generateTerrainMap() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale = Math.random() * 0.02 + 0.005; // 0.005-0.025
        const octaves = Math.floor(Math.random() * 6) + 3; // 3-8 octaves
        const persistence = Math.random() * 0.6 + 0.2; // 0.2-0.8
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                const noise = this.fractalNoise(x, y, octaves, persistence, scale);
                
                // Convert noise to height-based black/white with sharp contrasts
                let value;
                if (noise > 0.3) {
                    value = 255; // White peaks
                } else if (noise > 0.1) {
                    value = Math.floor((noise - 0.1) / 0.2 * 255); // Gradual slopes
                } else if (noise > -0.1) {
                    value = 50; // Dark valleys
                } else {
                    value = 0; // Black depths
                }
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = value;     // Red
                data[index + 1] = value; // Green
                data[index + 2] = value; // Blue
                data[index + 3] = 255;   // Alpha
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateCloudFormation() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale1 = Math.random() * 0.015 + 0.005;
        const scale2 = Math.random() * 0.03 + 0.01;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Layer multiple noise patterns
                const noise1 = this.fractalNoise(x, y, 4, 0.5, scale1);
                const noise2 = this.fractalNoise(x + 1000, y + 1000, 6, 0.3, scale2);
                
                const combined = (noise1 + noise2 * 0.5) / 1.5;
                
                // Create cloud-like formations with sharp contrasts
                let value;
                if (combined > 0.4) {
                    value = 255; // Bright clouds
                } else if (combined > 0.2) {
                    value = Math.floor(Math.random() * 100 + 100); // Textured mid-tones
                } else if (combined > 0) {
                    value = Math.floor(Math.random() * 80 + 20); // Dark areas
                } else {
                    value = 0; // Deep black
                }
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = value;
                data[index + 1] = value;
                data[index + 2] = value;
                data[index + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateAbstractPattern() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const scale = Math.random() * 0.02 + 0.01;
        const warpStrength = Math.random() * 50 + 20;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Domain warping for more interesting patterns
                const warpX = x + this.fractalNoise(x * 0.01, y * 0.01, 3, 0.5, 0.01) * warpStrength;
                const warpY = y + this.fractalNoise(x * 0.01 + 100, y * 0.01 + 100, 3, 0.5, 0.01) * warpStrength;
                
                const noise = this.fractalNoise(warpX, warpY, 6, 0.6, scale);
                
                // Create bold geometric-like patterns
                const pattern1 = Math.sin(noise * Math.PI * 4);
                const pattern2 = Math.cos(noise * Math.PI * 3);
                const combined = (pattern1 + pattern2) / 2;
                
                let value = combined > 0 ? 255 : 0;
                
                // Add some texture variation
                if (Math.random() < 0.1) {
                    value = Math.floor(Math.random() * 100 + 50);
                }
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = value;
                data[index + 1] = value;
                data[index + 2] = value;
                data[index + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    generateWaveInterference() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const waveScale = Math.random() * 0.05 + 0.02;
        
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Distance from center
                const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                // Combine radial waves with noise
                const radialWave = Math.sin(dist * waveScale + this.fractalNoise(x, y, 4, 0.5, 0.01) * 10);
                const noise = this.fractalNoise(x, y, 8, 0.4, 0.008);
                
                const combined = (radialWave + noise) / 2;
                
                // Create stark contrasts
                let value;
                if (combined > 0.3) {
                    value = 255;
                } else if (combined > -0.3) {
                    value = Math.floor((combined + 0.3) / 0.6 * 255);
                } else {
                    value = 0;
                }
                
                const index = (y * this.canvas.width + x) * 4;
                data[index] = value;
                data[index + 1] = value;
                data[index + 2] = value;
                data[index + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    addNoiseTexture() {
        // Add subtle texture and grain
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.02) { // 2% chance
                const grain = (Math.random() - 0.5) * 40;
                data[i] = Math.max(0, Math.min(255, data[i] + grain));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        
        // Add some bold accent lines
        this.addAccentLines();
    }
    
    addAccentLines() {
        const lineCount = Math.floor(Math.random() * 8) + 3;
        
        for (let i = 0; i < lineCount; i++) {
            this.ctx.save();
            this.ctx.strokeStyle = Math.random() > 0.5 ? '#FFFFFF' : '#000000';
            this.ctx.lineWidth = Math.random() * 4 + 1;
            this.ctx.globalAlpha = 0.6 + Math.random() * 0.4;
            
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 200 + 100;
            
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
    console.log('Initializing Digital Terrain...');
    const canvas = document.getElementById('digitalTerrainCanvas');
    const button = document.getElementById('digitalTerrainRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating DigitalTerrain instance');
        new DigitalTerrain('digitalTerrainCanvas', 'digitalTerrainRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Digital Terrain', {canvas, button});
    }
})(); 