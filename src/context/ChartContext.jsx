import { createContext, useContext, useReducer } from "react";
import { CATEGORICAL_TYPES } from "../utils/chartDefaults";

const ChartContext = createContext(null);

// Headers that look like auto-generated row indices from SheetJS
function isIndexColumn(name) {
  const s = String(name).trim();
  return s === "0" || s === "__rowNum__" || s === "__EMPTY" || /^\d+$/.test(s);
}

// Analyze rows to classify columns as numeric or text
function classifyColumns(headers, rows) {
  const sampleSize = Math.min(rows.length, 20);
  const numeric = [];
  const text = [];

  for (const h of headers) {
    if (isIndexColumn(h)) continue; // skip index-like columns
    let numCount = 0;
    for (let i = 0; i < sampleSize; i++) {
      const v = rows[i]?.[h];
      if (v !== "" && v != null && !isNaN(Number(v))) numCount++;
    }
    if (sampleSize > 0 && numCount / sampleSize >= 0.7) {
      numeric.push(h);
    } else {
      text.push(h);
    }
  }
  return { numeric, text };
}

// Pick sensible default X (categorical/label) and Y (numeric) columns
function pickDefaults(headers, rows) {
  const { numeric, text } = classifyColumns(headers, rows);
  const xColumn = text.length > 0 ? text[0] : headers[0] ?? null;
  const yColumns = numeric.length > 0 ? [numeric[0]] : (headers.length > 1 ? [headers[1]] : []);
  return { xColumn, yColumns };
}

const initialState = {
  fileName: null,
  sheets: [],
  activeSheet: 0,
  headers: [],
  rows: [],
  allSheetData: {},

  rowRange: [0, Infinity],

  chartType: "bar",
  xColumn: null,
  yColumns: [],

  title: "",
  titleFontSize: 18,
  colorTheme: "vibrant",
  customColors: [],
  xAxisLabel: "",
  yAxisLabel: "",
  axisFontSize: 12,
  legendPosition: "bottom",
  legendShow: true,
  gridHorizontal: true,
  gridVertical: false,
  tooltipEnabled: true,
  tooltipShared: true,
  animationsEnabled: true,
  animationSpeed: 800,
  dataLabelsShow: false,
  dataLabelsFontSize: 11,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FILE_DATA": {
      const { sheets, data, fileName } = action.payload;
      const firstSheet = sheets[0];
      const { headers, rows } = data[firstSheet];
      const { xColumn, yColumns } = pickDefaults(headers, rows);
      return {
        ...state,
        fileName,
        sheets,
        activeSheet: 0,
        allSheetData: data,
        headers,
        rows,
        rowRange: [0, rows.length],
        xColumn,
        yColumns,
        title: fileName.replace(/\.\w+$/, ""),
      };
    }
    case "SET_ACTIVE_SHEET": {
      const name = state.sheets[action.payload];
      const { headers, rows } = state.allSheetData[name];
      const { xColumn, yColumns } = pickDefaults(headers, rows);
      return {
        ...state,
        activeSheet: action.payload,
        headers,
        rows,
        rowRange: [0, rows.length],
        xColumn,
        yColumns,
      };
    }
    case "SET_ROW_RANGE":
      return { ...state, rowRange: action.payload };
    case "SET_CHART_TYPE": {
      const newType = action.payload;
      let yColumns = state.yColumns;
      if (CATEGORICAL_TYPES.includes(newType) && yColumns.length > 1) {
        yColumns = [yColumns[0]];
      }
      return { ...state, chartType: newType, yColumns };
    }
    case "SET_X_COLUMN":
      return { ...state, xColumn: action.payload };
    case "SET_Y_COLUMNS":
      return { ...state, yColumns: action.payload };
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_TITLE_FONT_SIZE":
      return { ...state, titleFontSize: action.payload };
    case "SET_COLOR_THEME":
      return { ...state, colorTheme: action.payload, customColors: [] };
    case "SET_CUSTOM_COLORS":
      return { ...state, customColors: action.payload };
    case "SET_X_AXIS_LABEL":
      return { ...state, xAxisLabel: action.payload };
    case "SET_Y_AXIS_LABEL":
      return { ...state, yAxisLabel: action.payload };
    case "SET_AXIS_FONT_SIZE":
      return { ...state, axisFontSize: action.payload };
    case "SET_LEGEND_POSITION":
      return { ...state, legendPosition: action.payload };
    case "TOGGLE_LEGEND":
      return { ...state, legendShow: !state.legendShow };
    case "TOGGLE_GRID_H":
      return { ...state, gridHorizontal: !state.gridHorizontal };
    case "TOGGLE_GRID_V":
      return { ...state, gridVertical: !state.gridVertical };
    case "TOGGLE_TOOLTIP":
      return { ...state, tooltipEnabled: !state.tooltipEnabled };
    case "TOGGLE_TOOLTIP_SHARED":
      return { ...state, tooltipShared: !state.tooltipShared };
    case "TOGGLE_ANIMATIONS":
      return { ...state, animationsEnabled: !state.animationsEnabled };
    case "SET_ANIMATION_SPEED":
      return { ...state, animationSpeed: action.payload };
    case "TOGGLE_DATA_LABELS":
      return { ...state, dataLabelsShow: !state.dataLabelsShow };
    case "SET_DATA_LABELS_FONT_SIZE":
      return { ...state, dataLabelsFontSize: action.payload };
    case "CLEAR_DATA":
      return { ...initialState };
    default:
      return state;
  }
}

export function ChartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ChartContext.Provider value={{ state, dispatch }}>
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within ChartProvider");
  return ctx;
}
