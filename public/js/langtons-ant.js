// Langton's Ant Simulation
class LangtonsAnt {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Grid dimensions
        this.gridSize = 3; // Size of each cell in pixels
        this.width = Math.floor(this.canvas.width / this.gridSize);
        this.height = Math.floor(this.canvas.height / this.gridSize);
        
        // Initialize grid (false = white, true = black)
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        
        // Ant properties
        this.antX = Math.floor(this.width / 2);
        this.antY = Math.floor(this.height / 2);
        this.antDirection = 0; // 0=North, 1=East, 2=South, 3=West
        
        // Animation properties
        this.animationId = null;
        this.speed = 5; // Much slower default speed
        this.stepCount = 0;
        this.history = []; // Store history for reverse playback
        this.lastFrameTime = 0;
        this.stepAccumulator = 0;
        
        // Explosion animation properties
        this.isExploding = false;
        this.explosionParticles = [];
        this.explosionStartTime = 0;
        this.explosionDuration = 2000; // 2 seconds
        
        // Highway achievement message properties
        this.showingHighwayMessage = false;
        this.highwayMessageStartTime = 0;
        this.highwayMessageDuration = 3000; // 3 seconds
        
        this.setupControls();
        this.draw();
        this.start();
    }
    
    setupControls() {
        const speedSlider = document.getElementById('ant-speed');
        const speedValue = document.getElementById('ant-speed-value');
        
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', (e) => {
                this.speed = parseInt(e.target.value);
                speedValue.textContent = this.speed;
                
                // Restart animation when speed changes
                if (this.speed !== 0 && !this.animationId) {
                    this.start();
                }
            });
        }
        
        // Make resetAnt function globally available
        window.resetAnt = () => this.reset();
    }
    
    reset() {
        // Stop current animation
        this.stop();
        
        // Clear grid
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        
        // Reset ant position
        this.antX = Math.floor(this.width / 2);
        this.antY = Math.floor(this.height / 2);
        this.antDirection = 0;
        this.stepCount = 0;
        this.history = [];
        
        this.draw();
        
        // Restart animation
        this.start();
    }
    
    step() {
        // Save current state for history
        this.history.push({
            antX: this.antX,
            antY: this.antY,
            antDirection: this.antDirection,
            grid: this.grid.map(row => [...row]),
            stepCount: this.stepCount
        });
        
        // Langton's Ant rules
        const currentCell = this.grid[this.antY][this.antX];
        
        if (currentCell) {
            // On black square: turn left, flip color, move forward
            this.antDirection = (this.antDirection + 3) % 4; // Turn left
        } else {
            // On white square: turn right, flip color, move forward
            this.antDirection = (this.antDirection + 1) % 4; // Turn right
        }
        
        // Flip the color of current cell
        this.grid[this.antY][this.antX] = !this.grid[this.antY][this.antX];
        
        // Move forward
        const directions = [
            [0, -1], // North
            [1, 0],  // East
            [0, 1],  // South
            [-1, 0]  // West
        ];
        
        const [dx, dy] = directions[this.antDirection];
        this.antX = (this.antX + dx + this.width) % this.width;
        this.antY = (this.antY + dy + this.height) % this.height;
        
        this.stepCount++;
        
        // Check for highway achievement message at step 10000
        if (this.stepCount === 10000) {
            this.showHighwayMessage();
        }
        
        // Check for explosion trigger at step 19427 (collision with initial path)
        if (this.stepCount === 19427 && !this.isExploding) {
            this.triggerExplosion();
        }
    }
    
    stepBack() {
        if (this.history.length > 0) {
            const previousState = this.history.pop();
            this.antX = previousState.antX;
            this.antY = previousState.antY;
            this.antDirection = previousState.antDirection;
            this.grid = previousState.grid;
            this.stepCount = previousState.stepCount;
        }
    }
    
    triggerExplosion() {
        this.isExploding = true;
        this.explosionStartTime = performance.now();
        
        // Create explosion particles
        this.explosionParticles = [];
        const centerX = this.antX * this.gridSize + this.gridSize / 2;
        const centerY = this.antY * this.gridSize + this.gridSize / 2;
        
        // Create 30 particles
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = 50 + Math.random() * 100; // Random speed between 50-150
            this.explosionParticles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                size: 2 + Math.random() * 4,
                color: `hsl(${Math.random() * 60 + 15}, 100%, ${50 + Math.random() * 30}%)` // Orange/red/yellow
            });
        }
        
        // Pause the ant simulation during explosion
        const originalSpeed = this.speed;
        this.speed = 0;
        
        // Resume after explosion and reset
        setTimeout(() => {
            this.resetAfterExplosion();
            this.speed = originalSpeed;
        }, this.explosionDuration);
    }
    
    showHighwayMessage() {
        this.showingHighwayMessage = true;
        this.highwayMessageStartTime = performance.now();
        
        // Auto-hide the message after duration
        setTimeout(() => {
            this.showingHighwayMessage = false;
        }, this.highwayMessageDuration);
    }
    
    resetAfterExplosion() {
        // Clear grid
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
        
        // Reset ant position to center
        this.antX = Math.floor(this.width / 2);
        this.antY = Math.floor(this.height / 2);
        this.antDirection = 0;
        this.stepCount = 0;
        this.history = [];
        
        // Clear explosion and highway message
        this.isExploding = false;
        this.explosionParticles = [];
        this.showingHighwayMessage = false;
    }
    
    updateExplosion(currentTime) {
        if (!this.isExploding) return;
        
        const elapsed = currentTime - this.explosionStartTime;
        const progress = elapsed / this.explosionDuration;
        
        // Update particles
        this.explosionParticles.forEach(particle => {
            particle.x += particle.vx * 0.016; // Assuming ~60fps
            particle.y += particle.vy * 0.016;
            particle.life = Math.max(0, 1 - progress);
            particle.vy += 30 * 0.016; // Gravity effect
        });
    }
    
    drawExplosion() {
        if (!this.isExploding) return;
        
        this.explosionParticles.forEach(particle => {
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
        
        // Draw explosion flash effect
        const elapsed = performance.now() - this.explosionStartTime;
        if (elapsed < 200) { // Flash for first 200ms
            this.ctx.save();
            this.ctx.globalAlpha = 0.3 * (1 - elapsed / 200);
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x]) {
                    // Black cell
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
                }
            }
        }
        
        // Draw ant (only if not exploding)
        if (!this.isExploding) {
            this.ctx.fillStyle = '#ff0000'; // Red ant
            this.ctx.fillRect(
                this.antX * this.gridSize, 
                this.antY * this.gridSize, 
                this.gridSize, 
                this.gridSize
            );
        }
        
        // Draw explosion if active
        this.drawExplosion();
        
        // Draw step counter
        this.ctx.fillStyle = '#333';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Steps: ${this.stepCount}`, 10, 25);
        
        // Show highway achievement message at step 10000
        if (this.showingHighwayMessage) {
            const elapsed = performance.now() - this.highwayMessageStartTime;
            const fadeProgress = Math.min(1, elapsed / 500); // Fade in over 500ms
            const fadeOut = Math.max(0, 1 - Math.max(0, elapsed - (this.highwayMessageDuration - 500)) / 500); // Fade out in last 500ms
            const alpha = fadeProgress * fadeOut;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#00aa00';
            this.ctx.font = 'bold 28px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🛣️ HIGHWAY PATTERN EMERGING! 🛣️', this.canvas.width / 2, this.canvas.height / 2 - 50);
            this.ctx.font = '18px Arial';
            this.ctx.fillText('The ant has found order in the chaos!', this.canvas.width / 2, this.canvas.height / 2 - 15);
            this.ctx.textAlign = 'left';
            this.ctx.restore();
        }
        
        // Show explosion message at step 19427
        if (this.isExploding) {
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('💥 COLLISION WITH INITIAL PATH! 💥', this.canvas.width / 2, this.canvas.height / 2 + 80);
            this.ctx.font = '18px Arial';
            this.ctx.fillText('The ant has returned to where it started!', this.canvas.width / 2, this.canvas.height / 2 + 110);
            this.ctx.textAlign = 'left';
        }
    }
    
    animate(currentTime = 0) {
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
        }
        
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update explosion if active
        if (this.isExploding) {
            this.updateExplosion(currentTime);
            this.draw();
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        // Convert speed to steps per second with exponential scaling for more noticeable changes
        let stepsPerSecond;
        if (this.speed === 0) {
            stepsPerSecond = 0;
        } else if (this.speed > 0) {
            // Exponential scaling for positive speeds: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 steps/sec
            stepsPerSecond = Math.pow(2, this.speed - 1);
        } else {
            // Exponential scaling for negative speeds: -1, -2, -4, -8, -16, -32, -64, -128, -256, -512 steps/sec
            stepsPerSecond = -Math.pow(2, Math.abs(this.speed) - 1);
        }
        
        this.stepAccumulator += (stepsPerSecond * deltaTime) / 1000;
        
        // Only step when we've accumulated enough time
        if (Math.abs(this.stepAccumulator) >= 1) {
            const stepsToTake = Math.floor(Math.abs(this.stepAccumulator));
            // Dynamic frame limiting based on speed - allow more steps for higher speeds
            const maxStepsPerFrame = Math.min(50, Math.max(1, Math.abs(stepsPerSecond) / 10));
            
            if (this.speed > 0) {
                // Forward animation
                for (let i = 0; i < stepsToTake && i < maxStepsPerFrame; i++) {
                    this.step();
                }
            } else if (this.speed < 0) {
                // Reverse animation
                for (let i = 0; i < stepsToTake && i < maxStepsPerFrame; i++) {
                    this.stepBack();
                }
            }
            
            this.stepAccumulator -= Math.floor(this.stepAccumulator);
            this.draw();
        }
        
        if (this.speed !== 0 || this.isExploding) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
        } else {
            this.animationId = null;
            this.lastFrameTime = 0;
            this.stepAccumulator = 0;
        }
    }
    
    start() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.lastFrameTime = 0;
        this.stepAccumulator = 0;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.lastFrameTime = 0;
        this.stepAccumulator = 0;
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('langtons-ant');
    if (canvas) {
        new LangtonsAnt('langtons-ant');
    }
}); 