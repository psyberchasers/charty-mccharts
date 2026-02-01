import { useState } from "react";
import { useChart } from "../context/ChartContext";
import { colorThemes, themeNames } from "../utils/colorThemes";
import ColorPicker from "./ColorPicker";
import { Settings, ChevronDown, ChevronRight } from "lucide-react";

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
      >
        {open ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
        <span className="text-xs font-semibold text-slate-600">{title}</span>
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer">
      <span className="text-xs text-slate-600">{label}</span>
      <div
        onClick={onChange}
        className={`relative w-8 h-4 rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-slate-300"}`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </div>
    </label>
  );
}

function SliderInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 accent-blue-500"
      />
    </div>
  );
}

export default function CustomizationPanel() {
  const { state, dispatch } = useChart();

  if (!state.headers.length) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <Settings size={14} className="text-slate-500" />
        <span className="text-xs font-semibold text-slate-600">Customize Chart</span>
      </div>

      <Section title="Title" defaultOpen>
        <input
          type="text"
          value={state.title}
          onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
          placeholder="Chart title..."
          className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <SliderInput
          label="Font size"
          value={state.titleFontSize}
          onChange={(v) => dispatch({ type: "SET_TITLE_FONT_SIZE", payload: v })}
          min={10}
          max={36}
        />
      </Section>

      <Section title="Colors" defaultOpen>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">Theme</label>
          <div className="flex flex-wrap gap-1.5">
            {themeNames.map((name) => (
              <button
                key={name}
                onClick={() => dispatch({ type: "SET_COLOR_THEME", payload: name })}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                  state.colorTheme === name
                    ? "border-blue-400 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex">
                  {colorThemes[name].slice(0, 4).map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full -ml-0.5 first:ml-0" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {name}
              </button>
            ))}
          </div>

          {state.yColumns.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs text-slate-500">Per-series colors</label>
              {state.yColumns.map((col, i) => (
                <div key={col} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 w-20 truncate">{col}</span>
                  <ColorPicker
                    value={state.customColors[i] || (colorThemes[state.colorTheme] ?? [])[i]}
                    onChange={(c) => {
                      const next = [...(state.customColors.length ? state.customColors : colorThemes[state.colorTheme] ?? [])];
                      next[i] = c;
                      dispatch({ type: "SET_CUSTOM_COLORS", payload: next });
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Axes">
        <div>
          <label className="text-xs text-slate-500 block mb-1">X-axis label</label>
          <input
            type="text"
            value={state.xAxisLabel}
            onChange={(e) => dispatch({ type: "SET_X_AXIS_LABEL", payload: e.target.value })}
            placeholder={state.xColumn || "X-axis label..."}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Y-axis label</label>
          <input
            type="text"
            value={state.yAxisLabel}
            onChange={(e) => dispatch({ type: "SET_Y_AXIS_LABEL", payload: e.target.value })}
            placeholder={state.yColumns.length === 1 ? state.yColumns[0] : "Y-axis label..."}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <SliderInput
          label="Axis font size"
          value={state.axisFontSize}
          onChange={(v) => dispatch({ type: "SET_AXIS_FONT_SIZE", payload: v })}
          min={8}
          max={20}
        />
      </Section>

      <Section title="Legend">
        <Toggle label="Show legend" checked={state.legendShow} onChange={() => dispatch({ type: "TOGGLE_LEGEND" })} />
        <div>
          <label className="text-xs text-slate-500 block mb-1">Position</label>
          <select
            value={state.legendPosition}
            onChange={(e) => dispatch({ type: "SET_LEGEND_POSITION", payload: e.target.value })}
            className="w-full text-sm border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </Section>

      <Section title="Grid">
        <Toggle label="Horizontal lines" checked={state.gridHorizontal} onChange={() => dispatch({ type: "TOGGLE_GRID_H" })} />
        <Toggle label="Vertical lines" checked={state.gridVertical} onChange={() => dispatch({ type: "TOGGLE_GRID_V" })} />
      </Section>

      <Section title="Tooltips">
        <Toggle label="Enable tooltips" checked={state.tooltipEnabled} onChange={() => dispatch({ type: "TOGGLE_TOOLTIP" })} />
        <Toggle label="Shared tooltip" checked={state.tooltipShared} onChange={() => dispatch({ type: "TOGGLE_TOOLTIP_SHARED" })} />
      </Section>

      <Section title="Animations">
        <Toggle label="Enable animations" checked={state.animationsEnabled} onChange={() => dispatch({ type: "TOGGLE_ANIMATIONS" })} />
        <SliderInput
          label="Speed (ms)"
          value={state.animationSpeed}
          onChange={(v) => dispatch({ type: "SET_ANIMATION_SPEED", payload: v })}
          min={200}
          max={2000}
          step={100}
        />
      </Section>

      <Section title="Data Labels">
        <Toggle label="Show data labels" checked={state.dataLabelsShow} onChange={() => dispatch({ type: "TOGGLE_DATA_LABELS" })} />
        <SliderInput
          label="Font size"
          value={state.dataLabelsFontSize}
          onChange={(v) => dispatch({ type: "SET_DATA_LABELS_FONT_SIZE", payload: v })}
          min={8}
          max={18}
        />
      </Section>
    </div>
  );
}
