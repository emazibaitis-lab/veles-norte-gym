import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../firebase.js'

export async function cargarProgresoRutinas(uid, rutinas) {
  const documentos = await Promise.all(
    rutinas.map((rutina) =>
      getDoc(doc(db, 'socios', uid, 'progresoRutinas', rutina.id))
    )
  )

  return new Map(documentos.map((documento, indice) => {
    const datos = documento.exists() ? documento.data() : {}
    const ids = Array.isArray(datos.ejerciciosCompletados)
      ? datos.ejerciciosCompletados.filter(Number.isInteger)
      : []

    return [rutinas[indice].id, new Set(ids)]
  }))
}

export function guardarProgresoRutina(uid, rutinaId, ejerciciosCompletados) {
  return setDoc(
    doc(db, 'socios', uid, 'progresoRutinas', rutinaId),
    {
      ejerciciosCompletados,
      actualizadoEn: serverTimestamp(),
    },
    { merge: true }
  )
}
