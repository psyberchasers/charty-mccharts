import { useMemo } from "react";
import { useChart } from "../context/ChartContext";
import { CATEGORICAL_TYPES } from "../utils/chartDefaults";
import { ArrowRightLeft } from "lucide-react";

function classifyNumeric(headers, rows) {
  const sampleSize = Math.min(rows.length, 20);
  const numericSet = new Set();

  for (const h of headers) {
    let numCount = 0;
    for (let i = 0; i < sampleSize; i++) {
      const v = rows[i]?.[h];
      if (v !== "" && v != null && !isNaN(Number(v))) numCount++;
    }
    if (sampleSize > 0 && numCount / sampleSize >= 0.7) {
      numericSet.add(h);
    }
  }
  return numericSet;
}

export default function AxisConfigurator() {
  const { state, dispatch } = useChart();
  const { headers, rows, xColumn, yColumns, chartType } = state;
  const isCategorical = CATEGORICAL_TYPES.includes(chartType);

  const numericColumns = useMemo(() => classifyNumeric(headers, rows), [headers, rows]);

  if (!headers.length) return null;

  const yEligible = headers.filter((h) => h !== xColumn && numericColumns.has(h));
  const nonNumeric = headers.filter((h) => h !== xColumn && !numericColumns.has(h));

  const toggleYColumn = (col) => {
    if (isCategorical) {
      dispatch({ type: "SET_Y_COLUMNS", payload: [col] });
      return;
    }
    const next = yColumns.includes(col)
      ? yColumns.filter((c) => c !== col)
      : [...yColumns, col];
    dispatch({ type: "SET_Y_COLUMNS", payload: next });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
        <ArrowRightLeft size={14} />
        Axis Configuration
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">
          {isCategorical ? "Labels column" : "X-Axis column"}
        </label>
        <select
          value={xColumn ?? ""}
          onChange={(e) => dispatch({ type: "SET_X_COLUMN", payload: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        >
          <option value="">Select column...</option>
          {headers.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs text-slate-500 block mb-1">
          {isCategorical ? "Values column" : "Y-Axis columns"}{" "}
          {!isCategorical && <span className="text-slate-400">(multi-select)</span>}
        </label>
        <div className="flex flex-wrap gap-1">
          {yEligible.map((h) => (
            <button
              key={h}
              onClick={() => toggleYColumn(h)}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                yColumns.includes(h)
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
        {nonNumeric.length > 0 && (
          <p className="text-xs text-slate-400 mt-1.5">
            Non-numeric columns hidden: {nonNumeric.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
