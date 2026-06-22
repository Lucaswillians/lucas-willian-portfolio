"use client"

import { useMemo } from "react"
import { Line } from "@react-three/drei"
import * as THREE from "three"
import { roadCurve, ROAD_WIDTH } from "@/lib/road-path"

const SEGMENTS = 600
const UP = new THREE.Vector3(0, 1, 0)

export function Road() {
  const { geometry, leftEdge, rightEdge, dashes } = useMemo(() => {
    const points = roadCurve.getSpacedPoints(SEGMENTS)
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    const leftEdge: THREE.Vector3[] = []
    const rightEdge: THREE.Vector3[] = []
    const half = ROAD_WIDTH / 2

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS
      const p = points[i]
      const tangent = roadCurve.getTangentAt(t).normalize()
      const side = new THREE.Vector3().crossVectors(tangent, UP).normalize()

      const l = p.clone().add(side.clone().multiplyScalar(half))
      const r = p.clone().add(side.clone().multiplyScalar(-half))
      leftEdge.push(l.clone().setY(0.06))
      rightEdge.push(r.clone().setY(0.06))

      positions.push(l.x, 0.04, l.z, r.x, 0.04, r.z)
      uvs.push(0, t * SEGMENTS, 1, t * SEGMENTS)

      if (i < SEGMENTS) {
        const a = i * 2
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    // Dashed center line as small segments
    const dashes: THREE.Vector3[][] = []
    const dashCount = 120
    for (let i = 0; i < dashCount; i++) {
      const t0 = i / dashCount
      const t1 = t0 + 0.45 / dashCount
      if (t1 > 1) break
      dashes.push([roadCurve.getPointAt(t0).setY(0.07), roadCurve.getPointAt(t1).setY(0.07)])
    }

    return { geometry, leftEdge, rightEdge, dashes }
  }, [])

  return (
    <group>
      {/* Road surface */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#0a0a16" roughness={0.55} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Neon edges */}
      <Line points={leftEdge} color="#00f0ff" lineWidth={3} toneMapped={false} />
      <Line points={rightEdge} color="#ff2d95" lineWidth={3} toneMapped={false} />

      {/* Center dashes */}
      {dashes.map((seg, i) => (
        <Line key={i} points={seg} color="#ffd23f" lineWidth={2} toneMapped={false} />
      ))}
    </group>
  )
}
