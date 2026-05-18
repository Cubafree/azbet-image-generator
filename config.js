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
DO NOT render any text, numbers, words, or logos anywhere in the image.`,
};

const CLOUDINARY_CONFIG = {
  logoPublicId: process.env.CLOUDINARY_LOGO_PUBLIC_ID || 'banner-gen/logo',
  framePublicId: process.env.CLOUDINARY_FRAME_PUBLIC_ID || 'banner-gen/promo-frame',
  textFont: process.env.CLOUDINARY_TEXT_FONT || 'Arial',
  textSize: process.env.CLOUDINARY_TEXT_SIZE || '52',
  textColor: process.env.CLOUDINARY_TEXT_COLOR || 'ffffff',
  textGravity: process.env.CLOUDINARY_TEXT_GRAVITY || 'south',
  textY: process.env.CLOUDINARY_TEXT_Y || '120',
};

module.exports = { PROMPT_BLOCKS, CLOUDINARY_CONFIG };
