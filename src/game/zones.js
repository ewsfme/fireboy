// src/game/zones.js
//
// Зони урону/хілу та прапорець рівня. Урон/хіл рахуються як "amount за
// секунду", множаться на dt — тож ефект плавний, а не миттєвий по кадру.

import { makeOBB, obbIntersects } from './obb.js';

export function applyZones(player, zones, dt) {
  const playerOBB = makeOBB(player.x, player.y, player.w, player.h, 0);

  for (const zone of zones) {
    const zoneOBB = makeOBB(zone.x, zone.y, zone.w, zone.h, zone.angle || 0);
    if (!obbIntersects(playerOBB, zoneOBB)) continue;

    if (zone.type === 'damage') {
      player.hp -= (zone.amount ?? 20) * dt;
    } else if (zone.type === 'heal') {
      player.hp += (zone.amount ?? 20) * dt;
    }

    player.hp = Math.max(0, Math.min(player.maxHp, player.hp));
  }
}

export function checkFlag(player, flag) {
  if (!flag) return false;
  const playerOBB = makeOBB(player.x, player.y, player.w, player.h, 0);
  const flagOBB = makeOBB(flag.x, flag.y, flag.w, flag.h, flag.angle || 0);
  return obbIntersects(playerOBB, flagOBB);
}
