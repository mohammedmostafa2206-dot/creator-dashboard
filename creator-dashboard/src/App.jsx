
import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";
import StatsCards from "./components/StatsCards";
import WeekSelector from "./components/WeekSelector";
import PlatformSection from "./components/PlatformSection";
import AddVideoModal from "./components/AddVideoModal";

import {
  loadVideos,
  saveVideos,
  loadTheme,
  saveTheme,
} from "./utils/storage";

// حساب أيام الأسبوع من السبت إلى الجمعة
function getWeekDates(offset = 0) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const day = today.getDay();
  const saturdayOffset = (day + 1) % 7;

  const saturday = new Date(today);
  saturday.setDate(
    today.getDate() - saturdayOffset + offset * 7
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(saturday);
    date.setDate(saturday.getDate() + index);
    return date;
  });
}

// تحويل التاريخ إلى YYYY-MM-DD
function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// إنشاء ID فريد لكل مهمة
function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const sections = [
  {
    title: "YouTube",
    subtitle: "الفيديوهات الطويلة",
    category: "youtube",
  },
  {
    title: "Reels",
    subtitle: "الفيديوهات القصيرة",
    category: "reels",
  },
  {
    title: "قبل النشر",
    subtitle: "المونتاج والمراجعة والتجهيز",
    category: "editing",
  },
  {
    title: "منصات أخرى",
    subtitle: "باقي حساباتك",
    category: "other",
  },
];

export default function App() {
  // البيانات والإعدادات
  const [videos, setVideos] = useState(loadVideos);
  const [theme, setTheme] = useState(loadTheme);

  // الأسبوع واليوم المختاران
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  });

  // النافذة الخاصة بإضافة وتعديل المحتوى
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [initialCategory, setInitialCategory] =
    useState("youtube");

  // القسم المختار في البار الجانبي
  const [activeSection, setActiveSection] =
    useState("home");

  // تواريخ الأسبوع الحالي المعروض
  const weekDates = useMemo(
    () => getWeekDates(weekOffset),
    [weekOffset]
  );

  // عنوان الأسبوع
  const weekLabel = `${weekDates[0].toLocaleDateString(
    "ar-EG",
    {
      day: "numeric",
      month: "short",
    }
  )} - ${weekDates[6].toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  })}`;

  // حفظ المهام تلقائيًا
  useEffect(() => {
    saveVideos(videos);
  }, [videos]);

  // حفظ المظهر وتطبيقه
  useEffect(() => {
    saveTheme(theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // الانتقال إلى أسبوع آخر مع اختيار يوم السبت فيه
  function changeWeek(direction) {
    const nextOffset = weekOffset + direction;
    const nextWeekDates = getWeekDates(nextOffset);

    setWeekOffset(nextOffset);
    setSelectedDate(nextWeekDates[0]);
  }

  // مهام الأسبوع المختار فقط
  const visibleVideos = useMemo(() => {
    const start = dateKey(weekDates[0]);
    const end = dateKey(weekDates[6]);

    return videos.filter((video) => {
      // لا نعرض المهام غير المؤرخة في كل الأسابيع
      if (!video.date) return false;

      return video.date >= start && video.date <= end;
    });
  }, [videos, weekDates]);

  // مهام اليوم المختار
  const selectedVideos = useMemo(() => {
    const selectedKey = dateKey(selectedDate);

    return visibleVideos.filter(
      (video) => video.date === selectedKey
    );
  }, [visibleVideos, selectedDate]);

  // الأقسام الظاهرة حسب اختيار البار
  const displayedSections =
    activeSection === "home"
      ? sections
      : sections.filter(
          (section) =>
            section.category === activeSection
        );

  // فتح نافذة إضافة محتوى
  function openAdd(category = "youtube") {
    setEditingVideo(null);
    setInitialCategory(category);
    setModalOpen(true);
  }

  // فتح نافذة تعديل محتوى
  function openEdit(video) {
    setEditingVideo(video);
    setInitialCategory(video.category || "youtube");
    setModalOpen(true);
  }

  // حفظ المحتوى الجديد أو التعديلات
  function handleSave(form) {
    if (editingVideo) {
      setVideos((current) =>
        current.map((video) =>
          video.id === editingVideo.id
            ? { ...video, ...form }
            : video
        )
      );
    } else {
      const newVideo = {
        ...form,
        id: makeId(),
        createdAt: new Date().toISOString(),
      };

      setVideos((current) => [newVideo, ...current]);
    }

    setModalOpen(false);
    setEditingVideo(null);
  }

  // تغيير حالة إكمال المهمة
  function toggleComplete(id) {
    setVideos((current) =>
      current.map((video) =>
        video.id === id
          ? { ...video, completed: !video.completed }
          : video
      )
    );
  }

  // حذف مهمة
  function deleteVideo(id) {
    const confirmed = window.confirm(
      "متأكد إنك عايز تحذف المهمة دي؟"
    );

    if (!confirmed) return;

    setVideos((current) =>
      current.filter((video) => video.id !== id)
    );
  }

  // تبديل الوضع الليلي والنهاري
  function toggleTheme() {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  }

  return (
    <div className="app-shell">
      {/* البار الجانبي */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">▶</div>

          <div>
            <strong>Creator Hub</strong>
            <small>Plan · Create · Grow</small>
          </div>
        </div>

        <div className="sidebar-label">
          مساحة العمل
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`sidebar-link ${
            activeSection === "home" ? "selected" : ""
          }`}
          onClick={() => setActiveSection("home")}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setActiveSection("home");
            }
          }}
        >
          ⌂ <span>الرئيسية</span>
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`sidebar-link ${
            activeSection === "youtube" ? "selected" : ""
          }`}
          onClick={() => setActiveSection("youtube")}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setActiveSection("youtube");
            }
          }}
        >
          ▶ <span>فيديوهات YouTube</span>
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`sidebar-link ${
            activeSection === "reels" ? "selected" : ""
          }`}
          onClick={() => setActiveSection("reels")}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setActiveSection("reels");
            }
          }}
        >
          ◎ <span>Reels</span>
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`sidebar-link ${
            activeSection === "editing" ? "selected" : ""
          }`}
          onClick={() => setActiveSection("editing")}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setActiveSection("editing");
            }
          }}
        >
          ✂ <span>قبل النشر</span>
        </div>

        <div className="sidebar-footer">
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
          />

          <small>
            نظّم أفكارك، وابدأ إنجازك ✦
          </small>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="main-content">
        <Header
          weekLabel={weekLabel}
          onPrevious={() => changeWeek(-1)}
          onNext={() => changeWeek(1)}
        />

        {/* زر تغيير المظهر على الشاشات الصغيرة */}
        <div className="mobile-theme">
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
          />
        </div>

        {/* إحصائيات الأسبوع */}
        <StatsCards videos={visibleVideos} />

        {/* اختيار اليوم */}
        <WeekSelector
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          weekDates={weekDates}
        />

        {/* عنوان المهام وزر الإضافة */}
        <div className="content-heading">
          <div>
            <h2>
              {activeSection === "home"
                ? "مهام المحتوى"
                : sections.find(
                    (section) =>
                      section.category === activeSection
                  )?.title || "مهام المحتوى"}
            </h2>

            <p>
              {selectedDate.toLocaleDateString(
                "ar-EG",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }
              )}
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              openAdd(
                activeSection === "home"
                  ? "youtube"
                  : activeSection
              )
            }
          >
            + إضافة محتوى
          </button>
        </div>

        {/* الأقسام */}
        <div className="platform-grid">
          {displayedSections.map((section) => (
            <PlatformSection
              key={section.category}
              title={section.title}
              subtitle={section.subtitle}
              category={section.category}
              videos={selectedVideos}
              onAdd={openAdd}
              onToggle={toggleComplete}
              onEdit={openEdit}
              onDelete={deleteVideo}
            />
          ))}
        </div>

        {/* التذييل */}
        <footer className="app-footer">
          <span>Creator Hub</span>
          <span>خطوة صغيرة كل يوم 🚀</span>
        </footer>
      </main>

      {/* نافذة الإضافة والتعديل */}
      <AddVideoModal
        open={modalOpen}
        initialCategory={initialCategory}
        editingVideo={editingVideo}
        onClose={() => {
          setModalOpen(false);
          setEditingVideo(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
