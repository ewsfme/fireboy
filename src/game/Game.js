// src/game/Game.js
//
// Ядро гри. Нічого не знає про WebRTC/сигналінг — лише симулює світ і
// вміє серіалізувати/застосовувати свій стан (getState/setState), що
// використовує шар sync/ для мережевої синхронізації.

import { createPlayer, respawnPlayer } from './Player.js';
import { updatePlayer } from './physics.js';
import { applyZones, checkFlag } from './zones.js';
import { LEVELS } from './levels/index.js';
import { drawFrame } from './render.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.levelIndex = 0;

    this.players = {
      p1: createPlayer('p1', '#e63946'),
      p2: createPlayer('p2', '#457b9d'),
    };

    // Викликається (лише на хості), коли гравець торкнувся прапорця.
    this.onLevelComplete = null;

    this.loadLevel(0);
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  loadLevel(index) {
    this.levelIndex = ((index % LEVELS.length) + LEVELS.length) % LEVELS.length;
    const lvl = this.level;
    respawnPlayer(this.players.p1, lvl.spawn.p1);
    respawnPlayer(this.players.p2, lvl.spawn.p2);
  }

  setInput(playerId, code, isPressed) {
    const p = this.players[playerId];
    if (p) p.keys[code] = isPressed;
  }

  /** Авторитарний тік симуляції. Викликається лише на хості. */
  update(dt) {
    const lvl = this.level;

    for (const id of ['p1', 'p2']) {
      const player = this.players[id];
      player.worldWidth = this.canvas.width;
      updatePlayer(player, lvl.platforms, dt);
      applyZones(player, lvl.zones, dt);
      if (player.hp <= 0) respawnPlayer(player, lvl.spawn[id]);
    }

    for (const id of ['p1', 'p2']) {
      if (checkFlag(this.players[id], lvl.flag)) {
        this.loadLevel(this.levelIndex + 1);
        this.onLevelComplete?.(this.levelIndex);
        break;
      }
    }
  }

  render() {
    drawFrame(this.ctx, this.canvas, this.level, this.players);
  }

  /** Компактний знімок стану для передачі мережею. */
  getState() {
    return {
      level: this.levelIndex,
      players: {
        p1: { x: this.players.p1.x, y: this.players.p1.y, hp: this.players.p1.hp },
        p2: { x: this.players.p2.x, y: this.players.p2.y, hp: this.players.p2.hp },
      },
    };
  }

  /** Застосовує стан, отриманий від хоста (викликається на клієнті). */
  setState(state) {
    if (state.level !== undefined && state.level !== this.levelIndex) {
      this.levelIndex = state.level;
    }
    for (const id of ['p1', 'p2']) {
      if (state.players?.[id]) Object.assign(this.players[id], state.players[id]);
    }
  }
}
