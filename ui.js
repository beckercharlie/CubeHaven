// UI-related functions for Cube Haven

// Set a random cube as the favicon
function setRandomFavicon() {
    const rarityKeys = Object.keys(rarities);
    const randomRarity = rarityKeys[Math.floor(Math.random() * rarityKeys.length)];
    const cubeCanvas = document.getElementById(`cube-${randomRarity.toLowerCase()}`);
    const dataUrl = cubeCanvas.toDataURL("image/png");
    const faviconLink = document.getElementById("favicon");
    faviconLink.href = dataUrl;
}

// Toggle Settings Dropdown
function toggleSettingsDropdown() {
    const isVisible = elements.settingsDropdown.style.display === "flex";
    elements.settingsDropdown.style.display = isVisible ? "none" : "flex";
    // Close other dropdowns if open
    elements.cubeIndexDropdown.style.display = "none";
}

// Toggle Cube Index Dropdown
function toggleCubeIndexDropdown() {
    const isVisible = elements.cubeIndexDropdown.style.display === "flex";
    elements.cubeIndexDropdown.style.display = isVisible ? "none" : "flex";
    // Close settings dropdown if open
    elements.settingsDropdown.style.display = "none";
    // Ensure the cube index is up-to-date
    if (!isVisible) {
        renderCubeIndex();
    }
}

// Render Cube Index
function renderCubeIndex() {
    const cubeGrid = elements.cubeGrid;
    cubeGrid.innerHTML = ""; // Clear existing grid

    for (let rarity in rarities) {
        const isUnlocked = unlockedCubes.includes(rarity);
        const cubeItem = document.createElement("div");
        cubeItem.className = "cube-grid-item";

        // Create canvas for the cube
        const canvas = document.createElement("canvas");
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext("2d");

        if (isUnlocked) {
            // Draw the actual cube
            rarities[rarity].draw(ctx, { rarity: rarity, animationTimer: 0, particles: [] });
        } else {
            // Draw a gray placeholder
            ctx.fillStyle = "#808080";
            ctx.fillRect(0, 0, 40, 40);
        }

        // Add odds text
        const oddsText = document.createElement("p");
        oddsText.textContent = `${rarity}: ${rarities[rarity].odds}`;

        // Append to grid item
        cubeItem.appendChild(canvas);
        cubeItem.appendChild(oddsText);
        cubeGrid.appendChild(cubeItem);
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

    elements.hatchNotification.style.display = "block";
    const hatchCtx = elements.hatchCubeImage.getContext("2d");
    hatchCtx.clearRect(0, 0, 40, 40);
    rarities[cube.rarity].draw(hatchCtx, cube);

    elements.hatchCubeRarity.textContent = `Rarity: ${cube.rarity || "Unknown"}`;
    elements.hatchCubeOdds.textContent = `Odds: ${rarityData.odds || "N/A"}`;
    elements.hatchCubeRate.textContent = `Cubes per Second: ${formatNumber(rarityData.cubeRate || 0)}`;
    elements.hatchCubeSellValue.textContent = `Sell Value: ${formatNumber(rarityData.sellValue || 0)} coins`;
}

// Show Game Notification
function showGameNotification(title, message) {
    elements.gameNotification.style.display = "block";
    elements.gameNotificationTitle.textContent = title;
    elements.gameNotificationMessage.textContent = message;
}

// Close Hatch Notification
elements.closeHatch.addEventListener("click", () => {
    elements.hatchNotification.style.display = "none";
});

// Close Game Notification
elements.closeGameNotification.addEventListener("click", () => {
    elements.gameNotification.style.display = "none";
});

// Show Cube Info
function showCubeInfo(cube, source = "fenced") {
    elements.cubeInfo.style.display = "block";
    const rarityData = rarities[cube.rarity];
    const cubeCtx = elements.cubeImage.getContext("2d");
    cubeCtx.clearRect(0, 0, 40, 40);
    rarities[cube.rarity].draw(cubeCtx, cube);

    elements.cubeRarity.textContent = `Rarity: ${cube.rarity}`;
    elements.cubeOdds.textContent = `Odds: ${rarityData.odds}`;
    elements.cubeRate.textContent = `Cubes per Second: ${formatNumber(rarityData.cubeRate)}`;
    elements.cubeSellValue.textContent = `Sell Value: ${formatNumber(rarityData.sellValue)} coins`;

    // Adjust button visibility based on source
    elements.frameCube.style.display = source === "fenced" ? "inline-block" : "none";
    elements.removeFromFrame.style.display = source === "framed" ? "inline-block" : "none";

    selectedCube = cube;
    selectedCubeSource = source;
}

// Close Cube Info
elements.closeInfo.addEventListener("click", () => {
    elements.cubeInfo.style.display = "none";
    selectedCube = null;
    selectedCubeSource = null;
});

// Sell Cube from Info
elements.sellCube.addEventListener("click", () => {
    if (!selectedCube) return;
    const index = selectedCubeSource === "fenced" ? cubesArray.indexOf(selectedCube) : framedCubes.indexOf(selectedCube);
    if (index === -1) return;

    coins += rarities[selectedCube.rarity].sellValue;
    if (selectedCubeSource === "fenced") {
        cubesArray.splice(index, 1);
    } else {
        framedCubes[index] = null;
        renderFramedCubes();
    }
    elements.cubeInfo.style.display = "none";
    selectedCube = null;
    selectedCubeSource = null;
    updateGameState();
});

// Frame Cube from Info
elements.frameCube.addEventListener("click", () => {
    if (!selectedCube) return;
    frameCube(selectedCube);
});

// Remove Cube from Frame via Info
elements.removeFromFrame.addEventListener("click", () => {
    if (!selectedCube || selectedCubeSource !== "framed") return;
    const frameIndex = framedCubes.indexOf(selectedCube);
    removeFromFrame(frameIndex);
});

// Click on Fenced Area Cubes
elements.canvas.addEventListener("click", (event) => {
    const rect = elements.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = cubesArray.length - 1; i >= 0; i--) {
        const cube = cubesArray[i];
        const dx = x - cube.x;
        const dy = y - cube.y;
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
            showCubeInfo(cube, "fenced");
            return;
        }
    }
});

// Click on Frames
document.querySelectorAll(".frame").forEach(frame => {
    frame.addEventListener("click", (event) => {
        const frameId = parseInt(frame.dataset.frameId);
        const cube = framedCubes[frameId];
        if (cube) {
            showCubeInfo(cube, "framed");
        }
    });
});

// Egg Shop Buttons
document.querySelectorAll(".egg-button").forEach(button => {
    button.addEventListener("click", () => {
        const tier = parseInt(button.dataset.tier) - 1;
        button.classList.add("pulse");
        rollCube(tier);
    });
});

// Luck Potion Buttons
elements.luckPotion1.addEventListener("click", () => {
    activateLuckPotion(1);
});

elements.luckPotion2.addEventListener("click", () => {
    activateLuckPotion(2);
});

elements.luckPotion3.addEventListener("click", () => {
    activateLuckPotion(3);
});

// Settings Dropdown
elements.settingsToggle.addEventListener("click", toggleSettingsDropdown);
elements.saveGame.addEventListener("click", saveGame);
elements.restartGame.addEventListener("click", restartGame);
elements.cubeIndexToggle.addEventListener("click", toggleCubeIndexDropdown);
elements.closeCubeIndex.addEventListener("click", () => {
    elements.cubeIndexDropdown.style.display = "none";
});