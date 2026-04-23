const track = document.getElementById('sliderTrack');
const cards = Array.from(track.querySelectorAll('.card'));

const STEP = 600 + 24;
let current = 0;

function goTo(index) {
  current = index;
  track.style.transform = 'translateX(-' + (STEP * current) + 'px)';
  cards.forEach((card, i) => card.classList.toggle('active', i === current));
}

cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    if (i !== current) goTo(i);
  });
});

goTo(0);
