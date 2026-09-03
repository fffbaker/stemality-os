import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { 
  Receipt, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  RotateCcw, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  X
} from 'lucide-react';

export const TransactionManagerView: React.FC = () => {
  const { 
    transactions, 
    refundTransaction, 
    exportTransactionsJSON, 
    importTransactionsJSON, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [jsonInputText, setJsonInputText] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredTransactions = transactions.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch = t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.offeringTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCollected = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);

  const totalFees = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.paymentProcessorFee, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInputText(content);
    };
    reader.readAsText(file);
  };

  const handleProcessImport = () => {
    if (!jsonInputText.trim()) {
      showToast('error', 'Import Empty', 'Please upload a JSON file or paste JSON text.');
      return;
    }

    const result = importTransactionsJSON(jsonInputText);
    if (result.success) {
      setShowImportModal(false);
      setJsonInputText('');
    } else {
      showToast('error', 'Import Failed', result.error || 'Invalid JSON format.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Import/Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>Transactional Ledger & JSON Data Port</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {transactions.length} Records
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete transactional ledger with instant JSON export and schema-validated JSON import.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* JSON Import Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import JSON</span>
          </button>

          {/* JSON Export Button */}
          <button
            onClick={exportTransactionsJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export Transactions (JSON)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-emerald-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Revenue Processed</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-display">
            ${totalCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Live payments logged</div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-indigo-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Processing Fees (Stripe / ACH)</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-display">
            ${totalFees.toFixed(2)}
          </div>
          <div className="text-[11px] text-indigo-300 mt-1">2.75% Card / 0.51% ACH rates</div>
        </div>

        <div className="glass-card p-4 rounded-xl border-l-4 border-l-amber-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Volume</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-display">
            {transactions.length} Total
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            {transactions.filter(t => t.status === 'refunded').length} refunded
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${transactions.length})` },
            { id: 'completed', label: 'Completed' },
            { id: 'refunded', label: 'Refunded' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, customer..."
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice # & Timestamp</th>
                <th className="py-3 px-4">Customer & Account</th>
                <th className="py-3 px-4">Offering / Item Details</th>
                <th className="py-3 px-4">Method & Fee</th>
                <th className="py-3 px-4">Net Total</th>
                <th className="py-3 px-4 text-right">Receipt / Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">{tx.invoiceNumber}</div>
                    <div className="text-[10px] text-slate-500">{tx.timestamp}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{tx.memberName}</div>
                    <div className="text-[11px] text-slate-400">{tx.memberEmail}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200 truncate max-w-[220px]">
                      {tx.offeringTitle}
                    </div>
                    {tx.discountApplied > 0 && (
                      <div className="text-[10px] text-emerald-400">
                        -${tx.discountApplied.toFixed(2)} discount applied {tx.discountCode ? `(${tx.discountCode})` : ''}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-300 uppercase text-[11px]">
                      {tx.paymentMethod.replace('_', ' ')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Fee: ${tx.paymentProcessorFee.toFixed(2)}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-extrabold text-white text-sm font-display">
                      ${tx.total.toFixed(2)}
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tx.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium"
                      >
                        Receipt
                      </button>

                      {tx.status === 'completed' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Issue refund for ${tx.invoiceNumber} ($${tx.total.toFixed(2)})?`)) {
                              refundTransaction(tx.id);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white text-[11px] font-medium transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-indigo-500/30 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Import Transactional Data (JSON)</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300">
              Upload a exported JSON file or paste structured transaction JSON payload below. The system automatically verifies schema validity and prevents duplicate records.
            </p>

            <div className="space-y-3">
              <div>
                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-dashed border-indigo-500/40 hover:border-indigo-500 text-indigo-300 font-semibold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose JSON File to Upload</span>
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Or Paste JSON Content</label>
                <textarea
                  rows={8}
                  value={jsonInputText}
                  onChange={e => setJsonInputText(e.target.value)}
                  placeholder={`[\n  {\n    "id": "tx-sample",\n    "invoiceNumber": "INV-2026-0001",\n    "total": 189.00,\n    "memberName": "Sarah Jenkins",\n    "paymentMethod": "credit_card"\n  }\n]`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-[11px] resize-none focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Verify & Import Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail View Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Official Receipt</span>
                <h3 className="text-base font-bold text-white font-mono">{selectedTx.invoiceNumber}</h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-white">{selectedTx.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span className="font-mono">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="uppercase">{selectedTx.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Stripe Reference:</span>
                <span className="font-mono text-slate-400">{selectedTx.stripeChargeId || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="font-bold text-white pb-1 border-b border-slate-800">Line Items</div>
              <div className="flex justify-between">
                <span>{selectedTx.offeringTitle}</span>
                <span className="font-bold text-white">${selectedTx.subtotal.toFixed(2)}</span>
              </div>
              {selectedTx.discountApplied > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discounts Applied</span>
                  <span>-${selectedTx.discountApplied.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Sales Tax</span>
                <span>${selectedTx.tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-extrabold text-base text-white">
                <span>Total Paid:</span>
                <span className="text-emerald-400 font-display">${selectedTx.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
