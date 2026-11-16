// Editorial AI Photography Commands — each with its original example prompt.
// "the subject" / "the product" are swapped for concrete subjects to create extra examples.

export const EDITORIAL = [
  {
    cmd: '/zerogravityeditorial', title: 'Zero-Gravity Editorial', kind: 'person',
    desc: 'An editorial concept with a floating, weightless feeling.',
    bestFor: ['Fashion editorials', 'Surreal portraits', 'Luxury campaigns', 'Magazine covers'],
    example: 'A high-fashion portrait of the subject floating vertically in a minimal white studio, flowing fabric suspended around the body, dramatic directional lighting, subtle shadows, luxury magazine photography, surreal but photorealistic, sophisticated composition.',
  },
  {
    cmd: '/paparazzieditorial', title: 'Paparazzi Editorial', kind: 'person',
    desc: 'A candid celebrity / paparazzi-inspired editorial aesthetic.',
    bestFor: ['Celebrity-style content', 'Fashion campaigns', 'Street photography', 'Candid portraits'],
    example: 'A candid editorial photograph of the subject leaving a luxury hotel at night, photographers surrounding the scene, flash photography, natural body language, slightly imperfect framing, realistic street atmosphere, high-fashion celebrity aesthetic, authentic documentary photography.',
  },
  {
    cmd: '/overheadpaperstormeditorial', title: 'Overhead Paper-Storm', kind: 'person',
    desc: 'A dramatic overhead scene surrounded by scattered paper.',
    bestFor: ['Fashion editorials', 'Creative campaigns', 'Album artwork', 'Magazine covers'],
    example: 'Overhead editorial photograph of the subject lying on a polished studio floor surrounded by hundreds of scattered white papers, papers flying through the air, dramatic directional shadows, high-fashion styling, cinematic composition, premium magazine photography.',
  },
  {
    cmd: '/1890', title: '1890 Victorian Portrait', kind: 'person',
    desc: 'An old-world aesthetic inspired by late-19th-century portrait photography.',
    bestFor: ['Historical portraits', 'Vintage campaigns', 'Character concepts', 'Period photography'],
    example: 'A formal late-19th-century studio portrait of the subject, period clothing, antique studio backdrop, soft natural lighting, subtle photographic imperfections, historical portrait photography, realistic vintage texture, authentic period composition.',
  },
  {
    cmd: '/doubleexposure', title: 'Double Exposure', kind: 'person',
    desc: 'A layered double-exposure composition.',
    bestFor: ['Album covers', 'Creative portraits', 'Posters', 'Personal branding'],
    example: "A cinematic double-exposure portrait combining the subject's face with a dramatic mountain landscape, trees and atmospheric clouds seamlessly integrated into the silhouette, monochromatic editorial photography, subtle film grain, sophisticated magazine aesthetic.",
  },
  {
    cmd: '/flashfashioneditorial', title: 'Flash Fashion Editorial', kind: 'person',
    desc: 'Direct on-camera flash with bold, glossy magazine energy.',
    bestFor: ['Fashion editorials', 'Lookbooks', 'Social campaigns'],
    example: 'High-fashion editorial portrait of the subject photographed with direct on-camera flash, dramatic shadows, bold styling, glossy magazine aesthetic, realistic skin texture, slightly raw photography.',
  },
  {
    cmd: '/runwayeditorial', title: 'Runway Editorial', kind: 'person',
    desc: 'A confident walk down a futuristic runway.',
    bestFor: ['Fashion shows', 'Brand launches', 'Lookbooks'],
    example: 'The subject walking confidently through a futuristic fashion runway, dramatic overhead lighting, audience blurred in the background, luxury fashion editorial, cinematic composition, realistic photography.',
  },
  {
    cmd: '/papermagazineeditorial', title: 'Paper Magazine Editorial', kind: 'person',
    desc: 'Minimal high-fashion magazine page with space for typography.',
    bestFor: ['Magazine spreads', 'Covers', 'Personal branding'],
    example: 'Minimal high-fashion magazine editorial of the subject, clean white studio, sculptural clothing, elegant pose, soft directional lighting, sophisticated typography space, premium fashion photography.',
  },
  {
    cmd: '/filmflasheditorial', title: '35mm Film Flash', kind: 'person',
    desc: 'Candid 35mm film photograph with direct flash at night.',
    bestFor: ['Nightlife', 'Candid campaigns', 'Analog aesthetics'],
    example: 'Candid 35mm film photograph of the subject at night, direct flash, natural imperfections, subtle film grain, realistic skin texture, spontaneous expression, fashion editorial aesthetic.',
  },
  {
    cmd: '/redcarpeteditorial', title: 'Red Carpet Editorial', kind: 'person',
    desc: 'High-fashion red-carpet arrival with event lighting.',
    bestFor: ['Celebrity-style content', 'Event promos', 'Gala looks'],
    example: 'High-fashion red carpet photograph of the subject, dramatic event lighting, photographers in the background, elegant styling, realistic flash reflections, luxury celebrity editorial aesthetic.',
  },
  {
    cmd: '/streetstyleeditorial', title: 'Street-Style Editorial', kind: 'person',
    desc: 'High-end street style in a busy city.',
    bestFor: ['Streetwear brands', 'Fashion week content', 'Lookbooks'],
    example: 'High-end street style editorial of the subject photographed in a busy city, wearing contemporary fashion, pedestrians naturally moving in the background, cinematic lighting, realistic urban photography, magazine-quality composition.',
  },
  {
    cmd: '/backstageeditorial', title: 'Backstage Editorial', kind: 'person',
    desc: 'Behind-the-scenes documentary energy before a show.',
    bestFor: ['BTS content', 'Fashion shows', 'Documentary series'],
    example: 'Behind-the-scenes fashion editorial backstage, clothing racks, makeup artists and stylists blurred in the background, the subject preparing for a runway show, candid lighting, realistic documentary photography.',
  },
  {
    cmd: '/paparazziflash', title: 'Paparazzi Flash', kind: 'person',
    desc: 'Harsh paparazzi flash on a nighttime street.',
    bestFor: ['Celebrity-style content', 'Street photography', 'Nightlife'],
    example: 'Candid nighttime street photograph of the subject captured with harsh paparazzi flash, imperfect framing, natural movement, realistic shadows, subtle motion blur, celebrity street photography aesthetic.',
  },
  {
    cmd: '/fashionfilm', title: 'Fashion Film Still', kind: 'person',
    desc: 'A cinematic still from a luxury fashion film.',
    bestFor: ['Campaign films', 'Key visuals', 'Moodboards'],
    example: 'Cinematic fashion film still, the subject walking through a dramatic architectural environment, flowing fabric, directional lighting, deep shadows, sophisticated color grading, luxury fashion campaign aesthetic.',
  },
  {
    cmd: '/vintageeditorial', title: 'Vintage Editorial', kind: 'person',
    desc: 'A timeless vintage magazine photograph.',
    bestFor: ['Heritage brands', 'Retro campaigns', 'Portraits'],
    example: 'Vintage fashion magazine photograph of the subject, analog film texture, subtle grain, muted tones, natural imperfections, classic studio lighting, timeless editorial composition.',
  },
  {
    cmd: '/monochromeeditorial', title: 'Monochrome Editorial', kind: 'person',
    desc: 'Black-and-white high fashion with dramatic side light.',
    bestFor: ['Portraits', 'Covers', 'Luxury branding'],
    example: 'Black-and-white high-fashion editorial portrait of the subject, dramatic side lighting, deep shadows, detailed skin texture, strong composition, sophisticated magazine photography.',
  },
  {
    cmd: '/mirroreditorial', title: 'Mirror Editorial', kind: 'person',
    desc: 'Surrounded by mirrors and endless reflections.',
    bestFor: ['Surreal campaigns', 'Album art', 'Beauty'],
    example: 'High-fashion editorial portrait of the subject surrounded by large reflective mirrors, multiple reflections, dramatic studio lighting, surreal composition, luxury magazine aesthetic.',
  },
  {
    cmd: '/shadoweditorial', title: 'Shadow Editorial', kind: 'person',
    desc: 'Architectural shadows falling across the subject.',
    bestFor: ['Minimal campaigns', 'Swimwear', 'Luxury branding'],
    example: 'Minimalist fashion editorial with dramatic architectural shadows falling across the subject, hard directional sunlight, clean composition, sophisticated luxury magazine photography.',
  },
  {
    cmd: '/raineditorial', title: 'Rain Editorial', kind: 'person',
    desc: 'Cinematic fashion in heavy rain at night.',
    bestFor: ['Outerwear', 'Moody campaigns', 'Music videos'],
    example: 'Cinematic fashion editorial of the subject photographed in heavy rain at night, wet pavement reflecting city lights, dramatic backlighting, realistic water droplets, luxury campaign aesthetic.',
  },
  {
    cmd: '/glasseditorial', title: 'Glass Editorial', kind: 'person',
    desc: 'Shot through textured glass with distorted reflections.',
    bestFor: ['Beauty', 'Experimental campaigns', 'Album art'],
    example: 'High-fashion portrait of the subject photographed through textured glass, distorted reflections, subtle condensation, dramatic studio lighting, realistic skin texture, experimental magazine photography.',
  },
  {
    cmd: '/luxuryproducteditorial', title: 'Luxury Product Editorial', kind: 'product',
    desc: 'High-end editorial product photography on a sculptural surface.',
    bestFor: ['E-commerce heroes', 'Print ads', 'Launches'],
    example: 'High-end editorial product photograph of the product centered on a sculptural surface, dramatic studio lighting, realistic reflections, premium materials, luxury magazine advertising aesthetic.',
  },
  {
    cmd: '/floatingproducteditorial', title: 'Floating Product Editorial', kind: 'product',
    desc: 'The product floating weightlessly in a minimalist studio.',
    bestFor: ['Tech', 'Beauty', 'Hero banners'],
    example: 'The product floating weightlessly in a minimalist studio, dramatic directional lighting, subtle shadows, realistic reflections, premium advertising photography.',
  },
  {
    cmd: '/paparazziproduct', title: 'Paparazzi Product', kind: 'product',
    desc: 'The product caught by the paparazzi in a luxury setting.',
    bestFor: ['Fashion accessories', 'Social ads', 'Launch teasers'],
    example: 'Candid paparazzi-style photograph of the product being carried through a busy luxury environment, direct flash photography, realistic motion, spontaneous composition, high-fashion campaign aesthetic.',
  },
  {
    cmd: '/overheadproducteditorial', title: 'Overhead Product Editorial', kind: 'product',
    desc: 'Perfect overhead arrangement with styled accessories.',
    bestFor: ['Flat lays', 'Catalogues', 'Instagram grids'],
    example: 'Perfect overhead editorial product photograph of the product surrounded by carefully arranged accessories and materials, clean geometric composition, soft directional shadows, luxury magazine aesthetic.',
  },
];
