---
title: "Vibe Coding & Self-Generated Art: Exploring Creative AI"
date: 2025-06-10
tags: post
---

<img src="../../public/img/vibecoding.webp" alt="Vibe Coding" style="max-width: 100%; height: auto; display: block; margin: 2rem auto; border-radius: 12px;" />

## What is "Vibe Coding"?

"Vibe Coding" is a term that evokes different reactions depending on your perspective—it might sound controversial, exciting, overhyped, or completely foreign. Your reaction likely depends on how deeply you're embedded in the current AI development landscape.

For those not yet aboard the AI-silicon-valley-mega-hype train, **vibe coding** refers to a software development approach that leverages artificial intelligence, particularly large language models (LLMs), to generate code through natural language descriptions. Instead of manually writing every line of code, developers provide instructions in plain English, which AI tools then translate into executable programs.

This methodology aims to streamline the development process, potentially saving significant time and resources. While its practical utility across various software development domains remains a subject of debate, I can personally vouch for one thing: it's an absolute blast to throw quirky ideas into the AI prompt portal and see what creative solutions emerge.

## The Creative Experiment

The examples showcased below represent my exploration into AI-generated art through code. I challenged Claude-4-Sonnet to create visually compelling, randomly generated artworks with just a few simple constraints:

- Each piece should be inspired by specific artistic prompts
- The art must be randomly generated on every page load
- Users can generate new variations with the "Generate New Art" button
- The code should be clean, efficient, and visually engaging

## Interactive Art Gallery

What emerged from this experiment exceeded my expectations. The AI didn't just generate functional code—it created genuinely artistic and visually interesting pieces that regenerate with delightful unpredictability.

<div class="art-gallery">
    <div class="carousel-container">
        <button class="carousel-btn carousel-prev" id="carouselPrev">‹</button>
        <div class="carousel-wrapper">
            <div class="carousel-track" id="carouselTrack">
                <section class="carousel-slide">
                    <h3>Reflections of a Cuboid</h3>
                    <div class="art-container-carousel">
                        <canvas id="reflectionsOfCuboidCanvas"></canvas>
                        <button id="reflectionsOfCuboidRegenerateBtn" class="regenerate-btn-carousel">Generate New Art</button>
                    </div>
                </section>

                <section class="carousel-slide">
                    <h3>Cosmic Nebula</h3>
                    <div class="art-container-carousel">
                        <canvas id="cosmicNebulaCanvas"></canvas>
                        <button id="cosmicNebulaRegenerateBtn" class="regenerate-btn-carousel">Generate New Art</button>
                    </div>
                </section>

                <section class="carousel-slide">
                    <h3>Fractal Bloom</h3>
                    <div class="art-container-carousel">
                        <canvas id="fractalBloomCanvas"></canvas>
                        <button id="fractalBloomRegenerateBtn" class="regenerate-btn-carousel">Generate New Art</button>
                    </div>
                </section>

                <section class="carousel-slide">
                    <h3>Cubist Portrait</h3>
                    <div class="art-container-carousel">
                        <canvas id="cubistPortraitCanvas"></canvas>
                        <button id="cubistPortraitRegenerateBtn" class="regenerate-btn-carousel">Generate New Art</button>
                    </div>
                </section>
            </div>
        </div>
        <button class="carousel-btn carousel-next" id="carouselNext">›</button>
        
        <div class="carousel-indicators" id="carouselIndicators">
            <button class="indicator active" data-slide="0"></button>
            <button class="indicator" data-slide="1"></button>
            <button class="indicator" data-slide="2"></button>
            <button class="indicator" data-slide="3"></button>
        </div>
    </div>
</div>


## Can we vibe code a java script randomly generated music box?

After vibe-coding some sloppy javascript which created some nice looking colourful shapes an even grander idea dawned on me. Could I _vibe-code_ a small bit of javascript which generated random ambient music?

Well the answer to that is an astounding yes. I now give to you the might *COSMIC SYMPHONY*


<div>
    <section class="music-piece">
        <h1>🎵 Cosmic Symphony</h1>
        <p class="music-description">Experience generative ambient music that creates new compositions each time you play. Each symphony uses random scales, chord progressions, and melodies while maintaining musical harmony.</p>
        <div class="art-container">
            <canvas id="cosmicSymphonyCanvas"></canvas>
            <div class="music-controls">
                <button id="cosmicSymphonyPlayBtn" class="regenerate-btn">▶ Play New Symphony</button>
                <button id="cosmicSymphonyStopBtn" class="regenerate-btn" disabled>⏹ Stop</button>
            </div>
        </div>
    </section>
</div>


## Reflections on AI-Assisted Creativity

This experiment highlights an interesting intersection between technology and creativity. While the debate continues about AI's role in professional software development, there's something undeniably magical about the creative possibilities it unlocks.

The process of "vibe coding" art feels less like traditional programming and more like collaborative creation. You provide the vision, the AI interprets and implements it, and together you create something that neither could have produced alone.

Whether this represents the future of creative coding or simply an entertaining diversion, I find the results genuinely compelling. Each refresh brings new variations, new color palettes, new geometric arrangements—a reminder that even in deterministic systems, there's room for surprise and delight.

<style>
    .art-gallery {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .carousel-container {
        position: relative;
        max-width: 600px;
        margin: 0 auto 2rem auto;
        padding: 0 4rem;
    }

    .carousel-wrapper {
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .carousel-track {
        display: flex;
        transition: transform 0.3s ease-out;
        will-change: transform;
    }

    .carousel-slide {
        min-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem 1.5rem;
        box-sizing: border-box;
    }

    .carousel-slide h3 {
        font-size: 1.5rem;
        margin: 0;
        text-align: center;
        line-height: 1.2;
        color: var(--text);
        opacity: 0.9;
    }

    .art-container-carousel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
    }

    .art-container-carousel canvas {
        border: 1px solid var(--text);
        border-radius: 6px;
        box-sizing: border-box;
        display: block;
        max-width: 100%;
        height: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: var(--bg);
        color: var(--text);
        border: 2px solid var(--text);
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        z-index: 2;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .carousel-btn:hover {
        background: var(--text);
        color: var(--bg);
        transform: translateY(-50%);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .carousel-prev {
        left: 0;
    }

    .carousel-next {
        right: 0;
    }

    .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 0.8rem;
        margin-top: 2rem;
    }

    .indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.4);
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
    }

    .indicator.active {
        background: var(--text);
        border-color: var(--text);
        transform: scale(1.2);
    }

    .indicator:hover {
        border-color: rgba(255, 255, 255, 0.8);
        transform: scale(1.1);
    }

    .regenerate-btn-carousel {
        padding: 0.8rem 1.5rem;
        background: var(--bg);
        color: var(--text);
        border: 2px solid var(--text);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
        font-weight: 500;
    }

    .regenerate-btn-carousel:hover {
        background: var(--text);
        color: var(--bg);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
        .carousel-container {
            padding: 0 3rem;
        }
        
        .carousel-slide {
            padding: 1.5rem 1rem;
        }
        
        .carousel-slide h3 {
            font-size: 1.3rem;
        }
        
        .carousel-btn {
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
        }
    }

    .music-piece {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        background: linear-gradient(135deg, rgba(255, 20, 97, 0.1), rgba(90, 135, 255, 0.1));
        border: 2px solid rgba(255, 20, 97, 0.3);
        border-radius: 16px;
        padding: 3rem 2rem;
        margin-top: 2rem;
    }

    .music-piece h1 {
        font-size: 3rem;
        margin: 0;
        text-align: center;
        background: linear-gradient(45deg, #FF1461, #5A87FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .music-description {
        font-size: 1.2rem;
        text-align: center;
        max-width: 600px;
        line-height: 1.6;
        opacity: 0.9;
        margin: 0;
    }

    .art-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        width: 100%;
    }

    .music-piece canvas {
        border: 2px solid var(--text);
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .regenerate-btn {
        padding: 0.75rem 1.5rem;
        background: var(--bg);
        color: var(--text);
        border: 2px solid var(--text);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.1rem;
    }

    .regenerate-btn:hover {
        background: var(--text);
        color: var(--bg);
        transform: translateY(-2px);
    }

    .music-controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .regenerate-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .regenerate-btn:disabled:hover {
        background: var(--bg);
        color: var(--text);
        transform: none;
    }


</style>

<script>
    console.log('Blog post script starting...');
    
    // Initialize art pieces directly
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing art pieces...');
        
        // Simple test to see if canvases exist
        const canvases = ['reflectionsOfCuboidCanvas', 'cosmicNebulaCanvas', 'fractalBloomCanvas', 'cubistPortraitCanvas', 'cosmicSymphonyCanvas'];
        canvases.forEach(id => {
            const canvas = document.getElementById(id);
            console.log(`Canvas ${id}:`, canvas ? 'FOUND' : 'NOT FOUND');
        });
        
        // Load and initialize scripts
        const scripts = [
            '/js/reflections-of-cuboid.js',
            '/js/cosmic-nebula.js',
            '/js/fractal-bloom.js',
            '/js/cubist-portrait.js',
            '/js/cosmic-symphony.js'
        ];

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                console.log(`Loading script: ${src}`);
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    console.log(`Script loaded: ${src}`);
                    resolve();
                };
                script.onerror = (error) => {
                    console.error(`Script failed to load: ${src}`, error);
                    reject(error);
                };
                document.body.appendChild(script);
            });
        }

        // Load all scripts in sequence
        scripts.reduce((promiseChain, script) => {
            return promiseChain.then(() => loadScript(script));
        }, Promise.resolve()).then(() => {
            console.log('All art scripts loaded successfully');
            // Initialize carousel after scripts load
            initializeCarousel();
        }).catch(error => {
            console.error('Error loading scripts:', error);
        });
    });

    // Carousel functionality
    function initializeCarousel() {
        const track = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const indicators = document.querySelectorAll('.indicator');
        
        let currentSlide = 0;
        const totalSlides = 4;

        function updateCarousel() {
            const offset = -currentSlide * 100;
            track.style.transform = `translateX(${offset}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
        
        console.log('Carousel initialized');
    }
</script> 