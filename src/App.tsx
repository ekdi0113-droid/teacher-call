import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, CheckCircle2, Clock, Info, ShieldCheck } from 'lucide-react';

// 선생님 성함 데이터 (20명)
const TEACHERS = [
  "김철수", "이영희", "박지성", "최수연", "정민호", 
  "강다혜", "조현우", "윤지민", "임채원", "한승우", 
  "오지현", "서동현", "권유리", "황정민", "송지효", 
  "안재현", "전소미", "고아라", "홍길동", "문채원"
];

export default function App() {
  const [callingTeacher, setCallingTeacher] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // TTS 음성 출력 함수
  const speak = useCallback((name: string) => {
    if (callingTeacher) return;

    // 이전 음성이 재생 중이면 중단
    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(`${name} 선생님, 학생이 호출합니다.`);
    message.lang = 'ko-KR';
    message.rate = 0.85; // 약간 천천히 신뢰감 있는 목소리
    message.pitch = 1.0;

    message.onstart = () => {
      setCallingTeacher(name);
    };

    message.onend = () => {
      setCallingTeacher(null);
      showToast(`${name} 선생님께 호출을 전달했습니다.`);
    };

    message.onerror = () => {
      setCallingTeacher(null);
    };

    window.speechSynthesis.speak(message);
  }, [callingTeacher]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  }, [currentTime]);

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col font-sans select-none overflow-hidden text-slate-900">
      {/* Kiosk Status Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center z-20 shadow-sm">
        <div className="flex items-center gap-4 text-slate-500 font-bold">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <span className="text-lg tracking-wider">HWAWON HIGH SCHOOL KIOSK</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{formattedDate}</span>
            <div className="flex items-center gap-2 text-2xl font-black text-slate-700">
              <Clock className="w-5 h-5" />
              {formattedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <header className="px-12 py-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-black mb-6 uppercase tracking-widest">
            <Bell className="w-4 h-4 fill-current" />
            Teacher Call System
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tight text-slate-900">
            선생님 성함을 <span className="text-blue-600">터치</span>해 주세요
          </h1>
          <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
            터치 시 교무실 내부 스피커로 안내 음성이 송출됩니다.
            <br />잠시만 기다려 주시면 선생님께서 응답해 주실 것입니다.
          </p>
        </motion.div>
      </header>

      {/* Bento Grid Teacher List */}
      <main className="flex-grow px-12 pb-12 overflow-hidden flex flex-col">
        <div className="flex-grow grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-h-full content-center">
          {TEACHERS.map((teacher, index) => (
            <motion.button
              key={teacher}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => speak(teacher)}
              disabled={callingTeacher !== null && callingTeacher !== teacher}
              className={`
                relative h-full min-h-[160px] flex flex-col items-center justify-center rounded-[2.5rem] transition-all duration-500
                shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2
                ${callingTeacher === teacher 
                  ? 'bg-blue-600 border-blue-400 text-white z-10 shadow-blue-200 scale-105' 
                  : 'bg-white border-white text-slate-700 hover:border-blue-100 active:bg-blue-50'}
                ${callingTeacher && callingTeacher !== teacher ? 'opacity-30 blur-[2px]' : 'opacity-100'}
                disabled:cursor-default
              `}
            >
              {callingTeacher === teacher && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-[2.5rem] bg-blue-400"
                  />
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-950 p-3 rounded-full shadow-lg border-4 border-white">
                    <Bell className="w-6 h-6 animate-bounce" />
                  </div>
                </>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${callingTeacher === teacher ? 'bg-white/20' : 'bg-slate-50'}`}>
                   <User className={`w-8 h-8 ${callingTeacher === teacher ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className="text-4xl font-black tracking-tighter mb-1">{teacher}</span>
                <span className={`text-sm font-black uppercase tracking-[0.2em] ${callingTeacher === teacher ? 'text-blue-100' : 'text-slate-300'}`}>Teacher</span>
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Info Bar */}
      <div className="px-12 py-6 bg-white border-t border-slate-100 flex items-center justify-between text-slate-400 font-bold">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400" />
          <span>도움이 필요하시면 교무행정실로 문의해 주세요.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-600 tracking-widest text-sm uppercase">System Online</span>
        </div>
      </div>

      {/* Modern Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: 100, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] w-full max-w-lg px-6 pointer-events-none"
          >
            <div className="bg-slate-900 border-2 border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] text-white px-8 py-6 rounded-[2rem] flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-400 text-sm font-black uppercase tracking-widest mb-1">Call Confirmed</span>
                <span className="text-2xl font-bold">{toastMessage}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Area */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-xl font-bold tracking-widest uppercase">
        Call-Teacher Kiosk System v1.0
      </footer>
    </div>
  );
}
