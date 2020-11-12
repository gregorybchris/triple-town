import {
  GRASS, BUSH, TREE,
  TOMBSTONE,
  GEM, ROBOT,
} from "./entities.js"

const ENTITY_PROBABILITIES = [
  [GRASS,     0.73],
  [BUSH,      0.10],
  [TREE,      0.04],
  [TOMBSTONE, 0.08],
  [GEM,       0.04],
  [ROBOT,     0.01],
]

export default ENTITY_PROBABILITIES