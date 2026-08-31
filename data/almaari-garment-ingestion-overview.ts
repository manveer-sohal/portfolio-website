import { architectureDecisions } from "./almaari-case-studies";
import type { Project } from "./types";

export function createGarmentIngestionOverviewProject(
  almaari: Project,
): Project {
  return {
    ...almaari,
    name: "Redesigning Almaari's AI Garment Ingestion Pipeline",
    shortDescription:
      "A reliability-focused redesign of garment uploads, image processing, and AI enrichment around durable workflow state and safe retries.",
    fullDescription:
      "Almaari's Add Clothes flow accumulated background removal, manual AI analysis, credit accounting, persistence, and enrichment across several layers. This in-progress redesign treats those steps as one asynchronous workflow whose progress is persisted on the Clothes record.",
    problemSummary:
      "No single layer clearly owned a garment's progress through upload, cropping, AI analysis, enrichment, and review.",
    status: "In progress",
    role: "Architecture Analysis and Full-Stack Engineering",
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "AWS S3",
      "Google Cloud Tasks",
      "Google Cloud Run",
      "Python",
      "OpenAI",
    ],
    metrics: [
      {
        label: "Current upload volume",
        value: "20–30/day",
        description:
          "The architecture is intentionally sized for Almaari's current garment-upload volume.",
      },
      {
        label: "Processing target",
        value: "<5 sec",
        description:
          "Design target for normal crop and garment-analysis processing after rollout.",
      },
      {
        label: "Workflow identity",
        value: "1 record",
        description:
          "The Clothes record stores the workflow state and completed checkpoints.",
      },
    ],
    links: almaari.links.filter((link) => link.type !== "case-study"),
    coverImage: "/projects/almaari/case-study/post-crop.png",
    problem: [
      "The user must manually advance AI analysis even though processing can begin as soon as the upload completes.",
      "Credit checks, deductions, and refunds couple billing logic to a standard ingestion workflow.",
      "Frontend guards, MongoDB jobs, startup reclaim, and internal worker endpoints overlap without one clear recovery owner.",
      "Cropping and analysis can fail independently, but successful work is not represented as one checkpointed sequence.",
      "Upload, processing, persistence, enrichment, and review do not share one durable state machine.",
    ],
    solution: [
      "Use the Clothes record as the workflow source of truth, with explicit processing status and stage fields.",
      "Upload images directly to S3 with a presigned URL, then end the user-facing API request early.",
      "Use Cloud Tasks for durable at-least-once delivery and a dedicated Cloud Run worker for ingestion.",
      "Checkpoint cropping before AI analysis so a later retry resumes without repeating successful work.",
      "Start standard garment analysis automatically and remove credit handling from the normal upload path.",
    ],
    contributions: [
      "Mapped the current upload flow and identified where workflow ownership and retry behavior were fragmented.",
      "Designed a persisted Clothes state machine covering processing, review, failure, reprocessing, and activation.",
      "Defined request-level, workflow-level, and finalization idempotency boundaries.",
      "Designed degraded paths for crop outages, AI outages, browser refreshes, duplicate delivery, and delayed reprocessing.",
      "Documented production behavior separately from proposed components and post-rollout design targets.",
    ],
    features: [
      "Create a pending Clothes record and upload the original image directly to S3.",
      "Confirm the upload and enqueue one stable PROCESS_CLOTHING task.",
      "Crop, checkpoint, analyze, and persist generated metadata in the ingestion worker.",
      "Restore progress from persisted state after refreshes or duplicate task delivery.",
      "Let the user review generated metadata before finalizing the garment as active.",
    ],
    architecture: [
      "Browser: selects the image, uploads to S3, observes processing state, and supports final review.",
      "Express API on Cloud Run: authenticates, creates Clothes records, issues presigned URLs, and schedules processing.",
      "MongoDB Atlas: stores workflow status, processing checkpoints, generated metadata, and errors.",
      "Amazon S3: stores original and processed garment images outside the public API request path.",
      "Google Cloud Tasks: provides durable delivery and managed retries for the ingestion task.",
      "Dedicated Cloud Run worker: advances the workflow and resumes from the last completed stage.",
      "Crop and vision services: remove the background and generate garment metadata sequentially.",
    ],
    technicalDecisions: architectureDecisions.map((decision) => ({
      title: decision.title,
      description: `${decision.decision} ${decision.why} Trade-off: ${decision.tradeoff}`,
    })),
    tradeoffs: [
      {
        title: "Managed tasks over a MongoDB queue",
        description:
          "Cloud Tasks adds a provider boundary, but avoids keeping polling, delivery semantics, and abandoned-job reclaim inside the application.",
      },
      {
        title: "One checkpointed task over one task per stage",
        description:
          "A single task is easier to operate at current scale, while the worker takes responsibility for crop and analysis orchestration.",
      },
      {
        title: "Sequential crop then analysis",
        description:
          "The vision model receives a cleaner image and the workflow remains understandable, at the cost of more latency than parallel processing.",
      },
      {
        title: "Automatic analysis",
        description:
          "Removing the manual credit step simplifies the experience and retry logic, but every completed upload now incurs model inference cost.",
      },
    ],
    gallery: [
      {
        src: "/projects/almaari/case-study/pre-crop.png",
        alt: "Almaari garment upload before background removal",
        caption: "1. The frontend prepares the selected garment image.",
      },
      {
        src: "/projects/almaari/case-study/post-crop.png",
        alt: "Almaari garment upload after background removal",
        caption:
          "2–3. Background removal completes before the separate Smart Fill action.",
      },
      {
        src: "/projects/almaari/case-study/ai.png",
        alt: "Almaari garment form with AI-generated item details",
        caption: "4. AI analysis generates the core garment metadata.",
      },
      {
        src: "/projects/almaari/case-study/missing-meta-data.png",
        alt: "Almaari garment form showing optional enrichment fields",
        caption:
          "5. Optional style metadata improves later outfit recommendations.",
      },
    ],
    featurePreviews: undefined,
    expandable: undefined,
    relatedSlugs: undefined,
  };
}
