/** Original copy for intent-specific entry points; all use the same photo editor. */
export const enEditingTopics = {
  muscleGenerator: {
    keyword: 'AI muscle generator',
    metadata: { title: 'AI Muscle Generator | Athletic Photo Edits & Real Examples', description: 'Try the AI muscle generator on a clothed portrait. Explore real athletic-build and shoulder edits, adjust intensity and generate your own photo result.' },
    breadcrumb: 'AI Muscle Generator',
    hero: { title: 'AI Muscle Generator', subtitle: 'Explore a more athletic appearance, broader shoulders or a focused upper-body edit in your photo.', note: 'Clothed adult photos · Adjustable intensity · One free guest edit' },
    examples: { title: 'Real muscle and shoulder edits', description: 'Compare original photos with muscle and shoulder edits from this editor. Try an athletic build or a more specific request; results vary by photo.' },
    what: {
      title: 'Choose the athletic edit you want',
      paragraphs: [
        'An AI muscle generator changes the appearance of a person in a photograph. The editor starts without a photo, with Muscle selected at 60/100 and no extra instructions. Select a muscle example to load its photo and exact recipe, or upload your own portrait and adjust the settings. Nothing is generated until you select Edit Photo; moving the slider does not produce a new result by itself.',
        'A general Muscle edit asks for more volume and definition around the shoulders, upper arms and chest. That may suit an everyday T-shirt portrait when you want a stronger overall silhouette. If your goal is narrower, use Extra instructions to say which area should change and which areas should stay the same. The shoulders-only example demonstrates a request that keeps the chest, arms, waist and legs at their original size.',
        'Start with a photo where the upper body is easy to see. A front or slight three-quarter view gives more context than a sharply twisted pose. Leave some space beside the arms, and avoid cropping through the shoulder you want to change. Bulky outerwear, crossed arms or a bag covering the torso can make a specific request harder to interpret. These are reasons to choose a clearer original rather than simply increasing strength.',
        'Review the generated image as a whole. Look at the collar, sleeves and fabric folds as well as the shoulder line. Check that the head, hands and background still fit the scene. The instructions ask to preserve identity, clothing and pose, but every result needs review. This is an image effect, not a prediction of training results, body measurements or a physical transformation.'
      ],
      linkBefore: 'Use the ', linkAfter: ' homepage to explore all four editing modes and the full case gallery.',
      sibling: { key: 'waistSlimmer', before: 'If you only want the waist to change, use the ', after: ' with its focused instructions instead.' }
    },
    howTo: {
      title: 'How to use the AI muscle generator',
      steps: [
        { title: 'Upload a clear portrait', description: 'Choose a JPG, PNG or WebP up to 10 MB. Keep the shoulders and intended edit area visible. Uploading selects a local preview; it does not start generation.' },
        { title: 'Set Muscle intensity', description: 'Muscle starts at 60/100. Adjust it or select a muscle example to load its saved strength. Lower it for a lighter request or increase it for a stronger direction. The number is not a percentage of muscle gain.' },
        { title: 'Specify a focused change', description: 'Open Extra instructions when you want broader shoulders only, or a shoulder-and-waist combination. Trying a case fills its exact settings and instructions, which you can then edit.' },
        { title: 'Generate and review', description: 'Select Edit Photo to create a new result. Compare the clothing, face and surroundings with the original before downloading. A later generation uses your current settings.' }
      ]
    },
    tips: {
      title: 'Make the request fit the portrait',
      items: [
        { title: 'Keep clothing in the request', description: 'Ask for an athletic silhouette under the original outfit. A fitted shirt can make the intended shoulder or arm change easier to describe without requesting a different garment.' },
        { title: 'Separate width from volume', description: 'Broader shoulders and larger arms are different goals. Name the area you care about and say what to preserve. A saved case is a useful starting recipe, rather than a fixed result for every photo.' },
        { title: 'Check the surroundings', description: 'Door frames, gym equipment and wall edges can reveal unwanted changes. Inspect them together with the body, especially after a strong edit. Use another generation only after deciding what needs correction.' }
      ]
    },
    faq: { title: 'AI muscle generator questions', items: [
      { question: 'Can I make only my shoulders broader?', answer: 'Yes. Try the shoulders-only case to load Muscle at 80/100 and its exact extra instructions. You can replace the sample with your own photo while keeping those settings, or write a different focused request.' },
      { question: 'Will the picture change live when I move the slider?', answer: 'The slider changes the requested strength. An available outline is only a local guide. Select Edit Photo to generate a new image; the saved example is removed when its settings change.' },
      { question: 'Does the tool remove clothing or require a shirtless photo?', answer: 'Use a clothed adult portrait. The edit asks to preserve the existing outfit and coverage. A T-shirt, polo or other outfit with visible shoulder and arm edges can provide a useful starting point.' },
      { question: 'Can I try it free and continue editing later?', answer: 'One successful guest edit is free. Signing in grants 10 welcome credits once; a new generation or a continued edit uses 10 credits. Loading a result for continued editing does not itself charge credits.' }
    ] },
    related: { description: 'Athletic silhouettes, broader shoulders and focused Muscle-mode requests.' }
  },
  legLengthener: {
    keyword: 'leg lengthener',
    metadata: { title: 'Leg Lengthener | Edit Leg Proportions in Your Photos', description: 'Use the leg lengthener to explore longer-looking legs in a full-body photo. Try real proportion edits, load their settings and generate your own result.' },
    breadcrumb: 'Leg Lengthener',
    hero: { title: 'Leg Lengthener', subtitle: 'Explore longer-looking legs while keeping the rest of your portrait in proportion.', note: 'Full-body clothed photos · Editable instructions · One free guest edit' },
    examples: { title: 'Real longer-legs edit', description: 'Compare the original photo with its longer-legs edit. Try the photo and exact settings, then adapt them to your own photo.' },
    what: {
      title: 'Edit leg proportions in context',
      paragraphs: [
        'A leg lengthener changes the apparent proportions of the legs in a photograph. It does not change a person’s real height. This page starts without a photo, with Proportions selected at 60/100 and blank extra instructions. Select the longer-legs example to load Proportions at 80/100 and its request for longer legs while preserving the upper body. You can inspect and rewrite that instruction before generating.',
        'Use a full-body portrait with the feet and enough ground visible. The relationship between the waist, knees, ankles and shoes helps you assess the edit. A tight crop at the knees hides information that is useful for judging leg length. Sitting, bending a knee or pointing a foot toward the camera changes the visible proportions too; consider whether another pose is a better starting photograph.',
        'Clothing affects how a length change reads. A skirt shows different landmarks from long trousers, while a high waistband already creates a longer-looking leg line. Keep the existing outfit in your instructions and review hems, trouser seams and footwear after generation. A request to retain the upper body can make the intended change clearer, but it does not guarantee that every other pixel will remain identical.',
        'The examples on this page come from the same editor you use for your own photo. Try loads a sample original and the settings used for its saved result. Changing those settings clears the saved preview; it does not stretch that image live. Generate a new result when you are ready, then compare the complete portrait, including the ground, background and spacing around the person.'
      ],
      linkBefore: 'The ', linkAfter: ' homepage has the complete gallery and all four mode choices.',
      sibling: { key: 'bodyEditor', before: 'For a wider explanation of silhouette and pose choices, see the ', after: ' guide.' }
    },
    howTo: {
      title: 'How to try the leg lengthener',
      steps: [
        { title: 'Choose a full-body photo', description: 'Upload a clothed adult portrait in JPG, PNG or WebP, up to 10 MB. Include the shoes and some ground so you can evaluate proportions and framing together.' },
        { title: 'Choose the longer-legs recipe', description: 'Selecting the longer-legs case loads Proportions at 80/100 and its extra instructions. Read the filled field and change it if you want a gentler adjustment or a different balance.' },
        { title: 'Try a relevant case', description: 'Each Try action loads that case’s photo, mode, strength and optional instructions. The original remains on the left. A saved comparison shows what the editor actually produced for that sample.' },
        { title: 'Generate your version', description: 'Select Edit Photo after choosing your settings. Inspect knees, ankles, shoes and the ground line. Download the generated file only after checking the overall image.' }
      ]
    },
    tips: {
      title: 'What to check in a leg-length edit',
      items: [
        { title: 'Keep the whole frame visible', description: 'A believable proportion change needs room in the image. Review the space above the head and below the shoes rather than judging a cropped close-up of the legs alone.' },
        { title: 'Inspect garment details', description: 'Look at skirt hems, knee placement and trouser folds. A proportion edit can affect how clothing appears to hang. These details help you decide whether to lower the requested strength.' },
        { title: 'Review perspective', description: 'Ground tiles, steps and nearby people provide context for height and scale. Check those features alongside the edited figure. Camera perspective can explain an unusual starting proportion before any edit is applied.' }
      ]
    },
    faq: { title: 'Leg lengthener questions', items: [
      { question: 'Can I request longer legs without changing my torso?', answer: 'The longer-legs example’s extra instructions make that request explicit. Select the case to load them, then edit them before submitting if needed. Preservation is a direction rather than a guarantee, so review the shoulders, torso and clothing in the result.' },
      { question: 'Does intensity set a specific number of centimetres?', answer: 'No. Intensity is a strength from 1 to 100. It is not a measurement, a height calculator or an exact percentage of leg extension. The final appearance depends on the source photo and the generated edit.' },
      { question: 'Can I use a seated or cropped photo?', answer: 'You can submit a supported photo, but a clear standing full-body image makes this particular goal easier to assess. If the feet or most of the legs are missing, choose another original to judge the result more usefully.' },
      { question: 'Will selecting a case use my free edit?', answer: 'No. Loading a case, reviewing its saved comparison and changing settings do not generate an image. Only selecting Edit Photo starts a new generation under the existing guest or account credit rules.' }
    ] },
    related: { description: 'Longer-looking legs, full-body framing and leg-to-torso balance.' }
  },
  waistSlimmer: {
    keyword: 'waist slimmer',
    metadata: { title: 'Waist Slimmer | Focused Waist Photo Edits & Examples', description: 'Try a waist slimmer with a focused waist-only request. Compare real editor results, keep other areas in your instructions and generate an edit of your photo.' },
    breadcrumb: 'Waist Slimmer',
    hero: { title: 'Waist Slimmer', subtitle: 'Request a slimmer waist while asking to keep your arms, legs, shoulders and chest unchanged.', note: 'Clothed adult portraits · Waist-only preset · One free guest edit' },
    examples: { title: 'Real waist-only edit', description: 'Compare the original photo with the result of a focused waist-only edit. Select Try to load the photo and exact settings.' },
    what: {
      title: 'Make a waist-only request',
      paragraphs: [
        'A waist slimmer changes the appearance of the waist in an image. The editor opens without a photo, with Slim selected at 60/100 and blank extra instructions. Select the waist-only example to load its photo, Slim at 70/100 and a request to retain the original size of the arms, legs, shoulders and chest. Read or change that request before submitting a new edit.',
        'Choose an original where the waist is visible beneath the existing outfit. A relaxed standing pose with the arms slightly away from the torso can show the area clearly. An arm, handbag or bulky jacket covering the waist may leave less context for the edit. A side bend or twisted pose also affects the visible outline; consider the original posture when deciding what you want to change.',
        'Keep your goal specific. You might ask for a subtle narrowing under the same shirt rather than an overall slimmer figure. If you also want the arms or hips changed, describe that directly or try the broader Slim example. Extra instructions can narrow the selected preset’s target, but they do not turn it into an exact measuring tool or guarantee that unrelated details will be untouched.',
        'After generation, check the waist together with the shirt, waistband and surroundings. Look for fabric folds that no longer make sense, a curved wall edge or an altered hand near the body. The editor requests preservation of identity, pose and clothing coverage, and the result still needs your review. An edited portrait is a visual change to a photo, not a record of weight loss or a prediction of a physical outcome.'
      ],
      linkBefore: 'Visit the ', linkAfter: ' homepage for the full editor and every real example.',
      sibling: { key: 'skinnyFilter', before: 'For a broader silhouette change, explore the ', after: ' guide and its general Slim workflow.' }
    },
    howTo: {
      title: 'How to use the waist slimmer',
      steps: [
        { title: 'Select your original', description: 'Upload a clothed adult portrait in JPG, PNG or WebP, up to 10 MB. Show the waist clearly and leave some background on both sides of the body.' },
        { title: 'Load the waist-only instructions', description: 'Select the waist-only example to fill Slim 70/100 and its focused request. Change the wording to match your intended edit and name any areas you especially want to preserve.' },
        { title: 'Adjust the requested strength', description: 'Use the intensity slider for a lighter or stronger direction. A local outline may appear as a guide; you can generate immediately without waiting for it to finish.' },
        { title: 'Generate and inspect', description: 'Select Edit Photo to create your result. Compare the torso, sleeves, hands and background before downloading. You can continue editing an actual generated result when your account has enough credits.' }
      ]
    },
    tips: {
      title: 'Keep a focused waist edit readable',
      items: [
        { title: 'Name the unchanged areas', description: 'The waist-only sample explicitly asks to preserve arms, legs, shoulders and chest. Keep those instructions if they match your goal, and review those areas in the output as carefully as the waist itself.' },
        { title: 'Use the outfit as context', description: 'A waistband, side seam or tucked shirt helps you assess the requested change. Do not assume a narrower outline also means that garment folds and fit have been preserved correctly.' },
        { title: 'Avoid judging one small crop', description: 'Review the full portrait before sharing. A waist can look different when viewed alone than it does beside the shoulders, hips and pose. Keep the original available while assessing that overall balance.' }
      ]
    },
    faq: { title: 'Waist slimmer questions', items: [
      { question: 'How is this different from the general Slim mode?', answer: 'It uses the same editor and Slim mode. Selecting the waist-only case fills a more specific extra instruction that limits the intended change to the waist. Removing that request returns to the broader slimming direction of the selected preset.' },
      { question: 'Can I keep my arms and legs the same size?', answer: 'Yes, you can request that explicitly, as the waist-only example does. The AI result still needs review. A request to preserve a body area does not guarantee that its shape, clothing or surrounding pixels will remain identical.' },
      { question: 'Is the waist example a live preview of my settings?', answer: 'No. It is a saved result made with the example’s original recipe. Changing its mode, intensity or extra instructions clears that saved preview. Select Edit Photo to generate a result using your current settings.' },
      { question: 'Does clearing a preview delete the saved work?', answer: 'Clear result removes the right-side preview from the editor, while Clear photo removes the left original. They are independent. Deleting a saved generated image is a separate action in My works.' }
    ] },
    related: { description: 'Waist-only instructions, clothing checks and focused Slim edits.' }
  }
};
