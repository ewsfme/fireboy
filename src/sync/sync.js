// src/sync/sync.js
//
// Єдине місце, де "гра" (game/Game.js) і "мережа" (network/network.js)
// знають одне про одного. Модель — хост-авторитарна:
//   - хост рахує фізику й розсилає STATE ~30 разів/сек;
//   - клієнт лише шле свій INPUT і застосовує отриманий STATE.

import { MSG } from './protocol.js';

const STATE_BROADCAST_HZ = 30;

export class Sync {
  constructor(game, connection) {
    this.game = game;
    this.connection = connection;
    this._lastBroadcast = 0;

    connection.onMessage = (msg) => this._handleMessage(msg);
  }

  /** Локальний гравець натиснув/відпустив клавішу. */
  sendInput(playerId, code, isPressed) {
    if (this.connection.isHost) {
      this.game.setInput(playerId, code, isPressed);
    } else {
      this.connection.send({ type: MSG.INPUT, code, isPressed });
    }
  }

  _handleMessage(msg) {
    if (this.connection.isHost && msg.type === MSG.INPUT) {
      this.game.setInput('p2', msg.code, msg.isPressed);
    } else if (!this.connection.isHost && msg.type === MSG.STATE) {
      this.game.setState(msg.state);
    }
  }

  /** Викликати щокадру з ігрового циклу хоста; сам обмежує частоту. */
  broadcastState(now) {
    if (!this.connection.isHost) return;
    const minInterval = 1000 / STATE_BROADCAST_HZ;
    if (now - this._lastBroadcast < minInterval) return;
    this._lastBroadcast = now;
    this.connection.send({ type: MSG.STATE, state: this.game.getState() });
  }
}
