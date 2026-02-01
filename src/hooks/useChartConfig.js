import { useMemo } from "react";
import { useChart } from "../context/ChartContext";
import { chartDefaults, CATEGORICAL_TYPES } from "../utils/chartDefaults";
import { colorThemes } from "../utils/colorThemes";
import { buildSeries } from "../utils/seriesBuilder";

export function useChartConfig() {
  const { state } = useChart();

  return useMemo(() => {
    const {
      rows, xColumn, yColumns, chartType, rowRange,
      title, titleFontSize, colorTheme, customColors,
      xAxisLabel, yAxisLabel, axisFontSize,
      legendPosition, legendShow,
      gridHorizontal, gridVertical,
      tooltipEnabled, tooltipShared,
      animationsEnabled, animationSpeed,
      dataLabelsShow, dataLabelsFontSize,
    } = state;

    const { series, categories, labels } = buildSeries(rows, xColumn, yColumns, chartType, rowRange);
    const colors = customColors.length > 0 ? customColors : colorThemes[colorTheme] ?? colorThemes.vibrant;
    const defaults = chartDefaults[chartType] ?? {};
    const isCategorical = CATEGORICAL_TYPES.includes(chartType);

    const options = {
      ...defaults,
      chart: {
        ...defaults.chart,
        animations: {
          enabled: animationsEnabled,
          speed: animationSpeed,
          dynamicAnimation: { enabled: animationsEnabled, speed: 350 },
        },
        toolbar: { show: true, tools: { download: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true } },
      },
      colors,
      title: {
        text: title,
        align: "center",
        style: { fontSize: `${titleFontSize}px`, fontWeight: 600, color: "#1e293b" },
      },
      dataLabels: {
        enabled: dataLabelsShow,
        style: { fontSize: `${dataLabelsFontSize}px` },
      },
      legend: {
        show: legendShow,
        position: legendPosition,
        fontSize: "13px",
      },
      tooltip: {
        enabled: tooltipEnabled,
        shared: tooltipShared && !isCategorical,
        intersect: isCategorical ? true : !tooltipShared,
      },
      grid: {
        show: gridHorizontal || gridVertical,
        xaxis: { lines: { show: gridVertical } },
        yaxis: { lines: { show: gridHorizontal } },
      },
    };

    if (isCategorical) {
      options.labels = labels;
    } else {
      const effectiveXLabel = xAxisLabel || xColumn || "";
      const effectiveYLabel = yAxisLabel || (yColumns.length === 1 ? yColumns[0] : "");
      options.xaxis = {
        categories: categories ?? [],
        title: {
          text: effectiveXLabel,
          style: { fontSize: `${axisFontSize}px`, color: "#64748b" },
        },
        labels: { style: { fontSize: `${axisFontSize}px` } },
      };
      options.yaxis = {
        title: {
          text: effectiveYLabel,
          style: { fontSize: `${axisFontSize}px`, color: "#64748b" },
        },
        labels: { style: { fontSize: `${axisFontSize}px` } },
      };
    }

    return { options, series, chartType: chartType === "donut" ? "donut" : (chartType === "polarArea" ? "polarArea" : chartType) };
  }, [state]);
}
