'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Copy, Hexagon, RefreshCcw, Plus, Star } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [subTab, setSubTab] = useState<'offering' | 'seeking'>('offering');

  return (
    <div className="min-h-screen bg-[#0a1128] pb-20">
      <div className="px-5 pt-12 pb-8 space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-teal-500/30 p-1 bg-gradient-to-tr from-teal-500/20 to-transparent">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border border-white/10 flex items-center justify-center">
                <img 
                    src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Dati" 
                    alt="avatar" 
                    className="w-full h-full object-cover scale-110" 
                />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-xl border border-slate-100 active:scale-90 transition-transform">
              <Pencil className="w-3.5 h-3.5 text-slate-800" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Dati</h2>
              <Pencil className="w-4 h-4 text-white/40 cursor-pointer" />
              <Hexagon className="w-4 h-4 text-teal-400 fill-teal-400/10" />
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-white/60 text-[11px] font-bold">
                    <span>Friend ID: 2425025484977385</span>
                    <Pencil className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
                    <Copy className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-wider mb-0.5">Uy tín</span>
                        <span className="text-xs text-white font-black tracking-tight">2,450 PTS</span>
                    </div>
                    
                    <div className="w-[1px] h-6 bg-white/10"></div>
                    
                    <div className="flex flex-col">
                        <span className="text-[9px] text-amber-500/60 font-black uppercase tracking-wider mb-0.5">Hạng</span>
                        <span className="text-xs text-amber-500 font-black tracking-tight uppercase">Master Trader</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-t-[2.5rem] min-h-[calc(100vh-280px)]">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-teal-500" />
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Quản lý bài đăng</h3>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase">
                Tổng: 0
            </div>
        </div>

        <div className="p-5 flex flex-col gap-10">
            <div className="flex gap-8 px-3">
                <button 
                    onClick={() => setSubTab('offering')}
                    className={`text-[13px] font-black tracking-tight relative transition-all ${subTab === 'offering' ? 'text-slate-900' : 'text-slate-300'}`}
                >
                    Người đang tìm
                    {subTab === 'offering' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-teal-500 rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setSubTab('seeking')}
                    className={`text-[13px] font-black tracking-tight relative transition-all ${subTab === 'seeking' ? 'text-slate-900' : 'text-slate-300'}`}
                >
                    Người đang có
                    {subTab === 'seeking' && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-teal-500 rounded-full"></div>}
                </button>
            </div>

            <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 bg-teal-50 rounded-full scale-125 opacity-40 blur-2xl"></div>
                    <div className="relative">
                        <div className="w-24 h-32 bg-slate-50 rounded-lg transform -rotate-12 border-2 border-slate-200 shadow-sm flex flex-col p-2 gap-2">
                            <div className="w-full h-1/2 bg-slate-100 rounded"></div>
                            <div className="w-2/3 h-2 bg-slate-100 rounded"></div>
                            <div className="w-full h-2 bg-slate-100 rounded"></div>
                        </div>
                        <div className="w-24 h-32 bg-white rounded-lg absolute top-2 left-6 transform rotate-12 border-2 border-teal-100 shadow-xl flex flex-col p-2 gap-2">
                            <div className="w-full h-1/2 bg-teal-50 rounded flex items-center justify-center">
                                <Star className="w-6 h-6 text-teal-200 fill-teal-100/50" />
                            </div>
                            <div className="w-2/3 h-2 bg-teal-50 rounded"></div>
                            <div className="w-full h-2 bg-teal-50 rounded"></div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center space-y-2 max-w-[240px]">
                    <h4 className="text-sm font-black text-slate-800">Bắt đầu hành trình trader!</h4>
                    <p className="text-[12px] font-bold text-slate-400 leading-tight">Bạn chưa có bài đăng nào. Hãy tạo bài để thu hút các nhà sưu tầm khác.</p>
                </div>

                <button 
                  onClick={() => router.push('/trade/new')}
                  className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl hover:bg-teal-600 transition-all active:scale-95"
                >
                    <div className="bg-teal-500 rounded-lg p-1 group-hover:bg-white transition-colors">
                        <Plus className="w-4 h-4 stroke-[4px] group-hover:text-teal-600" />
                    </div>
                    Tạo bài đăng mới
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
