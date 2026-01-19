import React from 'react';
import { UserProfile } from '../types';
// Added ArrowPathIcon to the imports from @heroicons/react/24/outline
import { 
  UserCircleIcon, 
  IdentificationIcon, 
  CalendarDaysIcon, 
  MapPinIcon, 
  CheckBadgeIcon, 
  SparklesIcon, 
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ClockIcon,
  PlusCircleIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { SIGN_NAMES } from '../constants';

interface Props {
  profile: UserProfile;
  profiles: UserProfile[];
  onSwitch: (id: string) => void;
  onLogout: () => void;
  onAddProfile: () => void;
}

const ProfileView: React.FC<Props> = ({ profile, profiles, onSwitch, onLogout, onAddProfile }) => {
  const account = profile.account;
  const birth = profile.birthData;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-white p-10 rounded-[48px] border border-[#f1ebe6] shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
           <div className="relative group">
              <div className="w-32 h-32 rounded-[40px] border-4 border-[#fcf8f5] shadow-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                 <img src={account.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Avatar" />
              </div>
              {profile.isVerified && (
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full p-2 border-4 border-white shadow-lg">
                   <CheckBadgeIcon className="w-5 h-5" />
                </div>
              )}
           </div>
           <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <h2 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter leading-none">{account.username}</h2>
                 <span className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">Master ID Active</span>
              </div>
              <p className="text-slate-400 font-bold text-lg">{account.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                 <span className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-orange-400" /> Member since {new Date(account.joinedDate).getFullYear()}</span>
                 <span className="w-1 h-1 bg-slate-200 rounded-full" />
                 <span className="flex items-center gap-2 text-emerald-600"><ShieldCheckIcon className="w-4 h-4" /> Account Verified</span>
              </div>
           </div>
        </div>

        <div className="flex gap-4">
           <button onClick={onLogout} className="px-8 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-3 active:scale-95">
              <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
           </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* 2. MULTI-PROFILE IDENTITIES */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-6">
            <div className="space-y-1">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Cosmic Identities</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Manage multiple chart profiles</p>
            </div>
            <button 
              onClick={onAddProfile}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
            >
               <PlusCircleIcon className="w-4 h-4" /> Add Profile
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div 
                key={p.id} 
                onClick={() => p.id !== profile.id && onSwitch(p.id)}
                className={`group p-8 rounded-[40px] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden h-full ${
                  p.id === profile.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-xl' 
                    : 'bg-white border-slate-50 hover:border-orange-100 hover:shadow-lg'
                }`}
              >
                 <div className="flex justify-between items-start mb-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-transform group-hover:scale-110 ${p.id === profile.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                       {p.birthData.name.substring(0, 2).toUpperCase()}
                    </div>
                    {p.id === profile.id && (
                       <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Primary Active</span>
                    )}
                    {p.id !== profile.id && (
                       <div className="p-2.5 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
                          <ArrowsRightLeftIcon className="w-5 h-5" />
                       </div>
                    )}
                 </div>

                 <div className="space-y-1 relative z-10">
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight truncate">{p.birthData.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                       {new Date(p.birthData.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                 </div>

                 <div className="mt-8 pt-6 border-t border-slate-100/50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 flex items-center gap-2"><MapPinIcon className="w-4 h-4" /> {p.birthData.lat.toFixed(1)}°, {p.birthData.lng.toFixed(1)}°</span>
                    <span className={p.id === profile.id ? 'text-indigo-600' : 'text-slate-300 group-hover:text-orange-500'}>
                       {p.id === profile.id ? 'Currently Synchronized' : 'Tap to Switch'}
                    </span>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 3. ACTIVE COORDINATES BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white p-12 rounded-[56px] border border-[#f1ebe6] shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Precision Mapping</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Coordinates for active matrix</p>
                 </div>
                 <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                    <GlobeAltIcon className="w-8 h-8" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <div className="flex items-center gap-6 group/item">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:border-orange-500/50 transition-colors">
                          <CalendarDaysIcon className="w-7 h-7" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Birth Date</p>
                          <p className="text-xl font-black text-slate-800">{new Date(birth.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 group/item">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <ClockIcon className="w-7 h-7" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Birth Time</p>
                          <p className="text-xl font-black text-slate-800">{birth.tob}</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div className="flex items-center gap-6 group/item">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <MapPinIcon className="w-7 h-7" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Longitude</p>
                          <p className="text-xl font-black text-slate-800">{birth.lng.toFixed(4)}° E</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 group/item">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                          <MapPinIcon className="w-7 h-7" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Latitude</p>
                          <p className="text-xl font-black text-slate-800">{birth.lat.toFixed(4)}° N</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 p-8 bg-indigo-50 border border-indigo-100 rounded-[32px]">
                 <p className="text-sm font-bold text-indigo-900 leading-relaxed italic">
                   "Identity verification ensures that all AI interpretations and planetary strengths are perfectly tuned to your unique spatio-temporal coordinates."
                 </p>
              </div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]" />
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-[#1e1b4b] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black">Protocols</h3>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Engine Configuration</p>
                 </div>
                 <Cog6ToothIcon className="w-10 h-10 text-orange-400" />
              </div>

              <div className="space-y-6 relative z-10 flex-1">
                 <div className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-3xl group cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <SparklesIcon className="w-6 h-6 text-orange-400" />
                       <div>
                          <p className="text-sm font-black">Ayanamsa Model</p>
                          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{profile.preferences.ayanamsa}</p>
                       </div>
                    </div>
                    {/* Fixed "Cannot find name 'ArrowPathIcon'" by adding it to imports */}
                    <ArrowPathIcon className="w-5 h-5 text-white/40 group-hover:rotate-180 transition-transform duration-500" />
                 </div>

                 <div className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-3xl group cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <GlobeAltIcon className="w-6 h-6 text-indigo-400" />
                       <div>
                          <p className="text-sm font-black">Chart Style</p>
                          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{profile.preferences.chartStyle} Indian</p>
                       </div>
                    </div>
                    {/* Fixed "Cannot find name 'ArrowPathIcon'" by adding it to imports */}
                    <ArrowPathIcon className="w-5 h-5 text-white/40 group-hover:rotate-180 transition-transform duration-500" />
                 </div>

                 <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] mt-4">
                    <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-6">Security Layer</h4>
                    <div className="space-y-5">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-200">Private AI Scan</span>
                          <div className="w-10 h-5 bg-emerald-500 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-200">Geo-Lock Sync</span>
                          <div className="w-10 h-5 bg-emerald-500 rounded-full relative shadow-inner"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 relative z-10 pt-8 border-t border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                       <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-[10px] font-black text-indigo-200 leading-relaxed uppercase tracking-widest">
                      Session Integrity Verified by <br/> <span className="text-white">True Ephemeris v4.0</span>
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;