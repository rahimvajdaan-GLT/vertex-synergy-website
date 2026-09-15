import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Building3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(5, 4, 7);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();

    // Stacked wireframe "building" tiers
    const tiers = [
      { w: 1.7, h: 1.4, color: 0xFF6A1A },
      { w: 1.5, h: 1.2, color: 0xE8B04B },
      { w: 1.3, h: 1.0, color: 0xFF6A1A },
      { w: 1.1, h: 0.8, color: 0x4B7BFF },
      { w: 0.9, h: 0.7, color: 0xE8B04B },
    ];
    let y = 0;
    tiers.forEach((t) => {
      const geo = new THREE.BoxGeometry(t.w, t.h, t.w);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: t.color, transparent: true, opacity: 0.9 }));
      line.position.y = y + t.h / 2;
      group.add(line);
      // translucent fill
      const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: t.color, transparent: true, opacity: 0.04, side: THREE.DoubleSide }));
      fill.position.y = y + t.h / 2;
      group.add(fill);
      y += t.h + 0.04;
    });

    // Antenna spire
    const spire = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y, 0), new THREE.Vector3(0, y + 0.9, 0)]),
      new THREE.LineBasicMaterial({ color: 0xFF6A1A })
    );
    group.add(spire);

    // Grid floor
    const grid = new THREE.GridHelper(8, 16, 0x4B7BFF, 0x2a2f3a);
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    scene.add(grid);
    scene.add(group);

    // Mouse parallax for camera
    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      camera.position.x = 5 + mx * 3;
      camera.position.y = 4 - my * 2;
      camera.lookAt(0, 1.2, 0);
    };
    mount.addEventListener("mousemove", onMove);

    let raf;
    const animate = () => {
      group.rotation.y += 0.0045;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] md:h-[540px]" />;
}