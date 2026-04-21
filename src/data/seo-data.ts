

export type FAQ = { q: string; a: string };

export type ServiceBase = {
  slug: string;
  title: string;
  category: ServiceCategory;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: FAQ[];
  priceRange?: string;
  urgency?: "alta" | "media" | "baja";
  schemaType?: string;
};

export type CityData = {
  name: string;
  slug: string;
  institution: string;
  hero: {
    title: string;
    subtitle: string;
  };
  details: {
    barrios: string[];
    precioPromedio: string;
    zonasClave: string[];
  };
  services: {
    [key: string]: ServiceBase;
  };
};

export type Barrio = {
  slug: string;
  name: string;
  distanciaUNNOBA: string;
  descripcion: string;
  keywords: string[];
};

export type Modifier = {
  slug: string;
  label: string;
  extraKeywords: string[];
  extraFaqs: FAQ[];
};

export type GeneratedLanding = {
  url: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: FAQ[];
  service: ServiceBase;
  barrio?: Barrio;
  modifier?: Modifier;
  breadcrumb: { label: string; href: string }[];
  schema: LandingSchema;
};

export type LandingSchema = {
  "@type": string;
  name: string;
  description: string;
  areaServed: string;
  keywords: string;
};

export type ServiceCategory =
  | "alojamiento"
  | "transporte"
  | "gastronomia"
  | "salud"
  | "servicios"
  | "educacion"
  | "comercio";

// ─── BARRIOS ─────────────────────────────────────────────────

export const BARRIOS: Barrio[] = [
  {
    slug: "barrio-monteagudo",
    name: "Barrio Monteagudo",
    distanciaUNNOBA: "2 cuadras de la Sede Monteagudo",
    descripcion: "El barrio más cercano a la sede principal de la UNNOBA. Ideal para ingresantes.",
    keywords: ["barrio monteagudo pergamino", "cerca unnoba pergamino", "alquiler monteagudo"],
  },
  {
    slug: "barrio-centro",
    name: "Barrio Centro",
    distanciaUNNOBA: "15 minutos en colectivo a la UNNOBA",
    descripcion: "Centro urbano de Pergamino con todos los servicios a mano.",
    keywords: ["centro pergamino", "zona centro pergamino", "alquiler centro pergamino"],
  },
  {
    slug: "barrio-acevedo",
    name: "Barrio Acevedo",
    distanciaUNNOBA: "10 minutos en bici de la UNNOBA",
    descripcion: "Barrio tranquilo con buena conectividad y precios accesibles.",
    keywords: ["barrio acevedo pergamino", "alquiler acevedo", "vivir acevedo pergamino"],
  },
  {
    slug: "barrio-trocha",
    name: "Barrio Trocha",
    distanciaUNNOBA: "20 minutos en colectivo",
    descripcion: "Zona popular entre estudiantes por sus precios económicos.",
    keywords: ["barrio trocha pergamino", "alquiler trocha", "estudiantes trocha"],
  },
  {
    slug: "barrio-belgrano",
    name: "Barrio Belgrano",
    distanciaUNNOBA: "15 minutos en remis",
    descripcion: "Barrio residencial con mucha oferta de alquileres para compartir.",
    keywords: ["barrio belgrano pergamino", "alquiler belgrano pergamino"],
  },
  {
    slug: "zona-terminal",
    name: "Zona Terminal",
    distanciaUNNOBA: "Conexión directa con líneas de colectivo a la UNNOBA",
    descripcion: "Estratégica para estudiantes que viajan desde otras ciudades.",
    keywords: ["zona terminal pergamino", "cerca terminal pergamino", "hospedaje terminal"],
  },
  {
    slug: "barrio-norte",
    name: "Barrio Norte",
    distanciaUNNOBA: "25 minutos en colectivo",
    descripcion: "Barrio en crecimiento con nuevos emprendimientos de alquiler estudiantil.",
    keywords: ["barrio norte pergamino", "alquiler norte pergamino"],
  },
  {
    slug: "barrio-mariano-moreno",
    name: "Barrio Mariano Moreno",
    distanciaUNNOBA: "12 minutos en bici",
    descripcion: "Popular entre estudiantes de segundo y tercer año de la UNNOBA.",
    keywords: ["barrio mariano moreno pergamino", "alquiler mariano moreno"],
  },
];

// ─── MODIFICADORES ───────────────────────────────────────────

export const MODIFIERS: Modifier[] = [
  {
    slug: "barato",
    label: "Barato / Económico",
    extraKeywords: ["barato pergamino", "economico estudiantes", "precio bajo", "sin gastar de mas"],
    extraFaqs: [
      {
        q: "¿Cuál es la opción más barata para estudiantes en Pergamino?",
        a: "La opción más económica suele ser compartir casa, departamento o habitación. Los valores cambian rápido, por eso conviene comparar publicaciones actualizadas antes de señar.",
      },
      {
        q: "¿Se puede conseguir algo barato cerca de la UNNOBA?",
        a: "Sí, aunque cerca de la sede suele haber más demanda. Si el presupuesto es ajustado, conviene mirar zonas con buena conexión en colectivo o bici.",
      },
    ],
  },
  {
    slug: "cerca-unnoba",
    label: "Cerca de la UNNOBA",
    extraKeywords: ["cerca unnoba", "a pasos de la facultad", "frente a unnoba", "zona universitaria"],
    extraFaqs: [
      {
        q: "¿Qué barrio está más cerca de la UNNOBA?",
        a: "El Barrio Monteagudo es el más cercano, a 2 cuadras de la Sede Monteagudo.",
      },
    ],
  },
  {
    slug: "para-ingresantes",
    label: "Para Ingresantes 2026",
    extraKeywords: ["ingresante unnoba 2026", "primer año universidad", "recien llegado pergamino"],
    extraFaqs: [
      {
        q: "¿Qué necesita saber un ingresante antes de mudarse a Pergamino?",
        a: "Conviene llegar al menos 2 semanas antes del inicio de clases para asegurar alojamiento. Usá la app Recién Llegué para encontrar opciones verificadas.",
      },
      {
        q: "¿Hay acompañamiento para ingresantes en Pergamino?",
        a: "La UNNOBA informa programas de becas, tutorías y orientación y acompañamiento para estudiantes. Conviene consultar los canales oficiales al momento de inscribirse.",
      },
    ],
  },
  {
    slug: "sin-garantia",
    label: "Sin Garantía",
    extraKeywords: ["alquiler sin garantia pergamino", "sin garante", "sin aval"],
    extraFaqs: [
      {
        q: "¿Se puede alquilar sin garantía en Pergamino?",
        a: "Depende de cada propietario o inmobiliaria. Algunas operaciones aceptan seguro de caución u otras garantías, pero hay que confirmarlo antes de avanzar.",
      },
    ],
  },
  {
    slug: "dueno-directo",
    label: "Dueño Directo",
    extraKeywords: ["dueno directo pergamino", "sin inmobiliaria", "alquiler directo"],
    extraFaqs: [
      {
        q: "¿Es más barato alquilar directamente con el dueño?",
        a: "Puede reducir costos de intermediación, pero lo importante es revisar contrato, depósito, actualización, servicios incluidos y estado real del inmueble.",
      },
    ],
  },
  {
    slug: "2026",
    label: "Precios 2026",
    extraKeywords: ["2026 pergamino", "precios actualizados 2026", "tarifas 2026"],
    extraFaqs: [
      {
        q: "¿Cuánto cuesta alquilar en Pergamino en 2026?",
        a: "Como referencia de publicaciones locales recientes, un monoambiente céntrico puede ubicarse alrededor de $250.000 y departamentos más amplios superar ese valor. Verificá siempre publicaciones vigentes.",
      },
    ],
  },
];

// ─── SERVICIOS BASE (25 categorías) ──────────────────────────

export const SERVICES: ServiceBase[] = [
  // ── ALOJAMIENTO ──────────────────────────────────────────
  {
    slug: "alojamiento-estudiantes",
    category: "alojamiento",
    title: "Alojamiento para Estudiantes",
    metaTitle: "Alojamiento para Estudiantes en Pergamino 2026 | Recién Llegué",
    metaDescription: "¿Dónde vivir estudiando en la UNNOBA? Compará pensiones, departamentos y habitaciones en Pergamino con referencias actualizadas. → Unite a Recién Llegué gratis.",
    h1: "Alojamiento para Estudiantes en Pergamino",
    intro: "Si vas a estudiar en la UNNOBA, encontrar alojamiento es el primer paso. En Pergamino hay opciones para todos los presupuestos: pensiones con todo incluido, departamentos para compartir y habitaciones amuebladas cerca de la facultad. Esta guía te ayuda a comparar cada opción antes de decidir.",
    keywords: ["alojamiento estudiantes pergamino", "donde vivir pergamino unnoba", "donde dormir pergamino estudiante", "vivir en pergamino unnoba 2026"],
    priceRange: "Consultar valores actualizados",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Cuánto cuesta alojamiento para estudiantes en Pergamino?", a: "Depende del tipo de alojamiento, ubicación y servicios incluidos. Para alquiler individual, las publicaciones locales recientes muestran monoambientes desde alrededor de $250.000, mientras que compartir suele bajar el costo por persona." },
      { q: "¿Cuándo tengo que buscar alojamiento para la UNNOBA?", a: "Lo ideal es empezar la búsqueda en noviembre-diciembre para asegurar lugar antes del inicio de clases en marzo." },
      { q: "¿La UNNOBA orienta sobre alojamiento?", a: "La UNNOBA ha trabajado con áreas de bienestar y registros de alojamiento para orientar a estudiantes. Conviene consultar los canales oficiales y contrastar con opciones actualizadas en la ciudad." },
    ],
  },
  {
    slug: "alquiler-estudiantes",
    category: "alojamiento",
    title: "Alquileres para Estudiantes",
    metaTitle: "Alquiler para Estudiantes en Pergamino 2026 | Sin Inmobiliaria",
    metaDescription: "Alquilá un departamento o casa en Pergamino como estudiante de la UNNOBA: requisitos, contratos, garantías y precios 2026. → Registrate en Recién Llegué.",
    h1: "Alquiler para Estudiantes en Pergamino",
    intro: "El mercado de alquiler para estudiantes en Pergamino tiene opciones desde monoambientes hasta casas para compartir entre 3 o 4 estudiantes, lo que reduce mucho el costo individual. Entender los requisitos y el contrato de antemano te ahorra sorpresas.",
    keywords: ["alquiler estudiantes pergamino", "departamentos alquiler pergamino", "alquilar en pergamino sin garantia", "contrato alquiler estudiante pergamino"],
    priceRange: "$250k+ alquiler individual; menos compartiendo",
    urgency: "alta",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Qué requisitos piden para alquilar en Pergamino?", a: "Suelen pedir DNI, ingresos o garantía y, en algunos casos, certificado de alumno regular. Los requisitos cambian según dueño o inmobiliaria." },
      { q: "¿Cuántos meses de depósito piden?", a: "Lo habitual es negociar depósito y primer mes por adelantado, pero hay que revisar cada contrato antes de señar." },
      { q: "¿Hay alquileres temporarios para el año lectivo?", a: "Existen opciones temporarias o acuerdos por ciclo lectivo, especialmente para estudiantes. Confirmá duración, actualización y servicios incluidos." },
    ],
  },
  {
    slug: "pensiones-estudiantiles",
    category: "alojamiento",
    title: "Pensiones Estudiantiles",
    metaTitle: "Pensiones Estudiantiles en Pergamino 2026 | Todo Incluido",
    metaDescription: "Pensiones con servicios incluidos para ingresantes de la UNNOBA en Pergamino. Compará ubicación, convivencia y condiciones. → Encontrá opciones en Recién Llegué.",
    h1: "Pensiones Estudiantiles en Pergamino",
    intro: "Las pensiones estudiantiles son la opción preferida para el primer año: comidas, WiFi y limpieza incluidos en una sola cuota mensual. Son ideales si llegás por primera vez a Pergamino y querés concentrarte en arrancar la facultad sin preocuparte por cocinar o limpiar.",
    keywords: ["pensiones pergamino", "pension con comida pergamino", "pension todo incluido unnoba", "pension ingresante pergamino unnoba"],
    priceRange: "Consultar según servicios incluidos",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Qué incluye una pensión estudiantil en Pergamino?", a: "Depende de cada lugar. Algunas incluyen WiFi, limpieza o comidas; otras solo habitación y espacios comunes." },
      { q: "¿Es mejor una pensión que un departamento?", a: "Para ingresantes puede ser más simple por convivencia y servicios resueltos, pero conviene comparar reglas, ubicación y costo total." },
      { q: "¿Las pensiones tienen contrato?", a: "Las condiciones varían. Antes de entrar, pedí por escrito precio, depósito, servicios incluidos, reglas de convivencia y plazo mínimo." },
    ],
  },
  {
    slug: "departamentos-monoambiente",
    category: "alojamiento",
    title: "Departamentos Monoambiente",
    metaTitle: "Departamentos Monoambiente en Pergamino para Estudiantes 2026",
    metaDescription: "Monoambientes amueblados en alquiler en Pergamino para estudiantes de la UNNOBA. Referencias 2026 y zonas clave. → Sumate a Recién Llegué.",
    h1: "Departamentos Monoambiente para Estudiantes en Pergamino",
    intro: "Un monoambiente es la opción de mayor independencia para el estudiante universitario: tu propio espacio, tus tiempos y sin convivencia forzada. En Pergamino encontrás opciones amuebladas listas para mudarse en distintas zonas de la ciudad.",
    keywords: ["monoambiente pergamino", "departamento monoambiente amueblado pergamino", "alquiler monoambiente pergamino 2026", "vivir solo pergamino unnoba"],
    priceRange: "$250k - $400k+/mes como referencia publicada",
    urgency: "media",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Cuánto cuesta un monoambiente en Pergamino en 2026?", a: "Publicaciones locales recientes muestran monoambientes céntricos alrededor de $250.000 y departamentos de mayor tamaño por encima de ese valor. Tomalo como referencia y verificá disponibilidad actual." },
      { q: "¿Los monoambientes incluyen servicios?", a: "No siempre. Revisá si el precio incluye expensas, tasas, agua, gas, luz, internet y condiciones de actualización." },
    ],
  },
  {
    slug: "habitaciones-compartidas",
    category: "alojamiento",
    title: "Habitaciones Compartidas",
    metaTitle: "Habitaciones Compartidas en Pergamino 2026 | Para Estudiantes",
    metaDescription: "Compartí casa o depto con otros estudiantes de la UNNOBA en Pergamino. La opción más económica suele ser dividir gastos. → Encontrá compañeros en Recién Llegué.",
    h1: "Habitaciones Compartidas para Estudiantes en Pergamino",
    intro: "Compartir casa o departamento con otros estudiantes reduce el gasto a menos de la mitad respecto a un monoambiente individual. Es la opción más popular entre quienes priorizan el bolsillo sin sacrificar ubicación cerca de la UNNOBA.",
    keywords: ["habitaciones compartidas pergamino", "compañero de cuarto unnoba pergamino", "compartir departamento pergamino estudiantes", "busco roommate pergamino"],
    priceRange: "Menor costo por persona al compartir",
    urgency: "alta",
    schemaType: "Accommodation",
    faqs: [
      { q: "¿Cómo encuentro compañeros para compartir en Pergamino?", a: "Podés usar grupos de Facebook de la UNNOBA, el mural de Bienestar Estudiantil, o la app Recién Llegué." },
      { q: "¿Cuánto ahorro al compartir?", a: "El ahorro depende del alquiler total y los servicios. Dividir entre dos, tres o cuatro personas suele bajar mucho el costo frente a vivir solo." },
    ],
  },
  {
    slug: "residencias-universitarias",
    category: "alojamiento",
    title: "Residencias Universitarias",
    metaTitle: "Residencias Universitarias en Pergamino | Cerca de la UNNOBA",
    metaDescription: "Residencias privadas para universitarios en Pergamino: sala de estudio, WiFi rápido, seguridad y comunidad. Pensadas para rendir más. → Registrate gratis.",
    h1: "Residencias Universitarias en Pergamino",
    intro: "Las residencias universitarias privadas en Pergamino están diseñadas para estudiantes que quieren más que un cuarto: internet de alta velocidad, espacios de estudio comunes, lavandería y una comunidad de compañeros en la misma situación.",
    keywords: ["residencia universitaria pergamino", "residencia estudiantil privada pergamino", "residencia con sala de estudio pergamino", "residencia unnoba 2026"],
    priceRange: "Consultar disponibilidad y servicios",
    urgency: "media",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Qué diferencia una residencia universitaria de una pensión?", a: "Las residencias suelen tener más servicios (sala de estudio, lavandería, seguridad 24hs) y una comunidad más activa." },
    ],
  },
  {
    slug: "hospedaje-urgente",
    category: "alojamiento",
    title: "Hospedaje Urgente para Estudiantes",
    metaTitle: "Hospedaje Urgente en Pergamino | Para Estudiantes UNNOBA",
    metaDescription: "¿Llegaste a Pergamino sin alojamiento? Hospedaje por noche o semana mientras resolvés tu situación. → Recién Llegué te orienta.",
    h1: "Hospedaje Urgente en Pergamino para Estudiantes",
    intro: "Si llegaste a Pergamino y todavía no tenés alojamiento fijo, hay opciones por noche, por semana o por mes para instalarte mientras resolvés tu situación. Es la solución ideal para las primeras semanas de clases.",
    keywords: ["hospedaje urgente pergamino", "alojamiento por día pergamino estudiante", "donde quedarme hoy pergamino", "hostel pergamino unnoba"],
    priceRange: "Consultar tarifa diaria o semanal",
    urgency: "alta",
    schemaType: "LodgingBusiness",
    faqs: [
      { q: "¿Hay hostels en Pergamino?", a: "Hay algunos hospedajes económicos que aceptan estadías cortas. Desde Recién Llegué te podemos orientar." },
      { q: "¿Por cuánto tiempo puedo quedarme en un hospedaje urgente?", a: "Depende de cada alojamiento. Preguntá por tarifa diaria, semanal o mensual y por la disponibilidad en época de inicio de clases." },
    ],
  },

  // ── TRANSPORTE ────────────────────────────────────────────
  {
    slug: "remis-24hs",
    category: "transporte",
    title: "Remises 24hs",
    metaTitle: "Remises en Pergamino 24 Horas | Números y Contactos",
    metaDescription: "Agencias de remis en Pergamino con servicio 24hs. Contactos por zona, traslados y consejos para moverte al llegar. → Accedé al directorio en Recién Llegué.",
    h1: "Remises en Pergamino 24 Horas",
    intro: "En Pergamino funcionan varias agencias de remises con servicio las 24 horas, ideales para traslados nocturnos, llegadas a la terminal o viajes a la sede universitaria en Junín. Tener los números a mano te salva en más de una ocasión.",
    keywords: ["remises pergamino", "remis 24hs pergamino", "agencias remis pergamino 2026", "remis pergamino junin"],
    priceRange: "Consultar tarifa vigente",
    urgency: "alta",
    schemaType: "TaxiService",
    faqs: [
      { q: "¿Cuánto cuesta un remis interno en Pergamino?", a: "La tarifa cambia por distancia, horario y agencia. Pedí precio estimado antes de confirmar el viaje." },
      { q: "¿Hay remises a Junín desde Pergamino?", a: "Algunas agencias realizan traslados interurbanos o viajes programados. Conviene consultar disponibilidad y costo con anticipación." },
      { q: "¿Es seguro el remis nocturno en Pergamino?", a: "Usá agencias identificadas, compartí el viaje con alguien de confianza y confirmá datos del móvil antes de subir." },
    ],
  },
  {
    slug: "colectivos-urbanos",
    category: "transporte",
    title: "Colectivos Urbanos",
    metaTitle: "Colectivos Urbanos en Pergamino | Ramales, Paradas y App",
    metaDescription: "Colectivos urbanos en Pergamino: ramales A, B, C, D, E, Parque Industrial, recorridos IDE y app ¿Cuándo llega? → Descubrí más en Recién Llegué.",
    h1: "Colectivos Urbanos en Pergamino — Guía Completa",
    intro: "El transporte urbano de Pergamino funciona con ramales que conectan barrios, centro, terminal y zonas clave. Las fuentes municipales informan ramales A, B, C, D, E y servicios como Parque Industrial; los recorridos pueden consultarse en IDE Pergamino y con la app local ¿Cuándo llega?.",
    keywords: ["colectivos pergamino", "ramales A B C D E pergamino", "cuando llega pergamino", "la nueva perla pergamino", "IDE pergamino colectivos", "boleto universitario pergamino unnoba"],
    priceRange: "Consultar boleto vigente",
    urgency: "media",
    schemaType: "BusStop",
    faqs: [
      { q: "¿Qué colectivo va a la UNNOBA?", a: "Depende desde qué zona salgas. Revisá el recorrido vigente en IDE Pergamino o en la app ¿Cuándo llega? antes de viajar." },
      { q: "¿Dónde veo los recorridos actualizados?", a: "La Municipalidad publica capas de movilidad urbana en IDE Pergamino y la app ¿Cuándo llega? permite consultar paradas y tiempos de arribo." },
      { q: "¿Hay descuento universitario?", a: "Puede haber beneficios o becas de transporte vinculadas a la vida universitaria. Confirmá requisitos vigentes en los canales oficiales de UNNOBA o municipio." },
    ],
  },
  {
    slug: "tarifas-transporte",
    category: "transporte",
    title: "Tarifas de Transporte",
    metaTitle: "Tarifas de Transporte en Pergamino | Colectivos y Remises",
    metaDescription: "Cómo estimar gastos de colectivo, remis y traslados Pergamino-Junín. Planificá tu presupuesto mensual con datos vigentes. → Recién Llegué te ayuda.",
    h1: "Tarifas de Transporte en Pergamino 2026",
    intro: "Los costos de transporte cambian con frecuencia. Para planificar tu presupuesto mensual, conviene separar viajes en colectivo, remises ocasionales, traslados interurbanos y beneficios universitarios disponibles.",
    keywords: ["tarifas transporte pergamino 2026", "cuanto cuesta colectivo pergamino", "precio remis pergamino 2026", "cuanto sale ir pergamino junin"],
    priceRange: "Consultar tarifas vigentes",
    urgency: "media",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Cuánto cuesta el boleto de colectivo en Pergamino?", a: "La tarifa puede actualizarse. Consultá el valor vigente en canales municipales, puntos SUBE o información de la empresa prestataria." },
      { q: "¿Cuánto sale ir de Pergamino a Junín?", a: "Depende del medio, horario y si el viaje es compartido. Pedí precio actualizado antes de organizar traslados entre sedes." },
    ],
  },
  {
    slug: "bicicletas-alquiler",
    category: "transporte",
    title: "Bicicletas en Alquiler",
    metaTitle: "Alquiler de Bicicletas en Pergamino | Para Estudiantes UNNOBA",
    metaDescription: "Alquilá una bicicleta en Pergamino por mes para ir a la UNNOBA. La forma más económica y rápida de moverte por la ciudad. → Unite a Recién Llegué.",
    h1: "Alquiler de Bicicletas para Estudiantes en Pergamino",
    intro: "La bicicleta es una de las formas más eficientes y económicas de moverse en Pergamino. Varios locales y emprendimientos ofrecen alquiler mensual pensado para estudiantes, con tarifas mucho menores al remis o al colectivo.",
    keywords: ["alquiler bicicletas pergamino", "bicicleta mensual estudiante pergamino", "bici para ir a la unnoba", "ciclovias pergamino"],
    priceRange: "Consultar alquiler o compra usada",
    urgency: "baja",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Es seguro ir en bici a la UNNOBA?", a: "Puede ser una buena opción si vivís relativamente cerca. Usá casco, luces, candado y elegí calles o ciclovías con circulación segura." },
    ],
  },

  // ── SERVICIOS COTIDIANOS ──────────────────────────────────
  {
    slug: "fotocopiadora-libreria",
    category: "educacion",
    title: "Fotocopiadoras y Librerías",
    metaTitle: "Fotocopiadoras Cerca de la UNNOBA Pergamino | Apuntes 2026",
    metaDescription: "Fotocopiadoras y librerías cerca de la UNNOBA en Pergamino: impresión de apuntes, encuadernados y materiales universitarios 2026. → Recién Llegué te guía.",
    h1: "Fotocopiadoras y Librerías Cerca de la UNNOBA Pergamino",
    intro: "Imprimir apuntes, encuadernar trabajos prácticos y comprar útiles son parte de la vida universitaria. Acá te contamos dónde encontrar los mejores precios y los horarios extendidos cerca de la facultad, especialmente en época de parciales.",
    keywords: ["fotocopiadora unnoba pergamino", "imprimir apuntes pergamino", "libreria cerca unnoba pergamino", "encuadernado pergamino universitario"],
    priceRange: "Consultar precio por hoja y encuadernado",
    urgency: "alta",
    schemaType: "Store",
    faqs: [
      { q: "¿Hay fotocopiadoras abiertas a la noche en Pergamino?", a: "Algunos locales pueden extender horarios en época de parciales, pero conviene confirmar antes de ir." },
      { q: "¿Se puede encargar apuntes en formato digital?", a: "Sí, varios locales ofrecen el servicio de imprimir a partir de archivos PDF enviados por WhatsApp." },
    ],
  },
  {
    slug: "lavanderia",
    category: "servicios",
    title: "Lavanderías",
    metaTitle: "Lavanderías en Pergamino para Estudiantes | Precios 2026",
    metaDescription: "Lavanderías cerca de la UNNOBA en Pergamino: lavado, secado por kilo y entrega en el día según disponibilidad. → Encontrá la más cercana.",
    h1: "Lavanderías para Estudiantes en Pergamino",
    intro: "Si tu alojamiento no tiene lavarropas, las lavanderías de Pergamino ofrecen servicio por kilo con entrega en el mismo día o al siguiente. Conocé las más convenientes para estudiantes y los precios actualizados para 2026.",
    keywords: ["lavanderia pergamino", "lavado ropa por kilo pergamino", "lavanderia cerca unnoba pergamino", "laverap pergamino estudiante"],
    priceRange: "Consultar precio por kilo",
    urgency: "baja",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Cuánto sale el lavado en lavandería en Pergamino?", a: "El valor depende del servicio por kilo, secado, planchado y urgencia. Preguntá si hay mínimo de kilos y plazo de entrega." },
    ],
  },
  {
    slug: "internet-wifi",
    category: "servicios",
    title: "Internet y WiFi",
    metaTitle: "Internet para Estudiantes en Pergamino | Proveedores y Precios 2026",
    metaDescription: "Comparativa de proveedores de internet en Pergamino 2026: fibra óptica, velocidades y precios para contratar en tu alojamiento. → Recién Llegué te guía.",
    h1: "Internet para Estudiantes en Pergamino",
    intro: "Una buena conexión a internet es esencial para estudiar, hacer trabajos prácticos y videoconferencias. En Pergamino hay varias opciones de proveedores con buena cobertura cerca de la UNNOBA. Te ayudamos a comparar antes de contratar.",
    keywords: ["internet pergamino estudiantes", "proveedores internet pergamino 2026", "contratar fibra optica pergamino", "wifi para alquiler pergamino"],
    priceRange: "Consultar plan y cobertura",
    urgency: "alta",
    schemaType: "LocalBusiness",
    faqs: [
      { q: "¿Qué proveedor de internet es mejor en Pergamino?", a: "Depende de la cobertura por barrio. Antes de contratar, pedí disponibilidad exacta por dirección y velocidad real ofrecida." },
      { q: "¿El WiFi suele estar incluido en los alquileres?", a: "En pensiones y residencias sí. En alquileres de departamentos generalmente va aparte." },
    ],
  },
  {
    slug: "supermercado-economico",
    category: "comercio",
    title: "Supermercados Económicos",
    metaTitle: "Supermercados Baratos en Pergamino para Estudiantes 2026",
    metaDescription: "Supermercados económicos, almacenes y ferias en Pergamino para estudiantes: ubicaciones, horarios y formas de ahorrar. → Recién Llegué.",
    h1: "Supermercados Económicos para Estudiantes en Pergamino",
    intro: "Hacer una buena compra semanal es clave para mantener el presupuesto universitario. En Pergamino hay supermercados de bajo costo, almacenes de barrio y ferias que ayudan a estirar el dinero, especialmente cerca de la UNNOBA.",
    keywords: ["supermercado barato pergamino", "donde hacer las compras pergamino estudiante", "feria barrial pergamino", "almacen cerca unnoba pergamino"],
    priceRange: "Variable según compra semanal",
    urgency: "media",
    schemaType: "GroceryStore",
    faqs: [
      { q: "¿Hay descuentos para estudiantes en supermercados de Pergamino?", a: "Puede haber promociones bancarias, billeteras virtuales o descuentos por día. Revisá condiciones vigentes antes de comprar." },
    ],
  },
  {
    slug: "gym-deporte",
    category: "salud",
    title: "Gimnasios y Deporte",
    metaTitle: "Gimnasios en Pergamino para Estudiantes | Precios 2026",
    metaDescription: "Gimnasios y actividades deportivas en Pergamino cerca de la UNNOBA. Opciones privadas y propuestas universitarias según disponibilidad. → Registrate.",
    h1: "Gimnasios para Estudiantes en Pergamino",
    intro: "Hacer deporte ayuda a manejar el estrés universitario. Pergamino tiene varios gimnasios con cuota estudiantil especial, y la UNNOBA ofrece actividades físicas gratuitas para sus alumnos a través de Bienestar Estudiantil.",
    keywords: ["gimnasio pergamino estudiantes", "gym cuota estudiantil pergamino", "deporte gratis unnoba pergamino", "actividad fisica pergamino universitario"],
    priceRange: "Consultar cuota vigente",
    urgency: "baja",
    schemaType: "SportsActivityLocation",
    faqs: [
      { q: "¿La UNNOBA tiene actividades deportivas?", a: "La UNNOBA publica propuestas de extensión, bienestar y actividades para estudiantes. Conviene revisar la oferta vigente por período." },
      { q: "¿Hay descuento estudiantil en gimnasios de Pergamino?", a: "Algunos gimnasios pueden ofrecer promociones para estudiantes, pero depende de cada local y del momento del año." },
    ],
  },
  {
    slug: "farmacia",
    category: "salud",
    title: "Farmacias de Turno",
    metaTitle: "Farmacias de Turno en Pergamino | 24hs y Cerca de la UNNOBA",
    metaDescription: "¿Necesitás medicamentos de urgencia en Pergamino? Farmacias de turno 24hs cerca de la UNNOBA. Cómo consultar el turno actualizado. → Recién Llegué.",
    h1: "Farmacias de Turno en Pergamino",
    intro: "Saber dónde está la farmacia de turno es fundamental cuando llegás a una ciudad nueva. En Pergamino el sistema de farmacias de turno garantiza atención las 24 horas en todos los barrios, con rotación diaria.",
    keywords: ["farmacia turno pergamino", "farmacia 24hs pergamino", "farmacia cerca unnoba pergamino", "donde comprar remedios urgente pergamino"],
    priceRange: "Sin cargo de consulta",
    urgency: "alta",
    schemaType: "Pharmacy",
    faqs: [
      { q: "¿Cómo sé qué farmacia está de turno en Pergamino?", a: "Consultá fuentes locales actualizadas, cartelería de farmacias o canales oficiales del colegio profesional correspondiente antes de trasladarte." },
    ],
  },
  {
    slug: "banco-cajero",
    category: "servicios",
    title: "Bancos y Cajeros Automáticos",
    metaTitle: "Bancos y Cajeros Automáticos en Pergamino | Mapa 2026",
    metaDescription: "Cajeros automáticos y bancos en Pergamino cerca de la UNNOBA: Banco Nación, Provincia y redes Link 2026. Sin esperar. → Encontrá el más cercano.",
    h1: "Bancos y Cajeros en Pergamino",
    intro: "Los trámites bancarios y la extracción de efectivo son necesidades frecuentes, especialmente cuando cobrás tu beca o cuota universitaria. Acá mapeamos las sucursales y cajeros más convenientes para estudiantes de la UNNOBA.",
    keywords: ["banco pergamino", "cajero automatico pergamino", "ATM cerca unnoba pergamino", "banco nacion pergamino estudiante"],
    priceRange: "Sin costo en cajeros propios",
    urgency: "media",
    schemaType: "BankOrCreditUnion",
    faqs: [
      { q: "¿Hay cajeros del Banco Nación en Pergamino?", a: "Sí, hay varias sucursales del Banco Nación y cajeros distribuidos en el centro y zonas comerciales." },
    ],
  },
  {
    slug: "comida-universitaria",
    category: "gastronomia",
    title: "Comida Cerca de la Facultad",
    metaTitle: "Dónde Comer Cerca de la UNNOBA Pergamino | Opciones 2026",
    metaDescription: "Lugares para almorzar cerca de la UNNOBA en Pergamino: menú del día, viandas y opciones económicas para estudiantes. → Registrate.",
    h1: "Dónde Comer Cerca de la UNNOBA en Pergamino",
    intro: "Comer bien sin gastar de más es posible cerca de la facultad. Pergamino tiene varios restaurantes, rotiserías y cantinas con menú estudiantil a precios accesibles, ideales para el descanso del mediodía entre clases.",
    keywords: ["donde comer cerca unnoba pergamino", "menu del dia pergamino estudiante", "almuerzo barato unnoba pergamino", "rotiseria cerca facultad pergamino"],
    priceRange: "Consultar menú del día",
    urgency: "alta",
    schemaType: "FoodEstablishment",
    faqs: [
      { q: "¿Hay becas o ayuda para comedor en la UNNOBA?", a: "La UNNOBA informa un Programa Integral de Becas que contempla opciones como comedor, transporte, bibliografía y conectividad. Consultá requisitos vigentes." },
      { q: "¿Qué es más barato, cocinar o comer afuera en Pergamino?", a: "Cocinar suele rendir más, pero los menús del día y viandas pueden resolver jornadas largas de cursada si comparás precios y porciones." },
    ],
  },
  {
    slug: "delivery-pergamino",
    category: "gastronomia",
    title: "Delivery en Pergamino",
    metaTitle: "Delivery en Pergamino | Apps y Locales con Envío a Domicilio 2026",
    metaDescription: "Pedí comida a domicilio en Pergamino: PedidosYa, locales con WhatsApp propio y precios de envío 2026. Perfecto para noche de parciales. → Recién Llegué.",
    h1: "Delivery en Pergamino para Estudiantes",
    intro: "En los días de estudio intenso, parciales o cuando simplemente no querés salir, el delivery es la solución. Pergamino tiene cobertura de PedidosYa y muchos locales con envío propio vía WhatsApp a precios razonables.",
    keywords: ["delivery pergamino", "pedidosya pergamino", "comida a domicilio pergamino", "delivery barato pergamino estudiante"],
    priceRange: "Consultar costo de envío",
    urgency: "media",
    schemaType: "FoodEstablishment",
    faqs: [
      { q: "¿Funcionan apps de delivery en Pergamino?", a: "La cobertura puede variar por zona y horario. Además de apps, muchos comercios trabajan con WhatsApp o envío propio." },
    ],
  },
  {
    slug: "psicologia-bienestar",
    category: "salud",
    title: "Psicología y Bienestar Estudiantil",
    metaTitle: "Psicólogos y Bienestar Estudiantil en Pergamino | UNNOBA",
    metaDescription: "Salud mental para estudiantes de la UNNOBA en Pergamino: psicólogos gratuitos, talleres y contención emocional. Estudiar está bueno; estar bien, más. → Registrate.",
    h1: "Psicología y Bienestar Estudiantil en Pergamino",
    intro: "El estrés universitario es real, especialmente el primer año lejos de casa. La UNNOBA informa un Programa de Orientación y Acompañamiento a Estudiantes, con abordaje académico y personal, y Pergamino también cuenta con profesionales privados para acompañar el proceso.",
    keywords: ["psicologo pergamino estudiantes", "salud mental unnoba pergamino", "bienestar estudiantil unnoba", "psicologia gratis universidad pergamino"],
    priceRange: "Orientación UNNOBA / consulta privada según profesional",
    urgency: "alta",
    schemaType: "MedicalBusiness",
    faqs: [
      { q: "¿La UNNOBA tiene orientación para estudiantes?", a: "Sí. La universidad informa un Programa de Orientación y Acompañamiento a Estudiantes con profesionales de psicología y psicopedagogía." },
    ],
  },
  {
    slug: "seguro-inquilino",
    category: "servicios",
    title: "Seguro de Caución para Alquileres",
    metaTitle: "Seguro de Caución para Alquilar en Pergamino 2026 | Sin Garante",
    metaDescription: "Alquilá sin garante en Pergamino con un seguro de caución: cómo tramitarlo, cuánto cuesta y qué propietarios lo aceptan 2026. → Recién Llegué te orienta.",
    h1: "Seguro de Caución para Alquilar en Pergamino",
    intro: "No tener garante ya no es un obstáculo para alquilar. El seguro de caución es el reemplazo legal aceptado por la mayoría de los propietarios en Pergamino y se tramita online en pocas horas.",
    keywords: ["seguro caucion pergamino", "alquilar sin garante pergamino estudiante", "seguro de caucion para alquiler pergamino", "garantia alternativa alquiler pergamino"],
    priceRange: "Cotización según alquiler y aseguradora",
    urgency: "alta",
    schemaType: "InsuranceAgency",
    faqs: [
      { q: "¿Cuánto cuesta un seguro de caución en Pergamino?", a: "Depende del valor del alquiler, perfil del solicitante, plazo y aseguradora. Pedí cotización formal antes de firmar." },
      { q: "¿Todos los propietarios aceptan seguro de caución?", a: "No siempre. Confirmalo con el dueño o inmobiliaria antes de iniciar la operación." },
    ],
  },
  {
    slug: "mudanza-flete",
    category: "servicios",
    title: "Fletes y Mudanzas",
    metaTitle: "Fletes y Mudanzas en Pergamino 2026 | Para Estudiantes",
    metaDescription: "Fletes económicos para mudarte en Pergamino: traslado de muebles y cajas. Ideal para cambiar de alojamiento entre cuatrimestres. → Registrate.",
    h1: "Fletes y Mudanzas para Estudiantes en Pergamino",
    intro: "Para llevar tus cosas al nuevo alojamiento o cambiarte de lugar en Pergamino, hay servicios de flete accesibles con buenos precios para estudiantes. Es común cambiar de alojamiento entre cuatrimestres, y tener un flete confiable hace la diferencia.",
    keywords: ["flete pergamino estudiante", "mudanza economica pergamino 2026", "transporte muebles pergamino", "flete para cambio alquiler pergamino"],
    priceRange: "Presupuesto según distancia y volumen",
    urgency: "baja",
    schemaType: "MovingCompany",
    faqs: [
      { q: "¿Cuánto cuesta un flete dentro de Pergamino?", a: "Depende de distancia, cantidad de bultos, piso, ayudantes y horario. Pedí presupuesto detallado antes de confirmar." },
    ],
  },
  {
    slug: "veterinaria",
    category: "salud",
    title: "Veterinarias",
    metaTitle: "Veterinarias en Pergamino | Para Estudiantes con Mascotas 2026",
    metaDescription: "Clínicas veterinarias en Pergamino con atención de urgencias, consultas accesibles y guardia nocturna. Para estudiantes que viajan con su mascota. → Recién Llegué.",
    h1: "Veterinarias en Pergamino",
    intro: "Si estudiás en Pergamino y tenés una mascota, es fundamental saber dónde acudir ante una urgencia. Pergamino tiene varias clínicas veterinarias bien equipadas, incluyendo algunas con guardia nocturna.",
    keywords: ["veterinaria pergamino", "clinica veterinaria pergamino urgencia", "veterinaria guardia nocturna pergamino", "vet barato pergamino estudiante"],
    priceRange: "Consultar consulta y guardia",
    urgency: "media",
    schemaType: "VeterinaryCare",
    faqs: [
      { q: "¿Hay veterinarias de urgencias en Pergamino?", a: "Algunas veterinarias pueden atender urgencias o derivar a guardias. Confirmá teléfono, horario y disponibilidad antes de salir." },
    ],
  },
  {
    slug: "fotocopia-carnet",
    category: "servicios",
    title: "Foto Carnet y Trámites",
    metaTitle: "Foto Carnet y Trámites para Estudiantes en Pergamino 2026",
    metaDescription: "¿Ingresás a la UNNOBA? Dónde sacarte foto carnet, imprimir documentación y resolver trámites universitarios en Pergamino. → Recién Llegué te ayuda.",
    h1: "Foto Carnet y Trámites Universitarios en Pergamino",
    intro: "Al ingresar a la UNNOBA podés necesitar foto carnet, impresiones, certificados y documentación para trámites académicos. Te orientamos para resolverlos en Pergamino sin perder tiempo.",
    keywords: ["foto carnet pergamino unnoba", "tramites ingresante pergamino", "certificado alumno regular unnoba pergamino", "documentacion unnoba pergamino"],
    priceRange: "Consultar según trámite",
    urgency: "media",
    schemaType: "GovernmentOffice",
    faqs: [
      { q: "¿Dónde me saco la foto carnet para la UNNOBA en Pergamino?", a: "Hay estudios fotográficos cerca de la sede Monteagudo. También podés sacarla en algunas fotocopiadoras." },
    ],
  },
];

// ─── GENERADOR DE LANDINGS ────────────────────────────────────

function buildSchema(title: string, description: string, keywords: string[]): LandingSchema {
  return {
    "@type": "LocalBusiness",
    name: title,
    description: description,
    areaServed: "Pergamino, Buenos Aires, Argentina",
    keywords: keywords.join(", "),
  };
}

export function generateAllLandings(): GeneratedLanding[] {
  const landings: GeneratedLanding[] = [];

  // 1. LANDINGS BASE (25 páginas) — /pergamino/[slug]
  for (const service of SERVICES) {
    landings.push({
      url: `/pergamino/${service.slug}`,
      slug: service.slug,
      title: `${service.title} en Pergamino`,
      metaTitle: service.metaTitle,
      metaDescription: service.metaDescription,
      h1: service.h1,
      intro: service.intro,
      keywords: [
        ...service.keywords,
        `${service.slug} pergamino`,
        `${service.slug} unnoba`,
      ],
      faqs: service.faqs,
      service,
      breadcrumb: [
        { label: "Inicio", href: "/" },
        { label: "Pergamino", href: "/pergamino" },
        { label: service.title, href: `/pergamino/${service.slug}` },
      ],
      schema: buildSchema(service.metaTitle, service.metaDescription, service.keywords),
    });
  }

  // 2. LANDINGS POR BARRIO (25 × 8 = 200 páginas) — /pergamino/[slug]/[barrio]
  for (const service of SERVICES) {
    for (const barrio of BARRIOS) {
      const title = `${service.title} en ${barrio.name}`;
      const metaTitle = `${service.title} en ${barrio.name} Pergamino 2026`;
      const metaDescription = `${service.intro.slice(0, 100)}... ${barrio.descripcion} ${barrio.distanciaUNNOBA}.`;
      const keywords = [
        ...service.keywords,
        ...barrio.keywords,
        `${service.slug} ${barrio.slug} pergamino`,
        `${service.title.toLowerCase()} ${barrio.name.toLowerCase()}`,
      ];
      const barrioFaqs: FAQ[] = [
        {
          q: `¿Cuál es la mejor zona de ${barrio.name} para ${service.title.toLowerCase()}?`,
          a: `${barrio.descripcion} ${barrio.distanciaUNNOBA}.`,
        },
        ...service.faqs.slice(0, 2),
      ];

      landings.push({
        url: `/pergamino/${service.slug}/${barrio.slug}`,
        slug: `${service.slug}-${barrio.slug}`,
        title,
        metaTitle,
        metaDescription,
        h1: title,
        intro: `${service.intro} ${barrio.descripcion}. ${barrio.distanciaUNNOBA}.`,
        keywords,
        faqs: barrioFaqs,
        service,
        barrio,
        breadcrumb: [
          { label: "Inicio", href: "/" },
          { label: "Pergamino", href: "/pergamino" },
          { label: service.title, href: `/pergamino/${service.slug}` },
          { label: barrio.name, href: `/pergamino/${service.slug}/${barrio.slug}` },
        ],
        schema: buildSchema(metaTitle, metaDescription, keywords),
      });
    }
  }

  // 3. LANDINGS CON MODIFICADORES (servicios de alta prioridad × modificadores)
  const highPriorityServices = SERVICES.filter((s) => s.urgency === "alta");
  for (const service of highPriorityServices) {
    for (const mod of MODIFIERS) {
      const title = `${service.title} ${mod.label} en Pergamino`;
      const metaTitle = `${service.title} ${mod.label} en Pergamino 2026`;
      const metaDescription = `Encontrá ${service.title.toLowerCase()} ${mod.label.toLowerCase()} en Pergamino. ${service.metaDescription}`;
      const keywords = [
        ...service.keywords,
        ...mod.extraKeywords,
        `${service.slug} ${mod.slug} pergamino`,
      ];

      landings.push({
        url: `/pergamino/${service.slug}/${mod.slug}`,
        slug: `${service.slug}-${mod.slug}`,
        title,
        metaTitle,
        metaDescription,
        h1: title,
        intro: service.intro,
        keywords,
        faqs: [...service.faqs, ...mod.extraFaqs],
        service,
        modifier: mod,
        breadcrumb: [
          { label: "Inicio", href: "/" },
          { label: "Pergamino", href: "/pergamino" },
          { label: service.title, href: `/pergamino/${service.slug}` },
          { label: mod.label, href: `/pergamino/${service.slug}/${mod.slug}` },
        ],
        schema: buildSchema(metaTitle, metaDescription, keywords),
      });
    }
  }

  return landings;
}

// ─── UTILIDADES ───────────────────────────────────────────────

/** Devuelve todas las URLs generadas. No usar en sitemap hasta crear rutas catch-all para barrio/modificador. */
export function generateSitemap(): string[] {
  return generateAllLandings().map((l) => l.url);
}

/** Devuelve solo URLs que hoy tienen ruta real en App Router: /[city]/[slug] */
export function generateBaseSitemap(): string[] {
  return SERVICES.map((service) => `/pergamino/${service.slug}`);
}

/** Busca una landing por URL exacta */
export function getLandingByUrl(url: string): GeneratedLanding | undefined {
  return generateAllLandings().find((l) => l.url === url);
}

/** Filtra landings por categoría de servicio */
export function getLandingsByCategory(category: ServiceCategory): GeneratedLanding[] {
  return generateAllLandings().filter((l) => l.service.category === category);
}

/** Obtiene landings relacionadas para el widget "Ver también" */
export function getRelatedLandings(currentUrl: string, limit = 4): GeneratedLanding[] {
  const all = generateAllLandings();
  const current = all.find((l) => l.url === currentUrl);
  if (!current) return [];
  return all
    .filter(
      (l) =>
        l.url !== currentUrl &&
        (l.service.category === current.service.category ||
          l.barrio?.slug === current.barrio?.slug)
    )
    .slice(0, limit);
}

// ─── STATS ────────────────────────────────────────────────────

export function getLandingStats() {
  const all = generateAllLandings();
  return {
    total: all.length,
    base: SERVICES.length,
    porBarrio: SERVICES.length * BARRIOS.length,
    conModificador: all.filter((l) => l.modifier).length,
    porCategoria: Object.fromEntries(
      (["alojamiento", "transporte", "gastronomia", "salud", "servicios", "educacion", "comercio"] as ServiceCategory[]).map(
        (cat) => [cat, all.filter((l) => l.service.category === cat).length]
      )
    ),
  };
}

/*
  EJEMPLO DE USO EN NEXT.JS:
  ─────────────────────────────────────────────────────────────
  // pages/pergamino/[...slug].tsx
  import { generateAllLandings, getLandingByUrl } from "@/data/seo-data-pergamino";

  export async function getStaticPaths() {
    const landings = generateAllLandings();
    return {
      paths: landings.map((l) => ({ params: { slug: l.url.split("/").filter(Boolean).slice(1) } })),
      fallback: false,
    };
  }

  export async function getStaticProps({ params }) {
    const url = "/" + ["pergamino", ...params.slug].join("/");
    const landing = getLandingByUrl(url);
    return { props: { landing } };
  }

  // Sitemap: app/sitemap.ts
  import { generateBaseSitemap } from "@/data/seo-data";
  const urls = generateBaseSitemap(); // URLs reales: /pergamino/[slug]
  ─────────────────────────────────────────────────────────────

  STATS ESPERADAS:
  - Base (sin barrio):    25 landings
  - Por barrio (25 × 8): 200 landings
  - Con modificadores:   ~50 landings (solo servicios urgency="alta")
  ─────────────────────────────────────────────────────────────
  TOTAL: ~275 landing pages únicas e indexables
*/
// ─── EXPORTACION PARA COMPATIBILIDAD (EL PUENTE) ─────────────

export const cities: Record<string, CityData> = {
  pergamino: {
    name: "Pergamino",
    slug: "pergamino",
    institution: "UNNOBA",
    hero: {
      title: "Vivir y Estudiar en Pergamino",
      subtitle: "La guía definitiva para estudiantes de la UNNOBA. Todo sobre alojamiento, transporte y vida universitaria."
    },
    details: {
      barrios: BARRIOS.map(b => b.name),
      precioPromedio: "$250k - $400k+ alquiler individual; menos compartiendo",
      zonasClave: ["Cerca de Sede Monteagudo", "Zona Terminal", "Barrio Centro"]
    },
    services: Object.fromEntries(SERVICES.map(s => [s.slug, s]))
  }
};
