import { PublicNavbar } from "@/components/navigation/public-navbar";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNavbar />
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8 text-center">About Us</h1>
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            We are a dedicated team of researchers and software engineers focused on building the next generation of Anti-Money Laundering (AML) solutions.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Our Trade-Based Money Laundering (TBML) Detection System leverages advanced Heterogeneous Graph Neural Networks (GNNs) and real-time streaming to identify complex fraud patterns that traditional rule-based systems miss.
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            To empower financial institutions and regulatory bodies with state-of-the-art AI tools, ensuring a safer and more transparent global trading environment.
          </p>
        </div>
      </main>
    </div>
  );
}
