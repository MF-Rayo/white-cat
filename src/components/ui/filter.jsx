import { Select } from "./Select"

export function Filter({ label, apiData, selected, onChange }) {
  
  const dataList = apiData.read();

  return (
    <div className="flex flex-wrap gap-2 px-1 py-0 rounded-xl rounded-[var(--radius-card,14px)]">
      <Select
        value={selected}
        onChange={onChange}
        options={[
          { value: "all", label: label },
          ...dataList.map(src => ({ value: src, label: src }))
        ]}
      />
    </div>
  );
  
}