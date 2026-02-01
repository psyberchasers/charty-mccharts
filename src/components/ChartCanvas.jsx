import { forwardRef, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useChartConfig } from "../hooks/useChartConfig";
import { useChart } from "../context/ChartContext";
import { BarChart3 } from "lucide-react";

const ChartCanvas = forwardRef(function ChartCanvas(_, ref) {
  const { state } = useChart();
  const { options, series, chartType } = useChartConfig();
  const containerRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const hasData = state.headers.length > 0 && state.xColumn && state.yColumns.length > 0;
  const hasSeries = Array.isArray(series) && series.length > 0;
  const shouldRender = hasData && hasSeries;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!shouldRender) {
      // Destroy chart when there's nothing to show
      if (chartInstanceRef.current) {
        try { chartInstanceRef.current.destroy(); } catch (_) {}
        chartInstanceRef.current = null;
        if (ref) ref.current = null;
        // Clear any leftover DOM from ApexCharts
        container.innerHTML = "";
      }
      return;
    }

    const fullOptions = {
      ...options,
      chart: { ...options.chart, type: chartType, height: "100%" },
      series,
    };

    if (chartInstanceRef.current) {
      // Update existing chart - wrap in try/catch because type switches can fail
      try {
        chartInstanceRef.current.updateOptions(fullOptions, true, true, true);
      } catch (_) {
        // If update fails, destroy and recreate
        try { chartInstanceRef.current.destroy(); } catch (_e) {}
        chartInstanceRef.current = null;
        container.innerHTML = "";

        const chart = new ApexCharts(container, fullOptions);
        chart.render();
        chartInstanceRef.current = chart;
        if (ref) ref.current = { chart };
      }
    } else {
      // Create new chart
      container.innerHTML = "";
      const chart = new ApexCharts(container, fullOptions);
      chart.render();
      chartInstanceRef.current = chart;
      if (ref) ref.current = { chart };
    }

    // Cleanup only on full unmount
    return () => {
      if (chartInstanceRef.current) {
        try { chartInstanceRef.current.destroy(); } catch (_) {}
        chartInstanceRef.current = null;
        if (ref) ref.current = null;
      }
    };
  }, [shouldRender, options, series, chartType]);

  // Determine placeholder message
  let placeholder = null;
  if (!state.headers.length) {
    placeholder = "Upload a file to get started";
  } else if (!state.xColumn || state.yColumns.length === 0) {
    placeholder = "Select X and Y columns to render a chart";
  } else if (!hasSeries) {
    placeholder = "No data to display";
  }

  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 min-h-0 relative">
      {/* Always keep the container mounted so ApexCharts doesn't lose its DOM node */}
      <div
        ref={containerRef}
        style={{
          height: "100%",
          width: "100%",
          display: shouldRender ? "block" : "none",
        }}
      />
      {placeholder && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400 text-sm">{placeholder}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChartCanvas;
