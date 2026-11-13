import {
  busquedasExerciseDb,
  referenciasExerciseDb,
} from '../data/referenciasExerciseDb.js'

// Resuelve metadatos y GIFs por ID del catálogo; no realiza una petición HTTP.
export function obtenerReferenciaExerciseDb(ejercicioId) {
  const referencia = referenciasExerciseDb[ejercicioId]
  const resultado = {
    exerciseDbSearch: busquedasExerciseDb[ejercicioId],
  }

  if (!referencia) return resultado

  const [exerciseDbId, exerciseDbName] = referencia
  return {
    ...resultado,
    exerciseDbId,
    exerciseDbName,
    exerciseDbGifUrl: `https://static.exercisedb.dev/media/${exerciseDbId}.gif`,
  }
}
