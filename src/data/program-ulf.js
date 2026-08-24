// Programme Upper / Lower / Full Body — 3 séances (Lundi / Mercredi / Vendredi)
// Objectif : force + hypertrophie pour un intermédiaire.
// Principe : fréquence effective ~2× par groupe musculaire, 10-18 séries dures/sem,
// composés lourds (4-6 reps, RIR 2-3) en début de séance puis hypertrophie (6-15 reps, RIR 0-2).
// Le vendredi ne contient AUCUN mouvement à forte charge axiale (pas de squat ni deadlift lourd)
// pour ne pas cannibaliser la récupération du lower du mercredi.
// Sources : Pelland et al. (Sports Med 2026;56(2):481-505) · ACSM position stand 2026
// (Med Sci Sports Exerc 2026;58(4):851-872) · Robinson et al. (Sports Med 2024;54(9):2209-2231)
// · Wolf et al. (PeerJ 2025;13:e18904) · Schoenfeld et al. (JSCR 2016;30(7):1805-1812)
// · Morton et al. (BJSM 2018;52:376-384).

export const programUlf = {
  id: "ulf",
  name: "Upper / Lower / Full Body",
  level: "Intermédiaire",
  location: "Salle de sport",
  frequency: "3 séances / semaine (Lun · Mer · Ven)",
  sessions: [
    // ─────────────────────────────────────────
    // LUNDI — UPPER
    // ─────────────────────────────────────────
    {
      id: "ulf-upper",
      name: "Lundi — UPPER (haut du corps)",
      day: "Lundi",
      muscleGroups: "Pectoraux, Dos, Épaules, Biceps, Triceps",
      duration: "~75 min",
      warmup:
        "5-10 min de cardio léger, puis 2-3 séries d'approche progressives sur le développé couché (40 %, 60 %, 75 % de la charge de travail). Les composés lourds passent en premier, système nerveux frais.",
      sections: [
        {
          title: "PECTORAUX — FORCE",
          exercises: [
            { id: "ulf-up-1", name: "Développé couché barre", sets: 4, reps: "4-6", rest: "3 min", notes: "Exercice de force principal. 80-85 % du 1RM, RIR 2-3. Omoplates serrées, amplitude complète. Alternative si gêne : haltères ou machine convergente.", image: "developpe-couche" },
          ],
        },
        {
          title: "DOS — FORCE",
          exercises: [
            { id: "ulf-up-2", name: "Traction lestée (ou tirage vertical poulie)", sets: 4, reps: "6-8", rest: "2 min 30", notes: "RIR 2. Étirement complet en haut. Lester dès que tu tiens 8 reps propres.", image: "tractions" },
          ],
        },
        {
          title: "ÉPAULES — FORCE",
          exercises: [
            { id: "ulf-up-3", name: "Développé militaire barre (ou haltères)", sets: 3, reps: "6-8", rest: "2 min", notes: "RIR 2. Gainage abdominal serré, pas de cambrure excessive.", image: "developpe-militaire" },
          ],
        },
        {
          title: "DOS — ÉPAISSEUR",
          exercises: [
            { id: "ulf-up-4", name: "Rowing barre buste penché (ou rowing machine)", sets: 3, reps: "8-10", rest: "2 min", notes: "RIR 1-2. Tirer vers le nombril, contrôler l'excentrique.", image: "rowing-barre" },
          ],
        },
        {
          title: "PECTORAUX — ISOLATION",
          exercises: [
            { id: "ulf-up-5", name: "Écarté poulie (ou pec deck)", sets: 3, reps: "10-15", rest: "90s", notes: "RIR 1. Accent sur l'étirement des pectoraux en position basse — pic de tension en position allongée.", image: "ecarte-poulie" },
          ],
        },
        {
          title: "ÉPAULES — ISOLATION",
          exercises: [
            { id: "ulf-up-6", name: "Élévations latérales haltères (ou poulie)", sets: 3, reps: "12-15", rest: "60-90s", notes: "RIR 0-1. Poulie idéale pour la tension en position étirée. Coude légèrement fléchi et fixe.", image: "elevations-laterales" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "ulf-up-7", name: "Curl incliné haltères", sets: 3, reps: "8-12", rest: "90s", notes: "RIR 1. Bras en arrière du buste : biceps en position allongée. Excentrique contrôlé 2-3 s.", image: "curl-incline" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "ulf-up-8", name: "Extension triceps poulie haute (ou overhead)", sets: 3, reps: "8-12", rest: "90s", notes: "RIR 1. Variante overhead pour étirer le chef long du triceps.", image: "extension-poulie" },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────
    // MERCREDI — LOWER
    // ─────────────────────────────────────────
    {
      id: "ulf-lower",
      name: "Mercredi — LOWER (bas du corps)",
      day: "Mercredi",
      muscleGroups: "Quadriceps, Ischios, Fessiers, Mollets, Abdos",
      duration: "~80 min",
      warmup:
        "5-10 min de cardio léger + 2-3 séries d'approche sur le squat (40 %, 60 %, 75 %). Seul jour de squat et de soulevé de terre roumain lourds : ne fais jamais de cardio intense avant.",
      sections: [
        {
          title: "QUADRICEPS — FORCE",
          exercises: [
            { id: "ulf-lo-1", name: "Squat barre", sets: 4, reps: "4-6", rest: "3 min", notes: "Force principale. 80-85 % du 1RM, RIR 2-3. Descente contrôlée, cuisses au moins parallèles. Alternative si gêne : squat gobelet, presse ou hack squat.", image: "squat" },
          ],
        },
        {
          title: "ISCHIOS — FORCE",
          exercises: [
            { id: "ulf-lo-2", name: "Soulevé de terre roumain", sets: 3, reps: "6-8", rest: "2 min 30", notes: "RIR 2. Hanches en arrière, dos neutre, étirement maximal des ischios en bas.", image: "souleve-terre-roumain" },
          ],
        },
        {
          title: "QUADRICEPS — VOLUME",
          exercises: [
            { id: "ulf-lo-3", name: "Presse à cuisses", sets: 3, reps: "10-12", rest: "2 min", notes: "RIR 1-2. Amplitude complète, genoux dans l'axe des pieds. Remplaçable par hack squat ou fentes.", image: "presse-cuisses" },
          ],
        },
        {
          title: "ISCHIOS — VOLUME",
          exercises: [
            { id: "ulf-lo-4", name: "Leg curl allongé (ou assis)", sets: 3, reps: "8-12", rest: "90s", notes: "RIR 1. Variante assise pour plus d'étirement des ischios.", image: "leg-curl" },
          ],
        },
        {
          title: "QUADRICEPS — ISOLATION",
          exercises: [
            { id: "ulf-lo-5", name: "Leg extension", sets: 3, reps: "12-15", rest: "90s", notes: "RIR 1. Pause 1 s en haut, excentrique contrôlé.", image: "leg-extension" },
          ],
        },
        {
          title: "FESSIERS",
          exercises: [
            { id: "ulf-lo-6", name: "Hip thrust barre", sets: 3, reps: "8-12", rest: "2 min", notes: "RIR 1-2. Extension complète de hanche, menton rentré, pause 1 s en haut.", image: "hip-thrust" },
          ],
        },
        {
          title: "MOLLETS",
          exercises: [
            { id: "ulf-lo-7", name: "Mollets debout", sets: 4, reps: "8-12", rest: "90s", notes: "RIR 1. Pause 1-2 s en étirement complet en bas, amplitude maximale.", image: "mollets-debout" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "ulf-lo-8", name: "Gainage planche (ou relevés de jambes)", sets: 3, reps: "30-60s", rest: "60s", notes: "Travail du transverse. Corps aligné, abdos contractés, pas de cassure lombaire.", image: "gainage-planche" },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────
    // VENDREDI — FULL BODY (complément, faible fatigue axiale)
    // ─────────────────────────────────────────
    {
      id: "ulf-full",
      name: "Vendredi — FULL BODY (complément)",
      day: "Vendredi",
      muscleGroups: "Pectoraux, Dos, Jambes, Épaules, Bras, Mollets",
      duration: "~85 min",
      warmup:
        "Séance de complément : elle ajoute du volume sur les muscles à récupération rapide. AUCUN mouvement à forte charge axiale — pas de squat ni de deadlift lourd, la récupération du mercredi passe avant.",
      sections: [
        {
          title: "PECTORAUX",
          exercises: [
            { id: "ulf-fu-1", name: "Développé incliné haltères", sets: 4, reps: "6-8", rest: "2 min 30", notes: "RIR 2. Cible le haut des pectoraux, complément du couché du lundi. Banc à 30°.", image: "developpe-incline" },
          ],
        },
        {
          title: "DOS",
          exercises: [
            { id: "ulf-fu-2", name: "Tirage horizontal poulie (ou rowing haltère)", sets: 4, reps: "8-10", rest: "2 min", notes: "RIR 2. Complète le volume dos avec une autre orientation que le lundi.", image: "rowing-haltere" },
          ],
        },
        {
          title: "QUADRICEPS — UNILATÉRAL",
          exercises: [
            { id: "ulf-fu-3", name: "Fentes bulgares (ou hip thrust en alternance)", sets: 3, reps: "8-12 / jambe", rest: "2 min", notes: "RIR 1-2. Charge axiale minimale : préserve la récupération du mercredi. Tronc droit pour cibler les quadriceps.", image: "bulgarian-split-squat" },
          ],
        },
        {
          title: "QUADRICEPS — ISOLATION",
          exercises: [
            { id: "ulf-fu-4", name: "Leg extension", sets: 3, reps: "12-15", rest: "90s", notes: "RIR 1. Quadriceps sans la fatigue systémique du squat.", image: "leg-extension" },
          ],
        },
        {
          title: "ISCHIOS",
          exercises: [
            { id: "ulf-fu-5", name: "Leg curl assis", sets: 3, reps: "10-12", rest: "90s", notes: "RIR 1. Faible impact sur le bas du dos, étirement des ischios.", image: "leg-curl" },
          ],
        },
        {
          title: "ÉPAULES — LATÉRAUX",
          exercises: [
            { id: "ulf-fu-6", name: "Élévations latérales poulie", sets: 3, reps: "12-20", rest: "60s", notes: "RIR 0-1. Deltoïdes latéraux : récupération rapide, on peut charger le volume.", image: "elevations-poulie" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "ulf-fu-7", name: "Curl barre EZ (ou curl poulie)", sets: 3, reps: "8-12", rest: "90s", notes: "RIR 1. Volume bras supplémentaire, pas de triche.", image: "curl-barre-ez" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "ulf-fu-8", name: "Dips lestés (ou extension triceps)", sets: 3, reps: "8-12", rest: "90s", notes: "RIR 1. Étirement des triceps et pectoraux en bas. Buste droit pour cibler les triceps.", image: "dips" },
          ],
        },
        {
          title: "MOLLETS",
          exercises: [
            { id: "ulf-fu-9", name: "Mollets assis", sets: 3, reps: "12-15", rest: "60s", notes: "RIR 1. Genou fléchi : cible le soléaire, complément des mollets debout du mercredi.", image: "mollets-assis" },
          ],
        },
        {
          title: "ÉPAULES — POSTÉRIEURS",
          exercises: [
            { id: "ulf-fu-10", name: "Face pull", sets: 3, reps: "15-20", rest: "60s", notes: "RIR 0-1. Santé de l'épaule et équilibre du ratio poussée/tirage. Coudes hauts, rotation externe en fin de mouvement.", image: "face-pull" },
          ],
        },
      ],
    },
  ],
  schedule: [
    { day: "Lundi", session: "ulf-upper", label: "UPPER" },
    { day: "Mardi", session: null, label: "Repos" },
    { day: "Mercredi", session: "ulf-lower", label: "LOWER" },
    { day: "Jeudi", session: null, label: "Repos" },
    { day: "Vendredi", session: "ulf-full", label: "FULL BODY" },
    { day: "Samedi", session: null, label: "Repos actif (cardio)" },
    { day: "Dimanche", session: null, label: "Repos complet" },
  ],
};

// ─── Infos détaillées du programme (page /programme/ulf) ───
export const programUlfInfo = {
  programId: "ulf",
  title: "Upper / Lower / Full Body",
  subtitle: "Force & hypertrophie — intermédiaire",
  version: "v1.0",
  duration: "12 semaines (2 × 5 sem + deload)",

  overview: {
    goal: "Force + hypertrophie",
    profile: "Intermédiaire — 3 séances/semaine",
    sessions: "3 séances / sem · Lundi, Mercredi, Vendredi",
    priority: "Fréquence 2×/muscle · 10-18 séries/sem",
    novelty:
      "Le split Upper / Lower / Full Body donne une fréquence effective d'environ 2× par groupe musculaire et un volume de 10 à 18 séries dures par muscle — précisément les zones les plus efficaces identifiées par la littérature récente (Pelland 2025, ACSM 2026). Les mouvements lourds (4-6 reps, 80-85 % du 1RM, RIR 2-3) ouvrent chaque séance pour la force, l'hypertrophie (6-15 reps, RIR 0-2) suit, avec un accent sur les exercices à forte tension en position étirée.",
  },

  schedule: [
    { day: "Lundi", session: "UPPER — haut du corps", duration: "~75 min", emoji: "💪" },
    { day: "Mardi", session: "Repos", duration: "—", emoji: "😴" },
    { day: "Mercredi", session: "LOWER — bas du corps", duration: "~80 min", emoji: "🦵" },
    { day: "Jeudi", session: "Repos", duration: "—", emoji: "😴" },
    { day: "Vendredi", session: "FULL BODY — complément", duration: "~85 min", emoji: "🔁" },
    { day: "Samedi", session: "Repos actif (cardio)", duration: "20-30 min", emoji: "🚴" },
    { day: "Dimanche", session: "Repos", duration: "—", emoji: "😴" },
  ],

  focusTitle: "Logique du split",
  focus: [
    { day: "Lundi", exercises: "Composés lourds en premier (couché, traction, militaire), isolation ensuite." },
    { day: "Mercredi", exercises: "Le seul jour de squat et de soulevé de terre roumain lourds. Charge axiale maximale." },
    { day: "Vendredi", exercises: "Complément à faible fatigue : machines, fentes, bras, épaules. Jamais de squat ni de deadlift lourd." },
    { day: "Récupération", exercises: "48 h entre chaque séance, puis 72 h de week-end. Le bas du corps a 2 jours pleins avant d'être resollicité." },
    { day: "Équilibre", exercises: "Ratio poussée/tirage proche de 1:1 (11 séries pec contre 14 dos + face pull) — santé de l'épaule." },
  ],

  volumeTable: [
    { muscle: "Pectoraux", weekly: "11", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Dos (dorsaux + haut)", weekly: "14", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Quadriceps", weekly: "13", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Ischios", weekly: "9-10", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Fessiers", weekly: "6-9", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Delts latéraux", weekly: "6-9", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Delts postérieurs", weekly: "3-5", freq: "1-2×", target: "Suffisante", priority: false },
    { muscle: "Biceps", weekly: "6 + tirages", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Triceps", weekly: "6 + pressing", freq: "2×", target: "Optimale", priority: false },
    { muscle: "Mollets", weekly: "7", freq: "2×", target: "Suffisante", priority: false },
  ],
  volumeCaption:
    "Zone optimale : 10-18 séries dures/sem pour les grands groupes, 6-9 pour les petits (Pelland 2025, ACSM 2026). Au-delà de 19-20 séries, l'efficacité par série chute nettement.",

  progression: {
    method: "Double progression + RIR décroissant (mésocycles de 5 semaines)",
    rule: "Atteins le haut de la fourchette de reps sur TOUTES les séries prescrites au RIR cible → augmente la charge.",
    increments: "Composés haut +2,5 kg · Composés bas +5 kg · Isolations +1,25-2,5 kg",
    example: "Couché 4×4-6 : 4,4,4,4 → 5,5,5,4 → 6,6,6,6 ✅ → +2,5 kg, retour à 4 reps",
    planTitle: "Mésocycle de 6 semaines",
    plan: [
      { week: 1, rir: "2-3", volume: "Plein", load: "Charges de départ", label: "Intro" },
      { week: 2, rir: "2-3", volume: "Plein", load: "Cible", label: "Build" },
      { week: 3, rir: "1-2", volume: "Plein", load: "Cible +", label: "Build" },
      { week: 4, rir: "1-2", volume: "Plein", load: "Cible ++", label: "Build" },
      { week: 5, rir: "0-1 iso · 1 composés", volume: "Plein", load: "Max", label: "Overreach" },
      { week: 6, rir: "4-5", volume: "−50 % (2 séries/exo)", load: "~60 % 1RM", label: "Deload" },
    ],
  },

  intensification: [
    { phase: "Sem 1-2", name: "Aucune", details: "Établir des charges tenues à RIR 2-3 avec une technique irréprochable. Ne pas charger au maximum d'emblée." },
    { phase: "Sem 3-5", name: "RIR décroissant", details: "Rapprocher progressivement les séries de l'échec, les isolations d'abord. Double progression stricte sur les composés." },
    { phase: "Isolations", name: "Partiels allongés", details: "À l'échec en amplitude complète → 5-8 partiels dans la moitié basse (Wolf 2025). Complément optionnel, pas une obligation." },
    { phase: "Sem 6", name: "Deload", details: "Volume ÷2, charge à ~60 % du 1RM, RIR 4-5. Obligatoire toutes les 5-6 semaines — aucune perte musculaire (Coleman 2024)." },
  ],
  intensificationGoldenRule:
    "JAMAIS de RIR 0 sur les composés lourds (squat, couché, militaire, roumain, tractions) — l'échec est réservé aux isolations de fin de séance.",

  nutrition: {
    maintenance: "2 950-3 200 kcal/jour",
    target: "+5 à 10 % (≈ 3 300 kcal/jour)",
    macrosTitle: "Macros (81 kg, lean bulk)",
    macros: [
      { name: "Protéines", grams: "130-178 g", ratio: "1,6-2,2 g/kg", kcal: 650 },
      { name: "Lipides", grams: "80 g", ratio: "1,0 g/kg", kcal: 720 },
      { name: "Glucides", grams: "490 g", ratio: "6,1 g/kg", kcal: 1960 },
    ],
    adjust: [
      { gain: "< 0,2 kg/sem", action: "+200 kcal" },
      { gain: "0,2-0,4 kg/sem", action: "Maintien ✅" },
      { gain: "> 0,5 kg/sem", action: "−200 kcal" },
    ],
    supplements: [
      { name: "Créatine mono", dose: "3-5 g/jour", why: "L'un des rares suppléments avec un effet démontré sur la force et l'hypertrophie", essential: true },
      { name: "Whey", dose: "25-50 g/jour", why: "Compléter l'apport protéique si les repas ne suffisent pas" },
      { name: "Vit. D3", dose: "2 000-4 000 UI", why: "Récupération" },
      { name: "Multivit", dose: "1/jour", why: "Filet de sécurité" },
    ],
    tipsTitle: "Récupération & hygiène",
    tips: [
      "Protéines 1,6-2,2 g/kg/jour (point de rupture à 1,62 g/kg — Morton 2018), réparties sur 3-4 prises d'au moins 0,4 g/kg (≈ 33 g).",
      "Sommeil 7-9 h par nuit : c'est le facteur de récupération le plus déterminant.",
      "Cardio 2-3 × 20-30 min d'intensité modérée, de préférence les jours de repos — jamais avant les jambes lourdes du mercredi (effet d'interférence).",
      "Échauffement : 5-10 min de cardio léger + 2-3 séries d'approche (40 %, 60 %, 75 %) sur le premier exo lourd de la séance.",
      "Carnet d'entraînement (charges, reps, RIR ressenti) pour piloter la double progression objectivement.",
      "Autorégulation : un jour de fatigue, réduis la charge pour tenir le RIR cible plutôt que de forcer.",
    ],
  },

  golden: [
    "Composés lourds en premier, système nerveux frais.",
    "Repos 2-3 min sur les composés, 60-90 s sur l'isolation (Schoenfeld 2016 : 3 min > 1 min sur force ET hypertrophie).",
    "RIR 2-3 sur le lourd, RIR 0-1 sur l'isolation. L'échec n'est pas nécessaire (ACSM 2026).",
    "Privilégier les exercices dont le pic de tension survient en position étirée.",
    "Jamais de squat ni de soulevé de terre lourd le vendredi.",
    "Deload toutes les 5-6 semaines, sans exception.",
  ],

  errors: [
    "Mettre du squat lourd le vendredi — ça cannibalise la récupération du lower du mercredi.",
    "Aller à l'échec sur les composés lourds : technique dégradée et récupération plombée.",
    "Dépasser 18-20 séries/muscle/semaine : les rendements par série chutent (Pelland 2025).",
    "Écourter les repos sur les composés (1 min au lieu de 3) : moins de force et moins d'hypertrophie.",
    "Charger au maximum dès la semaine 1 au lieu d'établir des charges propres.",
    "Sauter la semaine de deload.",
    "Augmenter la charge sans avoir atteint le haut de la fourchette de reps sur toutes les séries.",
    "Placer le cardio avant les jambes lourdes du mercredi.",
    "Changer d'exercices toutes les semaines : la double progression a besoin de constance.",
    "Négliger le face pull et le volume de tirage : déséquilibre poussée/tirage.",
    "Ignorer les signaux de décharge anticipée : stagnation 2 séances de suite, douleurs articulaires, sommeil dégradé.",
  ],
};
