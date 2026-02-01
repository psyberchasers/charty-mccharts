export const chartDefaults = {
  bar: {
    chart: { type: "bar", toolbar: { show: true } },
    plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
  },
  line: {
    chart: { type: "line", toolbar: { show: true } },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 4 },
  },
  area: {
    chart: { type: "area", toolbar: { show: true } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
  },
  pie: {
    chart: { type: "pie" },
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
  },
  donut: {
    chart: { type: "donut" },
    responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
  },
  scatter: {
    chart: { type: "scatter", toolbar: { show: true }, zoom: { enabled: true } },
    markers: { size: 6 },
  },
  radar: {
    chart: { type: "radar" },
    stroke: { width: 2 },
    markers: { size: 4 },
  },
  polarArea: {
    chart: { type: "polarArea" },
    stroke: { colors: ["#fff"] },
    fill: { opacity: 0.8 },
  },
  heatmap: {
    chart: { type: "heatmap", toolbar: { show: true } },
    dataLabels: { enabled: false },
  },
};

export const CATEGORICAL_TYPES = ["pie", "donut", "polarArea"];
export const ALL_CHART_TYPES = ["bar", "line", "area", "pie", "donut", "scatter", "radar", "polarArea", "heatmap"];
