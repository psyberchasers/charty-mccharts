import { useChart } from "../context/ChartContext";
import { ALL_CHART_TYPES } from "../utils/chartDefaults";
import {
  BarChart3, LineChart, AreaChart, PieChart, Circle,
  ScatterChart, Radar, CircleDot, Grid3X3
} from "lucide-react";

const icons = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  donut: Circle,
  scatter: ScatterChart,
  radar: Radar,
  polarArea: CircleDot,
  heatmap: Grid3X3,
};

const labels = {
  bar: "Bar",
  line: "Line",
  area: "Area",
  pie: "Pie",
  donut: "Donut",
  scatter: "Scatter",
  radar: "Radar",
  polarArea: "Polar",
  heatmap: "Heatmap",
};

export default function ChartTypeSelector() {
  const { state, dispatch } = useChart();

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_CHART_TYPES.map((type) => {
        const Icon = icons[type];
        const active = state.chartType === type;
        return (
          <button
            key={type}
            onClick={() => dispatch({ type: "SET_CHART_TYPE", payload: type })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              active
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            <Icon size={14} />
            {labels[type]}
          </button>
        );
      })}
    </div>
  );
}
