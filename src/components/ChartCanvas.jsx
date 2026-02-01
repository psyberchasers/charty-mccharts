import { forwardRef, useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { useChartConfig } from "../hooks/useChartConfig";
import { useChart } from "../context/ChartContext";
import { BarChart3 } from "lucide-react";

const ChartCanvas = forwardRef(function ChartCanvas(_, ref) {
  const { state } = useChart();
  const { options, series, chartType } = useChartConfig();
  const containerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Expose chart instance for export
  useEffect(() => {
    if (ref) {
      ref.current = { chart: chartInstanceRef.current };
    }
  });

  const hasData = state.headers.length > 0 && state.xColumn && state.yColumns.length > 0;
  const hasSeries = Array.isArray(series) && series.length > 0;
  const shouldRender = hasData && hasSeries;

  // Create / update / destroy the chart imperatively to avoid StrictMode issues
  useEffect(() => {
    if (!shouldRender || !containerRef.current) {
      // Destroy if data is gone
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const fullOptions = {
      ...options,
      chart: { ...options.chart, type: chartType, height: "100%" },
      series,
    };

    if (chartInstanceRef.current) {
      // Update existing chart
      chartInstanceRef.current.updateOptions(fullOptions, true, true, true);
    } else {
      // Create new chart
      const chart = new ApexCharts(containerRef.current, fullOptions);
      chart.render();
      chartInstanceRef.current = chart;
      if (ref) ref.current = { chart };
    }

    setReady(true);

    return () => {
      // Cleanup on unmount
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.destroy();
        } catch (_) {
          // ignore destroy errors during StrictMode double-unmount
        }
        chartInstanceRef.current = null;
        if (ref) ref.current = null;
      }
    };
  }, [shouldRender, options, series, chartType]);

  if (!state.headers.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400 text-sm">Upload a file to get started</p>
        </div>
      </div>
    );
  }

  if (!state.xColumn || state.yColumns.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400 text-sm">Select X and Y columns to render a chart</p>
        </div>
      </div>
    );
  }

  if (!hasSeries) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-400 text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 min-h-0">
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
});

export default ChartCanvas;
