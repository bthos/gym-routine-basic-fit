// Shared demo data for the Basic-Fit rutina UI kit (abbreviated from data/equipment.json)
window.BF_KIT_DATA = {
  equipment: [
    { id: "g3-s70", name: { es: "Prensa de Piernas", en: "Leg Press", be: "Жым нагамі" }, model: "G3-S70", cat: "legs",
      img: "https://images.jhtassets.com/9051c73da092604e62d75966c281c425455fcc41/transformed/w_300",
      prim: ["Cuádriceps"], sec: ["Glúteos"], weight: 45,
      desc: { es: "Prensa de piernas sentado para el tren inferior.", en: "Seated leg press for lower body.", be: "Жым нагамі седзячы для ніжняй часткі цела." } },
    { id: "g3-s10", name: { es: "Prensa de Pecho", en: "Chest Press", be: "Жым ад грудзей" }, model: "G3-S10", cat: "chest",
      img: "https://images.jhtassets.com/aade812e103cdbcfeebf40679e3a74723a65ef68/transformed/w_300",
      prim: ["Pectoral mayor"], sec: ["Tríceps", "Deltoides anterior"], weight: 32,
      desc: { es: "Imita el press de banca en un entorno controlado.", en: "Mimics bench press in a controlled environment.", be: "Імітуе жым штангі ў кантраляваным асяроддзі." } },
    { id: "g3-s30", name: { es: "Jalón al Pecho", en: "Lat Pulldown", be: "Цяга верхняга блока" }, model: "G3-S30", cat: "back",
      prim: ["Dorsal ancho"], sec: ["Bíceps"], weight: 39,
      desc: { es: "Jalón vertical para el desarrollo de la espalda.", en: "Vertical pull for back development.", be: "Вертыкальная цяга для развіцця спіны." } },
    { id: "g3-s20", name: { es: "Prensa de Hombros", en: "Shoulder Press", be: "Жым ад плячэй" }, model: "G3-S20", cat: "shoulders",
      prim: ["Deltoides"], sec: ["Tríceps"],
      desc: { es: "Press vertical de hombros sentado.", en: "Seated overhead shoulder press.", be: "Жым ад плячэй седзячы." } },
    { id: "g3-s40", name: { es: "Curl de Bíceps", en: "Arm Curl", be: "Згінанне рук" }, model: "G3-S40", cat: "arms",
      prim: ["Bíceps"], sec: [], weight: 20,
      desc: { es: "Curl de bíceps con apoyo de brazos.", en: "Supported biceps curl.", be: "Згінанне рук на біцэпс з упорам." } },
    { id: "g3-s50", name: { es: "Abdominales", en: "Abdominal", be: "Прэс" }, model: "G3-S50", cat: "core",
      prim: ["Recto abdominal"], sec: [],
      desc: { es: "Crunch abdominal con resistencia regulable.", en: "Weighted abdominal crunch.", be: "Скручванні з рэгулюемым супрацівам." } },
  ],
  cats: [
    { id: "all", es: "Todas" }, { id: "chest", es: "Pecho" }, { id: "back", es: "Espalda" },
    { id: "shoulders", es: "Hombros" }, { id: "arms", es: "Brazos" }, { id: "legs", es: "Piernas" }, { id: "core", es: "Core" },
  ],
};
