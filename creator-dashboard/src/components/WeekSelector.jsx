////////////////        ده شريط أيام الأسبوع. لما تختار يوم، تقدر تعرض المهام الخاصة بيه.      ///////////////


const days = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

export default function WeekSelector({
  selectedDate,
  onSelect,
  weekDates,
}) {
  return (
    <section className="panel week-panel">
      <div className="section-heading">
        <div>
          <h2>أيام الأسبوع</h2>
          <p>اختار اليوم لمتابعة مهامك</p>
        </div>
      </div>

      <div className="week-grid">
        {weekDates.map((date, index) => {
          const active =
            date.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={date.toISOString()}
              className={`day-card ${active ? "active" : ""}`}
              onClick={() => onSelect(date)}
            >
              <span>{days[index]}</span>
              <strong>{date.getDate()}</strong>
              <small>
                {date.toLocaleDateString("ar-EG", {
                  month: "short",
                })}
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
