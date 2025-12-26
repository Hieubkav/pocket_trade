'use client';

import React from 'react';
import { ChevronLeft, UserPlus, Ban, AlertTriangle, Copy, RefreshCcw, MessageSquare, Image as ImageIcon, Smile } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  message?: string;
  time?: string;
}

interface ChatDetailProps {
  chat: Chat;
  onBack: () => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chat, onBack }) => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
            <ChevronLeft className="w-7 h-7 text-slate-800 stroke-[2.5px]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-800 tracking-tight">{chat.name}</span>
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-black text-slate-500">
                  <RefreshCcw className="w-2.5 h-2.5" /> 1
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">8 mins ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                <UserPlus className="w-5 h-5 stroke-[2.5px]" />
            </button>
            <button className="p-1.5 bg-slate-100 rounded-lg text-slate-400">
                <Ban className="w-5 h-5 stroke-[2.5px]" />
            </button>
        </div>
      </div>

      <div className="bg-[#334155] px-4 py-2.5 flex items-start gap-2 text-[11px] leading-tight">
        <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
        <p className="text-white font-bold tracking-tight">
          Hãy cẩn trọng với các trao đổi không công bằng, quảng cáo hoặc lừa đảo. Không mở các liên kết hoặc mã lạ. 
          <span className="text-teal-400 ml-1 underline cursor-pointer">Phản hồi &gt;</span>
        </p>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth pb-48">
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-5">
           <div className="flex items-center justify-between">
              <div className="bg-green-50 border border-green-100 px-3 py-1 rounded-lg">
                <span className="text-[11px] font-black text-green-600 uppercase">Họ đã xác nhận</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="text-[11px] font-bold">Hết hạn trong 47:54:07</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
           </div>

           <div className="flex justify-around items-center py-2 bg-slate-50 rounded-2xl border border-slate-100/50 relative">
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
                  <img src="https://assets.tcgdex.net/en/tcgp/A1/056/high.webp" alt="Receive" className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">FRA</div>
                </div>
                <span className="text-[9px] font-black text-orange-500 uppercase italic tracking-tighter">Bạn nhận</span>
              </div>

              <div className="z-10 bg-white rounded-full p-2 shadow-sm border border-slate-100">
                <RefreshCcw className="w-4 h-4 text-slate-300" />
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white">
                  <img src="https://assets.tcgdex.net/en/tcgp/A1/036/high.webp" alt="Send" className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-black/80 text-[7px] text-white font-black px-1.5 py-0.5 rounded-bl">ANY</div>
                </div>
                <span className="text-[9px] font-black text-teal-500 uppercase italic tracking-tighter">Bạn gửi</span>
              </div>
           </div>

           <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700">Sunflora</span>
                    <div className="bg-orange-50 text-orange-600 text-[7px] font-black px-1 py-0.5 rounded border border-orange-100">CRIMSON BLAZE</div>
                    <Copy className="w-3.5 h-3.5 text-slate-300 cursor-pointer hover:text-teal-500 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">#B1a-024</span>
              </div>
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700">Trubbish</span>
                    <div className="bg-orange-50 text-orange-600 text-[7px] font-black px-1 py-0.5 rounded border border-orange-100">CRIMSON BLAZE</div>
                    <Copy className="w-3.5 h-3.5 text-slate-300 cursor-pointer hover:text-teal-500 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">#B1a-089</span>
              </div>
           </div>

           <div className="flex gap-3">
              <button className="flex-1 bg-slate-100 py-3 rounded-2xl text-slate-500 font-black text-[13px] active:scale-95 transition-transform">Hủy</button>
              <button className="flex-1 bg-teal-500 py-3 rounded-2xl text-white font-black text-[13px] shadow-[0_4px_12px_rgba(20,184,166,0.3)] active:scale-95 transition-transform">Xác nhận</button>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4">
            <div className="bg-slate-200/50 px-6 py-2 rounded-xl text-[11px] font-bold text-slate-500 text-center leading-relaxed">
                Dati đã chấp nhận trao đổi
            </div>
            
            <div className="text-[11px] font-bold text-slate-400">Vui lòng trao đổi trước khi giao dịch.</div>

            <div className="flex gap-2 w-full max-w-[320px]">
                <button className="flex-1 bg-slate-100 py-2.5 rounded-xl text-slate-400 font-black text-[11px] border border-slate-200/50">Họ gửi trước</button>
                <button className="flex-1 bg-teal-500 text-white py-2.5 rounded-xl font-black text-[11px] shadow-sm">Tôi gửi trước</button>
            </div>

            <div className="bg-slate-200/50 px-6 py-2 rounded-xl text-[11px] font-bold text-slate-500 text-center leading-relaxed">
                {chat.name} đã xác nhận đơn giao dịch.
            </div>
        </div>

        <div className="space-y-4">
            <div className="space-y-2 flex flex-col items-start">
                <span className="text-[10px] font-bold text-slate-400 ml-1">3 mins ago</span>
                <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-700 leading-relaxed">
                        Tôi đã copy ID bạn bè của bạn và đang thêm bạn vào game.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 p-4 space-y-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-[60]">
        <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-slate-400 italic">Giờ địa phương của họ là 09:47:15 (UTC+01:00).</span>
        </div>

        <div className="flex items-center gap-3">
            <button className="bg-teal-50 border border-teal-100 text-teal-600 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 active:scale-95 transition-transform">
                <MessageSquare className="w-3.5 h-3.5 fill-teal-600/10" /> ID Bạn bè
            </button>
            <div className="flex-grow"></div>
            <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-slate-400" />
            </button>
            <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <ImageIcon className="w-5 h-5 text-slate-400" />
            </button>
        </div>

        <div className="relative group">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                <Smile className="w-5 h-5" />
            </div>
            <input 
                type="text" 
                placeholder="Lời hay ý đẹp kiến tạo huấn luyện viên tài năng." 
                className="w-full bg-slate-100/50 border border-slate-100 rounded-2xl py-3.5 px-5 text-xs font-bold text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all shadow-inner"
            />
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
