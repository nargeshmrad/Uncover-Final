$(document).ready(function(){
  // If using #ripple-bg, otherwise apply to body
  if ($('#ripple-bg').length) {
    $('#ripple-bg').ripples({
      resolution: 500,
      dropRadius: 20,
      perturbance: 0.03
    });
  } else {
    $('body').ripples({
      resolution: 500,
      dropRadius: 30,
      perturbance: 0.03
    });
  }

  // Animate floating paper and menu together (move the container)
  function floatPaper() {
    $('#floating-paper-container').animate({
      // We'll animate a dummy property and use step to update translateY
      dummy: 20
    }, {
      duration: 2000,
      step: function(now) {
        $('#floating-paper-container').css('transform', 'translate(-50%, calc(-50% + ' + Math.sin(now/10)*10 + 'px))');
      },
      complete: function() {
        $('#floating-paper-container').animate({
          dummy: 0
        }, {
          duration: 2000,
          step: function(now) {
            $('#floating-paper-container').css('transform', 'translate(-50%, calc(-50% + ' + Math.sin(now/10)*10 + 'px))');
          },
          complete: floatPaper
        });
      }
    });
  }
  floatPaper();
});