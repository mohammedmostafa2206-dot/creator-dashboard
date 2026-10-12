//////        كل فيديو هيظهر في كارت تقدر من خلاله تعلّمه كمكتمل، تعدّله أو تحذفه.      //////////////////


export default function VideoCard({
  video,
  onToggle,
  onEdit,
  onDelete,
}) {
  const dateLabel = video.date
    ? new Date(`${video.date}T12:00:00`).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
      })
    : "بدون موعد";

  return (
    <article className={`video-card ${video.completed ? "is-complete" : ""}`}>
      <button
        className={`check-button ${video.completed ? "checked" : ""}`}
        onClick={() => onToggle(video.id)}
        aria-label={video.completed ? "إلغاء الإنجاز" : "تحديد كمكتمل"}
      >
        {video.completed ? "✓" : ""}
      </button>

      <div className="video-info">
        <h3>{video.title}</h3>

        <div className="video-meta">
          <span>{dateLabel}</span>
          <span className={`status-badge ${video.completed ? "done" : ""}`}>
            {video.completed ? "مكتمل" : video.stage}
          </span>
        </div>

        {video.notes && (
          <p className="video-notes">{video.notes}</p>
        )}
      </div>

      <div className="video-actions">
        <button onClick={() => onEdit(video)} aria-label="تعديل">
          ✎
        </button>
        <button
          onClick={() => onDelete(video.id)}
          aria-label="حذف"
        >
          ×
        </button>
      </div>
    </article>
  );
}
