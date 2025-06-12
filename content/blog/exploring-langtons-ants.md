---
title: "Digital Gardens & Langton's Ant: Finding Order in Chaos"
date: 2025-06-10
tags: post
---

## What is a Digital Garden?

The concept of a digital garden (not just a blog) is new to me, I first came across one when I stumbled across some of [Leo Thesen](https://leothesen.com)'s incredible storytelling of his experience doing the [MUT 100](https://mut.utmb.world/races/mut100). I was pretty inspired to create my version of this "digital garden" a place where I have the freedom to create, write, experiment, write notes and share thoughts I rarely allow myself to express elsewhere.

I've never been one for traditional journaling, but I intend for this space to serve a similar purpose in my life. My intention is to document and remember, to write and recollect moments from my life that would otherwise slip away with time. It's a place for the ideas, projects, stories, and music that live rent-free in my head to find a more permanent home.

## What is Langton's Ant

Now, what exactly is Langton's Ant? 

[Langton's Ant](https://en.wikipedia.org/wiki/Langton%27s_ant) is a fascinating cellular automaton governed by pretty simple rules. The ant (represented as a red dot in the simulation I vibe coded below) is placed on a grid of cells and follows just two basic rules as it makes its way through life:

1. **On a white square**: Turn 90° right, flip the color of the square, move forward one unit
2. **On a black square**: Turn 90° left, flip the color of the square, move forward one unit

At first glance, these rules seem to produce nothing but chaos. The ant appears to wander aimlessly, creating what can only be described as random, unintelligent patterns — pure noise and seemingly purposeless movement.

However, after approximately 10,000 steps, something remarkable happens. Out of this apparent chaos emerges a structured pattern: the ant begins constructing what's known as a "highway" — a diagonal corridor that allows it to escape its previous chaotic spiral and move in a consistent, predictable direction.

This transformation from disorder to order is both unexpected and beautiful. It demonstrates how complex, organized behavior or ideas can spontaneously emerge from places we least expected.


## Interactive Simulation

**Controls:**
- Use the slider to adjust the ant's speed (you can even reverse time with negative values)
- Click "Reset Ant" to start over and observe the pattern formation again

<style>
.ant-simulation {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 16px;
    padding: 30px;
    margin: 20px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

[data-theme="dark"] .ant-simulation {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.ant-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.speed-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.speed-control label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 16px;
}

.speed-slider {
    width: 350px;
    height: 8px;
    border-radius: 5px;
    background: #ddd;
    outline: none;
    transition: all 0.2s;
}

[data-theme="dark"] .speed-slider {
    background: #555;
}

.speed-slider::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: all 0.2s;
}

.speed-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.speed-value {
    font-weight: bold;
    font-size: 18px;
    color: var(--text-color);
    min-width: 30px;
    text-align: center;
}

.reset-button {
    background: linear-gradient(45deg, #ff6b6b, #ee5a6f);
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.reset-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.reset-button:active {
    transform: translateY(0);
}

.ant-canvas-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
}

.ant-canvas {
    border: 3px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    background: white;
    transition: all 0.3s ease;
}

[data-theme="dark"] .ant-canvas {
    border-color: #555;
    background: #222;
}

.ant-canvas:hover {
    box-shadow: 0 12px 35px rgba(0,0,0,0.2);
}

@media (max-width: 650px) {
    .ant-simulation {
        padding: 20px;
        margin: 10px;
    }
    
    .speed-slider {
        width: 280px;
    }
    
    .ant-canvas {
        width: 100%;
        height: auto;
        max-width: 500px;
    }
}
</style>

<div class="ant-simulation">
    <div class="ant-controls">
        <div class="speed-control">
            <label for="ant-speed" style="text-align: center;">🐜 Ant Speed Control 🐜<br><small style="font-weight: normal; color: #666;">⏪ Reverse Time ← | Pause ⏸️ | Forward Time → ⏩</small></label>
            <input type="range" id="ant-speed" class="speed-slider" min="-20" max="20" value="5">
            <span id="ant-speed-value" class="speed-value">5</span>
        </div>
        <button onclick="resetAnt()" class="reset-button">Reset Ant</button>
    </div>
    
    <div class="ant-canvas-container">
        <canvas id="langtons-ant" class="ant-canvas" width="600" height="600"></canvas>
    </div>
</div>

<script src="/js/langtons-ant.js"></script>

## Finding My Own Highway

Much like this little ant, I often find myself navigating a world filled with seemingly disordered thoughts and ideas. The noise of unfinished projects, scattered concepts, musical fragments, and half-formed stories creates its own kind of chaos in my mind.

My hope for this digital garden is that it will serve a similar function to the ant's structured movement. By giving these chaotic thoughts a place to exist outside my mind — documenting them, organizing them (very loosely), and connecting them (unintentionally) - perhaps I too can find patterns and create my own highway haha

Sometimes the most meaningful ideas emerge not from careful planning, but from consistent application of simple principles over time and cross-disciplinary thought.