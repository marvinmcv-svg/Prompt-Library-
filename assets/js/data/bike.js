// Bike Style — /SHOT/LENS/MOOD command system for ChatGPT image generation.

export const SHOT = {
  pov: "first-person rider view over the handlebars, rider's hands on the grips, dashboard at the bottom of frame, road ahead",
  birdview: 'straight top-down overhead view from about 15 m above',
  ultracloseup: "extreme macro on one detail: tank, headlight, tyre tread, chrome, rider's eyes or a hand on the throttle",
  lowangle: 'camera a few centimetres off the ground looking up, rider and bike towering over the lens',
  reflection: 'scene shown through a reflection: rain puddle, side mirror, shop window or helmet visor',
  silhouette: 'rider and bike as a dark backlit shape against a bright sky',
  fullbody: 'whole rider head to toe and whole bike wheel to wheel, nothing cropped',
  sideprofile: 'exact 90-degree side view of the bike, rider seated',
  tracking: 'shot from a vehicle moving alongside at the same speed',
  rearview: 'from behind, rider riding away down the road',
  headon: 'straight on from the front, headlight facing the lens',
  dutchangle: 'horizon tilted 15–20 degrees for tension',
  overshoulder: "behind the rider's shoulder, looking at the road or view ahead",
  drone: 'high three-quarter aerial chase shot from about 20 m behind',
  cornerlean: 'low angle on a curve, bike leaning into the bend',
  highangle: 'camera above eye level looking down at the rider',
  portrait: 'waist-up rider portrait, bike soft behind',
  seated: 'rider sitting relaxed on the parked bike',
  walkaway: 'rider walking away from the parked bike',
};

export const LENS = {
  wide: '20mm wide angle, lots of environment',
  ultrawide: '14mm, stretched exaggerated perspective',
  fisheye: '8mm fisheye, curved horizon',
  '24mm': '24mm, wide documentary perspective',
  '35mm': '35mm, natural street / film perspective',
  '50mm': '50mm, true-to-eye clean perspective',
  '85mm': '85mm portrait compression, creamy background blur',
  '135mm': '135mm strong compression, background stacked close behind',
  telephoto: '200mm+ telephoto, heavy compression, shot from far away',
  anamorphic: 'cinematic anamorphic look, oval bokeh, horizontal lens flares',
  bokeh: 'f/1.4 razor-thin focus, big round bokeh balls',
  macro: '100mm macro, tiny details razor sharp',
  tiltshift: 'tilt-shift miniature effect',
  gopro: 'action-camera look, wide and punchy',
};

export const MOOD = {
  motionblur: 'real speed: panning blur, streaked background, spinning wheels, rider sharp',
  monsoon: 'heavy South Asian monsoon: dark clouds, sheets of rain, flooded road, spray from the tyres, lush green',
  rain: 'steady rain, droplets on paint and chrome, wet glossy road',
  wet: 'just after rain: glossy asphalt, puddles, clearing sky',
  cinematic: 'film still: teal-orange grade, deep contrast, subtle grain',
  moody: 'low-key, desaturated, deep shadows, quiet and serious',
  sunset: 'sun on the horizon, orange-magenta sky, warm backlight',
  sunrise: 'first light, soft pink-gold sky, low mist on the ground',
  goldenhour: 'warm low sun, long shadows, glowing skin and paint',
  bluehour: 'cool blue twilight, first city lights on',
  night: 'night street, sodium and LED street lights',
  neon: 'neon signs, magenta and cyan reflections on wet asphalt',
  lighttrails: 'long exposure, car light trails streaking past',
  fog: 'thick fog, soft diffused light, visible headlight beams',
  storm: 'dark storm clouds, lightning, strong wind',
  dust: 'dusty dirt road, dust cloud kicked up by the tyres',
  offroad: 'muddy gravel trail, dirt on the tyres and bodywork',
  travel: 'road trip: luggage strapped to the bike, open scenic road, adventure feel',
  highway: 'long empty highway, lane lines, open horizon',
  mountain: 'mountain pass, switchbacks, big peaks',
  coastal: 'sea road, ocean and cliffs',
  desert: 'sand dunes, heat haze, dry light',
  forest: 'green forest road, light through the trees',
  city: 'dense city street, traffic and buildings',
  autumn: 'falling leaves, amber colour',
  winter: 'snow on the roadside, cold crisp light',
  garage: 'moody workshop, tools on the wall, one hanging light',
  studio: 'black studio, rim light outlining the bike',
  editorial: 'clean fashion-magazine styling',
  dreamy: 'soft haze, pastel tones, gentle glow',
  vintage: 'faded 1970s film colour, soft grain',
  bw: 'black and white, rich contrast',
  noir: 'hard black and white, dramatic shadows',
};

export const BIKES = [
  'a matte-black café racer with a tan leather seat and round headlight',
  'a gloss-red sport bike with white race decals and a carbon exhaust',
  'a sand-coloured adventure tourer with aluminium panniers and knobbly tyres',
  'a chrome-heavy vintage cruiser with whitewall tyres',
  'a British-green scrambler with a high-mounted exhaust',
  'a pearl-white naked streetfighter with gold forks',
];

export const RIDERS = [
  'a rider in a worn brown leather jacket, dark jeans and boots',
  'a rider in a black textile riding suit with a matte helmet held under one arm',
  'a rider with braided hair in a cropped denim jacket and white sneakers',
  'a bearded rider in a waxed-cotton jacket and a vintage open-face helmet',
];

export const HERO = [
  {
    cmd: '/pov/wide/motionblur', title: 'The Speed Opener',
    tagline: "Rider's-eye view at full speed: handlebars sharp, the whole world streaking past.",
    prompt: `Use the uploaded photo as the exact reference for the motorcycle and the rider. Keep the same bike (make, model, paint colour, decals, mirrors, dashboard and handlebars) and the rider's hands, gloves and jacket sleeves exactly as in the photo.

Shot: first-person POV from the rider's eyes, looking over the handlebars. Both hands grip the bars in the lower third of the frame, the instrument cluster and top of the headlight visible along the bottom edge, the open road stretching ahead to a vanishing point.
Lens: 20mm wide angle, horizon level, the road filling the frame.
Mood: real speed. Strong motion blur on the road surface, lane markings and roadside trees streaking toward the frame edges, slight vibration, while the handlebars, hands and dashboard stay tack sharp. Bright natural daylight, clear sky.

Photorealistic action-camera photograph, true lens behaviour, natural reflections on the tank and chrome. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/birdview/wide/monsoon', title: 'The Monsoon Aerial',
    tagline: 'Straight down from the sky onto a rain-soaked road, with a white wake trailing the rear tyre.',
    prompt: `Use the uploaded photo as the exact reference for the motorcycle and the rider: same bike, same paint colour and details, same rider, outfit and helmet as in the photo.

Shot: straight top-down bird's-eye view from about 15 metres above, camera pointing directly at the ground. The rider rides the bike along a wet two-lane road, small and centred in the frame, bike and rider clearly readable from above.
Lens: 20mm wide angle, lots of road and surroundings in frame.
Mood: heavy South Asian monsoon. Sheets of rain falling toward the ground, the road flooded with shallow water, a bright V-shaped wake and spray trailing behind the rear tyre, ripples spreading across the puddles, lush dark-green trees and banana leaves along the road edges, deep grey storm light, glossy wet asphalt reflecting the sky.

Photorealistic drone photograph, natural colour, crisp detail. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/ultracloseup/bokeh/rain', title: 'The Rain Detail',
    tagline: 'Macro on the bike with raindrops catching the light and the city melting into bokeh behind.',
    prompt: `Use the uploaded photo as the exact reference for the motorcycle: same paint colour, finish, decals, chrome and materials.

Shot: extreme macro close-up on one detail of the bike: the curve of the fuel tank where the paint meets the chrome trim. The detail fills the frame.
Lens: fast 85mm at f/1.4, razor-thin plane of focus on the nearest raindrops, everything behind melting into large round bokeh balls from distant street lights.
Mood: steady rain. Beaded water droplets on the glossy paint, a few drops running down the curve, fine mist in the air, cool blue-grey light with warm amber bokeh behind, the paint colour rich and saturated from the wet.

Photorealistic macro photograph, true paint and metal reflections, visible water surface tension. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/lowangle/35mm/cinematic', title: 'The Hero Shot',
    tagline: 'Camera on the asphalt, rider and bike towering over the lens like a movie poster.',
    prompt: `Use the uploaded photo as the exact reference: keep the rider's face, hairstyle, skin tone and outfit, and the exact same motorcycle, paint colour and details.

Shot: low-angle hero shot, camera a few centimetres above the asphalt, looking up. The rider sits on the stationary bike, one foot down, looking slightly past the camera with a calm, confident expression. Front wheel and headlight large in the foreground, the rider rising above them against the sky.
Lens: 35mm, natural perspective, rider and bike sharp, background softly out of focus.
Mood: cinematic film still. Teal-and-orange colour grade, warm light on the skin and tank, cool shadows, deep contrast, gentle highlight roll-off, subtle 35mm film grain, an empty city road stretching away behind.

Photorealistic movie still, real lens behaviour, natural skin texture. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/reflection/85mm/moody', title: 'The Puddle Mood',
    tagline: 'The rider seen only in a rain puddle: dark, quiet and still.',
    prompt: `Use the uploaded photo as the exact reference: same rider face, hairstyle, outfit and helmet, same motorcycle and paint colour.

Shot: the scene is seen through its reflection in a rain puddle on dark asphalt. The rider stands beside the parked bike; their mirrored image fills the upper two-thirds of the frame, the real puddle edge and wet ground visible along the bottom. A single drop has just hit the water, sending soft ripples through the reflection.
Lens: 85mm, compressed perspective, focus on the reflected rider, the ground edge softly blurred.
Mood: moody low-key. Desaturated colours, deep blacks, one cold street light overhead, faint mist in the air, quiet and serious.

Photorealistic photograph, believable water reflection and ripple distortion, natural skin texture. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/silhouette/anamorphic/sunset', title: 'The Sunset Silhouette',
    tagline: 'Rider and bike as one black shape against a burning sky, with an anamorphic flare.',
    prompt: `Use the uploaded photo as the exact reference for the rider's body shape, hairstyle or helmet outline, and the exact outline of the motorcycle. Tank, seat, exhaust, mirrors and wheels must read clearly in silhouette.

Shot: side-on silhouette. The rider sits on the stationary bike at the edge of a raised road on a hilltop, the full outline sharp and black against the sky, placed in the lower third of the frame.
Lens: anamorphic cinema lens, a horizontal blue-orange lens flare streaking across the frame from the sun, oval bokeh, slight edge falloff.
Mood: sunset. The sun just touching the horizon directly behind the rider, the sky burning orange into magenta and deep purple above, thin glowing clouds, warm haze over the land below.

Photorealistic cinematic photograph, clean silhouette edges with a thin rim of light. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
  {
    cmd: '/fullbody/35mm/travel', title: 'The Road Trip Closer',
    tagline: 'The whole rider, the whole bike and the whole road ahead.',
    prompt: `Use the uploaded photo as the exact reference: keep the rider's face, hairstyle, skin tone, body and outfit, and the exact same motorcycle, paint colour, decals and accessories.

Shot: full-body shot. The rider stands next to the parked bike at the edge of an open scenic road, one hand resting on the seat, head to toe in frame and the bike visible wheel to wheel, nothing cropped.
Lens: 35mm, eye-level camera, natural perspective, rider and bike sharp, landscape slightly soft.
Mood: road trip. A rolled travel bag and side luggage strapped to the bike without changing the bike itself, the road winding away into green hills and distant mountains, soft late-afternoon sun, a few clouds, a feeling of freedom and adventure.

Photorealistic travel photograph, natural colours, real fabric and metal texture. Vertical 9:16. No added text, no watermark, no invented logos.`,
  },
];

export const LIBRARY = [
  { group: 'Speed & Motion', lines: `
/tracking/50mm/motionblur|Side-by-side chase shot, rider sharp, background streaked
/pov/gopro/highway|Action-cam POV down an endless highway
/cornerlean/telephoto/motionblur|Bike leaned into a bend, compressed and fast
/rearview/wide/motionblur|Rider blasting away from the lens, road smeared
/headon/135mm/motionblur|Headlight charging at the camera, background melted
/drone/wide/highway|Aerial chase following the bike down the highway
/lowangle/ultrawide/motionblur|Tyre-level speed with a stretched, dramatic road
/tracking/anamorphic/cinematic|Movie-style car-to-bike chase with lens flare
/pov/fisheye/city|Curved fisheye POV threading through city streets
/dutchangle/35mm/motionblur|Tilted horizon, pure speed and tension` },
  { group: 'Rain & Monsoon', lines: `
/lowangle/35mm/monsoon|Hero angle with tyre spray and a flooded road
/reflection/50mm/rain|Rider and bike mirrored in a rain puddle
/headon/85mm/monsoon|Headlight beam cutting through sheets of rain
/ultracloseup/macro/rain|Droplets beading on the tank paint
/rearview/telephoto/monsoon|Rider disappearing into a wall of rain
/portrait/bokeh/rain|Wet rider portrait, raindrop bokeh behind
/sideprofile/35mm/wet|Clean side profile on glossy, just-rained asphalt
/birdview/wide/rain/night|Top-down night ride on a mirror-wet road
/seated/85mm/monsoon/moody|Rider waiting out the storm on the parked bike
/tracking/wide/monsoon|Side-by-side ride with a wake of spray` },
  { group: 'Golden Hour & Sunset', lines: `
/sideprofile/85mm/goldenhour|Warm side profile, glowing paint
/rearview/anamorphic/sunset|Riding off into the sun with lens flare
/silhouette/telephoto/sunset|Huge sun behind a small rider silhouette
/portrait/85mm/goldenhour|Golden, glowing rider portrait
/lowangle/wide/sunrise|Hero angle under a pink-gold sunrise sky
/drone/wide/goldenhour|Aerial with long shadows across the road
/seated/50mm/sunset|Rider relaxed on the bike, watching the sun go down
/walkaway/35mm/goldenhour|Rider walking away from the bike, long shadows
/cornerlean/anamorphic/sunset|Leaning into a bend under a sky on fire
/silhouette/wide/sunrise/fog|Silhouette rising out of morning mist` },
  { group: 'Night & Neon City', lines: `
/lowangle/35mm/neon|Hero shot glowing in magenta and cyan
/reflection/85mm/neon|Neon city mirrored in a wet street puddle
/rearview/telephoto/lighttrails|Rider among streaking car lights
/portrait/bokeh/night|Rider portrait with city-light bokeh
/sideprofile/50mm/bluehour|Side profile as the city lights switch on
/headon/wide/night|Headlight blaze on an empty night street
/birdview/wide/neon|Top-down onto a glowing neon intersection
/seated/85mm/city/night|Rider parked under a single street light
/tracking/35mm/lighttrails|Chase shot with light trails smearing past
/dutchangle/24mm/neon/rain|Tilted, rain-soaked cyberpunk frame` },
  { group: 'Travel & Road Trip', lines: `
/drone/wide/mountain|Bike on a winding mountain pass from above
/rearview/35mm/travel|Loaded bike heading toward the horizon
/overshoulder/24mm/mountain|Rider's view of the peaks ahead
/fullbody/50mm/coastal|Rider and bike on a sea-cliff road
/sideprofile/wide/desert|Bike across dunes and heat haze
/birdview/wide/forest|Tiny bike on a road cutting through green forest
/seated/35mm/travel/goldenhour|Road-trip rest stop in warm light
/lowangle/wide/highway|Hero angle on an endless empty highway
/walkaway/24mm/coastal|Rider walking toward the sea, bike parked behind
/fullbody/35mm/travel/winter|Snowy roadside stop, cold crisp air` },
  { group: 'Detail & Macro', lines: `
/ultracloseup/macro/studio|Tank badge and paint under studio rim light
/ultracloseup/bokeh/night|Headlight glowing with street-light bokeh
/ultracloseup/macro/garage|Chain and sprocket in the workshop
/ultracloseup/85mm/cinematic|Rider's eyes in extreme close-up, film grade
/ultracloseup/macro/dust|Dusty tyre tread and gravel grit
/ultracloseup/bokeh/goldenhour|Hand on the throttle grip, golden glow
/ultracloseup/macro/wet|Water running off the chrome exhaust
/ultracloseup/50mm/vintage|Speedometer dial in faded film tones
/ultracloseup/macro/bw|Engine fins in black and white
/ultracloseup/bokeh/neon|Mirror edge with neon city bokeh` },
  { group: 'Rider Portrait & Style', lines: `
/portrait/85mm/editorial|Magazine-cover rider portrait
/seated/50mm/editorial|Fashion shoot sitting on the bike
/fullbody/85mm/studio|Clean full-length studio shot with the bike
/portrait/135mm/moody|Compressed, serious, dark portrait
/highangle/35mm/editorial|Looking down at the rider on the bike
/walkaway/85mm/cinematic|Glance back while walking away, film grade
/portrait/bokeh/sunset|Warm backlit portrait with sun flare
/fullbody/24mm/city|Street-style look in the middle of the city
/seated/85mm/dreamy|Soft, hazy pastel portrait on the bike
/lowangle/50mm/editorial|Power pose from below` },
  { group: 'Moody & Film Looks', lines: `
/lowangle/35mm/noir|Hard black-and-white hero shot
/sideprofile/50mm/vintage|1970s faded-film side profile
/reflection/85mm/bw|Black-and-white puddle reflection
/rearview/35mm/fog|Rider fading into thick fog
/silhouette/85mm/storm|Silhouette under a lightning strike
/headon/anamorphic/fog|Headlight beams cutting fog, oval bokeh
/seated/35mm/moody/garage|Late night in the workshop
/portrait/50mm/vintage|Retro film portrait
/drone/telephoto/fog|Bike on a road floating above the mist
/dutchangle/35mm/noir/rain|Rainy black-and-white thriller frame` },
  { group: 'Aerial & Wide World', lines: `
/birdview/tiltshift/city|Miniature-world bike in the city
/drone/ultrawide/coastal|Sweeping coast road from above
/birdview/wide/autumn|Top-down on a road of fallen leaves
/drone/wide/desert|Lone bike trailing dust across the desert
/birdview/tiltshift/mountain|Toy-like hairpin bends
/highangle/wide/forest|Looking down through the forest trees
/drone/telephoto/sunset|Tiny rider on a long road at sunset
/birdview/wide/winter|Bike on a snow-lined road from above
/drone/wide/offroad|Muddy trail from the air
/birdview/fisheye/neon|Curved top-down over a neon street` },
  { group: 'Garage, Studio & Off-road', lines: `
/sideprofile/50mm/studio|Showroom side profile on black
/headon/85mm/studio|Studio front shot with rim light
/fullbody/35mm/garage|Rider and bike in a moody workshop
/lowangle/wide/garage|Hero angle under a single hanging bulb
/highangle/35mm/studio|Clean three-quarter product angle from above
/cornerlean/telephoto/offroad|Leaning through a muddy trail turn
/tracking/gopro/dust|Action-cam chase through a dust cloud
/rearview/wide/offroad|Mud flying off the rear tyre
/seated/35mm/offroad/goldenhour|Muddy bike, golden-hour rest
/portrait/85mm/dust|Dusty, gritty rider portrait` },
];

export const ENGINE = `You are BIKE STYLE, a photorealistic motorcycle photography engine. From now on I will control you with short slash commands. Do not chat, explain or ask questions. When I send a command, generate the image.

REFERENCE LOCK:
I will upload one photo of me with my bike. That photo is the only identity reference for every image in this chat.
* Rider: keep my exact face, facial structure, skin tone, hairstyle, facial hair, body shape and outfit. Keep the helmet exactly as in the photo: on, off or held.
* Bike: keep the exact same make and model, frame, paint colour, decals, tank shape, seat, exhaust, wheels, mirrors, lights and accessories. Never swap it for a different bike.
* Number plate: keep its position, but never invent new readable plate text.

COMMAND FORMAT: /SHOT/LENS/MOOD
* Slot 1 = SHOT (camera position and framing)
* Slot 2 = LENS (lens, depth of field, perspective)
* Slot 3 = MOOD (weather, light, colour grade, story)
* Ignore spaces and capital letters. "/ultracloseup/bokeh / rain" is valid.
* A 4th or 5th slot stacks extra mood on top, e.g. /lowangle/35mm/cinematic/night
* If a word sits in an unusual slot, still apply its meaning.
* If a word is not in the dictionary, read it as a normal photography term and apply it.

{{DICTIONARY}}

UTILITY COMMANDS:
/menu = list every command word in three columns: SHOT, LENS, MOOD
/random = pick one word from each slot and generate it
/again = new variation of the last command
/ratio 9:16 | 4:5 | 1:1 | 16:9 = change the aspect ratio for all next images
/rider off = bike-only shots from now on
/rider on = put the rider back in
/lock = re-check my uploaded photo and correct any face or bike drift in the next image

ALWAYS:
* One photorealistic image per command, vertical 9:16 unless I change /ratio.
* Real camera look: true lens behaviour, natural skin texture, real metal and paint reflections.
* Correct anatomy and a natural riding posture, both hands on the bars in riding shots.
* Keep the bike mechanically correct: two wheels, correct fork, chain and exhaust.
* No added text, captions, watermarks or invented logos inside the image.
* After the image, reply with one line only: the command you rendered.

Now reply only: "BIKE STYLE is ready. Upload a photo of you with your bike, then send a command like /lowangle/35mm/cinematic."`;
