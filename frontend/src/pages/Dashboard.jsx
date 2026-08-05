import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import AppShell from '../components/AppShell'
import { api } from '../lib/api'

const CHART_COLORS = ['#C9A84C', '#3FBFAD', '#F5A623', '#3DBF7A', '#E8615A']

export default function Dashboard() {
  const { companyId } = useParams()
  const [datasets,  setDatasets]  = useState([])
  const [active,    setActive]    = useState(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0 = line, 1 = bar, 2 = table
  const fileInputRef = useRef(null)

  useEffect(() => {
    api.listDatasets(companyId).then((data) => {
      setDatasets(data)
      if (data.length > 0) loadDataset(data[data.length - 1].id)
    })
  }, [companyId])

  async function loadDataset(id) {
    const data = await api.getDataset(companyId, id)
    setActive(data)
    setActiveTab(0)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await api.uploadDataset(companyId, file)
      const list   = await api.listDatasets(companyId)
      setDatasets(list)
      loadDataset(result.id)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const numericColumns = active
    ? active.columns.filter((col) => active.rows.every((r) => r[col] === null || !isNaN(Number(r[col]))))
    : []
  const labelColumn = active?.columns.find((c) => !numericColumns.includes(c)) || active?.columns?.[0]

  const tooltipStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--text-primary)',
    fontSize: 12,
  }

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2 animate-slide-up">
          <div>
            <p className="section-label mb-2">Data Dashboard</p>
            <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
              Your Metrics
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Upload a CSV of your metrics and see it charted instantly.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {datasets.length > 1 && (
              <select
                className="input text-sm"
                style={{ width: 'auto' }}
                value={active?.id || ''}
                onChange={(e) => loadDataset(Number(e.target.value))}
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>{d.filename}</option>
                ))}
              </select>
            )}
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" id="csv-upload" />
            <button
              id="upload-csv-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary gap-2"
            >
              <UploadIcon />
              {uploading ? 'Uploading…' : 'Upload CSV'}
            </button>
          </div>
        </div>

        <div className="divider-gold mt-4 mb-8" />

        {/* Empty state */}
        {!active && (
          <div
            className="card text-center py-16 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-4xl mb-4">📊</div>
            <p className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              No data yet
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Upload a CSV of your metrics (monthly revenue, users, signups, etc.)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary inline-flex"
            >
              <UploadIcon /> Upload your first CSV
            </button>
          </div>
        )}

        {/* Data visualization */}
        {active && (
          <div className="flex flex-col gap-6 animate-slide-up">

            {/* Summary row */}
            {numericColumns.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {numericColumns.slice(0, 4).map((col, i) => {
                  const vals = active.rows
                    .map((r) => Number(r[col]))
                    .filter((v) => !isNaN(v))
                  const total = vals.reduce((a, b) => a + b, 0)
                  const avg   = vals.length ? (total / vals.length).toFixed(1) : '—'
                  const last  = vals.length ? vals[vals.length - 1].toLocaleString() : '—'
                  return (
                    <div
                      key={col}
                      className="card animate-slide-up"
                      style={{ animationDelay: `${i * 0.05}s`, borderLeft: `3px solid ${CHART_COLORS[i % CHART_COLORS.length]}` }}
                    >
                      <p className="text-2xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{col}</p>
                      <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{last}</p>
                      <p className="text-2xs mt-1" style={{ color: 'var(--text-muted)' }}>avg {avg}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tab selector */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl w-fit"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              {['Line Chart', 'Bar Chart', 'Raw Data'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={activeTab === i ? {
                    background: 'var(--gold-soft)',
                    color: 'var(--gold)',
                    border: '1px solid var(--gold-glow)',
                  } : {
                    color: 'var(--text-muted)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Line Chart */}
            {activeTab === 0 && (
              <div className="card animate-fade-in">
                <p className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  {active.filename} — Trend
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={active.rows} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <XAxis dataKey={labelColumn} stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                    {numericColumns.map((col, i) => (
                      <Line
                        key={col}
                        type="monotone"
                        dataKey={col}
                        stroke={CHART_COLORS[i % CHART_COLORS.length]}
                        strokeWidth={2.5}
                        dot={{ r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bar Chart */}
            {activeTab === 1 && numericColumns.length > 0 && (
              <div className="card animate-fade-in">
                <p className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  {numericColumns[0]} by {labelColumn}
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={active.rows} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <XAxis dataKey={labelColumn} stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--border)', opacity: 0.3 }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                    {numericColumns.map((col, i) => (
                      <Bar
                        key={col}
                        dataKey={col}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                        radius={[6, 6, 0, 0]}
                        fillOpacity={0.9}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Raw table */}
            {activeTab === 2 && (
              <div className="card overflow-x-auto animate-fade-in">
                <p className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  {active.filename} — {active.rows.length} rows
                </p>
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {active.columns.map((c) => (
                        <th key={c} className="text-left py-2.5 pr-5 font-semibold text-2xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.rows.map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: '1px solid var(--border)', opacity: 0.9 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {active.columns.map((c) => (
                          <td key={c} className="py-2 pr-5" style={{ color: 'var(--text-secondary)' }}>
                            {String(row[c] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function UploadIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" /><polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" /></svg>
}
