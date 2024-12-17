'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
    Environment,
    Float,
    Text3D,
    useTexture,
    useLoader,
    Cloud,
    Stars
} from '@react-three/drei'
import * as THREE from 'three'

function Background() {
    const texture = useTexture('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bhoot-hdSJdhBBIeKZlnpW9vctvvPamNzwp4.jpeg')
    return (
        <mesh position={[0, 0, -10]}>
            <planeGeometry args={[21, 12]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}

function Ghost({ position, text, glowColor }: { position: [number, number, number], text: string, glowColor: string }) {
    const ghostRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (ghostRef.current) {
            ghostRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002
            ghostRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
        >
            <group ref={ghostRef} position={position}>
                <mesh>
                    <capsuleGeometry args={[0.5, 1.5, 4, 8]} />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.5}
                        color="white"
                        emissive={glowColor}
                        emissiveIntensity={0.2}
                    />
                </mesh>
                <Text3D
                    font="/fonts/Geist_Bold.json"
                    size={0.3}
                    height={0.1}
                    position={[-0.5, 0.5, 0.5]}
                >
                    {text}
                    <meshStandardMaterial
                        color={glowColor}
                        emissive={glowColor}
                        emissiveIntensity={2}
                    />
                </Text3D>
            </group>
        </Float>
    )
}

function SnowParticles() {
    const particlesRef = useRef<THREE.Points>(null)
    const count = 500
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20
        positions[i + 1] = Math.random() * 10
        positions[i + 2] = (Math.random() - 0.5) * 10
    }

    useFrame((state) => {
        if (particlesRef.current) {
            for (let i = 1; i < count * 3; i += 3) {
                particlesRef.current.geometry.attributes.position.array[i] -= 0.01
                if (particlesRef.current.geometry.attributes.position.array[i] < -5) {
                    particlesRef.current.geometry.attributes.position.array[i] = 5
                }
            }
            particlesRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="white"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

export default function HalloweenScene() {
    return (
        <div className="w-full h-screen">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <Background />
                    <Ghost position={[-2, 0, 0]} text="Bhoot" glowColor="#ff4400" />
                    <Ghost position={[0, 0, 0]} text="Bhutnii" glowColor="#ff0000" />
                    <Ghost position={[2, 0, 0]} text="Chidaill" glowColor="#ff6600" />
                    <SnowParticles />
                    <Cloud
                        opacity={0.5}
                        speed={0.4}
                        width={20}
                        depth={1.5}
                        segments={20}
                    />
                    <Stars
                        radius={50}
                        depth={50}
                        count={1000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={1}
                    />
                    <fogExp2 attach="fog" color="#142b3b" density={0.05} />
                    <Environment preset="night" />
                    <ambientLight intensity={0.2} />
                </Suspense>
            </Canvas>
        </div>
    )
}