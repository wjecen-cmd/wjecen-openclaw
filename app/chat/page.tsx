"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  LayoutGrid,
  Monitor,
  ShoppingBag,
  Plus,
  ChevronRight,
  Send,
  Loader2,
  LogOut,
  Sparkles,
  Menu,
  X,
  Bot,
  Server,
  Globe,
  Clock,
  Activity,
  AlertTriangle,
  Sliders,
  Code,
  Zap,
  Shield,
  Trash2,
  Copy,
  Play,
  Pause,
  CheckCircle2,
  Search,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ============ 菜单配置 ============
const menuItems = [
  { id: "chat", name: "对话", icon: MessageSquare },
  { id: "agent", name: "Agent", icon: Bot },
  { id: "workflow", name: "工作流", icon: LayoutGrid },
  { id: "monitor", name: "监测大屏", icon: Monitor },
  { id: "shop", name: "API 商城", icon: ShoppingBag },
];

// ============ 数据 ============
const agentTemplates = [
  { id: 1, name: "代码助手", description: "精通多种编程语言", icon: Code },
  { id: 2, name: "创意写作", description: "文案创作和内容优化", icon: MessageSquare },
  { id: 3, name: "效率专家", description: "规划任务、优化流程", icon: Zap },
  { id: 4, name: "安全顾问", description: "安全分析、漏洞检测", icon: Shield },
];

const sampleWorkflows = [
  { id: 1, name: "自动翻译流程", description: "自动翻译输入文本并保存结果", status: "active", runs: 128, lastRun: "2小时前" },
  { id: 2, name: "数据同步", description: "定时同步数据库到备份服务器", status: "paused", runs: 45, lastRun: "1天前" },
  { id: 3, name: "内容审核", description: "自动审核用户生成内容", status: "active", runs: 1024, lastRun: "5分钟前" },
];

const servers = [
  { id: 1, name: "主服务器", ip: "106.54.204.161", status: "online", cpu: 45, memory: 62, disk: 58 },
  { id: 2, name: "备份服务器", ip: "192.168.1.100", status: "online", cpu: 12, memory: 34, disk: 45 },
  { id: 3, name: "测试服务器", ip: "192.168.1.101", status: "offline", cpu: 0, memory: 0, disk: 0 },
];

const domains = [
  { id: 1, name: "wjecen.vip", status: "active", ssl: "valid", expiry: "2025-03-24" },
  { id: 2, name: "admin.wjecen.vip", status: "active", ssl: "valid", expiry: "2025-03-24" },
  { id: 3, name: "api.wjecen.vip", status: "warning", ssl: "expiring", expiry: "2024-04-15" },
];

const products = [
  { id: 1, name: "GPT-4 Turbo", description: "最强大的语言模型", category: "ai", price: 0.03, unit: "/1K tokens", rating: 4.9, users: "10万+", icon: "🤖", popular: true },
  { id: 2, name: "Claude 3 Opus", description: "擅长复杂推理", category: "ai", price: 0.015, unit: "/1K tokens", rating: 4.8, users: "8万+", icon: "🧠", popular: true },
  { id: 3, name: "通义千问 Plus", description: "中文理解优秀", category: "ai", price: 0.004, unit: "/1K tokens", rating: 4.7, users: "15万+", icon: "🌟", popular: false },
  { id: 4, name: "图片生成 API", description: "支持 DALL-E 3", category: "tools", price: 0.02, unit: "/张", rating: 4.8, users: "5万+", icon: "🎨", popular: true },
  { id: 5, name: "语音识别 API", description: "多语言语音转文字", category: "tools", price: 0.001, unit: "/秒", rating: 4.7, users: "3万+", icon: "🎤", popular: false },
];

// 长期计划菜单项
const planItems = [
  { id: "agent-settings", name: "Agent 设置", icon: Sliders },
  { id: "projects", name: "项目进度", icon: LayoutGrid },
  { id: "history", name: "历史对话", icon: Clock },
];

// ============ 主组件 ============
export default function ChatPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 打字机效果
  const words = ["SMART", "Prompt", "Monitor", "Shop", "Workflow", "Culture"];
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentWord.length < word.length) {
          setCurrentWord(word.slice(0, currentWord.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentWord.length > 0) {
          setCurrentWord(currentWord.slice(0, -1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 80 : 150);
    return () => clearTimeout(timeout);
  }, [currentWord, isDeleting, wordIndex]);

  // 对话状态
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string; timestamp: Date }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 商城状态
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 监测状态
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    const checkWidth = () => setSidebarOpen(window.innerWidth >= 1024);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "这是一个示例回复。", timestamp: new Date() }]);
      setIsLoading(false);
    }, 1000);
  };

  if (authLoading || !user) {
    return <div className="h-screen bg-white flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-neutral-300" /></div>;
  }

  // ============ 右侧内容渲染 ============
  const renderContent = () => {
    switch (activeMenu) {
      case "chat":
        return (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-medium text-neutral-900">对话</h1>
                {messages.length > 0 && <button onClick={() => setMessages([])} className="text-xs text-neutral-400 hover:text-neutral-600">清空对话</button>}
              </div>
              <select className="text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-600 focus:outline-none">
                <option>通义千问</option>
                <option>GPT-4</option>
              </select>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-2xl mx-auto">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6"><Sparkles className="w-8 h-8 text-neutral-300" /></div>
                    <h2 className="text-xl font-medium text-neutral-900 mb-2">你好，有什么可以帮您？</h2>
                    <p className="text-neutral-400 text-sm mb-8">我是 JT.SMART AI 助手</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["帮我写代码", "翻译这段话", "解释概念"].map((s) => (
                        <button key={s} onClick={() => setInput(s)} className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-600 hover:bg-neutral-100">{s}</button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-lg px-5 py-3 rounded-2xl ${msg.role === "user" ? "bg-neutral-900 text-white rounded-br-md" : "bg-neutral-100 text-neutral-900 rounded-bl-md"}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && <div className="flex justify-start"><div className="px-5 py-3 bg-neutral-100 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin text-neutral-400" /></div></div>}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100">
              <div className="max-w-2xl mx-auto flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
                  placeholder="输入您的消息..."
                  className="flex-1 px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-300"
                />
                <button onClick={handleSend} disabled={!input.trim() || isLoading} className="px-6 py-4 bg-neutral-900 text-white rounded-xl disabled:bg-neutral-200"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        );

      case "agent":
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-14 border-b border-neutral-100 flex items-center px-6"><h1 className="text-sm font-medium text-neutral-900">Agent 设置</h1></div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-base font-medium text-neutral-900 mb-4">快速创建</h2>
                <div className="grid grid-cols-2 gap-4">
                  {agentTemplates.map((t) => (
                    <button key={t.id} className="flex items-start gap-4 p-5 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all text-left">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center"><t.icon className="w-6 h-6 text-white" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                        <p className="text-xs text-neutral-500 mt-1">{t.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "workflow":
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
              <h1 className="text-sm font-medium text-neutral-900">工作流</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" />新建</button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                    <div><p className="text-2xl font-bold text-neutral-900">{sampleWorkflows.filter(w => w.status === 'active').length}</p><p className="text-xs text-neutral-400">运行中</p></div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center"><Pause className="w-5 h-5 text-neutral-500" /></div>
                    <div><p className="text-2xl font-bold text-neutral-900">{sampleWorkflows.filter(w => w.status === 'paused').length}</p><p className="text-xs text-neutral-400">已暂停</p></div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
                    <div><p className="text-2xl font-bold text-neutral-900">{sampleWorkflows.reduce((s, w) => s + w.runs, 0)}</p><p className="text-xs text-neutral-400">总执行</p></div>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl">
                  {sampleWorkflows.map((w, i) => (
                    <div key={w.id} className={`flex items-center justify-between px-5 py-4 ${i < sampleWorkflows.length - 1 ? 'border-b border-neutral-100' : ''} hover:bg-neutral-50`}>
                      <div><p className="text-sm font-medium text-neutral-900">{w.name}</p><p className="text-xs text-neutral-400">{w.description}</p></div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded text-xs ${w.status === 'active' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{w.status === 'active' ? '运行中' : '已暂停'}</span>
                        <span className="text-sm text-neutral-400">{w.runs}次</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "monitor":
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
              <h1 className="text-sm font-medium text-neutral-900">监测大屏</h1>
              <div className="flex items-center gap-2 text-neutral-400 text-sm"><Clock className="w-4 h-4" />{time.toLocaleTimeString("zh-CN")}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center justify-between">
                    <div><p className="text-xs text-neutral-400">在线服务器</p><p className="text-2xl font-bold text-neutral-900 mt-2">{servers.filter(s => s.status === 'online').length}</p></div>
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><Server className="w-5 h-5 text-white" /></div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center justify-between">
                    <div><p className="text-xs text-neutral-400">域名总数</p><p className="text-2xl font-bold text-neutral-900 mt-2">{domains.length}</p></div>
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><Globe className="w-5 h-5 text-white" /></div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center justify-between">
                    <div><p className="text-xs text-neutral-400">告警数量</p><p className="text-2xl font-bold text-neutral-900 mt-2">2</p></div>
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-white" /></div>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 flex items-center justify-between">
                    <div><p className="text-xs text-neutral-400">平均响应</p><p className="text-2xl font-bold text-neutral-900 mt-2">48ms</p></div>
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-neutral-100"><h2 className="text-sm font-medium text-neutral-900">服务器状态</h2></div>
                    {servers.map((s, i) => (
                      <div key={s.id} className={`px-5 py-4 ${i < servers.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${s.status === 'online' ? 'bg-neutral-900' : 'bg-neutral-300'}`} />
                          <div><p className="text-sm font-medium text-neutral-900">{s.name}</p><p className="text-xs text-neutral-400">{s.ip}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-neutral-100"><h2 className="text-sm font-medium text-neutral-900">域名监控</h2></div>
                    {domains.map((d, i) => (
                      <div key={d.id} className={`px-5 py-4 flex items-center justify-between ${i < domains.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${d.status === 'active' ? 'bg-neutral-900' : 'bg-neutral-400'}`} />
                          <div><p className="text-sm font-medium text-neutral-900">{d.name}</p><p className="text-xs text-neutral-400">到期: {d.expiry}</p></div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600">SSL {d.ssl === 'valid' ? '有效' : '即将过期'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "shop":
        const filteredProducts = products.filter((p) => (activeCategory === "all" || p.category === activeCategory) && p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return (
          <div className="flex-1 flex flex-col">
            <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
              <h1 className="text-sm font-medium text-neutral-900">API 商城</h1>
              <div className="flex items-center gap-2"><span className="text-sm text-neutral-400">积分:</span><span className="text-sm font-medium text-neutral-900">{user?.points || 1000}</span></div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-4">
                <div className="max-w-5xl mx-auto">
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索 API..." className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    {categories.map((c) => (
                      <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === c.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 border border-neutral-200"}`}>{c.name}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="max-w-5xl mx-auto">
                  <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-all cursor-pointer group">
                        <div className="text-3xl mb-3">{p.icon}</div>
                        <h3 className="text-sm font-medium text-neutral-900 mb-1">{p.name}</h3>
                        <p className="text-xs text-neutral-500 mb-3">{p.description}</p>
                        <div className="flex items-center justify-between">
                          <div><span className="text-base font-bold text-neutral-900">¥{p.price}</span><span className="text-xs text-neutral-400 ml-1">{p.unit}</span></div>
                          <button className="opacity-0 group-hover:opacity-100 p-2 bg-neutral-900 text-white rounded-lg transition-all"><ArrowRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* 侧边栏 */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} transition-all duration-300 ease-in-out bg-neutral-50 border-r border-neutral-100 flex flex-col shrink-0 relative`}>
        {/* Logo - 始终显示 */}
        <div className="h-[72px] border-b border-neutral-100 flex items-center justify-center px-3">
          <div className={`flex items-baseline shrink-0 ${sidebarOpen ? "" : "mx-auto"}`}>
            <span className="text-neutral-900 font-bold text-xl tracking-tight">JT<span className="text-neutral-400">.</span></span>
            <span className={`ml-1 text-neutral-400 font-medium text-sm transition-all duration-300 ${sidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>{currentWord}<span className="animate-pulse">|</span></span>
          </div>
        </div>

        {/* 菜单 */}
        <nav className="py-2">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center h-12 ${sidebarOpen ? "px-4" : "px-3 justify-center"} transition-colors ${
                  activeMenu === item.id ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <div className={`ml-3 transition-all duration-300 ease-in-out ${sidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
                  <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                </div>
              </button>
              {/* 收起时悬停提示 */}
              {!sidebarOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-lg">
                  {item.name}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 长期计划 */}
        <div className="flex-1">
          {/* 展开时的长期计划 */}
          <div className={`transition-all duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible h-0"}`}>
            <div className="px-6 py-2 text-xs font-medium text-neutral-400">长期计划</div>
            <div>
              {planItems.map((item) => (
                <button key={item.id} className="w-full flex items-center h-11 px-6 text-neutral-500 hover:bg-neutral-100">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="ml-3 text-sm">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 收起时的长期计划图标 */}
          <div className={`transition-all duration-300 ${sidebarOpen ? "opacity-0 invisible h-0" : "opacity-100 visible"}`}>
            {planItems.map((item) => (
              <div key={item.id} className="relative group flex items-center justify-center">
                <button className="w-full h-12 flex items-center justify-center text-neutral-500 hover:bg-neutral-100">
                  <item.icon className="w-5 h-5" />
                </button>
                <div className="absolute left-full ml-3 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-lg">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 积分卡片 */}
        <div className={`transition-all duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible h-0"}`}>
          <div className="mx-4 mb-3 p-4 bg-neutral-900 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400">当前积分</p>
                <p className="text-xl font-bold text-white mt-1">{user.points || 1000}</p>
              </div>
              <div className="px-2 py-1 bg-neutral-800 rounded-lg">
                <span className="text-xs text-neutral-300">普通会员</span>
              </div>
            </div>
          </div>
        </div>

        {/* 用户信息 */}
        <div className="h-[72px] border-t border-neutral-100 flex items-center justify-center px-3">
          <div className={`relative group ${sidebarOpen ? "" : "flex justify-center w-full"}`}>
            <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-neutral-600">{user.nickname?.[0] || user.phone?.[0] || "U"}</span>
            </div>
            {!sidebarOpen && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] shadow-lg">
                {user.nickname || "用户"}
              </div>
            )}
          </div>
          <div className={`ml-3 flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 overflow-hidden"}`}>
            <p className="text-sm font-medium text-neutral-900 truncate">{user.nickname || "用户"}</p>
            <p className="text-xs text-neutral-400">{user.phone ? `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : "在线"}</p>
          </div>
          <button onClick={logout} className={`p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all ${sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 侧边栏切换 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-6 z-20 w-6 h-12 bg-white border border-neutral-100 rounded-r-xl flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all duration-300 ease-in-out"
        style={{ left: sidebarOpen ? "288px" : "64px" }}
      >
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 右侧内容 */}
      {renderContent()}
    </div>
  );
}