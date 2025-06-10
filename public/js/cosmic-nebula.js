// Cosmic Nebula - Generative Art
// Creates space-themed art with swirling nebula patterns and cosmic effects

class CosmicNebula {
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
        // Clear canvas with deep space background
        this.ctx.fillStyle = '#0a0a23';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Generate cosmic color palette
        this.generateCosmicPalette();
        
        // Draw background stars
        this.drawStarField();
        
        // Draw nebula formations
        const nebulaCount = Math.floor(Math.random() * 4) + 2; // 2-5 nebulae
        
        for (let i = 0; i < nebulaCount; i++) {
            this.drawNebula();
        }
        
        // Add cosmic dust and gas clouds
        this.addCosmicDust();
        
        // Add bright stars and cosmic bodies
        this.addCosmicBodies();
    }
    
    generateCosmicPalette() {
        const palettes = [
            ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'], // Electric nebula
            ['#667eea', '#764ba2', '#f093fb', '#f5576c'], // Purple dream
            ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'], // Cyan aurora
            ['#fa709a', '#fee140', '#ffecd2', '#fcb045'], // Warm galaxy
            ['#a8edea', '#fed6e3', '#ffeaa7', '#fab1a0'], // Pastel cosmos
        ];
        
        this.colors = palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    drawStarField() {
        const starCount = Math.floor(Math.random() * 200) + 100;
        
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2;
            const brightness = Math.random();
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawNebula() {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const size = Math.random() * 300 + 150; // 150-450px
        const intensity = Math.random() * 0.8 + 0.2;
        
        // Create multiple swirling gas layers
        const layerCount = Math.floor(Math.random() * 5) + 3;
        
        for (let layer = 0; layer < layerCount; layer++) {
            this.drawGasLayer(centerX, centerY, size * (1 - layer * 0.15), intensity, layer);
        }
    }
    
    drawGasLayer(centerX, centerY, size, intensity, layerIndex) {
        this.ctx.save();
        
        // Create radial gradient for the gas layer
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, size
        );
        
        const color1 = this.colors[Math.floor(Math.random() * this.colors.length)];
        const color2 = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        const alpha = Math.max(0.1, intensity * (1 - layerIndex * 0.2));
        
        gradient.addColorStop(0, this.hexToRgba(color1, alpha * 0.8));
        gradient.addColorStop(0.3, this.hexToRgba(color2, alpha * 0.6));
        gradient.addColorStop(0.7, this.hexToRgba(color1, alpha * 0.3));
        gradient.addColorStop(1, this.hexToRgba(color2, 0));
        
        // Create swirling effect
        const swirls = Math.floor(Math.random() * 8) + 4;
        
        for (let i = 0; i < swirls; i++) {
            const angle = (Math.PI * 2 * i) / swirls + Math.random();
            const radius = size * (0.3 + Math.random() * 0.7);
            const swirlSize = size * (0.2 + Math.random() * 0.3);
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            
            // Create organic, swirling shapes
            const points = Math.floor(Math.random() * 8) + 6;
            this.ctx.moveTo(x + swirlSize, y);
            
            for (let j = 0; j <= points; j++) {
                const pointAngle = (Math.PI * 2 * j) / points;
                const pointRadius = swirlSize * (0.5 + Math.random() * 0.5);
                const noise = (Math.random() - 0.5) * swirlSize * 0.3;
                
                const px = x + Math.cos(pointAngle) * (pointRadius + noise);
                const py = y + Math.sin(pointAngle) * (pointRadius + noise);
                
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    // Use quadratic curves for organic shapes
                    const cpx = x + Math.cos(pointAngle - Math.PI / points) * pointRadius * 1.2;
                    const cpy = y + Math.sin(pointAngle - Math.PI / points) * pointRadius * 1.2;
                    this.ctx.quadraticCurveTo(cpx, cpy, px, py);
                }
            }
            
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    addCosmicDust() {
        const dustClouds = Math.floor(Math.random() * 20) + 10;
        
        for (let i = 0; i < dustClouds; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 50 + 20;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, this.hexToRgba(color, 0.4));
            gradient.addColorStop(0.5, this.hexToRgba(color, 0.2));
            gradient.addColorStop(1, this.hexToRgba(color, 0));
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    addCosmicBodies() {
        // Add bright stars
        const brightStars = Math.floor(Math.random() * 15) + 5;
        
        for (let i = 0; i < brightStars; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 4 + 2;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            // Star glow
            const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 4);
            glowGradient.addColorStop(0, color);
            glowGradient.addColorStop(0.3, this.hexToRgba(color, 0.8));
            glowGradient.addColorStop(1, this.hexToRgba(color, 0));
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Star core
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Star spikes
            this.ctx.strokeStyle = this.hexToRgba(color, 0.8);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x - size * 3, y);
            this.ctx.lineTo(x + size * 3, y);
            this.ctx.moveTo(x, y - size * 3);
            this.ctx.lineTo(x, y + size * 3);
            this.ctx.stroke();
        }
        
        // Add distant galaxies
        const galaxyCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < galaxyCount; i++) {
            this.drawDistantGalaxy();
        }
    }
    
    drawDistantGalaxy() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const size = Math.random() * 40 + 20;
        const rotation = Math.random() * Math.PI * 2;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Galaxy spiral arms
        const arms = 3;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        for (let arm = 0; arm < arms; arm++) {
            this.ctx.strokeStyle = this.hexToRgba(color, 0.6);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            
            const armAngle = (Math.PI * 2 * arm) / arms;
            const spiralTightness = 0.3;
            
            for (let t = 0; t < Math.PI * 4; t += 0.1) {
                const r = size * (1 - t / (Math.PI * 4)) * 0.8;
                const angle = armAngle + t * spiralTightness;
                const sx = Math.cos(angle) * r;
                const sy = Math.sin(angle) * r * 0.3; // Flatten for galaxy perspective
                
                if (t === 0) {
                    this.ctx.moveTo(sx, sy);
                } else {
                    this.ctx.lineTo(sx, sy);
                }
            }
            
            this.ctx.stroke();
        }
        
        // Galaxy center
        const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
        centerGradient.addColorStop(0, this.hexToRgba(color, 0.8));
        centerGradient.addColorStop(1, this.hexToRgba(color, 0));
        
        this.ctx.fillStyle = centerGradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Cosmic Nebula...');
    const canvas = document.getElementById('cosmicNebulaCanvas');
    const button = document.getElementById('cosmicNebulaRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating CosmicNebula instance');
        new CosmicNebula('cosmicNebulaCanvas', 'cosmicNebulaRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Cosmic Nebula', {canvas, button});
    }
})(); 