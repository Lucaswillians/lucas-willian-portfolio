import * as THREE from "three"

export const ROAD_WIDTH = 10
export const BILLBOARD_DISTANCE_FROM_ROAD = 6

// Control points for a long, winding road heading into -Z.
// X varies to create sweeping left/right curves.
const CONTROL_POINTS: [number, number, number][] = [
  [0, 0, 20],
  [0, 0, -10],
  [10, 0, -50],
  [-6, 0, -90],
  [-16, 0, -130],
  [-2, 0, -175],
  [16, 0, -215],
  [6, 0, -260],
  [-12, 0, -300],
  [-4, 0, -345],
  [12, 0, -385],
  [0, 0, -425],
  [0, 0, -460],
]

export const roadCurve = new THREE.CatmullRomCurve3(
  CONTROL_POINTS.map((p) => new THREE.Vector3(...p)),
  false,
  "catmullrom",
  0.5,
)

export const ROAD_LENGTH = roadCurve.getLength()

// Up vector used to compute perpendicular (side) directions.
const UP = new THREE.Vector3(0, 1, 0)

/**
 * Returns the world position offset to the side of the road at parameter t.
 * side: -1 = left, 1 = right. offset in world units from the road center.
 */
export function pointBesideRoad(t: number, side: number, offset: number) {
  const point = roadCurve.getPointAt(THREE.MathUtils.clamp(t, 0, 1))
  const tangent = roadCurve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1)).normalize()
  const sideDir = new THREE.Vector3().crossVectors(tangent, UP).normalize()
  return point.clone().add(sideDir.multiplyScalar(side * offset))
}

/** Heading (rotation around Y) so an object faces along the road tangent at t. */
export function headingAt(t: number) {
  const tangent = roadCurve.getTangentAt(THREE.MathUtils.clamp(t, 0, 1))
  return Math.atan2(tangent.x, tangent.z)
}

const ROAD_SAMPLES = roadCurve.getSpacedPoints(260)

export function keepPointOnRoad(x: number, z: number, margin = 1.35) {
  let closestPoint = ROAD_SAMPLES[0]
  let closestTangent = ROAD_SAMPLES[1].clone().sub(ROAD_SAMPLES[0]).normalize()
  let best = Number.POSITIVE_INFINITY

  for (let i = 0; i < ROAD_SAMPLES.length - 1; i++) {
    const start = ROAD_SAMPLES[i]
    const end = ROAD_SAMPLES[i + 1]
    const segment = end.clone().sub(start)
    const segmentLengthSq = segment.lengthSq()
    const progressOnSegment = segmentLengthSq === 0 ? 0 : THREE.MathUtils.clamp(
      ((x - start.x) * segment.x + (z - start.z) * segment.z) / segmentLengthSq,
      0,
      1,
    )
    const p = start.clone().add(segment.multiplyScalar(progressOnSegment))
    const dx = x - p.x
    const dz = z - p.z
    const distanceSq = dx * dx + dz * dz

    if (distanceSq < best) {
      best = distanceSq
      closestPoint = p
      closestTangent = end.clone().sub(start).normalize()
    }
  }

  const sideDir = new THREE.Vector3().crossVectors(closestTangent, UP).normalize()
  const dx = x - closestPoint.x
  const dz = z - closestPoint.z
  const rawLateral = dx * sideDir.x + dz * sideDir.z
  const lateral = THREE.MathUtils.clamp(rawLateral, -ROAD_WIDTH / 2 + margin, ROAD_WIDTH / 2 - margin)
  const clamped = closestPoint.add(sideDir.multiplyScalar(lateral))

  return { x: clamped.x, z: clamped.z, hitBoundary: lateral !== rawLateral }
}
