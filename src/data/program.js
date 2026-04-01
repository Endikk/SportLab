export const program = {
  name: "Programme Prise de Masse — Push / Pull / Legs",
  level: "Intermédiaire",
  location: "Salle de sport",
  frequency: "3 à 4 séances/semaine",
  sessions: [
    {
      id: "push",
      name: "Séance 1 — PUSH",
      day: "Lundi",
      muscleGroups: "Pectoraux, Épaules, Triceps, Abdos",
      duration: "~70 min",
      warmup: "2 séries légères de développé couché (barre à vide puis 50%) avant les séries effectives.",
      sections: [
        {
          title: "PECTORAUX",
          exercises: [
            { id: "push-1", name: "Développé couché (barre)", sets: 4, reps: "8-10", rest: "2 min 30", notes: "Exercice de base, charges lourdes", image: "developpe-couche.jpg" },
            { id: "push-2", name: "Développé incliné (haltères)", sets: 4, reps: "10-12", rest: "2 min", notes: "Angle 30-45°", image: "developpe-incline.jpg" },
            { id: "push-3", name: "Écarté poulie vis-à-vis", sets: 3, reps: "12-15", rest: "1 min 30", notes: "Serrer en haut, contrôler", image: "ecarte-poulie.jpg" },
          ],
        },
        {
          title: "ÉPAULES",
          exercises: [
            { id: "push-4", name: "Développé militaire (haltères)", sets: 4, reps: "8-10", rest: "2 min", notes: "Debout ou assis", image: "developpe-militaire.jpg" },
            { id: "push-5", name: "Élévations latérales", sets: 4, reps: "12-15", rest: "1 min", notes: "Contrôle à la descente", image: "elevations-laterales.jpg" },
            { id: "push-6", name: "Oiseau (écarté inversé)", sets: 3, reps: "12-15", rest: "1 min", notes: "Épaules arrière", image: "oiseau.jpg" },
          ],
        },
        {
          title: "TRICEPS",
          exercises: [
            { id: "push-7", name: "Dips (lestés si possible)", sets: 3, reps: "8-12", rest: "2 min", notes: "Buste droit pour cibler triceps", image: "dips.jpg" },
            { id: "push-8", name: "Extension poulie haute (corde)", sets: 3, reps: "12-15", rest: "1 min", notes: "Écarter la corde en bas", image: "extension-poulie.jpg" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "push-9", name: "Crunch machine", sets: 3, reps: "12-15", rest: "1 min", notes: "Charge progressive, expirer fort", image: "crunch-machine.jpg" },
            { id: "push-10", name: "Relevés de jambes (suspendu)", sets: 3, reps: "10-15", rest: "1 min", notes: "Bassin qui remonte", image: "releves-jambes.jpg" },
          ],
        },
      ],
    },
    {
      id: "pull",
      name: "Séance 2 — PULL",
      day: "Mercredi",
      muscleGroups: "Dos, Trapèzes, Biceps, Abdos",
      duration: "~75 min",
      warmup: "Les tractions sont clés pour la largeur du dos. Si tu fais plus de 10 reps facilement, ajoute du lest.",
      sections: [
        {
          title: "DOS (ÉPAISSEUR)",
          exercises: [
            { id: "pull-1", name: "Rowing barre (pronation)", sets: 4, reps: "8-10", rest: "2 min 30", notes: "Buste penché ~45°, tirer vers le nombril", image: "rowing-barre.jpg" },
            { id: "pull-2", name: "Rowing haltère unilatéral", sets: 3, reps: "10-12", rest: "1 min 30", notes: "Chaque côté, serrer l'omoplate", image: "rowing-haltere.jpg" },
          ],
        },
        {
          title: "DOS (LARGEUR)",
          exercises: [
            { id: "pull-3", name: "Tractions (lestées si possible)", sets: 4, reps: "6-10", rest: "2 min", notes: "Prise large, pronation", image: "tractions.jpg" },
            { id: "pull-4", name: "Tirage vertical poulie", sets: 3, reps: "10-12", rest: "1 min 30", notes: "Prise serrée ou neutre", image: "tirage-vertical.jpg" },
          ],
        },
        {
          title: "TRAPÈZES / LOMBAIRES",
          exercises: [
            { id: "pull-5", name: "Shrugs haltères", sets: 3, reps: "12-15", rest: "1 min", notes: "Monter les épaules, tenir 1s", image: "shrugs.jpg" },
            { id: "pull-6", name: "Hyperextensions", sets: 3, reps: "12-15", rest: "1 min", notes: "Lestées si trop facile", image: "hyperextensions.jpg" },
          ],
        },
        {
          title: "BICEPS",
          exercises: [
            { id: "pull-7", name: "Curl barre EZ", sets: 4, reps: "10-12", rest: "1 min 30", notes: "Pas de triche, contrôler", image: "curl-barre-ez.jpg" },
            { id: "pull-8", name: "Curl incliné haltères", sets: 3, reps: "10-12", rest: "1 min", notes: "Banc à 45°, étirement max", image: "curl-incline.jpg" },
            { id: "pull-9", name: "Curl marteau", sets: 3, reps: "10-12", rest: "1 min", notes: "Cible le brachial", image: "curl-marteau.jpg" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "pull-10", name: "Crunch machine", sets: 3, reps: "15-20", rest: "1 min", notes: "Séries longues, contraction lente", image: "crunch-machine.jpg" },
            { id: "pull-11", name: "Gainage planche", sets: 3, reps: "45-60s", rest: "45s", notes: "Corps aligné, serrer les abdos", image: "gainage-planche.jpg" },
          ],
        },
      ],
    },
    {
      id: "legs",
      name: "Séance 3 — LEGS",
      day: "Vendredi",
      muscleGroups: "Quadriceps, Ischios, Mollets, Abdos",
      duration: "~65 min",
      warmup: "Le squat est le roi des exercices jambes. Échauffement progressif obligatoire. Ne néglige jamais les mollets !",
      sections: [
        {
          title: "QUADRICEPS",
          exercises: [
            { id: "legs-1", name: "Squat barre (back squat)", sets: 4, reps: "6-10", rest: "3 min", notes: "Profondeur parallèle minimum", image: "squat.jpg" },
            { id: "legs-2", name: "Presse à cuisses", sets: 4, reps: "10-12", rest: "2 min", notes: "Pieds mi-hauteur, écartés", image: "presse-cuisses.jpg" },
            { id: "legs-3", name: "Leg extension", sets: 3, reps: "12-15", rest: "1 min", notes: "Contracter en haut 1s", image: "leg-extension.jpg" },
          ],
        },
        {
          title: "ISCHIO-JAMBIERS",
          exercises: [
            { id: "legs-4", name: "Soulevé de terre roumain", sets: 4, reps: "8-10", rest: "2 min", notes: "Étirement ischios, dos neutre", image: "souleve-terre-roumain.jpg" },
            { id: "legs-5", name: "Leg curl allongé", sets: 3, reps: "10-12", rest: "1 min 30", notes: "Contrôle excentrique", image: "leg-curl.jpg" },
          ],
        },
        {
          title: "MOLLETS",
          exercises: [
            { id: "legs-6", name: "Mollets debout (machine)", sets: 4, reps: "12-15", rest: "1 min", notes: "Amplitude complète", image: "mollets-debout.jpg" },
            { id: "legs-7", name: "Mollets assis", sets: 3, reps: "15-20", rest: "1 min", notes: "Cible le soléaire", image: "mollets-assis.jpg" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "legs-8", name: "Crunch machine", sets: 4, reps: "12-15", rest: "1 min", notes: "Monter la charge, reps contrôlées", image: "crunch-machine.jpg" },
            { id: "legs-9", name: "Woodchop au câble", sets: 3, reps: "12/côté", rest: "1 min", notes: "Obliques, mouvement fluide", image: "woodchop.jpg" },
          ],
        },
      ],
    },
    {
      id: "bonus",
      name: "Séance 4 — BONUS",
      day: "Samedi",
      muscleGroups: "Épaules, Bras, Abdos",
      duration: "~55 min (optionnelle)",
      warmup: "Les supersets biceps/triceps sont parfaits : gain de temps et congestion maximale.",
      sections: [
        {
          title: "ÉPAULES (FOCUS)",
          exercises: [
            { id: "bonus-1", name: "Développé Arnold", sets: 4, reps: "10-12", rest: "2 min", notes: "Rotation contrôlée", image: "developpe-arnold.jpg" },
            { id: "bonus-2", name: "Élévations latérales (poulie)", sets: 4, reps: "12-15", rest: "1 min", notes: "Tension constante", image: "elevations-poulie.jpg" },
            { id: "bonus-3", name: "Face pull (poulie haute)", sets: 3, reps: "15-20", rest: "1 min", notes: "Rotation externe en haut", image: "face-pull.jpg" },
          ],
        },
        {
          title: "BRAS (SUPERSET)",
          exercises: [
            { id: "bonus-4", name: "Curl pupitre + Barre au front", sets: 4, reps: "10-12", rest: "1 min 30", notes: "Superset biceps/triceps", image: "curl-pupitre.jpg" },
            { id: "bonus-5", name: "Curl concentré + Kickback", sets: 3, reps: "12-15", rest: "1 min", notes: "Superset finition", image: "curl-concentre.jpg" },
          ],
        },
        {
          title: "ABDOMINAUX",
          exercises: [
            { id: "bonus-6", name: "Crunch machine", sets: 4, reps: "10-12", rest: "1 min", notes: "Charge lourde, tempo lent 3-1-1", image: "crunch-machine.jpg" },
            { id: "bonus-7", name: "Relevés de jambes (suspendu)", sets: 3, reps: "10-15", rest: "1 min", notes: "Bassin qui remonte", image: "releves-jambes.jpg" },
            { id: "bonus-8", name: "Gainage planche", sets: 3, reps: "45-60s", rest: "45s", notes: "Corps aligné, ne pas creuser", image: "gainage-planche.jpg" },
          ],
        },
      ],
    },
  ],
  schedule: [
    { day: "Lundi", session: "push", label: "PUSH" },
    { day: "Mardi", session: null, label: "Repos" },
    { day: "Mercredi", session: "pull", label: "PULL" },
    { day: "Jeudi", session: null, label: "Repos" },
    { day: "Vendredi", session: "legs", label: "LEGS" },
    { day: "Samedi", session: "bonus", label: "BONUS" },
    { day: "Dimanche", session: null, label: "Repos complet" },
  ],
};
