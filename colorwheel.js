const WIDTH = 300;
const HEIGHT = 300;
const SCALE = 1.25;
const MIDDLE_X = WIDTH / 2;
const MIDDLE_Y = HEIGHT / 2;
const LIGHTNESS = 0.5;

let ctx;

const colorWheelDiv = document.querySelector(".colorWheel");

const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

colorWheelDiv.appendChild(canvas);

ctx = canvas.getContext("2d");

drawColorWheel();

function drawColorWheel() {
    for (let h = 0; h <= 360; h++) {
        for (let s = 0; s <= 100; s++) {
            ctx.beginPath();
            ctx.fillStyle = `hsl(${h}, ${s}%, ${LIGHTNESS * 100}%)`;

            const posX = MIDDLE_X + Math.cos(degreeToRadian(h)) * s * SCALE;
            const posY = MIDDLE_Y - Math.sin(degreeToRadian(h)) * s * SCALE;

            ctx.arc(posX, posY, (SCALE * s) / 100 + 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawColorWheelBorder();
}

function drawColorWheelBorder() {
    ctx.beginPath();

    ctx.arc(MIDDLE_X, MIDDLE_Y, 100 * SCALE + 5, 0, 2 * Math.PI);
    ctx.stroke();
}

function degreeToRadian(deg) {
    return (deg * Math.PI) / 180;
}

canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const hsl = rgbToHsl(imageData[0], imageData[1], imageData[2]);

    const color = hslToHex(hsl[0], hsl[1], hsl[2]);

    document.body.style.backgroundColor = color;
});

canvas.addEventListener("mousemove", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const hsl = rgbToHsl(imageData[0], imageData[1], imageData[2]);

    const color = hslToHex(hsl[0], hsl[1], hsl[2]);

    colorWheelDiv.style.backgroundColor = color;
});

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }

        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}