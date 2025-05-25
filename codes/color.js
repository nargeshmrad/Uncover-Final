$(document).ready(function () {
  // Apply ripple effect to #ripple-bg if it exists, otherwise to body
  const rippleTarget = $('#ripple-bg').length ? '#ripple-bg' : 'body';
  $(rippleTarget).ripples({
    resolution: 500,
    dropRadius: rippleTarget === 'body' ? 30 : 20,
    perturbance: 0.03
  });

  // Floating animation loop for the paper container
  function floatPaper() {
    $('#floating-paper-container').animate(
      { dummy: 20 },
      {
        duration: 2000,
        step: function (now) {
          const offset = Math.sin(now / 10) * 10;
          $('#floating-paper-container').css(
            'transform',
            `translate(-50%, calc(-50% + ${offset}px))`
          );
        },
        complete: function () {
          $('#floating-paper-container').animate(
            { dummy: 0 },
            {
              duration: 2000,
              step: function (now) {
                const offset = Math.sin(now / 10) * 10;
                $('#floating-paper-container').css(
                  'transform',
                  `translate(-50%, calc(-50% + ${offset}px))`
                );
              },
              complete: floatPaper
            }
          );
        }
      }
    );
  }

  floatPaper();
});
