"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bot,
  Sliders,
  Code,
  MessageSquare,
  Zap,
  Shield,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

const agentTemplates = [
  { id: 1, name: "代码助手", description: "精通多种编程语言", icon: Code },
  { id: 2, name: "创意写作", description: "文案创作和内容优化", icon: MessageSquare },
  { id: 3, name: "效率专家", description: "规划任务、优化流程", icon: Zap },
  { id: 4, name: "安全顾问", description: "安全分析、漏洞检测", icon: Shield },
];

export default function AgentPage() {
  const { user } = useAuth();
  const [agents] = useState([
    { id: 1, name: "我的代码助手", template: "代码助手", created: "2024-03-20" },
    { id: 2, name: "创意写作助手", template: "创意写作", created: "2024-03-22" },
  ]);

  return (
    <div className="h-screen bg-white flex">
      {/* 左侧 Agent 列表 */}
      <div className="w-72 border-r border-neutral-100 bg-neutral-50 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            创建 Agent
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {agents.map((agent) => (
            <button key={agent.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-neutral-100 transition-colors group">
              <div className="w-10 h-10 bg-neutral-200 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{agent.name}</p>
                <p className="text-xs text-neutral-400">{agent.template}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-600 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-neutral-100 flex items-center px-6">
          <h1 className="text-sm font-medium text-neutral-900">Agent 设置</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-base font-medium text-neutral-900 mb-4">快速创建</h2>
              <div className="grid grid-cols-2 gap-4">
                {agentTemplates.map((template) => (
                  <button key={template.id} className="flex items-start gap-4 p-5 bg-neutral-50 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-all text-left">
                    <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center">
                      <template.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900">{template.name}</p>
                      <p className="text-xs text-neutral-500 mt-1">{template.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl divide-y divide-neutral-100">
              <button className="w-full p-5 flex items-center justify-between hover:bg-neutral-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-neutral-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral-900">全局设置</p>
                    <p className="text-xs text-neutral-400">配置默认模型和行为</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}