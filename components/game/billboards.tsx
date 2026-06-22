"use client"

import { Text } from "@react-three/drei"
import * as THREE from "three"
import { SECTIONS, type BillboardSection } from "@/lib/portfolio-data"
import { pointBesideRoad, roadCurve, ROAD_WIDTH } from "@/lib/road-path"

function Billboard({ section }: { section: BillboardSection }) {
  const sideSign = section.side === "left" ? -1 : 1
  const offset = ROAD_WIDTH / 2 + 4.5
  const pos = pointBesideRoad(section.t, sideSign, offset)

  // Face the panel toward a point a bit earlier on the road, so it turns to
  // greet the driver approaching from behind (instead of sitting side-on).
  const lookT = Math.max(0, section.t - 0.05)
  const target = roadCurve.getPointAt(lookT)
  const yaw = Math.atan2(target.x - pos.x, target.z - pos.z)

  const W = 9
  const H = 7.5
  const panelY = 4.6

  return (
    <group position={[pos.x, 0, pos.z]} rotation={[0, yaw, 0]}>
      {/* Support posts */}
      <mesh position={[-W / 2 + 0.6, panelY / 2, 0]}>
        <boxGeometry args={[0.35, panelY + 0.4, 0.35]} />
        <meshStandardMaterial color="#15151f" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[W / 2 - 0.6, panelY / 2, 0]}>
        <boxGeometry args={[0.35, panelY + 0.4, 0.35]} />
        <meshStandardMaterial color="#15151f" metalness={0.4} roughness={0.6} />
      </mesh>

      <group position={[0, panelY + H / 2 - 1.2, 0]}>
        {/* Neon frame (glowing slab slightly behind the panel) */}
        <mesh position={[0, 0, -0.12]}>
          <boxGeometry args={[W + 0.5, H + 0.5, 0.2]} />
          <meshStandardMaterial
            color={section.accent}
            emissive={section.accent}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
        {/* Dark inner panel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[W, H, 0.25]} />
          <meshStandardMaterial color="#0b0a14" metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Glow light spilling from the sign */}
        <pointLight position={[0, 0, 2]} color={section.accent} intensity={6} distance={16} />

        {/* Accent divider under the header */}
        <mesh position={[0, H / 2 - 3.0, 0.16]}>
          <planeGeometry args={[W - 1.4, 0.06]} />
          <meshStandardMaterial
            color={section.accent}
            emissive={section.accent}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>

        {/* Content (slightly in front of the panel surface) */}
        <group position={[0, 0, 0.16]}>
          <Text
            position={[0, H / 2 - 0.65, 0]}
            fontSize={0.4}
            fontWeight="bold"
            color={section.accent}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.2}
            toneMapped={false}
          >
            {section.tag}
          </Text>

          <Text
            position={[0, H / 2 - 1.5, 0]}
            fontSize={0.74}
            fontWeight="bold"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={W - 1}
            textAlign="center"
            toneMapped={false}
          >
            {section.title}
          </Text>

          {section.subtitle && (
            <Text
              position={[0, H / 2 - 2.35, 0]}
              fontSize={0.36}
              color={section.accent}
              anchorX="center"
              anchorY="middle"
              maxWidth={W - 1}
              textAlign="center"
              toneMapped={false}
            >
              {section.subtitle}
            </Text>
          )}

          <Text
            position={[0, H / 2 - 3.4, 0]}
            fontSize={0.33}
            color="#d6d6e2"
            anchorX="center"
            anchorY="top"
            maxWidth={W - 1.2}
            textAlign="center"
            lineHeight={1.45}
          >
            {section.lines.join("\n")}
          </Text>

          {section.tech && section.tech.length > 0 && (
            <Text
              position={[0, -H / 2 + 0.7, 0]}
              fontSize={0.31}
              fontWeight="bold"
              color={section.accent}
              anchorX="center"
              anchorY="middle"
              maxWidth={W - 0.6}
              textAlign="center"
              letterSpacing={0.06}
              toneMapped={false}
            >
              {section.tech.join("   •   ")}
            </Text>
          )}
        </group>
      </group>
    </group>
  )
}

export function Billboards() {
  return (
    <group>
      {SECTIONS.map((s) => (
        <Billboard key={s.id} section={s} />
      ))}
    </group>
  )
}
