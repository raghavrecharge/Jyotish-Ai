
import React, { useState } from 'react';
import { BirthData } from '../types';
import { 
  UserIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  BoltIcon,
  // Added ShieldCheckIcon to fix missing icon error
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { astrologyService } from '../services/astrologyService';

interface Props {
  onCalculate: (data: BirthData) => Promise<void>;
  initialData?: BirthData | null;
}

const BirthDataForm: React.FC<Props> = ({ onCalculate, initialData }) => {
  const [formData, setFormData] = useState<BirthData>(initialData || {
    name: '',
    dob: '',
    tob: '',
    lat: 28.6139,
    lng: 77.2090,
    tz: 'Asia/Kolkata'
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = astrologyService.validateBirthData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    setIsSubmitting(true);
    try {
      await onCalculate({ ...formData, isVerified: true });
    } catch (err) {
      setErrors(["Cosmic synchronization failed. Please check your network."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[48px] border border-[#f1ebe6] p-10 lg:p-14 shadow-2xl animate-in fade-in zoom-in-95 duration-700 max-w-4xl mx-auto overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
         <GlobeAltIcon className="w-64 h-64 text-orange-950" />
      </div>

      <div className="relative z-10">
        <div className="text-center space-y-6 mb-16">
          <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600 mx-auto shadow-inner border border-indigo-100 group">
            <AcademicCapIcon className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">Identity Initialization</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Establish your unique spatial-temporal coordinates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {errors.length > 0 && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-[24px] flex items-start gap-4">
              <ExclamationCircleIcon className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Protocol Restriction</p>
                <ul className="text-xs font-bold text-rose-500 list-disc list-inside opacity-90">
                  {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                 <UserIcon className="w-4 h-4 text-orange-400" /> Seeker Signature
              </label>
              <input 
                type="text" 
                required
                disabled={isSubmitting}
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-5 bg-[#fcf8f5] border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-3xl outline-none text-base font-bold text-slate-800 transition-all shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                   <CalendarDaysIcon className="w-4 h-4 text-indigo-400" /> Solar Date
                </label>
                <input 
                  type="date" 
                  required
                  disabled={isSubmitting}
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-6 py-5 bg-[#fcf8f5] border-2 border-transparent focus:border-indigo-200 focus:bg-white rounded-3xl outline-none text-sm font-bold text-slate-800 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                   <ClockIcon className="w-4 h-4 text-emerald-400" /> Exact Time
                </label>
                <input 
                  type="time" 
                  required
                  disabled={isSubmitting}
                  value={formData.tob}
                  onChange={e => setFormData({...formData, tob: e.target.value})}
                  className="w-full px-6 py-5 bg-[#fcf8f5] border-2 border-transparent focus:border-emerald-200 focus:bg-white rounded-3xl outline-none text-sm font-bold text-slate-800 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                 <MapPinIcon className="w-4 h-4 text-rose-400" /> Geographic Latitude
              </label>
              <input 
                type="number" 
                step="any"
                required
                disabled={isSubmitting}
                placeholder="28.6139"
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                className="w-full px-6 py-5 bg-[#fcf8f5] border-2 border-transparent focus:border-rose-200 focus:bg-white rounded-3xl outline-none text-base font-bold text-slate-800 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                 <GlobeAltIcon className="w-4 h-4 text-blue-400" /> Geographic Longitude
              </label>
              <input 
                type="number" 
                step="any"
                required
                disabled={isSubmitting}
                placeholder="77.2090"
                value={formData.lng}
                onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                className="w-full px-6 py-5 bg-[#fcf8f5] border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-3xl outline-none text-base font-bold text-slate-800 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center gap-6 border-t border-slate-50">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-[#2d2621] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-slate-900/20 hover:bg-[#f97316] hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-80 flex items-center justify-center gap-4 group/btn"
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="w-6 h-6 animate-spin" />
                  Calibrating Ephemeris...
                </>
              ) : (
                <>
                  Initialize Matrix <BoltIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
            <div className="flex items-center gap-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-emerald-400" /> Lahiri Sync</span>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1.5"><SparklesIcon className="w-4 h-4 text-orange-400" /> Siderial Engine v4.0</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthDataForm;
