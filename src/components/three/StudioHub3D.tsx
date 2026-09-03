import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Activity, Users, Sparkles, Compass } from 'lucide-react';

interface StudioHub3DProps {
  activeMembersCount: number;
  totalEnrolledCamps: number;
  studioCapacityPercent: number;
}

export const StudioHub3D: React.FC<StudioHub3DProps> = ({
  activeMembersCount,
  studioCapacityPercent
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 280;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 32);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 3, 50);
    pointLight.position.set(0, 8, 0);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x6366f1, 2, 50);
    blueLight.position.set(12, -4, 10);
    scene.add(blueLight);

    // Central Core (Neural / Computing Prism)
    const coreGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: 0x059669,
      emissiveIntensity: 0.4
    });
    const centralCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(centralCore);

    // Inner Glowing Core Sphere
    const innerGeo = new THREE.SphereGeometry(1.8, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: false,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Orbital Ring 1
    const ringGeo1 = new THREE.RingGeometry(8, 8.15, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, opacity: 0.35, transparent: true });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    // Orbital Ring 2 (Tilted)
    const ringGeo2 = new THREE.RingGeometry(13, 13.15, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x6366f1, side: THREE.DoubleSide, opacity: 0.25, transparent: true });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // STEM Program Activity Nodes (Floating Labs)
    const podsData = [
      { name: 'Robotics Arena', color: 0x10b981, radius: 8, angle: 0, speed: 0.008, size: 1.1 },
      { name: 'AI & Neural Lab', color: 0x06b6d4, radius: 8, angle: Math.PI * 0.66, speed: 0.008, size: 1.0 },
      { name: 'Coding Hub', color: 0xf59e0b, radius: 8, angle: Math.PI * 1.33, speed: 0.008, size: 1.2 },
      { name: 'Game Dev Studio', color: 0xec4899, radius: 13, angle: Math.PI * 0.25, speed: 0.005, size: 0.9 },
      { name: 'BattleBots Arena', color: 0x8b5cf6, radius: 13, angle: Math.PI * 1.2, speed: 0.005, size: 1.0 },
    ];

    const podMeshes: { mesh: THREE.Mesh; data: typeof podsData[0] }[] = [];

    podsData.forEach(pod => {
      const geo = new THREE.SphereGeometry(pod.size, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: pod.color,
        emissive: pod.color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);
      podMeshes.push({ mesh, data: pod });
    });

    // Particle Stars
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 60;
      particlePositions[i + 1] = (Math.random() - 0.5) * 35;
      particlePositions[i + 2] = (Math.random() - 0.5) * 60;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.2;
    };

    currentMount.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight || 280;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate central core
      centralCore.rotation.x += 0.005;
      centralCore.rotation.y += 0.008;
      innerCore.rotation.y -= 0.004;

      // Pulse inner core scale
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
      innerCore.scale.set(scale, scale, scale);

      // Orbit pods
      podMeshes.forEach(({ mesh, data }) => {
        data.angle += data.speed;
        mesh.position.x = Math.cos(data.angle) * data.radius;
        mesh.position.z = Math.sin(data.angle) * data.radius;
        mesh.position.y = Math.sin(elapsedTime * 2 + data.radius) * 1.2;
      });

      // Camera gentle sway influenced by mouse
      camera.position.x += (targetRotationY * 12 - camera.position.x) * 0.05;
      camera.position.y += (15 + targetRotationX * 8 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Gentle particle rotation
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[280px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Futuristic Floating HUD Elements */}
      <div className="absolute top-4 left-5 pointer-events-none flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center backdrop-blur-md">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            STEMALITY Campus Live
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Active Lab & Telemetry Mesh</h2>
        </div>
      </div>

      {/* Floating Metrics Pills */}
      <div className="absolute top-4 right-5 pointer-events-none flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex items-center gap-2 text-xs">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">Enrolled Students:</span>
          <span className="font-bold text-white">{activeMembersCount}</span>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/40 backdrop-blur-md flex items-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Lab Capacity:</span>
          <span className="font-bold text-emerald-400">{studioCapacityPercent}%</span>
        </div>
      </div>

      {/* Bottom Live Pods Legend */}
      <div className="absolute bottom-3 inset-x-5 pointer-events-none flex flex-wrap items-center justify-between gap-2 text-xs border-t border-white/5 pt-2">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
            <span>Robotics Arena</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
            <span>AI & Neural Lab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
            <span>Coding Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#ec4899]"></span>
            <span>Game Dev Studio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1]"></span>
            <span>BattleBots</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400/80 font-mono">
          <Compass className="w-3 h-3" />
          <span>STEMALITY 3D Engine</span>
        </div>
      </div>
    </div>
  );
};
