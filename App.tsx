
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  ChatBubbleBottomCenterTextIcon, 
  SparklesIcon, 
  UserCircleIcon, 
  Squares2X2Icon, 
  ClockIcon, 
  TableCellsIcon, 
  ScaleIcon, 
  HeartIcon, 
  BookOpenIcon, 
  CheckBadgeIcon, 
  InformationCircleIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BoltIcon,
  SunIcon,
  ExclamationCircleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  XMarkIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

import { BirthData, DivisionalChart, DashaNode, UserProfile, YogaMatch, ChatMessage, Sign, Planet, TransitContext, PlannerData, ShadbalaData, CompatibilityData, Remedy, KBChunk, ServiceStatus, UserAccount, LoginCredentials } from './types.ts';
import { astrologyService, VarshaphalaData, AshtakavargaData } from './services/astrologyService.ts';
import { geminiService } from './services/geminiService.ts';
import { apiService } from './services/apiService.ts';
import DashasView from './components/DashasView.tsx';
import Align27Dashboard from './components/Align27Dashboard.tsx';
import TodayView from './components/TodayView.tsx';
import PlannerView from './components/PlannerView.tsx';
import StrengthView from './components/StrengthView.tsx';
import CompatibilityView from './components/CompatibilityView.tsx';
import RemediesView from './components/RemediesView.tsx';
import KnowledgeView from './components/KnowledgeView.tsx';
import AshtakavargaView from './components/AshtakavargaView.tsx';
import VarshaphalaView from './components/VarshaphalaView.tsx';
import ChatView from './components/ChatView.tsx';
import PanchangView from './components/PanchangView.tsx';
import BirthDataForm from './components/BirthDataForm.tsx';
import LoginView from './components/LoginView.tsx';
import ProfileView from './components/ProfileView.tsx';
import NatalChartView from './components/NatalChartView.tsx';
import { SIGN_NAMES } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  // Computed active profile
  const profile = useMemo(() => 
    profiles.find(p => p.id === activeProfileId) || profiles[0] || null
  , [profiles, activeProfileId]);

  const [chart, setChart] = useState<DivisionalChart | null>(null);
  const [dashas, setDashas] = useState<DashaNode[]>([]);
  const [yogas, setYogas] = useState<YogaMatch[]>([]);
  const [avData, setAvData] = useState<AshtakavargaData | null>(null);
  const [todayData, setTodayData] = useState<TransitContext | null>(null);
  const [plannerData, setPlannerData] = useState<PlannerData | null>(null);
  const [shadbalaData, setShadbalaData] = useState<ShadbalaData[]>([]);
  const [compatibilityData, setCompatibilityData] = useState<CompatibilityData | null>(null);
  const [remediesData, setRemediesData] = useState<Remedy[]>([]);
  const [kbData, setKbData] = useState<KBChunk[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    astrologyEngine: 'Initializing',
    aiInterpretation: 'Initializing',
    dataIntegrity: 'Unverified'
  });

  const [varshaYear, setVarshaYear] = useState<number>(new Date().getFullYear());
  const [varshaData, setVarshaData] = useState<VarshaphalaData | null>(null);

  // BOOT SEQUENCE
  useEffect(() => {
    const boot = async () => {
      try {
        const acc = await apiService.getAccount();
        if (acc) {
          setUserAccount(acc);
          setIsLoggedIn(true);
          const savedProfiles = await apiService.getProfiles();
          const activeId = await apiService.getActiveProfileId();
          setProfiles(savedProfiles);
          if (activeId) setActiveProfileId(activeId);
          else if (savedProfiles.length > 0) setActiveProfileId(savedProfiles[0].id);
        }
      } finally {
        setTimeout(() => setIsInitializing(false), 400);
      }
    };
    boot();
  }, []);

  // HYDRATION ON PROFILE CHANGE
  useEffect(() => {
    if (profile) {
      const d1 = astrologyService.calculateNatalChart(profile.birthData);
      setChart(d1);
      setDashas(astrologyService.getVimshottariDashas(profile.birthData, 3));
      setAvData(astrologyService.calculateAshtakavarga(d1));
      setTodayData(astrologyService.getTodayData(profile.birthData));
      setPlannerData(astrologyService.getPlannerData(profile.birthData));
      const sbData = astrologyService.calculateShadbala(profile.birthData);
      setShadbalaData(sbData);
      setRemediesData(astrologyService.generateRemedies(sbData, d1));
      setKbData(astrologyService.getKnowledgeBase());
      setYogas(astrologyService.detectYogas(d1));
      setVarshaData(astrologyService.calculateVarshaphala(profile.birthData, varshaYear));
      
      setServiceStatus({
        astrologyEngine: 'Operational',
        aiInterpretation: 'Operational',
        dataIntegrity: 'Verified'
      });
    }
  }, [profile, varshaYear]);

  const handleLogin = async (creds: LoginCredentials) => {
    setIsSyncing(true);
    try {
      const user = await apiService.login(creds);
      setUserAccount(user);
      setIsLoggedIn(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    setIsLoggedIn(false);
    setUserAccount(null);
    setProfiles([]);
    setActiveProfileId(null);
    setChart(null);
  };

  const handleSwitchProfile = async (id: string) => {
    setIsSyncing(true);
    await apiService.setActiveProfileId(id);
    setActiveProfileId(id);
    setCompatibilityData(null); // Clear compatibility when user changes
    setTimeout(() => setIsSyncing(false), 600);
  };

  const handleAddProfile = async (birthData: BirthData) => {
    if (!userAccount) return;
    setIsSyncing(true);
    try {
      const newId = `profile-${Date.now()}`;
      const newProfile: UserProfile = {
        id: newId,
        account: userAccount,
        birthData,
        preferences: { ayanamsa: 'Lahiri', chartStyle: 'North' },
        isVerified: true
      };
      const updatedProfiles = [...profiles, newProfile];
      await apiService.saveProfiles(updatedProfiles);
      await apiService.setActiveProfileId(newId);
      setProfiles(updatedProfiles);
      setActiveProfileId(newId);
      setShowInputForm(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCalculateCompatibility = async (partnerData: BirthData) => {
    if (!profile) return;
    setIsSyncing(true);
    try {
      // Small simulation delay for UX
      await new Promise(resolve => setTimeout(resolve, 1200));
      const result = astrologyService.calculateCompatibility(profile.birthData, partnerData);
      setCompatibilityData(result);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleMobileTab = (id: string) => {
    setActiveTab(id);
    setIsMobileMoreOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!chart || !profile) return;
    const userMsg: ChatMessage = { role: 'user', content };
    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);
    try {
      const lagna = chart.points.find(p => p.planet === Planet.Lagna);
      const ctx = {
        lagna: lagna ? `${SIGN_NAMES[lagna.sign]}` : 'Unknown',
        planets: chart.points.map(p => ({ p: p.planet, s: SIGN_NAMES[p.sign], h: p.house })),
        activeDasha: dashas[0]?.planet || 'Unknown',
        yogas: yogas.slice(0, 2)
      };
      const response = await geminiService.chat([...chatHistory, userMsg], ctx);
      setChatHistory(prev => [...prev, response]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const navModules = [
    { section: 'CORE', items: [
      { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
      { id: 'panchang', label: 'Panchang', icon: SunIcon },
      { id: 'today', label: 'Today', icon: ClockIcon },
      { id: 'planner', label: 'Planner', icon: CalendarDaysIcon }
    ]},
    { section: 'ASTROLOGY', items: [
      { id: 'charts', label: 'Natal Matrix', icon: ChartBarIcon },
      { id: 'dashas', label: 'Dashas', icon: CalendarDaysIcon },
      { id: 'ashtakavarga', label: 'Ashtakavarga', icon: TableCellsIcon }
    ]},
    { section: 'ANALYSIS', items: [
      { id: 'strength', label: 'Strength', icon: ScaleIcon },
      { id: 'varshaphala', label: 'Varshaphala', icon: SparklesIcon },
      { id: 'compatibility', label: 'Compatibility', icon: HeartIcon },
      { id: 'remedies', label: 'Remedies', icon: SparklesIcon }
    ]},
    { section: 'INTELLIGENCE', items: [
      { id: 'knowledge', label: 'Knowledge', icon: BookOpenIcon },
      { id: 'chat', label: 'Oracle Chat', icon: ChatBubbleBottomCenterTextIcon }
    ]},
    { section: 'ACCOUNT', items: [
      { id: 'profile', label: 'Settings', icon: UserCircleIcon }
    ]}
  ];

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-[#fdfcfb] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
           <SparklesIcon className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Matrix</p>
      </div>
    );
  }

  if (!isLoggedIn) return <LoginView onLogin={handleLogin} />;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#fdfcfb] text-slate-600">
      {isSyncing && (
        <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">Recalculating Ephemeris...</p>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-white border-r border-[#f1ebe6] flex-col overflow-hidden transition-all duration-300 ease-in-out relative`}>
        <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-lg font-black text-slate-800 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            Astro<span className="text-orange-500"> Jyotish</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navModules.map((group) => (
            <div key={group.section} className="space-y-1">
              <p className={`text-[9px] font-black text-slate-400 mb-2 px-4 tracking-[0.2em] uppercase transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                {group.section}
              </p>
              {group.items.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center transition-all duration-300 rounded-xl interactive-element ${activeTab === item.id ? 'sidebar-active text-white' : 'text-slate-700 hover:bg-orange-50 hover:text-orange-500'} ${isSidebarCollapsed ? 'justify-center py-4 px-0' : 'px-4 py-3'}`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm font-semibold ml-3">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#f1ebe6]">
           <button onClick={handleLogout} className={`w-full flex items-center transition-all duration-300 rounded-xl ${isSidebarCollapsed ? 'justify-center py-4' : 'px-4 py-3'} text-rose-500 hover:bg-rose-50`}>
              <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm font-bold ml-3">Terminate Session</span>}
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden pb-20 lg:pb-0">
        <header className="h-14 lg:h-16 bg-white border-b border-[#f1ebe6] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="lg:hidden w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white"><SparklesIcon className="w-5 h-5" /></div>
             <h2 className="text-sm lg:text-base font-black text-slate-800 capitalize tracking-tight">
                {activeTab === 'dashboard' ? 'Flow State' : activeTab.replace('-', ' ')}
             </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => setShowInputForm(true)} className="p-2 text-slate-400 hover:text-orange-500 transition-colors" title="Add Profile">
              <PlusCircleIcon className="w-6 h-6" />
            </button>
            <div onClick={() => setActiveTab('profile')} className="flex items-center gap-3 bg-[#fcf8f5] border border-[#f1ebe6] rounded-xl px-2 lg:px-4 py-1.5 interactive-element cursor-pointer group">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 overflow-hidden">
                  <img src={userAccount?.avatar} className="w-full h-full object-cover" />
                </div>
                {profile?.isVerified && <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white"><CheckBadgeIcon className="w-2 h-2" /></div>}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-black text-slate-800 uppercase leading-none">{profile?.birthData.name || 'Anonymous'}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Active Matrix</p>
              </div>
              <ChevronDownIcon className="w-3 h-3 text-slate-400 group-hover:text-orange-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#fdfcfb] custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {showInputForm && (
              <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setShowInputForm(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <BirthDataForm onCalculate={handleAddProfile} />
              </div>
            )}

            {!profile && !showInputForm && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center text-orange-500"><SparklesIcon className="w-10 h-10" /></div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Identity Not Established</h2>
                <button onClick={() => setShowInputForm(true)} className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl">Initialize Matrix</button>
              </div>
            )}

            {profile && (
              <div className="space-y-12">
                {activeTab === 'dashboard' && <Align27Dashboard data={todayData} userName={profile?.birthData.name} />}
                {activeTab === 'panchang' && todayData && <PanchangView data={todayData.panchang} />}
                {activeTab === 'today' && todayData && <TodayView data={todayData} />}
                {activeTab === 'planner' && plannerData && <PlannerView data={plannerData} />}
                {activeTab === 'charts' && chart && <NatalChartView natalChart={chart} birthData={profile.birthData} />}
                {activeTab === 'dashas' && <DashasView nodes={dashas} />}
                {activeTab === 'varshaphala' && varshaData && <VarshaphalaView data={varshaData} onYearChange={setVarshaYear} />}
                {activeTab === 'ashtakavarga' && avData && <AshtakavargaView data={avData} />}
                {activeTab === 'strength' && shadbalaData.length > 0 && <StrengthView data={shadbalaData} />}
                {activeTab === 'compatibility' && <CompatibilityView data={compatibilityData} onReset={() => setCompatibilityData(null)} onCalculate={handleCalculateCompatibility} />}
                {activeTab === 'remedies' && remediesData.length > 0 && <RemediesView data={remediesData} />}
                {activeTab === 'knowledge' && kbData.length > 0 && <KnowledgeView data={kbData} />}
                {activeTab === 'chat' && <ChatView messages={chatHistory} onSendMessage={handleSendMessage} isLoading={isChatLoading} />}
                {activeTab === 'profile' && (
                  <ProfileView 
                    profile={profile} 
                    profiles={profiles}
                    onSwitch={handleSwitchProfile}
                    onLogout={handleLogout} 
                    onAddProfile={() => setShowInputForm(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* MOBILE NAV */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around z-50">
           <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-orange-500' : 'text-slate-400'}`}><HomeIcon className="w-6 h-6" /><span className="text-[9px] font-black uppercase mt-1">Home</span></button>
           <button onClick={() => setActiveTab('charts')} className={`flex flex-col items-center ${activeTab === 'charts' ? 'text-orange-500' : 'text-slate-400'}`}><GlobeAltIcon className="w-6 h-6" /><span className="text-[9px] font-black uppercase mt-1">Matrix</span></button>
           <button onClick={() => setIsMobileMoreOpen(true)} className="flex flex-col items-center text-slate-400"><Squares2X2Icon className="w-6 h-6" /><span className="text-[9px] font-black uppercase mt-1">Explore</span></button>
        </nav>
      </main>
    </div>
  );
};

export default App;
