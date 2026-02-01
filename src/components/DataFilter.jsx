import { useChart } from "../context/ChartContext";
import { Filter } from "lucide-react";

export default function DataFilter() {
  const { state, dispatch } = useChart();
  const { rows, rowRange } = state;

  if (!rows.length) return null;

  const max = rows.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <Filter size={14} />
        Row Filter
      </div>

      <label className="text-xs text-slate-500 block">
        Rows {rowRange[0] + 1} to {Math.min(rowRange[1], max)} of {max}
      </label>
      <div className="flex gap-2 items-center">
        <span className="text-xs text-slate-400 w-6 text-right">{rowRange[0] + 1}</span>
        <input
          type="range"
          min={0}
          max={max}
          value={rowRange[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            dispatch({ type: "SET_ROW_RANGE", payload: [v, Math.max(v, rowRange[1])] });
          }}
          className="flex-1 h-1.5 accent-blue-500"
        />
        <input
          type="range"
          min={0}
          max={max}
          value={rowRange[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            dispatch({ type: "SET_ROW_RANGE", payload: [Math.min(rowRange[0], v), v] });
          }}
          className="flex-1 h-1.5 accent-blue-500"
        />
        <span className="text-xs text-slate-400 w-6">{Math.min(rowRange[1], max)}</span>
      </div>
    </div>
  );
}
