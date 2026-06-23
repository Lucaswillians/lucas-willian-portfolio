"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { Keys } from "./use-controls"
import { keepPointOnRoad } from "@/lib/road-path"

export type CarState = {
  x: number
  z: number
  angle: number
  speed: number
}

const MAX_SPEED = 20
const MAX_REVERSE = 8
const ACCEL = 14
const BRAKE = 28
const FRICTION = 9
const TURN_RATE = 1.7

export function Car({
  stateRef,
  controlsRef,
}: {
  stateRef: React.MutableRefObject<CarState>
  controlsRef: React.MutableRefObject<Keys>
}) {
  const group = useRef<THREE.Group>(null)
  const wheels = useRef<THREE.Mesh[]>([])
  const { camera } = useThree()

  // Persistent vectors to avoid per-frame allocations.
  const camTarget = useRef(new THREE.Vector3())
  const camPos = useRef(new THREE.Vector3())

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const s = stateRef.current
    const k = controlsRef.current

    // Longitudinal motion
    if (k.forward) s.speed += ACCEL * delta
    else if (k.back) s.speed -= BRAKE * delta

    // Natural friction toward 0
    if (!k.forward && !k.back) {
      const drag = FRICTION * delta
      if (s.speed > 0) s.speed = Math.max(0, s.speed - drag)
      else if (s.speed < 0) s.speed = Math.min(0, s.speed + drag)
    }

    s.speed = THREE.MathUtils.clamp(s.speed, -MAX_REVERSE, MAX_SPEED)

    // Steering — only effective while moving, and reversed when going backwards.
    const steerInput = (k.left ? 1 : 0) - (k.right ? 1 : 0)
    const speedFactor = THREE.MathUtils.clamp(Math.abs(s.speed) / 8, 0, 1)
    const dir = s.speed >= 0 ? 1 : -1
    s.angle += steerInput * TURN_RATE * delta * speedFactor * dir

    // Forward vector for angle (0 => facing -Z)
    const fx = -Math.sin(s.angle)
    const fz = -Math.cos(s.angle)
    s.x += fx * s.speed * delta
    s.z += fz * s.speed * delta

    const roadPosition = keepPointOnRoad(s.x, s.z)
    if (roadPosition.hitBoundary) {
      s.speed *= 0.72
      s.x = THREE.MathUtils.lerp(s.x, roadPosition.x, 0.85)
      s.z = THREE.MathUtils.lerp(s.z, roadPosition.z, 0.85)
    } else {
      s.x = roadPosition.x
      s.z = roadPosition.z
    }

    if (group.current) {
      group.current.position.set(s.x, 0, s.z)
      group.current.rotation.y = s.angle
    }

    // Spin wheels relative to speed
    for (const w of wheels.current) {
      if (w) w.rotation.x += s.speed * delta * 0.6
    }

    // Chase camera — positioned behind & above the car, smoothed.
    const behind = 11
    const height = 5.5
    camPos.current.set(s.x - fx * behind, height, s.z - fz * behind)
    camera.position.lerp(camPos.current, 1 - Math.pow(0.001, delta))

    camTarget.current.set(s.x + fx * 6, 1.4, s.z + fz * 6)
    camera.lookAt(camTarget.current)
  })

  const bodyMat = (
    <meshStandardMaterial color="#1a0a2e" metalness={0.6} roughness={0.25} />
  )

  return (
    <group ref={group}>
      {/* Underglow */}
      <pointLight position={[0, 0.2, 0]} color="#ff2d95" intensity={18} distance={9} />

      {/* Lower body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2, 0.7, 4.2]} />
        {bodyMat}
      </mesh>
      {/* Neon trim along body */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[2.06, 0.18, 4.26]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.15, -0.2]} castShadow>
        <boxGeometry args={[1.6, 0.7, 2]} />
        <meshStandardMaterial color="#2a1147" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Windshield glow */}
      <mesh position={[0, 1.18, 0.82]} rotation={[Math.PI / 3.2, 0, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshStandardMaterial color="#b14aff" emissive="#b14aff" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.6, 0.6, 2.12]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#fff7e0" emissive="#fff7e0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-0.6, 0.6, 2.12]}>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#fff7e0" emissive="#fff7e0" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Taillights */}
      <mesh position={[0.6, 0.62, -2.12]}>
        <boxGeometry args={[0.4, 0.22, 0.1]} />
        <meshStandardMaterial color="#ff2d95" emissive="#ff2d95" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh position={[-0.6, 0.62, -2.12]}>
        <boxGeometry args={[0.4, 0.22, 0.1]} />
        <meshStandardMaterial color="#ff2d95" emissive="#ff2d95" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      {/* Wheels */}
      {(
        [
          [1.05, 0.4, 1.4],
          [-1.05, 0.4, 1.4],
          [1.05, 0.4, -1.4],
          [-1.05, 0.4, -1.4],
        ] as const
      ).map((pos, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) wheels.current[i] = m
          }}
          position={pos as unknown as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.42, 0.42, 0.35, 18]} />
          <meshStandardMaterial color="#0d0d12" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
