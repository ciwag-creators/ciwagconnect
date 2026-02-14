type StatCardProps = {
  title: string
  value: string | number
  icon?: React.ReactNode
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div style={{
      background: '#fff',
      padding: 16,
      borderRadius: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <p style={{ fontSize: 14, color: '#666' }}>{title}</p>
        <p style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</p>
      </div>

      {icon && <div>{icon}</div>}
    </div>
  )
}