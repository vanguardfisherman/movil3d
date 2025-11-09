// components/OrbitTouch.tsx
import { useRef } from 'react';
import { PanGestureHandler, PinchGestureHandler, PanGestureHandlerGestureEvent, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useThree } from '@react-three/fiber/native';

export default function OrbitTouch({ children }: { children: React.ReactNode }) {
    const { camera } = useThree();
    // estado orbital simple
    const state = useRef({
        theta: 0,    // rotación horizontal
        phi: 0.35,   // rotación vertical
        radius: 3,   // distancia
        lastX: 0,
        lastY: 0,
    });

    function updateCamera() {
        const { theta, phi, radius } = state.current;
        const x = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.cos(theta);
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }

    const onPan = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
        const { translationX, translationY, state: gState } = nativeEvent as any;
        const ROT_SPEED = 0.005;
        const VERT_SPEED = 0.005;

        state.current.theta = state.current.lastX + translationX * ROT_SPEED;
        state.current.phi   = Math.max(0.05, Math.min(Math.PI - 0.05, state.current.lastY + translationY * VERT_SPEED));
        updateCamera();

        if (gState === 5 /* END */) {
            state.current.lastX = state.current.theta;
            state.current.lastY = state.current.phi;
        }
    };

    const onPinch = ({ nativeEvent }: PinchGestureHandlerGestureEvent) => {
        const { scale } = nativeEvent;
        const base = 3; // distancia base
        state.current.radius = Math.max(1, Math.min(8, base / scale));
        updateCamera();
    };

    return (
        <PinchGestureHandler onGestureEvent={onPinch}>
            <PanGestureHandler onGestureEvent={onPan} minDist={5}>
                {children as any}
            </PanGestureHandler>
        </PinchGestureHandler>
    );
}
