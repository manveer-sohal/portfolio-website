export type GarmentFlowCarouselSlide = {
  id: string;
  step: string;
  title: string;
  body: string;
  callouts: Array<{
    number: number;
    text: string;
  }>;
  image: {
    src: string;
    optimizedBase: string;
    alt: string;
    width: number;
    height: number;
  };
};

export const currentGarmentFlowSlides: GarmentFlowCarouselSlide[] = [
  {
    id: "prepare-image",
    step: "Step 1",
    title: "Prepare the garment image",
    body: "The user selects an image of their garment.",
    callouts: [
      {
        number: 1,
        text: "The frontend resizes and compresses the image before sending it to the server as a Base64-encoded payload.",
      },
    ],
    image: {
      src: "/projects/almaari/case-study/pre-crop.png",
      optimizedBase: "/projects/almaari/case-study/pre-crop",
      alt: "Almaari Add Clothes form showing a garment positioned inside the crop guide",
      width: 1742,
      height: 978,
    },
  },
  {
    id: "review-and-analyze",
    step: "Step 2",
    title: "Review the crop and request analysis",
    body: "In less than a second, the cropped image appears after the user uploads the original image.",
    callouts: [
      {
        number: 2,
        text: "The image is sent to the background-cropping service, which removes the background and returns the processed image to the frontend.",
      },
      {
        number: 3,
        text: "AI-powered Smart Fill remains a separate action and consumes one credit before generating the garment details.",
      },
    ],
    image: {
      src: "/projects/almaari/case-study/post-crop.png",
      optimizedBase: "/projects/almaari/case-study/post-crop",
      alt: "Almaari Add Clothes form after cropping, with item details and the one-credit Analyze image action",
      width: 1744,
      height: 978,
    },
  },
  {
    id: "manual-ai-analyze",
    step: "Step 3",
    title: "Analyze with AI",
    body: "The analysis takes approximately 2–3 seconds, making it much faster than filling in these fields manually.",
    callouts: [
      {
        number: 4,
        text: "The user clicks Analyze to generate metadata such as the garment's colour, category, and pattern.",
      },
    ],
    image: {
      src: "/projects/almaari/case-study/ai.png",
      optimizedBase: "/projects/almaari/case-study/ai",
      alt: "Almaari Add Clothes form after AI analysis has generated garment metadata",
      width: 1742,
      height: 980,
    },
  },
  {
    id: "enrichment-needed",
    step: "Step 4",
    title: "Complete enrichment data",
    body: "Users can fill in the optional fields themselves or submit the garment immediately. If left incomplete, a queued background job handles the enrichment automatically.",
    callouts: [
      {
        number: 5,
        text: "Additional metadata helps Almaari make better outfit recommendations.",
      },
    ],
    image: {
      src: "/projects/almaari/case-study/missing-meta-data.png",
      optimizedBase: "/projects/almaari/case-study/missing-meta-data",
      alt: "Almaari Add Clothes form showing optional enrichment fields before submission",
      width: 1738,
      height: 980,
    },
  },
];
