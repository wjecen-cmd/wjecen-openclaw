"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Server, Globe, Clock, Activity, AlertTriangle } from "lucide-react";

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

export default function MonitorPage() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6">
        <h1 className="text-sm font-medium text-neutral-900">监测大屏</h1>
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <Clock className="w-4 h-4" />
          {time.toLocaleTimeString("zh-CN")}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">在线服务器</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">{servers.filter(s => s.status === 'online').length}</p>
                </div>
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">域名总数</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">{domains.length}</p>
                </div>
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">告警数量</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">2</p>
                </div>
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-400">平均响应</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">48ms</p>
                </div>
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 两列布局 */}
          <div className="grid grid-cols-2 gap-6">
            {/* 服务器状态 */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-medium text-neutral-900">服务器状态</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {servers.map((server) => (
                  <div key={server.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-neutral-900' : 'bg-neutral-300'}`} />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{server.name}</p>
                          <p className="text-xs text-neutral-400">{server.ip}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${server.status === 'online' ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-50 text-neutral-400'}`}>
                        {server.status === 'online' ? '在线' : '离线'}
                      </span>
                    </div>
                    {server.status === 'online' && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-neutral-400">CPU</span>
                            <span className="text-neutral-600">{server.cpu}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${server.cpu}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-neutral-400">内存</span>
                            <span className="text-neutral-600">{server.memory}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${server.memory}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-neutral-400">磁盘</span>
                            <span className="text-neutral-600">{server.disk}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${server.disk}%` }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 域名状态 */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-medium text-neutral-900">域名监控</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {domains.map((domain) => (
                  <div key={domain.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${domain.status === 'active' ? 'bg-neutral-900' : 'bg-neutral-400'}`} />
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{domain.name}</p>
                        <p className="text-xs text-neutral-400">到期: {domain.expiry}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${domain.ssl === 'valid' ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-50 text-neutral-400'}`}>
                      SSL {domain.ssl === 'valid' ? '有效' : '即将过期'}
                    </span>
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