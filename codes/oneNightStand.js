document.addEventListener('DOMContentLoaded', function () {
  // Show first image immediately
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const img3 = document.getElementById('img3');

  img1.classList.add('visible');

  setTimeout(() => {
    img2.classList.add('visible');
    setTimeout(() => {
      img3.classList.add('visible');
    }, 2000);
  }, 2000);
});
