// Programme Hypertrophie 2 semaines — biais bras et jambes (v3)
// Planning : Lundi (Haut) / Mercredi (Full Body sans jambes) / Vendredi (Bas — priorité jambes) / Samedi (Spé Bras bonus optionnel)
// Alternance Semaine A / Semaine B sur 8 semaines, puis deload semaine 6 et reprise.
// Source : programme personnel établi sur littérature 2024-2025 (Pelland, Schoenfeld, Maeo, Costa, Wolf, Israetel/RP).

export const programHypertrophie = {
  id: "hypertrophie",
  name: "Hypertrophie 2 semaines",
  level: "Débutant éclairé",
  location: "Salle de sport",
  frequency: "4 séances / semaine (alternance A/B)",
  sessions: [
    // ─────────────────────────────────────────
    // SEMAINE A
    // ─────────────────────────────────────────
    {
      id: "hyper-haut-a",
      name: "Lundi A — Haut du corps + abdos",
      day: "Lundi",
      muscleGroups: "Pectoraux, Dos, Épaules, Bras, Abdos",
      duration: "~75 min",
      warmup: "5 min vélo/rameur + 2 séries d'approche progressives sur le bench. Tempo contrôlé : excentrique 2 s, concentrique explosif. Abdos en fin de séance (jamais avant les compounds — stabilisateurs).",
      sections: [
        {
          title: "PECTORAUX",
          exercises: [
            { id: "hyper-ha-1", name: "Bench press barre", sets: 4, reps: "6-8", rest: "2 min 30", notes: "Coudes 45-60°, légère pause poitrine, full ROM. RIR 2.", image: "developpe-couche" },
          ],
        },
        {
          title: "DOS",
          exercises: [
            { id: "hyper-ha-2", name: "Tirage poitrine prise neutre (chest-supported row)", sets: 4, reps: "8-10", rest: "2 min", notes: "Coudes serrés, rétraction scapulaire, pause 1 s en contraction. RIR 1-2.", image: "rowing-haltere" },
          ],
        },
        {
          title: "ÉPAULES",
          exercises: [
            { id: "hyper-ha-3", name: "Développé épaules haltères assis", sets: 3, reps: "8-10", rest: "2 min", notes: "Trajectoire neutre, pas de blocage coudes. RIR 2.", image: "developpe-militaire" },
            { id: "hyper-ha-4", name: "Élévation latérale haltères", sets: 3, reps: "12-15", rest: "75s", notes: "Coude légèrement fléchi fixe, prise neutre. RIR 0-1.", image: "elevations-laterales" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "hyper-ha-5", name: "Curl incliné haltères (banc 60°)", sets: 3, reps: "8-10", rest: "1 min 30", notes: "Bras derrière le tronc en bas, étirement max (Costa 2025 : long head). Tempo 3-0-1-0.", image: "curl-incline" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "hyper-ha-6", name: "Extension triceps overhead corde câble", sets: 3, reps: "10-12", rest: "1 min 30", notes: "Bras à la verticale (Maeo 2023 : 1,4× pushdown sur long head).", image: "triceps-overhead-corde" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-ha-7", name: "Abdo crunch machine", sets: 3, reps: "12-15", rest: "60s", notes: "Flexion complète du tronc, pause 1 s en contraction. RIR 1.", image: "crunch-machine" },
            { id: "hyper-ha-8", name: "Planche", sets: 3, reps: "30-45s", rest: "45s", notes: "Corps aligné, abdos contractés, pas de cassure lombaire. Progression : +5s/sem.", image: "gainage-planche" },
          ],
        },
      ],
    },
    {
      id: "hyper-full-a",
      name: "Mercredi A — Full Body sans jambes + abdos",
      day: "Mercredi",
      muscleGroups: "Bras, Dos, Pec, Épaules, Abdos",
      duration: "~85 min",
      warmup: "Priming bras (2 séries légères biceps + 2 triceps) AVANT les compounds. Abdos en fin de séance (jamais avant les compounds).",
      sections: [
        {
          title: "PRIMING BRAS",
          exercises: [
            { id: "hyper-fa-1", name: "Curl haltères marteau (priming)", sets: 2, reps: "10-12", rest: "60s", notes: "Amorce bras avant compounds, léger, pas à l'échec. RIR 2.", image: "curl-marteau" },
            { id: "hyper-fa-2", name: "Pushdown corde câble (priming)", sets: 2, reps: "12-15", rest: "60s", notes: "Amorce. Écarter la corde en bas. RIR 2.", image: "extension-poulie" },
          ],
        },
        {
          title: "DOS / PEC",
          exercises: [
            { id: "hyper-fa-3", name: "Tractions lestées (ou pulldown si <8 reps)", sets: 4, reps: "6-10", rest: "2 min", notes: "Prise pronation largeur épaules. Lest progressif si 8+ reps facilement. RIR 1.", image: "tractions" },
            { id: "hyper-fa-4", name: "Dips lestés (penché vers l'avant 30°)", sets: 3, reps: "8-10", rest: "2 min", notes: "Tronc penché = focus pec, amplitude profonde. RIR 1-2.", image: "dips" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "hyper-fa-5", name: "Curl pupitre EZ (preacher)", sets: 3, reps: "10-12", rest: "75s", notes: "Costa 2025 : meilleur biceps distal, complémentaire de l'incliné. Tempo 3-0-1-0.", image: "curl-pupitre" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "hyper-fa-6", name: "Skull crusher EZ vers le front", sets: 3, reps: "10-12", rest: "75s", notes: "Barre derrière la tête en bas (étirement extra), coudes fixes. RIR 1.", image: "skull-crusher" },
          ],
        },
        {
          title: "ÉPAULES",
          exercises: [
            { id: "hyper-fa-7", name: "Élévation latérale câble (1 bras à la fois)", sets: 3, reps: "12-15", rest: "60s", notes: "Bras croise le corps en bas, tension constante. RIR 0-1.", image: "elevations-poulie" },
            { id: "hyper-fa-8", name: "Élévation postérieure machine (reverse pec deck)", sets: 3, reps: "12-15", rest: "60s", notes: "Pause 1 s en contraction. RIR 0-1.", image: "oiseau" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-fa-9", name: "Cable crunch", sets: 3, reps: "12-15", rest: "60s", notes: "À genoux, flexion complète, hanches fixes. RIR 1.", image: "crunch-machine" },
            { id: "hyper-fa-10", name: "Side plank (gainage latéral)", sets: 3, reps: "25-35s/côté", rest: "30s", notes: "Corps aligné, hanches hautes, scapula stable. Obliques.", image: "side-plank" },
          ],
        },
      ],
    },
    {
      id: "hyper-bas-a",
      name: "Vendredi A — Bas du corps (lourd) + abdos",
      day: "Vendredi",
      muscleGroups: "Quadriceps, Ischios, Glutes, Mollets, Abdos",
      duration: "~95 min",
      warmup: "2 séries d'approche sur le squat. Étirements mollets si raide. Profondeur cuisses sous parallèle obligatoire. Abdos en fin de séance.",
      sections: [
        {
          title: "QUADRICEPS",
          exercises: [
            { id: "hyper-ba-1", name: "Back squat barre", sets: 4, reps: "5-7", rest: "3 min", notes: "Profond (cuisses sous parallèle), barre haute. 2 séries d'approche + 4 de travail. RIR 2.", image: "squat" },
            { id: "hyper-ba-3", name: "Leg press", sets: 3, reps: "10-12", rest: "2 min", notes: "Pieds bas/serrés pour focus quads, descente profonde. RIR 1-2.", image: "presse-cuisses" },
            { id: "hyper-ba-4", name: "Leg extension (lean back, ROM 100-65°)", sets: 3, reps: "12-15", rest: "75s", notes: "Partielles allongées (Pedrosa 2022) — s'incliner vers l'arrière. RIR 0-1.", image: "leg-extension" },
          ],
        },
        {
          title: "ISCHIOS",
          exercises: [
            { id: "hyper-ba-2", name: "Romanian deadlift (RDL)", sets: 3, reps: "8-10", rest: "2 min 30", notes: "Hanches en arrière, flexion genoux fixe, étirement max. Tempo 3-1-1-0. RIR 2.", image: "souleve-terre-roumain" },
            { id: "hyper-ba-5", name: "Seated leg curl", sets: 3, reps: "10-12", rest: "1 min 30", notes: "Maeo 2021 : exo n°1 ischios. Pause 1 s contraction. RIR 1.", image: "leg-curl" },
          ],
        },
        {
          title: "MOLLETS",
          exercises: [
            { id: "hyper-ba-6", name: "Standing calf raise + 5-8 partielles allongées", sets: 4, reps: "8-10", rest: "1 min 30", notes: "Excentrique lent, pause 2 s en bas. Partielles allongées dernière série (Kassiano 2023). Tempo 2-1-1-2.", image: "mollets-debout" },
            { id: "hyper-ba-7", name: "Seated calf raise", sets: 3, reps: "12-15", rest: "60s", notes: "Genou fléchi cible le soléaire (Maeo 2023). RIR 0-1.", image: "mollets-assis" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-ba-8", name: "Hanging leg raise (suspendu)", sets: 3, reps: "8-12", rest: "60s", notes: "Jambes tendues si possible, contrôle de la descente. RIR 1.", image: "releves-jambes" },
            { id: "hyper-ba-9", name: "Crunch machine", sets: 3, reps: "12-15", rest: "60s", notes: "Flexion complète du tronc, pause 1 s en contraction. RIR 1.", image: "crunch-machine" },
          ],
        },
      ],
    },
    {
      id: "hyper-bras-a",
      name: "Samedi A — Spé Bras (bonus)",
      day: "Samedi",
      muscleGroups: "Biceps, Triceps, Brachial",
      duration: "~50 min",
      bonus: true,
      warmup: "Format supersets antagonistes biceps/triceps (Coleman 2024). Bonus optionnel — skip si fatigue accumulée.",
      sections: [
        {
          title: "SUPERSET A — ÉTIRÉ",
          exercises: [
            { id: "hyper-bra-1", name: "A1. Curl bayesien câble (poulie basse, bras derrière)", sets: 4, reps: "10-12", rest: "0s (enchaîner A2)", notes: "Tension constante, étirement profond du long head. Tempo 3-0-1-0.", image: "curl-bayesien" },
            { id: "hyper-bra-2", name: "A2. Extension overhead haltère 1 bras", sets: 4, reps: "10-12", rest: "1 min 30", notes: "Course complète, étirement max. Tempo 3-0-1-0.", image: "extension-overhead-haltere" },
          ],
        },
        {
          title: "SUPERSET B — VOLUME",
          exercises: [
            { id: "hyper-bra-3", name: "B1. Curl marteau corde câble (poulie basse)", sets: 3, reps: "12-15", rest: "0s (enchaîner B2)", notes: "Coudes fixes, contraction pic. Brachial / brachio-radial.", image: "curl-marteau" },
            { id: "hyper-bra-4", name: "B2. Pushdown V-bar câble", sets: 3, reps: "12-15", rest: "75s", notes: "Coudes collés au tronc. Lateral/medial head.", image: "extension-poulie" },
          ],
        },
        {
          title: "SUPERSET C — FINITION",
          exercises: [
            { id: "hyper-bra-5", name: "C1. Curl spider (banc incliné face contre)", sets: 3, reps: "12-15", rest: "0s (enchaîner C2)", notes: "Bras pendant verticalement, isolation pure. RIR 0. Tempo 3-0-1-0.", image: "curl-spider" },
            { id: "hyper-bra-6", name: "C2. Kickback haltère ou câble", sets: 3, reps: "12-15", rest: "60s", notes: "Pause 1 s coude verrouillé. RIR 0. Tempo 2-0-1-1.", image: "kickback" },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────
    // SEMAINE B
    // ─────────────────────────────────────────
    {
      id: "hyper-haut-b",
      name: "Lundi B — Haut du corps (incliné/verticale) + abdos",
      day: "Lundi",
      muscleGroups: "Pec haut, Dos, Épaules, Bras, Abdos",
      duration: "~75 min",
      warmup: "Variation Sem B : focus pec clavic. (incliné 30°) + verticale (militaire). Tempo contrôlé. Abdos en fin de séance.",
      sections: [
        {
          title: "PECTORAUX",
          exercises: [
            { id: "hyper-hb-1", name: "Développé incliné haltères 30°", sets: 4, reps: "8-10", rest: "2 min 30", notes: "30°, pas 45° (Rodríguez-Ridao 2020). Haltères pour étirement profond. RIR 2.", image: "developpe-incline" },
          ],
        },
        {
          title: "DOS",
          exercises: [
            { id: "hyper-hb-2", name: "Tirage vertical poulie haute prise large", sets: 4, reps: "8-10", rest: "2 min", notes: "Coude vers la hanche, sternum haut, pause 1 s. Largeur lats. RIR 1-2.", image: "tirage-vertical" },
          ],
        },
        {
          title: "ÉPAULES",
          exercises: [
            { id: "hyper-hb-3", name: "Développé militaire barre debout (ou Smith)", sets: 3, reps: "6-8", rest: "2 min", notes: "Compound vertical lourd. RIR 2.", image: "developpe-militaire" },
            { id: "hyper-hb-4", name: "Élévation latérale câble (poulie basse, bras opposé)", sets: 4, reps: "12-15", rest: "75s", notes: "Bras croise le corps → tension dans la position étirée (Larsen 2025). RIR 0-1.", image: "elevations-poulie" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "hyper-hb-5", name: "Curl câble debout barre droite", sets: 3, reps: "10-12", rest: "75s", notes: "Coudes collés, tension constante. RIR 1.", image: "curl-barre-ez" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "hyper-hb-6", name: "Extension triceps couché EZ (skull derrière la tête)", sets: 3, reps: "10-12", rest: "75s", notes: "Barre passe derrière la tête en bas pour étirement max. Tempo 3-0-1-0.", image: "skull-crusher" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-hb-7", name: "Abdo crunch machine", sets: 3, reps: "12-15", rest: "60s", notes: "Flexion complète, pause 1 s en contraction. RIR 1.", image: "crunch-machine" },
            { id: "hyper-hb-8", name: "Planche", sets: 3, reps: "30-45s", rest: "45s", notes: "Progression : ajoute 5 s/sem. Corps aligné, pas de cassure lombaire.", image: "gainage-planche" },
          ],
        },
      ],
    },
    {
      id: "hyper-full-b",
      name: "Mercredi B — Full Body sans jambes + abdos",
      day: "Mercredi",
      muscleGroups: "Bras, Dos, Pec, Épaules, Abdos",
      duration: "~85 min",
      warmup: "Priming bras (2+2). Variante Sem B : épaisseur dos (rowing barre) + bench prise serrée + pull-over. Abdos en fin de séance.",
      sections: [
        {
          title: "PRIMING BRAS",
          exercises: [
            { id: "hyper-fb-1", name: "Curl pupitre câble (priming)", sets: 2, reps: "12", rest: "60s", notes: "Amorce biceps. Pas à l'échec. RIR 2.", image: "curl-pupitre" },
            { id: "hyper-fb-2", name: "Pushdown barre droite (priming)", sets: 2, reps: "12", rest: "60s", notes: "Amorce triceps. Pas à l'échec. RIR 2.", image: "extension-poulie" },
          ],
        },
        {
          title: "DOS",
          exercises: [
            { id: "hyper-fb-3", name: "Rowing barre buste penché (Pendlay ou Yates)", sets: 4, reps: "8-10", rest: "2 min", notes: "Variante d'épaisseur (B) vs largeur (A). Tirer vers le nombril. RIR 1-2.", image: "rowing-barre" },
            { id: "hyper-fb-5", name: "Pull-over câble bras tendus (straight-arm pulldown)", sets: 3, reps: "12-15", rest: "75s", notes: "Lats étirés en haut, étire la chaîne complète. Tempo 3-0-1-0.", image: "pullover-cable" },
          ],
        },
        {
          title: "PEC / TRICEPS",
          exercises: [
            { id: "hyper-fb-4", name: "Développé couché prise serrée", sets: 3, reps: "8-10", rest: "2 min", notes: "Mains largeur épaules, coudes serrés. Triceps + pec internes. RIR 1.", image: "developpe-couche" },
            { id: "hyper-fb-7", name: "JM press ou extension triceps EZ assis vertical", sets: 3, reps: "10-12", rest: "75s", notes: "Variante hybride skull/close-grip. RIR 0-1.", image: "jm-press" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "hyper-fb-6", name: "Curl Zottman", sets: 3, reps: "10-12", rest: "75s", notes: "Concentrique supination, excentrique pronation. Brachial + biceps + brachio-radial. Tempo 2-0-2-0.", image: "curl-zottman" },
          ],
        },
        {
          title: "ÉPAULES",
          exercises: [
            { id: "hyper-fb-8", name: "Élévation latérale machine", sets: 3, reps: "12-15", rest: "60s", notes: "Tension constante, top contraction. RIR 0-1.", image: "elevations-laterales" },
            { id: "hyper-fb-9", name: "Face pull câble", sets: 3, reps: "12-15", rest: "60s", notes: "Coudes hauts, pouces vers l'arrière. Delts post + rotateurs. RIR 0-1.", image: "face-pull" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-fb-10", name: "Cable crunch", sets: 3, reps: "12-15", rest: "60s", notes: "À genoux, flexion complète, hanches fixes. RIR 1.", image: "crunch-machine" },
            { id: "hyper-fb-11", name: "Side plank (gainage latéral)", sets: 3, reps: "25-35s/côté", rest: "30s", notes: "Hanches hautes, scapula stable. Obliques.", image: "side-plank" },
          ],
        },
      ],
    },
    {
      id: "hyper-bas-b",
      name: "Vendredi B — Bas du corps (glutes / ischios) + abdos",
      day: "Vendredi",
      muscleGroups: "Quadriceps, Ischios, Glutes, Mollets, Abdos",
      duration: "~95 min",
      warmup: "Variante Sem B : deadlift dédié + travail unilatéral + biais glutes/ischios. Forme stricte sur deadlift, non-bouncing. Abdos en fin de séance.",
      sections: [
        {
          title: "DEADLIFT",
          exercises: [
            { id: "hyper-bb-1", name: "Deadlift conventionnel", sets: 4, reps: "4-6", rest: "3 min", notes: "Forme stricte, non-bouncing. Reposer la barre entre chaque rep. RIR 2.", image: "deadlift" },
          ],
        },
        {
          title: "QUADS / GLUTES",
          exercises: [
            { id: "hyper-bb-2", name: "Bulgarian split squat (haltères)", sets: 3, reps: "8-10 / jambe", rest: "2 min / jambe", notes: "Tronc droit pour quads. Unilatéral = corrige asymétrie. Tempo 3-0-1-0. RIR 1-2.", image: "bulgarian-split-squat" },
            { id: "hyper-bb-3", name: "Hyperextension 45° (focus glutes, lestée)", sets: 3, reps: "10-12", rest: "90s", notes: "Banc romain 45°. Légère rétroversion du bassin + serrage des fesses en haut, pause 1 s. Lest contre la poitrine si trop facile. Substitut au hip thrust : même hinge, mêmes muscles. Tempo 2-1-1-1.", image: "hyperextensions" },
            { id: "hyper-bb-4", name: "Leg extension (lean back, ROM 100-65°)", sets: 4, reps: "12-15", rest: "75s", notes: "Pedrosa 2022 : partielles allongées 100°-65°. RIR 0-1.", image: "leg-extension" },
          ],
        },
        {
          title: "ISCHIOS",
          exercises: [
            { id: "hyper-bb-5", name: "Lying leg curl", sets: 3, reps: "10-12", rest: "75s", notes: "Variation au curl assis pour stresser le court chef du biceps femoris. Tempo 3-1-1-0. RIR 0-1.", image: "leg-curl" },
          ],
        },
        {
          title: "MOLLETS",
          exercises: [
            { id: "hyper-bb-6", name: "Leg press calf raise + drop set dernière série", sets: 3, reps: "8-10", rest: "1 min 30", notes: "DROP SET sur la dernière série (intro intensification, Sem 4+). Tempo 2-1-1-2.", image: "leg-press-calf" },
            { id: "hyper-bb-7", name: "Standing calf raise + 5 partielles allongées", sets: 3, reps: "10-12", rest: "60s", notes: "Partielles allongées dernière série (Kassiano 2023). Tempo 2-1-1-2.", image: "mollets-debout" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "hyper-bb-8", name: "Hanging leg raise (suspendu)", sets: 3, reps: "8-12", rest: "60s", notes: "Jambes tendues si possible, contrôle de la descente. RIR 1.", image: "releves-jambes" },
            { id: "hyper-bb-9", name: "Crunch machine", sets: 3, reps: "12-15", rest: "60s", notes: "Flexion complète du tronc, pause 1 s en contraction. RIR 1.", image: "crunch-machine" },
          ],
        },
      ],
    },
    {
      id: "hyper-bras-b",
      name: "Samedi B — Spé Bras (angles complémentaires)",
      day: "Samedi",
      muscleGroups: "Biceps, Triceps, Brachial",
      duration: "~50 min",
      bonus: true,
      warmup: "Variante Sem B : angles complémentaires + drop sets sur les finitions (Sem 4+). Skip si fatigue.",
      sections: [
        {
          title: "SUPERSET A — VOLUME",
          exercises: [
            { id: "hyper-brb-1", name: "A1. Curl haltères debout (alternés)", sets: 4, reps: "10-12", rest: "0s (enchaîner A2)", notes: "Supination active, complète. Biceps full.", image: "curl-incline" },
            { id: "hyper-brb-2", name: "A2. Dips machine assistée ou parallèles", sets: 4, reps: "10-12", rest: "1 min 30", notes: "Verticaux (sans pencher) = focus triceps. RIR 1.", image: "dips" },
          ],
        },
        {
          title: "SUPERSET B — ISOLATION",
          exercises: [
            { id: "hyper-brb-3", name: "B1. Curl pupitre 1 bras câble", sets: 3, reps: "12-15", rest: "0s (enchaîner B2)", notes: "Unilatéral, isolation pure. Tempo 3-0-1-0. RIR 0-1.", image: "curl-pupitre" },
            { id: "hyper-brb-4", name: "B2. Extension triceps inversée câble (prise supination)", sets: 3, reps: "12-15", rest: "75s", notes: "Recrutement différent du pushdown classique. Triceps médial. RIR 0-1.", image: "extension-supination" },
          ],
        },
        {
          title: "SUPERSET C — FINITION + DROP SET",
          exercises: [
            { id: "hyper-brb-5", name: "C1. Curl concentré (bras pendant) + DROP SET", sets: 3, reps: "12-15", rest: "0s (enchaîner C2)", notes: "Drop set 25 % poids dernière série → échec. RIR 0. Tempo 3-0-1-0.", image: "curl-concentre" },
            { id: "hyper-brb-6", name: "C2. Pushdown corde + DROP SET", sets: 3, reps: "15-20", rest: "75s", notes: "Drop set 25 % poids dernière série → échec. Tempo 2-0-1-1.", image: "extension-poulie" },
          ],
        },
      ],
    },
  ],
  schedule: [
    { day: "Lundi", session: "hyper-haut-a", label: "HAUT" },
    { day: "Mardi", session: null, label: "Repos" },
    { day: "Mercredi", session: "hyper-full-a", label: "FULL" },
    { day: "Jeudi", session: null, label: "Repos" },
    { day: "Vendredi", session: "hyper-bas-a", label: "BAS" },
    { day: "Samedi", session: "hyper-bras-a", label: "BRAS" },
    { day: "Dimanche", session: null, label: "Repos complet" },
  ],
};

// ─── Infos détaillées du programme (page /programme/hypertrophie) ───
export const programHypertrophieInfo = {
  programId: "hypertrophie",
  title: "Hypertrophie 2 semaines",
  subtitle: "Biais bras et jambes — débutant éclairé",
  version: "v4",
  duration: "8 semaines + 1 deload",

  overview: {
    goal: "Lean bulk : 0,25-0,5 % du poids/sem",
    profile: "Lean ectomorphe (1m92 / 81 kg)",
    sessions: "4 séances / sem · alternance Sem A / Sem B",
    priority: "Bras 18-21 séries · Jambes 10-12 séries directes + indirect lourd",
    novelty: "Abdos en fin de séance avec rotation machine + gainage entre A et B.",
  },

  schedule: [
    { day: "Lundi",    session: "Haut + abdos",                   duration: "70-80 min", emoji: "💪" },
    { day: "Mardi",    session: "Repos",                           duration: "—",         emoji: "😴" },
    { day: "Mercredi", session: "Full Body sans jambes + abdos",  duration: "80-90 min", emoji: "🔁" },
    { day: "Jeudi",    session: "Repos",                           duration: "—",         emoji: "😴" },
    { day: "Vendredi", session: "Bas du corps + abdos",           duration: "90-100 min", emoji: "🦵" },
    { day: "Samedi",   session: "Spé Bras (bonus optionnel)",     duration: "45-60 min", emoji: "🔥" },
    { day: "Dimanche", session: "Repos",                           duration: "—",         emoji: "😴" },
  ],

  abdosRotation: [
    { day: "Lundi",    exercises: "Abdo crunch machine + Planche" },
    { day: "Mercredi", exercises: "Cable crunch + Side plank" },
    { day: "Vendredi", exercises: "Hanging leg raise + Crunch machine" },
  ],

  volumeTable: [
    { muscle: "Biceps",            weekly: "18-20", freq: "3-4×",  target: "MAV haut", priority: true },
    { muscle: "Triceps",           weekly: "18-21", freq: "3-4×",  target: "MAV haut", priority: true },
    { muscle: "Quadriceps",        weekly: "10-12", freq: "1-2×",  target: "MAV",      priority: true },
    { muscle: "Ischios",           weekly: "6-7",   freq: "1-2×",  target: "MEV-MAV",  priority: false },
    { muscle: "Glutes",            weekly: "10-13", freq: "1-2×",  target: "MAV",      priority: false },
    { muscle: "Pectoraux",         weekly: "7-8",   freq: "2×",    target: "MEV-MAV",  priority: false },
    { muscle: "Dos",               weekly: "8-11",  freq: "2×",    target: "MAV",      priority: false },
    { muscle: "Delts latéraux",    weekly: "6-7",   freq: "2×",    target: "MEV",      priority: false },
    { muscle: "Delts postérieurs", weekly: "6",     freq: "2×",    target: "MEV",      priority: false },
    { muscle: "Mollets",           weekly: "7",     freq: "1-2×",  target: "MEV",      priority: false },
    { muscle: "Abdos",             weekly: "8-9",   freq: "3×",    target: "MEV-MAV",  priority: false },
  ],

  nutrition: {
    maintenance: "2 950-3 200 kcal/jour",
    target: "3 300 kcal/jour (lean bulk)",
    adjust: [
      { gain: "< 0,2 kg/sem", action: "+200 kcal" },
      { gain: "0,2-0,4 kg/sem", action: "Maintien ✅" },
      { gain: "> 0,5 kg/sem", action: "−200 kcal" },
    ],
    macros: [
      { name: "Protéines", grams: "162 g", ratio: "2,0 g/kg", kcal: 650 },
      { name: "Lipides",   grams: "80 g",  ratio: "1,0 g/kg", kcal: 720 },
      { name: "Glucides",  grams: "490 g", ratio: "6,1 g/kg", kcal: 1960 },
    ],
    supplements: [
      { name: "Créatine mono", dose: "5 g/jour",          why: "Meilleur effet hypertrophie/force documenté (ISSN 2017)", essential: true },
      { name: "Whey",          dose: "25-50 g/jour",      why: "Compléter les protéines" },
      { name: "Vit. D3",       dose: "2 000-4 000 UI",    why: "Récupération" },
      { name: "Multivit",      dose: "1/jour",            why: "Filet de sécurité" },
    ],
    tips: [
      "Pèse-toi 3-4×/sem à jeun, fais une moyenne hebdo.",
      "4 vrais repas ~40 g protéines (seuil leucine 0,4 g/kg/repas).",
      "Glucides denses : riz, pâtes, flocons. Lipides denses : huile olive, BC, amandes.",
      "Shake hyper-calo si plateau : lait entier + whey + flocons + BC + banane = ~800 kcal.",
      "Hydratation : 3,5-4 L/jour, +500-1000 ml/h training.",
    ],
  },

  progression: {
    method: "Double progression (Helms / RP)",
    rule: "Quand tu hits le haut de la fourchette sur toutes les séries au RIR cible → augmente le poids.",
    increments: "Compounds haut +2,5 kg · Compounds bas +5 kg · Isolations +1,25-2,5 kg",
    example: "Bench 4×6-8 : 60×6,6,6,6 → 60×7,7,7,6 → 60×8,8,8,8 ✅ → 62,5×6,6,6,6",
    plan: [
      { week: 1, rir: "3-4", volume: "Bas",                              load: "−10 %",    label: "Intro" },
      { week: 2, rir: "2-3", volume: "Plein",                             load: "Cible",    label: "Build" },
      { week: 3, rir: "1-2", volume: "Plein +1 série top isolations",     load: "Cible +",  label: "Build" },
      { week: 4, rir: "1-2", volume: "Plein",                             load: "Cible ++", label: "Build" },
      { week: 5, rir: "0-1", volume: "Plein + intensification",           load: "Max",      label: "Overreach" },
      { week: 6, rir: "3-4", volume: "−50 %",                             load: "Maintenue", label: "Deload" },
    ],
  },

  intensification: [
    { phase: "Sem 1-3",  name: "Aucune",                details: "Maîtrise technique + double progression seule." },
    { phase: "Sem 4-8",  name: "Drop sets",             details: "Dernière série isolation machine → échec → −20-25 % → échec. 1-2 exos max/séance." },
    { phase: "Sem 9-14", name: "Partielles allongées",  details: "À l'échec ROM → 5-8 partielles dans la moitié basse. 2-3 exos/sem." },
    { phase: "Sem 15+",  name: "Myo-reps",              details: "Activation 10-15 reps à 1 RIR → 3-5 respi → mini-set 3-5 → repeat. Réservé isolations machines." },
  ],
  intensificationGoldenRule: "JAMAIS d'intensification sur compounds libres (squat, DL, bench, OHP, row barre).",

  errors: [
    "Sous-manger en croyant manger assez (erreur n°1 ectomorphe).",
    "Bâcler le vendredi — jambes = priorité.",
    "Ajouter du volume bras au-delà de 18-20 séries.",
    "Intensifier dès la sem 1 : double progression d'abord.",
    "Squat pas assez profond (talon surélevé si chevilles raides).",
    "Inverser l'ordre : compounds toujours avant isolations (sauf priming bras).",
    "Tester son 1RM chaque semaine — c'est de l'hypertrophie : 6-15 reps.",
    "Changer de programme avant 8 semaines.",
    "Barres protéinées comme repas (200 kcal vs 700-900 d'un vrai repas).",
    "Skipper le deload semaine 6.",
    "Faire les abdos en début de séance (= stabilisateurs des compounds).",
  ],

  golden: [
    "Manger 3 300 kcal chaque jour, même sans faim.",
    "Dormir 8 h sacrées, pas d'écran 30 min avant, chambre 18-19 °C.",
    "Tempo : excentrique 2-3 s, concentrique explosif (1 s).",
    "Repos : 2-3 min compounds, 1-2 min isolations.",
    "Abdos en fin de séance, jamais avant.",
    "Discipline > variété. 8 semaines minimum sur ce programme.",
  ],
};

