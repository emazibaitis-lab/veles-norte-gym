// Catálogo general para explorar ejercicios, independiente de las rutinas asignadas.
// Cada ejercicio puede aparecer en más de una zona sin duplicar sus datos.
function crearId(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const catalogoEjercicios = [
  ...[
    'Press de banca con barra',
    'Press de banca con mancuernas',
    'Press inclinado con mancuernas',
    'Aperturas con mancuernas',
    'Cruces de poleas',
    'Flexiones de brazos',
    'Press de pecho en máquina',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    ...(nombre === 'Press de banca con barra'
      ? { exerciseDbId: 'EIeI8Vf' }
      : {}),
    grupos: [{ zona: 'pecho', subgrupo: 'Pecho', vista: 'FRONT' }],
  })),
  ...[
    'Press militar con barra',
    'Press de hombros con mancuernas',
    'Elevaciones laterales',
    'Elevaciones frontales',
    'Press de hombros en máquina',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    grupos: [{ zona: 'hombros', subgrupo: 'Hombros', vista: 'FRONT' }],
  })),
  ...[
    'Pájaros con mancuernas',
    'Aperturas inversas en máquina',
    'Face pulls en polea',
    'Aperturas inversas en polea',
    'Remo con codos abiertos, enfatizando el deltoides posterior',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    grupos: [
      { zona: 'hombros', subgrupo: 'Hombro posterior', vista: 'BACK' },
      ...(nombre === 'Face pulls en polea'
        ? [{ zona: 'espalda', subgrupo: 'Espalda media y alta', vista: 'BACK' }]
        : []),
    ],
  })),
  ...[
    'Curl de bíceps con barra',
    'Curl alternado con mancuernas',
    'Curl martillo',
    'Curl en banco inclinado',
    'Curl de bíceps en polea',
    'Curl predicador',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    grupos: [{ zona: 'brazos', subgrupo: 'Bíceps', vista: 'BOTH' }],
  })),
  ...[
    'Extensión de tríceps en polea',
    'Extensión de tríceps por encima de la cabeza',
    'Press francés',
    'Patada de tríceps con mancuerna',
    'Fondos para tríceps',
    'Press de banca con agarre cerrado',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    grupos: [{ zona: 'brazos', subgrupo: 'Tríceps', vista: 'BOTH' }],
  })),
  ...[
    ['Jalón al pecho', 'Dorsales'],
    ['Dominadas', 'Dorsales'],
    ['Jalón con agarre neutro', 'Dorsales'],
    ['Pullover en polea', 'Dorsales'],
    ['Remo unilateral con mancuerna', 'Dorsales'],
    ['Remo con barra', 'Espalda media y alta'],
    ['Remo sentado en polea', 'Espalda media y alta'],
    ['Remo con pecho apoyado', 'Espalda media y alta'],
    ['Remo en máquina', 'Espalda media y alta'],
    ['Extensiones lumbares', 'Zona lumbar'],
    ['Bird dog', 'Zona lumbar'],
  ].map(([nombre, subgrupo]) => ({
    id: crearId(nombre),
    nombre,
    grupos: [{ zona: 'espalda', subgrupo, vista: 'BACK' }],
  })),
  ...[
    'Crunch abdominal',
    'Plancha frontal',
    'Plancha lateral',
    'Elevaciones de piernas',
    'Crunch en polea',
    'Dead bug',
    'Ab wheel',
  ].map((nombre) => ({
    id: crearId(nombre),
    nombre,
    grupos: [{ zona: 'abdomen', subgrupo: 'Abdomen', vista: 'FRONT' }],
  })),
  ...[
    ['Sentadilla goblet', 'Cuádriceps', 'FRONT'],
    ['Sentadilla con barra', 'Cuádriceps', 'FRONT'],
    ['Prensa de piernas', 'Cuádriceps', 'FRONT'],
    ['Extensiones de cuádriceps', 'Cuádriceps', 'FRONT'],
    ['Zancadas', 'Cuádriceps', 'FRONT'],
    ['Sentadilla búlgara', 'Cuádriceps', 'FRONT'],
    ['Peso muerto rumano', 'Isquiotibiales', 'BACK'],
    ['Curl femoral tumbado en máquina', 'Isquiotibiales', 'BACK'],
    ['Curl femoral sentado en máquina', 'Isquiotibiales', 'BACK'],
    ['Peso muerto con piernas semirrígidas', 'Isquiotibiales', 'BACK'],
    ['Nordic curl', 'Isquiotibiales', 'BACK'],
    ['Hip thrust', 'Glúteos', 'BACK'],
    ['Puente de glúteos', 'Glúteos', 'BACK'],
    ['Patada de glúteo en polea', 'Glúteos', 'BACK'],
    ['Abducción de cadera en máquina', 'Glúteos', 'BACK'],
    ['Sentadilla búlgara con énfasis en glúteos', 'Glúteos', 'BACK'],
    ['Elevaciones de talones de pie', 'Gemelos', 'BACK'],
    ['Elevaciones de talones sentado', 'Gemelos', 'BACK'],
    ['Elevaciones de talones en prensa', 'Gemelos', 'BACK'],
  ].map(([nombre, subgrupo, vista]) => ({
    id: crearId(nombre),
    nombre,
    grupos: [
      { zona: 'piernas', subgrupo, vista },
      ...(subgrupo === 'Glúteos' || nombre === 'Peso muerto rumano'
        ? [{ zona: 'gluteos', subgrupo: 'Glúteos', vista }]
        : []),
    ],
  })),
]
