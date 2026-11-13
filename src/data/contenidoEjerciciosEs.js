const traduccionesMusculares = {
  pectorals: 'Pectorales',
  pectoral: 'Pectoral',
  'upper chest': 'Pecho superior',
  'lower chest': 'Pecho inferior',
  deltoids: 'Deltoides',
  delts: 'Deltoides',
  'front delts': 'Deltoides anteriores',
  'rear delts': 'Deltoides posteriores',
  'rear deltoids': 'Deltoides posteriores',
  shoulders: 'Hombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  brachialis: 'Braquial',
  brachioradialis: 'Braquiorradial',
  forearms: 'Antebrazos',
  lats: 'Dorsales',
  'latissimus dorsi': 'Dorsales',
  'upper back': 'Espalda media y alta',
  'middle back': 'Espalda media',
  'lower traps': 'Trapecio inferior',
  'middle traps': 'Trapecio medio',
  traps: 'Trapecios',
  trapezius: 'Trapecios',
  rhomboids: 'Romboides',
  'erector spinae': 'Erectores espinales',
  'lower back': 'Zona lumbar',
  abs: 'Abdominales',
  abdominals: 'Abdominales',
  obliques: 'Oblicuos',
  quadriceps: 'Cuádriceps',
  quads: 'Cuádriceps',
  hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos',
  calves: 'Gemelos',
  gastrocnemius: 'Gastrocnemios',
  soleus: 'Sóleo',
  adductors: 'Aductores',
  abductors: 'Abductores',
  'serratus anterior': 'Serrato anterior',
  spine: 'Espalda',
}

const traduccionesEquipamiento = {
  barbell: 'Barra',
  dumbbell: 'Mancuernas',
  cable: 'Polea',
  'leverage machine': 'Máquina de palanca',
  'body weight': 'Peso corporal',
  'bodyweight': 'Peso corporal',
  'smith machine': 'Máquina Smith',
  'resistance band': 'Banda elástica',
  band: 'Banda elástica',
  kettlebell: 'Pesa rusa',
  rope: 'Cuerda',
  bench: 'Banco',
  'stability ball': 'Pelota de estabilidad',
  'medicine ball': 'Balón medicinal',
  'ez bar': 'Barra Z',
  'sled machine': 'Máquina de trineo',
  'assisted machine': 'Máquina asistida',
  'trap bar': 'Barra hexagonal',
}

const instruccionesPorTipo = {
  pressHorizontal: [
    'Apoyá la espalda y mantené los pies firmes en el suelo.',
    'Bajá el peso de forma controlada hasta la altura del pecho, con las muñecas alineadas.',
    'Empujá hasta extender los brazos sin bloquear los codos y volvé lentamente.',
  ],
  pressVertical: [
    'Sentate o parate con el torso estable y el abdomen activo.',
    'Ubicá las manos a la altura de los hombros y las muñecas alineadas.',
    'Empujá hacia arriba y bajá el peso lentamente hasta la posición inicial.',
  ],
  apertura: [
    'Adoptá una posición estable y mantené los codos levemente flexionados.',
    'Abrí los brazos hasta sentir un estiramiento cómodo, sin forzar los hombros.',
    'Juntá las manos con control y regresá lentamente al inicio.',
  ],
  flexion: [
    'Colocá las manos debajo de los hombros y mantené el cuerpo alineado.',
    'Flexioná los codos para acercar el pecho al suelo sin dejar caer la cadera.',
    'Empujá el suelo para volver a la posición inicial.',
  ],
  elevacion: [
    'Parate con el torso estable y los brazos relajados a los costados.',
    'Elevá los brazos de forma controlada hasta una altura cómoda, sin impulso.',
    'Bajalos lentamente y mantené los hombros alejados de las orejas.',
  ],
  deltoidesPosterior: [
    'Inclina el torso desde la cadera y mantené la espalda estable.',
    'Llevá los brazos hacia los costados con los codos levemente flexionados.',
    'Volvé lentamente al inicio sin balancear el cuerpo.',
  ],
  facePull: [
    'Ajustá la polea a la altura de la cara y sujetá la cuerda con ambas manos.',
    'Tirá de la cuerda hacia la cara llevando los codos hacia afuera.',
    'Regresá lentamente, manteniendo el torso estable.',
  ],
  curl: [
    'Mantené los codos cerca del torso y las muñecas rectas.',
    'Flexioná los codos para acercar el peso a los hombros sin balancearte.',
    'Bajá el peso lentamente hasta extender los brazos de forma cómoda.',
  ],
  triceps: [
    'Estabilizá los brazos y mantené los codos apuntando al frente o junto al torso.',
    'Extendé los codos para alejar el peso sin mover los hombros.',
    'Volvé lentamente a la posición inicial, manteniendo el control.',
  ],
  dominada: [
    'Sujetá la barra con un agarre firme y comenzá con los brazos extendidos.',
    'Llevá el pecho hacia la barra usando la espalda y flexionando los codos.',
    'Descendé de forma controlada hasta la posición inicial.',
  ],
  jalon: [
    'Sentate con los muslos sujetos y tomá la barra con ambas manos.',
    'Llevá la barra hacia la parte alta del pecho manteniendo el torso estable.',
    'Extendé los brazos lentamente para volver al inicio.',
  ],
  remo: [
    'Adoptá una posición estable y mantené la espalda alineada.',
    'Llevá los codos hacia atrás acercando el agarre al torso.',
    'Extendé los brazos lentamente sin redondear la espalda.',
  ],
  pullover: [
    'Mantené el torso firme y los codos levemente flexionados.',
    'Llevá el agarre en un arco controlado hacia los muslos.',
    'Regresá lentamente hasta sentir un estiramiento cómodo.',
  ],
  lumbar: [
    'Acomodate con la espalda en posición neutra y el abdomen activo.',
    'Mové el torso desde la cadera dentro de un rango cómodo, sin hiperextender la espalda.',
    'Volvé lentamente a la posición inicial.',
  ],
  birdDog: [
    'Apoyá manos y rodillas, con las manos debajo de los hombros.',
    'Extendé un brazo y la pierna contraria sin girar la cadera.',
    'Regresá al centro y repetí del otro lado.',
  ],
  crunch: [
    'Acostate boca arriba con las rodillas flexionadas y la zona lumbar apoyada.',
    'Elevá suavemente los hombros contrayendo el abdomen, sin tirar del cuello.',
    'Bajá de forma controlada hasta apoyar la espalda.',
  ],
  crunchPolea: [
    'Arrodillate frente a la polea y sostené el agarre cerca de la cabeza.',
    'Flexioná el torso contrayendo el abdomen, sin tirar con los brazos.',
    'Volvé lentamente a la posición inicial.',
  ],
  plancha: [
    'Apoyá antebrazos o manos y mantené el cuerpo alineado.',
    'Activá abdomen y glúteos, evitando hundir o elevar la cadera.',
    'Respirá con normalidad y sostené la posición el tiempo indicado.',
  ],
  elevacionPiernas: [
    'Acostate boca arriba y mantené el abdomen activo.',
    'Elevá las piernas sin despegar la zona lumbar del suelo.',
    'Bajalas lentamente hasta el rango que puedas controlar.',
  ],
  deadBug: [
    'Acostate boca arriba con brazos extendidos y rodillas flexionadas a 90 grados.',
    'Extendé lentamente un brazo y la pierna contraria sin arquear la espalda.',
    'Volvé al centro y alterná los lados.',
  ],
  abWheel: [
    'Arrodillate, sujetá la rueda y mantené el abdomen contraído.',
    'Deslizá la rueda hacia adelante solo hasta donde puedas controlar la espalda.',
    'Volvé a la posición inicial sin dejar caer la cadera.',
  ],
  sentadilla: [
    'Parate con los pies aproximadamente al ancho de los hombros.',
    'Flexioná cadera y rodillas manteniendo el peso repartido en los pies.',
    'Empujá el suelo para volver a pararte, sin bloquear las rodillas.',
  ],
  zancada: [
    'Adoptá una posición escalonada y mantené el torso estable.',
    'Flexioná ambas rodillas bajando de forma controlada.',
    'Empujá con el pie delantero para volver y repetí con el otro lado.',
  ],
  bulgaraGluteos: [
    'Colocá el pie trasero elevado y adelantá el pie delantero para mantener una base estable.',
    'Descendé flexionando la pierna delantera y llevando la cadera ligeramente hacia atrás.',
    'Empujá con el pie delantero para volver, manteniendo el torso controlado.',
  ],
  nordic: [
    'Arrodillate y asegurá los tobillos debajo de un soporte firme.',
    'Incliná el cuerpo hacia adelante lentamente, manteniendo cadera y torso alineados.',
    'Frená el descenso hasta donde puedas controlarlo y ayudate con las manos para volver.',
  ],
  prensa: [
    'Acomodá la espalda en el respaldo y apoyá los pies en la plataforma.',
    'Bajá la plataforma flexionando las rodillas dentro de un rango cómodo.',
    'Empujá para extender las piernas sin bloquear las rodillas.',
  ],
  extensionPiernas: [
    'Ajustá la máquina para que el eje coincida con la articulación de la rodilla.',
    'Extendé las rodillas de forma controlada.',
    'Bajá lentamente el peso hasta la posición inicial.',
  ],
  bisagra: [
    'Parate con los pies firmes y el peso cerca del cuerpo.',
    'Llevá la cadera hacia atrás manteniendo la espalda alineada y las rodillas levemente flexionadas.',
    'Extendé la cadera para volver a pararte, sin arquear la zona lumbar.',
  ],
  curlPiernas: [
    'Ajustá la máquina para que el apoyo quede cómodo sobre la parte baja de las piernas.',
    'Flexioná las rodillas acercando los talones al cuerpo.',
    'Extendé las piernas lentamente hasta volver al inicio.',
  ],
  gluteos: [
    'Apoyá los pies firmes y mantené el abdomen activo.',
    'Extendé la cadera contrayendo los glúteos, sin arquear la espalda.',
    'Bajá lentamente hasta la posición inicial.',
  ],
  patadaGluteo: [
    'Estabilizá el torso y mantené la cadera alineada.',
    'Llevá una pierna hacia atrás desde la cadera sin girar el cuerpo.',
    'Volvé lentamente y completá las repeticiones de ambos lados.',
  ],
  abduccion: [
    'Sentate con la espalda apoyada y las piernas colocadas en los soportes.',
    'Separá las rodillas de forma controlada.',
    'Regresá lentamente sin dejar que el peso golpee.',
  ],
  gemelos: [
    'Apoyá la parte delantera de los pies y mantené las rodillas estables.',
    'Elevá los talones hasta quedar sobre las puntas de los pies.',
    'Bajá lentamente hasta sentir un estiramiento cómodo.',
  ],
}

export function traducirMusculoExerciseDb(musculo) {
  return traduccionesMusculares[musculo.trim().toLowerCase()] ?? musculo
}

export function traducirEquipamientoExerciseDb(equipamiento) {
  return traduccionesEquipamiento[equipamiento.trim().toLowerCase()] ?? equipamiento
}

export function obtenerInstruccionesEnEspanol(ejercicio) {
  const nombre = ejercicio.nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (nombre.includes('bird dog')) return instruccionesPorTipo.birdDog
  if (nombre.includes('dead bug')) return instruccionesPorTipo.deadBug
  if (nombre.includes('ab wheel')) return instruccionesPorTipo.abWheel
  if (nombre.includes('plancha')) return instruccionesPorTipo.plancha
  if (nombre.includes('crunch en polea')) return instruccionesPorTipo.crunchPolea
  if (nombre.includes('crunch')) return instruccionesPorTipo.crunch
  if (nombre.includes('elevaciones de piernas')) return instruccionesPorTipo.elevacionPiernas
  if (nombre.includes('face pulls')) return instruccionesPorTipo.facePull
  if (nombre.includes('deltoides posterior')) return instruccionesPorTipo.deltoidesPosterior
  if (nombre.includes('aperturas') || nombre.includes('pajaros') || nombre.includes('cruces')) return instruccionesPorTipo.apertura
  if (nombre.includes('elevaciones laterales') || nombre.includes('elevaciones frontales')) return instruccionesPorTipo.elevacion
  if (nombre.includes('curl de biceps') || nombre.includes('curl alternado') || nombre.includes('curl martillo') || nombre.includes('curl en banco') || nombre.includes('curl predicador')) return instruccionesPorTipo.curl
  if (nombre.includes('curl femoral')) return instruccionesPorTipo.curlPiernas
  if (nombre.includes('nordic curl')) return instruccionesPorTipo.nordic
  if (nombre.includes('extension de triceps') || nombre.includes('press frances') || nombre.includes('patada de triceps') || nombre.includes('fondos para triceps') || nombre.includes('agarre cerrado')) return instruccionesPorTipo.triceps
  if (nombre.includes('dominadas')) return instruccionesPorTipo.dominada
  if (nombre.includes('jalon')) return instruccionesPorTipo.jalon
  if (nombre.includes('pullover')) return instruccionesPorTipo.pullover
  if (nombre.includes('remo')) return instruccionesPorTipo.remo
  if (nombre.includes('lumbar')) return instruccionesPorTipo.lumbar
  if (nombre.includes('peso muerto')) return instruccionesPorTipo.bisagra
  if (nombre.includes('sentadilla bulgara') && nombre.includes('gluteos')) return instruccionesPorTipo.bulgaraGluteos
  if (nombre.includes('sentadilla bulgara') || nombre.includes('zancadas')) return instruccionesPorTipo.zancada
  if (nombre.includes('sentadilla') || nombre.includes('goblet')) return instruccionesPorTipo.sentadilla
  if (nombre.includes('prensa de piernas')) return instruccionesPorTipo.prensa
  if (nombre.includes('extensiones de cuadriceps')) return instruccionesPorTipo.extensionPiernas
  if (nombre.includes('hip thrust') || nombre.includes('puente de gluteos')) return instruccionesPorTipo.gluteos
  if (nombre.includes('patada de gluteo')) return instruccionesPorTipo.patadaGluteo
  if (nombre.includes('abduccion')) return instruccionesPorTipo.abduccion
  if (nombre.includes('talones')) return instruccionesPorTipo.gemelos
  if (nombre.includes('press de hombros') || nombre.includes('press militar')) return instruccionesPorTipo.pressVertical
  if (nombre.includes('press')) return instruccionesPorTipo.pressHorizontal
  if (nombre.includes('flexiones')) return instruccionesPorTipo.flexion

  return instruccionesPorTipo.remo
}
