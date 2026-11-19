// Use-Case Packs — ready prompts for the jobs people search for most:
// headshots, real estate, weddings, YouTube thumbnails, food & menus, logos & brand.

const T = ['ChatGPT', 'Gemini', 'Midjourney'];

export const USE_CASES = [
  // ---------------------------------------------------------------- Headshots
  {
    id: 'uc-headshot-corporate', group: 'Headshots', title: 'Corporate Headshot', cmd: '/headshot-corporate', type: 'image', motif: 'portrait', tools: T,
    desc: 'A clean, trustworthy LinkedIn-ready headshot on a soft studio backdrop.',
    bestFor: ['LinkedIn', 'Company websites', 'Speaker bios'],
    settings: 'Upload a clear, front-facing selfie as the reference for best likeness',
    tips: ['Ask for "keep my exact face and features" when you upload a selfie.', 'Grey or navy backdrops read as the most professional.', 'Generate 4 and pick the most natural expression.'],
    template: 'Professional corporate headshot of [PERSON] wearing [OUTFIT], head-and-shoulders framing, slight three-quarter turn, warm confident smile, soft key light with a gentle rim light, plain [BACKDROP COLOUR] studio backdrop, 85mm lens at f/2.8, crisp focus on the eyes, natural skin texture, no retouching artefacts, 4:5 portrait.',
    examples: [
      { title: 'Navy suit, grey backdrop', subject: 'person', prompt: 'Professional corporate headshot of a woman in her forties with shoulder-length auburn hair, wearing a navy blazer over a white silk blouse, head-and-shoulders framing, slight three-quarter turn, warm confident smile, soft key light with a gentle rim light, plain mid-grey studio backdrop, 85mm lens at f/2.8, crisp focus on the eyes, natural skin texture, 4:5 portrait.' },
      { title: 'Open collar, navy backdrop', subject: 'person', prompt: 'Professional corporate headshot of a Black man in his thirties with a short beard, wearing a charcoal suit with an open-collar light-blue shirt, head-and-shoulders framing, slight three-quarter turn, relaxed approachable smile, soft key light with a gentle rim light, plain deep-navy studio backdrop, 85mm lens at f/2.8, crisp focus on the eyes, natural skin texture, 4:5 portrait.' },
      { title: 'Founder in knitwear', subject: 'person', prompt: 'Professional headshot of a South Asian woman in her late twenties with long dark hair, wearing a cream fine-knit sweater, head-and-shoulders framing, slight three-quarter turn, genuine smile, soft window-style key light, plain warm-beige backdrop, 85mm lens at f/2.8, crisp focus on the eyes, natural skin texture, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-headshot-creative', group: 'Headshots', title: 'Creative Environmental Portrait', cmd: '/headshot-creative', type: 'image', motif: 'portrait', tools: T,
    desc: 'A personality-led portrait in the place you work — studio, kitchen, workshop or office.',
    bestFor: ['Founders', 'Creatives', 'About pages'],
    tips: ['Name one real prop from your work — it tells the story instantly.', 'Shallow depth of field keeps the place recognisable but not busy.'],
    template: 'Environmental portrait of [PERSON], a [PROFESSION], in [WORKPLACE], holding [PROP], natural window light, shallow depth of field with the workspace softly blurred behind, candid confident expression, 35mm lens, editorial magazine style, true-to-life colour, 4:5 portrait.',
    examples: [
      { title: 'Ceramicist in her studio', subject: 'person', prompt: 'Environmental portrait of a ceramicist in her fifties with silver curls, in her pottery studio, holding a freshly glazed bowl, shelves of pots softly blurred behind, natural window light, candid confident expression, 35mm lens, editorial magazine style, true-to-life colour, 4:5 portrait.' },
      { title: 'Chef at the pass', subject: 'person', prompt: 'Environmental portrait of a young Latino chef in a white chef jacket at the pass of a busy restaurant kitchen, holding a finished plate, steel counters and warm lamps softly blurred behind, candid confident expression, 35mm lens, editorial magazine style, 4:5 portrait.' },
      { title: 'Architect with model', subject: 'person', prompt: 'Environmental portrait of an East Asian architect in a black turtleneck in a bright studio, resting a hand on a white architectural model, drawings pinned on the wall behind softly blurred, natural window light, thoughtful expression, 35mm lens, editorial style, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-headshot-actor', group: 'Headshots', title: 'Actor / Model Headshot', cmd: '/headshot-actor', type: 'image', motif: 'portrait', tools: T,
    desc: 'Casting-style headshot: natural, honest, minimal styling and strong eye contact.',
    bestFor: ['Casting', 'Model cards', 'Portfolios'],
    tips: ['Casting directors want "you on a good day" — keep make-up minimal.', 'Ask for both a smiling and a serious version.'],
    template: 'Casting headshot of [PERSON], plain [TOP], tight head-and-shoulders crop, direct eye contact with the lens, [EXPRESSION], soft daylight from a large window, neutral background, 85mm lens, natural skin with visible texture, no heavy make-up, 4:5 portrait.',
    examples: [
      { title: 'Serious look', subject: 'person', prompt: 'Casting headshot of a young man with tousled dark hair and light stubble, plain charcoal T-shirt, tight head-and-shoulders crop, direct eye contact with the lens, calm serious expression, soft daylight from a large window, neutral grey background, 85mm lens, natural skin with visible texture, 4:5 portrait.' },
      { title: 'Warm smile', subject: 'person', prompt: 'Casting headshot of a woman in her twenties with natural curly hair, plain white tank top, tight head-and-shoulders crop, direct eye contact, open warm smile, soft daylight from a large window, neutral off-white background, 85mm lens, natural skin with freckles visible, 4:5 portrait.' },
      { title: 'Character actor', subject: 'person', prompt: 'Casting headshot of a weathered man in his sixties with a grey beard, plain olive henley, tight head-and-shoulders crop, direct eye contact, wry half-smile, soft daylight from a window, neutral dark background, 85mm lens, natural skin with deep laugh lines, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-headshot-team', group: 'Headshots', title: 'Consistent Team Headshots', cmd: '/headshot-team', type: 'image', motif: 'portrait', tools: T,
    desc: 'One fixed lighting and backdrop recipe so every team member matches on the website.',
    bestFor: ['Team pages', 'Agencies', 'Start-ups'],
    tips: ['Reuse the exact same prompt for everyone and only change the person line.', 'Keep crop, backdrop colour and lens identical.'],
    template: 'Team headshot of [PERSON] in [OUTFIT]. Fixed house style: chest-up crop, body angled 30° with face to camera, friendly natural smile, soft butterfly key light, light rim on the hair, solid [BRAND COLOUR] backdrop, 70mm lens, f/4, even skin tones, 1:1 square.',
    examples: [
      { title: 'Sage-green house style', subject: 'person', prompt: 'Team headshot of a bearded man in his thirties with glasses in a denim shirt. Fixed house style: chest-up crop, body angled 30° with face to camera, friendly natural smile, soft butterfly key light, light rim on the hair, solid sage-green backdrop, 70mm lens, f/4, even skin tones, 1:1 square.' },
      { title: 'Same style, new hire', subject: 'person', prompt: 'Team headshot of a young woman with a sleek high ponytail in a black crew-neck sweater. Fixed house style: chest-up crop, body angled 30° with face to camera, friendly natural smile, soft butterfly key light, light rim on the hair, solid sage-green backdrop, 70mm lens, f/4, even skin tones, 1:1 square.' },
      { title: 'Coral brand colour', subject: 'person', prompt: 'Team headshot of an older man with white hair in a light linen blazer. Fixed house style: chest-up crop, body angled 30° with face to camera, friendly natural smile, soft butterfly key light, light rim on the hair, solid coral backdrop, 70mm lens, f/4, even skin tones, 1:1 square.' },
    ],
  },

  // -------------------------------------------------------------- Real estate
  {
    id: 'uc-realestate-interior', group: 'Real Estate', title: 'Bright Interior Listing Photo', cmd: '/listing-interior', type: 'image', motif: 'iso', tools: T,
    desc: 'Magazine-quality interior shot: wide, bright, straight verticals and inviting styling.',
    bestFor: ['Property listings', 'Airbnb', 'Interior designers'],
    tips: ['Ask for "straight vertical lines" — it is what makes interiors look professional.', 'Mention one styled detail (flowers, a book, a bowl of lemons).', 'For a real room, upload the photo and ask to "improve lighting and styling only".'],
    template: 'Professional real-estate interior photo of a [ROOM] in a [STYLE] home, wide-angle 16mm at chest height, perfectly straight vertical lines, bright natural daylight from large windows balanced with warm lamps, styled with [STYLING DETAIL], clean and uncluttered, true-to-life colours, high dynamic range, 3:2 landscape.',
    examples: [
      { title: 'Scandinavian living room', subject: 'scene', prompt: 'Professional real-estate interior photo of a living room in a Scandinavian-style apartment, wide-angle 16mm at chest height, perfectly straight vertical lines, bright natural daylight from large windows balanced with warm lamps, oak floors, a linen sofa, styled with a vase of eucalyptus and a stack of books, clean and uncluttered, true-to-life colours, 3:2 landscape.' },
      { title: 'Modern farmhouse kitchen', subject: 'scene', prompt: 'Professional real-estate interior photo of a modern farmhouse kitchen with a large marble island and brass pendant lights, wide-angle 16mm at chest height, perfectly straight vertical lines, bright morning daylight, styled with a bowl of lemons and fresh bread on a board, clean and uncluttered, 3:2 landscape.' },
      { title: 'Spa-like bathroom', subject: 'scene', prompt: 'Professional real-estate interior photo of a spa-like bathroom with a freestanding stone bathtub, green zellige tiles and a window onto trees, wide-angle 16mm, perfectly straight vertical lines, soft natural daylight, styled with rolled white towels and a eucalyptus sprig, clean and calm, 3:2 landscape.' },
    ],
  },
  {
    id: 'uc-realestate-exterior', group: 'Real Estate', title: 'Twilight Exterior Hero', cmd: '/listing-twilight', type: 'image', motif: 'city', tools: T,
    desc: 'The listing hero shot: the house at dusk with every window glowing warm.',
    bestFor: ['Listing hero images', 'Brochures', 'Developers'],
    tips: ['Twilight exteriors get the most clicks on listing sites.', 'Ask for a deep-blue (not black) sky.'],
    template: 'Twilight real-estate exterior photo of a [HOUSE STYLE] home, front three-quarter view, every window glowing warm amber, landscape and path lights on, deep blue dusk sky with a hint of sunset, [GARDEN DETAIL], straight verticals, crisp detail, inviting mood, 3:2 landscape.',
    examples: [
      { title: 'Modern glass house', subject: 'scene', prompt: 'Twilight real-estate exterior photo of a modern two-storey house with floor-to-ceiling glass and cedar cladding, front three-quarter view, every window glowing warm amber, landscape and path lights on, deep blue dusk sky with a hint of pink sunset, a lit infinity pool in front, straight verticals, crisp detail, 3:2 landscape.' },
      { title: 'Craftsman bungalow', subject: 'scene', prompt: 'Twilight real-estate exterior photo of a classic craftsman bungalow with a deep front porch, front three-quarter view, every window glowing warm amber, porch lanterns on, deep blue dusk sky, a neat lawn and flowering hydrangeas, straight verticals, inviting mood, 3:2 landscape.' },
      { title: 'Mediterranean villa', subject: 'scene', prompt: 'Twilight real-estate exterior photo of a white Mediterranean villa with terracotta roof tiles and olive trees, front three-quarter view, windows glowing warm, up-lights on the palms, deep blue dusk sky with the last orange glow, straight verticals, luxurious mood, 3:2 landscape.' },
    ],
  },
  {
    id: 'uc-realestate-staging', group: 'Real Estate', title: 'Virtual Staging', cmd: '/virtual-staging', type: 'image', motif: 'iso', tools: ['ChatGPT', 'Gemini'],
    desc: 'Furnish an empty room photo in a chosen style without changing the architecture.',
    bestFor: ['Empty listings', 'Rentals', 'Renovation previews'],
    settings: 'Upload a photo of the empty room',
    tips: ['Always add "keep walls, windows, floor and ceiling exactly the same".', 'Disclose virtual staging on listings where required.'],
    template: 'Virtually stage this empty [ROOM] in a [STYLE] style. Keep the walls, windows, doors, floor and ceiling exactly as in the photo — only add furniture and décor: [FURNITURE LIST]. Realistic scale and shadows, natural daylight matching the photo, photorealistic, same camera angle.',
    examples: [
      { title: 'Japandi bedroom', subject: 'scene', prompt: 'Virtually stage this empty bedroom in a Japandi style. Keep the walls, windows, doors, floor and ceiling exactly as in the photo — only add a low oak platform bed with white linen, a paper floor lamp, a wool rug and a single bonsai. Realistic scale and shadows, natural daylight, photorealistic, same camera angle.' },
      { title: 'Mid-century lounge', subject: 'scene', prompt: 'Virtually stage this empty living room in a mid-century modern style. Keep the architecture exactly as in the photo — only add a walnut sideboard, a mustard-velvet sofa, an Eames-style lounge chair, a sputnik pendant and a large fiddle-leaf fig. Realistic scale and shadows, photorealistic, same camera angle.' },
      { title: 'Home office nook', subject: 'scene', prompt: 'Virtually stage this empty spare room as a calm home office. Keep the architecture exactly as in the photo — only add a white oak desk facing the window, an ergonomic chair, open shelving with books and plants, and a soft rug. Natural daylight, photorealistic, same camera angle.' },
    ],
  },
  {
    id: 'uc-realestate-aerial', group: 'Real Estate', title: 'Drone Aerial of a Property', cmd: '/listing-aerial', type: 'image', motif: 'city', tools: T,
    desc: 'A high drone view that shows the plot, the neighbourhood and what is nearby.',
    bestFor: ['Land and estates', 'Lakefront homes', 'Developments'],
    template: 'Drone aerial photo of a [PROPERTY] from 60 metres up at a 45° angle, the property centred, [SURROUNDINGS] around it, late-afternoon golden light with long soft shadows, crisp detail, vivid but natural colours, 3:2 landscape.',
    examples: [
      { title: 'Lakefront cabin', subject: 'scene', prompt: 'Drone aerial photo of a timber lakefront cabin with a private wooden dock, from 60 metres up at a 45° angle, the property centred, pine forest and a calm blue lake around it, late-afternoon golden light with long soft shadows, crisp detail, natural colours, 3:2 landscape.' },
      { title: 'Vineyard estate', subject: 'scene', prompt: 'Drone aerial photo of a stone farmhouse estate surrounded by vineyard rows and a cypress-lined drive, from 60 metres up at a 45° angle, rolling Tuscan hills behind, late-afternoon golden light, crisp detail, natural colours, 3:2 landscape.' },
      { title: 'Suburban family home', subject: 'scene', prompt: 'Drone aerial photo of a suburban family home with a backyard pool and a large garden, from 60 metres up at a 45° angle, tree-lined streets and a park nearby, late-afternoon golden light, crisp detail, natural colours, 3:2 landscape.' },
    ],
  },

  // ------------------------------------------------------------------ Weddings
  {
    id: 'uc-wedding-portrait', group: 'Weddings', title: 'Golden-Hour Couple Portrait', cmd: '/wedding-golden', type: 'image', motif: 'portrait', tools: T,
    desc: 'The classic romantic couple portrait in warm, backlit golden-hour light.',
    bestFor: ['Wedding inspiration', 'Engagement shoots', 'Save-the-dates'],
    tips: ['Backlight plus a little haze is what creates the "glow".', 'Ask for a candid moment, not a pose.'],
    template: 'Romantic wedding portrait of [COUPLE] in [LOCATION] at golden hour, the sun low behind them creating a warm rim of light and gentle lens flare, candid moment of [MOMENT], soft hazy atmosphere, 85mm at f/1.8, creamy background blur, film-like warm tones, 4:5 portrait.',
    examples: [
      { title: 'Meadow forehead touch', subject: 'person', prompt: 'Romantic wedding portrait of a bride in a flowing silk gown and a groom in a light-grey suit in a wildflower meadow at golden hour, the sun low behind them creating a warm rim of light and gentle lens flare, candid moment of foreheads touching and laughing, soft hazy atmosphere, 85mm at f/1.8, creamy background blur, film-like warm tones, 4:5 portrait.' },
      { title: 'Two brides by the sea', subject: 'person', prompt: 'Romantic wedding portrait of two brides, one in a lace gown and one in a tailored white jumpsuit, on a clifftop above the sea at golden hour, the sun low behind them with a warm rim of light, candid moment of a twirl, soft hazy atmosphere, 85mm at f/1.8, film-like warm tones, 4:5 portrait.' },
      { title: 'Desert elopement', subject: 'person', prompt: 'Romantic elopement portrait of a couple in boho wedding attire among desert rock formations at golden hour, the sun low behind them creating a warm rim of light, candid moment of the groom lifting the bride, dust glowing in the air, 85mm at f/1.8, film-like warm tones, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-wedding-details', group: 'Weddings', title: 'Wedding Detail Flat Lay', cmd: '/wedding-flatlay', type: 'image', motif: 'product', tools: T,
    desc: 'Invitation suite, rings and florals arranged into an elegant overhead flat lay.',
    bestFor: ['Stationery designers', 'Planners', 'Wedding websites'],
    template: 'Overhead wedding flat lay on [SURFACE]: [INVITATION STYLE] invitation suite, the wedding rings, [FLOWERS], silk ribbon and vintage stamps, carefully arranged with breathing room, soft diffused daylight, gentle shadows, fine-art film aesthetic, muted [PALETTE] palette, 4:5 portrait.',
    examples: [
      { title: 'Sage & cream fine art', subject: 'product', prompt: 'Overhead wedding flat lay on handmade cotton paper: a letterpress invitation suite in cream with sage-green ink, the gold wedding rings, sprigs of olive and white garden roses, silk ribbon and vintage stamps, carefully arranged with breathing room, soft diffused daylight, gentle shadows, fine-art film aesthetic, muted sage and cream palette, 4:5 portrait.' },
      { title: 'Black-tie gold foil', subject: 'product', prompt: 'Overhead wedding flat lay on black velvet: a gold-foil black-tie invitation suite, the platinum rings in an open ring box, white orchids and a wax seal, carefully arranged with breathing room, soft directional light, glamorous mood, black and gold palette, 4:5 portrait.' },
      { title: 'Terracotta boho', subject: 'product', prompt: 'Overhead wedding flat lay on a linen tablecloth: a deckled-edge invitation suite in terracotta, the rings on a dried palm leaf, pampas grass and orange ranunculus, a silk ribbon, carefully arranged, soft warm daylight, boho mood, terracotta and sand palette, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-wedding-venue', group: 'Weddings', title: 'Reception Venue Setup', cmd: '/wedding-venue', type: 'image', motif: 'iso', tools: T,
    desc: 'A dreamy reception table and venue styled ready for guests.',
    bestFor: ['Venues', 'Planners', 'Mood boards'],
    template: 'Wedding reception at [VENUE] styled for evening: long tables with [LINEN], [CENTREPIECES], taper candles glowing, string lights overhead, chairs neatly lined, no guests yet, warm ambient light at blue hour, wide 24mm view down the tables, magical atmosphere, 3:2 landscape.',
    examples: [
      { title: 'Rustic barn', subject: 'scene', prompt: 'Wedding reception in a restored timber barn styled for evening: long wooden tables with cream linen runners, low centrepieces of white roses and eucalyptus, taper candles glowing, string lights overhead, cross-back chairs neatly lined, no guests yet, warm ambient light, wide 24mm view down the tables, magical atmosphere, 3:2 landscape.' },
      { title: 'Garden marquee', subject: 'scene', prompt: 'Wedding reception in a clear-roof garden marquee styled for evening: long tables with blush linen, tall arrangements of peonies and hanging greenery, taper candles glowing, festoon lights overhead, gold chairs, no guests yet, blue-hour sky above, wide 24mm view, magical atmosphere, 3:2 landscape.' },
      { title: 'Italian terrace', subject: 'scene', prompt: 'Wedding reception on an Italian lakeside terrace styled for evening: long tables with white linen, lemon branches and olive garlands, taper candles glowing, lanterns strung between trees, wooden chairs, no guests yet, lake and mountains at blue hour behind, wide 24mm view, magical atmosphere, 3:2 landscape.' },
    ],
  },
  {
    id: 'uc-wedding-invite', group: 'Weddings', title: 'Illustrated Invitation Art', cmd: '/wedding-invite-art', type: 'image', motif: 'type', tools: ['ChatGPT', 'Gemini'],
    desc: 'Watercolour venue or floral artwork to print on a wedding invitation.',
    bestFor: ['Invitations', 'Signage', 'Menus'],
    tips: ['Leave empty space for text, then add your names in a design tool.', 'ChatGPT can also set the names in elegant script if you spell them out.'],
    template: 'Delicate watercolour illustration of [SUBJECT] for a wedding invitation, loose ink outlines with soft washes of [PALETTE], lots of white space at the bottom for text, textured cotton paper, elegant and minimal, 5:7 portrait.',
    examples: [
      { title: 'Venue in watercolour', subject: 'scene', prompt: 'Delicate watercolour illustration of a stone chapel with climbing roses for a wedding invitation, loose ink outlines with soft washes of dusty pink and sage green, lots of white space at the bottom for text, textured cotton paper, elegant and minimal, 5:7 portrait.' },
      { title: 'Floral wreath', subject: 'scene', prompt: 'Delicate watercolour illustration of a circular wreath of peonies, ranunculus and eucalyptus for a wedding invitation, soft washes of blush and green, an empty centre for names, textured cotton paper, elegant and minimal, 5:7 portrait.' },
      { title: 'Coastal crest', subject: 'scene', prompt: 'Delicate watercolour illustration of a coastal crest with a lighthouse, gulls and sea grass for a wedding invitation, loose ink outlines with soft washes of navy and sand, lots of white space for text, textured cotton paper, elegant and minimal, 5:7 portrait.' },
    ],
  },

  // --------------------------------------------------------- YouTube thumbnails
  {
    id: 'uc-yt-reaction', group: 'YouTube Thumbnails', title: 'Reaction Thumbnail', cmd: '/yt-reaction', type: 'image', motif: 'burst', tools: ['ChatGPT', 'Gemini'],
    desc: 'Big expressive face, one clear object and bold contrast — built to be read at phone size.',
    bestFor: ['YouTube', 'Shorts covers', 'Podcasts'],
    tips: ['One face, one object, max three words.', 'Check it at thumbnail size — if you cannot read it, simplify.', 'Use a colour that contrasts with YouTube\'s white and dark UI.'],
    template: 'YouTube thumbnail, 16:9: [PERSON] on the left with an exaggerated [EMOTION] expression, looking at [OBJECT] on the right, bold saturated [BACKGROUND] background, strong rim light separating the subject, short bold text "[2–3 WORDS]" in thick white letters with a black outline, high contrast, readable at small size.',
    examples: [
      { title: 'Shocked by a gadget', subject: 'person', prompt: 'YouTube thumbnail, 16:9: a young man with curly hair on the left with an exaggerated shocked expression, mouth open, looking at a glowing transparent smartphone on the right, bold saturated electric-blue background, strong rim light separating the subject, short bold text "WAIT WHAT?" in thick white letters with a black outline, high contrast, readable at small size.' },
      { title: 'Cooking fail', subject: 'person', prompt: 'YouTube thumbnail, 16:9: a woman in an apron on the left with an exaggerated horrified face, looking at a burnt smoking cake on the right, bold saturated orange background, strong rim light, short bold text "I RUINED IT" in thick white letters with a black outline, high contrast, readable at small size.' },
      { title: 'Money challenge', subject: 'person', prompt: 'YouTube thumbnail, 16:9: a grinning teenager on the left pointing at a huge stack of cash on the right, bold saturated green background, strong rim light, short bold text "$10,000?!" in thick yellow letters with a black outline, high contrast, readable at small size.' },
    ],
  },
  {
    id: 'uc-yt-versus', group: 'YouTube Thumbnails', title: 'Versus / Comparison Thumbnail', cmd: '/yt-versus', type: 'image', motif: 'burst', tools: ['ChatGPT', 'Gemini'],
    desc: 'Split-screen A vs B thumbnail with a clear divider and a winner hint.',
    bestFor: ['Reviews', 'Tech comparisons', 'Challenges'],
    template: 'YouTube thumbnail, 16:9, split screen: [ITEM A] on a [COLOUR A] left half versus [ITEM B] on a [COLOUR B] right half, a jagged diagonal divider with a glowing "VS" in the middle, both items large and sharply lit, bold contrast, minimal text, readable at small size.',
    examples: [
      { title: 'Cheap vs expensive', subject: 'product', prompt: 'YouTube thumbnail, 16:9, split screen: a $20 plastic pair of earbuds on a red left half versus luxury gold headphones on a teal right half, a jagged diagonal divider with a glowing "VS" in the middle, price tags "$20" and "$2,000" in bold, both items large and sharply lit, bold contrast, readable at small size.' },
      { title: 'Old vs new car', subject: 'product', prompt: 'YouTube thumbnail, 16:9, split screen: a rusty 1990s hatchback on a dusty-orange left half versus a sleek electric sports car on a neon-blue right half, a jagged diagonal divider with a glowing "VS" in the middle, both cars large and sharply lit, bold contrast, minimal text, readable at small size.' },
      { title: 'Homemade vs fast food', subject: 'product', prompt: 'YouTube thumbnail, 16:9, split screen: a juicy homemade burger on a wooden board on a yellow left half versus a fast-food burger in its wrapper on a red right half, a jagged diagonal divider with a glowing "VS", both burgers large and sharply lit, bold contrast, readable at small size.' },
    ],
  },
  {
    id: 'uc-yt-tutorial', group: 'YouTube Thumbnails', title: 'Tutorial / How-To Thumbnail', cmd: '/yt-tutorial', type: 'image', motif: 'type', tools: ['ChatGPT', 'Gemini'],
    desc: 'Clean before/after or result-first thumbnail that promises a clear outcome.',
    bestFor: ['Tutorials', 'Courses', 'DIY'],
    template: 'YouTube tutorial thumbnail, 16:9: the finished result — [RESULT] — large on the right, [PERSON OR HAND] on the left pointing at it, clean [BACKGROUND] background, a small "BEFORE" inset of [BEFORE STATE] in a corner, bold short title "[TITLE]", high contrast, readable at small size.',
    examples: [
      { title: 'Room makeover', subject: 'scene', prompt: 'YouTube tutorial thumbnail, 16:9: a cosy styled bedroom makeover large on the right, a smiling woman on the left pointing at it, clean warm-white background, a small "BEFORE" inset of the messy empty room in a corner, bold short title "$100 MAKEOVER", high contrast, readable at small size.' },
      { title: 'Learn to draw', subject: 'scene', prompt: 'YouTube tutorial thumbnail, 16:9: a realistic pencil drawing of an eye large on the right, a hand holding a pencil on the left, clean light-grey background, a small "BEFORE" inset of a basic circle sketch in a corner, bold short title "DRAW EYES FAST", high contrast, readable at small size.' },
      { title: 'Editing glow-up', subject: 'scene', prompt: 'YouTube tutorial thumbnail, 16:9: a vibrant colour-graded travel photo large on the right, a creator with headphones on the left pointing at it, clean dark background, a small "BEFORE" inset of the flat grey original in a corner, bold short title "1-CLICK GRADE", high contrast, readable at small size.' },
    ],
  },
  {
    id: 'uc-yt-podcast', group: 'YouTube Thumbnails', title: 'Podcast Episode Cover', cmd: '/yt-podcast', type: 'image', motif: 'film', tools: ['ChatGPT', 'Gemini'],
    desc: 'Studio-style podcast thumbnail with host and guest, mic and episode hook.',
    bestFor: ['Podcasts', 'Interviews', 'Clips'],
    template: 'Podcast episode thumbnail, 16:9: [HOST] and [GUEST] seated at a podcast desk with broadcast microphones, moody studio with [ACCENT COLOUR] accent lighting, shallow depth of field, cinematic grade, a bold quote "[HOOK]" across the top, high contrast, readable at small size.',
    examples: [
      { title: 'Founder interview', subject: 'person', prompt: 'Podcast episode thumbnail, 16:9: a host in a black T-shirt and a guest founder in a blazer seated at a podcast desk with broadcast microphones, moody studio with purple accent lighting and a neon sign, shallow depth of field, cinematic grade, a bold quote "I LOST EVERYTHING" across the top, high contrast, readable at small size.' },
      { title: 'Health expert', subject: 'person', prompt: 'Podcast episode thumbnail, 16:9: a host and a doctor in a white coat seated at a podcast desk with microphones, moody studio with teal accent lighting and plants, shallow depth of field, cinematic grade, a bold quote "STOP DOING THIS" across the top, high contrast, readable at small size.' },
      { title: 'Comedy duo', subject: 'person', prompt: 'Podcast episode thumbnail, 16:9: two comedians laughing hard at a podcast desk with microphones, warm orange studio lighting, shallow depth of field, cinematic grade, a bold quote "WORST DATE EVER" across the top, high contrast, readable at small size.' },
    ],
  },

  // ------------------------------------------------------------- Food & menus
  {
    id: 'uc-food-hero', group: 'Food & Menus', title: 'Menu Hero Dish', cmd: '/menu-hero', type: 'image', motif: 'product', tools: T,
    desc: 'An appetising, restaurant-quality hero shot of a single dish for menus and delivery apps.',
    bestFor: ['Menus', 'Delivery apps', 'Restaurant sites'],
    tips: ['Steam, drips and crumbs make food look real.', 'A 45° angle suits most plated dishes; burgers and stacks look best straight on.'],
    template: 'Appetising food photo of [DISH] on [PLATE], 45° angle, [GARNISH], soft backlight making it glisten, a little steam rising, shallow depth of field with [SETTING] blurred behind, rich true-to-life colours, editorial food photography, 4:5 portrait.',
    examples: [
      { title: 'Ramen bowl', subject: 'product', prompt: 'Appetising food photo of a bowl of tonkotsu ramen with chashu pork, a jammy soft-boiled egg and scallions on a dark ceramic bowl, 45° angle, chopsticks lifting noodles, soft backlight making the broth glisten, steam rising, shallow depth of field with a wooden ramen bar blurred behind, rich true-to-life colours, editorial food photography, 4:5 portrait.' },
      { title: 'Margherita pizza', subject: 'product', prompt: 'Appetising food photo of a Neapolitan margherita pizza with blistered crust and fresh basil on a rustic wooden peel, 45° angle, a slice being pulled with stretching mozzarella, soft backlight, a little steam rising, wood-fired oven glowing blurred behind, rich true-to-life colours, editorial food photography, 4:5 portrait.' },
      { title: 'Acai bowl', subject: 'product', prompt: 'Appetising food photo of an açaí bowl topped with sliced banana, berries, granola and coconut flakes in a coconut-shell bowl, overhead angle, bright natural daylight, shallow depth of field with a sunny café table blurred behind, vivid true-to-life colours, editorial food photography, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-food-menu-board', group: 'Food & Menus', title: 'Full Menu Design', cmd: '/menu-design', type: 'image', motif: 'type', tools: ['ChatGPT', 'Gemini'],
    desc: 'A complete, printable menu layout with dishes, prices and food imagery.',
    bestFor: ['Cafés', 'Food trucks', 'Pop-ups'],
    settings: 'ChatGPT and Gemini render text best — spell every dish and price exactly',
    tips: ['List every item and price in the prompt; the model copies them.', 'Proof-read the result — fix any typo by asking for that line only.'],
    template: 'A printable [STYLE] menu design for "[RESTAURANT NAME]", A4 portrait. Sections: [SECTIONS WITH ITEMS AND PRICES]. Small illustrated food icons beside each section, clear hierarchy, elegant readable typography, [PALETTE] colour palette, generous margins, print-ready.',
    examples: [
      { title: 'Coffee shop chalkboard', subject: 'scene', prompt: 'A printable chalkboard-style menu design for "Morning Ritual Coffee", A4 portrait. Sections: COFFEE — Espresso $3, Flat White $4.5, Oat Latte $5; BAKERY — Butter Croissant $4, Banana Bread $4.5; COLD — Iced Matcha $5.5, Cold Brew $5. Small hand-drawn chalk icons beside each section, clear hierarchy, readable typography, black, white and warm-yellow palette, print-ready.' },
      { title: 'Taco truck', subject: 'scene', prompt: 'A printable bold street-food menu design for "Taco Loco", A4 portrait. Sections: TACOS — Al Pastor $4, Carnitas $4, Baja Fish $5; SIDES — Elote $4, Chips & Guac $6; DRINKS — Horchata $3, Jarritos $3. Small illustrated icons of tacos and chillies, clear hierarchy, chunky readable typography, hot pink, orange and teal palette, print-ready.' },
      { title: 'Fine dining tasting menu', subject: 'scene', prompt: 'A printable minimal fine-dining tasting menu design for "Maison Lune", A4 portrait. Courses: Oyster, cucumber, dill — Beetroot tartare, horseradish — Halibut, beurre blanc — Lamb, black garlic — Chocolate, sea salt. Tasting menu $145. Delicate line illustrations, elegant serif typography, ivory and deep-navy palette, generous margins, print-ready.' },
    ],
  },
  {
    id: 'uc-food-flatlay', group: 'Food & Menus', title: 'Overhead Table Spread', cmd: '/food-spread', type: 'image', motif: 'product', tools: T,
    desc: 'A full overhead table of dishes with hands reaching in — the social-media favourite.',
    bestFor: ['Instagram', 'Brunch menus', 'Catering'],
    template: 'Overhead food photo of a [CUISINE] table spread on [SURFACE]: [DISHES], hands reaching in to share, scattered napkins and cutlery, natural window light from one side, vibrant colours, lively and abundant, editorial food styling, 4:5 portrait.',
    examples: [
      { title: 'Mezze feast', subject: 'product', prompt: 'Overhead food photo of a Middle Eastern mezze table spread on a weathered blue table: hummus with olive oil, falafel, tabbouleh, warm pita, pomegranate seeds and grilled halloumi, hands reaching in to share, scattered linen napkins, natural window light from one side, vibrant colours, abundant, editorial food styling, 4:5 portrait.' },
      { title: 'Weekend brunch', subject: 'product', prompt: 'Overhead food photo of a weekend brunch spread on a white marble table: avocado toast, a stack of pancakes with berries, shakshuka in a pan, fresh orange juice and lattes, hands reaching in, natural window light, vibrant colours, lively and abundant, editorial food styling, 4:5 portrait.' },
      { title: 'Korean BBQ night', subject: 'product', prompt: 'Overhead food photo of a Korean BBQ table at night: sizzling meat on a tabletop grill, banchan in small bowls, lettuce wraps, kimchi and soju glasses, hands reaching in with chopsticks, warm practical light and smoke, vibrant colours, lively mood, editorial food styling, 4:5 portrait.' },
    ],
  },
  {
    id: 'uc-food-drink', group: 'Food & Menus', title: 'Signature Drink', cmd: '/drink-hero', type: 'image', motif: 'product', tools: T,
    desc: 'A glossy, condensation-beaded cocktail or drink hero for bar menus and promos.',
    bestFor: ['Bars', 'Coffee shops', 'Promos'],
    template: 'Glossy drink photo of [DRINK] in a [GLASS], [GARNISH], condensation beads on the glass, backlit so the liquid glows, [BACKGROUND] background with soft bokeh, a splash or bubbles frozen mid-air, high-end beverage photography, 4:5 portrait.',
    examples: [
      { title: 'Spicy margarita', subject: 'product', prompt: 'Glossy drink photo of a spicy margarita in a salt-rimmed coupe, garnished with a lime wheel and a red chilli, condensation beads on the glass, backlit so the liquid glows, warm terracotta background with soft bokeh, a splash frozen mid-air, high-end beverage photography, 4:5 portrait.' },
      { title: 'Iced matcha latte', subject: 'product', prompt: 'Glossy drink photo of an iced matcha latte in a tall clear glass with layered green and white, ice cubes and a bamboo straw, condensation beads on the glass, backlit, soft sage-green background with bokeh, milk swirling frozen mid-pour, high-end beverage photography, 4:5 portrait.' },
      { title: 'Old fashioned', subject: 'product', prompt: 'Glossy drink photo of an old fashioned in a heavy crystal tumbler with one large clear ice cube and an orange twist, backlit so the whisky glows amber, dark wood bar background with warm bokeh, a wisp of smoke, high-end beverage photography, 4:5 portrait.' },
    ],
  },

  // ----------------------------------------------------------- Logos & brand
  {
    id: 'uc-logo-mark', group: 'Logos & Brand', title: 'Minimal Logo Mark', cmd: '/logo-mark', type: 'image', motif: 'type', tools: ['ChatGPT', 'Gemini'],
    desc: 'A simple, scalable vector-style logo mark explored in several directions.',
    bestFor: ['Start-ups', 'Side projects', 'Rebrands'],
    tips: ['Ask for a 2×2 grid of directions to compare quickly.', 'Re-draw the chosen mark as a true vector in Illustrator or Figma before using it.'],
    template: 'Minimal flat vector logo mark for "[BRAND NAME]", a [INDUSTRY] brand. Concept: [IDEA]. Simple geometric shapes, bold and scalable, works in one colour, [PALETTE], centred on a plain white background, with the wordmark in a clean sans-serif below. No gradients, no mock-ups.',
    examples: [
      { title: 'Coffee roaster', subject: 'scene', prompt: 'Minimal flat vector logo mark for "Northbean", a specialty coffee roaster. Concept: a coffee bean that also forms a compass needle pointing north. Simple geometric shapes, bold and scalable, works in one colour, deep espresso brown and cream, centred on a plain white background, with the wordmark in a clean sans-serif below. No gradients, no mock-ups.' },
      { title: 'Fintech app', subject: 'scene', prompt: 'Minimal flat vector logo mark for "Ledgerly", a personal finance app. Concept: an upward arrow formed by three stacked rounded bars. Simple geometric shapes, bold and scalable, works in one colour, electric indigo, centred on a plain white background, with the wordmark in a clean geometric sans-serif below. No gradients, no mock-ups.' },
      { title: 'Plant shop', subject: 'scene', prompt: 'Minimal flat vector logo mark for "Fern & Fig", an indoor plant shop. Concept: a single leaf whose veins form an ampersand. Simple organic line shapes, works in one colour, forest green, centred on a plain white background, with the wordmark in an elegant serif below. No gradients, no mock-ups.' },
    ],
  },
  {
    id: 'uc-brand-mockup', group: 'Logos & Brand', title: 'Brand Identity Mock-up', cmd: '/brand-mockup', type: 'image', motif: 'product', tools: T,
    desc: 'Show a brand system on real objects: cards, packaging, tote bag and signage.',
    bestFor: ['Pitch decks', 'Portfolios', 'Client presentations'],
    template: 'Brand identity mock-up for "[BRAND NAME]" ([INDUSTRY]), overhead flat lay on [SURFACE]: business cards, a letterhead, [PACKAGING], a tote bag and a phone showing the app, all using a [PALETTE] palette and a [LOGO DESCRIPTION] logo, soft daylight, realistic paper and fabric textures, design-portfolio style, 4:3 landscape.',
    examples: [
      { title: 'Skincare brand', subject: 'product', prompt: 'Brand identity mock-up for "Saltwater Skin" (clean skincare), overhead flat lay on pale travertine: business cards, a letterhead, frosted serum bottles and a kraft shipping box, a canvas tote bag and a phone showing the shop app, all using a sea-glass green and sand palette and a minimal wave-line logo, soft daylight, realistic paper and fabric textures, design-portfolio style, 4:3 landscape.' },
      { title: 'Bakery', subject: 'product', prompt: 'Brand identity mock-up for "Crumb & Co." (artisan bakery), overhead flat lay on a flour-dusted wooden table: business cards, a stamped paper bag, a pastry box, an apron and a loyalty card, all using a warm butter-yellow and brown palette and a hand-drawn wheat logo, soft daylight, realistic textures, design-portfolio style, 4:3 landscape.' },
      { title: 'Tech start-up', subject: 'product', prompt: 'Brand identity mock-up for "Orbit Labs" (AI start-up), overhead flat lay on matte black: business cards, a laptop sticker sheet, a hoodie, a lanyard badge and a phone showing the app, all using an electric-violet and off-white palette and a geometric ring logo, crisp studio light, realistic textures, design-portfolio style, 4:3 landscape.' },
    ],
  },
  {
    id: 'uc-brand-social', group: 'Logos & Brand', title: 'Social Media Post Template', cmd: '/social-post', type: 'image', motif: 'grid', tools: ['ChatGPT', 'Gemini'],
    desc: 'An on-brand Instagram post with a headline, product and clean layout.',
    bestFor: ['Instagram', 'Launches', 'Sales'],
    template: 'Instagram post design, 1:1: [PRODUCT] as the hero on a [BACKGROUND] background, bold headline "[HEADLINE]", small sub-line "[SUB-LINE]", the [BRAND NAME] logo small in a corner, [PALETTE] palette, clean modern layout with generous spacing, crisp photoreal product.',
    examples: [
      { title: 'Summer sale', subject: 'product', prompt: 'Instagram post design, 1:1: a pair of white sneakers as the hero on a sunny lemon-yellow background with hard shadows, bold headline "SUMMER SALE", small sub-line "Up to 40% off — this week only", a small brand logo in a corner, yellow, white and black palette, clean modern layout with generous spacing, crisp photoreal product.' },
      { title: 'New flavour launch', subject: 'product', prompt: 'Instagram post design, 1:1: a can of sparkling yuzu soda as the hero surrounded by floating yuzu slices on a pale-green background, bold headline "NEW: YUZU", small sub-line "Bright, sharp, 0 sugar", a small brand logo in a corner, green and citrus-yellow palette, clean modern layout, crisp photoreal product.' },
      { title: 'Event announcement', subject: 'product', prompt: 'Instagram post design, 1:1: a vinyl record on a turntable as the hero on a deep-purple background with a soft spotlight, bold headline "LISTENING NIGHT", small sub-line "Fri 8 PM · Free entry", a small brand logo in a corner, purple and warm-gold palette, clean modern layout, crisp photoreal product.' },
    ],
  },
  {
    id: 'uc-brand-packaging', group: 'Logos & Brand', title: 'Packaging Concept', cmd: '/packaging', type: 'image', motif: 'product', tools: T,
    desc: 'Explore a packaging design for a new product before it exists.',
    bestFor: ['Product launches', 'Kickstarter', 'Pitching retailers'],
    template: 'Packaging design concept for [PRODUCT] by "[BRAND NAME]": [PACKAGE TYPE] with [DESIGN DIRECTION], [PALETTE] palette, the product name clearly printed, shown as a photoreal studio shot on [SURFACE] with soft shadows, premium retail-ready look, 4:5 portrait.',
    examples: [
      { title: 'Craft chocolate', subject: 'product', prompt: 'Packaging design concept for a 70% dark chocolate bar by "Cacao Atlas": a matte paper wrapper with a vintage map illustration and a gold-foil compass, deep teal and gold palette, the product name clearly printed, shown as a photoreal studio shot on dark slate with soft shadows, premium retail-ready look, 4:5 portrait.' },
      { title: 'Oat milk carton', subject: 'product', prompt: 'Packaging design concept for an oat milk by "Good Field": a 1-litre carton with playful hand-drawn oat characters and big friendly typography, sky blue and cream palette, the product name clearly printed, shown as a photoreal studio shot on a pale wooden table with soft shadows, retail-ready look, 4:5 portrait.' },
      { title: 'Hot sauce bottle', subject: 'product', prompt: 'Packaging design concept for a habanero hot sauce by "Smoke Signal": a slim glass bottle with a wax-dipped cap and a woodcut-style flame label, black, red and bone-white palette, the product name clearly printed, shown as a photoreal studio shot on charred wood with soft shadows, premium retail-ready look, 4:5 portrait.' },
    ],
  },
];
