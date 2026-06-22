import * as THREE from "three"

export const ROAD_WIDTH = 9

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
