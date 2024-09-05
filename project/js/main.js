document.addEventListener('DOMContentLoaded', function () {
    // Додаємо клас до всього документа для зміни курсора
    document.body.classList.add('custom-cursor');

    // Обробляємо події для натискання та відпускання миші
    document.body.addEventListener('mousedown', () => document.body.classList.add('custom-cursor-active'));
    document.body.addEventListener('mouseup', () => document.body.classList.remove('custom-cursor-active'));

    const width = 1300;
    const height = 600;

    const maxTimeBetweenLightning = 20; // Збільшена частота
    const maxLightningPaths = 200;
    const maxLightningThickness = 5;
    const startingDistance = 30;
    const maxBranches = 7;

    function makeLightning(ctx, startingX, startingY, branches) {
        ctx.beginPath();
        let lightningThickness = maxLightningThickness;
        let distance = startingDistance;
        let totalTime = 0;
        let timeout = 80;
        let speed = timeout;

        for (let i = 0; i < maxLightningPaths; i++) {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(255, 182, 193, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
            ctx.strokeStyle = gradient;
            ctx.lineWidth = getRandomInt(lightningThickness);
            lightningThickness /= 1.2;

            setTimeout(() => {
                ctx.moveTo(startingX, startingY);
                startingX += getRandomInt(distance) * negOrPos();
                startingY += getRandomInt(distance * 2);
                ctx.lineTo(startingX, startingY);
                ctx.stroke();

                if (branches < maxBranches && getRandomInt(maxLightningPaths / 6) === 1) {
                    totalTime += makeLightning(ctx, startingX, startingY, branches + 1);
                }
            }, totalTime);
            
            distance /= 1.1;
            speed /= 1.4;
            totalTime += speed;
        }
        return totalTime;
    }

    function negOrPos() {
        return Math.random() < 0.5 ? -1 : 1;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    function createCanvasAndLightning() {
        const canvas = document.createElement('canvas');
        const body = document.getElementById("weatherAnimation");
        canvas.width = 2000;
        canvas.height = 2000;
        canvas.className = 'myCanvas';
        canvas.style.pointerEvents = 'none'; // Дозволити взаємодію через canvas
        const ctx = canvas.getContext("2d");
        body.appendChild(canvas);

        const time = makeLightning(ctx, getRandomInt(width), 0, 0);

        canvas.style.animation = `flash ${time}ms ease-in-out`;
        setTimeout(() => canvas.remove(), time * 2);

        setTimeout(createCanvasAndLightning, 2000); // Збільшена частота
    }

    createCanvasAndLightning();
});
