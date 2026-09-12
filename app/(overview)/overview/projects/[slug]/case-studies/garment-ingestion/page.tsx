import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureComparison } from "@/components/projects/case-study/ArchitectureComparison";
import { ArchitectureDiagram } from "@/components/projects/case-study/ArchitectureDiagram";
import { CurrentFlowCarousel } from "@/components/projects/case-study/CurrentFlowCarousel";
import { ProcessingStateMachine } from "@/components/projects/case-study/ProcessingStateMachine";
import { OverviewCaseStudyHeader } from "@/components/overview-case-study/OverviewCaseStudyHeader";
import { OverviewCaseStudySection } from "@/components/overview-case-study/OverviewCaseStudySection";
import { OverviewTableOfContents } from "@/components/overview-case-study/OverviewTableOfContents";
import { architectureDecisions, productionizationSteps } from "@/data/almaari-case-studies";
import { currentGarmentFlowSlides } from "@/data/almaari-garment-ingestion";
import { getProjectBySlug } from "@/data/projects";
import { siteConfig } from "@/data/site";
import type { Project } from "@/data/types";

type PageProps = { params: Promise<{ slug: string }> };

const canonical = "/projects/almaari/case-studies/garment-ingestion";

export const metadata: Metadata = {
  title: { absolute: `Redesigning Almaari's AI Garment Ingestion Pipeline | ${siteConfig.name}` },
  description: "An in-progress architecture redesign for reliable asynchronous image processing, AI enrichment, safe retries, and lower user-perceived latency.",
  alternates: { canonical },
  robots: { index: false, follow: true },
};

export function generateStaticParams() { return [{ slug: "almaari" }]; }

const tocItems = [
  { id: "changed", label: "What I Changed" }, { id: "current-system", label: "Current Flow" },
  { id: "problem", label: "The Problem" }, { id: "goals", label: "Goals & Non-Goals" },
  { id: "architecture", label: "Architecture" }, { id: "comparison", label: "Current vs Proposed" },
  { id: "state-machine", label: "State Machine" }, { id: "lifecycle", label: "Request Lifecycle" },
  { id: "reliability", label: "Reliability" }, { id: "failure-recovery", label: "Failure Recovery" },
  { id: "decisions", label: "Key Decisions" }, { id: "alternatives", label: "Rejected Alternatives" },
  { id: "scale", label: "Cost & Scale" }, { id: "metrics", label: "Metrics" }, { id: "status", label: "Productionization" },
];

const problems = [
  ["User-driven orchestration", "AI analysis currently requires another explicit user action. The user is responsible for advancing a workflow that the system can already infer from the upload itself."],
  ["Billing coupled to ingestion", "A standard garment analysis can involve a credit check, credit deduction, the AI request, and a refund when that request fails. That accounting logic makes a basic product workflow harder to retry safely."],
  ["Overlapping retry mechanisms", "Reliability is spread across frontend submission guards, idempotency keys, MongoDB jobs, setImmediate processing, startup reclaim, and internal worker endpoints. Each mechanism solves a real problem, but together they obscure which layer owns recovery."],
  ["Partial failures", "Background removal and AI analysis can succeed or fail independently. A successful crop should not need to run again because analysis failed later, but the current workflow does not represent that progress as one explicit checkpointed sequence."],
  ["Fragmented workflow ownership", "Upload, crop, analysis, persistence, enrichment, and review are not represented by one durable state machine. The redesign moves that responsibility into persisted Clothes state."],
] as const;

const lifecycleStages = [
  ["1. Create and upload", "The user selects an image. Express creates a pending Clothes record and returns a presigned S3 URL. The browser uploads the image directly to S3, then confirms completion with the API."],
  ["2. Queue processing", "After confirming the upload, Express enqueues PROCESS_CLOTHING:{clothesId}. The ingestion worker receives the task and loads the persisted Clothes state before doing any work."],
  ["3. Process and checkpoint", "The worker calls the crop service and saves processingStage = CROPPED when it succeeds. It then calls the vision service, persists the returned metadata, and advances the Clothes record to READY_FOR_REVIEW."],
  ["4. Review and finalize", "The frontend refetches the Clothes record and unlocks editing. The user reviews the metadata, makes any changes, and submits. Finalization advances the garment to ACTIVE."],
] as const;

const alternatives = [
  ["MongoDB as the primary queue", "It reuses an existing datastore and resembles Almaari's current job handling.", "Polling, delivery semantics, and abandoned-job reclaim would remain application-owned.", "It avoids another provider but creates more queue infrastructure to maintain."],
  ["Processing inside Express", "It avoids another service and is straightforward to deploy.", "Long-running work would remain coupled to public request capacity and the API process lifecycle.", "There are fewer deployables, but a weaker failure and scaling boundary."],
  ["One task per processing stage", "Separate crop and analysis tasks would provide granular isolation.", "The current upload volume does not justify the extra task definitions and orchestration.", "Retries become more granular at the cost of a more complex workflow."],
  ["Move every service to GCP immediately", "One provider could simplify networking and observability.", "A migration does not directly solve workflow ownership or retry behavior.", "Operations may become simpler later, but the near-term migration cost is high."],
  ["Keep manual AI analysis", "It avoids inference for uploads the user may abandon.", "It preserves a second user action, billing coupling, and a delayed processing start.", "Model usage is lower, but user effort and perceived latency remain higher."],
  ["Introduce a separate GarmentDraft", "A draft entity could isolate temporary ingestion state.", "The existing S3 flow already creates an owned Clothes shell.", "The conceptual boundary is cleaner, but another lifecycle must be reconciled and deleted."],
] as const;

function LinearFlow({ steps }: { steps: string[] }) {
  return <div className="engineering-linear-flow engineering-linear-flow--vertical">{steps.map((step, index) => <span key={step}><strong>{step}</strong>{index < steps.length - 1 ? <i aria-hidden="true">↓</i> : null}</span>)}</div>;
}

function CodeBlock({ children }: { children: string }) {
  return <pre className="engineering-code overview-engineering__code"><code>{children}</code></pre>;
}

export default async function OverviewGarmentIngestionPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== "almaari") notFound();
  const almaari = getProjectBySlug("almaari");
  if (!almaari) notFound();
  const studyProject: Project = { ...almaari, name: "Redesigning Almaari's AI Garment Ingestion Pipeline", shortDescription: "Building a more reliable asynchronous image-processing and AI-enrichment workflow.", role: "Architecture Analysis and Full-Stack Engineering", status: "In progress", links: almaari.links.filter((link) => link.type !== "case-study") };
  const complete = productionizationSteps.filter((step) => step.status === "complete");
  const inProgress = productionizationSteps.filter((step) => step.status === "in-progress");
  const planned = productionizationSteps.filter((step) => step.status === "planned");

  return <main className="overview-case overview-engineering-study"><div className="overview-case__shell">
    <Link href="/overview/projects/almaari/case-studies" className="overview-case__back">← Almaari case studies</Link>
    <OverviewCaseStudyHeader project={studyProject} />
    <OverviewTableOfContents items={tocItems}><article className="overview-case__article overview-engineering__article">
      <OverviewCaseStudySection id="introduction" eyebrow="Start" title="Introduction"><div className="engineering-study__intro engineering-prose"><p>Almaari&apos;s Add Clothes flow had gradually accumulated several separate responsibilities: image background removal, manual AI analysis for metadata extraction, credit accounting, garment persistence, and background metadata enrichment.</p><p>The system worked, but the workflow increasingly depended on the user advancing each step manually, while failures across processing services were difficult to recover from cleanly.</p><p>I began redesigning the ingestion pipeline around one durable workflow with explicit processing state, safe retries, and automatic garment analysis. The redesign is still being productionized; proposed components and design targets are identified below.</p></div></OverviewCaseStudySection>

      <OverviewCaseStudySection id="changed" eyebrow="Overview" title="What I Changed"><p className="overview-engineering__intro">The central change is to treat image processing, analysis, and enrichment as one durable workflow centered on the Clothes record. Uploading an image becomes one asynchronous task with safer retries and idempotency.</p><div className="model-change"><div><h3>Before</h3><LinearFlow steps={["Upload image", "Crop background", "Manual AI analysis", "Credit handling", "Edit", "Save", "Background enrichment"]} /></div><div><h3>After</h3><LinearFlow steps={["Upload image", "Automatic crop", "Automatic analysis", "Review", "Submit"]} /></div></div></OverviewCaseStudySection>

      <OverviewCaseStudySection id="current-system" eyebrow="The flow" title="The Current Flow"><p className="overview-engineering__intro">The current upload experience asks the user to prepare the image, request analysis, and review the result as separate steps.</p><CurrentFlowCarousel slides={currentGarmentFlowSlides} /></OverviewCaseStudySection>

      <OverviewCaseStudySection id="problem" eyebrow="Current system" title="The Problem"><p className="overview-engineering__intro">The current pipeline has user-facing friction, but the deeper issue is that no single layer clearly owns the garment&apos;s progress through ingestion.</p><div className="engineering-subsections">{problems.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></OverviewCaseStudySection>

      <OverviewCaseStudySection id="goals" eyebrow="Scope" title="Design Goals & Non-Goals"><div className="engineering-prose"><p>The redesign has three priorities:</p><ol className="engineering-priorities"><li><strong>Cleaner architecture.</strong> Represent ingestion as one explicit workflow with understandable state transitions.</li><li><strong>Better reliability.</strong> Use durable task delivery and checkpointed processing so retries resume from completed work.</li><li><strong>Lower user-perceived latency.</strong> Start analysis automatically after upload instead of waiting for another user action.</li></ol><h3>Non-goals</h3><ul className="engineering-bullets"><li>Rewrite every service.</li><li>Replace MongoDB.</li><li>Move every workload to GCP.</li><li>Introduce Kafka or Pub/Sub.</li><li>Optimize for millions of uploads.</li></ul><p>The goal is to improve the reliability boundary without turning Almaari into a distributed system larger than its current scale requires.</p></div></OverviewCaseStudySection>

      <OverviewCaseStudySection id="architecture" eyebrow="Interactive system map" title="Explore the Architecture"><p className="overview-engineering__intro">The system map shows the proposed architecture, current implementation, successful path, and failure and retry paths.</p><ArchitectureDiagram /></OverviewCaseStudySection>
      <OverviewCaseStudySection id="comparison" eyebrow="Workflow ownership" title="Current vs Proposed"><div className="engineering-prose"><p>The main change is where workflow ownership lives. Today, the frontend and several background mechanisms collectively move a garment through the system. In the redesign, the Clothes record becomes the durable source of truth and a worker advances it through explicit stages.</p></div><ArchitectureComparison /></OverviewCaseStudySection>
      <OverviewCaseStudySection id="state-machine" eyebrow="Persisted orchestration" title="The Clothes Record Becomes the Workflow"><div className="engineering-prose"><p>A separate GarmentDraft model would add another lifecycle to create, reconcile, and eventually delete. Because the S3 flow already creates an owned Clothes shell, I decided to use the Clothes record itself as the workflow entity.</p></div><ProcessingStateMachine /><CodeBlock>{`type ClothesStatus =\n  | "PROCESSING"\n  | "READY_FOR_REVIEW"\n  | "FAILED"\n  | "REPROCESSING"\n  | "ACTIVE";\n\ntype ProcessingStage =\n  | "UPLOADED"\n  | "CROPPING"\n  | "CROPPED"\n  | "ANALYZING"\n  | "READY_FOR_REVIEW"\n  | "FAILED";`}</CodeBlock></OverviewCaseStudySection>

      <OverviewCaseStudySection id="lifecycle" eyebrow="Proposed sequence" title="Request Lifecycle"><p className="overview-engineering__intro">The user-facing request ends early. Persisted state and durable task delivery carry the remaining processing forward without tying it to the API process lifetime.</p><div className="engineering-subsections engineering-subsections--numbered">{lifecycleStages.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="reliability" eyebrow="At-least-once delivery" title="Retries Are Expected, Not Exceptional"><div className="engineering-prose"><p>Cloud Tasks provides at-least-once delivery. The worker cannot assume that a task runs only once; duplicate delivery is normal control flow, not an unusual edge case.</p><p>Each workflow uses <code>PROCESS_CLOTHING:{"{clothesId}"}</code> as its stable identity. Before doing work, the worker reads the Clothes record and decides what remains from the persisted processing stage.</p></div><CodeBlock>{`if (clothes.processingStage === "CROPPED") {\n  await analyzeGarment(clothes);\n}`}</CodeBlock><div className="engineering-subsections engineering-subsections--compact"><section><h3>Request-level idempotency</h3><p>Protect repeated HTTP create attempts with an <code>Idempotency-Key</code>.</p></section><section><h3>Workflow-level idempotency</h3><p>Use <code>clothesId + processingStage</code> to determine which work remains.</p></section><section><h3>Finalization idempotency</h3><p>If the status is already <code>ACTIVE</code>, return the existing Clothes object instead of finalizing it again.</p></section></div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="failure-recovery" eyebrow="Degraded paths" title="Failure Recovery"><p className="overview-engineering__intro">The workflow preserves successful work and keeps a user path available when a dependency remains unavailable.</p><div className="engineering-subsections"><section><h3>Crop service outage</h3><p>A transient crop failure is retried by Cloud Tasks. If retries are exhausted, the garment moves to REPROCESSING and the user can continue with the original image. A delayed recrop can run later without blocking review.</p></section><section><h3>AI service outage</h3><p>Once cropping succeeds, the CROPPED checkpoint is retained. An AI retry skips cropping and resumes analysis directly. If analysis continues to fail, the user can enter metadata manually.</p></section><section><h3>Browser refresh</h3><p>The frontend refetches Clothes state and restores the current step. It does not create another workflow or restart completed processing.</p></section><section><h3>Duplicate task delivery</h3><p>The worker reads the persisted stage and skips completed work. Stage transitions and finalization are designed to be idempotent.</p></section><section><h3>Delayed image reprocessing</h3><p>If cropping continues to fail, the user should still be able to proceed with the original image. A later crop result may replace a pending image, but it must not silently replace an image the user has already approved.</p><CodeBlock>{`if (clothes.status !== "ACTIVE") {\n  // processed candidate may replace pending image\n}`}</CodeBlock><p>A future interface could offer the improved image as an explicit replacement.</p></section></div></OverviewCaseStudySection>

      <OverviewCaseStudySection id="decisions" eyebrow="Architecture decision records" title="Key Architecture Decisions"><p className="overview-engineering__intro">These decisions keep the reliability boundary explicit without adding infrastructure that Almaari&apos;s current scale does not need.</p><div className="engineering-decisions">{architectureDecisions.map((decision) => <section key={decision.id}><p className="engineering-kicker">{decision.id}</p><h3>{decision.title}</h3><p><strong>Decision:</strong> {decision.decision}</p><p><strong>Why:</strong> {decision.why}</p><p><strong>Trade-off:</strong> {decision.tradeoff}</p></section>)}</div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="alternatives" eyebrow="Deliberate constraints" title="Rejected & Deferred Alternatives"><div className="engineering-decisions engineering-decisions--compact">{alternatives.map(([title, considered, rejected, tradeoff]) => <section key={title}><h3>{title}</h3><p>{considered}</p><p><strong>Why I deferred it:</strong> {rejected}</p><p><strong>Trade-off:</strong> {tradeoff}</p></section>)}</div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="scale" eyebrow="Right-sized infrastructure" title="Cost & Scale"><div className="engineering-prose"><p>Almaari currently has more than 50 users and sees roughly 20–30 garment uploads per day. At that scale, the priority is operational clarity and failure recovery rather than maximum throughput.</p><p>Cloud Tasks volume is small, the worker can scale down while idle, and there is little reason to migrate functioning Railway services solely for architectural neatness. AI inference is more likely to dominate variable cost than task delivery.</p></div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="metrics" eyebrow="Evidence" title="Metrics"><div className="engineering-subsections engineering-subsections--compact"><section><h3>Current scale</h3><ul className="engineering-bullets"><li>More than 50 users.</li><li>Roughly 20–30 garment uploads per day.</li></ul></section><section><h3>Design targets</h3><ul className="engineering-bullets"><li>Under five seconds for normal garment processing.</li><li>Safe duplicate task delivery.</li><li>Partial retry from persisted checkpoints.</li><li>Manual fallback after AI failure.</li><li>No credit dependency for standard garment analysis.</li></ul></section><section><h3>What I plan to measure after rollout</h3><ul className="engineering-bullets"><li>P50 and P95 processing latency.</li><li>Crop and AI latency.</li><li>Queue delay and retry rate.</li><li>Crop and AI failure rates.</li></ul></section></div></OverviewCaseStudySection>
      <OverviewCaseStudySection id="status" eyebrow="Implementation" title="Productionization Status"><p className="overview-engineering__intro">The redesign remains in progress. The lists below distinguish production behavior from planned work.</p><div className="engineering-status-lists"><section><h3>Already in place</h3><ul>{complete.map((step) => <li key={step.label}>{step.label}</li>)}</ul></section><section><h3>In progress</h3><ul>{inProgress.map((step) => <li key={step.label}>{step.label}</li>)}</ul></section><section><h3>Still to validate or implement</h3><ul>{planned.map((step) => <li key={step.label}>{step.label}</li>)}</ul></section></div><div className="engineering-next-link"><p>Continue with the broader product engineering story.</p><Link href="/overview/projects/almaari">Read the original Almaari case study →</Link></div></OverviewCaseStudySection>
    </article></OverviewTableOfContents>
  </div></main>;
}
