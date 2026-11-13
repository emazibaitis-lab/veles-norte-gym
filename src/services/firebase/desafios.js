import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { desafios } from '../../data/desafios.js'
import { db } from '../../firebaseFirestore.js'

function leerParticipacionesLocales(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || '{}')
  } catch {
    return {}
  }
}

export async function obtenerDesafiosSocio(uid) {
  const claveGuardado = `veles-norte-gym:desafios:${uid}`
  const referenciaColeccion = collection(db, 'socios', uid, 'desafios')
  let documentos = await getDocs(referenciaColeccion)
  const idsGuardados = new Set(documentos.docs.map((documento) => documento.id))
  const participacionesLocales = leerParticipacionesLocales(claveGuardado)
  const migraciones = Object.entries(participacionesLocales)
    .filter(([desafioId, datos]) =>
      desafios.some((desafio) => desafio.id === desafioId) &&
      !idsGuardados.has(desafioId) &&
      datos && typeof datos === 'object'
    )
    .map(([desafioId, datos]) =>
      setDoc(doc(db, 'socios', uid, 'desafios', desafioId), {
        desafioId,
        inscriptoEn: datos.inscriptoEn || serverTimestamp(),
        avances: Array.isArray(datos.avances) ? datos.avances : [],
        actualizadoEn: serverTimestamp(),
      })
    )

  if (migraciones.length > 0) {
    await Promise.all(migraciones)
    documentos = await getDocs(referenciaColeccion)
  }

  try {
    // Se elimina la copia anterior solo después de contrastarla con Firestore.
    localStorage.removeItem(claveGuardado)
  } catch {
    // Firestore sigue funcionando si el navegador bloquea el almacenamiento local.
  }

  return Object.fromEntries(documentos.docs.map((documento) => {
    const datos = documento.data()
    return [documento.id, {
      ...datos,
      avances: Array.isArray(datos.avances) ? datos.avances : [],
    }]
  }))
}

export async function inscribirSocioEnDesafio(uid, desafioId) {
  const participacion = {
    desafioId,
    inscriptoEn: serverTimestamp(),
    avances: [],
    actualizadoEn: serverTimestamp(),
  }

  await setDoc(doc(db, 'socios', uid, 'desafios', desafioId), participacion)
  return participacion
}

export function eliminarDesafioSocio(uid, desafioId) {
  return deleteDoc(doc(db, 'socios', uid, 'desafios', desafioId))
}

export function agregarAvanceDesafio(uid, desafioId, avance) {
  return updateDoc(doc(db, 'socios', uid, 'desafios', desafioId), {
    avances: arrayUnion(avance),
    actualizadoEn: serverTimestamp(),
  })
}
