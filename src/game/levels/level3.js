// src/game/levels/level3.js
export default {
  name: 'Level 3',
  background: '#1f1f2e',
  spawn: {
    p1: { x: 30, y: 300 },
    p2: { x: 90, y: 300 },
  },
  platforms: [
    { x: 0, y: 360, w: 200, h: 40 },
    { x: 600, y: 360, w: 200, h: 40 },
    // нахилена платформа — демонструє, що колізії справді OBB, а не AABB
    { x: 280, y: 260, w: 220, h: 20, angle: -0.25 },
  ],
  zones: [
    { x: 200, y: 340, w: 400, h: 20, type: 'damage', amount: 100 }, // прірва
  ],
  flag: { x: 740, y: 300, w: 20, h: 50 },
};
