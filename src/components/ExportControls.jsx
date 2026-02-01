import { useExportChart } from "../hooks/useExportChart";
import { useChart } from "../context/ChartContext";
import { Download, Image } from "lucide-react";

export default function ExportControls({ chartRef }) {
  const { state } = useChart();
  const { exportPNG, exportSVG } = useExportChart(chartRef, state.title);

  if (!state.headers.length || !state.xColumn || state.yColumns.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={exportPNG}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
      >
        <Image size={14} />
        Export PNG
      </button>
      <button
        onClick={exportSVG}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
      >
        <Download size={14} />
        Export SVG
      </button>
    </div>
  );
}
