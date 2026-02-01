import { useState } from "react";
import { useChart } from "../context/ChartContext";
import { ChevronDown, ChevronUp, Table } from "lucide-react";

const MAX_PREVIEW = 50;

export default function DataPreview() {
  const { state, dispatch } = useChart();
  const { headers, rows, sheets, activeSheet } = state;
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  if (!headers.length) return null;

  const displayRows = showAll ? rows : rows.slice(0, MAX_PREVIEW);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <Table size={14} className="text-slate-500" />
        <span className="text-xs font-semibold text-slate-600 flex-1 text-left">
          Data Preview ({rows.length} rows)
        </span>
        {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {expanded && (
        <div>
          {sheets.length > 1 && (
            <div className="flex gap-1 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
              {sheets.map((name, i) => (
                <button
                  key={name}
                  onClick={() => dispatch({ type: "SET_ACTIVE_SHEET", payload: i })}
                  className={`px-2 py-0.5 text-xs rounded ${
                    i === activeSheet ? "bg-blue-500 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-auto max-h-52">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 sticky top-0">
                  {headers.map((h) => (
                    <th key={h} className="px-2 py-1.5 text-left font-semibold text-slate-600 whitespace-nowrap border-b border-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 border-b border-slate-100">
                    {headers.map((h) => (
                      <td key={h} className="px-2 py-1 whitespace-nowrap text-slate-700 max-w-[150px] truncate">
                        {String(row[h] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length > MAX_PREVIEW && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-xs text-blue-500 hover:text-blue-600 py-1.5 bg-slate-50 border-t border-slate-200"
            >
              {showAll ? "Show less" : `Show all ${rows.length} rows`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
