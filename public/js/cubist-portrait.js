// Cubist Portrait - Generative Art
// Creates Picasso-inspired cubist portraits with oil painting texture

class CubistPortrait {
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
        // Clear canvas with textured background
        this.createTexturedBackground();
        
        // Generate cubist color palette
        this.generateCubistPalette();
        
        // Define face structure with random variations
        this.faceCenter = {
            x: this.canvas.width * (0.4 + Math.random() * 0.2), // 40-60% from left
            y: this.canvas.height * (0.4 + Math.random() * 0.2) // 40-60% from top
        };
        this.faceSize = Math.random() * 150 + 200; // 200-350px
        
        // Draw cubist portrait layers
        this.drawFaceFragments();
        this.drawEyes();
        this.drawNose();
        this.drawMouth();
        this.drawHair();
        
        // Add final texture and aging effects
        this.addOilPaintingTexture();
        this.addVignette();
    }
    
    generateCubistPalette() {
        const palettes = [
            // Classic Picasso Blue Period
            ['#2B547E', '#4682B4', '#87CEEB', '#E6E6FA', '#F5F5DC'], 
            // Rose Period
            ['#CD853F', '#F4A460', '#DEB887', '#FFDEAD', '#FFE4E1'],
            // Analytical Cubism (browns and grays)
            ['#8B4513', '#A0522D', '#D2B48C', '#F5DEB3', '#DCDCDC'],
            // Synthetic Cubism (more colorful)
            ['#B22222', '#DAA520', '#228B22', '#4169E1', '#8B4513'],
            // Earth tones
            ['#654321', '#8B4513', '#A0522D', '#CD853F', '#D2B48C']
        ];
        
        this.colors = palettes[Math.floor(Math.random() * palettes.length)];
        this.accentColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Random accent
    }
    
    createTexturedBackground() {
        // Create aged canvas texture
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, this.canvas.width/2
        );
        
        gradient.addColorStop(0, '#F5F5DC');
        gradient.addColorStop(0.7, '#DDBF94');
        gradient.addColorStop(1, '#8B7355');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add canvas texture
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const opacity = Math.random() * 0.1;
            
            this.ctx.fillStyle = `rgba(139, 115, 85, ${opacity})`;
            this.ctx.fillRect(x, y, 2, 1);
        }
    }
    
    drawFaceFragments() {
        // Create multiple fragmented face planes
        const fragmentCount = Math.floor(Math.random() * 8) + 6;
        
        for (let i = 0; i < fragmentCount; i++) {
            this.drawGeometricFacePlane();
        }
    }
    
    drawGeometricFacePlane() {
        const { x, y } = this.faceCenter;
        const size = this.faceSize;
        
        // Create random geometric face fragment
        const angleOffset = Math.random() * Math.PI * 2;
        const fragmentSize = size * (0.3 + Math.random() * 0.4);
        const offsetX = (Math.random() - 0.5) * size * 0.8;
        const offsetY = (Math.random() - 0.5) * size * 0.8;
        
        const centerX = x + offsetX;
        const centerY = y + offsetY;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(angleOffset);
        
        // Create angular, geometric shape
        this.ctx.beginPath();
        const sides = Math.floor(Math.random() * 6) + 4; // 4-9 sides
        
        for (let i = 0; i <= sides; i++) {
            const angle = (Math.PI * 2 * i) / sides;
            const radius = fragmentSize * (0.7 + Math.random() * 0.6);
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        
        // Fill with cubist colors and texture
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const gradient = this.ctx.createLinearGradient(-fragmentSize, -fragmentSize, fragmentSize, fragmentSize);
        gradient.addColorStop(0, color + 'DD');
        gradient.addColorStop(0.5, color + 'BB');
        gradient.addColorStop(1, color + '99');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Add geometric stroke
        this.ctx.strokeStyle = this.colors[0] + 'AA';
        this.ctx.lineWidth = 2 + Math.random() * 3;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawEyes() {
        // Cubist eyes - fragmented and from multiple perspectives
        const { x, y } = this.faceCenter;
        const eyeSize = this.faceSize * 0.1;
        
        // Left eye (multiple perspectives)
        this.drawCubistEye(x - this.faceSize * 0.15, y - this.faceSize * 0.1, eyeSize, 0);
        this.drawCubistEye(x - this.faceSize * 0.2, y - this.faceSize * 0.05, eyeSize * 0.7, Math.PI * 0.3);
        
        // Right eye (multiple perspectives)
        this.drawCubistEye(x + this.faceSize * 0.15, y - this.faceSize * 0.1, eyeSize, 0);
        this.drawCubistEye(x + this.faceSize * 0.1, y - this.faceSize * 0.15, eyeSize * 0.8, -Math.PI * 0.2);
    }
    
    drawCubistEye(x, y, size, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        // Eye shape (geometric)
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, size * 1.5, size, 0, 0, Math.PI * 2);
        
        const eyeGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
        eyeGradient.addColorStop(0, '#F5F5DC');
        eyeGradient.addColorStop(0.6, '#E6E6FA');
        eyeGradient.addColorStop(1, this.colors[1] + 'AA');
        
        this.ctx.fillStyle = eyeGradient;
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors[0];
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Pupil (geometric)
        this.ctx.fillStyle = '#2F4F4F';
        this.ctx.beginPath();
        this.ctx.ellipse(size * 0.2, 0, size * 0.6, size * 0.8, Math.PI * 0.1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.ellipse(-size * 0.3, -size * 0.3, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawNose() {
        const { x, y } = this.faceCenter;
        const noseSize = this.faceSize * 0.15;
        
        // Cubist nose - multiple angular planes
        const nosePlanes = [
            { x: x - noseSize * 0.3, y: y + noseSize * 0.2, angle: Math.PI * 0.1 },
            { x: x + noseSize * 0.2, y: y + noseSize * 0.3, angle: -Math.PI * 0.1 },
            { x: x, y: y + noseSize * 0.1, angle: Math.PI * 0.05 }
        ];
        
        nosePlanes.forEach((plane, i) => {
            this.ctx.save();
            this.ctx.translate(plane.x, plane.y);
            this.ctx.rotate(plane.angle);
            
            this.ctx.beginPath();
            this.ctx.moveTo(-noseSize * 0.4, -noseSize * 0.2);
            this.ctx.lineTo(noseSize * 0.4, -noseSize * 0.1);
            this.ctx.lineTo(noseSize * 0.2, noseSize * 0.4);
            this.ctx.lineTo(-noseSize * 0.3, noseSize * 0.3);
            this.ctx.closePath();
            
            const color = this.colors[i % this.colors.length];
            this.ctx.fillStyle = color + 'BB';
            this.ctx.fill();
            
            this.ctx.strokeStyle = this.colors[0] + 'DD';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    drawMouth() {
        const { x, y } = this.faceCenter;
        const mouthSize = this.faceSize * 0.12;
        
        // Cubist mouth - fragmented smile/frown
        const mouthFragments = [
            { x: x - mouthSize, y: y + this.faceSize * 0.2, width: mouthSize * 0.8, curve: -0.3 },
            { x: x + mouthSize * 0.3, y: y + this.faceSize * 0.25, width: mouthSize * 0.6, curve: 0.2 },
            { x: x - mouthSize * 0.2, y: y + this.faceSize * 0.18, width: mouthSize * 0.4, curve: 0.1 }
        ];
        
        mouthFragments.forEach((fragment, i) => {
            this.ctx.save();
            
            this.ctx.beginPath();
            this.ctx.moveTo(fragment.x - fragment.width/2, fragment.y);
            this.ctx.quadraticCurveTo(
                fragment.x, 
                fragment.y + fragment.curve * mouthSize,
                fragment.x + fragment.width/2, 
                fragment.y
            );
            
            // Create lip-like shape
            this.ctx.quadraticCurveTo(
                fragment.x, 
                fragment.y - fragment.curve * mouthSize * 0.5,
                fragment.x - fragment.width/2, 
                fragment.y
            );
            this.ctx.closePath();
            
            const color = this.colors[(i + 2) % this.colors.length];
            this.ctx.fillStyle = color + 'CC';
            this.ctx.fill();
            
            this.ctx.strokeStyle = this.colors[0];
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    drawHair() {
        const { x, y } = this.faceCenter;
        const hairCount = Math.floor(Math.random() * 12) + 8;
        
        for (let i = 0; i < hairCount; i++) {
            this.ctx.save();
            
            const angle = (Math.PI * 2 * i) / hairCount + Math.random() * 0.5;
            const distance = this.faceSize * (0.5 + Math.random() * 0.3);
            const hairX = x + Math.cos(angle) * distance;
            const hairY = y + Math.sin(angle) * distance * 0.7; // Flatten to focus on top/sides
            
            const hairSize = this.faceSize * (0.1 + Math.random() * 0.15);
            
            this.ctx.translate(hairX, hairY);
            this.ctx.rotate(angle + Math.random() * 0.5);
            
            // Create angular hair strands
            this.ctx.beginPath();
            const vertices = Math.floor(Math.random() * 4) + 3;
            
            for (let j = 0; j <= vertices; j++) {
                const vertexAngle = (Math.PI * 2 * j) / vertices;
                const radius = hairSize * (0.8 + Math.random() * 0.4);
                const px = Math.cos(vertexAngle) * radius;
                const py = Math.sin(vertexAngle) * radius;
                
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            
            this.ctx.closePath();
            
            const hairColor = Math.random() < 0.7 ? this.colors[0] : this.colors[1];
            this.ctx.fillStyle = hairColor + 'DD';
            this.ctx.fill();
            
            this.ctx.strokeStyle = this.colors[0] + '88';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
    
    addOilPaintingTexture() {
        // Add brush stroke texture
        const brushStrokes = Math.floor(Math.random() * 100) + 50;
        
        for (let i = 0; i < brushStrokes; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const angle = Math.random() * Math.PI * 2;
            const length = Math.random() * 20 + 5;
            const width = Math.random() * 3 + 1;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);
            
            this.ctx.globalAlpha = 0.1 + Math.random() * 0.1;
            this.ctx.strokeStyle = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.ctx.lineWidth = width;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(-length/2, 0);
            this.ctx.lineTo(length/2, 0);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        // Add aging spots
        const ageSpots = Math.floor(Math.random() * 30) + 20;
        
        for (let i = 0; i < ageSpots; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 8 + 2;
            
            this.ctx.fillStyle = `rgba(139, 115, 85, ${Math.random() * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    addVignette() {
        // Add subtle vignette effect
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, this.canvas.width/2
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(139, 115, 85, 0.3)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Initialize immediately when script loads (DOM is already ready)
(function() {
    console.log('Initializing Cubist Portrait...');
    const canvas = document.getElementById('cubistPortraitCanvas');
    const button = document.getElementById('cubistPortraitRegenerateBtn');
    
    if (canvas && button) {
        console.log('Creating CubistPortrait instance');
        new CubistPortrait('cubistPortraitCanvas', 'cubistPortraitRegenerateBtn');
    } else {
        console.error('Canvas or button not found for Cubist Portrait', {canvas, button});
    }
})(); 