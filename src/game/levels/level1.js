// src/game/levels/level1.js
export default {
  name: 'Level 1',
  background: '#333',
  spawn: {
    p1: { x: 60, y: 300 },
    p2: { x: 130, y: 300 },
  },
  platforms: [
    { x: 0, y: 360, w: 800, h: 40 },
    { x: 200, y: 260, w: 150, h: 20 },
    { x: 450, y: 200, w: 150, h: 20 },
  ],
  zones: [
    // невелика зона урону на підлозі — обережно, шипи
    { x: 330, y: 340, w: 60, h: 20, type: 'damage', amount: 40 },
  ],
  flag: { x: 740, y: 150, w: 20, h: 50 },
};
