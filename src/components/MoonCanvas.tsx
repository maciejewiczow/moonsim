import * as React from 'react';
import styled from 'styled-components';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import moonModelPath from 'assets/objects/moon/moon.glb';
import { observer } from 'mobx-react-lite';
import { moon } from 'state/Moon';

const CanvasWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
`;

export const MoonScene = observer(() => {
    const moonCollada = useLoader(GLTFLoader, moonModelPath);

    return (
        <CanvasWrapper>
            <Canvas
                camera={{ position: [0, 0, 1] }}
                onCreated={s => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    window.scene = s.scene;
                }}
            >
                <color attach="background" args={['black']} />
                <primitive
                    name="Loaded moon"
                    object={moonCollada.scene}
                    position={[0, 0, 0]}
                    scale={2 * moon.properties.relativeSize}
                    rotation={[0, 0, moon.properties.positionAngle]}
                />
                <group
                    rotation={[0, moon.properties.phaseAngle, 0]}
                >
                    <directionalLight args={[0xffffff, 1.35]} position={[0, 0, -30]} />
                </group>
            </Canvas>
        </CanvasWrapper>
    );
});
