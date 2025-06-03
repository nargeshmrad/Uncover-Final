$(document).ready(function () {
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

    // Floating animation for HimOnWater.png
    const $container = $('.container');
    const $floatImg = $('.floating-him');
    const imgWidth = 320; // px, must match CSS
    let containerRect = $container[0].getBoundingClientRect();
    
    // Set container height based on aspect ratio and width
    function resizeContainer() {
      const maxWidth = 1070;
      const aspectRatio = 1070 / 1176;
      let width = Math.min(window.innerWidth, maxWidth);
      let height = width / aspectRatio;
      if (height > window.innerHeight) {
        height = window.innerHeight;
        width = height * aspectRatio;
      }
      $container.css({ width: width + 'px', height: height + 'px' });
      containerRect = $container[0].getBoundingClientRect();
    }
    
    $(window).on('resize', resizeContainer);
    resizeContainer();

    function randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }

    function moveImage() {
      // Container dimensions
      containerRect = $container[0].getBoundingClientRect();
      const maxLeft = containerRect.width - imgWidth;
      const maxTop = containerRect.height - imgWidth * 1.1; // estimate height

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
    $floatImg.css({
      left: containerRect.width / 2 + 'px',
      top: containerRect.height / 2 + 'px',
      transform: 'translate(-50%, -50%)',
    });
    setTimeout(moveImage, 800);
  });
  