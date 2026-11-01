function Field({ label, children, valueClass = "text-(--text-color)" }) {
  if (children === undefined || children === null || children === "") return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-(--text-secondary) opacity-70">
        {label}
      </span>
      <span className={`text-xs font-medium ${valueClass}`}>
        {children}
      </span>
    </div>
  );
}

const CVSS31_FIELDS = [
  ["Scope", "scope"],
  ["Version", "version"],
  ["Base Score", "baseScore"],
  ["Attack Vector", "attackVector"],
  ["Base Severity", "baseSeverity"],
  ["Integrity Impact", "integrityImpact"],
  ["User Interaction", "userInteraction"],
  ["Attack Complexity", "attackComplexity"],
  ["Availability Impact", "availabilityImpact"],
  ["Privileges Required", "privilegesRequired"],
  ["Confidentiality Impact", "confidentialityImpact"],
];

const CVSS40_FIELDS = [
  ["Safety", "Safety"],
  ["Version", "version"],
  ["Base Score", "baseScore"],
  ["Base Severity", "baseSeverity"],
  ["Automatable", "Automatable"],
  ["Attack Vector", "attackVector"],
  ["Exploit Maturity", "exploitMaturity"],
  ["Attack Complexity", "attackComplexity"],
  ["Privileges Required", "privilegesRequired"],
  ["User Interaction", "userInteraction"],
  ["Confidentiality Impact", "vulnConfidentialityImpact"],
  ["Integrity Impact", "vulnIntegrityImpact"],
  ["Availability Impact", "vulnAvailabilityImpact"],
];

function CvssBlock({ title, data, fields }) {
  if (!data) {
    return (
      <div className="flex h-full flex-col rounded-(--radius-card) border border-(--bg-color) bg-white/[0.02] p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-(--text-color) mb-2">
          {title}
        </h4>
        <p className="text-[11px] opacity-50 italic mt-auto">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white/[0.02] p-3 space-y-3">
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-(--text-color)">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {fields.map(([label, key]) => (
          <Field key={key} label={label}>
            {data[key]}
          </Field>
        ))}
      </div>
      {data.vectorString && (
        <div className="pt-2 mt-auto">
          <span className="text-[10px] uppercase tracking-wider text-(--text-secondary) opacity-70 block mb-1">
            Vector String
          </span>
          <code className="py-1.5 text-[10px]">
            {data.vectorString}
          </code>
        </div>
      )}
    </div>
  );
}

export function DataDetails({ data }) {
  const hasReferences = Array.isArray(data.reference) && data.reference.length > 0;

  return (
    <div className="grid grid-cols-1 gap-(--gp) text-xs lg:grid-cols-3 text-(--text-secondary)">
      
      {data.description && (
        <div className="lg:col-span-3 rounded-(--round-card) border border-white/5 bg-white/[0.02] p-3">
          <p className="leading-relaxed">
            <strong className="text-(--text-color) uppercase tracking-wider text-[10px] block mb-1">Description</strong>
            {data.description}
          </p>
        </div>
      )}

      <div className="lg:col-span-1 rounded-(--radius-card) border border-(--border-color)">
        <CvssBlock title="CVSS v3.1" data={data.cvss31_raw} fields={CVSS31_FIELDS} />
      </div>

      <div className="lg:col-span-1 rounded-(--radius-card) border border-(--border-color)">
        <CvssBlock title="CVSS v4.0" data={data.cvss40_raw} fields={CVSS40_FIELDS} />
      </div>

      <div className="lg:col-span-1 rounded-(--radius-card) border border-(--border-color) bg-white/[0.02] p-3 h-full">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-(--text-color) mb-2">
          References
        </h4>
        {hasReferences ? (
          <ul className="list-disc pl-5 space-y-1">
            {data.reference.map((ref, index) => (
              <li key={index}>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-(--primary-color) break-all transition-colors"
                >
                  {ref.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] opacity-50 italic mt-auto">No references available</p>
        )}
      </div>

    </div>
  );
}