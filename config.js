const PROMPT_BLOCKS = {
  BASE_VERTICAL: {
    casino: `You are a professional marketing image generation assistant for an iGaming casino brand (AzimutBet) targeting the MENA region. Generate a single high-quality photorealistic advertising visual. The image will be used as a mobile banner creative for media buying campaigns. Portrait orientation 1024x1792.`,
    sport: `You are a professional marketing image generation assistant for an iGaming sports betting brand (AzimutBet) targeting the MENA region. Generate a single high-quality photorealistic advertising visual. The image will be used as a mobile banner creative for media buying campaigns. Portrait orientation 1024x1792.`,
  },

  SUBJECT_BLOCK: {
    woman: `MAIN SUBJECT: A beautiful, confident woman aged 25–32 with a warm smile. She must wear fully modest traditional attire appropriate for the target region (defined below). She is the hero of the composition, positioned center to lower-center of the frame. She must visually interact with a relevant casino or sport element — holding it, reaching toward it, or being surrounded by it.`,
    man: `MAIN SUBJECT: A handsome, confident man aged 25–35 with an energetic or victorious expression. He must wear fully modest traditional attire appropriate for the target region (defined below). He is the hero of the composition, positioned center to lower-center of the frame. He must visually interact with a relevant casino or sport element — holding it, reaching toward it, celebrating near it.`,
    object: {
      casino: `MAIN SUBJECT: No human character. The hero of the composition is a dramatic arrangement of casino objects: a glowing slot reel drum showing 777, scattered casino chips, playing cards, and floating gold coins. Objects should feel dynamic — mid-air, spinning, falling — with cinematic lighting hitting each element.`,
      sport: `MAIN SUBJECT: No human character. The hero of the composition is a dramatic arrangement of sport objects: a gleaming trophy cup overflowing with gold coins, a sport ball (type defined below) with neon energy trails, floating gems and particles. Objects should feel dynamic and energetic.`,
    },
  },

  COUNTRY_BLOCK: {
    egypt: `REGIONAL STYLE — EGYPT:
Character attire: elegant dark-toned traditional Egyptian-inspired dress or modern modest fashion with gold jewelry. For men: white thobe or smart casual with keffiyeh.
Background: ancient Egyptian architectural elements — hieroglyphic stone walls, temple columns, torchlight or moonlight, golden desert atmosphere, mystical dark sky.
Mood: mysterious, ancient, powerful.`,
    morocco: `REGIONAL STYLE — MOROCCO:
Character attire: ornate Moroccan kaftan or djellaba with intricate gold embroidery, jewel tones (deep blue, burgundy, emerald). For men: traditional jabador or embroidered kaftan.
Background: Moroccan riad interior — zellige tile walls, carved arches, brass lanterns casting warm amber light, or open courtyard with palm trees at dusk.
Mood: warm, luxurious, culturally rich.`,
    algeria: `REGIONAL STYLE — ALGERIA:
Character attire: traditional Algerian karakou or embroidered dress with gold details, rich colors. For men: traditional burnous or smart traditional jacket.
Background: blend of Andalusian and North African architecture — whitewashed walls, ornate wooden balconies, dark evening light, neon reflections on stone.
Mood: elegant, bold, contemporary-traditional fusion.`,
    libya: `REGIONAL STYLE — LIBYA:
Character attire: modest traditional Libyan dress with embroidery, gold accents, neutral to warm tones. For men: white thobe with traditional vest.
Background: desert landscape with ancient Libyan/Roman ruins at night, or modern dark interior with Middle Eastern decorative elements.
Mood: timeless, dignified, desert-influenced.`,
  },

  SPORT_BLOCK: {
    football: `SPORT CONTEXT — FOOTBALL:
If a human subject is present: athletic male footballer in motion — dynamic running or celebrating pose, wearing a football jersey. No specific real-player likeness — create a fictional MENA-region athlete that fits the country's typical appearance.
Sport objects: football with neon energy trails, stadium lights in background (bokeh), gold coins and gems scattering around the action.`,
    tennis: `SPORT CONTEXT — TENNIS:
If a human subject is present: athletic player mid-swing or serving, tennis racket prominent. No specific real-player likeness.
Sport objects: tennis ball with light trail, racket with neon glow, court lines suggested in background, gold coins and gems.`,
    basketball: `SPORT CONTEXT — BASKETBALL:
If a human subject is present: athletic player in jump or dribble pose.
Sport objects: basketball with neon glow, arena lights bokeh background, trophy and coins.`,
    general: `SPORT CONTEXT — GENERAL SPORTS:
Use a trophy as the hero object with gold coins overflowing. Background: dark stadium atmosphere with crowd lights blurred into bokeh. If a human subject is present: athletic male in a victorious celebration pose, no sport-specific gear.`,
  },

  COLOR_BLOCK: {
    cyan: `ACCENT COLOR SYSTEM — CYAN/ELECTRIC BLUE:
Primary accent: #00d4ff (electric cyan).
Apply to: particle effects, neon glow around objects, light trails, gem colors (sapphire/aqua), energy emanating from casino/sport elements.
Background gradient accent: deep navy (#0a0e2e) with cyan rim lighting on subject.`,
    green: `ACCENT COLOR SYSTEM — EMERALD GREEN:
Primary accent: #00e676 (emerald green).
Apply to: particle effects, neon glow around objects, light trails, gem colors (emerald/jade), energy emanating from casino/sport elements.
Background gradient accent: very dark green-black (#050f0a) with emerald rim lighting on subject.`,
    purple: `ACCENT COLOR SYSTEM — PURPLE/VIOLET:
Primary accent: #8b5cf6 (violet purple).
Apply to: particle effects, neon glow around objects, light trails, gem colors (amethyst/crystal), energy emanating from casino/sport elements.
Background gradient accent: near-black with deep purple (#1a0533) with violet rim lighting on subject.`,
    gold: `ACCENT COLOR SYSTEM — LUXURY GOLD:
Primary accent: #ffd700 (rich gold).
Apply to: particle effects, golden glow around objects, light trails, gem colors (topaz/amber/gold), energy emanating from casino/sport elements. Floating gold coins should have an intensified warm glow.
Background gradient accent: very dark brown-black (#0d0800) with warm amber/gold rim lighting on subject. Overall mood: opulent, premium, Middle-Eastern luxury.`,
  },

  COMPOSITION_RULES: `COMPOSITION:
- Visually balanced, cinematic composition
- Subject or main object occupies center to lower-center of frame
- Upper 18% of image: naturally dark and clean — this area will have a logo overlaid in post-production, avoid placing important visual elements here
- Lower 14% of image: dark gradient fade to near-black — app store badges will be overlaid here, keep this area clean
- Background recedes visually behind the subject — depth of field, bokeh, atmospheric haze — background must not compete with the main subject
- Dramatic cinematic lighting: strong key light from one side, dark moody fill
- Include 3–5 floating magical abundance elements: gold coins, glowing crystals, neon particles — these should feel dynamic, mid-air, not static`,

  COMPLIANCE_RULES: `STRICT MENA COMPLIANCE — NEVER INCLUDE:
- Alcohol, wine, beer, spirits or any drinking
- Nudity, revealing clothing, bare midriff, décolletage, form-fitting silhouettes
- Sexually suggestive poses or expressions
- Gambling tables with dealers or casino floor scenes
- Pork or non-halal food
- Religious symbols used decoratively
- Political figures or political messaging
- Violence, weapons, blood
- LGBTQ+ themes or symbolism
- Western party/nightclub aesthetic
DO NOT render any text, numbers, words, or logos anywhere in the image.

ANATOMY — CRITICAL QUALITY REQUIREMENT:
Every visible hand must have exactly 5 anatomically correct fingers — no extra fingers, no missing fingers, no fused or merged digits, no unnaturally bent joints. If a person is holding a phone, the grip must be completely natural and realistic: thumb on one side, four fingers on the other, all fingers clearly defined and properly proportioned. Incorrect hand anatomy is unacceptable — treat this as the highest priority technical requirement.`,

  CASINO_THEMES: {
    egypt: {
      day:           `SCENE THEME — EGYPTIAN DAY: The scene takes place in full Egyptian daylight. Brilliant desert sunlight, clear blue sky with golden haze. All architectural elements bathed in warm afternoon sunlight with long dramatic shadows. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      night:         `SCENE THEME — EGYPTIAN NIGHT: Deep Egyptian midnight. Vast starry sky. Ancient stone architecture lit by flickering torches and moonlight. Silver highlights across sand, rich blue-black shadows with ochre torch-glow. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      palms:         `SCENE THEME — EGYPTIAN PALMS: Background dominated by tall stately date palms swaying in a warm Nile-delta breeze. Warm golden light filtering through dense fronds, glimpses of clear sky, verdant Nile-side garden atmosphere. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      sea:           `SCENE THEME — EGYPTIAN MEDITERRANEAN COAST: Background is the shimmering Alexandria Riviera. Crystal turquoise-blue sea meeting white sandy beach, elegant white coastal architecture, clear blue sky. Fresh, breezy, the elegant Egyptian Riviera. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      pyramids:      `SCENE THEME — PYRAMIDS OF GIZA: Background features the iconic Great Pyramids of Giza rising dramatically from golden Saharan sand. All three major pyramids clearly visible as monumental ancient backdrop. Vast desert sky, timeless and majestic. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      sphinx:        `SCENE THEME — THE GREAT SPHINX: Background prominently features the Great Sphinx of Giza — enormous, carved from golden limestone, staring eternally across the desert. Long dramatic shadows across sandy desert floor. Mystical ancient atmosphere. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      yachts:        `SCENE THEME — LUXURY YACHTS ON EGYPTIAN WATERS: Background features gleaming white luxury superyachts moored in a glittering Egyptian marina (Alexandria or Hurghada). Deep cobalt-blue Mediterranean water, reflections of yacht lights, opulent nautical wealth. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      gold_room:     `SCENE THEME — CHAMBER OF GOLD: The scene is set in an extraordinary Egyptian treasure chamber — gilded walls with ancient Egyptian motifs, towering stacks of ancient gold coins, treasure chests overflowing with jewels and artifacts, golden torchlight reflecting everywhere. Maximum opulence. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      sportscar:     `SCENE THEME — LUXURY SPORTS CAR IN EGYPT: A gleaming luxury sports car — matte gold or jet black, Lamborghini or Ferrari silhouette — parked dramatically on a desert road with the Pyramids of Giza visible in the background. Editorial-fashion desert scene, warm golden sunset light. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      villa_pyramids:`SCENE THEME — LUXURY VILLA BY THE PYRAMIDS: Background shows a spectacular modern luxury villa with infinity pool and manicured garden, situated with a dramatic direct view of the Pyramids of Giza. Golden sunset sky, lush palms around the villa. Ultra-premium lifestyle atmosphere. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      villa_sea:     `SCENE THEME — EGYPTIAN RIVIERA LUXURY VILLA: Background shows an opulent Egyptian Riviera villa — white marble infinity pool terrace overlooking the turquoise Mediterranean Sea, flanked by tall palms, gleaming white superyachts in the sparkling water below. Cinematic golden-hour light. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
    },
    morocco: {
      day:              `SCENE THEME — MOROCCAN DAY: Full warm midday light in Morocco. Brilliant amber-golden Maghrebi sunshine. Traditional ochre-red architecture glows in warm light, clear blue sky, sharp architectural shadows. Vibrant, sun-drenched. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      night:            `SCENE THEME — MOROCCAN NIGHT: Deep Moroccan night. Traditional brass lanterns cast warm amber pools of light in richly carved interiors. Stars above rooftops. Dark jewel-toned atmosphere with warm lamp-glow accents. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      kasbah:           `SCENE THEME — MOROCCAN KASBAH: Background features a dramatic ancient Moroccan kasbah-fortress — towering red-ochre earthen ramparts, massive carved gates, battlements and fortified towers. Saharan desert light, long dramatic shadows. Ancient monumental power. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      bahia_palace:     `SCENE THEME — BAHIA PALACE, MARRAKESH: Background is the opulent Bahia Palace — ornate multi-colored zellige tile floors, intricately carved stucco archways, painted cedar ceilings, open courtyard with orange trees. Grand Moroccan palatial splendor. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      jemaa_fna:        `SCENE THEME — JEMAA EL-FNA SQUARE: Background is the legendary Jemaa el-Fna square of Marrakesh — vast open plaza, the iconic Koutoubia minaret silhouetted against a warm evening sky. Africa's most famous square. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      draa_valley:      `SCENE THEME — DRAA VALLEY: Background is the dramatic Draa Valley — Morocco's longest river valley between rocky mountains, lined with palm oases and ochre ksar villages. Monumental desert landscape. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      minaret:          `SCENE THEME — MOROCCAN MINARET: A grand Moroccan minaret — Hassan II Mosque style or Koutoubia — towers dramatically in the background, intricate green-and-white zellige tilework gleaming against a rich deep blue sky. Majestic, iconic. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      tall_palms:       `SCENE THEME — TALL MOROCCAN PALMS: Background dominated by magnificent towering Moroccan palms — tall, lush, full-canopied, swaying gently. Rich warm light filtering through dense tropical canopy, glimpse of architecture beyond. Moroccan oasis garden. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      red_walls:        `SCENE THEME — RED WALLS OF MARRAKESH: Background is the famous red-pink pisé walls of Marrakesh — massive, textured, warm terracotta-red, sun-baked and ancient. The iconic Pink City walls in golden afternoon light. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      red_columns:      `SCENE THEME — MOROCCAN RED COLUMNS: Scene features dramatic colonnaded arches of warm red Marrakesh stone — repeated horseshoe arches, ornate carved details, dappled shadow patterns on zellige tile floors. Palatial courtyard atmosphere. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      desert_oasis:     `SCENE THEME — SAHARAN OASIS: Background is Moroccan Sahara with a magical oasis — towering golden sand dunes glowing in warm light, a lush green oasis of palms with a still reflective pool in the distance. Magical contrast of desert and life. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      sportscar_desert: `SCENE THEME — SPORTS CAR IN THE SAHARA: A gleaming luxury sports car — matte gold or black, Lamborghini style — parked on a Saharan dune road, vast golden dunes sweeping behind it. High-fashion desert editorial, cinematic sunset light. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      canyon:           `SCENE THEME — TODRA GORGE: Background is a spectacular Moroccan canyon — Todra Gorge style, towering vertical ochre-red limestone cliffs 300m high, dramatic shaft of light from above. Monumental, awe-inspiring natural wonder. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      blue_city:        `SCENE THEME — CHEFCHAOUEN, THE BLUE CITY: Background is enchanting Chefchaouen — all narrow streets and house walls painted in vivid shades of blue from pale sky-blue to deep cobalt. Magical layered blue-on-blue architecture, otherworldly. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      majorelle:        `SCENE THEME — MAJORELLE GARDEN, MARRAKESH: Background is the legendary Majorelle Garden — electric cobalt-blue Berber villa architecture contrasting with towering cacti, vivid yellow ceramic pots, deep green foliage. A jewel of Marrakesh botany. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      marrakesh:        `SCENE THEME — MARRAKESH MEDINA: Background is the vibrant labyrinthine medina of Marrakesh — ornate carved plaster walls, arched passageways, zellige-decorated doorways, warm reddish-pink city palette. The ancient heart of the Red City. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      essaouira:        `SCENE THEME — ESSAOUIRA ATLANTIC WALLS: Background is the dramatic Atlantic coast of Essaouira — white and blue Portuguese-influenced fortress ramparts, crashing Atlantic waves against ancient cannon-lined walls, deep blue sea. Windswept, romantic. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      agadir:           `SCENE THEME — AGADIR RIVIERA: Background is the modern Moroccan Riviera of Agadir — golden sandy Atlantic beach, blue ocean, modern coastal promenade, palm-lined boulevard, ancient Kasbah ruins on the hilltop. Warm resort atmosphere. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
    },
    algeria: {
      day:             `SCENE THEME — ALGERIAN DAY: Bright North African Mediterranean daylight. White-painted architecture gleaming in brilliant sun, cobalt-blue sky, warm golden Mediterranean light. Whitewashed Casbah-style buildings casting sharp shadows. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      night:           `SCENE THEME — ALGERIAN NIGHT: Deep Algerian Mediterranean night. Elegant whitewashed architecture lit by warm lantern glow. Mediterranean sky with stars. Blue-tinted moonlight on white walls, warm amber window-light spilling out. Romantic and atmospheric. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      roman_ruins:     `SCENE THEME — ROMAN RUINS OF ALGERIA: Background features breathtaking ancient Roman ruins — marble columns, fallen capitals, stone-paved forum floors, carved archways scattered across a sun-drenched North African hillside. The Roman Empire's African legacy, timeless. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      mountain_sahara: `SCENE THEME — MOUNTAIN SAHARA: Background is the dramatic high Algerian Sahara — rugged volcanic rocky mountains rising from a vast stone desert plateau, warm orange-black basalt terrain, immense desert sky. The Hoggar mountain range, austere and monumental. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      timgad:          `SCENE THEME — TIMGAD, NORTH AFRICAN POMPEII: Background is the extraordinary Roman colonial city of Timgad — a perfectly preserved 2000-year-old Roman grid city with original streets, colonnaded avenues, carved stone capitals, in the Aurès mountains. UNESCO World Heritage. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      trajans_arch:    `SCENE THEME — ARCH OF TRAJAN, TIMGAD: Background prominently features the intact Trajan's Arch of Timgad — a perfectly preserved 12-meter Roman triumphal arch standing in the Algerian desert. Monumental, ancient, the symbol of Roman Algeria. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      amphitheater:    `SCENE THEME — ROMAN AMPHITHEATER: Background is a dramatic Roman amphitheater in Algeria — tiered stone seating, central arena, colonnaded outer galleries, carved stonework, set in the North African landscape. Grand ancient theater under wide sky. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      djemila:         `SCENE THEME — DJEMILA RUINS: Background is beautiful Djemila — one of the world's finest preserved Roman towns in the Algerian mountains. Forum, temples, triumphal arch and basilica framed against a mountain horizon. UNESCO World Heritage of astonishing completeness. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      tipaza:          `SCENE THEME — TIPAZA BY THE SEA: Background is magical Tipaza — Roman and early Christian ruins cascading down to the shimmering Mediterranean Sea. Stone columns, ancient walls with bougainvillea, deep blue sea glittering behind. Poetic, haunting, beautiful. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      kasbah_algiers:  `SCENE THEME — KASBAH OF ALGIERS: Background is the historic Kasbah of Algiers — dense Ottoman city of white cubic houses cascading steeply to the sea, narrow stone alleys, ornate wooden doorways, bougainvillea on white walls. UNESCO heritage. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      stele:           `SCENE THEME — MAQAM ECHAHID MONUMENT: Background prominently features the Maqam Echahid (Martyrs' Memorial) — three palm-frond-shaped concrete towers, iconic symbol of Algiers, rising dramatically against a golden sunset sky. Monumental, powerful. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      algiers_tower:   `SCENE THEME — ALGIERS GRANDE POSTE AREA: Background features Algiers' elegant city center — the magnificent domed Grande Poste building in French-Moorish architecture, grand Haussmann-style boulevards. Marriage of European and North African grandeur. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      constantine:     `SCENE THEME — CONSTANTINE, CITY OF BRIDGES: Background is breathtaking Constantine built atop a 200-meter-deep gorge — the famous Sidi M'Cid suspension bridge spanning the vertiginous ravine, city perched on clifftops. Unique and spectacular. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      assekrem:        `SCENE THEME — ASSEKREM PLATEAU, HOGGAR: Background is the extraordinary Assekrem plateau — alien volcanic black basalt peaks rising from endless Saharan stone desert, otherworldly formations, hermitage chapel silhouette on the highest peak. Vast, spiritual. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      oran:            `SCENE THEME — ORAN WATERFRONT: Background is cosmopolitan port-city Oran — dramatic bay curving below, elegant French and Spanish colonial architecture, Santa Cruz fort on the clifftop, deep Mediterranean blue water. Vibrant, sun-drenched. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      tlemcen:         `SCENE THEME — TLEMCEN, PEARL OF THE MAGHREB: Background features elegant historic Tlemcen — ornate Moorish-Zianid architecture, delicate white marble horseshoe columns, refined zellige tilework, intricate carved stucco. The aristocratic Pearl of the Maghreb. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
      ghardaia:        `SCENE THEME — GHARDAÏA AND M'ZAB VALLEY: Background is the extraordinary M'Zab valley — UNESCO-listed pentapolis of Ghardaïa, beehive-shaped circular desert cities of white and ochre cubic houses with pencil-thin minarets. Unique, otherworldly, magnificent. OVERRIDE: This background supersedes all previously specified country default backgrounds.`,
    },
  },
};

const CLOUDINARY_CONFIG = {
  logoPublicId: process.env.CLOUDINARY_LOGO_PUBLIC_ID || 'banner-gen/logo',
  framePublicIds: {
    cyan:   process.env.CLOUDINARY_FRAME_CYAN_PUBLIC_ID   || 'banner-gen/frame-cyan',
    green:  process.env.CLOUDINARY_FRAME_GREEN_PUBLIC_ID  || 'banner-gen/frame-green',
    purple: process.env.CLOUDINARY_FRAME_PURPLE_PUBLIC_ID || 'banner-gen/frame-purple',
    gold:   process.env.CLOUDINARY_FRAME_GOLD_PUBLIC_ID   || 'banner-gen/frame-gold',
  },
  // a = filled+pill  b = filled only  c = bordered
  plashkaPublicIds: {
    a: {
      cyan:   process.env.CLOUDINARY_PLASHKA_A_CYAN_PUBLIC_ID   || 'banner-gen/plashkas/a-cyan',
      green:  process.env.CLOUDINARY_PLASHKA_A_GREEN_PUBLIC_ID  || 'banner-gen/plashkas/a-green',
      purple: process.env.CLOUDINARY_PLASHKA_A_PURPLE_PUBLIC_ID || 'banner-gen/plashkas/a-purple',
      gold:   process.env.CLOUDINARY_PLASHKA_A_GOLD_PUBLIC_ID   || 'banner-gen/plashkas/a-gold',
    },
    b: {
      cyan:   process.env.CLOUDINARY_PLASHKA_B_CYAN_PUBLIC_ID   || 'banner-gen/plashkas/b-cyan',
      green:  process.env.CLOUDINARY_PLASHKA_B_GREEN_PUBLIC_ID  || 'banner-gen/plashkas/b-green',
      purple: process.env.CLOUDINARY_PLASHKA_B_PURPLE_PUBLIC_ID || 'banner-gen/plashkas/b-purple',
      gold:   process.env.CLOUDINARY_PLASHKA_B_GOLD_PUBLIC_ID   || 'banner-gen/plashkas/b-gold',
    },
    c: {
      cyan:   process.env.CLOUDINARY_PLASHKA_C_CYAN_PUBLIC_ID   || 'banner-gen/plashkas/c-cyan',
      green:  process.env.CLOUDINARY_PLASHKA_C_GREEN_PUBLIC_ID  || 'banner-gen/plashkas/c-green',
      purple: process.env.CLOUDINARY_PLASHKA_C_PURPLE_PUBLIC_ID || 'banner-gen/plashkas/c-purple',
      gold:   process.env.CLOUDINARY_PLASHKA_C_GOLD_PUBLIC_ID   || 'banner-gen/plashkas/c-gold',
    },
  },
};

module.exports = { PROMPT_BLOCKS, CLOUDINARY_CONFIG };
