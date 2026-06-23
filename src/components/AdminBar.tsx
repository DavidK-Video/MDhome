import { useState } from 'react';
import {
  Save, Image as ImageIcon, Type, LogOut, ChevronDown, ChevronUp,
  ShieldAlert, Newspaper, Users, Briefcase, Eye, EyeOff, Download,
  Trash2, Plus, ExternalLink, BarChart3, Settings, Bell, Globe
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface Lead {
  id: string; name: string; phone: string;
  email?: string; source: string; details: string; date: string;
}
interface Position { title: string; qty: string; salary: string; exp: string; type: string; desc: string; benefits: string[]; }
interface NewsArticle { id: string; title: string; date: string; desc: string; image: string; content: string; tag: string; }

interface AdminBarProps {
  onClose: () => void;
  setEditText: (val: boolean) => void;
  setEditImages: (val: boolean) => void;
  leads: Lead[];
  onDeleteLead: (id: string) => void;
  onExportCSV: () => void;
  positions: Position[];
  onDeleteJob: (idx: number) => void;
  onAddJob: (job: Position) => void;
  hiddenTabs: string[];
  onToggleTab: (tab: string) => void;
  allTabs: string[];
  customNews: NewsArticle[];
  onAddNews: (article: NewsArticle) => void;
  onDeleteNews: (id: string) => void;
  leadSearchTerm: string;
  setLeadSearchTerm: (v: string) => void;
  isEditingText: boolean;
  isEditingImages: boolean;
}

// ─── Shared input style ───────────────────────────────────────
const inp = "bg-white border border-slate-200 rounded-xl p-2.5 text-xs w-full focus:outline-none focus:border-[#c9a227] font-sans font-semibold text-slate-700 shadow-sm transition";
const label = "block text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1";
const sectionCard = "bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4";

// ─── Section header ───────────────────────────────────────────
function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <h4 className="font-extrabold text-[#1a3c6e] text-sm uppercase flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h4>
      {sub && <p className="text-[11px] text-slate-400 font-sans mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Tab pill ─────────────────────────────────────────────────
function NavTab({ id, icon, label, active, onClick }: { id: string; icon: any; label: string; active: boolean; onClick: () => void }) {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
        active
          ? 'bg-[#1a3c6e] text-white shadow-md'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

export default function AdminBar({
  onClose, setEditText, setEditImages,
  leads, onDeleteLead, onExportCSV,
  positions, onDeleteJob, onAddJob,
  hiddenTabs, onToggleTab, allTabs,
  customNews, onAddNews, onDeleteNews,
  leadSearchTerm, setLeadSearchTerm,
  isEditingText, isEditingImages,
}: AdminBarProps) {

  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'leads' | 'news' | 'jobs' | 'settings'>('dashboard');

  // ── New Job form state ──
  const [jobTitle, setJobTitle] = useState('');
  const [jobQty, setJobQty]     = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobExp, setJobExp]     = useState('');
  const [jobType, setJobType]   = useState('Toàn thời gian');
  const [jobDesc, setJobDesc]   = useState('');
  const [jobBenefits, setJobBenefits] = useState('');

  // ── New News form state ──
  const [newsTitle, setNewsTitle]   = useState('');
  const [newsDate, setNewsDate]     = useState(new Date().toLocaleDateString('vi-VN'));
  const [newsDesc, setNewsDesc]     = useState('');
  const [newsImage, setNewsImage]   = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsTag, setNewsTag]       = useState('Tin Dự Án');

  // ── Stats ──
  const today = new Date().toLocaleDateString('vi-VN');
  const leadsToday   = leads.filter(l => l.date?.startsWith(today.split('/').reverse().join('/')
    .slice(0,5)) || l.date?.includes(today)).length;
  const leadsFromForm = leads.filter(l => l.source !== 'Trợ Lý AI Chatbot').length;
  const leadsFromAI  = leads.filter(l => l.source === 'Trợ Lý AI Chatbot').length;

  const filteredLeads = leads.filter(l => {
    const s = leadSearchTerm.toLowerCase();
    return (
      l.name?.toLowerCase().includes(s) ||
      l.phone?.includes(s) ||
      l.source?.toLowerCase().includes(s) ||
      l.details?.toLowerCase().includes(s)
    );
  });

  // ── Handlers ──
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobQty || !jobSalary) { alert('Vui lòng điền đủ Tên vị trí, Số lượng, Mức lương!'); return; }
    onAddJob({
      title: jobTitle, qty: jobQty, salary: jobSalary,
      exp: jobExp || 'Không yêu cầu', type: jobType,
      desc: jobDesc || 'Trao đổi trực tiếp trong buổi phỏng vấn.',
      benefits: jobBenefits ? jobBenefits.split(',').map(b => b.trim()).filter(Boolean)
        : ['Đào tạo bài bản', 'Hoa hồng hấp dẫn', 'Môi trường trẻ trung'],
    });
    setJobTitle(''); setJobQty(''); setJobSalary(''); setJobExp(''); setJobDesc(''); setJobBenefits('');
    alert('✅ Đã đăng tin tuyển dụng mới thành công!');
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsDesc) { alert('Vui lòng điền đủ Tiêu đề và Tóm tắt!'); return; }
    onAddNews({
      id: 'news_' + Date.now(),
      title: newsTitle, date: newsDate, desc: newsDesc,
      image: newsImage || 'https://images.unsplash.com/photo-1560520653-9e0e4c8952d7?w=800&q=80',
      content: newsContent, tag: newsTag,
    });
    setNewsTitle(''); setNewsDate(new Date().toLocaleDateString('vi-VN'));
    setNewsDesc(''); setNewsImage(''); setNewsContent(''); setNewsTag('Tin Dự Án');
    alert('✅ Đã đăng bài viết mới lên mục Tin Tức!');
  };

  const SHEET_ID = '1RihHFmMVFbncctAWoDTe3c0Y_CVV5CDRqDCHRD0FIg0';
  const quickLinks = [
    { label: 'Google Sheet CRM', url: `https://docs.google.com/spreadsheets/d/${SHEET_ID}`, icon: '📊' },
    { label: 'Apps Script', url: 'https://script.google.com', icon: '⚙️' },
    { label: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', icon: '🚀' },
    { label: 'ImageKit Media', url: 'https://imagekit.io/dashboard', icon: '🖼️' },
    { label: 'Facebook Page', url: 'https://www.facebook.com/share/r/14hP2YMFLW1/', icon: '📘' },
    { label: 'Google AI Studio', url: 'https://aistudio.google.com', icon: '🤖' },
  ];

  // ── Section renderers ──────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tổng Khách', value: leads.length, color: 'text-[#1a3c6e]', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Hôm Nay', value: leadsToday, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Bài Tin Tức', value: customNews.length, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Vị Trí Tuyển', value: positions.length, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 flex flex-col gap-1 ${s.bg}`}>
            <span className="text-[10px] font-bold uppercase text-slate-400">{s.label}</span>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Quick edit toggles */}
      <div className={sectionCard}>
        <SectionTitle icon="✍️" title="Chỉnh Sửa Nhanh Giao Diện" sub="Bật/tắt chế độ sửa text & hình ảnh trực tiếp trên trang" />
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setEditText(!isEditingText)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase border transition cursor-pointer ${
              isEditingText ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50'
            }`}
          >
            <Type size={14} /> {isEditingText ? '✓ Đang sửa Text – Nhấn tắt' : 'Bật sửa Text trực tiếp'}
          </button>
          <button
            onClick={() => setEditImages(!isEditingImages)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase border transition cursor-pointer ${
              isEditingImages ? 'bg-blue-500 text-white border-blue-400 shadow-md' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-blue-50'
            }`}
          >
            <ImageIcon size={14} /> {isEditingImages ? '✓ Đang sửa Ảnh – Nhấn tắt' : 'Bật sửa Ảnh trực tiếp'}
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className={sectionCard}>
        <SectionTitle icon="🔗" title="Truy Cập Nhanh Hệ Thống" sub="Các liên kết quản lý quan trọng – mở tab mới" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickLinks.map(link => (
            <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-50 hover:bg-[#1a3c6e] hover:text-white border border-slate-100 rounded-xl p-3 text-[11px] font-bold text-slate-700 transition-all group cursor-pointer"
            >
              <span className="text-base">{link.icon}</span>
              <span className="flex-1 truncate">{link.label}</span>
              <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Tab visibility */}
      <div className={sectionCard}>
        <SectionTitle icon="👁️" title="Ẩn / Hiện Mục Điều Hướng" sub="Chọn mục muốn ẩn khỏi người xem trên website" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {allTabs.map(tab => (
            <button key={tab} onClick={() => onToggleTab(tab)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-[11px] font-bold uppercase cursor-pointer transition-all ${
                hiddenTabs.includes(tab)
                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <span className="truncate">{tab}</span>
              {hiddenTabs.includes(tab) ? <EyeOff size={12} /> : <Eye size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Leads mini preview */}
      <div className={sectionCard}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <SectionTitle icon="📊" title={`Khách Mới Nhất (${leads.length} tổng)`} />
          <button onClick={() => setActiveSection('leads')}
            className="text-[11px] text-[#c9a227] font-bold hover:underline cursor-pointer"
          >Xem tất cả →</button>
        </div>
        <div className="space-y-2">
          {leads.slice(0, 5).map(l => (
            <div key={l.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1a3c6e]">{l.name}</span>
                <span className="text-emerald-700 font-semibold">{l.phone}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                l.source === 'Đăng Ký Mua' ? 'bg-blue-100 text-blue-700' :
                l.source === 'Tuyển Dụng' ? 'bg-amber-100 text-amber-700' :
                l.source === 'Liên Hệ' ? 'bg-indigo-100 text-indigo-700' :
                'bg-purple-100 text-purple-700'
              }`}>{l.source}</span>
            </div>
          ))}
          {leads.length === 0 && <p className="text-xs text-slate-400 text-center py-3">Chưa có khách đăng ký nào.</p>}
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <span className="text-sm">🔍</span>
        <input type="text" value={leadSearchTerm} onChange={e => setLeadSearchTerm(e.target.value)}
          placeholder="Tìm theo tên, SĐT, nguồn đăng ký..."
          className="bg-transparent text-xs w-full focus:outline-none placeholder-slate-400 font-sans text-slate-700"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-semibold">{filteredLeads.length} kết quả</span>
        <button onClick={onExportCSV}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase px-3 py-2 rounded-xl cursor-pointer transition"
        >
          <Download size={13} /> Xuất Excel / CSV
        </button>
      </div>
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 text-[#1a3c6e] text-[10px] uppercase font-black">
            <tr>
              {['Họ Tên', 'Số ĐT', 'Nguồn', 'Chi Tiết', 'Thời Gian', ''].map(h => (
                <th key={h} className="p-3 border-b border-slate-200 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold">Không tìm thấy dữ liệu.</td></tr>
            ) : filteredLeads.map(row => (
              <tr key={row.id} className="bg-white hover:bg-amber-50/50 border-b border-slate-100 font-sans transition">
                <td className="p-3 font-bold text-[#1a3c6e] whitespace-nowrap">{row.name}</td>
                <td className="p-3 text-emerald-700 font-bold whitespace-nowrap">{row.phone}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                    row.source === 'Đăng Ký Mua' ? 'bg-blue-100 text-blue-700' :
                    row.source === 'Tuyển Dụng' ? 'bg-amber-100 text-amber-700' :
                    row.source === 'Liên Hệ' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>{row.source}</span>
                </td>
                <td className="p-3 max-w-xs truncate text-slate-600" title={row.details}>{row.details}</td>
                <td className="p-3 text-slate-400 whitespace-nowrap">{row.date}</td>
                <td className="p-3 text-center">
                  <button onClick={() => { if (window.confirm('Xóa khách hàng này?')) onDeleteLead(row.id); }}
                    className="hover:bg-rose-600 hover:text-white border border-rose-200 text-rose-500 p-1.5 rounded-lg transition cursor-pointer"
                    title="Xóa"
                  ><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-5">
      {/* Existing news */}
      <div className={sectionCard}>
        <SectionTitle icon="📰" title={`Bài Viết Đã Đăng (${customNews.length})`} sub="Bài do admin thêm – hiển thị đầu tiên trong mục Tin Tức" />
        {customNews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4 border border-dashed rounded-xl">Chưa có bài viết nào. Đăng bài mới bên dưới!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customNews.map(article => (
              <div key={article.id} className="flex gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
                <img src={article.image} alt={article.title}
                  className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-200"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560520653-9e0e4c8952d7?w=200&q=60'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a3c6e] text-xs line-clamp-2 leading-snug">{article.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1">🗓️ {article.date} · <span className="bg-amber-100 text-amber-700 px-1 rounded">{article.tag}</span></p>
                </div>
                <button onClick={() => { if (window.confirm('Xóa bài viết này?')) onDeleteNews(article.id); }}
                  className="hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-100 p-1.5 rounded-lg h-fit cursor-pointer transition"
                ><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add news form */}
      <div className={sectionCard}>
        <SectionTitle icon="✏️" title="Đăng Bài Viết Mới" sub="Bài đăng sẽ xuất hiện ngay đầu mục Tin Tức trên website" />
        <form onSubmit={handleAddNews} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={label}>Tiêu đề bài viết *</label>
              <input type="text" value={newsTitle} onChange={e => setNewsTitle(e.target.value)}
                placeholder="VD: MD HOME SMART mở bán giai đoạn 2 – Cơ hội sở hữu nhà NOXH"
                className={inp} required />
            </div>
            <div>
              <label className={label}>Ngày đăng</label>
              <input type="text" value={newsDate} onChange={e => setNewsDate(e.target.value)}
                placeholder="VD: 23/06/2026" className={inp} />
            </div>
            <div>
              <label className={label}>Danh mục / Tag</label>
              <select value={newsTag} onChange={e => setNewsTag(e.target.value)} className={inp}>
                {['Tin Dự Án', 'Chính Sách', 'Pháp Lý', 'Thị Trường BĐS', 'Vay Vốn', 'Sự Kiện'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Link ảnh bìa (URL)</label>
              <input type="text" value={newsImage} onChange={e => setNewsImage(e.target.value)}
                placeholder="https://... (để trống sẽ dùng ảnh mặc định)"
                className={inp} />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Tóm tắt nội dung *</label>
              <textarea value={newsDesc} onChange={e => setNewsDesc(e.target.value)}
                placeholder="Viết 1–3 câu tóm tắt để hiển thị ở thẻ bài viết..."
                rows={2} className={inp} required />
            </div>
            <div className="sm:col-span-2">
              <label className={label}>Nội dung đầy đủ (xuống dòng để tách đoạn)</label>
              <textarea value={newsContent} onChange={e => setNewsContent(e.target.value)}
                placeholder={"Đoạn 1...\n\nĐoạn 2...\n\nĐoạn 3..."}
                rows={6} className={inp} />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 bg-[#1a3c6e] hover:bg-[#c9a227] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Đăng Bài Lên Website 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-5">
      {/* Current positions */}
      <div className={sectionCard}>
        <SectionTitle icon="💼" title={`Vị Trí Đang Tuyển (${positions.length})`} sub="Xóa hoặc thêm vị trí – cập nhật ngay lên tab Tuyển Dụng" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {positions.length === 0 ? (
            <p className="col-span-full text-xs text-slate-400 text-center py-4 border border-dashed rounded-xl">Chưa có vị trí nào đang đăng.</p>
          ) : positions.map((pos, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex justify-between items-start gap-3">
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-xs">{pos.title}</p>
                <div className="flex flex-wrap gap-1 text-[9px]">
                  <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">{pos.qty}</span>
                  <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">{pos.salary}</span>
                </div>
              </div>
              <button onClick={() => { if (window.confirm(`Xóa vị trí "${pos.title}"?`)) onDeleteJob(idx); }}
                className="hover:bg-rose-600 hover:text-white text-rose-400 border border-rose-100 p-1.5 rounded-lg cursor-pointer transition shrink-0"
              ><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Add job form */}
      <div className={sectionCard}>
        <SectionTitle icon="➕" title="Đăng Tin Tuyển Dụng Mới" />
        <form onSubmit={handleAddJob} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div><label className={label}>Tên vị trí *</label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                placeholder="VD: Chuyên viên tư vấn NOXH" className={inp} required /></div>
            <div><label className={label}>Số lượng *</label>
              <input type="text" value={jobQty} onChange={e => setJobQty(e.target.value)}
                placeholder="VD: 05 nhân sự" className={inp} required /></div>
            <div><label className={label}>Mức lương *</label>
              <input type="text" value={jobSalary} onChange={e => setJobSalary(e.target.value)}
                placeholder="VD: 8–20 triệu/tháng" className={inp} required /></div>
            <div><label className={label}>Yêu cầu kinh nghiệm</label>
              <input type="text" value={jobExp} onChange={e => setJobExp(e.target.value)}
                placeholder="VD: Không yêu cầu" className={inp} /></div>
            <div><label className={label}>Hình thức</label>
              <select value={jobType} onChange={e => setJobType(e.target.value)} className={inp}>
                {['Toàn thời gian', 'Bán thời gian', 'CTV / Tự do', 'Thực tập sinh'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div><label className={label}>Quyền lợi (cách bằng dấu phẩy)</label>
              <input type="text" value={jobBenefits} onChange={e => setJobBenefits(e.target.value)}
                placeholder="VD: Thưởng nóng, Du lịch, Đào tạo" className={inp} /></div>
          </div>
          <div><label className={label}>Mô tả công việc</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Mô tả ngắn gọn về công việc và yêu cầu..."
              rows={2} className={inp} />
          </div>
          <div className="flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 bg-[#1a3c6e] hover:bg-[#c9a227] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer"
            >
              <Plus size={14} /> Đăng Tin Tuyển Dụng 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const SECTIONS = [
    { id: 'dashboard', icon: BarChart3, label: 'Tổng Quan' },
    { id: 'leads',     icon: Users,     label: `Khách (${leads.length})` },
    { id: 'news',      icon: Newspaper, label: 'Tin Tức' },
    { id: 'jobs',      icon: Briefcase, label: 'Tuyển Dụng' },
  ] as const;

  return (
    <div className={`fixed bottom-0 left-0 w-full z-[1000] transition-all duration-300 font-sans shadow-[0_-8px_40px_rgba(0,0,0,0.3)] ${isMinimized ? 'translate-y-[calc(100%-44px)]' : 'translate-y-0'}`}>

      {/* ── Top handle bar ── */}
      <div className="bg-slate-900 border-t border-slate-700/60 h-11 px-4 flex justify-between items-center select-none">
        <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
          <ShieldAlert size={14} className="animate-pulse" />
          <span>ADMIN – MD HOME SMART</span>
          <span className="text-slate-600 font-normal">|</span>
          <span className="text-slate-400 font-semibold text-[11px]">Phố Hiến – Hưng Yên</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)}
            className="flex items-center gap-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition"
          >
            {isMinimized ? <><ChevronUp size={13}/> Mở rộng</> : <><ChevronDown size={13}/> Thu nhỏ</>}
          </button>
          <button onClick={onClose}
            className="flex items-center gap-1 text-rose-400 hover:text-white bg-rose-900/40 hover:bg-rose-700 px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition"
          >
            <LogOut size={13}/> Đăng xuất
          </button>
        </div>
      </div>

      {/* ── Main panel ── */}
      <div className="bg-slate-950/98 backdrop-blur-md border-t border-slate-800">
        {/* Nav tabs */}
        <div className="px-4 pt-3 flex items-center gap-2 overflow-x-auto pb-0 scrollbar-hide">
          {SECTIONS.map(s => (
            <NavTab key={s.id} id={s.id} icon={s.icon} label={s.label}
              active={activeSection === s.id}
              onClick={() => setActiveSection(s.id as any)}
            />
          ))}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => { alert('✓ Tất cả thay đổi đã được lưu tự động!'); }}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] uppercase px-3 py-2 rounded-xl cursor-pointer transition"
            >
              <Save size={13}/> Lưu
            </button>
          </div>
        </div>

        {/* Content area – scrollable */}
        <div className="px-4 py-4 max-h-[50vh] overflow-y-auto">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'leads'     && renderLeads()}
          {activeSection === 'news'      && renderNews()}
          {activeSection === 'jobs'      && renderJobs()}
        </div>
      </div>
    </div>
  );
}
