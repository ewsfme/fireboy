// src/game/physics.js
//
// Рух, гравітація та колізії з платформами. Розрахунок ведеться лише на
// хості (авторитарна фізика), клієнт отримує вже готовий стан через sync/.

import { makeOBB, testOBBCollision } from './obb.js';

export const GRAVITY = 1400;      // px/s^2
export const MOVE_SPEED = 220;    // px/s
export const JUMP_SPEED = -520;   // px/s

export function updatePlayer(player, platforms, dt) {
  const left = player.keys.KeyA || player.keys.ArrowLeft;
  const right = player.keys.KeyD || player.keys.ArrowRight;
  const jump = player.keys.KeyW || player.keys.Space || player.keys.ArrowUp;

  player.vx = left ? -MOVE_SPEED : right ? MOVE_SPEED : 0;

  if (jump && player.onGround) {
    player.vy = JUMP_SPEED;
    player.onGround = false;
  }

  player.vy += GRAVITY * dt;

  // Рух і розв'язання колізій розділені по осях (X, потім Y),
  // щоб не "залипати" в кутах платформ.
  player.x += player.vx * dt;
  resolveAxis(player, platforms, 'x');

  player.y += player.vy * dt;
  player.onGround = false;
  resolveAxis(player, platforms, 'y');

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > player.worldWidth) player.x = player.worldWidth - player.w;
}

function resolveAxis(player, platforms, axis) {
  for (const plat of platforms) {
    const playerOBB = makeOBB(player.x, player.y, player.w, player.h, 0);
    const platOBB = makeOBB(plat.x, plat.y, plat.w, plat.h, plat.angle || 0);
    const hit = testOBBCollision(playerOBB, platOBB);
    if (!hit) continue;

    const push = hit.overlap;
    const nx = hit.axis.x;
    const ny = hit.axis.y;

    if (axis === 'x') {
      player.x += nx * push;
      player.vx = 0;
    } else {
      player.y += ny * push;
      player.vy = 0;
      if (ny < -0.5) player.onGround = true; // виштовхнуло вгору -> стоїть на платформі
    }
  }
}
