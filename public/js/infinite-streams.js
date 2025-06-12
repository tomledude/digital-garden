// Infinite Streams - Endless Flowing Lines
// Creates continuous lines that flow across the entire canvas with no visible start or end

class InfiniteStreams {
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
        this.animationSpeed = 0.0002;
        this.timeOffset = 0;
        
        // Stream parameters
        this.noiseScale = 0.006;
        this.streamCount = 8; // Much fewer lines
        this.streams = [];
        this.lineWidth = 1.5;
        this.opacity = 0.8;
        
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
        this.noiseScale = Math.random() * 0.002 + 0.004;
        this.streamCount = Math.floor(Math.random() * 6) + 6; // 6-12 streams
        this.lineWidth = Math.random() * 1 + 1; // 1-2
        this.opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9
        
        // Initialize streams
        this.initializeStreams();
        
        // Start animation
        this.startTime = performance.now();
        this.isAnimating = true;
        this.timeOffset = 0;
        this.animate();
    }
    
    initializeStreams() {
        this.streams = [];
        
        // Create streams that span the entire canvas
        for (let i = 0; i < this.streamCount; i++) {
            const stream = {
                points: [],
                yOffset: (i / this.streamCount) * this.canvas.height,
                noiseOffset: Math.random() * 1000 // Different noise offset for each stream
            };
            
            // Create points across the entire width of the canvas
            const pointCount = Math.floor(this.canvas.width / 3); // Point every 3 pixels
            for (let j = 0; j <= pointCount; j++) {
                const x = (j / pointCount) * this.canvas.width;
                stream.points.push({
                    x: x,
                    y: stream.yOffset,
                    baseY: stream.yOffset
                });
            }
            
            this.streams.push(stream);
        }
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;
        this.timeOffset = elapsed * this.animationSpeed;
        
        // Clear canvas to black
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw streams
        this.updateStreams();
        this.drawStreams();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateStreams() {
        for (let stream of this.streams) {
            for (let point of stream.points) {
                // Use 3D noise to create smooth vertical displacement
                const noiseValue = this.fractalNoise3D(
                    point.x * this.noiseScale,
                    stream.noiseOffset,
                    this.timeOffset,
                    3, 0.5, 1
                );
                
                // Apply displacement to create flowing motion
                const displacement = noiseValue * 80; // Vertical displacement range
                point.y = point.baseY + displacement;
            }
        }
    }
    
    drawStreams() {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = this.opacity;
        
        for (let stream of this.streams) {
            if (stream.points.length < 2) continue;
            
            this.ctx.beginPath();
            this.ctx.moveTo(stream.points[0].x, stream.points[0].y);
            
            // Draw smooth curves through all points
            for (let i = 1; i < stream.points.length - 1; i++) {
                const currentPoint = stream.points[i];
                const nextPoint = stream.points[i + 1];
                
                // Use quadratic curves for smooth flowing lines
                const cpx = (currentPoint.x + nextPoint.x) / 2;
                const cpy = (currentPoint.y + nextPoint.y) / 2;
                this.ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, cpx, cpy);
            }
            
            // Draw to the last point
            const lastPoint = stream.points[stream.points.length - 1];
            this.ctx.lineTo(lastPoint.x, lastPoint.y);
            
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1.0;
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Infinite Streams...');
    const canvas = document.getElementById('infiniteStreamsCanvas');
    const button = document.getElementById('infiniteStreamsRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating InfiniteStreams instance');
        new InfiniteStreams('infiniteStreamsCanvas', 'infiniteStreamsRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Infinite Streams', {canvas, button});
    }
})(); 