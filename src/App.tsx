/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Building,
  User,
  Shield,
  Activity,
  DollarSign,
  Wrench,
  Smile,
  Gamepad2,
  BookOpen,
  UserCheck,
  PieChart,
  Bell,
  QrCode,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
  Lock,
  Plus,
  RefreshCw,
  Eye,
  Settings,
  AlertCircle,
  Clock,
  Send,
  Sliders,
  Sparkles,
  Award,
  Filter,
  Check,
  UserX,
  PlusCircle,
  TrendingUp,
  SlidersHorizontal,
  ThumbsUp,
  Sparkle
} from "lucide-react";
import {
  UserRole,
  Tenant,
  User as UserType,
  LifestyleForm,
  Application,
  ApplicationStatus,
  Room,
  Payment,
  MaintenanceRequest,
  EntryExitLog,
  Announcement,
  Notification
} from "./types.js";

export default function App() {
  // Kimlik simülasyonu ve kullanıcı yönetimi
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loginEmail, setLoginEmail] = useState("student_liam@yurtapp.com");
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState<UserRole>(UserRole.STUDENT);
  const [customTenantId, setCustomTenantId] = useState("tenant-nexus");

  // Veritabanı durum kopyaları
  const [dbState, setDbState] = useState<{
    users: UserType[];
    tenants: Tenant[];
    rooms: Room[];
    applications: Application[];
    payments: Payment[];
    maintenance: MaintenanceRequest[];
    attendance: EntryExitLog[];
    announcements: Announcement[];
  } | null>(null);

  // Aktif pano istatistikleri
  const [stats, setStats] = useState<{
    dormName: string;
    occupancyRate: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    unpaidDebtSum: number;
    unpaidCount: number;
    activeMaintenanceRequests: number;
    appStats: { submitted: number; matched: number; assigned: number; total: number };
    aiAssignmentSuccessScore: number;
  } | null>(null);

  // Aktif sekme ve tenant filtreleme durumları
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Oda Arkadaşı Anketi Form Bilgileri (Ev arkadaşı eşleştirme için)
  const [prefDorm, setPrefDorm] = useState("tenant-nexus");
  const [sleepSchedule, setSleepSchedule] = useState<"early-bird" | "night-owl" | "irregular">("early-bird");
  const [cleanlinessLevel, setCleanlinessLevel] = useState(4);
  const [noiseTolerance, setNoiseTolerance] = useState(3);
  const [smokingPreference, setSmokingPreference] = useState<"non-smoker" | "smoker" | "no-preference">("non-smoker");
  const [socialLevel, setSocialLevel] = useState(3);
  const [gamingHabits, setGamingHabits] = useState<"none" | "occasional" | "frequent">("none");
  const [studyHabits, setStudyHabits] = useState<"solo-quiet" | "group-study" | "irregular">("solo-quiet");
  const [introvertExtrovert, setIntrovertExtrovert] = useState(2);
  const [conflictTolerance, setConflictTolerance] = useState(3);
  const [preferredRoommateType, setPreferredRoommateType] = useState(
    "Akademik hazırlık için sessiz saatleri seven, düzenli ve uyumlu bir oda arkadaşı arıyorum."
  );

  // Bakım Bildirimi Form Durumu
  const [maintTitle, setMaintTitle] = useState("");
  const [maintDesc, setMaintDesc] = useState("");
  const [maintCategory, setMaintCategory] = useState<"Plumbing" | "Electrical" | "HVAC" | "Furniture" | "Other">("Plumbing");
  const [maintUrgency, setMaintUrgency] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  // Duyuru Form Durumu
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annPriority, setAnnPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [annTargetRole, setAnnTargetRole] = useState<string>("ALL");

  // Yapay Zeka Gemini Analiz Animasyon Durumları
  const [runningAIAppId, setRunningAIAppId] = useState<string | null>(null);
  const [aiStep, setAiStep] = useState<string>("");

  useEffect(() => {
    fetchDatabaseState();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        setSelectedTenantFilter("");
      } else if (currentUser.tenantId) {
        setSelectedTenantFilter(currentUser.tenantId);
      }
      fetchNotifications();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      fetchDashboardStats();
    }
  }, [selectedTenantFilter, currentUser, dbState?.applications, dbState?.rooms, dbState?.payments]);

  // Node sunucusundan tüm veritabanını yeniler
  const fetchDatabaseState = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error("HTTP durumu: " + res.status);
      const data = await res.json();
      setDbState(data);
    } catch (err: any) {
      triggerError("Veritabanı yüklenemedi: " + err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const url = `/api/dashboard/stats?tenantId=${selectedTenantFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifications/${currentUser.id}`);
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      await fetch(`/api/notifications/${currentUser.id}/mark-read`, { method: "POST" });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Simüle Edilmiş Kimlik Giriş İşlemi
  const handleLogin = async (emailToTry?: string) => {
    const email = emailToTry || loginEmail;
    if (!email) {
      triggerError("Lütfen giriş için geçerli bir e-posta adresi belirtin.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error("Giriş başarısız oldu.");
      const data = await response.json();
      setCurrentUser(data.user);
      if (data.message) {
        triggerSuccess("Sisteme Başarıyla Kaydedildiniz ve Giriş Yapıldı!");
      } else {
        triggerSuccess(`Güvenli giriş yapıldı: ${data.user.name}`);
      }
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Özel test kullanıcısı oluşturup kaydetme
  const handleRegisterCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) {
      triggerError("Lütfen tüm kimlik bilgilerini eksiksiz doldurun.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customName,
          email: customEmail,
          role: customRole,
          tenantId: customRole !== UserRole.SUPER_ADMIN ? customTenantId : undefined
        })
      });
      if (!res.ok) throw new Error("Kayıt işlemi reddedildi.");
      const data = await res.json();
      triggerSuccess(`Simüle kullanıcı '${data.user.name}' oluşturuldu! Giriş yapabilirsiniz.`);
      setLoginEmail(data.user.email);
      setCustomName("");
      setCustomEmail("");
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Öğrenci Anketi & Oda Arkadaşı Başvurusu Gönderme
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const lifestyleForm: LifestyleForm = {
      sleepSchedule,
      cleanlinessLevel,
      noiseTolerance,
      smokingPreference,
      socialLevel,
      gamingHabits,
      studyHabits,
      introvertExtrovert,
      conflictTolerance,
      preferredRoommateType
    };

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          preferredTenantId: prefDorm,
          lifestyleForm
        })
      });

      if (!res.ok) throw new Error("Kayıt işlemi sunucu tarafından onaylanmadı.");
      triggerSuccess("Harika! Kişisel yaşam anketi bilgileriniz başarıyla kaydedildi.");
      fetchDatabaseState();
      setActiveTab("dashboard");
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Gemini Yapay Zeka Karar Destek Mekanizması Çalıştırma
  const runAIEngineMatching = async (appId: string, preferredTenantId: string) => {
    setRunningAIAppId(appId);
    setAiStep("Lokal parametreler ve kısıtlamalar analiz ediliyor...");

    const steps = [
      "Gemini API entegrasyon kanalları doğrulanıyor...",
      "Yaşam alışkanlıkları ve karakter matrisi okunuyor...",
      "Gelişmiş eşleştirme algoritması (JSON Schema) hazırlanıyor...",
      "Gemini ile uyumluluk vektör puanları hesaplanıyor...",
      "En uygun odalar ve potansiyel oda arkadaşları taranıyor..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAiStep(steps[i]);
    }

    try {
      const res = await fetch(`/api/applications/${appId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: preferredTenantId })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gemini analiz boru hattı başarısız.");
      }

      await res.json();
      triggerSuccess("Gemini Yapay Seka yaşam profili analizini başarıyla tamamladı!");
      fetchDatabaseState();
    } catch (err: any) {
      triggerError("Gemini Engine Hatası: " + err.message);
    } finally {
      setRunningAIAppId(null);
      setAiStep("");
    }
  };

  // Öğrenciyi Odaya Atama İşlemini Onaylama
  const handleAssignConfirm = async (appId: string, roomId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          assignedBy: currentUser?.name || "Yapay Zeka"
        })
      });

      if (!res.ok) throw new Error("Yerleştirme onaylanamadı.");
      triggerSuccess("Öğrenci odaya başarıyla yerleştirildi! Fatura ve bildirim gönderildi.");
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Öğrenciyi Odadan Tahliye Etme
  const handleEvict = async (roomId: string, studentId: string) => {
    if (!confirm("Bu öğrenciyi odadan tahliye etmek istediğinize emin misiniz? Bu işlem oda durumunu sıfırlar.")) return;
    try {
      const res = await fetch(`/api/rooms/${roomId}/evict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId })
      });
      if (!res.ok) throw new Error("Tahliye işlemi başarısız.");
      triggerSuccess("Öğrenci odadan çıkarıldı. Oda kapasitesi güncellendi.");
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Fatura Ödeme Simülasyonu
  const handlePayInvoice = async (payId: string) => {
    try {
      const res = await fetch(`/api/payments/${payId}/pay`, { method: "POST" });
      if (!res.ok) throw new Error("Ödeme geçidinden geçmedi.");
      triggerSuccess("Fatura ödemeniz başarıyla gerçekleştirildi!");
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Yeni Bakım Talebi Bildirme
  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle || !maintDesc) {
      triggerError("Lütfen başlık ve açıklama alanlarını yazın.");
      return;
    }
    if (!currentUser) return;

    try {
      const res = await fetch("/api/maintenance/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          title: maintTitle,
          description: maintDesc,
          category: maintCategory,
          urgency: maintUrgency
        })
      });
      if (!res.ok) throw new Error("Talep kaydedilemedi.");
      triggerSuccess("Arıza/Bakım talebiniz yurt teknik ekibine iletildi.");
      setMaintTitle("");
      setMaintDesc("");
      fetchDatabaseState();
      setActiveTab("maintenance");
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Bakım Bildirimi Durumunu Güncelleme
  const handleUpdateMaintenanceStatus = async (reqId: string, status: string, remarks: string) => {
    try {
      const res = await fetch(`/api/maintenance/${reqId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          staffUpdate: remarks || "Görevli tarafından durum " + status + " olarak güncellendi."
        })
      });
      if (!res.ok) throw new Error("Durum değiştirilemedi.");
      triggerSuccess(`Arıza durumu güncellendi: ${status}`);
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Duyuru Yayınlama
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      triggerError("Duyuru başlığı ve içeriği zorunludur.");
      return;
    }

    try {
      const res = await fetch("/api/announcements/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: currentUser?.role !== UserRole.SUPER_ADMIN ? currentUser?.tenantId : undefined,
          title: annTitle,
          content: annContent,
          priority: annPriority,
          targetRole: annTargetRole === "ALL" ? undefined : annTargetRole
        })
      });
      if (!res.ok) throw new Error("Duyuru gönderilemedi.");
      triggerSuccess("Yeni duyuru tüm hedef kitlelere başarıyla duyuruldu.");
      setAnnTitle("");
      setAnnContent("");
      fetchDatabaseState();
      setActiveTab("announcements");
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Kapı Giriş-Çıkış QR Simülasyonu
  const handleLogAttendanceGate = async (studentId: string, direction: "IN" | "OUT") => {
    try {
      const res = await fetch("/api/attendance/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          direction,
          loggedBy: "Mobil Akıllı QR Okuyucu"
        })
      });
      if (!res.ok) throw new Error("Giriş kaydı başarısız.");
      triggerSuccess(`Kapı Geçişi Algılandı! Yön: ${direction === "IN" ? "GİRİŞ" : "ÇIKIŞ"}`);
      fetchDatabaseState();
    } catch (err: any) {
      triggerError(err.message);
    }
  };

  // Oturumu Kapat
  const handleLogOut = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
    triggerSuccess("Simüle oturum güvenle sonlandırıldı.");
  };

  // Görsel Yardımcılar: Renkli rozetler
  const getPriorityBadge = (prio: "LOW" | "MEDIUM" | "HIGH") => {
    switch (prio) {
      case "HIGH":
        return <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-pastel-pink-dark bg-pastel-pink-light border border-red-200 rounded-full">YÜKSEK</span>;
      case "MEDIUM":
        return <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-pastel-yellow-dark bg-pastel-yellow-light border border-amber-200 rounded-full">ORTA</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 text-xs font-bold text-pastel-green-dark bg-pastel-green-light border border-green-200 rounded-full">DÜŞÜK</span>;
    }
  };

  const getApplicationStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pastel-yellow-dark bg-pastel-yellow-light border border-amber-200 rounded-full">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> BAŞVURU ALINDI
          </span>
        );
      case ApplicationStatus.UNDER_REVIEW:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pastel-blue-dark bg-pastel-blue-light border border-blue-200 rounded-full">
            <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> İNCELEMEDE
          </span>
        );
      case ApplicationStatus.AI_MATCHED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> GEMINI AI EŞLEŞTİRDİ
          </span>
        );
      case ApplicationStatus.ASSIGNED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pastel-green-dark bg-pastel-green-light border border-green-200 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> ODA ATANDI
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-pastel-pink-dark bg-pastel-pink-light border border-red-200 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> REDDEDİLDİ
          </span>
        );
    }
  };

  const renderVectorBar = (label: string, val: number, colorClass: string) => {
    return (
      <div key={label} className="mb-2">
        <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
          <span className="capitalize">{label.replace("_", " ")}</span>
          <span className="font-mono text-gray-700 font-bold">{val}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${colorClass}`} style={{ width: `${val}%` }}></div>
        </div>
      </div>
    );
  };

  // Öğrenci bilgileri eşlemeleri
  const myApplication = dbState?.applications.find((a) => a.studentId === currentUser?.id);
  const myRoom = dbState?.rooms.find((r) => r.residentIds.includes(currentUser?.id || ""));
  const myDormInfo = dbState?.tenants.find((t) => t.id === currentUser?.tenantId);

  // Mevcut anket varsa form alanlarını onun puanlarıyla dolduralım
  useEffect(() => {
    if (myApplication) {
      setPrefDorm(myApplication.preferredTenantId || "tenant-nexus");
      const f = myApplication.lifestyleForm;
      if (f) {
        setSleepSchedule(f.sleepSchedule || "early-bird");
        setCleanlinessLevel(f.cleanlinessLevel || 4);
        setNoiseTolerance(f.noiseTolerance || 3);
        setSmokingPreference(f.smokingPreference || "non-smoker");
        setSocialLevel(f.socialLevel || 3);
        setGamingHabits(f.gamingHabits || "none");
        setStudyHabits(f.studyHabits || "solo-quiet");
        setIntrovertExtrovert(f.introvertExtrovert || 2);
        setConflictTolerance(f.conflictTolerance || 3);
        setPreferredRoommateType(f.preferredRoommateType || "");
      }
    }
  }, [myApplication]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#2d3748] flex flex-col font-sans transition-all duration-300">
      
      {/* BAŞARI VE HATA BİLDİRİM BALONLARI */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-pastel-green-light border-2 border-green-300 text-pastel-green-dark rounded-2xl shadow-xl animate-bounce max-w-sm">
          <Sparkles className="w-6 h-6 text-[#276749] shrink-0" />
          <span className="text-sm font-bold">{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 bg-pastel-pink-light border-2 border-red-300 text-pastel-pink-dark rounded-2xl shadow-xl max-w-sm">
          <AlertCircle className="w-6 h-6 text-[#9b2c2c] shrink-0" />
          <span className="text-sm font-bold">{errorToast}</span>
        </div>
      )}

      {/* ANA NAVBAR - PASTEL YEŞİL / MAVİ GEÇİŞLİ BAŞLIK */}
      <header className="border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#beebd9] via-[#bde3f0] to-[#fde68a] rounded-2xl flex items-center justify-center font-bold text-gray-800 shadow-md relative overflow-hidden group">
            <span className="relative z-10 text-2xl font-black tracking-tighter text-teal-900 font-display">Y</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 flex items-center gap-2">
              Yurt<span className="text-[11px] font-bold bg-[#beebd9] text-[#1e463a] px-2 py-0.5 rounded-lg font-mono">APP AI</span>
              <span className="text-xs text-gray-400 font-normal hidden lg:inline">| Yumuşacık & Akıllı Yaşam Platformu</span>
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-wide">Yapay Zeka Destekli Çoklu Kiracı Bölümlendirmesi</p>
          </div>
        </div>

        {/* OTURUM / SİMÜLASYON AYARLARI */}
        <div className="flex items-center gap-3 flex-wrap">
          {currentUser && (
            <div className="flex items-center gap-2.5 bg-[#f0fff4] py-2 px-4 rounded-2xl border border-green-200 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-emerald-800 font-bold">
                {currentUser.role === UserRole.SUPER_ADMIN
                  ? "SÜPER YÖNETİCİ"
                  : currentUser.role === UserRole.DORM_ADMIN
                  ? `YURT MÜDÜRÜ: ${currentUser.tenantId?.toUpperCase()}`
                  : `ÖĞRENCİ: ${currentUser.name}`}
              </span>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3 bg-[#f0f9fc] border border-blue-100 p-1.5 rounded-2xl">
              <div className="hidden sm:flex flex-col text-right px-2">
                <span className="text-xs font-bold text-gray-800 font-display">{currentUser.name}</span>
                <span className="text-[10px] text-blue-600 font-bold tracking-widest leading-3 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={handleLogOut}
                id="btn-logout"
                className="p-2.5 bg-white hover:bg-[#fff5f5] rounded-xl text-gray-400 hover:text-red-500 border border-slate-200 transition-colors shadow-sm"
                title="Simüle Oturumu Kapat"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <span className="text-sm bg-amber-50 border border-amber-200 text-amber-800 font-bold py-1.5 px-3 rounded-full">
              Kayıtlı Profil Yok (Sandbox Modu)
            </span>
          )}
        </div>
      </header>

      {/* SİMÜLE YAN MENÜ VE İÇERİK BÖLÜMÜ */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* SOL PANEL - MENÜ SEKMELERİ (KULLANICI GİRMİŞSE ETKİNLEŞİR) */}
        {currentUser && (
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#e2e8f0] p-5 flex flex-col justify-between shrink-0 gap-6">
            <div className="space-y-6">
              
              {/* Bulunulan Yurt Bilgisi */}
              <div className="rounded-2xl bg-[#ebf8ff] border border-blue-200 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">Çalışma Alanı / Bina:</span>
                <div className="text-sm font-bold text-blue-900 flex items-center gap-2 mt-1.5">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span className="truncate">
                    {currentUser.role === UserRole.SUPER_ADMIN ? (
                      <span className="text-blue-800">Tüm Bulut Yurt Ağı</span>
                    ) : (
                      dbState?.tenants.find((t) => t.id === currentUser.tenantId)?.name || "Aktif Yurt Yerleşkesi"
                    )}
                  </span>
                </div>
              </div>

              {/* SEKMELER LİSTESİ */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  id="tab-btn-dashboard"
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === "dashboard"
                      ? "bg-[#beebd9] text-[#1e463a] shadow-sm transform scale-[1.02]"
                      : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <PieChart className="w-5 h-5" /> Kontrol Paneli
                  </span>
                  {activeTab === "dashboard" && <ChevronRight className="w-4 h-4 text-[#1e463a]" />}
                </button>

                {/* ÖĞRENCİ SEKMELERİ */}
                {currentUser.role === UserRole.STUDENT && (
                  <>
                    <button
                      onClick={() => setActiveTab("apply")}
                      id="tab-btn-apply"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "apply"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm transform scale-[1.02]"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <SlidersHorizontal className="w-5 h-5" /> Ev Arkadaşı Anketi
                      </span>
                      {myApplication ? (
                        <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">DOLU</span>
                      ) : (
                        <span className="bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">BOŞ</span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab("payments")}
                      id="tab-btn-payments"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "payments"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <DollarSign className="w-5 h-5" /> Faturalarım & Ödeme
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("maintenance")}
                      id="tab-btn-maintenance"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "maintenance"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Wrench className="w-5 h-5" /> Arıza & Destek Kutusu
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("attendance")}
                      id="tab-btn-gate"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "attendance"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <QrCode className="w-5 h-5" /> QR Giriş Kapısı
                      </span>
                    </button>
                  </>
                )}

                {/* YÖNETİCİ & PERSONEL SEKMELERİ */}
                {(currentUser.role === UserRole.DORM_ADMIN || currentUser.role === UserRole.STAFF || currentUser.role === UserRole.SUPER_ADMIN) && (
                  <>
                    <button
                      onClick={() => setActiveTab("applications")}
                      id="tab-btn-m-applications"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "applications"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <UserCheck className="w-5 h-5" /> Bekleme Listesi & AI
                      </span>
                      {dbState?.applications && dbState.applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length > 0 && (
                        <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {dbState.applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab("rooms")}
                      id="tab-btn-m-rooms"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "rooms"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Building className="w-5 h-5" /> Oda Envanteri
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("maintenance")}
                      id="tab-btn-m-maintenance"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "maintenance"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Wrench className="w-5 h-5" /> Tamirat & Bakım Masası
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("payments")}
                      id="tab-btn-m-payments"
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "payments"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <DollarSign className="w-5 h-5" /> Mali Defter ve Faturalar
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("attendance")}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "attendance"
                          ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                          : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm">
                        <Clock className="w-5 h-5" /> Ziyaretçi Giriş Akışı
                      </span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActiveTab("announcements")}
                  id="tab-btn-announcements"
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === "announcements"
                      ? "bg-[#beebd9] text-[#1e463a] shadow-sm"
                      : "text-gray-500 hover:bg-[#ebf8ff] hover:text-[#2c5282]"
                  }`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <Bell className="w-5 h-5" /> Duyurular & Haberler
                  </span>
                </button>
              </nav>

            </div>

            {/* AI Gemini Entegrasyon Göstergeleri */}
            <div className="pt-5 border-t border-slate-150 space-y-4">
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 block">Gemini Modeli:</span>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Aktif: gpt-gemini-2.0
                </span>
              </div>
              <button
                onClick={fetchDatabaseState}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Eşitleniyor..." : "Veritabanını Yenile"}
              </button>
            </div>
          </aside>
        )}

        {/* ANA ÇALIŞMA EKRANI */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">

          {/* SİMÜLE EDİLMİŞ GİRİŞ VE HIZLI HESAP DEĞİŞTİRİCİ PANELDİR */}
          {!currentUser ? (
            <div className="space-y-10 py-6">
              
              {/* Giriş Karşılama Başlığı */}
              <div className="text-center space-y-4 max-w-3xl mx-auto font-sans">
                <div className="inline-flex py-2 px-5 bg-[#dfebd9]/80 border border-green-200 rounded-full text-xs sm:text-sm text-[#1e463a] font-bold tracking-wider animate-bounce">
                  🌸 YURTAPP AI - SAKİN YAŞAM VE KARAKTER UYUM PLATFORMU
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 font-display leading-[1.2]">
                  Yurt Ortamlarını Huzur Dolu Pastel Renklere Dönüştürün
                </h2>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  Yaşam alışkanlıkları, uyku saatleri, temizlik ve gürültü duyarlılığına göre mükemmel oda arkadaşı eşleşmeleri! Gemini AI tabanlı psikolojik ve ritmik kısıtlama eşleyicisi.
                </p>
              </div>

              {/* ANKETE ADIM ADIM ULAŞIM REHBERİ (AÇIK/AÇIKLAYICI PANEL) */}
              <div className="bg-[#fffbeb] border-2 border-amber-200 p-6 md:p-8 rounded-3xl max-w-3xl mx-auto space-y-4 shadow-sm text-center font-sans">
                <span className="text-[11px] font-mono tracking-widest font-black text-amber-700 uppercase block">Kılavuz ve Yardım Hizmeti</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-[#713f12] flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" /> YAŞAM ANKETİ BÖLÜMÜNE NASIL ERİŞİLİR?
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  Sistemdeki <strong>Karakter ve Yaşam Alışkanlıkları Anketi</strong>'ni doldurmak ve oda eşleşmenizi test etmek için aşağıdaki yeşil butona tıklayarak anında <strong>Öğrenci Liam</strong> olarak giriş yapıp doğrudan anket sayfasına yönlendirilebilirsiniz:
                </p>
                
                <div className="pt-2">
                  <button
                    onClick={async () => {
                      setLoginEmail("student_liam@yurtapp.com");
                      await handleLogin("student_liam@yurtapp.com");
                      setActiveTab("apply");
                    }}
                    className="inline-flex items-center gap-2.5 py-4 px-8 bg-[#beebd9] hover:bg-[#a6dcb4] text-[#1e463a] font-extrabold text-base md:text-lg rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-[#8fd7b7]"
                  >
                    <SlidersHorizontal className="w-5 h-5 text-emerald-800" />
                    Öğrenci Liam Olarak Giriş Yap & Doğrudan Anket Sayfasına Git 👉
                  </button>
                </div>
                
                <p className="text-xs text-slate-500">
                  Veyahut diğer rolleri test etmek için aşağıdaki hazır simülasyon hesaplarından birine tıklayıp sol menüden sekmelere geçiş yapabilirsiniz.
                </p>
              </div>

              {/* Hızlı Giriş & Hesap Seçici Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2 font-sans">
                
                {/* HIZLI PRESAT LOGIN SEÇENEĞİ */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold border-b border-gray-100 pb-3 text-slate-800 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-blue-500" /> Simüle Hazır Profil Seçimi
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 mb-5 leading-normal">
                      YurtApp platformunun her iki tarafını (Yönetici & Öğrenci Görünümleri) test etmek için aşağıdaki hazır simülasyon hesaplarından biriyle anında sisteme erişebilirsiniz:
                    </p>

                    <div className="space-y-3">
                      
                      {/* Liam Carter - Öğrenci */}
                      <div
                        onClick={() => {
                          setLoginEmail("student_liam@yurtapp.com");
                          handleLogin("student_liam@yurtapp.com");
                        }}
                        className="p-3 bg-amber-50/50 hover:bg-amber-50 border border-amber-100 hover:border-amber-400 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                          <div>
                            <span className="text-sm font-bold text-gray-800 block">Liam Carter (Öğrenci)</span>
                            <span className="text-[11px] text-slate-400 font-mono">student_liam@yurtapp.com</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-white text-amber-700 rounded-full font-bold border border-amber-200">
                          Bekleme Listesinde
                        </span>
                      </div>

                      {/* Sarah Lin - Öğrenci */}
                      <div
                        onClick={() => {
                          setLoginEmail("student_sarah@yurtapp.com");
                          handleLogin("student_sarah@yurtapp.com");
                        }}
                        className="p-3 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 hover:border-purple-400 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Gamepad2 className="w-5 h-5 text-purple-600" />
                          <div>
                            <span className="text-sm font-bold text-gray-800 block">Sarah Lin (Öğrenci - Gamer/Sosyal)</span>
                            <span className="text-[11px] text-slate-400 font-mono">student_sarah@yurtapp.com</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-white text-purple-700 rounded-full font-bold border border-purple-200">
                          Odada Aktif
                        </span>
                      </div>

                      {/* Harlan Cole - Yurt Müdürü */}
                      <div
                        onClick={() => {
                          setLoginEmail("oakridge_admin@yurtapp.com");
                          handleLogin("oakridge_admin@yurtapp.com");
                        }}
                        className="p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 hover:border-blue-400 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-blue-600" />
                          <div>
                            <span className="text-sm font-bold text-gray-800 block">Harlan Cole (Yurt Müdürü)</span>
                            <span className="text-[11px] text-slate-400 font-mono">oakridge_admin@yurtapp.com</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-white text-blue-700 rounded-full font-bold border border-blue-200">
                          Dorm Yönetimi
                        </span>
                      </div>

                      {/* Ambrose Sterling - Süper Admin */}
                      <div
                        onClick={() => {
                          setLoginEmail("super@yurtapp.com");
                          handleLogin("super@yurtapp.com");
                        }}
                        className="p-3 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-400 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-600" />
                          <div>
                            <span className="text-sm font-bold text-gray-800 block">Ambrose Sterling (Süper Yönetici)</span>
                            <span className="text-[11px] text-slate-400 font-mono">super@yurtapp.com</span>
                          </div>
                        </div>
                        <span className="text-xs px-2.5 py-1 bg-white text-emerald-700 rounded-full font-bold border border-emerald-200">
                          SaaS Ağı
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Serbest E-posta Kutusu */}
                  <div className="pt-5 border-t border-slate-100 mt-5 space-y-2">
                    <label className="text-xs text-slate-500 font-bold block">Farklı bir e-posta adresi yazıp girin:</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-4 text-sm rounded-xl outline-none text-slate-800 focus:border-emerald-400"
                        placeholder="Örn: test@universite.edu"
                      />
                      <button
                        onClick={() => handleLogin()}
                        className="bg-[#beebd9] text-[#1e463a] font-bold text-sm px-5 py-2.5 hover:bg-[#a9deb8] rounded-xl transition-all shadow-sm active:scale-95"
                      >
                        Giriş Yap
                      </button>
                    </div>
                  </div>
                </div>

                {/* YENİ SİMÜLE EDİLMİŞ HESAP OLUŞTURMA SİHİRBAZI */}
                <form onSubmit={handleRegisterCustom} className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold border-b border-gray-100 pb-3 text-slate-800 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-emerald-600" /> Özel Simüle Karakter Oluştur
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 mb-5 leading-normal">
                      Kendi yaşam kurgunuza uygun öğrencileri, idarecileri veya temizlik/bakım personellerini üretip seçilen yurt sınırlarında denetleyebilirsiniz.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">Kullanıcı Adı:</label>
                        <input
                          type="text"
                          required
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 text-sm rounded-xl outline-none text-slate-800 focus:border-emerald-400"
                          placeholder="Örn: Yasemin Güneş"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">E-Posta Adresi (Girmek için):</label>
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 text-sm rounded-xl outline-none text-slate-800 focus:border-emerald-400"
                          placeholder="Örn: yasemin@yurtapp.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-500 font-bold block mb-1">Giriş Yetkisi:</label>
                          <select
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value as UserRole)}
                            className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs rounded-xl outline-none text-slate-800 focus:border-emerald-400"
                          >
                            <option value={UserRole.STUDENT}>ÖĞRENCİ</option>
                            <option value={UserRole.DORM_ADMIN}>YURT GÖREVLİSİ</option>
                            <option value={UserRole.SUPER_ADMIN}>SÜPER YÖNETİCİ</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-slate-500 font-bold block mb-1">Kampüs / Yurt:</label>
                          <select
                            value={customTenantId}
                            onChange={(e) => setCustomTenantId(e.target.value)}
                            disabled={customRole === UserRole.SUPER_ADMIN}
                            className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 text-xs rounded-xl outline-none text-slate-800 focus:border-emerald-400 disabled:opacity-40"
                          >
                            <option value="tenant-oakridge">Meşe Korusu Öğrenci Evi</option>
                            <option value="tenant-nexus">Siber Nexus Rezidansı</option>
                            <option value="tenant-meadowview">Meadowview Yeşil Köyü</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-[#beebd9] text-[#1e463a] font-bold text-sm py-3 px-4 hover:bg-[#a1dcb2] rounded-xl transition-all shadow-sm active:scale-[0.98]"
                  >
                    Yeni Simülasyon Profili Oluştur
                  </button>
                </form>

              </div>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ANA GÖRÜNÜM: KONTROL PANELİ SEKME ALANI */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">

                  {/* ÖĞRENCİ İÇİN DİNAMİK YAŞAM ANKETİ BİLGİLENDİRME BANNERI */}
                  {currentUser.role === UserRole.STUDENT && (
                    <div className="bg-[#f0fff4] border-2 border-emerald-200 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-6 font-sans">
                      <div className="flex items-center gap-3.5">
                        <div className="bg-emerald-100 p-3 rounded-2xl shrink-0">
                          <Sparkles className="w-6 h-6 text-emerald-700 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-emerald-900">📋 Akıllı Karakter ve Yaşam Alışkanlıkları Anketi</h4>
                          <p className="text-sm text-emerald-750 mt-1 leading-normal">
                            Yurt odanızın belirlenmesi, Gemini AI modelinin sizi en uyumlu kişilerle eşleştirmesi için lütfen yaşam formunu eksiksiz doldurun.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("apply")}
                        className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl transition-all shadow hover:shadow-md cursor-pointer whitespace-nowrap select-none uppercase tracking-wide"
                      >
                        {myApplication ? "Anketime Git & Güncelle 👉" : "Anketimi Hemen Doldur 👉"}
                      </button>
                    </div>
                  )}

                  {/* Çoklu Bölge Filtreleyici (Yalnızca Süper Admin için geçerlidir) */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                        <Activity className="text-emerald-500 w-6 h-6 animate-pulse" /> YurtApp Yaşam Puan Odası
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Seçili Çalışma Alanı: <strong className="text-slate-700">{stats?.dormName || "Bulut ağı taranıyor..."}</strong>
                      </p>
                    </div>

                    {currentUser.role === UserRole.SUPER_ADMIN && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600">SaaS Bölge Filtresi:</span>
                        <select
                          value={selectedTenantFilter}
                          onChange={(e) => setSelectedTenantFilter(e.target.value)}
                          className="bg-transparent border-0 outline-none text-xs font-bold font-display cursor-pointer"
                        >
                          <option value="">Tüm Binalar</option>
                          <option value="tenant-oakridge">Meşe Korusu Öğrenci Evi</option>
                          <option value="tenant-nexus">Siber Nexus Rezidansı</option>
                          <option value="tenant-meadowview">Meadowview Yeşil Köyü</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* HARİKA BENTO GRİD PASTEL PANODUR (Genel İstatistikler) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    
                    {/* Yurt Doluluğu */}
                    <div className="bg-[#ebf8ff] border border-blue-200 p-5 rounded-3xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono">DURUM DOLULUK</span>
                        <Building className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-blue-900">%{(stats?.occupancyRate || 0).toFixed(0)}</span>
                        <p className="text-xs text-blue-600 mt-1 font-bold">
                          {stats?.occupiedBeds} Dolu Yatak / {stats?.totalBeds} Toplam
                        </p>
                      </div>
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                        <Building className="w-24 h-24" />
                      </div>
                    </div>

                    {/* Memnuniyet Puanı */}
                    <div className="bg-[#f0fff4] border border-green-200 p-5 rounded-3xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-green-700 uppercase tracking-widest font-mono">AI MEMNUNİYET SKORU</span>
                        <Sparkle className="w-5 h-5 text-green-500 animate-pulse" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-green-900">%{(stats?.aiAssignmentSuccessScore || 0).toFixed(0)}</span>
                        <p className="text-xs text-green-600 mt-1 font-bold">Zekâ Uyum Karakter Kararlılığı</p>
                      </div>
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                        <Award className="w-24 h-24" />
                      </div>
                    </div>

                    {/* Bekleyen Talepler */}
                    <div className="bg-[#ffebeb] border border-red-200 p-5 rounded-3xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-widest font-mono">ARIZA & DOST TALEP</span>
                        <Wrench className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-red-900">{stats?.activeMaintenanceRequests || 0}</span>
                        <p className="text-xs text-red-600 mt-1 font-bold">Aktif Çözüm Bekleyen Tamirat</p>
                      </div>
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                        <SlidersHorizontal className="w-24 h-24" />
                      </div>
                    </div>

                    {/* Geciken Ödemeler */}
                    <div className="bg-[#fffaf0] border border-amber-200 p-5 rounded-3xl relative overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono">TOPLAM ALACAK DEFT</span>
                        <DollarSign className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-amber-900">{stats?.unpaidDebtSum || 0} ₺</span>
                        <p className="text-xs text-amber-600 mt-1 font-bold">
                          {stats?.unpaidCount || 0} Ödenmemiş Fatura Evrakı
                        </p>
                      </div>
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                        <DollarSign className="w-24 h-24" />
                      </div>
                    </div>

                  </div>

                  {/* ÖĞRENCİ KİŞİSEL PANELİ (ODA DURUM GÖSTERGESİ) */}
                  {currentUser.role === UserRole.STUDENT && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Sol Öğrenci Oda Kartı */}
                      <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-emerald-500" /> Aktif Yerleşim ve Oda Durumunuz
                          </h3>
                          {myRoom ? (
                            <span className="px-3 py-1 bg-[#f0fff4] text-green-700 font-bold rounded-full text-xs border border-green-200">
                              Yerleşim Kaydı Tamamlandı
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-[#fffaf0] text-amber-700 font-bold rounded-full text-xs border border-amber-200 animate-pulse">
                              Bekleme Listesinde
                            </span>
                          )}
                        </div>

                        {myRoom ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                                  Oda No: {myRoom.roomNumber}
                                </h4>
                                <p className="text-slate-400 text-xs mt-1">
                                  Yerleşke: {myDormInfo?.name || "Bölge Belirtilmedi"} | {myDormInfo?.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm bg-blue-50 text-blue-700 px-3.5 py-1 rounded-full border border-blue-200 font-bold">
                                  {myRoom.occupancy} / {myRoom.capacity} Yatak Dolu
                                </span>
                              </div>
                            </div>

                            {/* Oda Arkadaşları Listesi */}
                            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                              <span className="text-xs text-gray-400 font-bold block uppercase tracking-wider">Oda Komşularınız (Simüle):</span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {dbState?.users.filter(u => myRoom.residentIds.includes(u.id)).map(r => (
                                  <div key={r.id} className="flex items-center gap-3 bg-white p-3 border border-slate-250 rounded-xl">
                                    <div className="w-9 h-9 bg-slate-100 text-slate-700 font-bold flex items-center justify-center rounded-xl font-display">
                                      {r.name.substring(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                      <span className="text-sm font-bold block text-gray-800">{r.name}</span>
                                      <span className="text-[10px] text-slate-400 block font-mono">Öğrenci Kaydı</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 space-y-3">
                            <div className="w-16 h-16 bg-[#fffaf0] rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-100">
                              <Info className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-800">Şu anda onaylı bir oda atamanız bulunmuyor.</h4>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto">
                              Eğer anketi çözmediyseniz lütfen "Ev Arkadaşı Anketi" sekmesine tıklayın. Anketiniz bittiğinde yöneticiniz Gemini puanlarına bakarak oda atayacaktır.
                            </p>
                            {myApplication ? (
                              <button
                                onClick={() => setActiveTab("apply")}
                                className="bg-[#ebf8ff] text-[#2c5282] py-2.5 px-5 rounded-xl font-bold hover:bg-blue-100 text-xs transition-all shadow-sm active:scale-95 border border-blue-200"
                              >
                                Anketimi Güncelle / Görüntüle
                              </button>
                            ) : (
                              <button
                                onClick={() => setActiveTab("apply")}
                                className="bg-[#beebd9] text-[#1e463a] py-2.5 px-5 rounded-xl font-bold hover:bg-[#a6dcb4] text-xs transition-all shadow-sm active:scale-95"
                              >
                                Yaşam Anketi Doldurun
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Sağ Bildirim Tablosu */}
                      <div className="bg-[#fffaf0] border border-amber-200 p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center border-b border-amber-100 pb-3">
                          <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest font-mono flex items-center gap-1.5">
                            <Bell className="w-5 h-5 text-amber-700" /> Profil Duyurularınız
                          </h4>
                        </div>
                        <div className="space-y-3 max-h-56 overflow-y-auto">
                          {dbState?.announcements.slice(0, 3).map(a => (
                            <div key={a.id} className="p-3 bg-white border border-amber-100 rounded-2xl">
                              <div className="flex justify-between">
                                <span className="text-xs font-bold text-slate-800">{a.title}</span>
                                {getPriorityBadge(a.priority)}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{a.content}</p>
                            </div>
                          ))}
                          {(!dbState?.announcements || dbState.announcements.length === 0) && (
                            <span className="text-xs text-slate-400 text-center block py-4">Sistem duyurusu bulunamadı.</span>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* KISA SÜRLÜ SON ARİZA GEÇİŞ KAYITLARI (GİRİŞ KAPISI LOGU - PANO GÖRÜNÜMÜ) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Son Geçiş Akışları */}
                    <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm">
                      <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Son Kapı Tarama Geçişleri (Simüle):</span>
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                        {dbState?.attendance.slice().reverse().map(l => (
                          <div key={l.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                              <span className="font-bold text-slate-700">{l.studentName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {l.direction === "IN" ? (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-200">
                                  YURDA GİRDİ
                                </span>
                              ) : (
                                <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                                  YURTTAN ÇIKTI
                                </span>
                              )}
                              <span className="text-slate-400 font-mono text-[10px]">
                                {new Date(l.timestamp).toLocaleTimeString("tr-TR")}
                              </span>
                            </div>
                          </div>
                        ))}
                        {(!dbState?.attendance || dbState.attendance.length === 0) && (
                          <span className="text-xs text-slate-400 text-center block py-6">Kayıtlı giriş çıkış işlemi yok.</span>
                        )}
                      </div>
                    </div>

                    {/* Son Duyuru ve Haber Akışı */}
                    <div className="bg-white border border-slate-100 p-5 rounded-3xl space-y-3 shadow-sm">
                      <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Güncel İlanlar & Duyurular:</span>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {dbState?.announcements.slice().reverse().map(a => (
                          <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-800">{a.title}</span>
                              {getPriorityBadge(a.priority)}
                            </div>
                            <p className="text-xs text-slate-500">{a.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* SEKME: EV ARKADAŞI YAŞAM ANKETİ (ÖĞRENCİ FORM SEKMESİ) */}
              {activeTab === "apply" && currentUser.role === UserRole.STUDENT && (
                <div className="bg-white border border-slate-200 max-w-4xl mx-auto p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
                      <SlidersHorizontal className="text-teal-600 w-6 h-6" /> Kişisel Karakter ve Yaşam Anketi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Platform, burada belirteceğiniz yaşam alışkanlıklarını Gemini API üzerinden analiz ederek sizi en ideal oda arkadaşları ve oda ekosistemleri ile eşleştirir.
                    </p>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-6">
                    
                    {/* Soru Kümesi - İki Sütun */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Tercih Edilen Bina */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tercih Edilen Bina / Konsept:</label>
                        <select
                          value={prefDorm}
                          onChange={(e) => setPrefDorm(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-400 transition-all"
                        >
                          <option value="tenant-oakridge">Meşe Korusu Öğrenci Evi (Sakin, Geleneksel/Geniş)</option>
                          <option value="tenant-nexus">Siber Nexus Rezidansı (Akıllı Sistemler, Tekno-Sosyal)</option>
                          <option value="tenant-meadowview">Meadowview Yeşil Köyü (Doğa Dostu, Topluluk Bahçeleri)</option>
                        </select>
                      </div>

                      {/* Uyku Ritmi */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ritmik Uyku Düzeniniz:</label>
                        <select
                          value={sleepSchedule}
                          onChange={(e) => setSleepSchedule(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-400 transition-all"
                        >
                          <option value="early-bird">Erkenci Kuş (Erken Uyanır / Erken Uyur)</option>
                          <option value="night-owl">Gece Kuşu (Geç Saatte Etkin)</option>
                          <option value="irregular">Belirsiz / Değişken Uyku Sistemi</option>
                        </select>
                      </div>

                      {/* Temizlik Seviyesi (Slider) */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>TEMİZLİK VE TERTİP SEVİYESİ</span>
                          <span className="font-mono text-emerald-700">{cleanlinessLevel}/5</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Dağınıklık ve toz tahammülsüzlüğünüz nedir?</p>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={cleanlinessLevel}
                          onChange={(e) => setCleanlinessLevel(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>

                      {/* Gürültü toleransı */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>GÜRÜLTÜ TOLERANSINIZ</span>
                          <span className="font-mono text-[#2c5282]">{noiseTolerance}/5</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Oda içinde müzik, konuşma veya çevre seslerine hassasiyet.</p>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={noiseTolerance}
                          onChange={(e) => setNoiseTolerance(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>

                      {/* Sosyalleşme Seviyesi */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>MİSAFİR VE SOSYAL ETKİNLİK DÜZEYİ</span>
                          <span className="font-mono text-indigo-700">{socialLevel}/5</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Odanıza yeni insanların girmesi ve sohbet eğilimi.</p>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={socialLevel}
                          onChange={(e) => setSocialLevel(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>

                      {/* Introvert/Extrovert */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>İÇE DÖNÜK - DIŞA DÖNÜK MATRİS</span>
                          <span className="font-mono text-[#975a16]">{introvertExtrovert}/5</span>
                        </div>
                        <p className="text-[10px] text-slate-500">(1: Kendi halinde sessizliği sever, 5: İnanılmaz sosyal ve hareketli)</p>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={introvertExtrovert}
                          onChange={(e) => setIntrovertExtrovert(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                        />
                      </div>

                      {/* Tütün Tercihi */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tütün / Sigara Alışkanlığı Toleransı:</label>
                        <select
                          value={smokingPreference}
                          onChange={(e) => setSmokingPreference(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-400"
                        >
                          <option value="non-smoker">Sigara İçilmeyen (Dumansız Hava Sahası Şart)</option>
                          <option value="smoker">Sigara İçilebilir / Fark etmez</option>
                          <option value="no-preference">Tercihim Yok</option>
                        </select>
                      </div>

                      {/* Oyun Alışkanlığı */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Konsol & Bilgisayar Oyunu Eğilimi:</label>
                        <select
                          value={gamingHabits}
                          onChange={(e) => setGamingHabits(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 focus:border-emerald-400"
                        >
                          <option value="none">Oyun Oynamam / Ses Çıkaran Sistem Yok</option>
                          <option value="occasional">Bazen Oynarım (Ortalama Düzeyde)</option>
                          <option value="frequent">Sık Oyuncuyum (Çift Ekran & Ekipman)</option>
                        </select>
                      </div>

                    </div>

                    {/* Özgür Tanıtım Metni */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Kendinizi Tanıtın ve Aradığınız Oda Arkadaşını Betimleyin:
                      </label>
                      <textarea
                        required
                        value={preferredRoommateType}
                        onChange={(e) => setPreferredRoommateType(e.target.value)}
                        className="w-full min-h-24 bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-400 font-display"
                        placeholder="Örn: Akşamları sessizce kitap okumayı severim. Sabahları erken kalktığımda oda arkadaşımı uyandırmamaya özen gösteririm."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#beebd9] text-[#1e463a] font-bold py-3.5 rounded-2xl hover:bg-[#a6dcb4] shadow-md transition-all active:scale-[0.99]"
                    >
                      Karakter Analiz Yaşam Matrisini Sisteme Gönder
                    </button>
                  </form>
                </div>
              )}

              {/* SEKME: BEKLEME BAŞVURULARI & GEMINI YAPAY ZEKA DESTEKLİ ATAMA (YÖNETİCİ SEKMESİ) */}
              {activeTab === "applications" && (currentUser.role === UserRole.DORM_ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                <div className="space-y-6">
                  <div className="border-b border-slate-150 pb-4">
                    <h3 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                      <Sparkles className="text-emerald-500 animate-pulse" /> Oda Bekleme Listesi & Karar Destek Ofisi
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Öğrencilerin doldurduğu yaşam anketlerini inceleyin, Gemini AI modeli ile davranışsal uyumluluk matrisi oluşturup öğrencileri en uyumlu odalara yönlendirin.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {dbState?.applications.map((app) => (
                      <div key={app.id} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                        
                        {/* Başvuru Üst Kısım */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-150 pb-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-slate-400">BAŞVURU ID: {app.id}</span>
                            <h4 className="text-lg font-black text-slate-800 tracking-tight mt-0.5">
                              {app.studentName} ({app.studentEmail})
                            </h4>
                          </div>
                          <div>
                            {getApplicationStatusBadge(app.status)}
                          </div>
                        </div>

                        {/* Anket Parametreleri Önizleme */}
                        <div className="bg-[#fcfdfd] border border-slate-100 p-4 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider block">BİNA TERCİHİ:</span>
                            <span className="text-slate-800 font-bold">{app.preferredTenantId === "tenant-nexus" ? "Siber Nexus" : "Meşe Korusu"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider block">UYKU DÜZENİ:</span>
                            <span className="text-slate-800 font-bold capitalize">{app.lifestyleForm.sleepSchedule}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider block">TEMİZLİK NOTU:</span>
                            <span className="text-slate-800 font-bold">{app.lifestyleForm.cleanlinessLevel} / 5</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase tracking-wider block">GÜRÜLTÜ TAHAH:</span>
                            <span className="text-slate-800 font-bold">{app.lifestyleForm.noiseTolerance} / 5</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">KİŞİSEL PORTRE BAÇE:</span>
                          <p className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{app.lifestyleForm.preferredRoommateType}"
                          </p>
                        </div>

                        {/* Yapay Zeka Karar Analiz Paneli */}
                        {app.status === ApplicationStatus.SUBMITTED && (
                          <div className="pt-3">
                            {runningAIAppId === app.id ? (
                              <div className="bg-[#f0f9fc] border border-blue-200 p-4 rounded-2xl space-y-2">
                                <div className="flex items-center gap-2">
                                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                                  <span className="text-sm font-bold text-blue-900 font-display">
                                    Gemini AI Karakter Vektör Matrisini Isıtıyor...
                                  </span>
                                </div>
                                <p className="text-xs text-blue-700 animate-pulse font-mono">{aiStep}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => runAIEngineMatching(app.id, app.preferredTenantId)}
                                className="inline-flex items-center gap-2 py-3 px-6 bg-[#beebd9] hover:bg-[#a5dbb2] text-[#1e463a] font-bold text-xs rounded-2xl transition-all shadow-sm"
                              >
                                <Sparkles className="w-4 h-4 text-emerald-700 animate-bounce" />
                                Gemini AI Karar Analizini Başlat
                              </button>
                            )}
                          </div>
                        )}

                        {/* Gemini Analiz Sonuçları ve Eşleşme Notları */}
                        {app.vector && (
                          <div className="bg-indigo-50/50 border border-indigo-200 p-5 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                                <Sparkles className="w-4 h-4 text-indigo-600" /> Gemini Davranışsal Karakter Vektör Analizi
                              </span>
                              <span className="text-xs text-indigo-700 font-bold">Analiz Puanları</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                {renderVectorBar("Disiplin Puanı", app.vector.discipline_score, "bg-green-500")}
                                {renderVectorBar("Sosyal Eğilim", app.vector.social_score, "bg-sky-500")}
                              </div>
                              <div>
                                {renderVectorBar("Temizlik Titizliği", app.vector.cleanliness_score, "bg-amber-500")}
                                {renderVectorBar("Gürültü Toleransı", app.vector.noise_tolerance, "bg-blue-500")}
                              </div>
                            </div>

                            {app.compatibilityLog && (
                              <div className="p-3 bg-white border border-indigo-200 rounded-xl space-y-2 text-xs">
                                <div className="flex justify-between items-center text-indigo-900 border-b border-indigo-100 pb-1.5">
                                  <span>Önerilen Oda Kimliği: <strong>Oda {app.suggestedRoomId}</strong></span>
                                  <span>Eşleşme Oranı: <strong>%{app.compatibilityLog.compatibilityScore}</strong></span>
                                </div>
                                <p className="text-slate-600 italic">"{app.compatibilityLog.matchingNotes}"</p>
                              </div>
                            )}

                            {app.status === ApplicationStatus.AI_MATCHED && app.suggestedRoomId && (
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => handleAssignConfirm(app.id, app.suggestedRoomId || "")}
                                  className="py-3 px-6 bg-[#beebd9] hover:bg-[#a3dbb1] text-[#1e463a] font-bold text-xs rounded-2xl transition-all shadow-sm"
                                >
                                  Önerilen Yerleştirmeyi Onayla & Faturayı Kes
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    ))}

                    {(!dbState?.applications || dbState.applications.length === 0) && (
                      <div className="p-8 bg-white border border-slate-150 rounded-3xl text-center text-slate-400">
                        Henüz sisteme girilmiş bekleme listesi başvurusu yok.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEKME: ODA ENVANTERİ (ODALAR LİSTESİ) */}
              {activeTab === "rooms" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                        <Building className="text-teal-600 w-6 h-6" /> Oda Doluluk ve Sakin Envanteri
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Binalardaki her bir odanın sakini, oda doluluğu, cinsiyet tercihleri ve Gemini tarafından hesaplanmış ortalama davranışsal değerleri.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dbState?.rooms
                      .filter(r => !selectedTenantFilter || r.tenantId === selectedTenantFilter)
                      .map((room) => (
                        <div key={room.id} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm relative">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <span className="text-lg font-black text-slate-800 font-display">Oda No: {room.roomNumber}</span>
                            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-600">
                              Kapasite: {room.occupancy} / {room.capacity} Dolu
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <p className="text-slate-500 font-bold">Sakinler Listesi:</p>
                            {room.residentIds.length > 0 ? (
                              <div className="space-y-2">
                                {dbState.users
                                  .filter(u => room.residentIds.includes(u.id))
                                  .map(res => (
                                    <div key={res.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                      <div>
                                        <span className="font-bold text-slate-800 block text-xs">{res.name}</span>
                                        <span className="text-[10px] text-slate-400 block font-mono">{res.email}</span>
                                      </div>
                                      {(currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.DORM_ADMIN) && (
                                        <button
                                          onClick={() => handleEvict(room.id, res.id)}
                                          className="p-1 px-2.5 bg-[#ffebeb] text-pastel-pink-dark border border-red-200 rounded-lg text-[10px] font-bold hover:bg-red-100 transition-colors"
                                        >
                                          Evden Çıkar
                                        </button>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 block italic py-2">Bu odada herhangi bir sakin bulunmamaktadır.</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SEKME: FATURALAR & LEDGER (ÖDEME) */}
              {activeTab === "payments" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-150 pb-4">
                    <h3 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                      <DollarSign className="text-teal-600 w-6 h-6" /> Finansal Hesap Defteri & Faturalandırma
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Öğrenci veya oda yöneticileri için yurt barınma ücretleri faturalama döngüsü ve ödeme dekont hareketleri.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {dbState?.payments
                      .filter(p => {
                        if (currentUser.role === UserRole.STUDENT) {
                          return p.studentId === currentUser.id;
                        } else {
                          return !selectedTenantFilter || p.tenantId === selectedTenantFilter;
                        }
                      })
                      .map((p) => (
                        <div key={p.id} className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shadow-sm">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Fatura No: {p.invoiceNumber}</span>
                            <h4 className="text-base font-black text-slate-800 font-display mt-0.5">
                              {p.studentName} - Aylık Konaklama Bedeli
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">Son Ödeme: {new Date(p.dueDate).toLocaleDateString("tr-TR")}</p>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <span className="text-xl font-black text-slate-900 font-display">{p.amount} ₺</span>
                            <div>
                              {p.status === "PAID" ? (
                                <span className="px-3.5 py-1.5 bg-[#f0fff4] text-green-700 font-bold rounded-xl text-xs border border-green-200">
                                  ÖDENDİ
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <span className="px-3.5 py-1.5 bg-[#fffaf0] text-amber-700 font-bold rounded-xl text-xs border border-amber-200 block text-center">
                                    ÖDENMEDİ
                                  </span>
                                  {currentUser.role === UserRole.STUDENT && (
                                    <button
                                      onClick={() => handlePayInvoice(p.id)}
                                      className="w-full bg-[#beebd9] text-[#1e463a] font-bold text-[10px] py-1 px-2 rounded hover:bg-[#aae1b7] border border-green-300 transition-all block text-center uppercase tracking-wider"
                                    >
                                      Şimdi Öde
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                    {(!dbState?.payments || dbState.payments.length === 0) && (
                      <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center text-slate-400">
                        Kayıtlı herhangi bir fatura bulunmamaktadır.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEKME: ARIZA & TAMİR BAKIM KUTUSU (MAINTENANCE) */}
              {activeTab === "maintenance" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-150 pb-4">
                    <h3 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                      <Wrench className="text-teal-600 w-6 h-6" /> Teknik Destek ve Arıza Bildirimleri
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Odadaki musluk sızıntısı, priz arızaları, tıkalı giderler veya mobilya deformasyonlarını anında yurt personeline rapor edin.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* ÖĞRENCİ EKLEME PANELİ */}
                    {currentUser.role === UserRole.STUDENT && (
                      <form onSubmit={handleAddMaintenance} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm h-fit">
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">YENİ DESTEK BİLDİRİMİ EKLE:</span>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Arızalı Başlık / Sorun Sınıfı:</label>
                          <input
                            type="text"
                            required
                            value={maintTitle}
                            onChange={(e) => setMaintTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-xs outline-none text-slate-800 focus:border-emerald-400"
                            placeholder="Örn: Banyo Musluğu Sızdırıyor"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Kategori:</label>
                            <select
                              value={maintCategory}
                              onChange={(e) => setMaintCategory(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-[10px] outline-none text-slate-800"
                            >
                              <option value="Plumbing">Sıhhi Tesisat</option>
                              <option value="Electrical">Elektrik</option>
                              <option value="HVAC">Isıtma/Havalandırma</option>
                              <option value="Furniture">Mobilya/Eşya</option>
                              <option value="Other">Diğer Teknik</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Aciliyet Hali:</label>
                            <select
                              value={maintUrgency}
                              onChange={(e) => setMaintUrgency(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-[10px] outline-none text-slate-800"
                            >
                              <option value="LOW">Düşük Tehlike</option>
                              <option value="MEDIUM">Orta Seviye</option>
                              <option value="HIGH">Kritik / Acil</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Arıza Detay Notları:</label>
                          <textarea
                            required
                            value={maintDesc}
                            onChange={(e) => setMaintDesc(e.target.value)}
                            className="w-full min-h-20 bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-xs outline-none text-slate-800 focus:border-emerald-400"
                            placeholder="Oda girişindeki banyo musluğu kapatılsa dahi altından sürekli zemine su sızması yapıyor."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#beebd9] text-[#1e463a] py-3 rounded-xl text-xs font-bold hover:bg-[#a6dcb4] shadow-sm transition-all"
                        >
                          Talebi Yurt Personeline Gönder
                        </button>
                      </form>
                    )}

                    {/* LİSTELEME VE GÖREVLİ ARABİRİMİ */}
                    <div className="lg:col-span-2 space-y-4">
                      {dbState?.maintenance
                        .filter(m => {
                          if (currentUser.role === UserRole.STUDENT) {
                            return m.studentId === currentUser.id;
                          } else {
                            return !selectedTenantFilter || m.tenantId === selectedTenantFilter;
                          }
                        })
                        .map((req) => (
                          <div key={req.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm relative">
                            
                            {/* Üst Kısım */}
                            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-slate-400">TICKET ID: {req.id}</span>
                                <h4 className="text-base font-black text-slate-800 tracking-tight mt-0.5">{req.title}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Bildiren Sakin: {req.studentName} | Oda No: {req.roomNumber}
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 items-end">
                                {getPriorityBadge(req.urgency)}
                                <span className="text-[11px] font-bold px-3 py-1 bg-slate-100 border border-slate-250 text-slate-700 rounded-full">
                                  {req.status === "COMPLETED" ? "TAMAMLANDI" : req.status === "IN_PROGRESS" ? "İŞLEMDE" : "BİLDRİLDİ"}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-display">"{req.description}"</p>

                            {/* Personel İnceleme Notları / Yorumları */}
                            {req.staffUpdate && (
                              <div className="p-3 bg-teal-50/50 border border-emerald-100 text-[#1e463a] rounded-2xl text-xs">
                                <strong>Görevli Güncellemesi:</strong> {req.staffUpdate}
                              </div>
                            )}

                            {/* Personel Yanıt Aksiyon Menüsü */}
                            {currentUser.role !== UserRole.STUDENT && req.status !== "COMPLETED" && (
                              <div className="flex gap-2 pt-2 border-t border-slate-100">
                                <button
                                  onClick={() => handleUpdateMaintenanceStatus(req.id, "IN_PROGRESS", "Tamir ekibi yola çıktı. Oda incelenecek.")}
                                  className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold rounded-lg text-xs"
                                >
                                  İşleme Al
                                </button>
                                <button
                                  onClick={() => handleUpdateMaintenanceStatus(req.id, "COMPLETED", "Ekip yerinde müdahale etti, sorun kalıcı olarak çözüldü.")}
                                  className="py-1.5 px-3 bg-[#f0fff4] hover:bg-emerald-100 border border-green-200 text-green-700 font-bold rounded-lg text-xs"
                                >
                                  Tamamla
                                </button>
                              </div>
                            )}

                          </div>
                        ))}

                      {(!dbState?.maintenance || dbState.maintenance.length === 0) && (
                        <div className="p-8 bg-slate-50 border border-slate-150 rounded-3xl text-center text-slate-400">
                          Kayıtlı herhangi bir teknik arıza bildirim talebi bulunmuyor.
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* SEKME: DUYURU VE DUYURU EKLEME PANOSU */}
              {activeTab === "announcements" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="border-b border-slate-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
                        <Bell className="text-teal-600 w-6 h-6 animate-pulse" /> Tüm Yurt Duyuruları ve İlanlar
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Sistem geneli ve seçili binaları ilgilendiren güncel güvenlik ve sosyal duyurular listesi.
                      </p>
                    </div>

                    {(currentUser.role === UserRole.DORM_ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                      <button
                        onClick={() => {
                          const formDiv = document.getElementById("add-ann-form");
                          if (formDiv) formDiv.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="py-2.5 px-4 bg-[#beebd9] text-[#1e463a] font-bold text-xs rounded-xl"
                      >
                        Yeni Duyuru Yayınla
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {dbState?.announcements.slice().reverse().map((a) => (
                      <div key={a.id} className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono">DUYURU ID: {a.id}</span>
                            <h4 className="text-lg font-black text-slate-800 font-display mt-0.5">{a.title}</h4>
                          </div>
                          {getPriorityBadge(a.priority)}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{a.content}</p>
                      </div>
                    ))}

                    {/* YÖNETİCİ DUYURU POSTALAMA FORMU */}
                    {(currentUser.role === UserRole.DORM_ADMIN || currentUser.role === UserRole.SUPER_ADMIN) && (
                      <form id="add-ann-form" onSubmit={handlePostAnnouncement} className="bg-white border-2 border-slate-250 p-6 rounded-3xl space-y-4 shadow-sm scroll-mt-24">
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">YENİ DUYURU BİLGİ KARTI:</span>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Duyuru Başlığı:</label>
                          <input
                            type="text"
                            required
                            value={annTitle}
                            onChange={(e) => setAnnTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs outline-none text-slate-800"
                            placeholder="Örn: Sıcak Su Kesintisi Duyurusu"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Duyuru Önceliği:</label>
                            <select
                              value={annPriority}
                              onChange={(e) => setAnnPriority(e.target.value as any)}
                              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs outline-none text-slate-800"
                            >
                              <option value="LOW">Düşük Seviye / Sosyal</option>
                              <option value="MEDIUM">Orta Seviye</option>
                              <option value="HIGH">Önemli / Kritik Tehlike</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Hedeflenen Rol Kapsamı:</label>
                            <select
                              value={annTargetRole}
                              onChange={(e) => setAnnTargetRole(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl text-xs outline-none text-slate-800"
                            >
                              <option value="ALL">Herkes Okuyabilir</option>
                              <option value="STUDENT">Yalnızca Öğrenciler</option>
                              <option value="STAFF">Yalnızca Yurt Personelleri</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Duyuru Ana İçeriği:</label>
                          <textarea
                            required
                            value={annContent}
                            onChange={(e) => setAnnContent(e.target.value)}
                            className="w-full min-h-24 bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-xs outline-none text-slate-800"
                            placeholder="Örn: 21 Mayıs Perşembe gecesi saat 02:00-04:00 saatleri arasında hidrofor bakımı sebebiyle binamızda sıcak su kesintisi olacaktır."
                          />
                        </div>

                        <button
                          type="submit"
                          className="py-3 px-6 bg-[#beebd9] hover:bg-[#a9deb8] text-[#1e463a] font-bold text-xs rounded-xl"
                        >
                          Duyuruyu Yayınla
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* SEKME: RFID GEÇİŞ VE QR KAPI SIMÜLASYONU */}
              {activeTab === "attendance" && (
                <div className="bg-white border border-slate-200 max-w-4xl mx-auto p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-2xl font-black text-slate-900 font-display flex items-center gap-2">
                      <QrCode className="text-teal-600 w-6 h-6" /> Akıllı Kapı Giriş-Çıkış QR Simülatörü
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Öğrenci kimliğinize ait QR-Okuyucu sistemini simüle ederek mobil cihazla yurda giriş veya çıkış yapma kaydı oluşturun. Bu sayede yurt güvenliğindeki RFID sistemlerine anlık veri iletilir.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* QR Grafik Simülasyonu */}
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                      
                      {/* Sahte QR Kodu Tasarımı */}
                      <div className="w-40 h-40 bg-white border-4 border-teal-200 p-2.5 rounded-3xl flex items-center justify-center relative shadow-sm">
                        <div className="grid grid-cols-4 gap-2 w-full h-full opacity-80">
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-slate-800 rounded"></div>
                          <div className="bg-white"></div>
                          <div className="bg-slate-800 rounded"></div>
                        </div>
                        <div className="absolute inset-0 m-auto w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-lg">
                          Y
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-teal-800 bg-[#e6f4f8] py-1 px-3.5 rounded-full border border-teal-200">
                          Değişken QR Şifreleme Sistem Aktif
                        </span>
                        <p className="text-[10px] text-slate-400 font-mono mt-2">Bina İple Entegrasyonu Kodlama Geçişi</p>
                      </div>
                    </div>

                    {/* Tetikleyici Aksiyon Butonları */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest font-mono">Giriş/Çıkış Hareketini Simüle Et:</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Aşağıdaki butonlara tıkladığınızda mobil cihazınızın yurt ana girişindeki optik kamera terminaline okutulduğu varsayılır. Bu işlem yoklama veritabanını günceller.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleLogAttendanceGate(currentUser.id, "IN")}
                          className="py-3 px-4 bg-[#f0fff4] hover:bg-emerald-100 text-green-800 font-bold border border-green-200 rounded-2xl text-xs transition-all active:scale-95 shadow-sm"
                        >
                          Kapıdan GİRİŞ Yapıldı
                        </button>
                        <button
                          onClick={() => handleLogAttendanceGate(currentUser.id, "OUT")}
                          className="py-3 px-4 bg-[#fffaf0] hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 rounded-2xl text-xs transition-all active:scale-95 shadow-sm"
                        >
                          Kapıdan ÇIKIŞ Yapıldı
                        </button>
                      </div>

                      {/* Bilgilendirici Not Kutusu */}
                      <div className="p-3 bg-blue-50/50 border border-blue-150 rounded-2xl text-[10px] text-[#2c5282] leading-relaxed">
                        *Güvenlik standartları gereğince kapı geçiş log kayıtları eş zamanlı olarak yurt idare heyeti paneline ("Ziyaretçi Giriş Akışı" sekmesine) düşer.
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* FOOTER BİLGİ ALANI */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>YurtApp © 2026 - Tüm Hakları Saklıdır.</span>
        <span>Aesthetic Pastel Light-Mode Entegrasyonu</span>
      </footer>

    </div>
  );
}
