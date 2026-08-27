type CaseStudyMetadataProps = {
  role?: string;
  status?: string;
  focus?: string[];
};

export function CaseStudyMetadata({
  role,
  status,
  focus = [],
}: CaseStudyMetadataProps = {}) {
  return (
    <dl className="case-study__metadata">
      {role ? (
        <div>
          <dt>Role</dt>
          <dd>{role}</dd>
        </div>
      ) : null}
      {status ? (
        <div>
          <dt>Status</dt>
          <dd>{status}</dd>
        </div>
      ) : null}
      {focus.length > 0 ? (
        <div>
          <dt>Focus</dt>
          <dd>{focus.join(" · ")}</dd>
        </div>
      ) : null}
    </dl>
  );
}
