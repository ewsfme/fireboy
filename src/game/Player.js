// src/game/Player.js

export const PLAYER_W = 30;
export const PLAYER_H = 40;
export const MAX_HP = 100;

export function createPlayer(id, color) {
  return {
    id,
    color,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    w: PLAYER_W,
    h: PLAYER_H,
    hp: MAX_HP,
    maxHp: MAX_HP,
    onGround: false,
    keys: {},
    worldWidth: 800,
  };
}

export function respawnPlayer(player, spawn) {
  player.x = spawn.x;
  player.y = spawn.y;
  player.vx = 0;
  player.vy = 0;
  player.hp = player.maxHp;
  player.onGround = false;
}
