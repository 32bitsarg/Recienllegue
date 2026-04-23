export type GrowthPage = {
  slug: string
  title: string
  description: string
  h1: string
  intro: string
  appHref: string
  sections: { title: string; body: string }[]
  stats: { value: string; label: string }[]
  steps: { title: string; body: string }[]
  seoBlocks: { title: string; body: string }[]
  faqs: { q: string; a: string }[]
}

export function getRelatedGrowthPages(currentSlug: string, limit = 3) {
  const current = growthPages.find((page) => page.slug === currentSlug)
  if (!current) return growthPages.slice(0, limit)
  const tokens = new Set(`${current.slug} ${current.title} ${current.description}`.toLowerCase().split(/[^a-z0-9áéíóúñ]+/).filter((token) => token.length > 3))
  return growthPages
    .filter((page) => page.slug !== currentSlug)
    .map((page) => {
      const haystack = `${page.slug} ${page.title} ${page.description}`.toLowerCase()
      let score = 0
      tokens.forEach((token) => {
        if (haystack.includes(token)) score += 1
      })
      return { page, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.page)
}

export const growthPages: GrowthPage[] = [
  {
    slug: 'hospedajes-estudiantes',
    title: 'Hospedajes para estudiantes en Pergamino | Recién Llegué',
    description: 'Pensiones, habitaciones y departamentos para estudiantes en Pergamino, con datos claros para comparar antes de mudarte.',
    h1: 'Hospedajes para estudiantes en Pergamino',
    intro: 'Compará opciones pensadas para ingresantes y estudiantes de UNNOBA: precio, zona, contacto y datos útiles para decidir rápido.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Qué mirar antes de señar', body: 'Confirmá precio final, servicios incluidos, reglas de convivencia, ubicación real y forma de pago. Si podés, visitá o pedí fotos actuales.' },
      { title: 'Zonas prácticas', body: 'Monteagudo, Centro y barrios con conexión directa suelen ser los puntos más buscados por estudiantes que llegan sin conocer Pergamino.' },
    ],
    stats: [{ value: 'UNNOBA', label: 'foco estudiantil' }, { value: 'Directo', label: 'sin intermediarios' }, { value: 'PWA', label: 'usable desde el celular' }],
    steps: [
      { title: 'Compará opciones', body: 'Revisá precio, ubicación, tipo de alojamiento, fotos y contacto antes de escribir.' },
      { title: 'Contactá al responsable', body: 'Usá teléfono o WhatsApp cuando esté disponible y pedí datos actualizados.' },
      { title: 'Guardá alternativas', body: 'No te quedes con una sola opción si estás por mudarte en temporada de ingreso.' },
    ],
    seoBlocks: [
      { title: 'Hospedajes para ingresantes', body: 'Los estudiantes que llegan a Pergamino suelen priorizar cercanía, precio cerrado y un contacto confiable. Por eso Recién Llegué organiza pensiones, habitaciones y departamentos en una experiencia simple para comparar sin perder tiempo entre publicaciones sueltas.' },
      { title: 'Cómo elegir zona', body: 'La zona ideal depende de tu sede, tu rutina y el transporte que vas a usar. Vivir cerca de UNNOBA puede simplificar horarios, pero también conviene mirar barrios conectados si buscás mejor precio o más disponibilidad.' },
    ],
    faqs: [
      { q: '¿Conviene pensión o departamento?', a: 'La pensión suele ser más simple para empezar; el departamento puede convenir si compartís gastos.' },
      { q: '¿Recién Llegué alquila propiedades?', a: 'No intermediamos. Mostramos información y contacto directo para que compares mejor.' },
    ],
  },
  {
    slug: 'pensiones-para-estudiantes',
    title: 'Pensiones estudiantiles en Pergamino | Recién Llegué',
    description: 'Guía para encontrar pensiones estudiantiles en Pergamino cerca de UNNOBA, con recomendaciones para elegir bien.',
    h1: 'Pensiones estudiantiles en Pergamino',
    intro: 'Una pensión puede resolver los primeros meses en la ciudad con menos trámites y costos más previsibles.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Preguntas clave', body: 'Consultá si incluye luz, gas, internet, limpieza, cocina, horarios y condiciones para visitas.' },
      { title: 'Para ingresantes', body: 'Si llegás por primera vez, priorizá ubicación, seguridad y referencias antes que ahorrar unos pesos.' },
    ],
    stats: [{ value: 'Simple', label: 'para primeros meses' }, { value: 'Costo', label: 'más previsible' }, { value: 'Cerca', label: 'zonas universitarias' }],
    steps: [
      { title: 'Pedí reglas claras', body: 'Consultá horarios, visitas, uso de cocina, limpieza y espacios compartidos.' },
      { title: 'Revisá servicios', body: 'Internet, luz, gas, agua caliente y limpieza pueden cambiar mucho el costo real.' },
      { title: 'Confirmá disponibilidad', body: 'Las pensiones se ocupan rápido en época de ingreso, por eso conviene consultar temprano.' },
    ],
    seoBlocks: [
      { title: 'Por qué una pensión puede convenir', body: 'Para quien recién llega, una pensión estudiantil puede ser una solución inicial más flexible que un alquiler tradicional. Suele requerir menos trámites y permite conocer la ciudad antes de tomar una decisión más larga.' },
      { title: 'Qué comparar entre pensiones', body: 'No mires solo el precio mensual. Compará servicios incluidos, ambiente, cantidad de personas, distancia a la sede, seguridad y referencias del responsable.' },
    ],
    faqs: [
      { q: '¿Hay pensiones cerca de UNNOBA?', a: 'La disponibilidad cambia durante el año. En temporada de ingreso conviene consultar temprano.' },
      { q: '¿Qué datos debería pedir?', a: 'Fotos actuales, dirección, precio total, servicios incluidos y contacto de la persona responsable.' },
    ],
  },
  {
    slug: 'alquileres-para-estudiantes',
    title: 'Alquileres para estudiantes en Pergamino | Recién Llegué',
    description: 'Cómo buscar alquiler para estudiantes en Pergamino: barrios, costos, garantías y pasos antes de mudarte.',
    h1: 'Alquileres para estudiantes en Pergamino',
    intro: 'Una guía práctica para comparar alquileres, entender costos y evitar decisiones apuradas antes de llegar a Pergamino.',
    appHref: '/app/hospedajes',
    sections: [
      { title: 'Costos a comparar', body: 'Además del alquiler, considerá expensas, servicios, internet, transporte y gastos iniciales de mudanza.' },
      { title: 'Garantías', body: 'Cada dueño puede pedir condiciones distintas. Confirmá requisitos antes de avanzar con una reserva.' },
    ],
    stats: [{ value: 'Barrios', label: 'comparables' }, { value: 'Gastos', label: 'a estimar' }, { value: 'Guía', label: 'para decidir' }],
    steps: [
      { title: 'Calculá el costo total', body: 'Sumá alquiler, servicios, internet, transporte y gastos de ingreso.' },
      { title: 'Validá requisitos', body: 'Preguntá garantías, depósitos, contrato y condiciones antes de señar.' },
      { title: 'Compará distancia', body: 'Un alquiler más barato puede salir caro si suma mucho transporte o tiempo.' },
    ],
    seoBlocks: [
      { title: 'Alquilar siendo estudiante', body: 'Buscar alquiler en una ciudad nueva requiere ordenar información dispersa. Recién Llegué ayuda a entender qué mirar, qué preguntar y cómo comparar opciones sin depender únicamente de recomendaciones sueltas.' },
      { title: 'Garantías y documentación', body: 'Cada propietario puede pedir requisitos distintos. Antes de avanzar, confirmá si aceptan garante, seguro de caución, recibos u otras alternativas.' },
    ],
    faqs: [
      { q: '¿Se puede alquilar sin garante?', a: 'Depende del propietario. Algunos aceptan seguro de caución u otras alternativas.' },
      { q: '¿Dónde buscar primero?', a: 'Empezá por opciones cercanas a tu sede o con transporte simple hacia UNNOBA.' },
    ],
  },
  {
    slug: 'comercios-cerca-unnoba',
    title: 'Comercios cerca de UNNOBA Pergamino | Recién Llegué',
    description: 'Comercios útiles cerca de UNNOBA Pergamino: comida, kioscos, supermercados, librerías y servicios para estudiantes.',
    h1: 'Comercios cerca de UNNOBA Pergamino',
    intro: 'Encontrá lugares útiles para resolver comida, compras, fotocopias, trámites y rutina diaria cerca de la sede Pergamino de UNNOBA.',
    appHref: '/app/comercios',
    sections: [
      { title: 'Para cursar y vivir', body: 'La sede Pergamino de UNNOBA se referencia en Monteagudo 2772. Alrededor de esa rutina pesan comida rápida, kioscos, supermercados, librerías, farmacias y servicios.' },
      { title: 'Pensado para estudiantes', body: 'UNNOBA reúne carreras de informática, ingeniería, diseño, agrarias, alimentos, genética, económicas, jurídicas y salud. Cada perfil necesita resolver compras y servicios distintos durante la semana.' },
    ],
    stats: [{ value: 'Monteagudo', label: 'referencia UNNOBA' }, { value: 'Mapa', label: 'referencias útiles' }, { value: 'Dueños', label: 'pueden reclamar' }],
    steps: [
      { title: 'Buscá por necesidad', body: 'Comida, cafeterías, kioscos, supermercados, librerías y servicios cotidianos.' },
      { title: 'Abrí el detalle', body: 'Cuando haya datos disponibles, revisá dirección, teléfono, mapa e imágenes.' },
      { title: 'Compartí el lugar', body: 'Mandá el comercio a otro estudiante o guardalo para resolver más rápido.' },
    ],
    seoBlocks: [
      { title: 'Comercios útiles para estudiantes de UNNOBA', body: 'Al llegar a Pergamino, encontrar dónde comer, imprimir, comprar o resolver trámites puede tomar más tiempo del esperado. Esta guía concentra comercios relevantes para la vida universitaria y los organiza para que puedas abrir mapa, teléfono o detalle sin perderte.' },
      { title: 'Qué información de UNNOBA usamos como contexto', body: 'La universidad informa que tiene sede en Pergamino y una oferta académica distribuida en áreas como tecnología, agrarias, económicas, jurídicas y salud. Por eso priorizamos comercios que resuelven necesidades transversales: comida, fotocopias, supermercado, farmacia, conectividad y trámites.' },
      { title: 'Visibilidad para comercios locales', body: 'Los dueños pueden reclamar su comercio, corregir datos y sumar imágenes. Esto mejora la calidad del directorio y genera más confianza para quienes llegan por primera vez.' },
    ],
    faqs: [
      { q: '¿Puedo reclamar mi comercio?', a: 'Sí. Los dueños pueden reclamarlo desde el panel propietario y pedir cambios.' },
      { q: '¿Los comercios pagan por aparecer?', a: 'Pueden sumarse gratis. El badge verificado es una opción paga para destacar confianza.' },
    ],
  },
  {
    slug: 'kioscos-cerca-unnoba',
    title: 'Kioscos cerca de UNNOBA Pergamino | Recién Llegué',
    description: 'Kioscos y lugares rápidos cerca de UNNOBA Pergamino para estudiantes: bebidas, snacks, carga, fotocopias y compras de paso.',
    h1: 'Kioscos cerca de UNNOBA Pergamino',
    intro: 'Una guía práctica para encontrar kioscos y compras rápidas alrededor de la rutina universitaria en Pergamino.',
    appHref: '/app/comercios?q=kiosco',
    sections: [
      { title: 'Compras entre clases', body: 'Los kioscos sirven para resolver agua, café, algo para comer, carga o compras chicas cuando tenés poco margen entre una clase y otra.' },
      { title: 'Cerca de la sede', body: 'La referencia principal para estudiantes en Pergamino es la sede UNNOBA de Monteagudo 2772. Conviene guardar lugares cercanos o de camino a tu alojamiento.' },
    ],
    stats: [{ value: 'Rápido', label: 'entre cursadas' }, { value: 'Mapa', label: 'ubicación clara' }, { value: 'Guardar', label: 'favoritos' }],
    steps: [
      { title: 'Buscá kioscos', body: 'Abrí comercios y filtrá o buscá por kiosco, almacén o tienda de paso.' },
      { title: 'Revisá ubicación', body: 'Entrá a la ficha para ver mapa, dirección y si hay teléfono cargado.' },
      { title: 'Guardá el que uses', body: 'Si te sirve para la rutina, agregalo a favoritos para encontrarlo rápido.' },
    ],
    seoBlocks: [
      { title: 'Kioscos para la vida universitaria', body: 'Cuando recién llegás, los comercios chicos terminan siendo parte de la rutina: comprar algo antes de cursar, cargar saldo, resolver una merienda o ubicar una referencia simple para encontrarte con otros estudiantes.' },
      { title: 'Qué mirar antes de ir', body: 'No todos los lugares tienen la misma disponibilidad horaria o medios de pago. Por eso conviene revisar dirección, teléfono si está cargado y cercanía real con tu recorrido diario.' },
      { title: 'Contexto UNNOBA Pergamino', body: 'UNNOBA informa servicios para estudiantes como distribución de aulas, becas, tutorías y Departamento de Alumnos en Pergamino. Alrededor de esa dinámica, los kioscos y compras rápidas ayudan a resolver el día a día sin desviarte demasiado.' },
    ],
    faqs: [
      { q: '¿Cómo encuentro kioscos cerca de UNNOBA?', a: 'Entrá a comercios y buscá “kiosco”. También podés abrir el mapa para ver referencias cercanas.' },
      { q: '¿Puedo guardar un kiosco?', a: 'Sí. Desde la app podés guardar comercios como favoritos para volver rápido.' },
    ],
  },
  {
    slug: 'panaderias-pergamino',
    title: 'Panaderías en Pergamino para estudiantes | Recién Llegué',
    description: 'Panaderías en Pergamino útiles para estudiantes y recién llegados: desayunos, meriendas, compras rápidas y comercios cercanos.',
    h1: 'Panaderías en Pergamino',
    intro: 'Encontrá panaderías y lugares para resolver desayuno, merienda o compras rápidas durante tu rutina de cursada.',
    appHref: '/app/comercios?q=panaderia',
    sections: [
      { title: 'Desayuno y merienda', body: 'Para estudiantes, una panadería cercana puede resolver una comida rápida antes de cursar o una compra simple al volver al alojamiento.' },
      { title: 'Zonas y recorridos', body: 'No siempre conviene elegir solo por distancia a UNNOBA: también importa si queda de paso entre tu alojamiento, el centro y la sede.' },
    ],
    stats: [{ value: 'Rutina', label: 'desayuno y merienda' }, { value: 'Mapa', label: 'por zona' }, { value: 'App', label: 'desde el celular' }],
    steps: [
      { title: 'Buscá panaderías', body: 'Usá la búsqueda de comercios para encontrar panaderías o cafeterías.' },
      { title: 'Compará ubicación', body: 'Miralas en mapa y elegí las que queden cerca de tu recorrido real.' },
      { title: 'Guardá alternativas', body: 'Si te mudaste hace poco, guardar dos o tres lugares te ahorra tiempo la primera semana.' },
    ],
    seoBlocks: [
      { title: 'Panaderías para recién llegados', body: 'Los primeros días en una ciudad nueva se resuelven con referencias simples: dónde comprar pan, facturas, algo para desayunar o una merienda rápida. Recién Llegué organiza esos comercios para que no dependas de recomendaciones sueltas.' },
      { title: 'Comercios y vida estudiantil', body: 'La oferta académica de UNNOBA reúne perfiles muy distintos, desde tecnología y diseño hasta salud, agrarias, económicas y jurídicas. Pero todos comparten necesidades cotidianas: comer cerca, comprar rápido y moverse con referencias claras.' },
    ],
    faqs: [
      { q: '¿La página muestra panaderías reales?', a: 'La guía se alimenta del directorio de comercios de Recién Llegué y puede mejorar con reclamos o correcciones de dueños.' },
      { q: '¿Puedo verlas en mapa?', a: 'Sí. Desde la app podés abrir el mapa o entrar a cada ficha cuando haya ubicación cargada.' },
    ],
  },
  {
    slug: 'farmacias-pergamino',
    title: 'Farmacias en Pergamino para estudiantes | Recién Llegué',
    description: 'Farmacias en Pergamino y acceso a farmacias de turno para estudiantes, ingresantes y recién llegados a la ciudad.',
    h1: 'Farmacias en Pergamino',
    intro: 'Ubicá farmacias, consultá turnos y guardá referencias útiles para resolver compras de salud cuando recién llegás.',
    appHref: '/app/farmacias',
    sections: [
      { title: 'Farmacias y turnos', body: 'Además del directorio de comercios, Recién Llegué tiene una sección específica para farmacias de turno con fallback hacia la fuente local si falla la actualización.' },
      { title: 'Para estudiantes', body: 'Si cursás en UNNOBA y todavía no conocés la ciudad, conviene tener ubicadas farmacias cerca de tu alojamiento, la sede y el centro.' },
    ],
    stats: [{ value: 'Turnos', label: 'consulta rápida' }, { value: 'Mapa', label: 'ubicación' }, { value: 'Fuente', label: 'local' }],
    steps: [
      { title: 'Abrí farmacias', body: 'Entrá a la sección de farmacias para ver la información disponible y la fuente.' },
      { title: 'Confirmá antes de ir', body: 'Si es urgente o fuera de horario, llamá o revisá la fuente local antes de trasladarte.' },
      { title: 'Guardá referencias', body: 'Usá favoritos o el mapa para ubicar las farmacias que te quedan más cerca.' },
    ],
    seoBlocks: [
      { title: 'Farmacias para quienes llegan a Pergamino', body: 'Cuando sos nuevo en la ciudad, encontrar una farmacia cercana o de turno puede ser difícil. Esta página concentra el acceso a farmacias, mapa y sección de turnos para resolverlo desde el celular.' },
      { title: 'Información responsable', body: 'Los turnos pueden cambiar por horarios, feriados o actualizaciones externas. Por eso Recién Llegué muestra un fallback claro y mantiene un enlace a la fuente cuando hace falta.' },
      { title: 'Contexto universitario', body: 'UNNOBA informa programas de becas, tutorías y orientación para estudiantes. Tener farmacias ubicadas cerca de la rutina universitaria complementa esa llegada práctica a Pergamino.' },
    ],
    faqs: [
      { q: '¿Dónde veo farmacias de turno?', a: 'En /app/farmacias tenés la sección específica y el fallback hacia la fuente local.' },
      { q: '¿Conviene llamar antes?', a: 'Sí, especialmente de noche, feriados o ante urgencias.' },
    ],
  },
  {
    slug: 'farmacias-de-turno',
    title: 'Farmacias de turno en Pergamino | Recién Llegué',
    description: 'Consultá farmacias de turno en Pergamino con acceso rápido desde Recién Llegué y enlace a la fuente oficial.',
    h1: 'Farmacias de turno en Pergamino',
    intro: 'Accedé rápido a la farmacia de turno desde una página pensada para estudiantes y recién llegados.',
    appHref: '/app/farmacias',
    sections: [
      { title: 'Información actualizada', body: 'La app consulta la fuente local y muestra un fallback claro si no puede actualizarse.' },
      { title: 'Emergencias', body: 'Ante urgencias médicas, usá canales oficiales de salud. Esta guía es solo una ayuda para ubicar farmacias.' },
    ],
    stats: [{ value: 'Turno', label: 'consulta rápida' }, { value: 'Fuente', label: 'local' }, { value: 'Fallback', label: 'si falla' }],
    steps: [
      { title: 'Abrí la guía', body: 'Entrá a la sección de farmacias desde la app o desde esta página.' },
      { title: 'Confirmá antes de ir', body: 'Si es urgente, llamá o revisá la fuente oficial por posibles cambios.' },
      { title: 'Guardá el acceso', body: 'Instalar la PWA ayuda a tenerlo a mano cuando lo necesitás.' },
    ],
    seoBlocks: [
      { title: 'Farmacias de turno para recién llegados', body: 'Cuando no conocés la ciudad, encontrar una farmacia abierta puede ser complicado. Recién Llegué facilita un acceso rápido y contextual para estudiantes y familias.' },
      { title: 'Información responsable', body: 'La disponibilidad puede cambiar por feriados, horarios o actualizaciones externas. Por eso se muestra un fallback y enlace a la fuente cuando hace falta.' },
    ],
    faqs: [
      { q: '¿La información puede cambiar?', a: 'Sí. Siempre conviene confirmar con la fuente oficial o llamar antes de ir.' },
      { q: '¿Funciona desde el celular?', a: 'Sí, también como PWA instalada.' },
    ],
  },
  {
    slug: 'colectivos',
    title: 'Colectivos en Pergamino para estudiantes | Recién Llegué',
    description: 'Mapa y guía de colectivos urbanos en Pergamino para moverte hacia UNNOBA y zonas clave.',
    h1: 'Colectivos en Pergamino para estudiantes',
    intro: 'Una guía simple para entender cómo moverte por Pergamino cuando recién llegás.',
    appHref: '/app/transportes',
    sections: [
      { title: 'Mapa y recorridos', body: 'La app centraliza recorridos y referencias para que puedas comparar opciones de traslado.' },
      { title: 'Planificar antes de salir', body: 'Si estás lejos de tu sede, revisá combinaciones, tiempos y alternativas como bici o remis.' },
    ],
    stats: [{ value: 'Mapa', label: 'recorridos' }, { value: 'UNNOBA', label: 'zonas clave' }, { value: 'PWA', label: 'desde el celular' }],
    steps: [
      { title: 'Identificá tu zona', body: 'Ubicá tu alojamiento, sede y puntos frecuentes.' },
      { title: 'Revisá recorridos', body: 'Compará transporte con mapa y alternativas.' },
      { title: 'Planificá margen', body: 'Los primeros días conviene salir con tiempo hasta conocer horarios reales.' },
    ],
    seoBlocks: [
      { title: 'Moverse en Pergamino', body: 'El transporte define cuánto tiempo perdés por día. Para estudiantes, entender recorridos y zonas conectadas ayuda a elegir alojamiento y organizar la rutina.' },
      { title: 'Colectivos y alternativas', body: 'Además de colectivos, algunas distancias se resuelven caminando, en bicicleta o con remis. La decisión depende de horario, seguridad y presupuesto.' },
    ],
    faqs: [
      { q: '¿Sirve para ir a UNNOBA?', a: 'Sí, la guía está pensada para estudiantes que se mueven hacia sedes y zonas de uso frecuente.' },
      { q: '¿Incluye mapa?', a: 'Sí, desde la app podés ver mapa combinado y transporte.' },
    ],
  },
  {
    slug: 'vivir-cerca-unnoba',
    title: 'Vivir cerca de UNNOBA en Pergamino | Recién Llegué',
    description: 'Barrios, costos y consejos para vivir cerca de UNNOBA Pergamino siendo estudiante.',
    h1: 'Vivir cerca de UNNOBA en Pergamino',
    intro: 'Elegir zona impacta en transporte, seguridad, costos y rutina. Esta guía resume lo importante antes de mudarte.',
    appHref: '/pergamino/alojamiento-estudiantes',
    sections: [
      { title: 'Cercanía vs precio', body: 'Vivir cerca simplifica horarios y traslados, pero puede tener menos disponibilidad. Compará con barrios conectados.' },
      { title: 'Primer mes en la ciudad', body: 'Para arrancar, priorizá una ubicación práctica y datos confiables antes que una opción perfecta.' },
    ],
    stats: [{ value: 'Zonas', label: 'para comparar' }, { value: 'Costos', label: 'a considerar' }, { value: 'Rutina', label: 'más simple' }],
    steps: [
      { title: 'Definí tu sede', body: 'La cercanía real depende de dónde cursás y tus horarios.' },
      { title: 'Compará barrios', body: 'Mirar solo el mapa no alcanza: transporte, seguridad y servicios también pesan.' },
      { title: 'Elegí con margen', body: 'Si recién llegás, priorizá una zona práctica para los primeros meses.' },
    ],
    seoBlocks: [
      { title: 'Vivir cerca de UNNOBA', body: 'La cercanía a la universidad puede reducir traslados, mejorar seguridad nocturna y facilitar la adaptación. Pero también puede limitar opciones, por eso conviene mirar zonas conectadas.' },
      { title: 'Barrios y vida cotidiana', body: 'Un buen barrio para estudiantes no solo queda cerca: también tiene comercios, transporte, conectividad y opciones para resolver el día a día.' },
    ],
    faqs: [
      { q: '¿Cuál es la mejor zona?', a: 'Depende de tu sede, presupuesto y si vas a caminar, usar colectivo o bici.' },
      { q: '¿Conviene llegar antes del inicio de clases?', a: 'Sí. Llegar con algunos días de margen ayuda a resolver transporte, compras y documentación.' },
    ],
  },
  {
    slug: 'informatica-unnoba-pergamino',
    title: 'Informática en UNNOBA Pergamino | Guía para estudiantes',
    description: 'Guía para estudiantes de Informática en UNNOBA Pergamino: carreras, materias iniciales, comercios útiles, alojamiento y rutina.',
    h1: 'Informática en UNNOBA Pergamino',
    intro: 'Si venís a estudiar Ingeniería en Informática, Licenciatura en Sistemas o Analista de Sistemas, organizá tu llegada con referencias útiles de alojamiento, comercios, mapa y trámites.',
    appHref: '/app/inicio',
    sections: [
      { title: 'Carreras y planes', body: 'La web oficial de Elegí UNNOBA muestra carreras del área Informática como Ingeniería en Informática, Licenciatura en Sistemas y Analista de Sistemas, con materias, carga horaria, duración y plan de estudio.' },
      { title: 'Materias iniciales', body: 'Los planes publicados incluyen materias de base como programación, matemática, arquitectura, sistemas, datos y orientación a objetos. Usamos esa información para contextualizar necesidades reales de estudiantes.' },
    ],
    stats: [{ value: '45*', label: 'materias Ing. Informática' }, { value: '41*', label: 'materias Lic. Sistemas' }, { value: '2,5-5', label: 'años según carrera' }],
    steps: [
      { title: 'Revisá tu plan', body: 'Entrá al plan oficial para confirmar materias, correlatividades y versión vigente.' },
      { title: 'Armá tu rutina', body: 'Ubicá alojamiento, transporte, lugares para imprimir, comprar y estudiar cerca de tu recorrido.' },
      { title: 'Guardá referencias', body: 'Usá favoritos y mapa para no perder comercios o hospedajes que te sirvan durante el ingreso.' },
    ],
    seoBlocks: [
      { title: 'Qué se estudia en Informática', body: 'Los planes oficiales de UNNOBA muestran una base fuerte en programación, matemática, arquitectura, bases de datos, comunicación de datos, diseño de sistemas e ingeniería de software. Para ingresantes, eso suele implicar horarios intensos, uso de notebook, conectividad y lugares de estudio.' },
      { title: 'Comercios útiles para estudiantes de sistemas', body: 'Además del alojamiento, conviene ubicar librerías, lugares de impresión, cafeterías con conexión, kioscos, supermercados y servicios técnicos. Recién Llegué organiza esas referencias para que la adaptación a Pergamino sea más simple.' },
      { title: 'No reemplaza el plan oficial', body: 'Esta guía traduce la información académica en necesidades prácticas de llegada. Para materias, inscripción y requisitos, siempre confirmá en UNNOBA o Elegí UNNOBA.' },
    ],
    faqs: [
      { q: '¿Dónde veo el plan de estudios?', a: 'En Elegí UNNOBA y en planesdeestudio.unnoba.edu.ar, donde figuran las materias por año y cuatrimestre.' },
      { q: '¿Recién Llegué informa correlativas?', a: 'No. Para correlativas y versiones de plan, usá siempre la fuente oficial.' },
    ],
  },
  {
    slug: 'ingenieria-unnoba-pergamino',
    title: 'Ingeniería en UNNOBA Pergamino | Guía para estudiantes',
    description: 'Guía para estudiantes de Ingeniería en UNNOBA Pergamino: carreras, materias, alojamiento, comercios y mapa de llegada.',
    h1: 'Ingeniería en UNNOBA Pergamino',
    intro: 'Una guía práctica para quienes llegan a Pergamino a estudiar carreras de ingeniería y necesitan ordenar alojamiento, transporte, compras y servicios.',
    appHref: '/app/mapa',
    sections: [
      { title: 'Carreras de ingeniería', body: 'La oferta oficial incluye carreras como Ingeniería Industrial, Ingeniería Mecánica y tecnicaturas vinculadas al mantenimiento industrial, con planes y cargas horarias publicadas.' },
      { title: 'Rutina técnica', body: 'Las carreras del área combinan matemática, física, procesos, materiales, informática y práctica profesional. Eso vuelve importante tener transporte, comercios y servicios ubicados desde el primer mes.' },
    ],
    stats: [{ value: '5 años', label: 'ingenierías' }, { value: '3 años', label: 'tecnicaturas' }, { value: 'Mapa', label: 'para moverse' }],
    steps: [
      { title: 'Ubicá la sede', body: 'Tomá Monteagudo 2772 como referencia inicial y compará distancia con alojamiento y transporte.' },
      { title: 'Buscá servicios útiles', body: 'Guardá comercios, librerías, ferreterías, supermercados y lugares de comida que queden en tu recorrido.' },
      { title: 'Planificá horarios', body: 'Los primeros días conviene llegar con margen hasta conocer aulas, recorridos y tiempos reales.' },
    ],
    seoBlocks: [
      { title: 'Necesidades de estudiantes de ingeniería', body: 'Quien cursa ingeniería suele necesitar materiales, impresión, conectividad, transporte confiable y lugares para comer cerca de la rutina diaria. La guía conecta esas necesidades con comercios y mapa local.' },
      { title: 'Información académica como contexto', body: 'UNNOBA publica planes de estudio con materias y cargas horarias. Recién Llegué no reemplaza esa información: la usa para entender qué servicios pueden ser útiles para estudiantes que llegan a Pergamino.' },
    ],
    faqs: [
      { q: '¿Dónde verifico materias?', a: 'En el plan oficial de estudios de UNNOBA o en Elegí UNNOBA.' },
      { q: '¿Qué debería resolver antes de empezar?', a: 'Alojamiento, recorrido a la sede, comercios básicos, farmacia cercana y documentación de ingreso.' },
    ],
  },
  {
    slug: 'diseno-unnoba-pergamino',
    title: 'Diseño en UNNOBA Pergamino | Guía para estudiantes',
    description: 'Guía para estudiantes de Diseño en UNNOBA: carreras, materiales, comercios útiles, alojamiento y adaptación a Pergamino.',
    h1: 'Diseño en UNNOBA Pergamino',
    intro: 'Si venís a estudiar Diseño, organizá comercios de materiales, impresión, alojamiento y recorridos antes de arrancar la cursada.',
    appHref: '/app/comercios?q=diseño',
    sections: [
      { title: 'Carreras de diseño', body: 'Elegí UNNOBA lista carreras de Diseño como Diseño Gráfico, Diseño Industrial e Indumentaria y Textil, con duración, materias y carga horaria.' },
      { title: 'Materiales y servicios', body: 'Para diseño, los comercios relevantes no son solo comida o kioscos: también importan librerías, impresión, insumos, mercerías, papelerías y servicios cerca del recorrido.' },
    ],
    stats: [{ value: 'Diseño', label: 'área académica' }, { value: 'Materiales', label: 'a prever' }, { value: 'Mapa', label: 'comercios útiles' }],
    steps: [
      { title: 'Mirar el plan', body: 'Confirmá materias y carga horaria en las páginas oficiales.' },
      { title: 'Armar kit local', body: 'Ubicá comercios para impresión, papelería, materiales y compras rápidas.' },
      { title: 'Guardar lugares', body: 'Agregá a favoritos los comercios que te sirvan para trabajos prácticos o entregas.' },
    ],
    seoBlocks: [
      { title: 'Estudiar diseño y vivir en Pergamino', body: 'Las carreras de diseño suelen tener entregas, materiales y tiempos de producción. Por eso una buena guía local ayuda a encontrar dónde imprimir, comprar insumos y resolver imprevistos sin perder horas.' },
      { title: 'De la información académica a la rutina', body: 'La página oficial informa duración, materias y carga horaria. Recién Llegué traduce ese contexto en decisiones prácticas: dónde vivir, dónde comprar y cómo moverse.' },
    ],
    faqs: [
      { q: '¿Recién Llegué lista materias de Diseño?', a: 'Podemos mencionar el contexto general, pero el detalle vigente debe confirmarse en Elegí UNNOBA o planes oficiales.' },
      { q: '¿Qué comercios convienen guardar?', a: 'Papelerías, librerías, impresión, mercerías, cafeterías y supermercados cercanos a tu recorrido.' },
    ],
  },
  {
    slug: 'carreras-unnoba-pergamino',
    title: 'Carreras de UNNOBA en Pergamino | Guía para ingresantes',
    description: 'Carreras y áreas de UNNOBA para estudiantes que llegan a Pergamino: informática, diseño, ingeniería, agrarias, económicas, jurídicas y salud.',
    h1: 'Carreras de UNNOBA en Pergamino',
    intro: 'Una guía práctica para conectar la oferta académica de UNNOBA con alojamiento, comercios, transporte y servicios útiles al llegar a Pergamino.',
    appHref: '/app/inicio',
    sections: [
      { title: 'Áreas académicas', body: 'Elegí UNNOBA organiza la oferta en Informática, Diseño, Ingeniería, Económicas, Jurídicas, Alimentos, Agronomía, Genética y Salud.' },
      { title: 'Sedes en Pergamino', body: 'UNNOBA informa como referencia el edificio principal de Monteagudo 2772 y ECANA en Av. Presidente Dr. Arturo Frondizi 2650 para trámites y cursada vinculada.' },
    ],
    stats: [{ value: '9', label: 'áreas de oferta' }, { value: 'Pergamino', label: 'sede UNNOBA' }, { value: 'TAI', label: 'ingreso 2026' }],
    steps: [
      { title: 'Elegí carrera', body: 'Revisá la carrera en Elegí UNNOBA y confirmá materias, duración, carga horaria y plan vigente.' },
      { title: 'Ubicá la cursada', body: 'Chequeá aulas y sede oficial para no confundir Monteagudo, ECANA u otras referencias.' },
      { title: 'Armá tu llegada', body: 'Compará hospedaje, transporte, comercios y farmacias antes de arrancar.' },
    ],
    seoBlocks: [
      { title: 'Oferta académica y vida cotidiana', body: 'Estudiar en UNNOBA no es solo elegir una carrera. Para quien llega a Pergamino también importa dónde vivir, cómo moverse, dónde comprar y qué servicios tener cerca durante las primeras semanas.' },
      { title: 'Carreras detectadas en fuentes oficiales', body: 'La oferta relevada incluye carreras de sistemas e informática, diseño, ingeniería, agronomía, alimentos, genética, económicas, abogacía y enfermería. Cada página oficial puede actualizar planes y materias, por eso conviene validar siempre en UNNOBA.' },
      { title: 'Cómo usa Recién Llegué esta información', body: 'No reemplazamos el sitio académico. Lo usamos para ordenar guías prácticas por perfil: informática necesita conectividad e impresión; diseño puede necesitar materiales; salud y agrarias tienen rutinas y sedes específicas.' },
    ],
    faqs: [
      { q: '¿Esta página reemplaza a Elegí UNNOBA?', a: 'No. Elegí UNNOBA y los planes oficiales son la fuente para inscripción, materias y validez del título.' },
      { q: '¿Qué resuelve Recién Llegué?', a: 'Alojamiento, comercios, mapa, transporte, farmacias, favoritos y alertas para organizar tu llegada.' },
    ],
  },
  {
    slug: 'economicas-unnoba-pergamino',
    title: 'Económicas en UNNOBA Pergamino | Guía para estudiantes',
    description: 'Guía para estudiantes de Económicas en UNNOBA: Contador Público, Administración, Gestión de PyMEs, Gestión Pública y servicios útiles en Pergamino.',
    h1: 'Económicas en UNNOBA Pergamino',
    intro: 'Si venís por Contador Público, Administración o tecnicaturas de gestión, organizá trámites, alojamiento, comercios y rutinas cerca de la sede.',
    appHref: '/app/comercios',
    sections: [
      { title: 'Carreras del área', body: 'Elegí UNNOBA lista Contador Público, Licenciatura en Administración, Tecnicatura en Gestión de PyMEs y Tecnicatura en Gestión Pública.' },
      { title: 'Ingreso y TAI', body: 'Para Económicas, el Taller de Articulación informa Elementos de Contabilidad e Introducción a los Estudios Universitarios como materias de ingreso.' },
    ],
    stats: [{ value: '4', label: 'carreras del área' }, { value: 'Contabilidad', label: 'TAI específico' }, { value: 'Monteagudo', label: 'referencia sede' }],
    steps: [
      { title: 'Confirmá tu carrera', body: 'Revisá materias, carga horaria y duración en Elegí UNNOBA.' },
      { title: 'Ubicá servicios', body: 'Guardá fotocopias, librerías, cafés, kioscos y comercios cerca de tu recorrido.' },
      { title: 'Organizá trámites', body: 'Tené a mano Departamento de Alumnos, documentación y calendario de inscripción.' },
    ],
    seoBlocks: [
      { title: 'Estudiar Económicas y llegar a Pergamino', body: 'Las carreras económicas suelen combinar cursada, trabajos prácticos, trámites y material de estudio. Una guía local ayuda a ubicar comercios para impresión, librerías, cafés y servicios cotidianos.' },
      { title: 'Materias de ingreso como contexto', body: 'El Taller de Articulación publica Elementos de Contabilidad para el área. Esto permite orientar contenido útil para ingresantes sin reemplazar la información oficial.' },
    ],
    faqs: [
      { q: '¿Qué carreras incluye Económicas?', a: 'Contador Público, Licenciatura en Administración, Tecnicatura en Gestión de PyMEs y Tecnicatura en Gestión Pública.' },
      { q: '¿Dónde confirmo materias?', a: 'En Elegí UNNOBA y planesdeestudio.unnoba.edu.ar.' },
    ],
  },
  {
    slug: 'juridicas-unnoba-pergamino',
    title: 'Jurídicas en UNNOBA Pergamino | Guía para Abogacía',
    description: 'Guía para estudiantes de Abogacía en UNNOBA Pergamino: ingreso, materias, trámites, comercios y alojamiento.',
    h1: 'Jurídicas en UNNOBA Pergamino',
    intro: 'Una guía para estudiantes de Abogacía que llegan a Pergamino y necesitan ordenar alojamiento, apuntes, trámites y rutina.',
    appHref: '/app/inicio',
    sections: [
      { title: 'Carrera del área', body: 'Elegí UNNOBA lista Abogacía dentro del área Jurídicas, con materias, carga horaria, duración y plan de estudio.' },
      { title: 'Ingreso', body: 'Para Jurídicas, el Taller de Articulación informa Introducción a la Teoría General del Estado e Introducción a los Estudios Universitarios.' },
    ],
    stats: [{ value: 'Abogacía', label: 'carrera jurídica' }, { value: 'TAI', label: 'ingreso' }, { value: 'Trámites', label: 'a organizar' }],
    steps: [
      { title: 'Revisá el plan', body: 'Confirmá materias, duración y requisitos en fuentes oficiales.' },
      { title: 'Armá tu base local', body: 'Ubicá librerías, fotocopias, cafés, transporte y farmacias cercanas.' },
      { title: 'Guardá referencias', body: 'Usá favoritos para comercios y alertas para alojamiento si todavía estás buscando.' },
    ],
    seoBlocks: [
      { title: 'Abogacía y rutina de estudio', body: 'Las carreras jurídicas suelen implicar lectura, material de consulta y trámites. Al llegar a Pergamino, conviene tener ubicados espacios de impresión, librerías y comercios de paso.' },
      { title: 'Información oficial y guía práctica', body: 'UNNOBA informa planes, materias y trámites; Recién Llegué complementa esa información con mapa, alojamiento, comercios y organización diaria.' },
    ],
    faqs: [
      { q: '¿Jurídicas incluye más carreras?', a: 'En la oferta consultada aparece Abogacía dentro del área Jurídicas.' },
      { q: '¿Qué materia del TAI corresponde?', a: 'La fuente oficial informa Introducción a la Teoría General del Estado más Introducción a los Estudios Universitarios.' },
    ],
  },
  {
    slug: 'salud-unnoba-pergamino',
    title: 'Salud en UNNOBA Pergamino | Enfermería y guía para estudiantes',
    description: 'Guía para estudiantes de Salud en UNNOBA Pergamino: Enfermería Universitaria, Licenciatura en Enfermería, farmacias y servicios útiles.',
    h1: 'Salud en UNNOBA Pergamino',
    intro: 'Si venís a estudiar Enfermería, organizá sede, horarios, farmacias, transporte, alojamiento y comercios antes de empezar.',
    appHref: '/app/farmacias',
    sections: [
      { title: 'Carreras de Salud', body: 'Elegí UNNOBA lista Enfermería Universitaria y Licenciatura en Enfermería dentro del Instituto Académico de Desarrollo Humano.' },
      { title: 'Ingreso y servicios', body: 'El Taller de Articulación informa Introducción a las Ciencias Básicas de la Salud e Introducción a los Estudios Universitarios para el área.' },
    ],
    stats: [{ value: '2', label: 'carreras de salud' }, { value: 'Farmacias', label: 'clave diaria' }, { value: 'Turnos', label: 'acceso rápido' }],
    steps: [
      { title: 'Confirmá cursada', body: 'Revisá plan, comisiones y aulas oficiales.' },
      { title: 'Ubicá farmacias', body: 'Tené a mano farmacias cercanas, de turno y servicios de salud.' },
      { title: 'Organizá traslados', body: 'Compará alojamiento, transporte y tiempos para llegar a la sede.' },
    ],
    seoBlocks: [
      { title: 'Estudiantes de Enfermería en Pergamino', body: 'Para estudiantes de salud, la cercanía a farmacias, transporte y servicios cotidianos puede ser tan importante como el alojamiento. Recién Llegué conecta esas necesidades con mapa y directorio local.' },
      { title: 'TAI y materias iniciales', body: 'La fuente oficial del Taller de Articulación menciona Introducción a las Ciencias Básicas de la Salud para el área Salud. El detalle vigente debe confirmarse en UNNOBA.' },
    ],
    faqs: [
      { q: '¿Qué carreras de salud aparecen?', a: 'Enfermería Universitaria y Licenciatura en Enfermería.' },
      { q: '¿Dónde veo farmacias de turno?', a: 'En /app/farmacias, con fallback a la fuente local.' },
    ],
  },
  {
    slug: 'agronomia-alimentos-genetica-unnoba-pergamino',
    title: 'Agronomía, Alimentos y Genética en UNNOBA Pergamino',
    description: 'Guía para estudiantes de Agronomía, Alimentos y Genética en UNNOBA Pergamino: sedes, materias de ingreso, comercios y alojamiento.',
    h1: 'Agronomía, Alimentos y Genética en UNNOBA Pergamino',
    intro: 'Una guía para estudiantes de ECANA que llegan a Pergamino y necesitan ubicar sede, alojamiento, transporte y servicios cotidianos.',
    appHref: '/app/mapa',
    sections: [
      { title: 'Carreras del área', body: 'Elegí UNNOBA lista Ingeniería Agronómica, Ingeniería en Alimentos, Tecnicatura Universitaria en Producción de Alimentos y Licenciatura en Genética.' },
      { title: 'Sede y trámites', body: 'La guía oficial de trámites menciona en Pergamino el edificio principal de Monteagudo 2772 y ECANA en Av. Presidente Dr. Arturo Frondizi 2650.' },
    ],
    stats: [{ value: 'ECANA', label: 'área académica' }, { value: 'Química', label: 'TAI común' }, { value: 'Mapa', label: 'sedes y comercios' }],
    steps: [
      { title: 'Confirmá tu sede', body: 'Según trámite o cursada, verificá si tenés que ir a Monteagudo o ECANA.' },
      { title: 'Planificá transporte', body: 'Compará distancias desde alojamiento y recorridos cotidianos.' },
      { title: 'Guardá comercios', body: 'Supermercados, farmacias, librerías y servicios cercanos pueden cambiar tu rutina.' },
    ],
    seoBlocks: [
      { title: 'ECANA y llegada a Pergamino', body: 'Las carreras agrarias, alimentos y genética pueden tener referencias de cursada y trámites distintas al edificio principal. Para quien llega de otra ciudad, ubicar sedes y recorridos desde el primer día evita pérdidas de tiempo.' },
      { title: 'Ingreso y materias de base', body: 'El Taller de Articulación menciona Química para Agronomía, Alimentos y Genética, además de Introducción a los Estudios Universitarios. La información exacta debe validarse en la fuente oficial.' },
    ],
    faqs: [
      { q: '¿Qué carreras incluye esta guía?', a: 'Ingeniería Agronómica, Ingeniería en Alimentos, Tecnicatura Universitaria en Producción de Alimentos y Licenciatura en Genética.' },
      { q: '¿Dónde queda ECANA?', a: 'La guía oficial de trámites menciona Av. Presidente Dr. Arturo Frondizi 2650 en Pergamino.' },
    ],
  },
  {
    slug: 'taller-articulacion-unnoba-pergamino',
    title: 'Taller de Articulación UNNOBA Pergamino 2026 | Guía para ingresantes',
    description: 'Taller de Articulación e Introducción a los Estudios Universitarios de UNNOBA Pergamino: materias por área, horarios, aulas y guía práctica.',
    h1: 'Taller de Articulación UNNOBA Pergamino',
    intro: 'El TAI es obligatorio y no eliminatorio. Esta guía resume cómo impacta en tu llegada a Pergamino y qué conviene organizar antes de cursarlo.',
    appHref: '/app/inicio',
    sections: [
      { title: 'Materias por área', body: 'La fuente oficial informa materias específicas como Química, Elementos de Contabilidad, Introducción a los algoritmos, Taller proyectual e Introducción a las Ciencias Básicas de la Salud, más Introducción a los Estudios Universitarios.' },
      { title: 'Comisiones en Pergamino', body: 'Para 2026 se publican comisiones en Monteagudo 2772 con horarios de mañana y tarde/noche según materia.' },
    ],
    stats: [{ value: 'Obligatorio', label: 'no eliminatorio' }, { value: '2026', label: 'ingresantes' }, { value: 'Monteagudo', label: 'aulas Pergamino' }],
    steps: [
      { title: 'Confirmá tu comisión', body: 'Ingresá a SIU Guaraní o a la fuente oficial para ver día, horario y aula asignada.' },
      { title: 'Calculá traslado', body: 'Ubicá tu alojamiento, colectivos, caminata o bici hacia Monteagudo 2772.' },
      { title: 'Armá recordatorios', body: 'Guardá horarios y prepará alarmas para no llegar tarde durante las primeras semanas.' },
    ],
    seoBlocks: [
      { title: 'Qué es el TAI', body: 'El Taller de Articulación e Introducción a los Estudios Universitarios acompaña el ingreso a carreras de pregrado y grado. Según la fuente oficial, no requiere inscripción aparte: se asocia a la inscripción a la carrera.' },
      { title: 'Por qué importa para Recién Llegué', body: 'El TAI marca los primeros recorridos reales del ingresante: aulas, horarios, traslados, comercios cercanos y organización semanal. Por eso es una oportunidad clara para activar mapas, favoritos, alertas y recordatorios.' },
    ],
    faqs: [
      { q: '¿El TAI es eliminatorio?', a: 'La fuente oficial lo describe como obligatorio y no eliminatorio.' },
      { q: '¿Dónde veo mi comisión?', a: 'La fuente oficial indica consultar SIU Guaraní con usuario y contraseña institucional.' },
    ],
  },
]
