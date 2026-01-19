
import React, { useState, useMemo } from 'react';
import { 
  ChartBarIcon, 
  ArrowPathIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  CloudArrowDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  SpeakerWaveIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { DivisionalChart, Planet, Sign, BirthData, ChartPoint } from '../types';
import { SIGN_NAMES } from '../constants';
import { astrologyService } from '../services/astrologyService';
import VedicChart from './VedicChart';
import PlanetDetailsTable from './PlanetDetailsTable';
import ZodiacIcon from './ZodiacIcon';

interface Props {
  natalChart: DivisionalChart;
  birthData: BirthData;
}

const VARGA_LIST = [
  { value: 1, label: 'D1 Lagna - Physical Body' },
  { value: 9, label: 'D9 Navamsha - Soul & Fruit' },
  { value: 10, label: 'D10 Dashamsha - Career' },
  { value: 2, label: 'D2 Hora - Wealth' },
  { value: 3, label: 'D3 Drekkana - Siblings' },
  { value: 7, label: 'D7 Saptamsha - Progeny' },
  { value: 60, label: 'D60 Shashtiamsha - Past Karma' },
];

const NatalChartView: React.FC<Props> = ({ natalChart, birthData }) => {
  const [selectedVarga, setSelectedVarga] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);

  const activeChart = useMemo(() => {
    if (selectedVarga === 1) return natalChart;
    return astrologyService.calculateVarga(natalChart, selectedVarga);
  }, [natalChart, selectedVarga]);

  const handleReset = () => {
    setSelectedVarga(1);
    setSelectedPoint(null);
  };

  const formatDegrees = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    return `${d.toString().padStart(2, '0')}°${m.toString().padStart(2, '0')}'`;
  };

  const lagnaPoint = activeChart.points.find(p => p.planet === Planet.Lagna);

  const navamshaDetails = useMemo(() => {
    if (!selectedPoint || !lagnaPoint) return null;
    const calculateD9Sign = (pSign: number, pDegree: number) => {
      const totalDegrees = (pSign - 1) * 30 + pDegree;
      return (Math.floor(totalDegrees * 9 / 30) % 12) + 1;
    };
    const d9Sign = calculateD9Sign(selectedPoint.sign, selectedPoint.degree) as Sign;
    const d9LagnaSign = calculateD9Sign(lagnaPoint.sign, lagnaPoint.degree);
    const d9House = ((d9Sign - d9LagnaSign + 12) % 12) + 1;
    let d9Dignity = "Neutral";
    const isVargottama = d9Sign === selectedPoint.sign;
    return { d9Sign, d9House, d9Dignity, isVargottama };
  }, [selectedPoint, lagnaPoint]);

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000 relative">
      {/* 1. CELESTIAL TOOLBOX */}
      <div className="bg-white rounded-[40px] p-10 border border-[#f1ebe6] shadow-sm flex flex-col xl:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-8 w-full lg:w-auto">
            <div className="w-20 h-20 bg-orange-50 rounded-[28px] flex items-center justify-center shadow-inner group">
              <ChartBarIcon className="w-10 h-10 text-orange-500 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter leading-tight">Natal Matrix</h2>
              <div className="flex items-center gap-3 mt-1">
                 <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheckIcon className="w-4 h-4" /> Ephemeris Sync
                 </span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ayanamsa: Lahiri</span>
              </div>
            </div>
         </div>

         <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full md:w-[340px]">
               <select 
                 value={selectedVarga} 
                 onChange={(e) => { setSelectedVarga(parseInt(e.target.value)); setSelectedPoint(null); }} 
                 className="w-full bg-[#fcf8f5] border border-[#f1ebe6] rounded-[24px] px-8 py-5 text-sm font-black text-slate-800 appearance-none cursor-pointer hover:bg-white transition-all outline-none"
               >
                  {VARGA_LIST.map(v => (<option key={v.value} value={v.value}>{v.label}</option>))}
               </select>
               <ChevronDownIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 pointer-events-none" />
            </div>

            <button 
              onClick={handleReset} 
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[24px] shadow-2xl active:scale-95 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <ArrowPathIcon className="w-5 h-5" /> Reset Matrix
            </button>
         </div>
      </div>

      {/* 2. MAIN CHART DISPLAY */}
      <div className="max-w-5xl mx-auto w-full">
         <VedicChart 
           chart={activeChart}
           selectedPlanet={selectedPoint}
           onSelectPlanet={setSelectedPoint}
           title={VARGA_LIST.find(v => v.value === selectedVarga)?.label.split(' - ')[0]}
         />
      </div>

      {/* 3. PLANETARY SPECIFICATIONS */}
      <div className="w-full">
         <div className="flex items-center justify-between mb-10 px-6">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mathematical Coordinates</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Precision Ephemeris Data</p>
            </div>
            <button className="flex items-center gap-3 px-8 py-3 bg-white border border-[#f1ebe6] rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm">
               <CloudArrowDownIcon className="w-5 h-5" /> Export Data
            </button>
         </div>
         <PlanetDetailsTable chart={activeChart} />
      </div>

      {/* 4. PLANET DETAIL POPUP */}
      {selectedPoint && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:right-12 md:bottom-12 z-[9999] bg-white border border-orange-100 shadow-2xl p-8 rounded-t-[40px] md:rounded-[40px] animate-in slide-in-from-bottom-20 duration-500 w-full md:max-w-[480px] max-h-[85vh] overflow-y-auto custom-scrollbar">
          <button onClick={() => setSelectedPoint(null)} className="absolute top-8 right-8 p-3 bg-slate-50 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-500 transition-all">
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[24px] bg-orange-50 flex items-center justify-center text-orange-600 font-black text-2xl border border-orange-100 shadow-inner">
                {selectedPoint.planet.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 text-2xl tracking-tight leading-none mb-2">{selectedPoint.planet}</h3>
                <div className="flex flex-wrap gap-2">
                   <span className="text-[9px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg uppercase border border-orange-100">House {selectedPoint.house}</span>
                   {selectedPoint.isRetrograde && <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-lg uppercase border border-rose-100 tracking-widest">Vakri (Rx)</span>}
                   {navamshaDetails?.isVargottama && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase border border-emerald-100 flex items-center gap-1">Vargottama</span>}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20"><Square3Stack3DIcon className="w-6 h-6 text-white" /></div>
                  <h4 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.3em]">Navamsha Core Alignment</h4>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-2">D9 Sign</p>
                     <ZodiacIcon sign={navamshaDetails?.d9Sign || Sign.Aries} className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                     <span className="text-[10px] font-black text-slate-800 uppercase">{SIGN_NAMES[navamshaDetails?.d9Sign || Sign.Aries]}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center flex flex-col justify-center">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-2">D9 House</p>
                     <span className="text-2xl font-black text-emerald-600 leading-none">H{navamshaDetails?.d9House}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 text-center flex flex-col justify-center">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Resonance</p>
                     <span className="text-[10px] font-black uppercase text-emerald-700 leading-tight">Stable</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="p-5 bg-[#fcf8f5] rounded-[24px] border border-[#f1ebe6]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                     <InformationCircleIcon className="w-5 h-5 text-orange-400" /> Significance Note
                  </p>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    Planetary energy manifesting through {SIGN_NAMES[selectedPoint.sign]}. Dignity is {selectedPoint.dignity || 'Neutral'}. Focus on physical integration.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nakshatra</p>
                    <p className="text-base font-black text-slate-800">{selectedPoint.nakshatra}</p>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">Pada {selectedPoint.pada}</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Coordinates</p>
                    <div className="flex items-center justify-center gap-1.5">
                       <ZodiacIcon sign={selectedPoint.sign} className="w-5 h-5 text-indigo-400" />
                       <p className="text-sm font-black text-slate-800 font-mono">{formatDegrees(selectedPoint.degree)}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalChartView;
