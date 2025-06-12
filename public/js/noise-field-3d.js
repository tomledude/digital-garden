// 3D Noise Field - Advanced 3D Perlin Noise Generative Art
// Creates animated 3D noise visualizations with depth slicing and volumetric effects

class NoiseField3D {
    constructor(canvasId, buttonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.button = document.getElementById(buttonId);
        
        // Set canvas size
        this.canvas.width = 700;
        this.canvas.height = 700;
        
        // 3D Perlin noise parameters
        this.permutation = [];
        this.p = [];
        
        // Animation parameters
        this.animationFrame = null;
        this.startTime = null;
        this.isAnimating = false;
        this.animationSpeed = 0.005;
        
        // Visualization parameters
        this.depthLayers = 50;
        this.currentDepth = 0;
        this.visualizationMode = 0; // 0: depth slicing, 1: volumetric, 2: isometric, 3: particles
        
        // Initialize and bind events
        this.initializeNoise();
        this.generate();
        this.button.addEventListener('click', () => this.generate());
    }
    
    // Initialize 3D Perlin noise permutation table
    initializeNoise() {
        // Create permutation array
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
    
    // 3D Gradient function
    grad3d(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    // 3D Perlin noise function
    noise3D(x, y, z) {
        // Find unit grid cell containing point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        // Get relative x,y,z coordinates of point within that cell
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        // Compute fade curves for each coordinate
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        
        // Hash coordinates of the 8 cube corners
        const a = this.p[X] + Y;
        const aa = this.p[a] + Z;
        const ab = this.p[a + 1] + Z;
        const b = this.p[X + 1] + Y;
        const ba = this.p[b] + Z;
        const bb = this.p[b + 1] + Z;
        
        // Add blended results from 8 corners of the cube
        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad3d(this.p[aa], x, y, z), this.grad3d(this.p[ba], x - 1, y, z)),
                this.lerp(u, this.grad3d(this.p[ab], x, y - 1, z), this.grad3d(this.p[bb], x - 1, y - 1, z))
            ),
            this.lerp(v,
                this.lerp(u, this.grad3d(this.p[aa + 1], x, y, z - 1), this.grad3d(this.p[ba + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad3d(this.p[ab + 1], x, y - 1, z - 1), this.grad3d(this.p[bb + 1], x - 1, y - 1, z - 1))
            )
        );
    }
    
    // Fractal 3D noise
    fractalNoise3D(x, y, z, octaves = 4, persistence = 0.5, scale = 0.1) {
        let value = 0;
        let amplitude = 1;
        let frequency = scale;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            value += this.noise3D(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return value / maxValue;
    }
    
    generate() {
        // Stop current animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Reinitialize noise for new pattern
        this.initializeNoise();
        
        // Random visualization mode
        this.visualizationMode = Math.floor(Math.random() * 4);
        
        // Random parameters
        this.animationSpeed = Math.random() * 0.008 + 0.002;
        this.noiseScale = Math.random() * 0.015 + 0.005;
        this.octaves = Math.floor(Math.random() * 6) + 3;
        
        // Generate color palette
        this.generateColorPalette();
        
        // Start animation
        this.startTime = performance.now();
        this.isAnimating = true;
        this.animate();
    }
    
    generateColorPalette() {
        const palettes = [
            // Deep Ocean
            ['#001f3f', '#0074D9', '#39CCCC', '#2ECC40', '#01FF70'],
            // Fire
            ['#111111', '#8B0000', '#FF4500', '#FFD700', '#FFFFFF'],
            // Aurora
            ['#0a0a23', '#1a4c6e', '#00ffcc', '#ff00ff', '#ffff00'],
            // Cosmic
            ['#2c1810', '#8B008B', '#4B0082', '#FF1493', '#00CED1'],
            // Neon
            ['#000000', '#FF0080', '#00FF80', '#8000FF', '#FF8000']
        ];
        
        this.colorPalette = palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    getColorFromValue(value, alpha = 1) {
        // Normalize value to [0, 1]
        const normalizedValue = Math.max(0, Math.min(1, (value + 1) / 2));
        
        // Map to palette
        const paletteIndex = normalizedValue * (this.colorPalette.length - 1);
        const lowerIndex = Math.floor(paletteIndex);
        const upperIndex = Math.min(lowerIndex + 1, this.colorPalette.length - 1);
        const factor = paletteIndex - lowerIndex;
        
        // Interpolate between colors
        const color1 = this.hexToRgb(this.colorPalette[lowerIndex]);
        const color2 = this.hexToRgb(this.colorPalette[upperIndex]);
        
        const r = Math.round(color1.r + (color2.r - color1.r) * factor);
        const g = Math.round(color1.g + (color2.g - color1.g) * factor);
        const b = Math.round(color1.b + (color2.b - color1.b) * factor);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;
        const timeOffset = elapsed * this.animationSpeed;
        
        // Clear canvas
        this.ctx.fillStyle = '#000010';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Choose visualization method
        switch (this.visualizationMode) {
            case 0:
                this.renderDepthSlicing(timeOffset);
                break;
            case 1:
                this.renderVolumetric(timeOffset);
                break;
            case 2:
                this.renderIsometric(timeOffset);
                break;
            case 3:
                this.renderParticleField(timeOffset);
                break;
        }
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    renderDepthSlicing(timeOffset) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Current depth slice
        const currentZ = Math.sin(timeOffset) * 20 + timeOffset * 0.5;
        
        for (let x = 0; x < this.canvas.width; x += 2) {
            for (let y = 0; y < this.canvas.height; y += 2) {
                const noise = this.fractalNoise3D(
                    x, y, currentZ,
                    this.octaves, 0.5, this.noiseScale
                );
                
                const color = this.hexToRgb(this.getColorFromValue(noise).slice(5, -1).split(',').slice(0, 3).join(','));
                const alpha = Math.max(0, Math.min(255, (Math.abs(noise) + 0.3) * 255));
                
                // Draw 2x2 pixel blocks for performance
                for (let dx = 0; dx < 2; dx++) {
                    for (let dy = 0; dy < 2; dy++) {
                        const pixelX = x + dx;
                        const pixelY = y + dy;
                        if (pixelX < this.canvas.width && pixelY < this.canvas.height) {
                            const index = (pixelY * this.canvas.width + pixelX) * 4;
                            data[index] = color.r;
                            data[index + 1] = color.g;
                            data[index + 2] = color.b;
                            data[index + 3] = alpha;
                        }
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    renderVolumetric(timeOffset) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let x = 0; x < this.canvas.width; x += 3) {
            for (let y = 0; y < this.canvas.height; y += 3) {
                let density = 0;
                let colorAccum = { r: 0, g: 0, b: 0 };
                
                // Sample multiple depth layers
                for (let z = 0; z < 20; z++) {
                    const noise = this.fractalNoise3D(
                        x, y, z + timeOffset * 10,
                        this.octaves, 0.6, this.noiseScale
                    );
                    
                    if (noise > 0.1) {
                        const layerDensity = Math.max(0, noise - 0.1) * 0.1;
                        density += layerDensity;
                        
                        const color = this.hexToRgb(this.getColorFromValue(noise).slice(5, -1).split(',').slice(0, 3).join(','));
                        colorAccum.r += color.r * layerDensity;
                        colorAccum.g += color.g * layerDensity;
                        colorAccum.b += color.b * layerDensity;
                    }
                }
                
                if (density > 0) {
                    const finalR = Math.round(colorAccum.r / density);
                    const finalG = Math.round(colorAccum.g / density);
                    const finalB = Math.round(colorAccum.b / density);
                    const alpha = Math.min(255, density * 500);
                    
                    // Draw 3x3 pixel blocks
                    for (let dx = 0; dx < 3; dx++) {
                        for (let dy = 0; dy < 3; dy++) {
                            const pixelX = x + dx;
                            const pixelY = y + dy;
                            if (pixelX < this.canvas.width && pixelY < this.canvas.height) {
                                const index = (pixelY * this.canvas.width + pixelX) * 4;
                                data[index] = finalR;
                                data[index + 1] = finalG;
                                data[index + 2] = finalB;
                                data[index + 3] = alpha;
                            }
                        }
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    renderIsometric(timeOffset) {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        for (let x = 0; x < this.canvas.width; x += 2) {
            for (let y = 0; y < this.canvas.height; y += 2) {
                // Convert to isometric coordinates
                const isoX = (x - centerX) * 0.01;
                const isoY = (y - centerY) * 0.01;
                
                // Sample 3D noise for height
                const height = this.fractalNoise3D(
                    isoX, isoY, timeOffset,
                    this.octaves, 0.5, this.noiseScale * 2
                ) * 30;
                
                // Create pseudo-3D effect
                const projectedY = y + height;
                const lighting = Math.max(0.3, 1 - Math.abs(height) * 0.02);
                
                const color = this.hexToRgb(this.getColorFromValue(height * 0.1).slice(5, -1).split(',').slice(0, 3).join(','));
                
                // Draw with lighting
                for (let dx = 0; dx < 2; dx++) {
                    for (let dy = 0; dy < 2; dy++) {
                        const pixelX = x + dx;
                        const pixelY = Math.round(projectedY) + dy;
                        if (pixelX < this.canvas.width && pixelY >= 0 && pixelY < this.canvas.height) {
                            const index = (pixelY * this.canvas.width + pixelX) * 4;
                            data[index] = Math.round(color.r * lighting);
                            data[index + 1] = Math.round(color.g * lighting);
                            data[index + 2] = Math.round(color.b * lighting);
                            data[index + 3] = 200;
                        }
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    renderParticleField(timeOffset) {
        this.ctx.fillStyle = '#000010';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const particleCount = 3000;
        
        for (let i = 0; i < particleCount; i++) {
            // Particle base position
            const baseX = (i % 50) * (this.canvas.width / 50);
            const baseY = Math.floor(i / 50) * (this.canvas.height / 60);
            
            // Use 3D noise to displace particles
            const noiseX = this.fractalNoise3D(baseX * 0.01, baseY * 0.01, timeOffset, 4, 0.5, 0.02);
            const noiseY = this.fractalNoise3D(baseX * 0.01 + 100, baseY * 0.01 + 100, timeOffset, 4, 0.5, 0.02);
            const noiseZ = this.fractalNoise3D(baseX * 0.01 + 200, baseY * 0.01 + 200, timeOffset, 4, 0.5, 0.02);
            
            const x = baseX + noiseX * 100;
            const y = baseY + noiseY * 100;
            const size = Math.max(1, (noiseZ + 1) * 3);
            const alpha = Math.max(0.2, Math.abs(noiseZ));
            
            if (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height) {
                const color = this.getColorFromValue(noiseZ, alpha);
                
                // Draw particle with glow
                this.ctx.save();
                this.ctx.fillStyle = color;
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = size * 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        }
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing 3D Noise Field...');
    const canvas = document.getElementById('noiseField3DCanvas');
    const button = document.getElementById('noiseField3DRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating NoiseField3D instance');
        new NoiseField3D('noiseField3DCanvas', 'noiseField3DRegenerateBtn');
    } else {
        console.error('Canvas or button not found for 3D Noise Field', {canvas, button});
    }
})(); 