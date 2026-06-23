"use client"

import { Text } from "@react-three/drei"
import * as THREE from "three"
import { SECTIONS, type BillboardSection } from "@/lib/portfolio-data"
import { BILLBOARD_DISTANCE_FROM_ROAD, pointBesideRoad, roadCurve, ROAD_WIDTH } from "@/lib/road-path"

function Billboard({ section }: { section: BillboardSection }) {
  const W = 12
  const H = 8
  const panelY = 4.6
  // Se for a seção final (contato), posiciona no centro da estrada.
  const isOutro = section.kind === "outro"
  const sideSign = isOutro ? 0 : section.side === "left" ? -1 : 1
  const offset = isOutro ? 0 : ROAD_WIDTH / 2 + BILLBOARD_DISTANCE_FROM_ROAD
  const pos = isOutro ? roadCurve.getPointAt(Math.max(0, section.t)) : pointBesideRoad(section.t, sideSign, offset)

  // Face the panel toward a point a bit earlier on the road, so it turns to
  // greet the driver approaching from behind (instead of sitting side-on).
  const lookT = Math.max(0, section.t - 0.05)
  const target = roadCurve.getPointAt(lookT)
  const yaw = Math.atan2(target.x - pos.x, target.z - pos.z)

  const hasTag = !!section.tag?.trim()
  const longTitle = section.title.length > 28
  const titleFontSize = longTitle ? 0.58 : 0.68
  const titleY = H / 2 - (hasTag ? 1.35 : 0.85)
  const subtitleY = titleY - (longTitle ? 0.82 : 0.72)
  const dividerY = subtitleY - 0.58
  const linesY = dividerY - 0.38

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
        <mesh position={[0, dividerY, 0.16]}>
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
          {hasTag && (
            <Text
              position={[0, H / 2 - 0.65, 0]}
              fontSize={0.4}
              fontWeight="bold"
              color={section.accent}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.2}
            >
              {section.tag}
            </Text>
          )}

          <Text
            position={[0, titleY, 0]}
            fontSize={titleFontSize}
            fontWeight="bold"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={W - 1.1}
            textAlign="center"
          >
            {section.title}
          </Text>

          {section.subtitle && (
            <Text
              position={[0, subtitleY, 0]}
              fontSize={0.36}
              color={section.accent}
              anchorX="center"
              anchorY="middle"
              maxWidth={W - 1.2}
              textAlign="center"
            >
              {section.subtitle}
            </Text>
          )}

          <Text
            position={[0, linesY, 0]}
            fontSize={0.33}
            color="#d6d6e2"
            anchorX="center"
            anchorY="top"
            maxWidth={W - 1.4}
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
