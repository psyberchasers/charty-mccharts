import { useState, useRef } from "react";
import { Upload, X, FileSpreadsheet } from "lucide-react";
import { useSpreadsheet } from "../hooks/useSpreadsheet";
import { useChart } from "../context/ChartContext";

export default function FileUploader() {
  const { loadFile, clear } = useSpreadsheet();
  const { state } = useChart();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext)) {
      setError("Unsupported file type. Use .xlsx, .xls, or .csv");
      return;
    }
    setError(null);
    try {
      await loadFile(file);
    } catch (e) {
      setError(e.message);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  if (state.fileName) {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <FileSpreadsheet size={18} className="text-emerald-600 shrink-0" />
        <span className="text-sm font-medium text-emerald-800 truncate flex-1">{state.fileName}</span>
        <button
          onClick={() => { clear(); inputRef.current && (inputRef.current.value = ""); }}
          className="p-1 hover:bg-emerald-100 rounded text-emerald-600"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        <Upload size={24} className="mx-auto mb-2 text-slate-400" />
        <p className="text-sm font-medium text-slate-600">Drop Excel or CSV file here</p>
        <p className="text-xs text-slate-400 mt-1">.xlsx, .xls, .csv</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
