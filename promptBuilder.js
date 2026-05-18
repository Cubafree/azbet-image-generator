const { PROMPT_BLOCKS: B } = require('./config');

const DEFAULT_SCENES = {
  casino: {
    woman: {
      egypt: 'A beautiful Egyptian woman in elegant traditional attire holding a glowing slot reel, surrounded by floating gold coins and gems, ancient temple background.',
      morocco: 'A beautiful Moroccan woman in ornate kaftan holding playing cards, surrounded by floating gold coins, Moroccan riad background with lantern light.',
      algeria: 'A beautiful Algerian woman in traditional karakou dress surrounded by floating casino chips and gold coins, Andalusian architecture background.',
      libya: 'A beautiful Libyan woman in modest traditional dress reaching toward a glowing slot reel, desert ruins at night background.',
    },
    man: {
      egypt: 'A confident Egyptian man in white thobe surrounded by glowing casino objects and floating gold coins, ancient Egyptian temple background.',
      morocco: 'A confident Moroccan man in embroidered kaftan holding playing cards, floating gold coins, Moroccan riad background.',
      algeria: 'A confident Algerian man in traditional jacket celebrating near glowing slot reels and gold coins, Algerian architecture background.',
      libya: 'A confident Libyan man in white thobe with traditional vest surrounded by casino chips and gold coins, desert landscape background.',
    },
    object: 'Dramatic arrangement of glowing casino objects: slot reel drum showing 777, casino chips, playing cards, floating gold coins — dynamic mid-air composition with cinematic neon lighting.',
  },
  sport: {
    woman: {
      egypt: 'A beautiful Egyptian woman in traditional attire celebrating a sports victory, surrounded by trophies and gold coins, Egyptian architectural background.',
      morocco: 'A beautiful Moroccan woman in kaftan celebrating near a gleaming trophy with gold coins, Moroccan riad background.',
      algeria: 'A beautiful Algerian woman in traditional dress near a glowing trophy overflowing with coins, Algerian architecture background.',
      libya: 'A beautiful Libyan woman in traditional dress celebrating a sports win with trophy and gold coins, desert ruins background.',
    },
    man: {
      egypt: 'A confident Egyptian footballer in motion with neon energy trails and gold coins, Egyptian architectural background with stadium lights.',
      morocco: 'A confident Moroccan athlete in a victory pose near a gleaming trophy, gold coins scattering, Moroccan background.',
      algeria: 'A confident Algerian athlete celebrating with a trophy and coins, neon stadium atmosphere, Algerian architecture.',
      libya: 'A confident Libyan athlete in victorious pose with trophy and floating gold coins, desert stadium atmosphere.',
    },
    object: 'Dramatic arrangement of sport objects: gleaming trophy cup overflowing with gold coins, sport ball with neon energy trails, floating gems and particles — dynamic energetic composition.',
  },
};

function buildPrompt(params) {
  const { vertical, country, subject, sportType, accentColor, scenePrompt } = params;

  const blocks = [
    B.BASE_VERTICAL[vertical],
    subject === 'object' ? B.SUBJECT_BLOCK.object[vertical] : B.SUBJECT_BLOCK[subject],
    B.COUNTRY_BLOCK[country],
  ];

  if (vertical === 'sport' && subject !== 'object') {
    blocks.push(B.SPORT_BLOCK[sportType || 'general']);
  }

  blocks.push(B.COLOR_BLOCK[accentColor]);
  blocks.push(B.COMPOSITION_RULES);
  blocks.push(B.COMPLIANCE_RULES);

  const systemPrompt = blocks.join('\n\n');

  let userPrompt;
  if (scenePrompt?.trim()) {
    userPrompt = scenePrompt.trim();
  } else if (subject === 'object') {
    userPrompt = DEFAULT_SCENES[vertical].object;
  } else {
    userPrompt = DEFAULT_SCENES[vertical]?.[subject]?.[country] || `Generate a ${vertical} marketing banner for ${country} with a ${subject} subject.`;
  }

  return { systemPrompt, userPrompt };
}

module.exports = { buildPrompt };
