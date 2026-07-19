// src/game/levels/index.js
//
// Рівні маркуються числом у назві файлу (levelN.js) і йдуть по порядку.
// Браузерні ES-модулі не вміють динамічно сканувати папку (glob), тому
// список імпортів тут статичний. Щоб додати рівень:
//   1. створіть src/game/levels/levelN.js за зразком level1.js;
//   2. імпортуйте його нижче та додайте у масив LEVELS у потрібному місці.

import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';

export const LEVELS = [level1, level2, level3];
