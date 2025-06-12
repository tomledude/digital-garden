// Flow Fields - Smooth Moving White Lines using 3D Perlin Noise
// Creates flowing white curves over black background

class FlowFields {
    constructor(canvasId, buttonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.button = document.getElementById(buttonId);
        
        // Set canvas size
        this.canvas.width = 700;
        this.canvas.height = 500;
        
        // 3D Perlin noise parameters
        this.permutation = [];
        this.p = [];
        
        // Animation parameters
        this.animationFrame = null;
        this.startTime = null;
        this.isAnimating = false;
        this.animationSpeed = 0.0005;
        this.timeOffset = 0;
        
        // Flow field parameters
        this.noiseScale = 0.008;
        this.flowStrength = 2;
        this.lineSpacing = 15;
        this.lineLength = 80;
        
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
    fractalNoise3D(x, y, z, octaves = 3, persistence = 0.5, scale = 1) {
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
        
        // Random parameters for this generation
        this.animationSpeed = 0.0002;
        this.noiseScale = Math.random() * 0.001 + 0.005;
        this.flowStrength = Math.random() * 3 + 1;
        this.lineSpacing = Math.random() * 10 + 10;
        this.lineLength = Math.random() * 40;
        
        // Start animation
        this.startTime = performance.now();
        this.isAnimating = true;
        this.timeOffset = 0;
        this.animate();
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;
        this.timeOffset = elapsed * this.animationSpeed;
        
        // Clear canvas to black
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw flow field lines
        this.drawFlowField();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    drawFlowField() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = 'round';
        this.ctx.globalAlpha = 0.8;
        
        // Draw grid of flow lines
        for (let x = 0; x < this.canvas.width; x += this.lineSpacing) {
            for (let y = 0; y < this.canvas.height; y += this.lineSpacing) {
                this.drawFlowLine(x, y);
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    drawFlowLine(startX, startY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        
        let currentX = startX;
        let currentY = startY;
        
        // Draw smooth flowing line following the noise field
        for (let i = 0; i < this.lineLength; i++) {
            // Get flow direction from 3D noise
            const noiseValue = this.fractalNoise3D(
                currentX * this.noiseScale,
                currentY * this.noiseScale,
                this.timeOffset,
                3, 0.5, 1
            );
            
            // Convert noise to angle
            const angle = noiseValue * Math.PI * 2;
            
            // Move along the flow
            const stepSize = 0.5;
            currentX += Math.cos(angle) * stepSize;
            currentY += Math.sin(angle) * stepSize;
            
            // Stop if we go off canvas
            if (currentX < 0 || currentX > this.canvas.width || 
                currentY < 0 || currentY > this.canvas.height) {
                break;
            }
            
            this.ctx.lineTo(currentX, currentY);
        }
        
        this.ctx.stroke();
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Flow Fields...');
    const canvas = document.getElementById('flowFieldsCanvas');
    const button = document.getElementById('flowFieldsRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating FlowFields instance');
        new FlowFields('flowFieldsCanvas', 'flowFieldsRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Flow Fields', {canvas, button});
    }
})(); 