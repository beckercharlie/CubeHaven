// Game State
let coins = 1000;
let cubes = 0;
let cubesArray = [];
let framedCubes = Array(10).fill(null);
let selectedCube = null;
let selectedCubeSource = null;
let unlockedCubes = ["Common"]; // Start with Common unlocked
let luckPotionTier = 0; // Tracks the active luck potion tier (0 = none, 1-3 for tiers)

// Constants
const eggTiers = [
    { 
        name: "Basic", 
        cost: 100, 
        odds: { 
            Common: 0.95, 
            Rare: 0.03, 
            Epic: 0.01, 
            Legendary: 0.005, 
            Mythic: 0.002, 
            Galactic: 0.001, 
            Celestial: 0.0005, 
            Astronomic: 0.0001, 
            Insane: 0.00005, 
            Unfathomable: 0.00001,
            Ethereal: 0.000005,
            Cosmic: 0.000003,
            Nebulaic: 0.000002,
            Stellar: 0.000001,
            Supernova: 0.0000005,
            Quasar: 0.0000003,
            Voidic: 0.0000001,
            GalacticCore: 0.00000005,
            Infinity: 0.00000003,
            Primordial: 0.00000001
        } 
    },
    { 
        name: "Silver", 
        cost: 1000, 
        odds: { 
            Common: 0.80, 
            Rare: 0.10, 
            Epic: 0.05, 
            Legendary: 0.02, 
            Mythic: 0.01, 
            Galactic: 0.005, 
            Celestial: 0.002, 
            Astronomic: 0.001, 
            Insane: 0.0005, 
            Unfathomable: 0.0001,
            Ethereal: 0.00005,
            Cosmic: 0.00003,
            Nebulaic: 0.00002,
            Stellar: 0.00001,
            Supernova: 0.000005,
            Quasar: 0.000003,
            Voidic: 0.000001,
            GalacticCore: 0.0000005,
            Infinity: 0.0000003,
            Primordial: 0.0000001
        } 
    },
    { 
        name: "Gold", 
        cost: 10000, 
        odds: { 
            Common: 0.60, 
            Rare: 0.20, 
            Epic: 0.10, 
            Legendary: 0.05, 
            Mythic: 0.02, 
            Galactic: 0.01, 
            Celestial: 0.005, 
            Astronomic: 0.002, 
            Insane: 0.001, 
            Unfathomable: 0.0005,
            Ethereal: 0.0003,
            Cosmic: 0.0002,
            Nebulaic: 0.0001,
            Stellar: 0.00005,
            Supernova: 0.00003,
            Quasar: 0.00002,
            Voidic: 0.00001,
            GalacticCore: 0.000005,
            Infinity: 0.000003,
            Primordial: 0.000001
        } 
    },
    { 
        name: "Diamond", 
        cost: 100000, 
        odds: { 
            Common: 0.40, 
            Rare: 0.25, 
            Epic: 0.15, 
            Legendary: 0.08, 
            Mythic: 0.05, 
            Galactic: 0.03, 
            Celestial: 0.02, 
            Astronomic: 0.01, 
            Insane: 0.005, 
            Unfathomable: 0.001,
            Ethereal: 0.0005,
            Cosmic: 0.0003,
            Nebulaic: 0.0002,
            Stellar: 0.0001,
            Supernova: 0.00005,
            Quasar: 0.00003,
            Voidic: 0.00002,
            GalacticCore: 0.00001,
            Infinity: 0.000005,
            Primordial: 0.000003
        } 
    },
    { 
        name: "Mythic", 
        cost: 1000000, 
        odds: { 
            Common: 0.20, 
            Rare: 0.15, 
            Epic: 0.10, 
            Legendary: 0.08, 
            Mythic: 0.06, 
            Galactic: 0.05, 
            Celestial: 0.04, 
            Astronomic: 0.03, 
            Insane: 0.02, 
            Unfathomable: 0.01,
            Ethereal: 0.005,
            Cosmic: 0.003,
            Nebulaic: 0.002,
            Stellar: 0.001,
            Supernova: 0.0005,
            Quasar: 0.0003,
            Voidic: 0.0002,
            GalacticCore: 0.0001,
            Infinity: 0.00005,
            Primordial: 0.00003
        } 
    }
];

const rarities = {
    Common: { odds: "1/10", cubeRate: 0.4, image: null, sellValue: 50 },
    Rare: { odds: "1/100", cubeRate: 0.8, image: null, sellValue: 200 },
    Epic: { odds: "1/1,000", cubeRate: 1.6, image: null, sellValue: 1000 },
    Legendary: { odds: "1/10,000", cubeRate: 2.4, image: null, sellValue: 5000 },
    Mythic: { odds: "1/100,000", cubeRate: 3.2, image: null, sellValue: 20000 },
    Galactic: { odds: "1/200,000", cubeRate: 4.0, image: null, sellValue: 50000 },
    Celestial: { odds: "1/333,333", cubeRate: 4.8, image: null, sellValue: 200000 },
    Astronomic: { odds: "1/1,000,000", cubeRate: 5.6, image: null, sellValue: 1000000 },
    Insane: { odds: "1/2,000,000", cubeRate: 6.4, image: null, sellValue: 5000000 },
    Unfathomable: { odds: "1/100,000,000", cubeRate: 8.0, image: null, sellValue: 20000000 },
    Ethereal: { odds: "1/500,000,000", cubeRate: 9.0, image: null, sellValue: 50000000 },
    Cosmic: { odds: "1/1,000,000,000", cubeRate: 10.0, image: null, sellValue: 100000000 },
    Nebulaic: { odds: "1/5,000,000,000", cubeRate: 11.0, image: null, sellValue: 150000000 },
    Stellar: { odds: "1/10,000,000,000", cubeRate: 12.0, image: null, sellValue: 200000000 },
    Supernova: { odds: "1/50,000,000,000", cubeRate: 13.0, image: null, sellValue: 250000000 },
    Quasar: { odds: "1/100,000,000,000", cubeRate: 14.0, image: null, sellValue: 300000000 },
    Voidic: { odds: "1/500,000,000,000", cubeRate: 15.0, image: null, sellValue: 350000000 },
    GalacticCore: { odds: "1/1,000,000,000,000", cubeRate: 16.0, image: null, sellValue: 400000000 },
    Infinity: { odds: "1/5,000,000,000,000", cubeRate: 18.0, image: null, sellValue: 450000000 },
    Primordial: { odds: "1/10,000,000,000,000", cubeRate: 20.0, image: null, sellValue: 500000000 }
};

// DOM Elements (shared with ui.js)
const elements = {
    coinCounter: document.getElementById("coin-counter"),
    cubeCounter: document.getElementById("cube-counter"),
    sellCubes: document.getElementById("sell-cubes"),
    settingsToggle: document.getElementById("settings-toggle"),
    settingsDropdown: document.getElementById("settings-dropdown"),
    saveGame: document.getElementById("save-game"),
    restartGame: document.getElementById("restart-game"),
    cubeIndexToggle: document.getElementById("cube-index-toggle"),
    cubeIndexDropdown: document.getElementById("cube-index-dropdown"),
    cubeGrid: document.getElementById("cube-grid"),
    closeCubeIndex: document.getElementById("close-cube-index"),
    canvas: document.getElementById("cube-canvas"),
    cubeInfo: document.getElementById("cube-info"),
    cubeImage: document.getElementById("cube-image"),
    cubeRarity: document.getElementById("cube-rarity"),
    cubeOdds: document.getElementById("cube-odds"),
    cubeRate: document.getElementById("cube-rate"),
    cubeSellValue: document.getElementById("cube-sell-value"),
    sellCube: document.getElementById("sell-cube"),
    frameCube: document.getElementById("frame-cube"),
    removeFromFrame: document.getElementById("remove-from-frame"),
    closeInfo: document.getElementById("close-info"),
    hatchNotification: document.getElementById("hatch-notification"),
    hatchCubeImage: document.getElementById("hatch-cube-image"),
    hatchCubeRarity: document.getElementById("hatch-cube-rarity"),
    hatchCubeOdds: document.getElementById("hatch-cube-odds"),
    hatchCubeRate: document.getElementById("hatch-cube-rate"),
    hatchCubeSellValue: document.getElementById("hatch-cube-sell-value"),
    closeHatch: document.getElementById("close-hatch"),
    gameNotification: document.getElementById("game-notification"),
    gameNotificationTitle: document.getElementById("game-notification-title"),
    gameNotificationMessage: document.getElementById("game-notification-message"),
    closeGameNotification: document.getElementById("close-game-notification"),
    luckPotion1: document.getElementById("luck-potion-1"),
    luckPotion2: document.getElementById("luck-potion-2"),
    luckPotion3: document.getElementById("luck-potion-3")
};

const ctx = elements.canvas.getContext("2d");
const fenceRadius = 180;

// Particle System for Effects
class Particle {
    constructor(x, y, radius, color, speed, direction, lifetime) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.direction = direction;
        this.lifetime = lifetime;
        this.alpha = 1;
    }

    update(deltaTime) {
        this.x += Math.cos(this.direction) * this.speed * deltaTime;
        this.y += Math.sin(this.direction) * this.speed * deltaTime;
        this.lifetime -= deltaTime;
        this.alpha = Math.max(0, this.lifetime / 1000);
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Initialize Cube Images with Animated Effects
function initializeCubeImages() {
    const designs = {
        Common: (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#D3D3D3");
            gradient.addColorStop(1, "#A9A9A9");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
        },
        Rare: (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#87CEEB");
            gradient.addColorStop(1, "#4682B4");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(10, 10, 2, 0, Math.PI * 2);
            ctx.arc(30, 30, 2, 0, Math.PI * 2);
            ctx.fill();
        },
        Epic: (ctx) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#BA55D3");
            gradient.addColorStop(1, "#4B0082");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            ctx.fillStyle = "#FFFFFF";
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * 40, Math.random() * 40, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        },
        Legendary: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FFD700");
            gradient.addColorStop(1, "#FF4500");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            const shimmer = Math.sin(cube.animationTimer) * 5 + 15;
            ctx.strokeStyle = `rgba(255, 215, 0, ${Math.abs(Math.sin(cube.animationTimer))})`;
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4 + cube.animationTimer;
                ctx.beginPath();
                ctx.moveTo(20, 20);
                ctx.lineTo(20 + Math.cos(angle) * shimmer, 20 + Math.sin(angle) * shimmer);
                ctx.stroke();
            }
        },
        Mythic: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF00FF");
            gradient.addColorStop(1, "#4B0082");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.03;
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const radius = 10 + i * 3;
                const swirl = (cube.animationApiKey + i) % (Math.PI * 2);
                ctx.beginPath();
                ctx.arc(20, 20, radius, swirl, swirl + Math.PI * 1.5);
                ctx.stroke();
            }
        },
        Galactic: (ctx, cube) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#00CED1");
            gradient.addColorStop(1, "#191970");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.1) {
                cube.particles.push(new Particle(
                    20, 20, 1, "#FFFFFF", 0.5, Math.random() * Math.PI * 2, 1000
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Celestial: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF69B4");
            gradient.addColorStop(1, "#4B0082");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.02;
            const glow = Math.sin(cube.animationTimer) * 2 + 15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(cube.animationTimer))})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(20, 20, glow, 0, Math.PI * 2);
            ctx.stroke();
        },
        Astronomic: (ctx, cube) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#C0C0C0");
            gradient.addColorStop(1, "#4682B4");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            const angle = cube.animationTimer % (Math.PI * 2);
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(20, 20, 15, angle, angle + Math.PI / 2);
            ctx.stroke();
        },
        Insane: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF4500");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.2) {
                cube.particles.push(new Particle(
                    20 + (Math.random() - 0.5) * 30,
                    20 + (Math.random() - 0.5) * 30,
                    1, "#00FFFF", 1, Math.random() * Math.PI * 2, 500
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Unfathomable: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#9400D3");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.03;
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(cube.animationTimer))})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const radius = (cube.animationTimer + i * 5) % 20 + 5;
                ctx.beginPath();
                ctx.arc(20, 20, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        },
        Ethereal: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#00FFFF");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.05) {
                cube.particles.push(new Particle(
                    20, 20, 2, "rgba(0, 255, 255, 0.5)", 0.3, Math.random() * Math.PI * 2, 2000
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Cosmic: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF00FF");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.02;
            const size = Math.sin(cube.animationTimer) * 5 + 20;
            const gradientNebula = ctx.createRadialGradient(20, 20, 0, 20, 20, size);
            gradientNebula.addColorStop(0, `rgba(255, 0, 255, ${Math.abs(Math.sin(cube.animationTimer))})`);
            gradientNebula.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = gradientNebula;
            ctx.fillRect(0, 0, 40, 40);
        },
        Nebulaic: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF4500");
            gradient.addColorStop(1, "#9400D3");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.01;
            ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const angle = (cube.animationTimer + i * 2) % (Math.PI * 2);
                ctx.beginPath();
                ctx.moveTo(20, 20);
                ctx.quadraticCurveTo(
                    20 + Math.cos(angle) * 10, 20 + Math.sin(angle) * 10,
                    20 + Math.cos(angle) * 20, 20 + Math.sin(angle) * 20
                );
                ctx.stroke();
            }
        },
        Stellar: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FFD700");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            if (Math.random() < 0.1) {
                cube.particles = cube.particles || [];
                for (let i = 0; i < 4; i++) {
                    cube.particles.push(new Particle(
                        20, 20, 1, "#FFFFFF", 2, (Math.PI / 2) * i, 300
                    ));
                }
            }
            cube.particles = cube.particles || [];
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Supernova: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF0000");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.03;
            const burst = (Math.sin(cube.animationTimer) + 1) * 10 + 10;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(cube.animationTimer))})`;
            ctx.beginPath();
            ctx.arc(20, 20, burst, 0, Math.PI * 2);
            ctx.fill();
        },
        Quasar: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#00CED1");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            const angle = cube.animationTimer % (Math.PI * 2);
            ctx.strokeStyle = "#FF4500";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(20, 20, 15, angle, angle + Math.PI);
            ctx.stroke();
        },
        Voidic: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#000000");
            gradient.addColorStop(1, "#FFFFFF");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.1) {
                const angle = Math.random() * Math.PI * 2;
                cube.particles.push(new Particle(
                    20 + Math.cos(angle) * 20, 20 + Math.sin(angle) * 20,
                    1, "#FF00FF", 1, angle + Math.PI, 1000
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        GalacticCore: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FFFFFF");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            if (Math.random() < 0.05) {
                cube.particles.push(new Particle(
                    20, 20, 1, "#00FFFF", 0.5, cube.animationTimer, 2000
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Infinity: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#9400D3");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.03;
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 2;
            const t = cube.animationTimer % 1;
            ctx.beginPath();
            const x = 20 + 10 * Math.cos(t * Math.PI * 2) * Math.sin(t * Math.PI * 2);
            const y = 20 + 10 * Math.sin(t * Math.PI * 2);
            ctx.moveTo(x, y);
            for (let i = 0; i <= 20; i++) {
                const nt = (t + i / 20) % 1;
                const nx = 20 + 10 * Math.cos(nt * Math.PI * 2) * Math.sin(nt * Math.PI * 2);
                const ny = 20 + 10 * Math.sin(nt * Math.PI * 2);
                ctx.lineTo(nx, ny);
            }
            ctx.stroke();
        },
        Primordial: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FF00FF");
            gradient.addColorStop(1, "#000000");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.2) {
                cube.particles.push(new Particle(
                    20, 20, 2, "#FF4500", 1, Math.random() * Math.PI * 2, 500
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        }
    };

    for (let rarity in rarities) {
        const canvas = document.getElementById(`cube-${rarity.toLowerCase()}`);
        const ctx = canvas.getContext("2d");
        rarities[rarity].image = canvas;
        rarities[rarity].draw = designs[rarity];
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(2);
}

function updateGameState() {
    elements.coinCounter.textContent = `Coins: ${formatNumber(coins)}`;
    elements.cubeCounter.textContent = `Cubes: ${formatNumber(cubes)}`;
}

// Save Game Function
function saveGame() {
    const gameState = {
        coins: coins,
        cubes: cubes,
        cubesArray: cubesArray.map(cube => ({
            rarity: cube.rarity,
            x: cube.x,
            y: cube.y,
            targetX: cube.targetX,
            targetY: cube.targetY,
            state: cube.state,
            pauseTimer: cube.pauseTimer
        })),
        framedCubes: framedCubes.map(cube => cube ? { rarity: cube.rarity } : null),
        unlockedCubes: unlockedCubes,
        luckPotionTier: luckPotionTier
    };
    localStorage.setItem("cubeHavenSave", JSON.stringify(gameState));
    console.log("Game saved:", gameState);
    showGameNotification("Success", "Game Saved!");
    toggleSettingsDropdown();
}

// Load Game Function
function loadGame() {
    const savedState = localStorage.getItem("cubeHavenSave");
    if (savedState) {
        const gameState = JSON.parse(savedState);
        coins = gameState.coins || 5000;
        cubes = gameState.cubes || 0;
        cubesArray = gameState.cubesArray.map(cube => ({
            rarity: cube.rarity,
            image: rarities[cube.rarity].image,
            x: cube.x,
            y: cube.y,
            targetX: cube.targetX,
            targetY: cube.targetY,
            state: cube.state,
            pauseTimer: cube.pauseTimer,
            animationTimer: 0,
            particles: []
        }));
        framedCubes = gameState.framedCubes.map(cube => cube ? {
            rarity: cube.rarity,
            image: rarities[cube.rarity].image,
            animationTimer: 0,
            particles: []
        } : null);
        unlockedCubes = gameState.unlockedCubes || ["Common"];
        luckPotionTier = gameState.luckPotionTier || 0;
        console.log("Game loaded:", gameState);
    }
    renderFramedCubes();
    renderCubeIndex();
    updateLuckPotionButtons();
}

// Restart Game Function
function restartGame() {
    if (!confirm("Are you sure you want to restart? All progress will be lost.")) {
        return;
    }
    coins = 5000;
    cubes = 0;
    cubesArray = [];
    framedCubes = EmissionsArray(10).fill(null);
    unlockedCubes = ["Common"];
    luckPotionTier = 0;
    selectedCube = null;
    selectedCubeSource = null;
    localStorage.removeItem("cubeHavenSave");
    elements.cubeInfo.style.display = "none";
    elements.hatchNotification.style.display = "none";
    elements.gameNotification.style.display = "none";
    renderFramedCubes();
    renderCubeIndex();
    updateLuckPotionButtons();
    updateGameState();
    console.log("Game restarted");
    showGameNotification("Success", "Game Restarted!");
    toggleSettingsDropdown();
}

// Cube Movement (for cubes in the fenced area)
function moveCubes() {
    cubesArray.forEach(cube => {
        if (cube.state === "moving") {
            const dx = cube.targetX - cube.x;
            const dy = cube.targetY - cube.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 0.5;
            if (distance > speed) {
                cube.x += (dx / distance) * speed;
                cube.y += (dy / distance) * speed;
            } else {
                cube.x = cube.targetX;
                cube.y = cube.targetY;
                cube.state = "paused";
                cube.pauseTimer = 2000;
            }
        } else if (cube.state === "paused") {
            cube.pauseTimer -= 16;
            if (cube.pauseTimer <= 0) {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 50 + 20;
                cube.targetX = 200 + Math.cos(angle) * Math.min(distance, fenceRadius - 20);
                cube.targetY = 200 + Math.sin(angle) * Math.min(distance, fenceRadius - 20);
                const distFromCenter = Math.sqrt((cube.targetX - 200) ** 2 + (cube.targetY - 200) ** 2);
                if (distFromCenter > fenceRadius - 20) {
                    const scale = (fenceRadius - 20) / distFromCenter;
                    cube.targetX = 200 + (cube.targetX - 200) * scale;
                    cube.targetY = 200 + (cube.targetY - 200) * scale;
                }
                cube.state = "moving";
            }
        }
    });
}

// Render Cubes in the Fenced Area
function renderCubes() {
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    cubesArray.forEach(cube => {
        ctx.save();
        ctx.translate(cube.x, cube.y);
        ctx.scale(1, 1);
        ctx.translate(-20, -20);
        rarities[cube.rarity].draw(ctx, cube);
        ctx.restore();
    });
}

// Render Framed Cubes
function renderFramedCubes() {
    for (let i = 0; i < 10; i++) {
        const frameCanvas = document.getElementById(`frame-${i}-canvas`);
        const frameCtx = frameCanvas.getContext("2d");
        frameCtx.clearRect(0, 0, 40, 40);
        if (framedCubes[i]) {
            rarities[framedCubes[i].rarity].draw(frameCtx, framedCubes[i]);
        }
    }
}

// Frame a Cube
function frameCube(cube) {
    const emptyFrameIndex = framedCubes.findIndex(cube => cube === null);
    if (emptyFrameIndex === -1) {
        showGameNotification("Error", "All frames are occupied!");
        return;
    }
    const index = cubesArray.indexOf(cube);
    if (index !== -1) {
        framedCubes[emptyFrameIndex] = cube;
        cubesArray.splice(index, 1);
        renderFramedCubes();
        elements.cubeInfo.style.display = "none";
        selectedCube = null;
        selectedCubeSource = null;
    }
}

// Remove Cube from Frame
function removeFromFrame(frameIndex) {
    if (frameIndex < 0 || frameIndex >= 10 || !framedCubes[frameIndex]) return;
    const cube = framedCubes[frameIndex];
    cube.x = 200;
    cube.y = 200;
    cube.targetX = 200;
    cube.targetY = 200;
    cube.state = "paused";
    cube.pauseTimer = 0;
    cubesArray.push(cube);
    framedCubes[frameIndex] = null;
    renderFramedCubes();
    elements.cubeInfo.style.display = "none";
    selectedCube = null;
    selectedCubeSource = null;
}

// Update Luck Potion Button Texts
function updateLuckPotionButtons() {
    elements.luckPotion1.textContent = luckPotionTier === 1 ? "Luck Potion T1 Active!" : "Luck Potion T1 (5,000 coins)";
    elements.luckPotion2.textContent = luckPotionTier === 2 ? "Luck Potion T2 Active!" : "Luck Potion T2 (25,000 coins)";
    elements.luckPotion3.textContent = luckPotionTier === 3 ? "Luck Potion T3 Active!" : "Luck Potion T3 (100,000 coins)";
}

// Activate Luck Potion
function activateLuckPotion(tier) {
    const costs = {
        1: 5000,
        2: 25000,
        3: 100000
    };
    const cost = costs[tier];
    if (coins < cost) {
        showGameNotification("Error", `Not enough coins to buy Luck Potion Tier ${tier}!`);
        return;
    }
    if (luckPotionTier > 0) {
        showGameNotification("Info", "A luck potion is already active!");
        return;
    }
    coins -= cost;
    luckPotionTier = tier;
    updateLuckPotionButtons();
    updateGameState();
    showGameNotification("Success", `Luck Potion Tier ${tier} activated! Your next roll will have increased odds for rarer cubes!`);
}

// Modify Odds for Luck Potion
function modifyOddsForLuckPotion(originalOdds, tier) {
    const multipliers = {
        1: 1.5, // Tier 1: 1.5x odds for non-Common
        2: 3,   // Tier 2: 3x odds for non-Common
        3: 5    // Tier 3: 5x odds for non-Common
    };
    const luckMultiplier = multipliers[tier];
    const modifiedOdds = { ...originalOdds };
    let totalNonCommon = 0;

    // Multiply odds for all rarities except Common
    for (let rarity in modifiedOdds) {
        if (rarity !== "Common") {
            modifiedOdds[rarity] *= luckMultiplier;
            totalNonCommon += modifiedOdds[rarity];
        }
    }

    // Adjust Common odds to ensure total probability sums to 1
    modifiedOdds.Common = 1 - totalNonCommon;

    // If Common odds become negative, redistribute proportionally
    if (modifiedOdds.Common < 0) {
        const total = totalNonCommon + Math.abs(modifiedOdds.Common);
        const scale = 1 / total;
        for (let rarity in modifiedOdds) {
            if (rarity !== "Common") {
                modifiedOdds[rarity] *= scale;
            }
        }
        modifiedOdds.Common = 0;
    }

    return modifiedOdds;
}

// Rolling Logic
function rollCube(tierIndex) {
    const tier = eggTiers[tierIndex];
    if (coins < tier.cost) {
        showGameNotification("Error", "Not enough coins!");
        return;
    }
    coins -= tier.cost;

    // Apply Luck Potion if active
    let odds = { ...tier.odds };
    if (luckPotionTier > 0) {
        odds = modifyOddsForLuckPotion(tier.odds, luckPotionTier);
        luckPotionTier = 0; // Deactivate after one roll
        updateLuckPotionButtons();
    }

    const rand = Math.random();
    let cumulative = 0;
    let rarity = "Common";
    for (let r in odds) {
        cumulative += odds[r];
        if (rand < cumulative) {
            rarity = r;
            break;
        }
    }
    const cube = {
        rarity: rarity,
        image: rarities[rarity].image,
        x: 200,
        y: 200,
        targetX: 200,
        targetY: 200,
        state: "paused",
        pauseTimer: 0,
        animationTimer: 0,
        particles: []
    };
    cubesArray.push(cube);
    // Unlock the cube if not already unlocked
    if (!unlockedCubes.includes(rarity)) {
        unlockedCubes.push(rarity);
        renderCubeIndex();
    }
    console.log(`Hatched a ${rarity} cube from a ${tier.name} egg! Total cubes: ${cubesArray.length}`);
    updateGameState();
    showHatchNotification(cube);
}

// Cube Production
setInterval(() => {
    cubesArray.forEach(cube => {
        cubes += rarities[cube.rarity].cubeRate;
    });
    framedCubes.forEach(cube => {
        if (cube) {
            cubes += rarities[cube.rarity].cubeRate;
        }
    });
    updateGameState();
}, 1000);

// Sell Cubes
elements.sellCubes.addEventListener("click", () => {
    coins += cubes * 10;
    cubes = 0;
    updateGameState();
});

// Game Loop
function gameLoop() {
    moveCubes();
    renderCubes();
    renderFramedCubes();
    requestAnimationFrame(gameLoop);
}

// Initialize
initializeCubeImages();
setRandomFavicon();
loadGame();
gameLoop();
updateGameState();
