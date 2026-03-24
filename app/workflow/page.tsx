"use client";

import { useState } from "react";
import {
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  Workflow,
  Zap,
  CheckCircle2,
} from "lucide-react";

const sampleWorkflows = [
  { id: 1, name: "自动翻译流程", description: "自动翻译输入文本并保存结果", status: "active", runs: 128, lastRun: "2小时前" },
  { id: 2, name: "数据同步", description: "定时同步数据库到备份服务器", status: "paused", runs: 45, lastRun: "1天前" },
  { id: 3, name: "内容审核", description: "自动审核用户生成内容", status: "active", runs: 1024, lastRun: "5分钟前" },
];

export default function WorkflowPage() {
  const [workflows] = useState(sampleWorkflows);

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
        <h1 className="text-sm font-medium text-neutral-900">工作流</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
          <Plus className="w-4 h-4" />
          新建工作流
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* 统计卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{workflows.filter(w => w.status === 'active').length}</p>
                  <p className="text-xs text-neutral-400">运行中</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-lg flex items-center justify-center">
                  <Pause className="w-5 h-5 text-neutral-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{workflows.filter(w => w.status === 'paused').length}</p>
                  <p className="text-xs text-neutral-400">已暂停</p>
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900">{workflows.reduce((sum, w) => sum + w.runs, 0)}</p>
                  <p className="text-xs text-neutral-400">总执行次数</p>
                </div>
              </div>
            </div>
          </div>

          {/* 工作流列表 */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100 text-xs font-medium text-neutral-400">
              <div className="col-span-4">名称</div>
              <div className="col-span-2">状态</div>
              <div className="col-span-2">执行次数</div>
              <div className="col-span-2">最后执行</div>
              <div className="col-span-2 text-right">操作</div>
            </div>
            {workflows.map((workflow) => (
              <div key={workflow.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors items-center">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-neutral-900">{workflow.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{workflow.description}</p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${workflow.status === 'active' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${workflow.status === 'active' ? 'bg-white' : 'bg-neutral-400'}`} />
                    {workflow.status === 'active' ? '运行中' : '已暂停'}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-neutral-600">{workflow.runs} 次</div>
                <div className="col-span-2 text-sm text-neutral-400">{workflow.lastRun}</div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"><Play className="w-4 h-4" /></button>
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}