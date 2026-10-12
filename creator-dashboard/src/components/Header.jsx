//////////////  الهيدر فيه اسم الموقع، الترحيب، واختيار الأسبوع الحالي مع أزرار التنقل بين الأسابيع.  /////////////////


export default function Header({ weekLabel, onPrevious, onNext }) {
  return (
    <header className="topbar">
      <div className="welcome">
        <span className="eyebrow">CREATOR WORKSPACE</span>
        <h1>
          أهلاً بيك يا محمد <span>👋</span>
        </h1>
        <p>نظّم محتواك، تابع مهامك، وخلّص أهدافك الأسبوعية.</p>
      </div>

      <div className="week-controls">
        <span className="calendar-icon">▦</span>
        <div>
          <strong>الأسبوع الحالي</strong>
          <small>{weekLabel}</small>
        </div>
        <button onClick={onPrevious} aria-label="الأسبوع السابق">
          ‹
        </button>
        <button onClick={onNext} aria-label="الأسبوع التالي">
          ›
        </button>
      </div>
    </header>
  );
}
