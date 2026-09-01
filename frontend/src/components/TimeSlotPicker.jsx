export function TimeSlotPicker({ slots, selected, onSelect }) {
  if (!slots.length) {
    return <p className="empty-state">No hay horarios disponibles para este día.</p>
  }

  return (
    <div className="time-grid" aria-label="Horarios disponibles">
      {slots.map((slot) => (
        <button
          className={`time-slot ${selected === slot ? 'time-slot--selected' : ''}`}
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          aria-pressed={selected === slot}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}
