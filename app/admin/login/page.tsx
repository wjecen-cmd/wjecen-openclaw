"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 设备检测
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 打字机效果
  const words = ["Admin", "Dashboard", "Control", "Manage"];
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

  const handleLogin = async () => {
    if (!username || !password) {
      setError("请输入账号和密码");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // TODO: 替换为实际的后台登录 API
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.code === 200) {
        localStorage.setItem("admin_token", data.data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.data.user));
        router.push("/admin");
      } else {
        setError(data.message || "登录失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  // ==================== PC端布局 ====================
  if (!isMobile) {
    return (
      <div className="fixed inset-0 flex">
        {/* 左侧 Logo 区域 - 深色背景 */}
        <div className="w-1/2 bg-[#0A0A0A] flex flex-col items-center justify-center">
          <div className="flex items-end gap-3">
            <span className="text-white font-semibold text-[180px] tracking-[0.02em] leading-none select-none">
              JT<span className="text-neutral-600">.</span>
            </span>
            <span className="text-neutral-500 font-medium text-5xl pb-1 transition-opacity duration-300">{currentWord}<span className="animate-blink">|</span></span>
          </div>
          <p className="text-neutral-600 text-lg mt-12">管理员平台</p>
        </div>

        {/* 右侧登录区域 */}
        <div className="w-1/2 bg-white flex items-center justify-center p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">管理员登录</h2>
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="请输入账号" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="请输入密码" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center pt-2">
                <button 
                  onClick={handleLogin} 
                  disabled={loading} 
                  className="w-16 h-16 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full transition-all flex items-center justify-center relative"
                >
                  {loading ? (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                      <ArrowRight className="w-6 h-6" />
                    </>
                  ) : (
                    <ArrowRight className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
          .animate-blink { animation: blink 1s infinite; }
        `}</style>
      </div>
    );
  }

  // ==================== 移动端布局 ====================
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* 上部 Logo 区域 */}
      <div className="h-[40%] flex flex-col items-center justify-end pb-6 bg-[#0A0A0A]">
        <div className="flex items-baseline">
          <span className="text-white font-semibold text-5xl tracking-[0.02em] select-none">
            JT<span className="text-neutral-600">.</span>
          </span>
          <span className="text-neutral-500 font-medium text-2xl ml-3 h-8">{currentWord}<span className="animate-blink">|</span></span>
        </div>
        <p className="text-neutral-600 text-sm mt-3">管理员平台</p>
      </div>

      {/* 下部登录区域 */}
      <div className="flex-1 flex flex-col p-6">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* 标题和错误提示同一行 */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">管理员登录</h2>
            {error && <p className="text-xs text-red-500 text-center flex-1 mr-12">{error}</p>}
          </div>

          {/* 输入框 */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="请输入账号" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="请输入密码" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* 登录按钮 */}
            <div className="flex justify-center pt-2">
              <button 
                onClick={handleLogin} 
                disabled={loading} 
                className="w-14 h-14 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full transition-all flex items-center justify-center relative"
              >
                {loading ? (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </div>
  );
}