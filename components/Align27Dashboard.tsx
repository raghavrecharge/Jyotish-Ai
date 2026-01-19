
import React, { useMemo } from 'react';
import { TransitContext } from '../types';
import { 
  MoonIcon, 
  ClockIcon, 
  SparklesIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import MonthlyAstroCalendar from './MonthlyAstroCalendar';

interface Props {
  data: TransitContext | null;
  userName?: string;
}

const Align27Dashboard: React.FC<Props> = ({ data, userName = "Seeker" }) => {
  const score = 82;
  
  const timeOfDayGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 17) return "Good Afternoon,";
    return "Good Evening,";
  }, []);

  const lunarDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 3 + i);
    const tithiNum = (10 + i) % 30 || 30;
    return {
      date: d,
      tithi: tithiNum,
      phase: tithiNum <= 15 ? 'Waxing' : 'Waning',
      isToday: i === 3,
      label: tithiNum === 15 ? 'Purnima' : tithiNum === 30 ? 'Amavasya' : `Tithi ${tithiNum}`
    };
  });

  const tithiInfo = {
    name: 'Trayodashi',
    essence: 'The Moon is transiting your 9th house of Dharma. This is a powerful window for expansion and higher learning.',
    dos: ['Social gatherings', 'New investments', 'Healing rituals'],
    donts: ['Argumentative speech', 'Isolation', 'Lending large sums']
  };

  const MoonPhaseIcon = ({ tithi, active }: { tithi: number, active: boolean }) => {
    const isWaxing = tithi <= 15;
    const progress = isWaxing ? (tithi / 15) : (1 - (tithi - 15) / 15);
    return (
      <div className={`relative ${active ? 'w-8 h-8' : 'w-6 h-6'} shrink-0`}>
        <div className={`absolute inset-0 rounded-full ${active ? 'bg-indigo-950/10' : 'bg-slate-100'} border border-slate-300/30`} />
        <div 
          className={`absolute inset-0 rounded-full ${active ? 'bg-orange-400 shadow-lg' : 'bg-indigo-700/80'}`}
          style={{ clipPath: isWaxing ? `inset(0 ${100 - (progress * 100)}% 0 0)` : `inset(0 0 0 ${100 - (progress * 100)}%)` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-16">
      
      {/* HERO SECTION - REFINED TO MATCH IMAGE */}
      <div className="relative overflow-hidden bg-white rounded-[48px] border border-[#f1ebe6] p-10 lg:p-14 shadow-sm">
        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8 text-center xl:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#fcf8f5] rounded-full border border-orange-100">
               <SparklesIcon className="w-4 h-4 text-orange-500 animate-pulse" />
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em]">Temporal Flow: {score}% Optimal</span>
            </div>
            
            <div className="space-y-2">
               <h1 className="text-5xl lg:text-6xl font-black text-slate-800 tracking-tighter leading-tight">
                 {timeOfDayGreeting}<br/>
                 <span className="text-orange-500">{userName}</span>
               </h1>
               <p className="text-base lg:text-lg font-medium text-slate-500 max-w-xl mx-auto xl:mx-0 leading-relaxed italic">
                 {tithiInfo.essence}
               </p>
            </div>

            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
               <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Daily Protocol</button>
               <button className="px-10 py-4 bg-white border border-[#f1ebe6] text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-50 active:scale-95 transition-all">Matrix Scan</button>
            </div>
          </div>

          {/* FLOW GAUGE - DOTTED TRACK MATCH */}
          <div className="relative flex flex-col items-center justify-center p-4">
             <div className="w-64 h-64 relative flex items-center justify-center">
                <svg viewBox="0 0 220 220" className="w-full h-full transform -rotate-90">
                   {/* Dotted Background Track */}
                   <circle 
                     cx="110" cy="110" r="90" 
                     stroke="#f1ebe6" 
                     strokeWidth="16" 
                     fill="transparent" 
                     strokeDasharray="4 8" 
                   />
                   {/* Solid Orange Progress Arc */}
                   <circle 
                     cx="110" cy="110" r="90" 
                     stroke="#f97316" 
                     strokeWidth="16" 
                     fill="transparent" 
                     strokeDasharray={2 * Math.PI * 90} 
                     strokeDashoffset={2 * Math.PI * 90 - (score / 100) * 2 * Math.PI * 90}
                     strokeLinecap="round"
                     className="transition-all duration-1000 ease-out" 
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                   <span className="text-7xl font-black text-[#1e293b] tracking-tighter leading-none">{score}</span>
                   <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.6em] mt-4 ml-2">Flow</span>
                </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500/5 blur-[120px] translate-x-1/2" />
      </div>

      {/* CHANDRA PROGRESSION SECTION */}
      <div className="space-y-6 px-4">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <MoonIcon className="w-6 h-6 text-indigo-500" /> Chandra progression
               </h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Lunar Transit Mapping</p>
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 shadow-sm">
               {lunarDays[3].phase} Phase Active
            </span>
         </div>

         <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
            {lunarDays.map((day, i) => (
               <div 
                 key={i} 
                 className={`snap-center flex flex-col items-center min-w-[84px] p-4 rounded-[32px] border transition-all duration-500
                   ${day.isToday 
                     ? 'bg-indigo-50 border-indigo-200 shadow-xl scale-105' 
                     : 'bg-white border-[#f1ebe6] hover:border-indigo-100'}`}
               >
                  <p className={`text-[9px] font-black uppercase mb-4 tracking-[0.2em] ${day.isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {day.date.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </p>
                  
                  <MoonPhaseIcon tithi={day.tithi} active={day.isToday} />
                  
                  <p className={`text-sm font-black mt-3 ${day.isToday ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {day.tithi}
                  </p>
                  <p className={`text-[8px] font-bold uppercase tracking-widest ${day.isToday ? 'text-orange-500' : 'text-slate-300'}`}>
                    {day.label.split(' ')[0]}
                  </p>
               </div>
            ))}
         </div>
      </div>

      <MonthlyAstroCalendar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white rounded-[48px] border border-[#f1ebe6] p-10 shadow-sm relative group overflow-hidden">
              <div className="relative z-10 space-y-10">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mb-2 block">Tithi Dynamics</span>
                       <h3 className="text-4xl font-black text-slate-800 tracking-tight">{tithiInfo.name}</h3>
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner group-hover:rotate-6 transition-transform">
                       <MoonIcon className="w-8 h-8" />
                    </div>
                 </div>
                 <div className="p-6 bg-[#fcf8f5] rounded-3xl border border-orange-100/50">
                    <p className="text-lg font-medium text-slate-700 leading-relaxed italic">The energy today favors strategic alignment and internal cultivation. Establish clear boundaries before engaging in high-velocity social exchanges.</p>
                 </div>
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-2 tracking-[0.4em]"><BoltIcon className="w-4 h-4" /> Recommendation</h4>
                       <ul className="space-y-2">
                          {tithiInfo.dos.map((item, idx) => (
                            <li key={idx} className="text-sm font-bold text-slate-800 flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase text-rose-600 flex items-center gap-2 tracking-[0.4em]"><FireIcon className="w-4 h-4" /> Restrictions</h4>
                       <ul className="space-y-2">
                          {tithiInfo.donts.map((item, idx) => (
                            <li key={idx} className="text-sm font-bold text-slate-500 flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-rose-300 shrink-0" /> {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-indigo-50 rounded-[48px] p-10 text-slate-700 border border-indigo-100 relative overflow-hidden shadow-sm h-full flex flex-col">
              <div className="relative z-10 space-y-10 flex-1">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-indigo-900 tracking-tight">Daily Panchang</h2>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Temporal Elements</p>
                    </div>
                    <ClockIcon className="w-8 h-8 text-orange-500" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-[32px] shadow-sm border border-indigo-100 group hover:border-emerald-300 transition-colors">
                       <p className="text-[9px] font-black text-emerald-600 uppercase mb-2 tracking-[0.4em]">Abhijit</p>
                       <p className="text-xl font-black text-slate-800 leading-none">11:58 - 12:54</p>
                    </div>
                    <div className="p-6 bg-white rounded-[32px] shadow-sm border border-indigo-100 group hover:border-rose-300 transition-colors">
                       <p className="text-[9px] font-black text-rose-600 uppercase mb-2 tracking-[0.4em]">Rahu Kaal</p>
                       <p className="text-xl font-black text-slate-800 leading-none">03:59 - 05:41</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {[
                      { label: 'Nakshatra', val: 'Mula', icon: SparklesIcon, color: 'text-indigo-400' },
                      { label: 'Yoga', val: 'Siddhi', icon: BoltIcon, color: 'text-orange-400' },
                      { label: 'Vara', val: 'Tuesday', icon: FireIcon, color: 'text-rose-400' }
                    ].map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/60 p-5 rounded-[24px] border border-white hover:bg-white transition-all group">
                         <div className="flex items-center gap-4">
                            <p.icon className={`w-5 h-5 ${p.color} group-hover:scale-110 transition-transform`} />
                            <div>
                               <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-[0.4em]">{p.label}</span>
                               <span className="text-base font-black text-slate-800 leading-none">{p.val}</span>
                            </div>
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
};

export default Align27Dashboard;
