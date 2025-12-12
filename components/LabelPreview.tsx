import React from 'react';
import { LabelData } from '../types';

interface LabelPreviewProps {
  data: LabelData;
  scale?: number;
}

export const LabelPreview: React.FC<LabelPreviewProps> = ({ data, scale = 1 }) => {
  return (
    <div
      id="label-preview-container"
      className="bg-white shadow-lg overflow-hidden relative print:shadow-none select-none"
      style={{
        width: '700px', // Increased width for border and cutting lines
        height: '500px', // Increased height for border and cutting lines
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        backgroundColor: '#f8f9fa', // Light background for better visibility
        padding: '20px', // Outer padding for border area
        fontFamily: "'Noto Sans SC', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible'
      }}
    >
      {/* Outer border with cutting guides */}
      <div
        style={{
          width: '600px',
          height: '400px',
          backgroundColor: '#ffffff',
          border: '2px solid #d1d5db', // Outer border
          position: 'relative',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}
      >
        {/* Cutting corner marks */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '15px',
          height: '15px',
          borderTop: '2px solid #374151',
          borderLeft: '2px solid #374151'
        }} />
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '15px',
          height: '15px',
          borderTop: '2px solid #374151',
          borderRight: '2px solid #374151'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          width: '15px',
          height: '15px',
          borderBottom: '2px solid #374151',
          borderLeft: '2px solid #374151'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '15px',
          height: '15px',
          borderBottom: '2px solid #374151',
          borderRight: '2px solid #374151'
        }} />

        {/* Optional cutting lines in middle of edges */}
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '15px',
          right: '15px',
          height: '10px',
          backgroundImage: 'repeating-linear-gradient(90deg, #374151, #374151 5px, transparent 5px, transparent 10px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          left: '15px',
          right: '15px',
          height: '10px',
          backgroundImage: 'repeating-linear-gradient(90deg, #374151, #374151 5px, transparent 5px, transparent 10px)'
        }} />
        <div style={{
          position: 'absolute',
          left: '-10px',
          top: '15px',
          bottom: '15px',
          width: '10px',
          backgroundImage: 'repeating-linear-gradient(0deg, #374151, #374151 5px, transparent 5px, transparent 10px)'
        }} />
        <div style={{
          position: 'absolute',
          right: '-10px',
          top: '15px',
          bottom: '15px',
          width: '10px',
          backgroundImage: 'repeating-linear-gradient(0deg, #374151, #374151 5px, transparent 5px, transparent 10px)'
        }} />

        {/* Top Section */}
        <div className="flex justify-between items-start">
        {/* Product Info */}
        <div className="flex flex-col gap-6 pt-1 flex-1 min-w-0">
          {/* Product Name */}
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">产品名称 / Product Name:</span>
            {/* Use word-break and ensure proper line height to prevent clipping */}
            <span
              className="text-slate-900 font-black text-3xl leading-relaxed tracking-tight break-words"
              style={{
                lineHeight: '1.3',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >{data.productName}</span>
          </div>

          <div className="flex gap-12">
            {/* Model */}
            <div className="flex flex-col gap-1 min-w-0">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">型号 / Model:</span>
                <span
                  className="text-slate-900 font-bold text-2xl font-mono tracking-tight break-words"
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >{data.productModel}</span>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">日期 / Date:</span>
                <span className="text-slate-900 font-bold text-2xl font-mono tracking-tight">{data.productionYear}</span>
            </div>
          </div>
        </div>

        {/* QC Stamp - Heavy Industrial Style */}
        <div className="ml-8 shrink-0 relative mt-2">
            <div className="w-[120px] h-[100px] border-[4px] border-slate-900 flex flex-col items-center justify-center relative bg-white overflow-visible">
                <div className="absolute inset-[2px] border border-slate-400 opacity-40 pointer-events-none"></div>

                <span
                  className="font-black text-3xl text-slate-900 tracking-widest relative z-10 mt-1"
                  style={{
                    fontFamily: "'Noto Sans SC', sans-serif"
                  }}
                >{data.qcStatus}</span>

                {/* Adjust vertical margin to prevent overflow */}
                <div className="w-[85%] h-[2px] bg-slate-900 my-1 relative z-10"></div>

                <div
                  className="flex flex-col items-center relative z-10"
                  style={{
                    lineHeight: '1.2',
                    fontFamily: "'Noto Sans SC', sans-serif"
                  }}
                >
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-0.5">INSPECTED</span>
                    <span
                      className="text-xs font-bold text-slate-900"
                      style={{
                        fontFamily: "'Roboto Mono', monospace"
                      }}
                    >{data.qcDate}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-end justify-between mt-auto pt-8 border-t border-slate-200">
        
        {/* Left: Company Info */}
        <div className="flex flex-col gap-3 flex-1 min-w-0 pr-4">
            <div>
                 <div
                   className="text-base font-black text-slate-900 uppercase tracking-wide break-words"
                   style={{
                     wordBreak: 'break-word',
                     overflowWrap: 'break-word'
                   }}
                 >{data.companyName}</div>
                 <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider break-all">{data.website}</div>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px] text-slate-600 leading-snug font-medium">
                <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">Add:</span>
                <span className="break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{data.address}</span>

                <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">Mail:</span>
                <span className="font-mono break-all">{data.email}</span>
            </div>
        </div>

        {/* Right: Completely Blank Area (160x100 reserved) */}
        <div className="w-[160px] h-[80px] shrink-0 border-l border-slate-100 opacity-0 print:opacity-0">
             {/* Reserved for physical sticker */}
        </div>

          </div>
      </div>
    </div>
  );
};