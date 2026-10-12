//////////    الكروت دي بتحسب عدد فيديوهات يوتيوب والريلز والمهام قبل النشر، والمهام المكتملة.    /////////////



const categories = [
  {
    key: "youtube",
    label: "YouTube",
    icon: "▶",
    color: "red",
  },
  {
    key: "reels",
    label: "Reels",
    icon: "◎",
    color: "purple",
  },
  {
    key: "editing",
    label: "قبل النشر",
    icon: "✂",
    color: "blue",
  },
];

export default function StatsCards({ videos }) {
  const completed = videos.filter((video) => video.completed).length;

  const stats = [
    ...categories.map((category) => ({
      ...category,
      count: videos.filter(
        (video) => video.category === category.key
      ).length,
    })),
    {
      key: "completed",
      label: "مكتملة",
      icon: "✓",
      color: "green",
      count: completed,
    },
  ];

  const percent = videos.length
    ? Math.round((completed / videos.length) * 100)
    : 0;

  return (
    <>
      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.key}>
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <strong className="stat-number">{stat.count}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="panel progress-panel">
        <div className="progress-copy">
          <div>
            <h3>إنجازك الكلي</h3>
            <p>
              أنجزت {completed} من أصل {videos.length} مهمة
            </p>
          </div>
          <strong>{percent}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${percent}%` }} />
        </div>
      </section>
    </>
  );
}
