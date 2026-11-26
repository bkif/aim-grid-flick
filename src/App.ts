import * as THREE from "three";
import { AimArena, type AimMode } from "./game/arena";

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <div style="position:relative;width:100vw;height:100vh;">
      <canvas id="aim-canvas" style="display:block;width:100%;height:100%;cursor:crosshair;"></canvas>
      <div style="position:absolute;top:16px;left:16px;background:rgba(2,6,23,0.8);padding:12px 16px;border-radius:10px;font-size:12px;border:1px solid #1e293b;">
        <div style="font-weight:700;color:#38bdf8;">Aim Grid Flick</div>
        <div id="stats" style="margin-top:4px;">Hits: 0 | Acc: 100% | Time: 30s</div>
        <select id="mode" style="margin-top:8px;background:#0f172a;color:#fff;border:1px solid #334155;padding:3px 6px;border-radius:4px;">
          <option value="gridshot">Gridshot</option>
          <option value="strafing">Strafing</option>
        </select>
      </div>
    </div>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>("#aim-canvas")!;
  const statsEl = root.querySelector<HTMLElement>("#stats")!;
  const modeSel = root.querySelector<HTMLSelectElement>("#mode")!;
  const arena = new AimArena();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hits = 0;
  let shots = 0;
  let timeLeft = 30;

  canvas.addEventListener("pointerdown", (e) => {
    if (timeLeft <= 0) return;
    shots++;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(arena.targets);
    if (hit.length > 0) {
      hits++;
      arena.respawnTarget(hit[0].object as THREE.Mesh);
    }
  });

  let last = performance.now();
  const loop = (now: number) => {
    const dt = (now - last) / 1000;
    last = now;
    timeLeft = Math.max(0, timeLeft - dt);
    arena.update(dt, modeSel.value as AimMode, now / 1000);
    const acc = shots > 0 ? Math.round((hits / shots) * 100) : 100;
    statsEl.textContent = `Hits: ${hits} | Acc: ${acc}% | Time: ${timeLeft.toFixed(1)}s`;
    renderer.render(arena.scene, camera);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
