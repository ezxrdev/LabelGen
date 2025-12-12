import React from 'react';
import { LabelData } from '../types';

interface LabelEditorProps {
  data: LabelData;
  onChange: (key: keyof LabelData, value: string) => void;
}

const InputGroup = ({ label, id, value, onChange, type = "text" }: {
  label: string;
  id: keyof LabelData;
  value: string;
  onChange: (key: keyof LabelData, value: string) => void;
  type?: string;
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={id} className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(id, e.target.value)}
      className="px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
    />
  </div>
);

export const LabelEditor: React.FC<LabelEditorProps> = React.memo(({
  data,
  onChange
}) => {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          Label Information
        </h2>
        <p className="text-sm text-slate-500">
          Fill in the product and company information below to generate your label.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 border-l-4 border-blue-500 pl-2">Product Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <InputGroup label="Product Name (产品名称)" id="productName" value={data.productName} onChange={onChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Model (产品型号)" id="productModel" value={data.productModel} onChange={onChange} />
              <InputGroup label="Production Year" id="productionYear" value={data.productionYear} onChange={onChange} />
            </div>
          </div>
        </div>

        <div>
           <h3 className="text-sm font-bold text-slate-900 mb-3 border-l-4 border-green-500 pl-2">Quality Control</h3>
           <div className="grid grid-cols-2 gap-4">
              <InputGroup label="QC Status (e.g. 合格)" id="qcStatus" value={data.qcStatus} onChange={onChange} />
              <InputGroup label="QC Date" id="qcDate" value={data.qcDate} onChange={onChange} />
           </div>
        </div>

        <div>
           <h3 className="text-sm font-bold text-slate-900 mb-3 border-l-4 border-slate-500 pl-2">Company Information</h3>
           <div className="space-y-4">
             <InputGroup label="Company Name" id="companyName" value={data.companyName} onChange={onChange} />
             <InputGroup label="Website URL" id="website" value={data.website} onChange={onChange} />
             <InputGroup label="Full Address" id="address" value={data.address} onChange={onChange} />
             <InputGroup label="Email Address" id="email" value={data.email} onChange={onChange} />
           </div>
        </div>
      </div>
    </div>
  );
});