const scene = document.getElementById('scene');
const phases = ['phase-2', 'phase-3', 'phase-4', 'phase-5'];
const delays = [1200, 1200, 1200, 1200];
let i = 0;

function next() {
  scene.className = 'scene ' + phases[i];
  if (++i < phases.length) setTimeout(next, delays[i - 1]);
}

setTimeout(next, 800);
