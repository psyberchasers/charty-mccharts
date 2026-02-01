import { CATEGORICAL_TYPES } from "./chartDefaults";

function toNumber(val) {
  if (typeof val === "number") return val;
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

export function buildSeries(rows, xColumn, yColumns, chartType, rowRange) {
  if (!xColumn || yColumns.length === 0 || rows.length === 0) {
    return { series: [], categories: [] };
  }

  const start = rowRange?.[0] ?? 0;
  const end = rowRange?.[1] ?? rows.length;
  const filtered = rows.slice(start, end);

  const categories = filtered.map((r) => r[xColumn] ?? "");

  if (CATEGORICAL_TYPES.includes(chartType)) {
    const col = yColumns[0];
    const series = filtered.map((r) => toNumber(r[col]));
    return { series, labels: categories.map(String) };
  }

  if (chartType === "heatmap") {
    const series = yColumns.map((col) => ({
      name: col,
      data: filtered.map((r) => ({
        x: String(r[xColumn] ?? ""),
        y: toNumber(r[col]),
      })),
    }));
    return { series, categories: [] };
  }

  // bar, line, area, scatter, radar
  const series = yColumns.map((col) => ({
    name: col,
    data: filtered.map((r) => toNumber(r[col])),
  }));

  return { series, categories: categories.map(String) };
}
