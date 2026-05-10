[200~import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const association = typeof window !== 'undefined' && localStorage.getItem('association')
    ? JSON.parse(localStorage.getItem('association') || '{}')
    : {};

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        associationName={association.name || 'ST. HELENA MEDICAL'} 
        category={association.audit_category?.toUpperCase() || 'FINANCIAL'} 
        systemMode={association.system_placement?.toUpperCase() || 'CENTRAL'} 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-xs mb-2">08/05/2026</p>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-2">
                Daily audits, surfaced anomalies, and downstream legal documentation — all scoped to your association.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800">
                Run audit now
              </button>
              <button className="bg-white text-black border border-gray-300 px-6 py-2 rounded text-sm font-medium hover:bg-gray-50">
                New record
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-xs text-gray-500 font-semibold mb-4">TOTAL RECORDS</p>
            <p className="text-5xl font-bold text-black">0</p>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-xs text-gray-500 font-semibold mb-4">OPEN ANOMALIES</p>
            <p className="text-5xl font-bold text-black">0</p>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-xs text-gray-500 font-semibold mb-4">CRITICAL</p>
            <p className="text-5xl font-bold text-black">0</p>
          </div>

          <div className="bg-white border border-gray-200 rounded p-6">
            <p className="text-xs text-gray-500 font-semibold mb-4">AUDIT RUNS</p>
            <p className="text-5xl font-bold text-black">0</p>
          </div>
        </div>

        <div className="px-8 grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white border border-gray-200 rounded p-6">
            <p className="text-xs text-gray-500 font-semibold mb-4">LAST AUDIT RUN</p>
            <p className="text-gray-600">No audits have been executed yet. Click "Run audit now".</p>
          </div>

          <div className="bg-black text-white rounded p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold mb-2 opacity-75">SYSTEM MODE</p>
              <h2 className="text-2xl font-bold mb-3">{association.system_placement?.toUpperCase() || 'CENTRAL'}</h2>
              <p className="text-sm opacity-90">
                This mode aggregates anomalies and produces lawyer-friendly write-ups.
              </p>
            </div>
            <a href="/audit" className="text-sm font-medium flex items-center gap-2 hover:opacity-75 mt-4">
              Go to audit console <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
