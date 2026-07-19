// src/game/render.js

export function drawFrame(ctx, canvas, level, players) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = level.background || '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const plat of level.platforms) {
    drawRect(ctx, plat, '#a8dadc');
  }

  for (const zone of level.zones) {
    drawRect(ctx, zone, zone.type === 'damage' ? 'rgba(230,57,70,0.45)' : 'rgba(76,201,140,0.45)');
  }

  if (level.flag) drawFlag(ctx, level.flag);

  drawPlayer(ctx, players.p1);
  drawPlayer(ctx, players.p2);
}

function drawRect(ctx, r, color) {
  ctx.save();
  ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
  ctx.rotate(r.angle || 0);
  ctx.fillStyle = color;
  ctx.fillRect(-r.w / 2, -r.h / 2, r.w, r.h);
  ctx.restore();
}

function drawFlag(ctx, flag) {
  ctx.save();
  ctx.translate(flag.x, flag.y);
  ctx.rotate(flag.angle || 0);
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, flag.h);
  ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(flag.w, flag.h * 0.25);
  ctx.lineTo(0, flag.h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPlayer(ctx, p) {
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, p.w, p.h);

  const hpRatio = Math.max(0, p.hp) / p.maxHp;
  ctx.fillStyle = '#000';
  ctx.fillRect(p.x, p.y - 10, p.w, 5);
  ctx.fillStyle = hpRatio > 0.3 ? '#2ecc71' : '#e74c3c';
  ctx.fillRect(p.x, p.y - 10, p.w * hpRatio, 5);
}
