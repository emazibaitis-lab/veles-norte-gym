// Punto de entrada compatible para módulos que necesiten ambas instancias.
// Los servicios importan por separado para permitir carga diferida de Firestore.
export { auth } from './firebaseAuth.js'
export { db } from './firebaseFirestore.js'
