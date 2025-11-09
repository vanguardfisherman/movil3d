// app/index.tsx
import { View } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useRef } from 'react';
import type { Mesh } from 'three';
import OrbitTouch from '../components/OrbitTouch';
import type { ThreeElements } from '@react-three/fiber';

// Cubo simple que gira
function SpinningBox(props: ThreeElements['mesh']) {
    const meshRef = useRef<Mesh>(null!);
    useFrame((_, delta) => (meshRef.current.rotation.y += delta * 0.2));
    return (
        <mesh ref={meshRef} {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8ab4ff" />
        </mesh>
    );
}

export default function Home() {
    return (
        <View style={{ flex: 1, backgroundColor: '#111' }}>
            <Canvas
                onCreated={({ gl }) => {
                    gl.setPixelRatio(Math.min(2, globalThis.devicePixelRatio || 1));
                }}
                camera={{ position: [0, 1.2, 3], fov: 50 }}
            >
                <OrbitTouch>
                    <>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[2, 3, 2]} intensity={0.8} />
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                            <planeGeometry args={[10, 10]} />
                            <meshStandardMaterial color="#222" />
                        </mesh>
                        <SpinningBox />
                    </>
                </OrbitTouch>
            </Canvas>
        </View>
    );
}
