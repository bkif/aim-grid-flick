import * as THREE from "three";

export type AimMode = "gridshot" | "strafing";

export class AimArena {
  readonly scene = new THREE.Scene();
  readonly targets: THREE.Mesh[] = [];
  private geo = new THREE.SphereGeometry(0.45, 24, 24);
  private mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });

  constructor() {
    this.scene.background = new THREE.Color(0x020617);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(4, 6, 5);
    this.scene.add(dir);

    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(this.geo, this.mat);
      this.respawnTarget(m);
      this.scene.add(m);
      this.targets.push(m);
    }
  }

  respawnTarget(mesh: THREE.Mesh): void {
    mesh.position.set(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 3.5,
      -5 - Math.random() * 2
    );
  }

  update(dt: number, mode: AimMode, time: number): void {
    if (mode === "strafing") {
      this.targets.forEach((t, idx) => {
        t.position.x += Math.sin(time * 2.5 + idx) * dt * 2.2;
      });
    }
  }
}
