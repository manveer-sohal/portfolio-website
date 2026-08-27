const primaryStates = ["CREATE", "PROCESSING", "READY_FOR_REVIEW", "ACTIVE"];

export function ProcessingStateMachine() {
  return (
    <div className="state-machine" aria-label="Proposed Clothes state machine">
      <div className="state-machine__primary">
        {primaryStates.map((state, index) => (
          <div className="state-machine__step" key={state}>
            <span>{state}</span>
            {index < primaryStates.length - 1 ? (
              <span className="state-machine__arrow" aria-hidden="true">→</span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="state-machine__recovery">
        <span>Proposed failure states:</span>
        <strong>FAILED</strong>
        <span aria-hidden="true">↔</span>
        <strong>REPROCESSING</strong>
      </div>
    </div>
  );
}
