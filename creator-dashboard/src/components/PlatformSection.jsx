/////    المكون ده بيعرض كل قسم من أقسام المحتوى. تقدر تستخدمه لليوتيوب والريلز ومهام ما قبل النشر، وكمان لأي منصة جديدة.      ////////



import VideoCard from "./VideoCard";

export default function PlatformSection({
  title,
  subtitle,
  category,
  videos,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}) {
  const items = videos.filter(
    (video) =>
      category === "all" || video.category === category
  );

  const completed = items.filter((video) => video.completed).length;

  return (
    <section className="panel platform-panel">
      <div className="platform-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <span className="count-badge">
          {completed}/{items.length}
        </span>
      </div>

      <button className="add-inline" onClick={() => onAdd(category)}>
        + إضافة فيديو أو مهمة
      </button>

      <div className="video-list">
        {items.length ? (
          items.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="empty-state">
            <span>✦</span>
            <p>مفيش مهام هنا لسه</p>
            <small>أضف أول فيديو وابدأ تنظيم شغلك.</small>
          </div>
        )}
      </div>
    </section>
  );
}
