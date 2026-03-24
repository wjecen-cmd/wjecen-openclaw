"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Star, Users, ArrowRight } from "lucide-react";

const categories = [
  { id: "all", name: "全部" },
  { id: "ai", name: "AI 模型" },
  { id: "tools", name: "开发工具" },
  { id: "data", name: "数据服务" },
];

const products = [
  { id: 1, name: "GPT-4 Turbo", description: "最强大的语言模型", category: "ai", price: 0.03, unit: "/1K tokens", rating: 4.9, users: "10万+", icon: "🤖", popular: true },
  { id: 2, name: "Claude 3 Opus", description: "擅长复杂推理", category: "ai", price: 0.015, unit: "/1K tokens", rating: 4.8, users: "8万+", icon: "🧠", popular: true },
  { id: 3, name: "通义千问 Plus", description: "中文理解优秀", category: "ai", price: 0.004, unit: "/1K tokens", rating: 4.7, users: "15万+", icon: "🌟", popular: false },
  { id: 4, name: "文心一言 4.0", description: "知识覆盖广", category: "ai", price: 0.008, unit: "/1K tokens", rating: 4.6, users: "12万+", icon: "📖", popular: false },
  { id: 5, name: "图片生成 API", description: "支持 DALL-E 3", category: "tools", price: 0.02, unit: "/张", rating: 4.8, users: "5万+", icon: "🎨", popular: true },
  { id: 6, name: "语音识别 API", description: "多语言语音转文字", category: "tools", price: 0.001, unit: "/秒", rating: 4.7, users: "3万+", icon: "🎤", popular: false },
];

export default function ShopPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
        <h1 className="text-sm font-medium text-neutral-900">API 商城</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">积分余额:</span>
          <span className="text-sm font-medium text-neutral-900">{user?.points || 1000}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 搜索和分类 */}
        <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索 API..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-300 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            {/* 热门推荐 */}
            {activeCategory === "all" && (
              <div className="mb-8">
                <h2 className="text-base font-medium text-neutral-900 mb-4">热门推荐</h2>
                <div className="grid grid-cols-2 gap-4">
                  {products.filter((p) => p.popular).map((product) => (
                    <div key={product.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{product.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>
                          </div>
                          <p className="text-xs text-neutral-500 mb-3">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-neutral-400">
                              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-neutral-300" />{product.rating}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{product.users}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-neutral-900">¥{product.price}</span>
                              <span className="text-xs text-neutral-400 ml-1">{product.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 全部商品 */}
            <div>
              <h2 className="text-base font-medium text-neutral-900 mb-4">全部 API</h2>
              <div className="grid grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-all cursor-pointer group">
                    <div className="text-3xl mb-3">{product.icon}</div>
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">{product.name}</h3>
                    <p className="text-xs text-neutral-500 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-neutral-900">¥{product.price}</span>
                        <span className="text-xs text-neutral-400 ml-1">{product.unit}</span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 bg-neutral-900 text-white rounded-lg transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}