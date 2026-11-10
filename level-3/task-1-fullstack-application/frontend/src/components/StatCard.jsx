export default function StatCard({ icon: Icon, label, value, note, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <span className={`stat-icon stat-${tone}`}><Icon size={20} /></span>
      <div className="stat-copy">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-note">{note}</span>
      </div>
    </article>
  )
}
