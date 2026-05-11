import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { getCurrentUser } from '@/lib/auth'

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative overflow-hidden">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-400/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] bg-cyan-400/10 rounded-full blur-[100px] animate-[pulse_6s_ease-in-out_infinite]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMTAwaDQwTTAgMjBoNDBNMTAgMHY0ME0yMCAwdjQwIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none" />

      {/* Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-12">
        
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 pr-12 h-full">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm backdrop-blur-md mb-8">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">System Operational</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Advanced threat detection for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">modern trade.</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              Securely access the AML operations console. Monitor real-time transaction streams, manage fraud reviews, and streamline compliance workflows with AI-driven insights.
            </p>
            
            {/* Floating Feature Cards */}
            <div className="grid grid-cols-2 gap-5 max-w-lg">
              <div className="group p-5 rounded-2xl bg-white/60 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md hover:bg-white/80 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-sky-600 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Real-time Monitoring</h3>
                <p className="text-sm text-slate-600">Detect anomalies instantly with ML streams.</p>
              </div>
              <div className="group p-5 rounded-2xl bg-white/60 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md hover:bg-white/80 transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: '300ms' }}>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-indigo-600 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                </div>
                <h3 className="text-slate-900 font-bold mb-1">Risk Analytics</h3>
                <p className="text-sm text-slate-600">Intelligent scoring for high-value trades.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-[480px] flex-shrink-0 fade-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
            <div className="lg:hidden mb-8 text-center">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                TB<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">ML</span>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
