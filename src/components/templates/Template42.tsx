
"use client";

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points, Text } from '@react-three/drei';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo, Suspense } from 'react';

interface Template42Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const FloatingText = ({ children, ...props }: any) => {
  const textRef = useRef<any>();
  const [y] = useState(() => Math.random() * 20 - 10);
  const [speed] = useState(() => Math.random() * 0.1 + 0.05);

  useFrame(({ viewport }) => {
    if (textRef.current) {
      textRef.current.position.y -= speed * 0.1;
      if (textRef.current.position.y < -viewport.height / 2 - 2) {
        textRef.current.position.y = viewport.height / 2 + 2;
      }
    }
  });

  return (
    <Text ref={textRef} position-y={y} fontSize={0.5} color="white" anchorX="center" anchorY="middle" {...props}>
      {children}
    </Text>
  );
};


const Particles = ({ count = 500 }) => {
    const pointsRef = useRef<any>();
    const { viewport } = useThree();
  
    const [positions, colors] = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0.25, 0.25);
      heartShape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
      heartShape.bezierCurveTo(-0.3, 0, -0.3, 0.35, -0.3, 0.35);
      heartShape.bezierCurveTo(-0.3, 0.55, -0.1, 0.77, 0.25, 0.95);
      heartShape.bezierCurveTo(0.6, 0.77, 0.8, 0.55, 0.8, 0.35);
      heartShape.bezierCurveTo(0.8, 0.35, 0.8, 0, 0.5, 0);
      heartShape.bezierCurveTo(0.35, 0, 0.25, 0.25, 0.25, 0.25);
  
      const geom = new THREE.ShapeGeometry(heartShape);
      geom.scale(0.05, 0.05, 0.05);
      const heartPositions = geom.attributes.position.array;
  
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * viewport.width * 1.5;
        positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 5;
  
        const isGlowing = Math.random() > 0.7;
        const color = new THREE.Color(isGlowing ? '#ff80ab' : '#ffc0cb');
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }
      return [positions, colors];
    }, [count, viewport.width, viewport.height]);
  
    const velocities = useMemo(() => new Float32Array(count).map(() => (Math.random() - 0.5) * 0.01 + 0.01), [count]);
  
    useFrame((state) => {
        if (!pointsRef.current) return;
    
        const { viewport } = state;
        const positions = pointsRef.current.geometry.attributes.position.array;
    
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3+1] -= velocities[i] * 5; // Fall speed
          
          // Add some horizontal drift
          positions[i3] += Math.sin(state.clock.elapsedTime + i) * 0.001;
    
          if (positions[i3+1] < -viewport.height / 2 - 1) {
            positions[i3+1] = viewport.height / 2 + 1;
            positions[i3] = (Math.random() - 0.5) * viewport.width * 1.5;
          }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
        // Parallax
        const { pointer } = state;
        pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, pointer.x * Math.PI / 10, 0.1);
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, pointer.y * Math.PI / 10, 0.1);
      });
  
    return (
      <Points ref={pointsRef} positions={positions as any} colors={colors as any} frustumCulled={false}>
        <PointMaterial vertexColors size={15} sizeAttenuation={false} depthWrite={false} transparent alphaTest={0.5}>
            <canvas id="heart-canvas" width="64" height="64" style={{display: 'none'}}></canvas>
        </PointMaterial>
      </Points>
    );
  };

export default function Template42({ data }: Template42Props) {
  const { name, mediaUrl } = data;
  const {
    isPlaying,
    currentSubtitle,
    videoRef,
    audioRef,
    isVideo,
    useVideoAsAudioSource,
    handleInitialInteraction,
    handlePlayPause,
  } = useSaywithPlayer(data);

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const floatingMessages = useMemo(() => [
    "I love you", "I miss you", "Forever yours",
    "You're my everything", "Always & Forever", "My one and only"
  ], []);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-pink-900 text-white"
      onClick={handleInitialInteraction}
    >
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><p>Loading 3D Scene...</p></div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Particles count={150} />
          {floatingMessages.map((msg, i) => (
             <FloatingText key={i} position-z={-2} position-x={(Math.random() - 0.5) * 10}>{msg}</FloatingText>
          ))}
        </Canvas>
      </Suspense>

      {data.audioUrl && !useVideoAsAudioSource && <audio ref={audioRef} src={data.audioUrl} loop />}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
        <div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl bg-black/30 border-2 border-white/50 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
        >
          {mediaUrl && (
            <>
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  playsInline
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              )}
            </>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-6 drop-shadow-lg">{name}</h1>
        
        <div className="min-h-[56px] mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSubtitle}
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="drop-shadow-md"
            >
              {currentSubtitle.split('\n').map((line, index) => (
                  <p key={index} className="text-xl md:text-2xl text-white/90">
                      {line}
                  </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
