$(document).ready(function () {
    // Water ripple effect for #ripple-bg
    $('#ripple-bg').ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    });

    // Optional: create random ripple drops
    setInterval(function () {
      const $el = $('#ripple-bg');
      const x = Math.random() * $el.outerWidth();
      const y = Math.random() * $el.outerHeight();
      const dropRadius = 15;
      const strength = 0.04;
      $el.ripples('drop', x, y, dropRadius, strength);
    }, 3000);

    // Floating animation for HimOnWater.png (random walk, px-based, always inside .picture)
    const $picture = $('.picture');
    const $floatImg = $('.floating-him');

    function randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }

    function moveImage() {
      const containerRect = $picture[0].getBoundingClientRect();
      const imgWidth = $floatImg.outerWidth();
      const imgHeight = $floatImg.outerHeight();
      const maxLeft = containerRect.width - imgWidth;
      const maxTop = containerRect.height - imgHeight;

      // Get current position (relative to container)
      const currentLeft = parseFloat($floatImg.css('left')) || containerRect.width / 2;
      const currentTop = parseFloat($floatImg.css('top')) || containerRect.height / 2;

      // Pick a new target near current position, within bounds
      const delta = 60; // max px movement per float
      let newLeft = currentLeft + randomFloat(-delta, delta);
      let newTop = currentTop + randomFloat(-delta, delta);
      newLeft = Math.max(imgWidth / 2, Math.min(maxLeft + imgWidth / 2, newLeft));
      newTop = Math.max(imgWidth / 2, Math.min(maxTop + imgWidth / 2, newTop));

      $floatImg.animate({
        left: newLeft + 'px',
        top: newTop + 'px',
      }, randomFloat(3500, 5000), 'swing', moveImage);
    }

    // Initialize position and start floating
    const containerRect = $picture[0].getBoundingClientRect();
    $floatImg.css({
      left: containerRect.width / 2 + 'px',
      top: containerRect.height / 2 + 'px',
      transform: 'translate(-50%, -50%)',
    });
    setTimeout(moveImage, 800);
});
  