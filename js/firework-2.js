/**
 * @file 烟花文字效果
 */
!(function () {
  const textCanvas = document.createElement('canvas');
  textCanvas.width = 1000;
  textCanvas.height = 300;
  const textctx = textCanvas.getContext('2d');
  textctx.fillStyle = '#000000';
  textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.zIndex = -1;

  const context = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clearCanvas();
  }

  function clearCanvas() {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  function mouseDownHandler(e) {
    const x = e.clientX;
    const y = e.clientY;

    createFireworks(x, y);
  }
  document.addEventListener('mousedown', mouseDownHandler);

  const particles = [];

  function createFireworks(x, y, text = '') {
    const hue = Math.random() * 360;
    const hueVariance = 30;

    function setupColors(p) {
      p.hue =
        Math.floor(Math.random() * (hue + hueVariance - (hue - hueVariance))) +
        (hue - hueVariance);
      p.brightness = Math.floor(Math.random() * 21) + 50;
      p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
    }

    if (text) {
      const gap = 6;
      const fontSize = 120;

      textctx.font = `${fontSize}px Verdana`;
      textctx.fillStyle = '#ffffff';

      const textWidth = textctx.measureText(text).width;
      const textHeight = fontSize;

      textctx.fillText(text, 0, textHeight);
      const imgData = textctx.getImageData(0, 0, textWidth, textHeight * 1.2);

      textctx.fillStyle = '#000000';
      textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      for (let h = 0; h < textHeight * 1.2; h += gap) {
        for (let w = 0; w < textWidth; w += gap) {
          const position = (textWidth * h + w) * 4;
          const r = imgData.data[position];
          const g = imgData.data[position + 1];
          const b = imgData.data[position + 2];
          const a = imgData.data[position + 3];

          if (r + g + b === 0) continue;

          const p = {};

          p.x = x;
          p.y = y;

          p.fx = x + w - textWidth / 2;
          p.fy = y + h - textHeight / 2;

          p.size = Math.floor(Math.random() * 2) + 1;
          p.speed = 1;

          setupColors(p);

          particles.push(p);
        }
      }
    } else {
      const count = 100;
      for (let i = 0; i < count; i++) {
        //角度
        const angle = (360 / count) * i;
        //弧度
        const radians = (angle * Math.PI) / 180;

        const p = {};

        p.x = x;
        p.y = y;
        p.radians = radians;

        //大小
        p.size = Math.random() * 2 + 1;

        //速度
        p.speed = Math.random() * 5 + 0.4;

        //半径
        p.radius = Math.random() * 81 + 50;

        p.fx = x + Math.cos(radians) * p.radius;
        p.fy = y + Math.sin(radians) * p.radius;

        setupColors(p);

        particles.push(p);
      }
    }
  }
  function drawFireworks() {
    clearCanvas();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += (p.fx - p.x) / 10;
      p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

      p.alpha -= 0.006;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      context.beginPath();
      context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
      context.closePath();

      context.fillStyle =
        'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
      context.fill();
    }
  }

  // requestAnimationFrame
  let lastStamp = 0;
  function tick(opt = 0) {
    if (opt - lastStamp > 2000) {
      lastStamp = opt;
      createFireworks(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        ['李新', '生日快乐', '永远开心！'][Math.floor(Math.random() * 3)]
      );
			createFireworks(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
    }

    context.globalCompositeOperation = 'destination-out';
    context.fillStyle = `rgba(0, 0, 0, ${10 / 100})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'lighter';

    drawFireworks();

    requestAnimationFrame(tick);
  }
  tick();
})();
