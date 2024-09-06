const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const cursor = document.querySelector(".custom-cursor");
const tooltip = document.querySelector(".cursor-tooltip");
const heroCopy = document.querySelector(".hero-copy");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "rgba(0, 0, 0, 0.97)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.lineJoin = 2;
ctx.lineCap = "round";
// 지우는 범위 조절
ctx.lineWidth = 600;

ctx.globalCompositeOperation = "destination-out";

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];

    // Check if canvas is fully wiped after each stroke
    checkCanvasWiped();
}
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// ! custom cursor + Effect
function checkCanvasWiped() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Check if pixel is not fully transparent
        if (data[i + 3] !== 0) {
            return; // Canvas is not fully wiped
        }
    }

    // If we've reached here, the canvas is fully wiped
    hideTooltip();
    fadeOutHeroCopy();
}

function hideCursor() {
    cursor.style.opacity = "0";
}

function showCursor() {
    cursor.style.opacity = "1";
}

document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
});

document.addEventListener("mousedown", () => {
    applyPressEffect();
    hideTooltip();
});

document.addEventListener("mouseup", () => {
    removePressEffect();

    // Only hide tooltip if canvas is not fully wiped
    if (!isCanvasFullyWiped()) {
        showTooltip();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    showTooltip();
});

function applyPressEffect() {
    cursor.style.transform = "scale(2)";
    cursor.style.setProperty("--glow-opacity", "1");
}

function removePressEffect() {
    cursor.style.transform = "scale(1)";
    cursor.style.setProperty("--glow-opacity", "0");
}

function showTooltip() {
    tooltip.style.opacity = "1";
}

function hideTooltip() {
    tooltip.style.opacity = "0";
}

function isCanvasFullyWiped() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // console.log("data:", data);

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) {
            return false; // Canvas is not fully wiped
        }
    }

    return true; // Canvas is fully wiped
}

// 추가 예시
// function updateTooltipText(text) {
//     tooltip.textContent = text;
// }

// document.querySelectorAll("a").forEach((link) => {
//     link.addEventListener("mousedown", () => {
//         updateTooltipText("검은 바탕화면을 닦아보세요!");
//     });
//     link.addEventListener("mouseup", () => {
//         updateTooltipText("");
//     });
// });

// Add CSS variable for glow opacity
document.documentElement.style.setProperty("--glow-opacity", "0");

// ! disappear hero-copy
function fadeOutHeroCopy() {
    heroCopy.classList.add("fade-out");
    // If you want to remove the element after the animation
    heroCopy.addEventListener(
        "animationend",
        () => {
            // heroCopy.style.display = "none";
            heroCopy.style.opacity = "0";
        },
        { once: true }
    );
}

// // Function to reset the hero copy when starting a new drawing session
// function resetHeroCopy() {
//     heroCopy.classList.remove("fade-out");
//     heroCopy.style.display = "";
//     heroCopy.style.opacity = "1";
// }

// // Call this function when starting a new drawing session
// function startNewDrawingSession() {
//     // Reset canvas to black
//     ctx.fillStyle = "rgba(0, 0, 0, 0.97)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Reset hero copy
//     resetHeroCopy();

//     // Show cursor and tooltip
//     showCursor();
//     showTooltip();
// }

// // Example: Reset everything when 'R' key is pressed
// document.addEventListener('keydown', (e) => {
//     if (e.key.toLowerCase() === 'r') {
//         startNewDrawingSession();
//     }
// });
