"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import * as THREE from "three"

const skyVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const skyFragment = /* glsl */ `
  varying vec3 vPos;
  void main() {
    float h = normalize(vPos).y;
    vec3 horizon = vec3(0.85, 0.12, 0.45);   // pink
    vec3 mid = vec3(0.32, 0.05, 0.45);        // purple
    vec3 top = vec3(0.03, 0.02, 0.12);        // deep night
    vec3 col = mix(horizon, mid, smoothstep(-0.05, 0.35, h));
    col = mix(col, top, smoothstep(0.25, 0.9, h));
    gl_FragColor = vec4(col, 1.0);
  }
`

const sunFragment = /* glsl */ `
  varying vec2 vUv;
  void main() {
    float y = vUv.y;
    vec3 bot = vec3(1.0, 0.82, 0.25);   // yellow
    vec3 top = vec3(1.0, 0.23, 0.55);   // pink
    vec3 col = mix(bot, top, y);

    // Classic horizontal slits across the lower half of the sun.
    if (y < 0.55 && fract(y * 16.0) < 0.45) discard;

    vec2 c = vUv - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.47, d);
    gl_FragColor = vec4(col, alpha);
  }
`

const sunVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export function SynthwaveEnvironment() {
  const sky = useRef<THREE.Group>(null)
  const floor = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Keep the sky dome centered on the camera so the gradient never runs out.
  useFrame(() => {
    if (sky.current) sky.current.position.copy(camera.position)
    if (floor.current) floor.current.position.set(camera.position.x, 0, camera.position.z)
  })

  return (
    <>
      <fog attach="fog" args={["#2a0a3f", 70, 360]} />
      <ambientLight intensity={0.9} color="#b98bff" />
      <directionalLight position={[0, 30, 20]} intensity={0.5} color="#ff8fc7" />
      <hemisphereLight args={["#ff5fa2", "#1a0633", 0.5]} />

      {/* Sky dome */}
      <group ref={sky}>
        <mesh>
          <sphereGeometry args={[900, 32, 16]} />
          <shaderMaterial
            vertexShader={skyVertex}
            fragmentShader={skyFragment}
            side={THREE.BackSide}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>

      {/* Synthwave sun on the far horizon */}
      <mesh position={[0, 34, -720]}>
        <planeGeometry args={[170, 170]} />
        <shaderMaterial
          vertexShader={sunVertex}
          fragmentShader={sunFragment}
          transparent
          depthWrite={false}
          fog={false}
        />
      </mesh>

      {/* Neon grid floor */}
      <group ref={floor}>
        <Grid
          position={[0, 0, 0]}
          infiniteGrid
          cellSize={2.5}
          cellThickness={0.8}
          cellColor="#5a2a9c"
          sectionSize={12}
          sectionThickness={1.5}
          sectionColor="#ff2d95"
          fadeDistance={650}
          fadeStrength={1.8}
        />
      </group>
    </>
  )
}
