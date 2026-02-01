const SWATCHES = [
  "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
  "#3F51B5", "#03A9F4", "#4CAF50", "#F44336", "#FF9800",
  "#9C27B0", "#E91E63", "#00BCD4", "#8BC34A", "#CDDC39",
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {SWATCHES.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-5 h-5 rounded-full border-2 transition-transform ${
            value === color ? "border-slate-800 scale-125" : "border-transparent hover:scale-110"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
      <input
        type="color"
        value={value || "#008FFB"}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border-0 p-0"
      />
    </div>
  );
}
