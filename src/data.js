// ───────────── Données du site Maison Bahnel ─────────────
export const WA_NUM = "22898361919";
export const PHONE = "+228 98 36 19 19";
export const SOCIAL = {
  instagram: "https://www.instagram.com/bahnel_beauty_lome/",
  tiktok: "https://www.tiktok.com/@bahnel.beauty.lome",
};
export const HOURS = "Lun – Sam : 9h00 – 20h00 · Dim : sur rendez-vous";
export const DEPOSIT_NOTE =
  "Nos rendez-vous ne sont confirmés qu'après le versement d'un acompte de 30 % à 50 % de la prestation souhaitée.";

export const wa = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

export const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F CFA";

// Images (Unsplash) — tailles adaptées à la demande
export const IMG = {
  hero: "photo-1600334129128-685c5582fd35",
  spa: "photo-1540555700478-4be289fbecef",
  ambiance: "photo-1519823551278-64ac92734fb1",
  massage: "photo-1544161515-4ab6ce6db874",
  signature: "photo-1596755389378-c31d21fd1273",
  lomi: "photo-1515377905703-c4788e51af15",
  stones: "photo-1600334089648-b0d9d3028eb2",
  four: "photo-1568702846914-96b305d2aaeb",
  duo: "photo-1607008829749-c0f284a49fc4",
  prenatal: "photo-1588776814546-1ffad65b8f90",
  drain: "photo-1570172619644-dfd03ed5d881",
  wood: "photo-1616394584738-fc6e612e71b9",
  detox: "photo-1614159102271-2e93da5ee297",
  asie: "photo-1545205597-3d9d02c29597",
  gold: "photo-1498842812179-c81beecf902c",
  nails: "photo-1604654894610-df63bc536371",
  face: "photo-1487412947147-5cebf100ffc2",
  founder: "photo-1531746020798-e6953c6e8e04",
  acad: "photo-1581088669936-e20c38ff0c36",
};
export const unsplash = (id, w, q = 70) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=crop`;

// ───────────── Catégories ─────────────
export const CATS = [
  {
    id: "preludes",
    tab: "Préludes",
    title: "Les Préludes Essentiels",
    icon: "◈",
    img: IMG.spa,
    intro:
      "Des soins d'hygiène profonde et de préparation cutanée. Idéaux seuls pour une sensation de propreté absolue, ou avant n'importe quel rituel de la collection pour en décupler les résultats.",
  },
  {
    id: "rituels",
    tab: "Rituels signature",
    title: "Nos Rituels Signatures",
    icon: "✦",
    img: IMG.gold,
    intro: "Une trilogie de soins précieux et sensoriels conçus comme de la haute joaillerie pour le corps.",
  },
  {
    id: "lifting",
    tab: "Lifting coréen",
    title: "Le Lifting Coréen",
    icon: "◇",
    img: IMG.face,
    intro:
      "Une technique anti-âge non invasive et sans douleur, réalisée avec des fils de soie et de collagène. Résultats instantanés.",
  },
  {
    id: "massages",
    tab: "Massages",
    title: "Nos Massages",
    icon: "✧",
    img: IMG.massage,
    intro: "Huit massages pensés comme des expériences sensorielles. Tarif normal ou tarif abonnement (10 séances).",
  },
  {
    id: "soins",
    tab: "Soins",
    title: "Nos Soins",
    icon: "❖",
    img: IMG.drain,
    intro: "Soins du visage et du corps. Tarif normal ou tarif abonnement (10 séances).",
  },
  {
    id: "epilation",
    tab: "Épilation",
    title: "Épilation à la cire",
    icon: "◌",
    img: IMG.drain,
    intro: "Une épilation soignée, dans le respect de votre peau.",
  },
  {
    id: "onglerie",
    tab: "Onglerie",
    title: "Onglerie d'exception",
    icon: "◍",
    img: IMG.nails,
    intro: "Manucure, pédicure, poses et nail art : des mains et des pieds sublimés.",
  },
];

// ───────────── Prestations ─────────────
// price : tarif normal (F CFA) · abo : tarif par séance en abonnement 10 séances · from : « à partir de »
export const SERVICES = [
  // 1. Préludes
  {
    id: "prelude-oriental", cat: "preludes", name: "Le Prélude Oriental", dur: "30 min", price: 20000, img: IMG.spa,
    desc: "Laissez-vous envelopper par la chaleur et les vapeurs bienfaisantes du savon noir traditionnel à l'eucalyptus. Ce soin libère la peau des toxines accumulées avant une exfoliation vigoureuse et méticuleuse au gant de Kessa.",
    result: "Une peau entièrement débarrassée de ses cellules mortes, respirante, lisse et prête à recevoir les actifs de vos soins.",
  },
  {
    id: "hammam", cat: "preludes", name: "Le Rituel Hammam Signature", dur: "60 min", price: 30000, img: IMG.ambiance,
    sub: "L'art de la purification traditionnelle.",
    desc: "Ce soin complet associe l'exfoliation profonde au savon noir et au gant de Kessa à un enveloppement purifiant et reminéralisant au Ghassoul (argile de l'Atlas).",
    result: "Les pores sont resserrés, le grain de peau est affiné et le corps retrouve une fraîcheur incomparable, parfaitement adaptée au climat tropical de Lomé.",
  },
  {
    id: "echappee", cat: "preludes", name: "L'Échappée Sensorielle", dur: "75 min", price: 35000, img: IMG.detox,
    sub: "Nectar de Papaye & Coco — Rituel vitaminé, peeling enzymatique & éclat fruité.",
    desc: "Un hommage à la générosité des fruits de notre région. Ce soin débute par un gommage gourmand à la noix de coco qui exfolie la peau en douceur tout en l'hydratant. Place ensuite à la texture charnelle et fondante d'un enveloppement à la pulpe de papaye fraîche, dont les enzymes naturelles réalisent un peeling doux et perfecteur.",
    result: "Une peau instantanément illuminée, d'une douceur veloutée et gorgée de vitamines.",
  },

  // 2. Rituels signatures
  {
    id: "rituel-blanc", cat: "rituels", name: "Le Rituel Blanc", dur: "75 min", price: 40000, img: IMG.asie,
    sub: "Cocon de douceur, apaisement & haute nutrition.",
    desc: "Le soin ultime des peaux délicates à la recherche de réconfort. Ce voyage commence par une exfoliation ultra-sensorielle au sucre fin de canne et à l'huile de coco, qui fond délicatement sous les doigts. Le corps est ensuite drapé dans un enveloppement riche et crémeux au lait et au miel réparateur.",
  },
  {
    id: "or-noir", cat: "rituels", name: "L'Or Noir", dur: "75 min", price: 40000, img: IMG.massage,
    sub: "Rituel détox, tonus & éclat unifié.",
    desc: "Un soin d'exception qui éveille les sens et revitalise le corps. Tout commence par un gommage énergisant au café moulu qui active la microcirculation et draine la silhouette. Il est suivi d'un enveloppement onctueux au cacao pur, gorgé d'antioxydants puissants et de vitamines.",
    result: "Une peau intensément tonifiée, unifiée et un coup d'éclat immédiat.",
  },
  {
    id: "or-jaune", cat: "rituels", name: "L'Or Jaune", dur: "90 min", price: 45000, img: IMG.gold,
    sub: "Rituel pure lumière, éclat suprême & teint parfait.",
    desc: "Inspiré du mythique rituel de beauté des reines et des futures mariées d'Asie, ce soin est une véritable cure de lumière pour le corps. Tout commence par une exfoliation fine à la poudre de riz, qui lisse le grain de peau avec une infinie délicatesse. Place ensuite à un enveloppement onctueux associant les vertus perfectrices du curcuma – le précieux safran des Indes – à la douceur exfoliante du yaourt. Ce bain d'actifs puissants atténue les taches, unifie intensément le teint et réveille l'éclat naturel de la peau.",
    result: "Une peau sublimée, unifiée, incroyablement lumineuse et douce comme de la soie.",
  },

  // 3. Lifting coréen
  {
    id: "lifting-premium", cat: "lifting", name: "Le Lifting Coréen Premium", dur: "2 h", price: 60000, img: IMG.face,
    sub: "« Glass Skin & Lift » — séance unique.",
    desc: "Idéal pour un coup d'éclat spectaculaire avant un événement (mariage, soirée à Lomé).",
  },
  {
    id: "lifting-cure", cat: "lifting", name: "La Cure « Jeunesse Éternelle »", dur: "3 séances", price: 165000, regular: 180000, img: IMG.face,
    sub: "Forfait 3 séances au lieu de 180 000 F CFA.",
    desc: "Le collagène et les fils agissent par accumulation. Pour un résultat durable (plusieurs mois), il faut rapprocher 3 séances à 10 ou 14 jours d'intervalle.",
    includes: [
      "Diagnostic",
      "Double nettoyage, exfoliation, Vapozone, extractions de comédons",
      "Nano-needling",
      "Radiofréquence",
      "Fils de soie",
      "Ultrasons",
      "Masque collagène, lumière LED rouge",
      "Massage liftant 30 min",
      "Suivi et routine personnalisés",
    ],
  },

  // 4. Massages
  {
    id: "m-relaxant", cat: "massages", name: "Massage relaxant", dur: "60 min", price: 15000, abo: 12000, img: IMG.massage,
    sub: "Suédois ou californien au choix.",
    desc: "Une pratique de détente utilisant des mouvements lents, fluides et rythmés (effleurage, pétrissage doux). Elle réduit le stress, soulage les tensions musculaires et améliore le sommeil.",
  },
  {
    id: "m-lomi", cat: "massages", name: "Massage Lomi-Lomi", dur: "60 min", price: 20000, abo: 15000, img: IMG.lomi,
    desc: "Une technique de relaxation et de tonification musculaire qui soulage les tensions et améliore la circulation sanguine et lymphatique.",
  },
  {
    id: "m-4mains", cat: "massages", name: "Massage 4 mains", dur: "60 min", price: 30000, abo: 25000, img: IMG.four,
    desc: "Deux praticiens massent une seule personne simultanément. Les mouvements sont synchronisés et d'égale intensité pour saturer les sens, faire lâcher prise et procurer une relaxation profonde.",
  },
  {
    id: "m-duo", cat: "massages", name: "Massage en duo", dur: "60 min", price: 30000, abo: 25000, img: IMG.duo,
    desc: "Une expérience de détente partagée : deux personnes reçoivent leur soin simultanément, par deux praticiens différents, dans une même salle privée.",
  },
  {
    id: "m-pierres", cat: "massages", name: "Massage aux pierres chaudes", dur: "60 min", price: 25000, abo: 20000, img: IMG.stones,
    desc: "La chaleur des pierres diffuse une sensation immédiate de réconfort. Associée à des gestes lents et enveloppants, elle dénoue les tensions en profondeur et apaise le corps comme l'esprit.",
  },
  {
    id: "m-therapeutique", cat: "massages", name: "Massage thérapeutique / tonique", dur: "60 min", price: 20000, abo: 15000, img: IMG.signature,
    desc: "Une thérapie manuelle ciblée pour réduire les tensions musculaires et articulaires, accélérer la guérison des blessures, améliorer la mobilité, résoudre les douleurs chroniques et favoriser la récupération.",
  },
  {
    id: "m-prenatal", cat: "massages", name: "Massage prénatal", dur: "60 min", price: 20000, abo: 15000, img: IMG.prenatal,
    desc: "Une pratique thérapeutique spécifiquement conçue pour améliorer le bien-être de la femme enceinte.",
  },
  {
    id: "m-madero", cat: "massages", name: "Madérothérapie / Drainage lymphatique", dur: "60 min", price: 20000, abo: 15000, img: IMG.wood,
    desc: "Une expérience unique de relaxation et de bien-être, grâce à des instruments en bois spécialement conçus pour stimuler le corps et l'esprit.",
  },

  // 5. Soins
  {
    id: "s-glow", cat: "soins", name: "Glow Lift Bahnel", dur: "45 min", price: 15000, abo: 12000, img: IMG.face,
    desc: "Massage drainant et liftant du visage : offrez à votre visage un véritable bain d'éclat grâce à des techniques drainantes et liftantes.",
  },
  {
    id: "s-hydra", cat: "soins", name: "Soin Hydrafacial / Dermabrasion", price: 25000, abo: 20000, img: IMG.face,
    desc: "Lutte efficacement contre les pores dilatés et les points noirs.",
  },
  {
    id: "s-visage", cat: "soins", name: "Soin du visage", dur: "60 min", price: 15000, abo: 12000, img: IMG.face,
    desc: "Démaquillage, gommage, Face Steamer, extractions de comédons, masque, lumière LED, sérum, crème matifiante, 5 min de massage du visage et du cou.",
  },
  {
    id: "s-antiage", cat: "soins", name: "Soin du visage anti-âge", dur: "90 min", price: 40000, abo: 35000, img: IMG.face,
    desc: "Démaquillage, gommage, Face Steamer, fil de collagène, sérum HA, crème matifiante, 5 min de massage anti-âge du visage.",
  },
  {
    id: "s-vajacial", cat: "soins", name: "Soin Vajacial", price: 15000, abo: 12000, img: IMG.drain,
    desc: "Gommage, steamer, extraction des poils incarnés, masque, sérum, crème hydratante.",
  },
  {
    id: "s-colombien-fesses", cat: "soins", name: "Lifting colombien — fesses", price: 15000, abo: 10000, img: IMG.wood,
    desc: "Donne du volume aux fesses, aide à se débarrasser de la cellulite et booste l'élasticité de la peau.",
  },
  {
    id: "s-colombien-seins", cat: "soins", name: "Lifting colombien — seins", price: 10000, abo: 8000, img: IMG.wood,
    desc: "Donne du volume aux seins, aide à se débarrasser de la cellulite et booste l'élasticité de la peau.",
  },

  // 6. Épilation à la cire
  ...[
    ["e-sourcils", "Sourcils / Lèvres", 5000],
    ["e-menton", "Menton / Aisselles", 5000],
    ["e-avantbras", "Avant-bras", 8000],
    ["e-bras", "Bras", 15000],
    ["e-torse", "Torse", 10000],
    ["e-dos", "Dos", 10000],
    ["e-demijambes", "Demi-jambes", 8000],
    ["e-jambe", "Jambe entière", 15000],
    ["e-maillot", "Maillot classique", 15000],
    ["e-maillot-int", "Maillot intégral", 20000],
    ["e-corps", "Corps entier", 50000, true],
  ].map(([id, name, price, from]) => ({ id, cat: "epilation", name, price, from: !!from, list: true })),

  // 7. Onglerie
  ...[
    ["o-pedicure", "Pédicure", 10000, false, "Désinfection, bain de pieds, callosités à la pierre ponce, gommage, cuticules, hydratation, massage"],
    ["o-jelly", "Jelly pédicure", 12000],
    ["o-manucure", "Manucure", 5000],
    ["o-russe", "Manucure russe", 10000],
    ["o-vernis", "Pose vernis simple", 2000],
    ["o-semi", "Pose vernis semi-permanent", 5000],
    ["o-capsules", "Capsules + vernis semi-permanent", 7000],
    ["o-softgel", "Pose américaine / Soft Gel X", 10000],
    ["o-acrylique", "Acrylique mains / pieds", 12000, true],
    ["o-polygel", "Polygel mains / pieds", 12000, true],
    ["o-remplissage", "Remplissage", 10000],
    ["o-gainage", "Gainage / Extension chablons", 12000],
    ["o-depose-gel", "Dépose acrylique / gel", 5000],
    ["o-depose-semi", "Dépose vernis semi-permanent", 3000],
  ].map(([id, name, price, from, detail]) => ({ id, cat: "onglerie", name, price, from: !!from, detail, list: true })),
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
export const servicesOf = (cat) => SERVICES.filter((s) => s.cat === cat);
export const minPrice = (cat) => Math.min(...servicesOf(cat).map((s) => s.price));

// ───────────── Lifting coréen : explications ─────────────
export const LIFTING = {
  lead: [
    "Le lifting coréen est une technique anti-âge non invasive et sans douleur, réalisée avec des fils de soie et de collagène. Il lisse les rides et repulpe le visage. Les résultats sont instantanés : votre peau est régénérée, plus ferme, éclatante et visiblement rajeunie.",
    "Le collagène est une protéine essentielle présente naturellement dans notre peau, responsable de son élasticité et de sa fermeté. Avec l'âge, sa production diminue, entraînant l'apparition de rides, un relâchement cutané et une perte d'éclat.",
    "Le soin du fil de soie de collagène consiste à appliquer des fils ultra-fins, enrichis en collagène et en extraits de soie, directement sur la peau. Ces fils, biodégradables et entièrement sûrs, libèrent leurs actifs de manière progressive pour stimuler la régénération cellulaire et renforcer la production de collagène naturel.",
  ],
  tip: "Dès l'âge de 25 ans, la production naturelle de collagène diminue en moyenne de 1 % à 1,5 % par an. Les soins anti-âge doivent commencer entre 25 et 30 ans, tandis que les soins plus concentrés s'intègrent ensuite selon les besoins.",
  benefits: [
    ["Hydratation profonde", "Les fils combinent les propriétés hydratantes du collagène avec les bienfaits nourrissants de la soie, pour une peau repulpée."],
    ["Fermeté et tonicité", "Ils redonnent à la peau sa souplesse et sa fermeté naturelle en agissant en profondeur."],
    ["Réduction des signes de l'âge", "Le traitement atténue efficacement les rides et ridules, offrant un effet lissant immédiat et durable."],
    ["Éclat et douceur", "Grâce aux extraits de soie, la peau devient visiblement plus lumineuse, douce et revitalisée."],
  ],
  contra:
    "Médicaments contre l'acné · Produit à base de rétinol (au moins 10 jours avant le traitement) · Grossesse · Allaitement · Inflammation ou plaies ouvertes · Éruptions cutanées · Eczéma, herpès · Maladies infectieuses · Cancer de la peau · Maladies auto-immunes · Allergie à l'un des composants · Acné, acné inflammatoire",
};

// ───────────── Autres contenus ─────────────
export const POPULAR = ["hammam", "or-jaune", "lifting-premium", "m-lomi", "m-duo", "s-hydra"];

export const FORMATIONS = [
  { num: "01", name: "Formation Massage Thérapeutique", sub: "Techniques, anatomie et éthique professionnelle" },
  { num: "02", name: "Formation Esthétique", sub: "Soins du visage, maquillage et techniques de beauté" },
  { num: "03", name: "Formation Prothésie Ongulaire", sub: "Nail art, poses techniques et soins des ongles" },
  { num: "04", name: "Coaching Business Beauté", sub: "Entrepreneuriat dans le secteur beauté et bien-être" },
];

export const TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
];
