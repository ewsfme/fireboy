// src/main.js
//
// Точка входу. Тримає лише "проводку" між шарами: network / sync / game,
// та обробляє (пере)підключення — в т.ч. після refresh чи короткого обриву.

import { P2PConnection } from './network/network.js';
import { Sync } from './sync/sync.js';
import { Game } from './game/Game.js';

const canvas = document.getElementById('gameCanvas');
const statusDiv = document.getElementById('status');
const panel = document.getElementById('network-panel');
const actionBtn = document.getElementById('action-btn');
const resetLink = document.getElementById('reset-link');

const ALLOWED_KEYS = ['KeyA', 'KeyD', 'KeyW', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp'];

const roomId =
  new URLSearchParams(window.location.search).get('room') ||
  Math.random().toString(36).substring(2, 7);

if (!window.location.search.includes('room')) {
  window.history.pushState({}, '', `?room=${roomId}`);
}

let connection = null;
let game = null;
let sync = null;
let reconnectTimer = null;

function statusText(status) {
  switch (status) {
    case 'hosting':
      return `Ви створили гру. Надішліть посилання другу:\n${window.location.href}`;
    case 'waiting-for-offer':
      return 'Кімната вже існує. Очікуємо, поки хост опублікує гру...';
    case 'connecting':
      return "Встановлення P2P-тунелю...";
    case 'connected':
      return "З'єднано!";
    default:
      return status;
  }
}

async function setupConnection() {
  clearTimeout(reconnectTimer);
  panel.style.display = 'block';
  actionBtn.style.display = 'none';
  if (!game) canvas.style.display = 'none';

  connection = new P2PConnection(roomId);

  connection.onStatus = (status) => {
    statusDiv.innerText = statusText(status);
  };

  connection.onOpen = () => {
    panel.style.display = 'none';
    canvas.style.display = 'block';
    if (!game) {
      startGame();
    } else {
      // Гра вже йшла (це перепідключення посеред сесії) — просто
      // перепідʼєднуємо sync до нового транспорту, стан гри не чіпаємо.
      sync = new Sync(game, connection);
    }
  };

  connection.onDisconnected = () => {
    statusDiv.innerText = "З'єднання перервано. Повторне підключення...";
    panel.style.display = 'block';
    reconnectTimer = setTimeout(setupConnection, 1000);
  };

  statusDiv.innerText = 'Перевірка кімнати...';
  const result = await connection.connect();

  if (result.role === 'client') {
    statusDiv.innerText = 'Кімнату знайдено! Натисніть кнопку, щоб приєднатись.';
    actionBtn.style.display = 'inline-block';
    actionBtn.onclick = async () => {
      actionBtn.style.display = 'none';
      statusDiv.innerText = "З'єднання...";
      await connection.acceptAsClient(result.offer);
    };
  }
}

function startGame() {
  game = new Game(canvas);
  sync = new Sync(game, connection);

  window.addEventListener('keydown', (e) => handleKey(e.code, true));
  window.addEventListener('keyup', (e) => handleKey(e.code, false));

  requestAnimationFrame(loop);
}

function handleKey(code, isPressed) {
  if (!ALLOWED_KEYS.includes(code)) return;
  if (!connection || !sync) return;
  const myPlayerId = connection.isHost ? 'p1' : 'p2';
  sync.sendInput(myPlayerId, code, isPressed);
}

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05); // кламп на випадок лагу вкладки
  lastTime = now;

  if (connection?.isHost) {
    game.update(dt);
    sync?.broadcastState(now);
  }
  game.render();

  requestAnimationFrame(loop);
}

resetLink?.addEventListener('click', (e) => {
  e.preventDefault();
  P2PConnection.forgetRole(roomId);
  window.location.href = window.location.pathname; // нова кімната без параметра room
});

setupConnection();
