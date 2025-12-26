'use client';

import React, { useState } from 'react';
import { RefreshCcw, Clock, ChevronRight, MessageCircle } from 'lucide-react';

type TabType = 'exchanging' | 'closed';

const ExchangePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('exchanging');

  const closedExchanges = [
    {
      id: 1,
      user: { name: '阿逗', swapCount: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=china', time: '17 giờ trước' },
      status: 'Họ đã hủy',
      statusDetail: 'Họ đã hủy bỏ giao dịch này',
      receive: { name: 'Mewtwo ex', lang: 'CHT', pack: 'GENETIC APEX', img: 'https://assets.tcgdex.net/en/tcgp/A1/129/high.webp' },
      send: { name: 'Charizard ex', lang: 'CHT', pack: 'GENETIC APEX', img: 'https://assets.tcgdex.net/en/tcgp/A1/036/high.webp', isNew: true }
    },
    {
      id: 2,
      user: { name: 'ばっさー', swapCount: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jp', time: '16 giờ trước', isVip: true },
      status: 'Đã hoàn thành',
      statusDetail: 'Giao dịch đã được xác nhận thành công',
      receive: { name: 'Pikachu ex', lang: 'JPN', pack: 'GENETIC APEX', img: 'https://assets.tcgdex.net/en/tcgp/A1/096/high.webp' },
      send: { name: 'Venusaur ex', lang: 'JPN', pack: 'GENETIC APEX', img: 'https://assets.tcgdex.net/en/tcgp/A1/004/high.webp', isNew: true }
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-24">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 flex items-center justify-center relative">
        <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Giao dịch</h1>
      </div>

      <div className="bg-white flex border-b border-slate-100 shadow-sm">
        <button 
          onClick={() => setActiveTab('exchanging')}
          className={`flex-1 py-4 text-sm font-black transition-all relative ${activeTab === 'exchanging' ? 'text-slate-800' : 'text-slate-400'}`}
        >
          Đang giao dịch (4)
          {activeTab === 'exchanging' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-teal-500 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('closed')}
          className={`flex-1 py-4 text-sm font-black transition-all relative ${activeTab === 'closed' ? 'text-slate-800' : 'text-slate-400'}`}
        >
          Đã đóng (4)
          <span className="inline-block w-2 h-2 bg-pink-500 rounded-full ml-1 mb-2 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
          {activeTab === 'closed' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-teal-500 rounded-t-full"></div>}
        </button>
      </div>

      <div className="px-4 py-5 space-y-6">
        {activeTab === 'exchanging' ? (
          <>
            <div className="bg-white rounded-[2rem] p-5 shadow-sm space-y-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=akram" alt="akram" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-slate-800 tracking-tight">akram</span>
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-500">
                        <RefreshCcw className="w-2.5 h-2.5" /> 5
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">8 phút trước</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-tight">47:51:03</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-[#f1f5f9] rounded-[1.5rem] p-6 relative flex justify-around items-center border border-slate-100/50">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bạn nhận</span>
                  <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                    <img src="https://assets.tcgdex.net/en/tcgp/A1/056/high.webp" alt="Card" className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">ENG</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[8px] text-white font-black py-0.5 text-center truncate">Blastoise ex</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-[6px] font-black text-blue-600 text-center uppercase leading-none">GENETIC<br/>APEX</div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-md z-10 border border-slate-50">
                    <RefreshCcw className="w-5 h-5 text-teal-500" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bạn gửi</span>
                  <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                    <img src="https://assets.tcgdex.net/en/tcgp/A1/036/high.webp" alt="Card" className="w-full h-full object-cover" />
                    <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">ANY</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[8px] text-white font-black py-0.5 text-center truncate">Charizard ex</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded text-[6px] font-black text-orange-600 text-center uppercase leading-none">GENETIC<br/>APEX</div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-white border border-slate-200 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-teal-500 font-black text-sm shadow-sm active:scale-95 transition-all">
                  <MessageCircle className="w-5 h-5 fill-teal-500/10" /> Chat
                </button>
                <button className="flex-[1.5] bg-teal-500 flex items-center justify-center py-3.5 rounded-2xl text-white font-black text-sm shadow-[0_4px_12px_rgba(20,184,166,0.3)] active:scale-95 transition-all">
                  Xác nhận
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {closedExchanges.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] p-5 shadow-sm space-y-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={item.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-800">{item.user.name}</span>
                        <div className="flex items-center gap-1 bg-[#475569]/10 px-2 py-0.5 rounded-full text-[10px] font-black text-[#475569]">
                          <RefreshCcw className="w-2.5 h-2.5" /> {item.user.swapCount}
                        </div>
                        {item.user.isVip && (
                          <div className="w-3.5 h-3.5 bg-yellow-600 rounded-sm rotate-45 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{item.user.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>

                <div className="bg-[#f1f5f9] rounded-[1.5rem] p-6 relative flex justify-around items-center border border-slate-100/50">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bạn nhận</span>
                    <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                      <img src={item.receive.img} alt="Receive" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">{item.receive.lang}</div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[8px] text-white font-black py-0.5 text-center truncate">{item.receive.name}</div>
                    </div>
                    <div className="bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded text-[6px] font-black text-slate-600 text-center uppercase leading-none">{item.receive.pack}</div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 shadow-sm z-10">
                      <RefreshCcw className="w-5 h-5 text-slate-300" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bạn gửi</span>
                    <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                      <img src={item.send.img} alt="Send" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">{item.send.lang}</div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[8px] text-white font-black py-0.5 text-center truncate">{item.send.name}</div>
                      {item.send.isNew && (
                        <div className="absolute top-0 left-0 bg-red-500 text-[6px] text-white font-black px-1.5 py-0.5 rounded-br italic">New</div>
                      )}
                    </div>
                    <div className="bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded text-[6px] font-black text-slate-600 text-center uppercase leading-none">{item.send.pack}</div>
                  </div>
                </div>

                <div className="pt-2 px-1">
                  <div className="bg-slate-100/50 rounded-xl px-4 py-2 flex items-center gap-2 border border-slate-200/50">
                    <span className={`text-[11px] font-black uppercase tracking-tight ${item.status === 'Họ đã hủy' ? 'text-indigo-400' : 'text-teal-500'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400 font-bold ml-1">
                    {item.statusDetail}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 opacity-60 border-dashed flex flex-col items-center justify-center gap-3">
           <RefreshCcw className="w-6 h-6 text-slate-300 animate-spin-slow" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Đang đồng bộ dữ liệu...</span>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ExchangePage;
