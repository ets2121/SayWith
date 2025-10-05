
"use client";
import React, { useState, useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points, Text } from '@react-three/drei';
import { useSaywithPlayer } from '@/hooks/useSaywithPlayer';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface Template46Props {
  data: {
    mediaUrl: string;
    audioUrl: string;
    srtContent: string;
    name: string;
    mute?: boolean;
  };
}

const FloatingText = ({ children, ...props }: any) => {
    const groupRef = useRef<any>();
    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.position.y += Math.sin(clock.getElapsedTime() + props.seed) * 0.002;
        }
    });
    return (
        <group {...props} ref={groupRef}>
            <Text
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {children}
                <meshStandardMaterial color="white" emissive="pink" emissiveIntensity={0.5} />
            </Text>
        </group>
    );
};

const Particles = ({ count = 200 }) => {
    const pointsRef = useRef<any>();
    const { size, viewport } = useThree();

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        
        const palette = [new THREE.Color('#ffb8d1'), new THREE.Color('#ff8fab'), new THREE.Color('#ffcce5')];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * viewport.width * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
            
            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        return [positions, colors];
    }, [count, viewport.width, viewport.height]);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.position.y -= delta * 0.3;
             if (pointsRef.current.position.y < -viewport.height / 2) {
                pointsRef.current.position.y = viewport.height / 2;
            }
        }
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.1}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
};


const Scene = ({ data }: { data: Template46Props['data'] }) => {
    const { name } = data;
    const { gl, camera } = useThree();

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 70, damping: 20, mass: 0.5 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 70, damping: 20, mass: 0.5 });

    const handleMouseMove = (event:any) => {
        const { clientWidth, clientHeight } = gl.domElement;
        const x = (event.clientX / clientWidth) * 2 - 1;
        const y = -(event.clientY / clientHeight) * 2 + 1;
        mouseX.set(x * 0.1);
        mouseY.set(y * 0.1);
    };

    React.useEffect(() => {
        gl.domElement.addEventListener('mousemove', handleMouseMove);
        return () => gl.domElement.removeEventListener('mousemove', handleMouseMove);
    }, [gl.domElement]);
    
    useFrame(() => {
        camera.position.x += (smoothMouseX.get() - camera.position.x) * 0.1;
        camera.position.y += (smoothMouseY.get() - camera.position.y) * 0.1;
        camera.lookAt(0, 0, 0);
    });
    
    return (
        <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Particles count={50} />

            <FloatingText position={[-2, 1, -2]} seed={0}>I love you</FloatingText>
            <FloatingText position={[2, -1, -3]} seed={1.5}>I miss you</FloatingText>
            <FloatingText position={[-1, -2, -4]} seed={3}>My everything</FloatingText>
        </Suspense>
    );
};


export default function Template46({ data }: Template46Props) {
  const {
    currentSubtitle,
    audioRef,
    handleInitialInteraction,
  } = useSaywithPlayer(data);

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-sans bg-pink-100 text-gray-800"
      onClick={handleInitialInteraction}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Scene data={data}/>
      </Canvas>

      {data.audioUrl && <audio ref={audioRef} src={data.audioUrl} loop />}
      
      {/* Overylay UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg" style={{fontFamily: "'Great Vibes', cursive"}}>{data.name}</h1>
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
                  <p key={index} className="text-xl md:text-2xl text-white/90 bg-black/20 backdrop-blur-sm rounded-md px-3 py-1">
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
