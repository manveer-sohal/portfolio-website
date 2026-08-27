"use client";

import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  architectureNodes,
  architectureViews,
  type ArchitectureMode,
} from "@/data/almaari-case-studies";
import { cn } from "@/lib/utils";
import { CaseStudyStatusBadge } from "./CaseStudyStatusBadge";

type NodeKind = "client" | "frontend" | "service" | "database" | "storage" | "queue" | "worker" | "image" | "vision";
type Technology = "neutral" | "vercel" | "googleCloud" | "mongodb" | "aws" | "railway";

type DiagramNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  provider: string;
  descriptor: string;
  kind: NodeKind;
  technology: Technology;
  modes: ArchitectureMode[];
};

type ConnectorKind = "primary" | "state" | "retry" | "failure";
type DiagramConnector = {
  id: string;
  from: string;
  to: string;
  path: string;
  label?: string;
  labelX?: number;
  labelY?: number;
  kind: ConnectorKind;
  modes: ArchitectureMode[];
};

const technologyStyles: Record<Technology, { accent: string }> = {
  neutral: { accent: "#94a3b8" },
  vercel: { accent: "#f4f4f5" },
  googleCloud: { accent: "#5b9cf6" },
  mongodb: { accent: "#57a773" },
  aws: { accent: "#e6a24c" },
  railway: { accent: "#a78bfa" },
};

const nodeLayout: DiagramNode[] = [
  { id: "client", x: 24, y: 285, width: 150, height: 94, title: "User / Browser", provider: "Client", descriptor: "Select + review", kind: "client", technology: "neutral", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "frontend", x: 205, y: 285, width: 160, height: 94, title: "Next.js 16", provider: "Vercel", descriptor: "Product frontend", kind: "frontend", technology: "vercel", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "api", x: 400, y: 285, width: 165, height: 94, title: "Product API", provider: "Express · Cloud Run", descriptor: "Node API · orchestration", kind: "service", technology: "googleCloud", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "tasks", x: 600, y: 285, width: 165, height: 94, title: "Cloud Tasks", provider: "Google Cloud", descriptor: "Durable task delivery", kind: "queue", technology: "googleCloud", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "worker", x: 800, y: 285, width: 180, height: 94, title: "Ingestion Worker", provider: "Google Cloud Run", descriptor: "Checkpointed processing", kind: "worker", technology: "googleCloud", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "crop", x: 1060, y: 135, width: 180, height: 100, title: "Crop Service", provider: "Railway · rembg", descriptor: "Remove background", kind: "image", technology: "railway", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "vision", x: 1060, y: 420, width: 180, height: 100, title: "Vision Analysis", provider: "Railway · GPT-4o-mini", descriptor: "Garment metadata", kind: "vision", technology: "railway", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "s3", x: 205, y: 500, width: 160, height: 100, title: "Amazon S3", provider: "AWS", descriptor: "Original + processed images", kind: "storage", technology: "aws", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "mongodb", x: 600, y: 500, width: 180, height: 100, title: "MongoDB Atlas", provider: "Persistent state", descriptor: "Source of truth", kind: "database", technology: "mongodb", modes: ["proposed", "current", "happy-path", "failure-retry"] },
  { id: "jobs", x: 600, y: 285, width: 165, height: 94, title: "MongoDB Jobs", provider: "MongoDB-backed", descriptor: "EnrichmentJob · ImageProcessingJob", kind: "queue", technology: "mongodb", modes: ["current"] },
  { id: "processor", x: 800, y: 285, width: 180, height: 94, title: "Background Processing", provider: "Express process lifecycle", descriptor: "setImmediate + reclaim", kind: "worker", technology: "neutral", modes: ["current"] },
];

const proposedConnectors: DiagramConnector[] = [
  { id: "select", from: "client", to: "frontend", path: "M174 332 H205", label: "Select garment", labelX: 190, labelY: 275, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "create", from: "frontend", to: "api", path: "M365 310 H400", label: "Create garment", labelX: 382, labelY: 275, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "confirm", from: "frontend", to: "api", path: "M365 354 H400", label: "Upload complete", labelX: 382, labelY: 374, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "enqueue", from: "api", to: "tasks", path: "M565 332 H600", label: "PROCESS_CLOTHING", labelX: 582, labelY: 275, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "deliver", from: "tasks", to: "worker", path: "M765 332 H800", label: "Deliver task", labelX: 782, labelY: 275, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "upload", from: "frontend", to: "s3", path: "M285 379 V500", label: "Presigned upload", labelX: 300, labelY: 442, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "create-state", from: "api", to: "mongodb", path: "M482 379 V460 H645 V500", label: "PROCESSING · UPLOADED", labelX: 535, labelY: 449, kind: "state", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "checkpoint", from: "worker", to: "mongodb", path: "M890 379 V468 H735 V500", label: "Checkpoint + metadata", labelX: 830, labelY: 458, kind: "state", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "crop-call", from: "worker", to: "crop", path: "M980 310 H1018 V185 H1060", label: "Remove background", labelX: 1023, labelY: 168, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "crop-return", from: "crop", to: "worker", path: "M1060 215 H1038 V294 H980", label: "Crop result", labelX: 1028, labelY: 274, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "vision-call", from: "worker", to: "vision", path: "M980 354 H1018 V470 H1060", label: "Analyze garment", labelX: 1023, labelY: 454, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "vision-return", from: "vision", to: "worker", path: "M1060 500 H1038 V370 H980", label: "Vision metadata", labelX: 1028, labelY: 394, kind: "primary", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "review-state", from: "mongodb", to: "api", path: "M600 550 H385 V365 H400", label: "READY_FOR_REVIEW", labelX: 500, labelY: 540, kind: "state", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "review-ui", from: "api", to: "frontend", path: "M400 295 H365", kind: "state", modes: ["proposed", "happy-path", "failure-retry"] },
  { id: "state-strip", from: "mongodb", to: "mongodb", path: "M690 600 V646", kind: "state", modes: ["proposed", "happy-path", "failure-retry"] },
];

const currentConnectors: DiagramConnector[] = [
  { id: "current-select", from: "client", to: "frontend", path: "M174 332 H205", label: "Select garment", labelX: 190, labelY: 275, kind: "primary", modes: ["current"] },
  { id: "current-api", from: "frontend", to: "api", path: "M365 332 H400", label: "Create + save", labelX: 382, labelY: 275, kind: "primary", modes: ["current"] },
  { id: "current-upload", from: "frontend", to: "s3", path: "M285 379 V500", label: "Presigned upload", labelX: 300, labelY: 442, kind: "primary", modes: ["current"] },
  { id: "current-state", from: "api", to: "mongodb", path: "M482 379 V458 H645 V500", label: "Clothes + job state", labelX: 535, labelY: 447, kind: "state", modes: ["current"] },
  { id: "current-jobs", from: "api", to: "jobs", path: "M565 332 H600", label: "Persist job", labelX: 582, labelY: 275, kind: "state", modes: ["current"] },
  { id: "current-process", from: "jobs", to: "processor", path: "M765 332 H800", label: "Claim / reclaim", labelX: 782, labelY: 275, kind: "state", modes: ["current"] },
  { id: "current-crop", from: "processor", to: "crop", path: "M980 310 H1018 V185 H1060", label: "Process image", labelX: 1023, labelY: 168, kind: "primary", modes: ["current"] },
  { id: "current-crop-return", from: "crop", to: "processor", path: "M1060 215 H1038 V294 H980", kind: "primary", modes: ["current"] },
  { id: "current-ai", from: "api", to: "vision", path: "M520 379 V405 H1028 V470 H1060", label: "Manual Analyze + credits", labelX: 820, labelY: 398, kind: "primary", modes: ["current"] },
  { id: "current-metadata", from: "vision", to: "api", path: "M1060 500 H1010 V615 H440 V379", label: "Metadata / refund on failure", labelX: 750, labelY: 606, kind: "state", modes: ["current"] },
  { id: "current-checkpoint", from: "processor", to: "mongodb", path: "M890 379 V470 H735 V500", label: "Job result", labelX: 828, labelY: 460, kind: "state", modes: ["current"] },
  { id: "current-state-strip", from: "mongodb", to: "mongodb", path: "M690 600 V646", kind: "state", modes: ["current"] },
];

const failureConnectors: DiagramConnector[] = [
  { id: "redeliver", from: "tasks", to: "worker", path: "M765 348 H800", label: "Redeliver", labelX: 782, labelY: 372, kind: "retry", modes: ["failure-retry"] },
  { id: "read-checkpoint", from: "mongodb", to: "worker", path: "M745 500 V475 H910 V379", label: "Read checkpoint", labelX: 835, labelY: 466, kind: "retry", modes: ["failure-retry"] },
  { id: "retry-crop", from: "worker", to: "crop", path: "M980 300 H1005 V165 H1060", label: "Retry / delayed recrop", labelX: 1015, labelY: 148, kind: "retry", modes: ["failure-retry"] },
  { id: "retry-ai", from: "worker", to: "vision", path: "M980 365 H1005 V490 H1060", label: "Retry AI", labelX: 1015, labelY: 514, kind: "retry", modes: ["failure-retry"] },
  { id: "manual-fallback", from: "worker", to: "frontend", path: "M800 300 H780 V82 H285 V285", label: "Manual metadata fallback", labelX: 545, labelY: 70, kind: "failure", modes: ["failure-retry"] },
  { id: "reprocessing-state", from: "mongodb", to: "mongodb", path: "M690 600 V720", label: "FAILED / REPROCESSING", labelX: 785, labelY: 710, kind: "failure", modes: ["failure-retry"] },
];

function NodeIcon({ kind }: { kind: NodeKind }) {
  if (kind === "database") return <><ellipse cx="0" cy="-6" rx="10" ry="4" /><path d="M-10-6v13c0 2.2 4.5 4 10 4s10-1.8 10-4V-6M-10 0c0 2.2 4.5 4 10 4s10-1.8 10-4" /></>;
  if (kind === "storage") return <><path d="M-10-8h20l-2 18H-8Z" /><path d="M-7-2H7M-5 4H5" /></>;
  if (kind === "queue") return <><path d="M-10-7H5M-10 0H5M-10 7H5" /><path d="m5-10 5 3-5 3m0-3v14m0-3 5 3-5 3" /></>;
  if (kind === "client" || kind === "frontend") return <><rect x="-11" y="-8" width="22" height="15" rx="2" /><path d="M-5 11H5M0 7v4" /></>;
  if (kind === "image") return <><path d="M-11-4v-6h6M11-4v-6H5M-11 4v6h6M11 4v6H5" /><circle cx="1" cy="0" r="4" /></>;
  if (kind === "vision") return <><path d="M0-11 2.5-3 10 0 2.5 3 0 11-2.5 3-10 0l7.5-3Z" /><circle cx="8" cy="-8" r="2" /></>;
  if (kind === "worker") return <><circle cx="0" cy="0" r="7" /><path d="M0-12v5M0 7v5M-12 0h5M7 0h5M-8.5-8.5l3.5 3.5M5 5l3.5 3.5M8.5-8.5 5-5M-5 5l-3.5 3.5" /></>;
  return <><rect x="-10" y="-9" width="20" height="18" rx="3" /><path d="m-4-3-3 3 3 3M4-3l3 3-3 3" /></>;
}

function ArchitectureNodeGraphic({ node, selected, subdued, onSelect, onHover }: { node: DiagramNode; selected: boolean; subdued: boolean; onSelect: () => void; onHover: (id: string | null) => void }) {
  const accent = technologyStyles[node.technology].accent;
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect();
  };

  return (
    <g role="button" tabIndex={0} aria-label={`Select ${node.title}, ${node.provider}`} aria-pressed={selected} className={cn("architecture-svg-node", selected && "is-selected", subdued && "is-subdued")} style={{ "--node-accent": accent } as CSSProperties} transform={`translate(${node.x} ${node.y})`} onClick={onSelect} onKeyDown={handleKeyDown} onMouseEnter={() => onHover(node.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(node.id)} onBlur={() => onHover(null)}>
      <title>{`${node.title}. ${node.provider}. ${node.descriptor}.`}</title>
      <rect className="architecture-svg-node__surface" width={node.width} height={node.height} rx="10" />
      <path className="architecture-svg-node__accent" d={`M10 1 H${node.width - 10}`} />
      <g className="architecture-svg-node__icon" transform="translate(25 29)"><circle r="17" /><g className="architecture-svg-node__icon-mark"><NodeIcon kind={node.kind} /></g></g>
      <text className="architecture-svg-node__title" x="50" y="25">{node.title}</text>
      <text className="architecture-svg-node__provider" x="50" y="45">{node.provider}</text>
      <text className="architecture-svg-node__descriptor" x="14" y={node.height - 15}>{node.descriptor}</text>
      {selected ? <text className="architecture-svg-node__selected-label" x={node.width - 12} y={node.height - 14} textAnchor="end">SELECTED</text> : null}
    </g>
  );
}

function StateStrip({ mode }: { mode: ArchitectureMode }) {
  const states = mode === "current" ? ["UPLOAD", "MANUAL ANALYZE", "SAVE", "ENRICH"] : ["PROCESSING", "CROPPED", "READY FOR REVIEW", "ACTIVE"];
  return (
    <g className="architecture-state-strip" aria-label="Persisted Clothes lifecycle">
      <text x="350" y="638">{mode === "current" ? "CURRENT WORKFLOW" : "PERSISTED CLOTHES STATE"}</text>
      {states.map((state, index) => {
        const x = 350 + index * 190;
        return <g key={state} transform={`translate(${x} 650)`}><rect width="160" height="42" rx="6" /><text x="80" y="26" textAnchor="middle">{state}</text>{index < states.length - 1 ? <path d="M160 21 H184" markerEnd="url(#architecture-arrow-state)" /> : null}</g>;
      })}
      {mode === "failure-retry" ? <g className="architecture-state-strip__failure" transform="translate(350 720)"><path d="M80-28V0" markerEnd="url(#architecture-arrow-failure)" /><rect width="250" height="42" rx="6" /><text x="125" y="26" textAnchor="middle">FAILED / REPROCESSING</text></g> : null}
    </g>
  );
}

export function ArchitectureDiagram() {
  const [mode, setMode] = useState<ArchitectureMode>("proposed");
  const [selectedId, setSelectedId] = useState("tasks");
  const [selectionFocused, setSelectionFocused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const view = architectureViews.find((item) => item.id === mode) ?? architectureViews[0];
  const visibleNodes = nodeLayout.filter((node) => node.modes.includes(mode));
  const connectors = [...proposedConnectors, ...currentConnectors, ...failureConnectors].filter((connector) => connector.modes.includes(mode));
  const selected = useMemo(() => architectureNodes.find((node) => node.id === selectedId) ?? architectureNodes[0], [selectedId]);
  const focusId = hoveredId ?? (selectionFocused ? selectedId : null);

  function selectMode(nextMode: ArchitectureMode) {
    setMode(nextMode);
    const defaultNodeByMode: Record<ArchitectureMode, string> = {
      proposed: "tasks",
      current: "jobs",
      "happy-path": "client",
      "failure-retry": "worker",
    };
    setSelectedId(defaultNodeByMode[nextMode]);
    setSelectionFocused(false);
  }

  return (
    <div className="architecture-explorer">
      <div className="architecture-tabs" role="tablist" aria-label="Architecture view">
        {architectureViews.map((item) => <button key={item.id} id={`architecture-tab-${item.id}`} type="button" role="tab" aria-selected={mode === item.id} aria-controls="architecture-view" tabIndex={mode === item.id ? 0 : -1} className={cn("architecture-tabs__button", mode === item.id && "is-active")} onClick={() => selectMode(item.id)} onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const current = architectureViews.findIndex((candidate) => candidate.id === mode);
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const next = (current + direction + architectureViews.length) % architectureViews.length;
          selectMode(architectureViews[next].id);
          document.getElementById(`architecture-tab-${architectureViews[next].id}`)?.focus();
        }}>{item.label}</button>)}
      </div>

      <div className="architecture-explorer__grid">
        <div id="architecture-view" role="tabpanel" aria-labelledby={`architecture-tab-${mode}`} className="architecture-canvas">
          <div className="architecture-canvas__header"><CaseStudyStatusBadge status={view.status} /><p>{view.description}</p></div>
          <div className="architecture-diagram-scroll" tabIndex={0} aria-label="Scrollable architecture diagram">
            <motion.svg key={mode} className={cn("architecture-svg", `architecture-svg--${mode}`)} viewBox="0 0 1280 780" role="img" aria-label={`${view.label} garment ingestion architecture. Select a component for details.`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <defs>
                {(["primary", "state", "retry", "failure"] as const).map((kind) => <marker key={kind} id={`architecture-arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth={kind === "state" ? 6 : 7} markerHeight={kind === "state" ? 6 : 7} orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" /></marker>)}
              </defs>
              <g className="architecture-svg__lane-labels" aria-hidden="true"><text x="24" y="267">REQUEST + PROCESSING LANE</text><text x="205" y="482">SUPPORTING INFRASTRUCTURE</text></g>
              <g className="architecture-svg__connectors" aria-hidden="true">
                {connectors.map((connector) => {
                  const related = connector.from === focusId || connector.to === focusId;
                  return <g key={connector.id} className={cn("architecture-connector", `architecture-connector--${connector.kind}`, related && "is-related", focusId && !related && "is-muted", mode === "failure-retry" && connector.kind !== "retry" && connector.kind !== "failure" && "is-context")}><path d={connector.path} markerEnd={`url(#architecture-arrow-${connector.kind})`} />{connector.label && connector.labelX != null && connector.labelY != null ? <text x={connector.labelX} y={connector.labelY} textAnchor="middle">{connector.label}</text> : null}</g>;
                })}
              </g>
              <StateStrip mode={mode} />
              <g className="architecture-svg__nodes">
                {visibleNodes.map((node) => {
                  const related = connectors.some((connector) => (connector.from === focusId && connector.to === node.id) || (connector.to === focusId && connector.from === node.id));
                  return <ArchitectureNodeGraphic key={node.id} node={node} selected={selectedId === node.id} subdued={Boolean(focusId && node.id !== focusId && !related)} onSelect={() => { setSelectedId(node.id); setSelectionFocused(true); }} onHover={setHoveredId} />;
                })}
              </g>
            </motion.svg>
          </div>
          <div className="architecture-legend" aria-label="Connector legend"><span><i className="is-primary" />Primary request / processing</span><span><i className="is-retry" />Retry / recovery</span><span><i className="is-state" />State / persistence</span></div>
        </div>

        <aside className="architecture-details" aria-live="polite" aria-label="Selected architecture node details">
          <AnimatePresence mode="wait" initial={false}><motion.div key={selected.id} initial={reduceMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -6 }} transition={{ duration: 0.18 }}><CaseStudyStatusBadge status={selected.status} /><h3>{selected.label}</h3><dl><div><dt>Role</dt><dd>{selected.what}</dd></div>{selected.id === "mongodb" ? <div><dt>Stores</dt><dd>Clothes state · processingStage · AI metadata · errors · retry information</dd></div> : null}<div><dt>Why this component?</dt><dd>{selected.why}</dd></div><div><dt>Alternative considered</dt><dd>{selected.alternative}</dd></div><div><dt>Trade-off</dt><dd>{selected.tradeoff}</dd></div><div><dt>Failure behavior</dt><dd>{selected.failure}</dd></div></dl></motion.div></AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
