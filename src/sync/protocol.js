// src/sync/protocol.js
export const MSG = {
  INPUT: 'INPUT', // клієнт -> хост: { type, code, isPressed }
  STATE: 'STATE', // хост -> клієнт: { type, state }
};
