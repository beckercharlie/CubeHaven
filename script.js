// Game State
let coins = 100;
let cubes = 0;
let cubesArray = [];
let framedCubes = Array(10).fill(null);
let selectedCube = null;
let selectedCubeSource = null;
let unlockedRarities = new Set();
let luckMultiplier = 1; // Tracks luck for next roll
let minRarity = null; // Minimum rarity for next roll
let hasLuckPotion = false; // Indicates if luck potion is active
let lastLoadTime = Date.now(); // Track last load to prevent rapid reloads
let lastUpdateTime = Date.now(); // Track time for cube generation
let accumulatedTime = 0; // Track accumulated time for cube updates
let unlockedEggs = [true, false, false, false, false]; // Basic Egg unlocked by default
let unlockedPotions = [false, false, false]; // All potions locked initially

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
            Exotic: 0.00005,
            Mystic: 0.00003,
            Radiant: 0.00001,
            Vortex: 0.000005,
            Insane: 0.000003, 
            Unfathomable: 0.000001,
            Ethereal: 0.0000005,
            Cosmic: 0.0000003,
            Nebulaic: 0.0000002,
            Stellar: 0.0000001,
            Supernova: 0.00000005,
            Quasar: 0.00000003,
            Voidic: 0.00000001,
            GalacticCore: 0.000000005,
            Infinity: 0.000000003,
            Primordial: 0.000000001
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
            Exotic: 0.0005,
            Mystic: 0.0003,
            Radiant: 0.0001,
            Vortex: 0.00005,
            Insane: 0.00003, 
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
            Exotic: 0.001,
            Mystic: 0.0005,
            Radiant: 0.0003,
            Vortex: 0.0001,
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
        name: "Diamond", 
        cost: 100000, 
        odds: { 
            Common: 0.10, 
            Rare: 0.05, 
            Epic: 0.20, 
            Legendary: 0.15, 
            Mythic: 0.10, 
            Galactic: 0.08, 
            Celestial: 0.06, 
            Astronomic: 0.04, 
            Exotic: 0.02,
            Mystic: 0.01,
            Radiant: 0.005,
            Vortex: 0.002,
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
        name: "Mythic", 
        cost: 1000000, 
        odds: { 
            Common: 0.05, 
            Rare: 0.03, 
            Epic: 0.10, 
            Legendary: 0.10, 
            Mythic: 0.08, 
            Galactic: 0.07, 
            Celestial: 0.06, 
            Astronomic: 0.05, 
            Exotic: 0.04,
            Mystic: 0.03,
            Radiant: 0.02,
            Vortex: 0.01,
            Insane: 0.005, 
            Unfathomable: 0.002,
            Ethereal: 0.001,
            Cosmic: 0.0005,
            Nebulaic: 0.0003,
            Stellar: 0.0002,
            Supernova: 0.0001,
            Quasar: 0.00005,
            Voidic: 0.00003,
            GalacticCore: 0.00001,
            Infinity: 0.000005,
            Primordial: 0.000003
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
    Exotic: { odds: "1/1,500,000", cubeRate: 6.0, image: null, sellValue: 2500000 },
    Mystic: { odds: "1/3,000,000", cubeRate: 6.8, image: null, sellValue: 7500000 },
    Radiant: { odds: "1/10,000,000", cubeRate: 7.2, image: null, sellValue: 10000000 },
    Vortex: { odds: "1/50,000,000", cubeRate: 7.6, image: null, sellValue: 15000000 },
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

const potionTiers = [
    { name: "Tier 1", cost: 5000, multipliers: { low: 3, mid: 2, high: 1.5 }, minRarity: { low: "Rare", mid: "Epic", high: "Epic" } },
    { name: "Tier 2", cost: 25000, multipliers: { low: 10, mid: 8, high: 5 }, minRarity: { low: "Epic", mid: "Legendary", high: "Legendary" } },
    { name: "Tier 3", cost: 100000, multipliers: { low: 50, mid: 30, high: 15 }, minRarity: { low: "Legendary", mid: "Mythic", high: "Mythic" } }
];

// DOM Elements
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
    cubeIndexGrid: document.getElementById("cube-index-grid"),
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
    eggUnlockContainer: document.getElementById("egg-unlock-container"),
    potionShopTitle: document.getElementById("potion-shop-title"),
    potionUnlockContainer: document.getElementById("potion-unlock-container"),
    clovers: [
        document.getElementById("clover-1"),
        document.getElementById("clover-2"),
        document.getElementById("clover-3"),
        document.getElementById("clover-4"),
        document.getElementById("clover-5")
    ],
    buyMeACoffee: document.getElementById("buy-me-a-coffee")
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
                const swirl = (cube.animationTimer + i) % (Math.PI * 2);
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
        Exotic: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#00FF00");
            gradient.addColorStop(1, "#006400");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.04;
            cube.particles = cube.particles || [];
            if (Math.random() < 0.15) {
                const angle = cube.animationTimer % (Math.PI * 2);
                cube.particles.push(new Particle(
                    20 + Math.cos(angle) * 15, 20 + Math.sin(angle) * 15,
                    1, "#FFFFFF", 0.5, angle, 800
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Mystic: (ctx, cube) => {
            const gradient = ctx.createLinearGradient(0, 0, 40, 40);
            gradient.addColorStop(0, "#1E90FF");
            gradient.addColorStop(1, "#4B0082");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.animationTimer = (cube.animationTimer || 0) + 0.03;
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(cube.animationTimer))})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI / 2) + cube.animationTimer;
                ctx.beginPath();
                ctx.moveTo(20, 20);
                ctx.lineTo(20 + Math.cos(angle) * 15, 20 + Math.sin(angle) * 15);
                ctx.stroke();
            }
        },
        Radiant: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#FFFF00");
            gradient.addColorStop(1, "#FFA500");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            if (Math.random() < 0.2) {
                cube.particles.push(new Particle(
                    20 + (Math.random() - 0.5) * 20,
                    20 + (Math.random() - 0.5) * 20,
                    1, "#FFFFFF", 1, Math.random() * Math.PI * 2, 600
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
        },
        Vortex: (ctx, cube) => {
            const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
            gradient.addColorStop(0, "#000000");
            gradient.addColorStop(1, "#1E90FF");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 40, 40);
            cube.particles = cube.particles || [];
            cube.animationTimer = (cube.animationTimer || 0) + 0.05;
            if (Math.random() < 0.1) {
                const angle = Math.random() * Math.PI * 2;
                cube.particles.push(new Particle(
                    20 + Math.cos(angle) * 20, 20 + Math.sin(angle) * 20,
                    1, "#00BFFF", 0.8, angle + Math.PI, 1000
                ));
            }
            cube.particles = cube.particles.filter(p => p.lifetime > 0);
            cube.particles.forEach(p => {
                p.update(16);
                p.draw(ctx);
            });
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
        if (canvas) {
            const ctx = canvas.getContext("2d");
            rarities[rarity].image = canvas;
            rarities[rarity].draw = designs[rarity];
        }
    }
}

// Set a random cube as the favicon
function setRandomFavicon() {
    const rarityKeys = Object.keys(rarities);
    const randomRarity = rarityKeys[Math.floor(Math.random() * rarityKeys.length)];
    const cubeCanvas = document.getElementById(`cube-${randomRarity.toLowerCase()}`);
    if (cubeCanvas) {
        const dataUrl = cubeCanvas.toDataURL("image/png");
        const faviconLink = document.getElementById("favicon");
        if (faviconLink) faviconLink.href = dataUrl;
    }
}

// Initialize cube images and set favicon
initializeCubeImages();
setRandomFavicon();

// Utility Functions
function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(2);
}

function updateGameState() {
    if (elements.coinCounter) elements.coinCounter.textContent = `Coins: ${formatNumber(coins)}`;
    if (elements.cubeCounter) elements.cubeCounter.textContent = `Cubes: ${formatNumber(cubes)}`;
    if (elements.clovers) {
        elements.clovers.forEach(clover => {
            if (clover) clover.style.display = hasLuckPotion ? "block" : "none";
        });
    }
    renderShop();
}

// Calculate total cube generation rate from cubesArray and framedCubes
function calculateTotalCubeRate() {
    const arrayRate = cubesArray.reduce((total, cube) => {
        if (cube && cube.rarity && rarities[cube.rarity]) {
            return total + rarities[cube.rarity].cubeRate;
        }
        return total;
    }, 0);
    const frameRate = framedCubes.reduce((total, cube) => {
        if (cube && cube.rarity && rarities[cube.rarity]) {
            return total + rarities[cube.rarity].cubeRate;
        }
        return total;
    }, 0);
    return arrayRate + frameRate;
}

// Update cube currency based on cube rate
function updateCubes(deltaTime) {
    const cubeRate = calculateTotalCubeRate();
    cubes += cubeRate * (deltaTime / 1000); // Convert deltaTime to seconds
    if (elements.cubeCounter) elements.cubeCounter.textContent = `Cubes: ${formatNumber(cubes)}`;
}

// Render Shop (Eggs and Potions)
function renderShop() {
    console.log(`Rendering shop, unlockedEggs: ${JSON.stringify(unlockedEggs)}, unlockedPotions: ${JSON.stringify(unlockedPotions)}, coins: ${coins}`);

    // Handle egg visibility
    document.querySelectorAll(".egg-button-container").forEach((container, index) => {
        if (container && unlockedEggs[index]) {
            container.style.display = "block";
        } else if (container) {
            container.style.display = "none";
        }
    });

    // Handle egg unlock buttons
    if (elements.eggUnlockContainer) {
        elements.eggUnlockContainer.innerHTML = "";
        for (let i = 1; i < eggTiers.length; i++) {
            if (!unlockedEggs[i] && coins >= eggTiers[i].cost * 0.5) { // Show if player has half the cost
                const unlockContainer = document.createElement("div");
                unlockContainer.className = "unlock-button-container";
                const unlockButton = document.createElement("button");
                unlockButton.className = "unlock-button";
                unlockButton.textContent = `Unlock ${eggTiers[i].name} Egg (${formatNumber(eggTiers[i].cost)} coins)`;
                unlockButton.setAttribute("data-tier", i.toString());
                unlockButton.addEventListener("click", () => unlockEgg(i));
                unlockContainer.appendChild(unlockButton);
                elements.eggUnlockContainer.appendChild(unlockContainer);
            }
        }
    }

    // Handle potion visibility and unlock buttons
    const goldEggUnlocked = unlockedEggs[2]; // Gold Egg is at index 2
    if (elements.potionShopTitle) {
        elements.potionShopTitle.style.display = goldEggUnlocked ? "block" : "none";
    }
    if (elements.potionUnlockContainer) {
        elements.potionUnlockContainer.style.display = goldEggUnlocked ? "block" : "none";
    }

    document.querySelectorAll(".potion-button-container").forEach((container, index) => {
        if (container && goldEggUnlocked && unlockedPotions[index]) {
            container.style.display = "block";
        } else if (container) {
            container.style.display = "none";
        }
    });

    if (elements.potionUnlockContainer && goldEggUnlocked) {
        elements.potionUnlockContainer.innerHTML = "";
        for (let i = 0; i < potionTiers.length; i++) {
            if (!unlockedPotions[i] && coins >= potionTiers[i].cost * 0.5) { // Show if player has half the cost
                const unlockContainer = document.createElement("div");
                unlockContainer.className = "unlock-button-container";
                const unlockButton = document.createElement("button");
                unlockButton.className = "unlock-button";
                unlockButton.textContent = `Unlock Luck Potion ${potionTiers[i].name} (${formatNumber(potionTiers[i].cost)} coins)`;
                unlockButton.setAttribute("data-potion-tier", i.toString());
                unlockButton.addEventListener("click", () => unlockPotion(i));
                unlockContainer.appendChild(unlockButton);
                elements.potionUnlockContainer.appendChild(unlockContainer);
            }
        }
    }

    // Reattach egg button listeners
    document.querySelectorAll(".egg-button").forEach(button => {
        if (button) {
            // Remove existing listener to prevent duplicates
            button.removeEventListener("click", button._listener);
            const tier = parseInt(button.dataset.tier);
            const listener = () => buyEgg(tier);
            button.addEventListener("click", listener);
            button._listener = listener; // Store for future removal
        }
    });

    // Reattach potion button listeners
    document.querySelectorAll(".potion-button").forEach(button => {
        if (button) {
            button.removeEventListener("click", button._listener);
            const tier = parseInt(button.dataset.potionTier);
            const listener = () => buyLuckPotion(tier);
            button.addEventListener("click", listener);
            button._listener = listener;
        }
    });
}

// Unlock Egg
function unlockEgg(tierIndex) {
    if (coins < eggTiers[tierIndex].cost) {
        showGameNotification("Error", "Not enough coins to unlock!");
        return;
    }
    coins -= eggTiers[tierIndex].cost;
    unlockedEggs[tierIndex] = true;
    updateGameState();
}

// Unlock Potion
function unlockPotion(tierIndex) {
    if (coins < potionTiers[tierIndex].cost) {
        showGameNotification("Error", "Not enough coins to unlock!");
        return;
    }
    coins -= potionTiers[tierIndex].cost;
    unlockedPotions[tierIndex] = true;
    updateGameState();
}

// Clear Pending Transaction
function clearPendingTransaction() {
    try {
        localStorage.removeItem("cubeHavenPendingTransaction");
        console.log("Pending transaction cleared.");
    } catch (e) {
        console.error("Failed to clear pending transaction:", e);
    }
}

// Toggle Settings Dropdown
function toggleSettingsDropdown() {
    if (elements.settingsDropdown) {
        const isVisible = elements.settingsDropdown.style.display === "flex";
        elements.settingsDropdown.style.display = isVisible ? "none" : "flex";
        if (elements.cubeIndexDropdown) elements.cubeIndexDropdown.style.display = "none";
    }
}

// Toggle Cube Index Dropdown
function toggleCubeIndex() {
    if (elements.cubeIndexDropdown) {
        const isVisible = elements.cubeIndexDropdown.style.display === "block";
        elements.cubeIndexDropdown.style.display = isVisible ? "none" : "block";
        if (elements.settingsDropdown) elements.settingsDropdown.style.display = "none";
        if (!isVisible) renderCubeIndex();
    }
}

// Render Cube Index
function renderCubeIndex() {
    if (elements.cubeIndexGrid) {
        elements.cubeIndexGrid.innerHTML = "";
        for (let rarity in rarities) {
            const itemDiv = document.createElement("div");
            itemDiv.className = `cube-index-item ${unlockedRarities.has(rarity) ? "" : "locked"}`;
            const canvas = document.createElement("canvas");
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext("2d");
            if (unlockedRarities.has(rarity)) {
                const cube = { rarity, animationTimer: 0, particles: [] };
                rarities[rarity].draw(ctx, cube);
            } else {
                ctx.fillStyle = "#808080";
                ctx.fillRect(0, 0, 40, 40);
            }
            const oddsP = document.createElement("p");
            oddsP.textContent = `Odds: ${rarities[rarity].odds}`;
            const nameP = document.createElement("p");
            nameP.textContent = rarity;
            itemDiv.appendChild(canvas);
            itemDiv.appendChild(nameP);
            itemDiv.appendChild(oddsP);
            elements.cubeIndexGrid.appendChild(itemDiv);
        }
    }
}

// Show Hatch Notification
function showHatchNotification(cube) {
    if (!cube || !cube.rarity || !cube.image) {
        console.error("Invalid cube object:", cube);
        showGameNotification("Error", "Failed to display cube details. Invalid cube data.");
        return;
    }

    const rarityData = rarities[cube.rarity];
    if (!rarityData) {
        console.error("Rarity data not found for:", cube.rarity);
        showGameNotification("Error", "Failed to display cube details. Rarity data not found.");
        return;
    }

    if (elements.hatchNotification) {
        elements.hatchNotification.style.display = "block";
        const hatchCtx = elements.hatchCubeImage.getContext("2d");
        hatchCtx.clearRect(0, 0, 40, 40);
        rarities[cube.rarity].draw(hatchCtx, cube);

        if (elements.hatchCubeRarity) elements.hatchCubeRarity.textContent = `Rarity: ${cube.rarity || "Unknown"}`;
        if (elements.hatchCubeOdds) elements.hatchCubeOdds.textContent = `Odds: ${rarityData.odds || "N/A"}`;
        if (elements.hatchCubeRate) elements.hatchCubeRate.textContent = `Cubes per Second: ${formatNumber(rarityData.cubeRate || 0)}`;
        if (elements.hatchCubeSellValue) elements.hatchCubeSellValue.textContent = `Sell Value: ${formatNumber(rarityData.sellValue || 0)} coins`;
    }
}

// Show Game Notification
function showGameNotification(title, message) {
    if (elements.gameNotification) {
        elements.gameNotification.style.display = "block";
        if (elements.gameNotificationTitle) elements.gameNotificationTitle.textContent = title;
        if (elements.gameNotificationMessage) elements.gameNotificationMessage.textContent = message;
    }
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
        unlockedRarities: Array.from(unlockedRarities),
        luckMultiplier: luckMultiplier,
        minRarity: minRarity,
        hasLuckPotion: hasLuckPotion,
        unlockedEggs: unlockedEggs,
        unlockedPotions: unlockedPotions
    };
    try {
        localStorage.setItem("cubeHavenSave", JSON.stringify(gameState));
        clearPendingTransaction(); // Clear any pending transaction after saving
        console.log("Game saved:", gameState);
        showGameNotification("Success", "Game Saved!");
    } catch (e) {
        console.error("Failed to save game:", e);
        showGameNotification("Error", "Failed to save game.");
    }
    toggleSettingsDropdown();
}

// Load Game Function
function loadGame() {
    console.log("Attempting to load game...");
    const now = Date.now();
    if (now - lastLoadTime < 5000) {
        console.log("Load skipped: too soon since last load.");
        return;
    }
    lastLoadTime = now;

    // Check for pending transaction
    const pendingTransaction = localStorage.getItem("cubeHavenPendingTransaction");
    if (pendingTransaction) {
        try {
            const transaction = JSON.parse(pendingTransaction);
            if (transaction.coinsSpent && transaction.cube && transaction.cube.rarity) {
                console.log("Applying pending transaction:", transaction);
                coins -= transaction.coinsSpent;
                const cube = {
                    rarity: transaction.cube.rarity,
                    image: rarities[transaction.cube.rarity]?.image || null,
                    x: transaction.cube.x || 200,
                    y: transaction.cube.y || 200,
                    targetX: transaction.cube.targetX || 200,
                    targetY: transaction.cube.targetY || 200,
                    state: transaction.cube.state || "paused",
                    pauseTimer: transaction.cube.pauseTimer || 0,
                    animationTimer: 0,
                    particles: []
                };
                if (cube.image) {
                    cubesArray.push(cube);
                    unlockedRarities.add(cube.rarity);
                }
            }
        } catch (e) {
            console.error("Failed to apply pending transaction:", e);
        }
    }

    const savedState = localStorage.getItem("cubeHavenSave");
    if (savedState) {
        try {
            const gameState = JSON.parse(savedState);
            coins = Number.isFinite(gameState.coins) ? gameState.coins : 100;
            cubes = Number.isFinite(gameState.cubes) ? gameState.cubes : 0;
            cubesArray = (gameState.cubesArray || []).map(cube => ({
                rarity: cube.rarity,
                image: rarities[cube.rarity]?.image || null,
                x: cube.x || 200,
                y: cube.y || 200,
                targetX: cube.targetX || 200,
                targetY: cube.targetY || 200,
                state: cube.state || "paused",
                pauseTimer: cube.pauseTimer || 0,
                animationTimer: 0,
                particles: []
            })).filter(cube => cube.image);
            framedCubes = (gameState.framedCubes || Array(10).fill(null)).map(cube => cube ? {
                rarity: cube.rarity,
                image: rarities[cube.rarity]?.image || null,
                animationTimer: 0,
                particles: []
            } : null).filter(cube => cube === null || cube.image);
            unlockedRarities = new Set(gameState.unlockedRarities || []);
            luckMultiplier = Number.isFinite(gameState.luckMultiplier) ? gameState.luckMultiplier : 1;
            minRarity = gameState.minRarity || null;
            hasLuckPotion = !!gameState.hasLuckPotion;
            unlockedEggs = Array.isArray(gameState.unlockedEggs) && gameState.unlockedEggs.length === 5 ? gameState.unlockedEggs : [true, false, false, false, false];
            unlockedPotions = Array.isArray(gameState.unlockedPotions) && gameState.unlockedPotions.length === 3 ? gameState.unlockedPotions : [false, false, false];
            console.log("Game loaded:", gameState);
            updateGameState();
            renderFramedCubes();
            showGameNotification("Success", "Game Loaded!");
        } catch (e) {
            console.error("Failed to load game:", e);
            showGameNotification("Error", "Failed to load game. Resetting to default.");
            resetToDefault();
        }
    } else {
        console.log("No saved game found.");
        showGameNotification("Info", "No saved game found.");
    }
}

// Reset to Default State
function resetToDefault() {
    coins = 100;
    cubes = 0;
    cubesArray = [];
    framedCubes = Array(10).fill(null);
    unlockedRarities = new Set();
    luckMultiplier = 1;
    minRarity = null;
    hasLuckPotion = false;
    unlockedEggs = [true, false, false, false, false];
    unlockedPotions = [false, false, false];
    localStorage.removeItem("cubeHavenSave");
    clearPendingTransaction(); // Clear pending transaction on reset
    updateGameState();
    renderFramedCubes();
    showGameNotification("Info", "Game reset to default due to load error.");
}

// Restart Game Function
function restartGame() {
    coins = 100;
    cubes = 0;
    cubesArray = [];
    framedCubes = Array(10).fill(null);
    unlockedRarities = new Set();
    luckMultiplier = 1;
    minRarity = null;
    hasLuckPotion = false;
    unlockedEggs = [true, false, false, false, false];
    unlockedPotions = [false, false, false];
    localStorage.removeItem("cubeHavenSave");
    clearPendingTransaction(); // Clear pending transaction on restart
    updateGameState();
    renderFramedCubes();
    showGameNotification("Success", "Game Restarted!");
    toggleSettingsDropdown();
}

// Buy Egg Function
function buyEgg(tier) {
    console.log(`Attempting to buy egg tier ${tier}, coins: ${coins}, unlocked: ${unlockedEggs[tier - 1]}`);
    if (tier < 1 || tier > eggTiers.length) {
        console.warn(`Invalid egg tier: ${tier}`);
        showGameNotification("Error", "Invalid egg tier!");
        return;
    }
    const egg = eggTiers[tier - 1];
    if (!unlockedEggs[tier - 1]) {
        console.warn(`Egg ${egg.name} is locked`);
        showGameNotification("Error", `${egg.name} Egg is locked!`);
        return;
    }
    if (coins < egg.cost) {
        console.warn(`Not enough coins: ${coins} < ${egg.cost}`);
        showGameNotification("Error", "Not enough coins!");
        return;
    }
    coins -= egg.cost;
    const cube = hatchEgg(egg);

    // Store pending transaction
    const transaction = {
        coinsSpent: egg.cost,
        cube: {
            rarity: cube.rarity,
            x: cube.x,
            y: cube.y,
            targetX: cube.targetX,
            targetY: cube.targetY,
            state: cube.state,
            pauseTimer: cube.pauseTimer
        }
    };
    try {
        localStorage.setItem("cubeHavenPendingTransaction", JSON.stringify(transaction));
        console.log("Pending transaction stored:", transaction);
    } catch (e) {
        console.error("Failed to store pending transaction:", e);
    }

    cubesArray.push(cube);
    unlockedRarities.add(cube.rarity);
    updateGameState();
    showHatchNotification(cube);
}

// Hatch Egg Function
function hatchEgg(egg) {
    let odds = { ...egg.odds };
    if (hasLuckPotion) {
        for (let rarity in odds) {
            odds[rarity] *= luckMultiplier;
        }
        const total = Object.values(odds).reduce((sum, val) => sum + val, 0);
        for (let rarity in odds) {
            odds[rarity] /= total;
        }
    }

    let cumulative = 0;
    const r = Math.random();
    let selectedRarity = "Common";
    for (let rarity in odds) {
        cumulative += odds[rarity];
        if (r <= cumulative) {
            selectedRarity = rarity;
            break;
        }
    }

    if (minRarity && hasLuckPotion) {
        const rarityOrder = Object.keys(rarities);
        const minIndex = rarityOrder.indexOf(minRarity);
        const selectedIndex = rarityOrder.indexOf(selectedRarity);
        if (selectedIndex < minIndex) {
            selectedRarity = minRarity;
        }
    }

    luckMultiplier = 1;
    minRarity = null;
    hasLuckPotion = false;

    return {
        rarity: selectedRarity,
        image: rarities[selectedRarity].image,
        x: 200,
        y: 200,
        targetX: 200,
        targetY: 200,
        state: "paused",
        pauseTimer: 0,
        animationTimer: 0,
        particles: []
    };
}

// Buy Luck Potion Function
function buyLuckPotion(tier) {
    if (tier < 1 || tier > potionTiers.length) {
        showGameNotification("Error", "Invalid potion tier!");
        return;
    }
    const potion = potionTiers[tier - 1];
    if (!unlockedPotions[tier - 1]) {
        showGameNotification("Error", `Luck Potion ${potion.name} is locked!`);
        return;
    }
    if (coins < potion.cost) {
        showGameNotification("Error", "Not enough coins!");
        return;
    }
    coins -= potion.cost;
    let multiplierKey = "low";
    const r = Math.random();
    if (r < 0.2) multiplierKey = "high";
    else if (r < 0.6) multiplierKey = "mid";
    luckMultiplier = potion.multipliers[multiplierKey];
    minRarity = potion.minRarity[multiplierKey];
    hasLuckPotion = true;
    updateGameState();
}

// Sell Cubes Function
function sellCubes() {
    if (cubes === 0) {
        showGameNotification("Error", "No cube currency to sell!");
        return;
    }
    const totalValue = cubes * 10; // 1 cube currency = 10 coins
    coins += totalValue;
    cubes = 0;
    updateGameState();
}

// Show Cube Info
function showCubeInfo(cube, source) {
    if (!cube || !cube.rarity || !cube.image) {
        showGameNotification("Error", "Invalid cube selected!");
        return;
    }
    selectedCube = cube;
    selectedCubeSource = source;
    if (elements.cubeInfo) {
        elements.cubeInfo.style.display = "block";
        const cubeCtx = elements.cubeImage.getContext("2d");
        cubeCtx.clearRect(0, 0, 40, 40);
        rarities[cube.rarity].draw(cubeCtx, cube);
        if (elements.cubeRarity) elements.cubeRarity.textContent = `Rarity: ${cube.rarity}`;
        if (elements.cubeOdds) elements.cubeOdds.textContent = `Odds: ${rarities[cube.rarity].odds}`;
        if (elements.cubeRate) elements.cubeRate.textContent = `Cubes per Second: ${formatNumber(rarities[cube.rarity].cubeRate)}`;
        if (elements.cubeSellValue) elements.cubeSellValue.textContent = `Sell Value: ${formatNumber(rarities[cube.rarity].sellValue)} coins`;
        if (elements.removeFromFrame) elements.removeFromFrame.style.display = source === "frame" ? "inline-block" : "none";
        if (elements.frameCube) elements.frameCube.style.display = source === "array" ? "inline-block" : "none";
    }
}

// Sell Selected Cube
function sellCube() {
    if (!selectedCube) {
        showGameNotification("Error", "No cube selected!");
        return;
    }
    coins += rarities[selectedCube.rarity].sellValue;
    if (selectedCubeSource === "array") {
        cubesArray = cubesArray.filter(cube => cube !== selectedCube);
    } else if (selectedCubeSource === "frame") {
        const index = framedCubes.indexOf(selectedCube);
        if (index !== -1) framedCubes[index] = null;
    }
    selectedCube = null;
    selectedCubeSource = null;
    if (elements.cubeInfo) elements.cubeInfo.style.display = "none";
    updateGameState();
    renderFramedCubes();
}

// Frame Cube
function frameCube() {
    if (!selectedCube || selectedCubeSource !== "array") {
        showGameNotification("Error", "No cube selected or invalid source!");
        return;
    }
    const emptyFrame = framedCubes.findIndex(cube => cube === null);
    if (emptyFrame === -1) {
        showGameNotification("Error", "No empty frames available!");
        return;
    }
    framedCubes[emptyFrame] = selectedCube;
    cubesArray = cubesArray.filter(cube => cube !== selectedCube);
    selectedCube = null;
    selectedCubeSource = null;
    if (elements.cubeInfo) elements.cubeInfo.style.display = "none";
    updateGameState();
    renderFramedCubes();
}

// Remove Cube from Frame
function removeFromFrame() {
    if (!selectedCube || selectedCubeSource !== "frame") {
        showGameNotification("Error", "No cube selected or not in frame!");
        return;
    }
    const index = framedCubes.indexOf(selectedCube);
    if (index !== -1) {
        framedCubes[index] = null;
        cubesArray.push(selectedCube);
    }
    selectedCube = null;
    selectedCubeSource = null;
    if (elements.cubeInfo) elements.cubeInfo.style.display = "none";
    updateGameState();
    renderFramedCubes();
}

// Render Framed Cubes
function renderFramedCubes() {
    document.querySelectorAll(".frame").forEach(frame => {
        if (frame) {
            const frameId = parseInt(frame.dataset.frameId);
            const cube = framedCubes[frameId];
            const canvas = document.getElementById(`frame-${frameId}-canvas`);
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 40, 40);
                if (cube && cube.rarity && rarities[cube.rarity]) {
                    rarities[cube.rarity].draw(ctx, cube);
                }
            }
        }
    });
}

// Update Cubes (Movement and Animation)
function update(deltaTime) {
    accumulatedTime += deltaTime;
    if (accumulatedTime >= 1000) { // Update cubes every second
        updateCubes(accumulatedTime);
        accumulatedTime = 0; // Reset accumulated time
    }

    cubesArray.forEach(cube => {
        if (!cube || !cube.rarity || !cube.image) return;

        if (cube.state === "moving") {
            const dx = cube.targetX - cube.x;
            const dy = cube.targetY - cube.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 5) {
                cube.state = "paused";
                cube.pauseTimer = Math.random() * 2000 + 1000;
            } else {
                const speed = 100; // Pixels per second
                cube.x += (dx / distance) * speed * (deltaTime / 1000);
                cube.y += (dy / distance) * speed * (deltaTime / 1000);
            }
        } else if (cube.state === "paused") {
            cube.pauseTimer -= deltaTime;
            if (cube.pauseTimer <= 0) {
                cube.state = "moving";
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * (fenceRadius - 20);
                cube.targetX = 200 + Math.cos(angle) * radius;
                cube.targetY = 200 + Math.sin(angle) * radius;
            }
        }
    });

    if (ctx) {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        cubesArray.forEach(cube => {
            if (cube && cube.image && cube.rarity && rarities[cube.rarity]) {
                const cubeCtx = cube.image.getContext("2d");
                cubeCtx.clearRect(0, 0, 40, 40);
                rarities[cube.rarity].draw(cubeCtx, cube);
                ctx.drawImage(cube.image, cube.x - 20, cube.y - 20, 40, 40);
            }
        });
    }
}

// Animation Loop
let lastTime = performance.now();
function animate() {
    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    update(deltaTime);
    renderFramedCubes();
    requestAnimationFrame(animate);
}

// Event Listeners
if (elements.sellCubes) elements.sellCubes.addEventListener("click", sellCubes);
if (elements.settingsToggle) elements.settingsToggle.addEventListener("click", toggleSettingsDropdown);
if (elements.saveGame) elements.saveGame.addEventListener("click", saveGame);
if (elements.restartGame) elements.restartGame.addEventListener("click", restartGame);
if (elements.cubeIndexToggle) elements.cubeIndexToggle.addEventListener("click", toggleCubeIndex);
if (elements.closeCubeIndex) elements.closeCubeIndex.addEventListener("click", toggleCubeIndex);
if (elements.closeInfo) elements.closeInfo.addEventListener("click", () => {
    if (elements.cubeInfo) elements.cubeInfo.style.display = "none";
    selectedCube = null;
    selectedCubeSource = null;
});
if (elements.closeHatch) elements.closeHatch.addEventListener("click", () => {
    if (elements.hatchNotification) elements.hatchNotification.style.display = "none";
});
if (elements.closeGameNotification) elements.closeGameNotification.addEventListener("click", () => {
    if (elements.gameNotification) elements.gameNotification.style.display = "none";
});
if (elements.sellCube) elements.sellCube.addEventListener("click", sellCube);
if (elements.frameCube) elements.frameCube.addEventListener("click", frameCube);
if (elements.removeFromFrame) elements.removeFromFrame.addEventListener("click", removeFromFrame);
if (elements.buyMeACoffee) {
    elements.buyMeACoffee.addEventListener("click", () => {
        window.open("https://buymeacoffee.com/cbecker", "_blank");
    });
}

document.querySelectorAll(".frame").forEach(frame => {
    if (frame) {
        frame.addEventListener("click", () => {
            const frameId = parseInt(frame.dataset.frameId);
            const cube = framedCubes[frameId];
            if (cube) showCubeInfo(cube, "frame");
        });
    }
});

if (elements.canvas) {
    elements.canvas.addEventListener("click", (event) => {
        const rect = elements.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        let closestCube = null;
        let minDistance = Infinity;

        cubesArray.forEach(cube => {
            if (!cube || !cube.x || !cube.y) return;
            const distance = Math.sqrt((clickX - cube.x) ** 2 + (clickY - cube.y) ** 2);
            if (distance < minDistance && distance < 20) {
                minDistance = distance;
                closestCube = cube;
            }
        });

        if (closestCube) {
            showCubeInfo(closestCube, "array");
        }
    });
}

// Initialize Game
loadGame();
updateGameState();
animate();
