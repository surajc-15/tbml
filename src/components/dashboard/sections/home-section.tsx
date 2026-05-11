import { Shield, TrendingUp, Zap, Users, CheckCircle2, Lock, BarChart3, AlertCircle } from 'lucide-react';

function FeatureCard({ Icon, title, description, bgColor }: any) {
  return (
    <div className="group p-6 md:p-8 rounded-2xl border border-white/40 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${bgColor} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-base text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: any) {
  return (
    <div className="relative overflow-hidden group p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{value}</div>
      <p className="relative z-10 text-sm md:text-base font-medium text-sky-200 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export function HomeSection() {
  return (
    <div className="min-h-full w-full bg-slate-50 fade-up relative overflow-hidden">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[150px] pointer-events-none animate-[pulse_12s_ease-in-out_infinite_reverse]" />
      
      {/* Hero Section */}
      <div className="relative z-10 px-4 md:px-8 lg:px-16 py-12 md:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 backdrop-blur-sm border border-sky-200 text-sky-700 text-sm font-semibold shadow-sm fade-up">
              <Shield size={16} className="text-sky-600" />
              <span>Enterprise-Grade AML Compliance</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] fade-up" style={{ animationDelay: '100ms' }}>
              Next-Gen Trade-Based <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600">
                Money Laundering Detection
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed fade-up" style={{ animationDelay: '200ms' }}>
              Secure your institution with an AI-powered platform designed to detect and prevent complex TBML schemes in real-time.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-4 fade-up" style={{ animationDelay: '300ms' }}>
              <div className="inline-flex items-center gap-2 text-slate-700 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>Real-time Detection</span>
              </div>
              <div className="inline-flex items-center gap-2 text-slate-700 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>FATF Compliant</span>
              </div>
              <div className="inline-flex items-center gap-2 text-slate-700 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>GNN Powered Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-8 md:mb-16">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              Icon={Zap}
              title="Real-time Monitoring"
              description="Monitor transactions as they occur with instant flagging of suspicious patterns."
              bgColor="bg-sky-100 text-sky-700 group-hover:bg-sky-700 group-hover:text-white"
            />
            <FeatureCard
              Icon={Shield}
              title="Advanced Analytics"
              description="Machine learning algorithms identify sophisticated TBML schemes with high accuracy."
              bgColor="bg-green-100 text-green-700 group-hover:bg-green-700 group-hover:text-white"
            />
            <FeatureCard
              Icon={BarChart3}
              title="Risk Scoring"
              description="Intelligent risk scoring engine provides confidence levels on transaction verdicts."
              bgColor="bg-purple-100 text-purple-700 group-hover:bg-purple-700 group-hover:text-white"
            />
            <FeatureCard
              Icon={Users}
              title="Team Collaboration"
              description="Multi-user system with role-based access control for analysts and admins."
              bgColor="bg-blue-100 text-blue-700 group-hover:bg-blue-700 group-hover:text-white"
            />
            <FeatureCard
              Icon={AlertCircle}
              title="Alert Management"
              description="Comprehensive alert system with customizable rules and escalation workflows."
              bgColor="bg-orange-100 text-orange-700 group-hover:bg-orange-700 group-hover:text-white"
            />
            <FeatureCard
              Icon={Lock}
              title="Regulatory Compliance"
              description="Built to comply with FATF, FinCEN, OFAC, and international AML/CFT standards."
              bgColor="bg-red-100 text-red-700 group-hover:bg-red-700 group-hover:text-white"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-4 md:px-8 lg:px-16 py-12 md:py-16 bg-linear-to-r from-sky-900 to-sky-800 mx-4 md:mx-8 lg:mx-16 rounded-xl md:rounded-2xl my-8 md:my-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatCard value="99.8%" label="Detection Accuracy" />
            <StatCard value="<100ms" label="Response Time" />
            <StatCard value="24/7" label="Real-time Monitoring" />
            <StatCard value="500+" label="Institutions" />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 md:px-8 lg:px-16 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
            Ready to Strengthen Your Compliance?
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed px-2">
            Access the dashboard to start monitoring transactions, managing users, and generating compliance reports.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <a
              href="/dashboard?section=dashboard"
              className="w-full md:w-auto px-6 md:px-8 py-3 rounded-lg bg-sky-700 text-white font-semibold hover:bg-sky-800 transition-colors shadow-lg text-center"
            >
              Go to Dashboard
            </a>
            <a
              href="#"
              className="w-full md:w-auto px-6 md:px-8 py-3 rounded-lg border-2 border-sky-700 text-sky-700 font-semibold hover:bg-sky-50 transition-colors text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-8 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm md:text-base text-slate-600">
            Trusted by leading financial institutions worldwide. Enterprise-grade security and compliance guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}

