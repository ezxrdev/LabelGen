import React, { useState, useRef, useCallback, useEffect } from 'react';
import { LabelData, DEFAULT_LABEL_DATA } from './types';
import { LabelEditor } from './components/LabelEditor';
import { LabelPreview } from './components/LabelPreview';
import { Printer, AlertCircle, Image as ImageIcon, FileText, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CanvasExporter } from './utils/canvasExport';

const App: React.FC = () => {
  const [labelData, setLabelData] = useState<LabelData>(DEFAULT_LABEL_DATA);
  const [previewData, setPreviewData] = useState<LabelData>(DEFAULT_LABEL_DATA);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 实时更新输入框的值，但预览使用防抖
  const handleDataChange = useCallback((key: keyof LabelData, value: string) => {
    // 立即更新表单数据（保证连续输入）
    setLabelData(prev => ({ ...prev, [key]: value }));

    // 防抖更新预览数据（保证性能）
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPreviewData(prev => ({ ...prev, [key]: value }));
    }, 300); // 300ms 防抖延迟
  }, []);

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      // 确保使用最新数据进行导出
      const currentData = labelData;

      const exporter = new CanvasExporter({
        width: 600,
        height: 400,
        padding: 48,
        productName: currentData.productName,
        productModel: currentData.productModel,
        productionYear: currentData.productionYear,
        companyName: currentData.companyName,
        website: currentData.website,
        address: currentData.address,
        email: currentData.email,
        qcStatus: currentData.qcStatus,
        qcDate: currentData.qcDate
      });

      exporter.downloadImage(`${currentData.productModel || 'label'}.png`);
    } catch (err) {
      console.error("Image export failed", err);
      setError("Failed to export image.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      // 确保使用最新数据进行导出
      const currentData = labelData;

      const exporter = new CanvasExporter({
        width: 600,
        height: 400,
        padding: 48,
        productName: currentData.productName,
        productModel: currentData.productModel,
        productionYear: currentData.productionYear,
        companyName: currentData.companyName,
        website: currentData.website,
        address: currentData.address,
        email: currentData.email,
        qcStatus: currentData.qcStatus,
        qcDate: currentData.qcDate
      });

      await exporter.exportPDF(`${currentData.productModel || 'label'}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
      setError("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20 shadow-sm no-print">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">L</div>
           <h1 className="text-xl font-bold text-slate-800 tracking-tight">LabelGen Pro</h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            title="Download PNG"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
            <span className="hidden sm:inline">Image</span>
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
            title="Download PDF"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            <span className="hidden sm:inline">PDF</span>
          </button>

          <div className="w-px h-8 bg-slate-200 mx-1"></div>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium text-sm shadow-md active:transform active:scale-95"
            title="Print Label"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left: Editor Panel */}
        <aside className="w-full md:w-[450px] bg-slate-50 p-4 border-r border-slate-200 overflow-hidden flex flex-col h-full no-print z-10">
          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <LabelEditor
            data={labelData}
            onChange={handleDataChange}
          />
        </aside>

        {/* Right: Preview Area */}
        <section className="flex-1 bg-slate-200/50 p-8 flex flex-col items-center justify-center overflow-auto relative">
          <div className="mb-6 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] no-print">Live Preview</div>
          
          <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
            <LabelPreview data={previewData} scale={1} />
          </div>

          <div className="mt-8 text-slate-500 text-xs max-w-md text-center no-print leading-relaxed">
            <p>Ready to print? Use the toolbar above to export files or print directly.</p>
            <p className="mt-1 opacity-75">Standard A4 / 4x6" Label Printer Compatible</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;