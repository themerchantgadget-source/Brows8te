import React, { useState } from 'react';
import {
  Table as TableIcon,
  Plus,
  Trash2,
  Play,
  Sparkles,
  Download,
  Upload,
  Check,
  AlertCircle,
  Copy,
  Brain,
} from 'lucide-react';
import {
  StructuredColumn,
  StructuredRow,
  ThemeMode,
  StudioParameters,
} from '../../types/aistudio';
import {
  INITIAL_STRUCTURED_COLUMNS,
  INITIAL_STRUCTURED_ROWS,
} from '../../constants/defaultPrompts';

interface StructuredPromptViewProps {
  systemInstruction: string;
  onChangeSystemInstruction: (val: string) => void;
  parameters: StudioParameters;
  themeMode: ThemeMode;
}

export const StructuredPromptView: React.FC<StructuredPromptViewProps> = ({
  systemInstruction,
  onChangeSystemInstruction,
  parameters,
  themeMode,
}) => {
  const [columns, setColumns] = useState<StructuredColumn[]>(INITIAL_STRUCTURED_COLUMNS);
  const [rows, setRows] = useState<StructuredRow[]>(INITIAL_STRUCTURED_ROWS);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  const isDark = themeMode === 'dark';

  const handleAddRow = () => {
    const newRow: StructuredRow = {
      id: `row-${Date.now()}`,
      inputs: {},
      output: '',
      testStatus: 'idle',
    };
    columns.forEach((col) => {
      if (col.type === 'input') newRow.inputs[col.id] = '';
    });
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleAddColumn = (type: 'input' | 'output') => {
    if (!newColName.trim()) return;
    const newCol: StructuredColumn = {
      id: `col-${Date.now()}`,
      name: newColName.trim(),
      type,
    };
    setColumns([...columns, newCol]);
    setNewColName('');
    setShowAddCol(false);
  };

  const handleDeleteColumn = (colId: string) => {
    if (columns.length <= 2) return;
    setColumns(columns.filter((c) => c.id !== colId));
  };

  const handleUpdateRowInput = (rowId: string, colId: string, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, inputs: { ...row.inputs, [colId]: value } }
          : row
      )
    );
  };

  const handleUpdateRowOutput = (rowId: string, value: string) => {
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, output: value } : row))
    );
  };

  const handleTestRow = async (rowId: string) => {
    const targetRow = rows.find((r) => r.id === rowId);
    if (!targetRow) return;

    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, testStatus: 'running' } : r))
    );

    try {
      const promptText = `Given the following few-shot examples:\n${rows
        .filter((r) => r.id !== rowId && r.output)
        .map((r) => `Input: ${JSON.stringify(r.inputs)} -> Output: ${r.output}`)
        .join('\n')}\n\nPredict output for:\nInput: ${JSON.stringify(targetRow.inputs)}`;

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction,
          model: parameters.model,
          temperature: parameters.temperature,
          topP: parameters.topP,
          topK: parameters.topK,
          mode: 'structured',
        }),
      });

      const data = await res.json();
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                testStatus: 'success',
                testedOutput: data.text || 'Generated response',
              }
            : r
        )
      );
    } catch {
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? { ...r, testStatus: 'error', testedOutput: 'Failed to evaluate row' }
            : r
        )
      );
    }
  };

  const handleTestAllRows = async () => {
    setIsTestingAll(true);
    for (const row of rows) {
      await handleTestRow(row.id);
    }
    setIsTestingAll(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ columns, rows }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'structured-dataset.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-4">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold">Structured Few-Shot Prompt Studio</h2>
            <p className="text-[11px] opacity-60">Train models with structured tabular input/output pairs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-[#1e1f20] border-[#282a2c] hover:bg-[#282a2c]' : 'bg-white border-[#e0e3e7] hover:bg-[#f0f4f9]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleAddRow}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-[#1e1f20] border-[#282a2c] hover:bg-[#282a2c]' : 'bg-white border-[#e0e3e7] hover:bg-[#f0f4f9]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Row</span>
          </button>

          <button
            onClick={handleTestAllRows}
            disabled={isTestingAll}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTestingAll ? 'Testing Rows...' : 'Test All Rows'}</span>
          </button>
        </div>
      </div>

      {/* System Instructions Input */}
      <div
        className={`p-3 rounded-2xl border ${
          isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
        }`}
      >
        <div className="flex items-center gap-2 pb-2 text-xs font-semibold text-emerald-500">
          <Brain className="w-3.5 h-3.5" />
          <span>System Instructions</span>
        </div>
        <textarea
          value={systemInstruction}
          onChange={(e) => onChangeSystemInstruction(e.target.value)}
          placeholder="System instructions for structured output schema and few-shot formatting..."
          rows={2}
          className={`w-full p-2 text-xs rounded-xl border outline-hidden resize-y ${
            isDark ? 'bg-[#131314] border-[#37393b] text-white' : 'bg-[#f8fafd] border-[#c4c7c5] text-black'
          }`}
        />
      </div>

      {/* Structured Few-Shot Table */}
      <div
        className={`flex-1 rounded-2xl border overflow-hidden flex flex-col ${
          isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
        }`}
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className={`border-b ${isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'}`}>
                <th className="p-3 w-12 text-center text-[10px] font-mono uppercase text-[#8e918f]">#</th>
                {columns.map((col) => (
                  <th key={col.id} className="p-3 font-semibold min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                            col.type === 'input'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }`}
                        >
                          {col.type}
                        </span>
                        <span>{col.name}</span>
                      </div>
                      {columns.length > 2 && (
                        <button
                          onClick={() => handleDeleteColumn(col.id)}
                          className="p-1 hover:text-red-500 opacity-50 hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-3 w-32 text-center font-semibold">Live Test</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-current/10">
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`group transition-colors ${
                    isDark ? 'hover:bg-[#282a2c]/40' : 'hover:bg-[#f8fafd]'
                  }`}
                >
                  <td className="p-3 text-center font-mono text-[11px] opacity-50">{index + 1}</td>

                  {/* Input and Output Cells */}
                  {columns.map((col) => {
                    const isInput = col.type === 'input';
                    const cellValue = isInput ? row.inputs[col.id] || '' : row.output || '';

                    return (
                      <td key={col.id} className="p-2.5 align-top">
                        <textarea
                          rows={2}
                          value={cellValue}
                          onChange={(e) =>
                            isInput
                              ? handleUpdateRowInput(row.id, col.id, e.target.value)
                              : handleUpdateRowOutput(row.id, e.target.value)
                          }
                          placeholder={`Enter ${col.name.toLowerCase()}...`}
                          className={`w-full p-2 text-xs rounded-lg border outline-hidden resize-y font-mono ${
                            isDark
                              ? 'bg-[#131314] border-[#37393b] text-white focus:border-[#8ab4f8]'
                              : 'bg-[#f8fafd] border-[#c4c7c5] text-black focus:border-[#1a73e8]'
                          }`}
                        />
                        {/* Tested Output if available */}
                        {!isInput && row.testedOutput && (
                          <div className="mt-1.5 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono">
                            <span className="font-semibold block text-[9px] uppercase">Model Prediction:</span>
                            {row.testedOutput}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Live Run Action */}
                  <td className="p-3 text-center align-top">
                    <button
                      onClick={() => handleTestRow(row.id)}
                      disabled={row.testStatus === 'running'}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 mx-auto transition-colors ${
                        row.testStatus === 'running'
                          ? 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                          : row.testStatus === 'success'
                          ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                          : isDark
                          ? 'bg-[#131314] border-[#282a2c] hover:bg-[#282a2c]'
                          : 'bg-white border-[#e0e3e7] hover:bg-[#f0f4f9]'
                      }`}
                    >
                      {row.testStatus === 'running' ? (
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      ) : row.testStatus === 'success' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span>Test</span>
                    </button>
                  </td>

                  {/* Delete Row */}
                  <td className="p-3 text-center align-top">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 hover:text-red-500 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Column Bar at Bottom */}
        <div className={`p-2.5 border-t flex items-center gap-2 ${isDark ? 'border-[#282a2c]' : 'border-[#e0e3e7]'}`}>
          {showAddCol ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Column header name..."
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className={`px-2.5 py-1 text-xs rounded-lg border outline-hidden ${
                  isDark ? 'bg-[#131314] border-[#282a2c] text-white' : 'bg-white border-[#e0e3e7] text-black'
                }`}
              />
              <button
                onClick={() => handleAddColumn('input')}
                className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium"
              >
                + Input Column
              </button>
              <button
                onClick={() => handleAddColumn('output')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium"
              >
                + Output Column
              </button>
              <button
                onClick={() => setShowAddCol(false)}
                className="px-2 py-1 text-xs opacity-60 hover:opacity-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCol(true)}
              className="text-xs text-blue-500 font-medium hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add new column</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
