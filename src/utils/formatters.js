export function numberFormatter(val) {
  if (typeof val !== "number") return val;
  if (Math.abs(val) >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M";
  if (Math.abs(val) >= 1_000) return (val / 1_000).toFixed(1) + "K";
  return val.toFixed(val % 1 === 0 ? 0 : 2);
}

export function tooltipFormatter({ series, seriesIndex, dataPointIndex, w }) {
  const name = w.globals.seriesNames?.[seriesIndex] ?? "";
  const val = series[seriesIndex]?.[dataPointIndex];
  const cat = w.globals.categoryLabels?.[dataPointIndex] ?? w.globals.labels?.[dataPointIndex] ?? "";
  return `<div class="px-3 py-2">
    <div class="font-semibold text-sm">${cat}</div>
    <div class="text-xs">${name}: <strong>${numberFormatter(val)}</strong></div>
  </div>`;
}
