
import { useState } from "react";

const emptyForm = {
  title: "",
  category: "youtube",
  platform: "YouTube",
  date: "",
  stage: "فكرة جديدة",
  notes: "",
  completed: false,
};

const stages = [
  "فكرة جديدة",
  "كتابة السكريبت",
  "التصوير",
  "المونتاج",
  "المراجعة",
  "جاهز للنشر",
  "تم النشر",
];

export default function AddVideoModal({
  open,
  initialCategory,
  editingVideo,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => {
    if (editingVideo) {
      return {
        ...emptyForm,
        ...editingVideo,
      };
    }

    return {
      ...emptyForm,
      category:
        initialCategory === "all"
          ? "youtube"
          : initialCategory,
      platform:
        initialCategory === "reels"
          ? "Instagram"
          : "YouTube",
    };
  });

  if (!open) return null;

  function update(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "platform") {
        if (value === "YouTube") next.category = "youtube";
        else if (value === "Instagram" || value === "TikTok") {
          next.category = "reels";
        } else if (value === "Facebook") {
          next.category = "other";
        } else {
          next.category = "other";
        }
      }

      return next;
    });
  }

  function submit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    onSave({
      ...form,
      title: form.title.trim(),
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form
        className="modal"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2>
              {editingVideo ? "تعديل المهمة" : "إضافة محتوى جديد"}
            </h2>
            <p>سجّل تفاصيل الفيديو وخطة تنفيذه.</p>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <label>
          اسم الفيديو أو المهمة
          <input
            autoFocus
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="مثال: أفضل أدوات المونتاج"
          />
        </label>

        <label>
          المنصة
          <select
            value={form.platform}
            onChange={(e) => update("platform", e.target.value)}
          >
            <option>YouTube</option>
            <option>Instagram</option>
            <option>TikTok</option>
            <option>Facebook</option>
            <option>LinkedIn</option>
            <option>X</option>
            <option>Snapchat</option>
            <option>Threads</option>
            <option>Pinterest</option>
            <option>أخرى</option>
          </select>
        </label>

        <label>
          القسم
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="youtube">فيديوهات YouTube</option>
            <option value="reels">Reels وفيديوهات قصيرة</option>
            <option value="editing">قبل النشر والمونتاج</option>
            <option value="other">محتوى منصات أخرى</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            موعد التنفيذ
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>

          <label>
            المرحلة
            <select
              value={form.stage}
              onChange={(e) => update("stage", e.target.value)}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          ملاحظات (اختياري)
          <textarea
            rows="3"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="اكتب أي تفاصيل مهمة..."
          />
        </label>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(e) => update("completed", e.target.checked)}
          />
          المهمة مكتملة
        </label>

        <div className="modal-actions">
          <button className="primary-button" type="submit">
            {editingVideo ? "حفظ التعديلات" : "إضافة المهمة"}
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={onClose}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
