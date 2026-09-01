export function ProgressBar({ step, total = 4 }) {
  return (
    <div className="progress" aria-label={`Paso ${step} de ${total}`}>
      <span style={{ width: `${(step / total) * 100}%` }} />
    </div>
  )
}
