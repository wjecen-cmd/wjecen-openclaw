"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight, Check, X, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [loginType, setLoginType] = useState<"phone" | "qrcode">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(true); // 临时默认同意
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  // 二维码相关
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrExpired, setQrExpired] = useState(false);

  // 设备检测
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 打字机效果
  const words = ["Smart", "Prompt", "Monitor", "Shop", "Workflow", "Culture"];
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

  // 二维码生成
  useEffect(() => {
    if (loginType === "qrcode") {
      generateQRCode();
    }
  }, [loginType]);

  const generateQRCode = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&bgcolor=ffffff&color=1d1d1f&data=jt://login?session=${sessionId}&t=${timestamp}`);
    setQrExpired(false);
    
    // 60秒后过期
    setTimeout(() => setQrExpired(true), 60000);
  };

  const handleSendCode = async () => {
    if (countdown > 0 || !phone) return;
    setError("");
    try {
      const res = await fetch("https://admin.wjecen.vip/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.code === 200) {
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || "发送失败");
      }
    } catch {
      setError("网络错误");
    }
  };

  const handleLogin = async () => {
    if (!agreed) { setError("请先同意服务条款和隐私政策"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://admin.wjecen.vip/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.code === 200) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        router.push("/chat");
      } else {
        setError(data.message || "登录失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  // 弹窗组件
  const TermsModal = ({ type, onClose }: { type: "terms" | "privacy"; onClose: () => void }) => {
    const content = type === "terms" ? {
      title: "服务条款",
      sections: [
        { title: "一、服务说明", content: "JT.SMART 是由成都九藤文化传媒有限责任公司提供的 AI 智能工具平台服务。" },
        { title: "二、用户注册", content: "用户应按照注册页面提示完成注册流程，确保所填写的信息真实、准确、完整。" },
        { title: "三、使用规范", content: "用户在使用本平台服务时，不得发布、传输违法、有害内容。" },
        { title: "四、免责声明", content: "本平台 AI 生成内容仅供参考，不构成任何形式的建议或承诺。" },
      ]
    } : {
      title: "隐私政策",
      sections: [
        { title: "一、信息收集", content: "我们收集注册信息、使用信息、支付信息等。" },
        { title: "二、信息使用", content: "我们使用收集的信息用于提供、维护和改进我们的服务。" },
        { title: "三、信息保护", content: "我们采用业界标准的安全技术和管理措施保护用户信息。" },
        { title: "四、用户权利", content: "用户有权访问、更新、删除个人信息。" },
      ]
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-lg bg-white rounded-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h3 className="text-lg font-semibold text-neutral-900">{content.title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-neutral-600">
            {content.sections.map((s, i) => (
              <div key={i}>
                <h4 className="font-semibold text-neutral-900 mb-2">{s.title}</h4>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-neutral-100">
            <button onClick={() => { setAgreed(true); onClose(); }} className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-colors">同意</button>
          </div>
        </div>
      </div>
    );
  };

  // 第三方登录图标
  const SocialButtons = () => (
    <div className="flex items-center justify-center gap-4">
      {/* 微信 */}
      <button className="w-11 h-11 bg-[#07C160] rounded-full flex items-center justify-center transition-transform hover:scale-110">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.5 5.5C5.5 5.5 3 7.5 3 10c0 1.5.8 2.8 2 3.6L4.5 16l2.5-1.5c.5.1 1 .2 1.5.2.3 0 .6 0 .9-.1-.2-.6-.3-1.2-.3-1.9 0-3.1 2.8-5.6 6.2-5.6.3 0 .6 0 .9.1C15.5 6.1 12.3 5.5 8.5 5.5zm-2 4a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm4 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"/>
          <path d="M21 13.5c0-2.5-2.5-4.5-5.5-4.5S10 11 10 13.5s2.5 4.5 5.5 4.5c.6 0 1.1-.1 1.6-.2L19.5 19l-.7-1.8c1.3-.7 2.2-2 2.2-3.7zm-7-.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
        </svg>
      </button>
      {/* 支付宝 */}
      <button className="w-11 h-11 bg-[#1677FF] rounded-full flex items-center justify-center transition-transform hover:scale-110">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.422 15.358c-3.027-1.078-5.055-1.9-6.102-2.47.507-.897.932-1.915 1.255-3.038h-4.392v-1.17h5.34v-.96h-5.34V6h-2.07s.004.948 0 .96H5.107v.96h5.004v1.17H6.015v.96h7.726a13.5 13.5 0 0 1-.992 2.47c-1.76-.627-3.633-.968-5.457-.968-2.693 0-4.922 1.09-4.922 2.905 0 1.814 2.23 2.905 4.922 2.905 2.157 0 4.186-.737 5.8-2.003 2.417 1.18 6.03 2.662 6.03 2.662l2.3-2.408z"/>
        </svg>
      </button>
      {/* Apple */}
      <button className="w-11 h-11 bg-black rounded-full flex items-center justify-center transition-transform hover:scale-110">
        <svg className="w-[18px] h-[22px] text-white" viewBox="0 0 17 21" fill="currentColor">
          <path d="M15.5 16.25c-.7 1.1-1.45 2.1-2.6 2.12-1.15.02-1.52-.68-2.82-.68-1.3 0-1.7.66-2.78.7-1.12.04-1.97-1.12-2.68-2.22C2.85 14.37 1.65 10.05 3.6 7.1c.95-1.45 2.65-2.37 4.5-2.4 1.1-.02 2.15.75 2.82.75.67 0 1.93-.93 3.25-.79.55.02 2.1.22 3.1 1.7-.08.05-1.85 1.08-1.83 3.23.03 2.58 2.25 3.45 2.28 3.46-.02.06-.36 1.23-1.18 2.42zM11.47 3.35c.6-.72 1-1.72.9-2.72-.87.04-1.92.58-2.55 1.3-.56.65-1.05 1.68-.92 2.66.97.08 1.97-.49 2.57-1.24z"/>
        </svg>
      </button>
      {/* Google */}
      <button className="w-11 h-11 bg-white border border-neutral-200 rounded-full flex items-center justify-center transition-transform hover:scale-110 hover:border-neutral-300">
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </button>
      {/* GitHub */}
      <button className="w-11 h-11 bg-[#24292F] rounded-full flex items-center justify-center transition-transform hover:scale-110">
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      </button>
    </div>
  );

  // 同意条款组件
  const AgreementCheck = () => (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${agreed ? "bg-neutral-900 border-neutral-900" : "border-neutral-300 hover:border-neutral-400"}`}>
        {agreed && <Check className="w-3 h-3 text-white" />}
      </button>
      <p className="text-xs text-neutral-500">
        我已阅读并同意
        <button onClick={() => setShowTerms(true)} className="text-neutral-900 hover:underline">《服务条款》</button>
        和
        <button onClick={() => setShowPrivacy(true)} className="text-neutral-900 hover:underline">《隐私政策》</button>
      </p>
    </div>
  );

  // ==================== PC端布局 ====================
  if (!isMobile) {
    return (
      <div className="fixed inset-0 flex">
        {/* 左侧 Logo 区域 - 浅色背景 */}
        <div className="w-1/2 bg-gradient-to-r from-neutral-100 via-neutral-50 to-white flex flex-col items-center justify-center">
          <div className="flex items-end gap-3">
            <span className="text-neutral-900 font-semibold text-[180px] tracking-[0.02em] leading-none select-none">
              JT<span className="text-neutral-300">.</span>
            </span>
            <span className="text-neutral-400 font-medium text-5xl pb-1 transition-opacity duration-300">{currentWord}<span className="animate-blink">|</span></span>
          </div>
          <p className="text-neutral-400 text-lg mt-12">智能工具平台</p>
        </div>

        {/* 右侧登录区域 */}
        <div className="w-1/2 bg-white flex items-center justify-center p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">登录</h2>
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="flex bg-neutral-100 rounded-xl p-1">
                <button onClick={() => setLoginType("phone")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginType === "phone" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>手机号</button>
                <button onClick={() => setLoginType("qrcode")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginType === "qrcode" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>扫码</button>
              </div>

              {loginType === "phone" ? (
                <>
                  <div className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input type="tel" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" />
                    </div>
                    <div className="flex gap-3">
                      <input type="text" placeholder="验证码" value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 min-w-0 px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" />
                      <button onClick={handleSendCode} disabled={countdown > 0 || !phone} className="shrink-0 px-5 py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl disabled:bg-neutral-200 disabled:text-neutral-400 transition-all">{countdown > 0 ? `${countdown}s` : "获取"}</button>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <button onClick={handleLogin} disabled={loading} className="w-16 h-16 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full transition-all flex items-center justify-center relative">
                      {loading ? (<><div className="absolute inset-0 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" /><ArrowRight className="w-6 h-6" /></>) : (<ArrowRight className="w-6 h-6" />)}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <div className="relative">
                    {qrCodeUrl && <img src={qrCodeUrl} alt="登录二维码" className="w-44 h-44 rounded-xl" />}
                    {qrExpired && (
                      <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center">
                        <p className="text-sm text-neutral-500 mb-3">二维码已过期</p>
                        <button onClick={generateQRCode} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                          刷新
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-4 text-center">
                    打开 <span className="text-neutral-900 font-medium">JT. App</span> 扫码登录
                  </p>
                </div>
              )}
            </div>

            {/* 第三方登录 */}
            <div className="space-y-4 pt-4">
              <SocialButtons />
              <AgreementCheck />
            </div>
          </div>
        </div>

        {showTerms && <TermsModal type="terms" onClose={() => setShowTerms(false)} />}
        {showPrivacy && <TermsModal type="privacy" onClose={() => setShowPrivacy(false)} />}

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
      <div className="h-[40%] flex flex-col items-center justify-end pb-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="flex items-baseline">
          <span className="text-neutral-900 font-semibold text-5xl tracking-[0.02em] select-none">
            JT<span className="text-neutral-300">.</span>
          </span>
          <span className="text-neutral-400 font-medium text-2xl ml-3 h-8">{currentWord}<span className="animate-blink">|</span></span>
        </div>
        <p className="text-neutral-400 text-sm mt-3">智能工具平台</p>
      </div>

      {/* 下部登录区域 */}
      <div className="flex-1 flex flex-col p-6">
        <div className="w-full max-w-md mx-auto space-y-4">
          {/* 标题和错误提示同一行 */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">登录</h2>
            {error && <p className="text-xs text-red-500 text-center flex-1 mr-12">{error}</p>}
          </div>
          
          {/* 切换 */}
          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button onClick={() => setLoginType("phone")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginType === "phone" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>手机号</button>
            <button onClick={() => setLoginType("qrcode")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${loginType === "qrcode" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>扫码</button>
          </div>

          {/* 输入框 */}
          {loginType === "phone" ? (
            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input type="tel" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" />
              </div>
              <div className="flex gap-3">
                <input type="text" placeholder="验证码" value={code} onChange={(e) => setCode(e.target.value)} className="flex-1 min-w-0 px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:bg-white focus:outline-none transition-all" />
                <button onClick={handleSendCode} disabled={countdown > 0 || !phone} className="shrink-0 px-5 py-3.5 bg-neutral-900 text-white text-sm font-medium rounded-xl disabled:bg-neutral-200 disabled:text-neutral-400 transition-all">{countdown > 0 ? `${countdown}s` : "获取"}</button>
              </div>
              {/* 登录按钮 */}
              <div className="flex justify-center pt-2">
                <button onClick={handleLogin} disabled={loading} className="w-14 h-14 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-full transition-all flex items-center justify-center relative">
                  {loading ? (<><div className="absolute inset-0 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" /><ArrowRight className="w-5 h-5" /></>) : (<ArrowRight className="w-5 h-5" />)}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                {qrCodeUrl && <img src={qrCodeUrl} alt="登录二维码" className="w-40 h-40 rounded-xl" />}
                {qrExpired && (
                  <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center">
                    <p className="text-sm text-neutral-500 mb-2">二维码已过期</p>
                    <button onClick={generateQRCode} className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      刷新
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-neutral-500 mt-3 text-center">
                打开 <span className="text-neutral-900 font-medium">JT. App</span> 扫码登录
              </p>
            </div>
          )}

          {/* 第三方登录 */}
          <div className="pt-4">
            <SocialButtons />
            <div className="mt-4">
              <AgreementCheck />
            </div>
          </div>
        </div>
      </div>

      {showTerms && <TermsModal type="terms" onClose={() => setShowTerms(false)} />}
      {showPrivacy && <TermsModal type="privacy" onClose={() => setShowPrivacy(false)} />}

      <style jsx global>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </div>
  );
}