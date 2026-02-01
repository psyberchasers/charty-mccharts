import { useCallback } from "react";
import { saveAs } from "file-saver";

export function useExportChart(chartRef, title) {
  const exportPNG = useCallback(async () => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    try {
      const { imgURI } = await chart.dataURI({ scale: 2 });
      saveAs(imgURI, `${title || "chart"}.png`);
    } catch (err) {
      console.error("PNG export failed:", err);
    }
  }, [chartRef, title]);

  const exportSVG = useCallback(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    try {
      chart.exports.exportToSVG();
    } catch (err) {
      console.error("SVG export failed:", err);
    }
  }, [chartRef]);

  return { exportPNG, exportSVG };
}
