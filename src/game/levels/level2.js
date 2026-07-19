// src/game/levels/level2.js
export default {
  name: 'Level 2',
  background: '#2b2d3a',
  spawn: {
    p1: { x: 40, y: 300 },
    p2: { x: 100, y: 300 },
  },
  platforms: [
    { x: 0, y: 360, w: 250, h: 40 },
    { x: 350, y: 360, w: 450, h: 40 },
    { x: 180, y: 280, w: 120, h: 20 },
    { x: 380, y: 220, w: 120, h: 20 },
    { x: 580, y: 160, w: 120, h: 20 },
  ],
  zones: [
    { x: 250, y: 340, w: 100, h: 20, type: 'damage', amount: 60 }, // яма-пастка
    { x: 380, y: 190, w: 120, h: 20, type: 'heal', amount: 30 },   // лікувальна платформа
  ],
  flag: { x: 740, y: 110, w: 20, h: 50 },
};
