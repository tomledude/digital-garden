// Background Perlin Noise Animation
// Creates gentle flowing lines in the background of all pages

class BackgroundNoise {
    constructor() {
        this.canvas = document.getElementById('background-noise');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // 3D Perlin noise parameters
        this.permutation = [];
        this.p = [];
        
        // Animation parameters
        this.animationFrame = null;
        this.startTime = null;
        this.isAnimating = false;
        this.animationSpeed = 0.0001; // Faster for testing
        this.timeOffset = 0;
        
        // Background stream parameters
        this.noiseScale = 0.003; // Very fine noise
        this.streamCount = 12; // Moderate number of streams
        this.streams = [];
        this.lineWidth = 2; // Thicker lines for visibility
        this.opacity = 1.0; // Full opacity for testing
        
        // Initialize
        this.initializeNoise();
        this.setupCanvas();
        this.initializeStreams();
        this.startAnimation();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupCanvas() {
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Reinitialize streams when canvas size changes
        if (this.streams.length > 0) {
            this.initializeStreams();
        }
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.resizeCanvas();
        }, 100);
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
    fractalNoise3D(x, y, z, octaves = 2, persistence = 0.5, scale = 1) {
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
            const pointCount = Math.floor(this.canvas.width / 8); // Point every 8 pixels for performance
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
    
    startAnimation() {
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
        
        // Clear canvas to transparent
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
                    2, 0.5, 1
                );
                
                // Apply more visible displacement for testing
                const displacement = noiseValue * 80; // Larger displacement range
                point.y = point.baseY + displacement;
            }
        }
    }
    
    drawStreams() {
        // Use a very subtle color that works in both light and dark modes
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
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
    
    // Method to pause/resume animation (useful for performance)
    pause() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    resume() {
        if (!this.isAnimating) {
            this.startAnimation();
        }
    }
}

// Initialize background noise when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing background noise...');
    window.backgroundNoise = new BackgroundNoise();
});

// Pause animation when page is not visible (performance optimization)
document.addEventListener('visibilitychange', function() {
    if (window.backgroundNoise) {
        if (document.hidden) {
            window.backgroundNoise.pause();
        } else {
            window.backgroundNoise.resume();
        }
    }
}); 