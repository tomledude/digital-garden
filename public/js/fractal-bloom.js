// Fractal Bloom - Generative Art
// Creates organic, nature-inspired fractal patterns

class FractalBloom {
    constructor(canvasId, buttonId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.button = document.getElementById(buttonId);
        
        // Set canvas size
        this.canvas.width = 600;
        this.canvas.height = 600;
        
        // Initialize and bind events
        this.generate();
        this.button.addEventListener('click', () => this.generate());
    }
    
    generate() {
        // Clear canvas
        this.ctx.fillStyle = '#000015';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Random color palette for this generation
        this.generateColorPalette();
        
        // Generate multiple fractal blooms
        const bloomCount = Math.floor(Math.random() * 3) + 2; // 2-4 blooms
        
        for (let i = 0; i < bloomCount; i++) {
            this.drawFractalBloom();
        }
        
        // Add some sparkle effects
        this.addSparkles();
    }
    
    generateColorPalette() {
        const palettes = [
            ['#FF6B9D', '#C44569', '#F8B500', '#FFE5B4', '#FFAAA5'], // Warm bloom
            ['#4ECDC4', '#44A08D', '#096A09', '#A8E6CF', '#7FCDCD'], // Cool mint
            ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE'], // Purple dream
            ['#FF9A9E', '#FECFEF', '#FFECD2', '#FCB045', '#FD746C'], // Sunset bloom
            ['#A8EDEA', '#FED6E3', '#D299C2', '#FEF9D7', '#DAE2F8'], // Pastel garden
        ];
        
        this.colors = palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    drawFractalBloom() {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const maxDepth = Math.floor(Math.random() * 6) + 4; // 4-9 levels
        const initialSize = Math.random() * 60 + 40; // 40-100px
        const branchAngle = (Math.random() * 60 + 30) * Math.PI / 180; // 30-90 degrees
        
        // Create gradient for the bloom
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, initialSize * 3
        );
        
        const color1 = this.colors[Math.floor(Math.random() * this.colors.length)];
        const color2 = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        gradient.addColorStop(0, color1 + '80');
        gradient.addColorStop(0.7, color2 + '40');
        gradient.addColorStop(1, color2 + '10');
        
        this.drawBranch(centerX, centerY, initialSize, 0, maxDepth, gradient, branchAngle);
    }
    
    drawBranch(x, y, size, angle, depth, gradient, branchAngle) {
        if (depth <= 0 || size < 2) return;
        
        this.ctx.save();
        
        // Draw the current branch segment
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = Math.max(0.1, depth / 10);
        
        // Create organic, petal-like shapes
        this.ctx.beginPath();
        
        const petalCount = Math.floor(Math.random() * 6) + 3; // 3-8 petals
        for (let i = 0; i < petalCount; i++) {
            const petalAngle = (Math.PI * 2 * i) / petalCount + angle;
            const petalLength = size * (0.5 + Math.random() * 0.5);
            const petalWidth = size * (0.2 + Math.random() * 0.3);
            
            const endX = x + Math.cos(petalAngle) * petalLength;
            const endY = y + Math.sin(petalAngle) * petalLength;
            
            // Create curved petal shape
            this.ctx.moveTo(x, y);
            this.ctx.quadraticCurveTo(
                x + Math.cos(petalAngle) * petalLength * 0.7,
                y + Math.sin(petalAngle) * petalLength * 0.7,
                endX, endY
            );
            this.ctx.quadraticCurveTo(
                x + Math.cos(petalAngle + 0.5) * petalWidth,
                y + Math.sin(petalAngle + 0.5) * petalWidth,
                x, y
            );
        }
        
        this.ctx.fill();
        
        // Generate child branches with some randomness
        const childCount = Math.floor(Math.random() * 4) + 1; // 1-4 children
        
        for (let i = 0; i < childCount; i++) {
            const childAngle = angle + (Math.random() - 0.5) * branchAngle * 2;
            const childDistance = size * (0.6 + Math.random() * 0.4);
            const childX = x + Math.cos(childAngle) * childDistance;
            const childY = y + Math.sin(childAngle) * childDistance;
            const childSize = size * (0.5 + Math.random() * 0.3);
            
            // Add some variation to prevent perfect symmetry
            setTimeout(() => {
                this.drawBranch(childX, childY, childSize, childAngle, depth - 1, gradient, branchAngle);
            }, Math.random() * 50);
        }
        
        this.ctx.restore();
    }
    
    addSparkles() {
        const sparkleCount = Math.floor(Math.random() * 50) + 30;
        
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.8 + 0.2;
            
            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add cross sparkle effect
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(x - size * 2, y);
            this.ctx.lineTo(x + size * 2, y);
            this.ctx.moveTo(x, y - size * 2);
            this.ctx.lineTo(x, y + size * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Fractal Bloom...');
    const canvas = document.getElementById('fractalBloomCanvas');
    const button = document.getElementById('fractalBloomRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating FractalBloom instance');
        new FractalBloom('fractalBloomCanvas', 'fractalBloomRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Fractal Bloom', {canvas, button});
    }
})(); 