import { useRef } from "react";
import { ChartProvider } from "./context/ChartContext";
import FileUploader from "./components/FileUploader";
import DataPreview from "./components/DataPreview";
import DataFilter from "./components/DataFilter";
import ChartTypeSelector from "./components/ChartTypeSelector";
import AxisConfigurator from "./components/AxisConfigurator";
import ChartCanvas from "./components/ChartCanvas";
import CustomizationPanel from "./components/CustomizationPanel";
import ExportControls from "./components/ExportControls";
import { BarChart3 } from "lucide-react";

function AppLayout() {
  const chartRef = useRef(null);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 size={22} className="text-blue-500" />
          <h1 className="text-lg font-bold text-slate-800">Charty McCharts</h1>
        </div>
        <ExportControls chartRef={chartRef} />
      </header>

      {/* Main */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-4 space-y-4">
          <FileUploader />
          <DataPreview />
          <DataFilter />
          <AxisConfigurator />
          <CustomizationPanel />
        </aside>

        {/* Chart area */}
        <main className="flex-1 flex flex-col p-4 gap-3 min-h-0">
          <ChartTypeSelector />
          <ChartCanvas ref={chartRef} />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ChartProvider>
      <AppLayout />
    </ChartProvider>
  );
}
