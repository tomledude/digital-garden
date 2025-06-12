// Liquid Geometry - Generative Art
// Creates flowing, organic geometric shapes with gradient colors

class LiquidGeometry {
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
        // Clear canvas with a subtle gradient background
        this.createBackground();
        
        // Random color palette for this generation
        this.generateColorPalette();
        
        // Generate multiple flowing geometric shapes
        const shapeCount = Math.floor(Math.random() * 6) + 4; // 4-9 shapes
        
        for (let i = 0; i < shapeCount; i++) {
            this.drawLiquidShape();
        }
        
        // Add flowing connections between shapes
        this.drawFlowingConnections();
        
        // Add subtle texture overlay
        this.addTextureOverlay();
    }
    
    createBackground() {
        // Create a subtle radial gradient background
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        
        const backgroundColors = [
            ['#0a0a23', '#1a1a3e'], // Deep blue
            ['#2d1b3d', '#0f0f2a'], // Purple night
            ['#1a2332', '#0d1117'], // Midnight blue
            ['#2c1810', '#1a0f0a'], // Dark brown
            ['#1f2937', '#111827'], // Cool gray
        ];
        
        const bgPalette = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        gradient.addColorStop(0, bgPalette[0]);
        gradient.addColorStop(1, bgPalette[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    generateColorPalette() {
        const palettes = [
            ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], // Vibrant mix
            ['#A29BFE', '#FD79A8', '#FDCB6E', '#6C5CE7', '#74B9FF'], // Purple pink
            ['#00B894', '#00CEC9', '#0984E3', '#6C5CE7', '#A29BFE'], // Ocean blue
            ['#E17055', '#FDCB6E', '#E84393', '#F39C12', '#E74C3C'], // Warm sunset
            ['#55A3FF', '#1DD1A1', '#FFC048', '#FF6B9D', '#C44569'], // Electric
            ['#667EEA', '#764BA2', '#F093FB', '#F5576C', '#4FACFE'], // Dream wave
        ];
        
        this.colors = palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    drawLiquidShape() {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const baseRadius = Math.random() * 80 + 60; // 60-140px
        const sides = Math.floor(Math.random() * 8) + 6; // 6-13 sides
        
        // Create flowing gradient
        const gradient = this.createShapeGradient(centerX, centerY, baseRadius);
        
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = 0.7 + Math.random() * 0.3;
        
        // Begin organic shape path
        this.ctx.beginPath();
        
        const points = [];
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides;
            const radiusVariation = 0.6 + Math.random() * 0.8; // 0.6-1.4 multiplier
            const radius = baseRadius * radiusVariation;
            
            // Add some organic flowing distortion
            const distortionX = Math.sin(angle * 3 + Math.random() * Math.PI) * 20;
            const distortionY = Math.cos(angle * 2 + Math.random() * Math.PI) * 20;
            
            const x = centerX + Math.cos(angle) * radius + distortionX;
            const y = centerY + Math.sin(angle) * radius + distortionY;
            
            points.push({x, y});
        }
        
        // Draw smooth curved shape using quadratic curves
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length];
            
            // Calculate control point for smooth curves
            const controlX = current.x + (next.x - current.x) * 0.5 + (Math.random() - 0.5) * 30;
            const controlY = current.y + (next.y - current.y) * 0.5 + (Math.random() - 0.5) * 30;
            
            this.ctx.quadraticCurveTo(controlX, controlY, next.x, next.y);
        }
        
        this.ctx.closePath();
        this.ctx.fill();
        
        // Add inner glow effect
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)] + '40';
        this.ctx.fill();
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.restore();
    }
    
    createShapeGradient(centerX, centerY, radius) {
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius * 1.5
        );
        
        const color1 = this.colors[Math.floor(Math.random() * this.colors.length)];
        const color2 = this.colors[Math.floor(Math.random() * this.colors.length)];
        const color3 = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        gradient.addColorStop(0, color1 + 'CC');
        gradient.addColorStop(0.5, color2 + '88');
        gradient.addColorStop(1, color3 + '22');
        
        return gradient;
    }
    
    drawFlowingConnections() {
        const connectionCount = Math.floor(Math.random() * 8) + 5; // 5-12 connections
        
        for (let i = 0; i < connectionCount; i++) {
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const endX = Math.random() * this.canvas.width;
            const endY = Math.random() * this.canvas.height;
            
            // Create flowing bezier curve connection
            this.ctx.save();
            this.ctx.globalAlpha = 0.4 + Math.random() * 0.4;
            this.ctx.strokeStyle = this.colors[Math.floor(Math.random() * this.colors.length)] + '80';
            this.ctx.lineWidth = Math.random() * 8 + 2;
            this.ctx.lineCap = 'round';
            
            // Add glow effect
            this.ctx.shadowColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.ctx.shadowBlur = 15;
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            
            // Create flowing curve with multiple control points
            const controlPoints = Math.floor(Math.random() * 3) + 2; // 2-4 control points
            let currentX = startX;
            let currentY = startY;
            
            for (let j = 0; j < controlPoints; j++) {
                const progress = (j + 1) / (controlPoints + 1);
                const targetX = startX + (endX - startX) * progress;
                const targetY = startY + (endY - startY) * progress;
                
                // Add organic flowing offset
                const offsetX = targetX + (Math.random() - 0.5) * 200;
                const offsetY = targetY + (Math.random() - 0.5) * 200;
                
                const nextX = j === controlPoints - 1 ? endX : 
                    startX + (endX - startX) * ((j + 2) / (controlPoints + 1));
                const nextY = j === controlPoints - 1 ? endY : 
                    startY + (endY - startY) * ((j + 2) / (controlPoints + 1));
                
                this.ctx.quadraticCurveTo(offsetX, offsetY, nextX, nextY);
                currentX = nextX;
                currentY = nextY;
            }
            
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
    
    addTextureOverlay() {
        // Add subtle particle texture
        const particleCount = Math.floor(Math.random() * 100) + 50;
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.6 + 0.2;
            
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = this.colors[Math.floor(Math.random() * this.colors.length)] + '80';
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add soft glow
            this.ctx.shadowColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.ctx.shadowBlur = 5;
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        // Add flowing lines overlay
        const lineCount = Math.floor(Math.random() * 20) + 10;
        
        for (let i = 0; i < lineCount; i++) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.1 + Math.random() * 0.2;
            this.ctx.strokeStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.ctx.lineWidth = Math.random() * 1 + 0.5;
            
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const length = Math.random() * 100 + 50;
            const angle = Math.random() * Math.PI * 2;
            
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
    console.log('Initializing Liquid Geometry...');
    const canvas = document.getElementById('liquidGeometryCanvas');
    const button = document.getElementById('liquidGeometryRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating LiquidGeometry instance');
        new LiquidGeometry('liquidGeometryCanvas', 'liquidGeometryRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Liquid Geometry', {canvas, button});
    }
})(); 