// Reflections of a Cuboid - Generative Art
// Creates geometric patterns with 3D cuboid reflections and transformations

class ReflectionsOfCuboid {
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
        // Clear canvas with dark background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Generate color palette
        this.generateColorPalette();
        
        // Draw multiple cuboid reflections
        const cuboidCount = Math.floor(Math.random() * 8) + 4; // 4-11 cuboids
        
        for (let i = 0; i < cuboidCount; i++) {
            this.drawCuboidReflection();
        }
        
        // Add light rays and reflections
        this.addLightEffects();
    }
    
    generateColorPalette() {
        const palettes = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'], // Vibrant
            ['#A8E6CF', '#88D8C0', '#78C2AD', '#67B26F', '#4CA2F7'], // Cool blues
            ['#FFB74D', '#FF8A65', '#F48FB1', '#CE93D8', '#B39DDB'], // Warm sunset
            ['#81C784', '#AED581', '#DCE775', '#FFF176', '#FFD54F'], // Nature green
            ['#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2'], // Ocean blue
        ];
        
        this.colors = palettes[Math.floor(Math.random() * palettes.length)];
    }
    
    drawCuboidReflection() {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const size = Math.random() * 100 + 50; // 50-150px
        const rotation = Math.random() * Math.PI * 2;
        const perspective = Math.random() * 0.5 + 0.3; // 0.3-0.8
        
        // Create gradient for the cuboid
        const gradient = this.ctx.createLinearGradient(
            centerX - size, centerY - size,
            centerX + size, centerY + size
        );
        
        const color1 = this.colors[Math.floor(Math.random() * this.colors.length)];
        const color2 = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        gradient.addColorStop(0, color1 + 'CC');
        gradient.addColorStop(1, color2 + 'CC');
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(rotation);
        
        // Draw the main cuboid (front face)
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = color1;
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(-size/2, -size/2, size, size);
        this.ctx.strokeRect(-size/2, -size/2, size, size);
        
        // Draw the top face (with perspective)
        this.ctx.fillStyle = color2 + '99';
        this.ctx.beginPath();
        this.ctx.moveTo(-size/2, -size/2);
        this.ctx.lineTo(-size/2 + size * perspective, -size/2 - size * perspective);
        this.ctx.lineTo(size/2 + size * perspective, -size/2 - size * perspective);
        this.ctx.lineTo(size/2, -size/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw the right face (with perspective)
        this.ctx.fillStyle = color1 + '77';
        this.ctx.beginPath();
        this.ctx.moveTo(size/2, -size/2);
        this.ctx.lineTo(size/2 + size * perspective, -size/2 - size * perspective);
        this.ctx.lineTo(size/2 + size * perspective, size/2 - size * perspective);
        this.ctx.lineTo(size/2, size/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Draw reflection
        this.ctx.scale(1, -0.4); // Flip and compress vertically
        this.ctx.translate(0, -size * 2);
        this.ctx.globalAlpha = 0.3;
        
        // Reflection gradient (inverted)
        const reflectionGradient = this.ctx.createLinearGradient(
            -size, -size,
            size, size
        );
        reflectionGradient.addColorStop(0, color2 + '55');
        reflectionGradient.addColorStop(1, color1 + '22');
        
        this.ctx.fillStyle = reflectionGradient;
        this.ctx.fillRect(-size/2, -size/2, size, size);
        
        this.ctx.restore();
    }
    
    addLightEffects() {
        // Add light rays
        const rayCount = Math.floor(Math.random() * 12) + 8;
        
        for (let i = 0; i < rayCount; i++) {
            this.ctx.save();
            
            const startX = Math.random() * this.canvas.width;
            const startY = Math.random() * this.canvas.height;
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 200 + 100;
            const width = Math.random() * 3 + 1;
            
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            
            // Create gradient for light ray
            const rayGradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
            rayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            rayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
            rayGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.strokeStyle = rayGradient;
            this.ctx.lineWidth = width;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        // Add glowing points
        const glowCount = Math.floor(Math.random() * 20) + 10;
        
        for (let i = 0; i < glowCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 8 + 3;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            // Create radial gradient for glow
            const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
            glowGradient.addColorStop(0, color + 'FF');
            glowGradient.addColorStop(0.5, color + '88');
            glowGradient.addColorStop(1, color + '00');
            
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Reflections of Cuboid...');
    const canvas = document.getElementById('reflectionsOfCuboidCanvas');
    const button = document.getElementById('reflectionsOfCuboidRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating ReflectionsOfCuboid instance');
        new ReflectionsOfCuboid('reflectionsOfCuboidCanvas', 'reflectionsOfCuboidRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Reflections of Cuboid', {canvas, button});
    }
})(); 