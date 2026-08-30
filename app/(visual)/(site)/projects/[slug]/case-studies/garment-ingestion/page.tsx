import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureComparison } from "@/components/projects/case-study/ArchitectureComparison";
import { ArchitectureDiagram } from "@/components/projects/case-study/ArchitectureDiagram";
import { CaseStudyHeader } from "@/components/projects/case-study/CaseStudyHeader";
import { CaseStudyMetadata } from "@/components/projects/case-study/CaseStudyMetadata";
import { CaseStudySection } from "@/components/projects/case-study/CaseStudySection";
import { CaseStudyTableOfContents } from "@/components/projects/case-study/CaseStudyTableOfContents";
import { CurrentFlowCarousel } from "@/components/projects/case-study/CurrentFlowCarousel";
import { ProcessingStateMachine } from "@/components/projects/case-study/ProcessingStateMachine";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  architectureDecisions,
  productionizationSteps,
} from "@/data/almaari-case-studies";
import { currentGarmentFlowSlides } from "@/data/almaari-garment-ingestion";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";
import type { Project } from "@/data/types";
import { getProjectTheme } from "@/lib/project-themes";

type PageProps = { params: Promise<{ slug: string }> };

const canonical = "/projects/almaari/case-studies/garment-ingestion";

export const metadata: Metadata = {
  title: `Redesigning Almaari's AI Garment Ingestion Pipeline | ${siteConfig.name}`,
  description:
    "An in-progress architecture redesign for reliable asynchronous image processing, AI enrichment, safe retries, and lower user-perceived latency.",
  alternates: { canonical },
  openGraph: {
    title: "Redesigning Almaari's AI Garment Ingestion Pipeline",
    description:
      "Building a more reliable asynchronous image-processing and AI-enrichment workflow.",
    url: canonical,
  },
};

export function generateStaticParams() {
  return [{ slug: "almaari" }];
}

const tocItems = [
  { id: "changed", label: "What I Changed" },
  { id: "current-system", label: "Current Flow" },
  { id: "problem", label: "The Problem" },
  { id: "goals", label: "Goals & Non-Goals" },
  { id: "architecture", label: "Architecture" },
  { id: "comparison", label: "Current vs Proposed" },
  { id: "state-machine", label: "State Machine" },
  { id: "lifecycle", label: "Request Lifecycle" },
  { id: "reliability", label: "Reliability" },
  { id: "failure-recovery", label: "Failure Recovery" },
  { id: "decisions", label: "Key Decisions" },
  { id: "alternatives", label: "Rejected Alternatives" },
  { id: "scale", label: "Cost & Scale" },
  { id: "metrics", label: "Metrics" },
  { id: "status", label: "Productionization" },
];

const problemSections = [
  {
    title: "User-driven orchestration",
    body: "AI analysis currently requires another explicit user action. The user is responsible for advancing a workflow that the system can already infer from the upload itself.",
  },
  {
    title: "Billing coupled to ingestion",
    body: "A standard garment analysis can involve a credit check, credit deduction, the AI request, and a refund when that request fails. That accounting logic makes a basic product workflow harder to retry safely.",
  },
  {
    title: "Overlapping retry mechanisms",
    body: "Reliability is spread across frontend submission guards, idempotency keys, MongoDB jobs, setImmediate processing, startup reclaim, and internal worker endpoints. Each mechanism solves a real problem, but together they obscure which layer owns recovery.",
  },
  {
    title: "Partial failures",
    body: "Background removal and AI analysis can succeed or fail independently. A successful crop should not need to run again because analysis failed later, but the current workflow does not represent that progress as one explicit checkpointed sequence.",
  },
  {
    title: "Fragmented workflow ownership",
    body: "Upload, crop, analysis, persistence, enrichment, and review are not represented by one durable state machine. The redesign moves that responsibility into persisted Clothes state.",
  },
];

const lifecycleStages = [
  {
    title: "1. Create and upload",
    body: "The user selects an image. Express creates a pending Clothes record and returns a presigned S3 URL. The browser uploads the image directly to S3, then confirms completion with the API.",
  },
  {
    title: "2. Queue processing",
    body: "After confirming the upload, Express enqueues PROCESS_CLOTHING:{clothesId}. The ingestion worker receives the task and loads the persisted Clothes state before doing any work.",
  },
  {
    title: "3. Process and checkpoint",
    body: "The worker calls the crop service and saves processingStage = CROPPED when it succeeds. It then calls the vision service, persists the returned metadata, and advances the Clothes record to READY_FOR_REVIEW.",
  },
  {
    title: "4. Review and finalize",
    body: "The frontend refetches the Clothes record and unlocks editing. The user reviews the metadata, makes any changes, and submits. Finalization advances the garment to ACTIVE.",
  },
];

const rejectedAlternatives = [
  {
    title: "MongoDB as the primary queue",
    considered:
      "It reuses an existing datastore and resembles Almaari's current job handling.",
    rejected:
      "Polling, delivery semantics, and abandoned-job reclaim would remain application-owned.",
    tradeoff:
      "It avoids another provider but creates more queue infrastructure to maintain.",
  },
  {
    title: "Processing inside Express",
    considered: "It avoids another service and is straightforward to deploy.",
    rejected:
      "Long-running work would remain coupled to public request capacity and the API process lifecycle.",
    tradeoff:
      "There are fewer deployables, but a weaker failure and scaling boundary.",
  },
  {
    title: "One task per processing stage",
    considered:
      "Separate crop and analysis tasks would provide granular isolation.",
    rejected:
      "The current upload volume does not justify the extra task definitions and orchestration.",
    tradeoff:
      "Retries become more granular at the cost of a more complex workflow.",
  },
  {
    title: "Move every service to GCP immediately",
    considered: "One provider could simplify networking and observability.",
    rejected:
      "A migration does not directly solve workflow ownership or retry behavior.",
    tradeoff:
      "Operations may become simpler later, but the near-term migration cost is high.",
  },
  {
    title: "Keep manual AI analysis",
    considered: "It avoids inference for uploads the user may abandon.",
    rejected:
      "It preserves a second user action, billing coupling, and a delayed processing start.",
    tradeoff:
      "Model usage is lower, but user effort and perceived latency remain higher.",
  },
  {
    title: "Introduce a separate GarmentDraft",
    considered: "A draft entity could isolate temporary ingestion state.",
    rejected: "The existing S3 flow already creates an owned Clothes shell.",
    tradeoff:
      "The conceptual boundary is cleaner, but another lifecycle must be reconciled and deleted.",
  },
];

function LinearFlow({ steps }: { steps: string[] }) {
  return (
    <div className="engineering-linear-flow engineering-linear-flow--vertical">
      {steps.map((step, index) => (
        <span key={step}>
          <strong>{step}</strong>
          {index < steps.length - 1 ? <i aria-hidden="true">↓</i> : null}
        </span>
      ))}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="engineering-code">
      <code>{children}</code>
    </pre>
  );
}

export default async function GarmentIngestionPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== "almaari") notFound();

  const almaari = getProjectBySlug("almaari");
  if (!almaari) notFound();

  const studyProject: Project = {
    ...almaari,
    name: "Redesigning Almaari's AI Garment Ingestion Pipeline",
    shortDescription:
      "Building a more reliable asynchronous image-processing and AI-enrichment workflow.",
    role: "Architecture Analysis and Full-Stack Engineering",
    status: "In progress",
  };
  const live = almaari.links.find((link) => link.type === "live");
  const github = almaari.links.find((link) => link.type === "github");
  const inPlace = productionizationSteps.filter(
    (step) => step.status === "complete",
  );
  const inProgress = productionizationSteps.filter(
    (step) => step.status === "in-progress",
  );
  const stillToValidate = productionizationSteps.filter(
    (step) => step.status === "planned",
  );

  return (
    <main className="case-study engineering-study">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Redesigning Almaari's AI Garment Ingestion Pipeline",
          description:
            "An in-progress redesign focused on durable workflow state, safe retries, and lower user-perceived latency.",
          url: `${siteConfig.url}${canonical}`,
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }}
      />
      <div className="case-study__shell">
        <Link
          href="/projects/almaari/case-studies"
          className="case-study__back"
        >
          ← Almaari case studies
        </Link>

        <CaseStudyHeader
          project={studyProject}
          theme={getProjectTheme("almaari")}
          links={{ live, github }}
        />
        <CaseStudyMetadata
          role={studyProject.role}
          status={studyProject.status}
          focus={[
            "System Design",
            "Reliability",
            "AI Workflows",
            "Cloud Infrastructure",
          ]}
        />

        <div className="engineering-study__intro engineering-prose">
          <p>
            Almaari&apos;s Add Clothes flow had gradually accumulated several
            separate responsibilities: image background removal, manual AI
            analysis for meta data extraction, credit accounting, garment
            persistence, and a background job for meta data enrichment.
          </p>
          <p>
            The system worked, but the workflow increasingly depended on the
            user advancing each step manually, while failures across processing
            services were difficult to recover from cleanly.
          </p>
          <p>
            I began redesigning the ingestion pipeline around one durable
            workflow with explicit processing state, safe retries, and automatic
            garment analysis. The redesign is still being productionized;
            proposed components and design targets are identified in the writing
            below.
          </p>
        </div>

        <CaseStudyTableOfContents items={tocItems}>
          <div className="case-study__article engineering-article">
            <CaseStudySection
              id="changed"
              eyebrow="Overview"
              title="What I Changed"
              intro="The central change is to treat image processing, analysis, and enrichment as one durable workflow centered on the Clothes record. What does this mean? Made uploading an image of your clothes into one async task that allows for safer retries and idempotentcy."
            >
              <div className="model-change">
                <div>
                  <h3>Before</h3>
                  <LinearFlow
                    steps={[
                      "Upload image",
                      "Crop background",
                      "Manual AI analysis",
                      "Credit handling",
                      "Edit",
                      "Save",
                      "Background enrichment",
                    ]}
                  />
                </div>
                <div>
                  <h3>After</h3>
                  <LinearFlow
                    steps={[
                      "Upload image",
                      "Automatic crop",
                      "Automatic analysis",
                      "Review",
                      "Submit",
                    ]}
                  />
                </div>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="current-system"
              eyebrow="The flow"
              title="The Current Flow"
              intro="The current upload experience asks the user to prepare the image, request analysis, and review the result as separate steps."
            >
              <CurrentFlowCarousel slides={currentGarmentFlowSlides} />
            </CaseStudySection>

            <CaseStudySection
              id="problem"
              eyebrow="Current system"
              title="The Problem"
              intro="The current pipeline has user-facing friction, but the deeper issue is that no single layer clearly owns the garment's progress through ingestion."
            >
              <div className="engineering-subsections">
                {problemSections.map((problem) => (
                  <section key={problem.title}>
                    <h3>{problem.title}</h3>
                    <p>{problem.body}</p>
                  </section>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="goals"
              eyebrow="Scope"
              title="Design Goals & Non-Goals"
            >
              <div className="engineering-prose">
                <p>The redesign has three priorities:</p>
                <ol className="engineering-priorities">
                  <li>
                    <strong>Cleaner architecture.</strong> Represent ingestion
                    as one explicit workflow with understandable state
                    transitions.
                  </li>
                  <li>
                    <strong>Better reliability.</strong> Use durable task
                    delivery and checkpointed processing so retries resume from
                    completed work.
                  </li>
                  <li>
                    <strong>Lower user-perceived latency.</strong> Start
                    analysis automatically after upload instead of waiting for
                    another user action.
                  </li>
                </ol>
                <h3>Non-goals</h3>
                <ul className="engineering-bullets">
                  <li>Rewrite every service.</li>
                  <li>Replace MongoDB.</li>
                  <li>Move every workload to GCP.</li>
                  <li>Introduce Kafka or Pub/Sub.</li>
                  <li>Optimize for millions of uploads.</li>
                </ul>
                <p>
                  The goal is to improve the reliability boundary without
                  turning Almaari into a distributed system larger than its
                  current scale requires.
                </p>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="architecture"
              eyebrow="Interactive system map"
              title="Explore the Architecture"
              intro="The system map shows the proposed architecture, current implementation, successful path, and failure and retry paths."
            >
              <ArchitectureDiagram />
            </CaseStudySection>

            <CaseStudySection
              id="comparison"
              eyebrow="Workflow ownership"
              title="Current vs Proposed"
            >
              <div className="engineering-prose">
                <p>
                  The main change is where workflow ownership lives. Today, the
                  frontend and several background mechanisms collectively move a
                  garment through the system. In the redesign, the Clothes
                  record becomes the durable source of truth and a worker
                  advances it through explicit stages.
                </p>
              </div>
              <ArchitectureComparison />
            </CaseStudySection>

            <CaseStudySection
              id="state-machine"
              eyebrow="Persisted orchestration"
              title="The Clothes Record Becomes the Workflow"
            >
              <div className="engineering-prose">
                <p>
                  A separate GarmentDraft model would add another lifecycle to
                  create, reconcile, and eventually delete. Because the S3 flow
                  already creates an owned Clothes shell, I decided to use the
                  Clothes record itself as the workflow entity.
                </p>
              </div>
              <ProcessingStateMachine />
              <CodeBlock>{`type ClothesStatus =
  | "PROCESSING"
  | "READY_FOR_REVIEW"
  | "FAILED"
  | "REPROCESSING"
  | "ACTIVE";

type ProcessingStage =
  | "UPLOADED"
  | "CROPPING"
  | "CROPPED"
  | "ANALYZING"
  | "READY_FOR_REVIEW"
  | "FAILED";`}</CodeBlock>
            </CaseStudySection>

            <CaseStudySection
              id="lifecycle"
              eyebrow="Proposed sequence"
              title="Request Lifecycle"
              intro="The user-facing request ends early. Persisted state and durable task delivery carry the remaining processing forward without tying it to the API process lifetime."
            >
              <div className="engineering-subsections engineering-subsections--numbered">
                {lifecycleStages.map((stage) => (
                  <section key={stage.title}>
                    <h3>{stage.title}</h3>
                    <p>{stage.body}</p>
                  </section>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="reliability"
              eyebrow="At-least-once delivery"
              title="Retries Are Expected, Not Exceptional"
            >
              <div className="engineering-prose">
                <p>
                  Cloud Tasks provides at-least-once delivery. The worker cannot
                  assume that a task runs only once; duplicate delivery is
                  normal control flow, not an unusual edge case.
                </p>
                <p>
                  Each workflow uses{" "}
                  <code>PROCESS_CLOTHING:{`{clothesId}`}</code> as its stable
                  identity. Before doing work, the worker reads the Clothes
                  record and decides what remains from the persisted processing
                  stage.
                </p>
              </div>
              <CodeBlock>{`if (clothes.processingStage === "CROPPED") {
  await analyzeGarment(clothes);
}`}</CodeBlock>
              <div className="engineering-subsections engineering-subsections--compact">
                <section>
                  <h3>Request-level idempotency</h3>
                  <p>
                    Protect repeated HTTP create attempts with an{" "}
                    <code>Idempotency-Key</code>.
                  </p>
                </section>
                <section>
                  <h3>Workflow-level idempotency</h3>
                  <p>
                    Use <code>clothesId + processingStage</code> to determine
                    which work remains.
                  </p>
                </section>
                <section>
                  <h3>Finalization idempotency</h3>
                  <p>
                    If the status is already <code>ACTIVE</code>, return the
                    existing Clothes object instead of finalizing it again.
                  </p>
                </section>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="failure-recovery"
              eyebrow="Degraded paths"
              title="Failure Recovery"
              intro="The workflow preserves successful work and keeps a user path available when a dependency remains unavailable."
            >
              <div className="engineering-subsections">
                <section>
                  <h3>Crop service outage</h3>
                  <p>
                    A transient crop failure is retried by Cloud Tasks. If
                    retries are exhausted, the garment moves to REPROCESSING and
                    the user can continue with the original image. A delayed
                    recrop can run later without blocking review.
                  </p>
                </section>
                <section>
                  <h3>AI service outage</h3>
                  <p>
                    Once cropping succeeds, the CROPPED checkpoint is retained.
                    An AI retry skips cropping and resumes analysis directly. If
                    analysis continues to fail, the user can enter metadata
                    manually.
                  </p>
                </section>
                <section>
                  <h3>Browser refresh</h3>
                  <p>
                    The frontend refetches Clothes state and restores the
                    current step. It does not create another workflow or restart
                    completed processing.
                  </p>
                </section>
                <section>
                  <h3>Duplicate task delivery</h3>
                  <p>
                    The worker reads the persisted stage and skips completed
                    work. Stage transitions and finalization are designed to be
                    idempotent.
                  </p>
                </section>
                <section>
                  <h3>Delayed image reprocessing</h3>
                  <p>
                    If cropping continues to fail, the user should still be able
                    to proceed with the original image. A later crop result may
                    replace a pending image, but it must not silently replace an
                    image the user has already approved.
                  </p>
                  <CodeBlock>{`if (clothes.status !== "ACTIVE") {
  // processed candidate may replace pending image
}`}</CodeBlock>
                  <p>
                    A future interface could offer the improved image as an
                    explicit replacement.
                  </p>
                </section>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="decisions"
              eyebrow="Architecture decision records"
              title="Key Architecture Decisions"
              intro="These decisions keep the reliability boundary explicit without adding infrastructure that Almaari's current scale does not need."
            >
              <div className="engineering-decisions">
                {architectureDecisions.map((decision) => (
                  <section key={decision.id}>
                    <p className="engineering-kicker">{decision.id}</p>
                    <h3>{decision.title}</h3>
                    <p>
                      <strong>Decision:</strong> {decision.decision}
                    </p>
                    <p>
                      <strong>Why:</strong> {decision.why}
                    </p>
                    <p>
                      <strong>Trade-off:</strong> {decision.tradeoff}
                    </p>
                  </section>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="alternatives"
              eyebrow="Deliberate constraints"
              title="Rejected & Deferred Alternatives"
            >
              <div className="engineering-decisions engineering-decisions--compact">
                {rejectedAlternatives.map((alternative) => (
                  <section key={alternative.title}>
                    <h3>{alternative.title}</h3>
                    <p>{alternative.considered}</p>
                    <p>
                      <strong>Why I deferred it:</strong> {alternative.rejected}
                    </p>
                    <p>
                      <strong>Trade-off:</strong> {alternative.tradeoff}
                    </p>
                  </section>
                ))}
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="scale"
              eyebrow="Right-sized infrastructure"
              title="Cost & Scale"
            >
              <div className="engineering-prose">
                <p>
                  Almaari currently has more than 50 users and sees roughly
                  20–30 garment uploads per day. At that scale, the priority is
                  operational clarity and failure recovery rather than maximum
                  throughput.
                </p>
                <p>
                  Cloud Tasks volume is small, the worker can scale down while
                  idle, and there is little reason to migrate functioning
                  Railway services solely for architectural neatness. AI
                  inference is more likely to dominate variable cost than task
                  delivery.
                </p>
              </div>
            </CaseStudySection>

            <CaseStudySection id="metrics" eyebrow="Evidence" title="Metrics">
              <div className="engineering-subsections engineering-subsections--compact">
                <section>
                  <h3>Current scale</h3>
                  <ul className="engineering-bullets">
                    <li>More than 50 users.</li>
                    <li>Roughly 20–30 garment uploads per day.</li>
                  </ul>
                </section>
                <section>
                  <h3>Design targets</h3>
                  <ul className="engineering-bullets">
                    <li>Under five seconds for normal garment processing.</li>
                    <li>Safe duplicate task delivery.</li>
                    <li>Partial retry from persisted checkpoints.</li>
                    <li>Manual fallback after AI failure.</li>
                    <li>No credit dependency for standard garment analysis.</li>
                  </ul>
                </section>
                <section>
                  <h3>What I plan to measure after rollout</h3>
                  <ul className="engineering-bullets">
                    <li>P50 and P95 processing latency.</li>
                    <li>Crop and AI latency.</li>
                    <li>Queue delay and retry rate.</li>
                    <li>Crop and AI failure rates.</li>
                  </ul>
                </section>
              </div>
            </CaseStudySection>

            <CaseStudySection
              id="status"
              eyebrow="Implementation"
              title="Productionization Status"
              intro="The redesign remains in progress. The lists below distinguish production behavior from planned work."
            >
              <div className="engineering-status-lists">
                <section>
                  <h3>Already in place</h3>
                  <ul>
                    {inPlace.map((step) => (
                      <li key={step.label}>{step.label}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>In progress</h3>
                  <ul>
                    {inProgress.map((step) => (
                      <li key={step.label}>{step.label}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Still to validate or implement</h3>
                  <ul>
                    {stillToValidate.map((step) => (
                      <li key={step.label}>{step.label}</li>
                    ))}
                  </ul>
                </section>
              </div>
              <div className="engineering-next-link">
                <p>Continue with the broader product engineering story.</p>
                <Link href="/projects/almaari">
                  Read the original Almaari case study →
                </Link>
              </div>
            </CaseStudySection>
          </div>
        </CaseStudyTableOfContents>
      </div>
    </main>
  );
}
