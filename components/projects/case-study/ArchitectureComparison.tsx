"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const models = {
  current: {
    steps: ["Image", "Crop", "Manual Analyze", "Credit reservation", "AI", "Edit", "Save", "Background enrichment"],
  },
  proposed: {
    steps: ["Image", "Pending Clothes", "S3", "Cloud Tasks", "Worker", "Crop", "AI", "READY_FOR_REVIEW", "Edit", "ACTIVE"],
  },
};

export function ArchitectureComparison() {
  const [selected, setSelected] = useState<keyof typeof models>("proposed");
  const reduceMotion = useReducedMotion();
  const model = models[selected];

  return (
    <div className="architecture-comparison">
      <div className="architecture-comparison__toggle" aria-label="Compare architecture models">
        {(Object.keys(models) as Array<keyof typeof models>).map((key) => (
          <button
            type="button"
            key={key}
            aria-pressed={selected === key}
            className={selected === key ? "is-active" : undefined}
            onClick={() => setSelected(key)}
          >
            {key === "current" ? "Current" : "Proposed"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selected}
          className="architecture-comparison__flow"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <div className="architecture-comparison__steps">
            {model.steps.map((step, index) => (
              <span key={step}>
                <strong>{step}</strong>
                {index < model.steps.length - 1 ? <i aria-hidden="true">→</i> : null}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      <p>
        The redesign moves workflow ownership from the frontend and process lifecycle into persisted backend state.
      </p>
    </div>
  );
}
