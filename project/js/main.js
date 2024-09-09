document.addEventListener('DOMContentLoaded', function() {
    // Додаємо клас до всього документа для зміни курсора
    document.body.classList.add('custom-cursor');

    // Обробляємо події для натискання та відпускання миші
    document.addEventListener('mousedown', function() {
        document.body.classList.add('custom-cursor-active');
    });

    document.addEventListener('mouseup', function() {
        document.body.classList.remove('custom-cursor-active');
    });

    const width = 1300;
const height = 600;

const maxTimeBetweenLightning = 20; // Reduced to increase frequency
const maxLightningPaths = 100;
const maxLightningThickness = 3;
const startingDistance = 30;
const maxBranches = 5;

function makeLightning(ctx, startingX, startingY, branches) {
    ctx.beginPath();
    const amntOfPaths = getRandomInt(maxLightningPaths);
    let lightningThickness = maxLightningThickness;
    let distance = startingDistance;
    let timeout = 80;
    let speed = timeout;
    let totalTime = 0;
    for (let i = 0; i < amntOfPaths; i++) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(255, 182, 193, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    
        ctx.strokeStyle = gradient;
        ctx.lineWidth = getRandomInt(lightningThickness);
        lightningThickness /= 1.2;
        setTimeout(() => {
            ctx.moveTo(startingX, startingY);
            let endingX = getRandomInt(distance) * negOrPos() + startingX;
            let endingY = startingY + getRandomInt(distance * 2);
            distance /= 1.1;
            ctx.lineTo(endingX, endingY);
            startingX = endingX;
            startingY = endingY;
            ctx.stroke();
            if (branches < maxBranches && getRandomInt(maxLightningPaths / 6) == 1) {
                let time = makeLightning(ctx, startingX, startingY, branches + 1);
                totalTime += time;
            }
        }, timeout);
        speed /= 1.8;
        timeout += speed;
    }
    return timeout + totalTime;
}

function negOrPos() {
    return Math.round(Math.random()) == 0 ? -1 : 1;
}

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

let prevHighestId = 0;

function createCanvasAndLightning() {

    const canvas = document.createElement('canvas');
    const body = document.getElementById("weatherAnimation");

    canvas.width = window.innerWidth; // змінив масштабування по ширині і висоті вікна
    canvas.height = window.innerHeight;
    canvas.className = 'myCanvas';
    canvas.style.pointerEvents = 'none'; // Allow interaction through the canvas
    const ctx = canvas.getContext("2d");
    body.appendChild(canvas);

    // Генерація блискавки
    const time = makeLightning(ctx, getRandomInt(canvas.width), 0, 0);

    // Анімація блискавки
    canvas.style.animationName = 'flash';
    canvas.style.animationDuration = time + "ms";

    // Поступове згасання анімації
    setTimeout(() => {
        canvas.style.animationName = 'fadeOut';
    }, time);

    // Видалення canvas і повторне створення через 2 секунди
    setTimeout(() => {
        canvas.remove();

        // Очищення старих таймерів
        const highestId = window.setTimeout(() => {}, 0);
        for (let i = highestId; i >= prevHighestId; i--) {
            window.clearTimeout(i);
        }
        prevHighestId = highestId;

        // Зменшено інтервал для частішої появи блискавок
        setTimeout(createCanvasAndLightning, 5000); // 2 секунди між блискавками
    }, time * 2); // Після анімації почекайте вдвічі більше часу для повного циклу
}

createCanvasAndLightning();

});