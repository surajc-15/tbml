function AboutCard({ title, content }: any) {
  return (
    <div className="rounded-xl md:rounded-2xl border border-white/40 px-5 md:px-6 lg:px-8 py-5 md:py-6 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <h3 className="font-bold text-slate-900 text-base md:text-lg">{title}</h3>
      <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}

function FeatureList() {
  const features = [
    'Advanced machine learning algorithms',
    'Real-time transaction monitoring',
    'Comprehensive compliance reporting',
    'Expert support team',
    'Proven track record with major institutions',
  ];
  return (
    <div className="rounded-xl md:rounded-2xl border border-white/40 px-5 md:px-6 lg:px-8 py-5 md:py-6 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <h3 className="font-bold text-slate-900 text-base md:text-lg mb-4">Why Choose Us</h3>
      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-slate-600">
            <span className="text-green-600 font-bold flex-shrink-0">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutUsSection() {
  return (
    <div className="h-full w-full p-4 md:p-6 lg:p-8 bg-slate-50 fade-up">
      <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 px-6 md:px-8 py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-sky-700 font-semibold">About</p>
          <h2 className="mt-2 md:mt-3 text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">About TBML</h2>
          <p className="mt-2 md:mt-3 text-sm md:text-base text-slate-600">
            Learn more about our mission and commitment to combating money laundering.
          </p>
        </section>

        {/* About Cards */}
        <div className="space-y-4 md:space-y-6">
          <AboutCard
            title="Our Mission"
            content="TBML is dedicated to providing advanced anti-money laundering solutions to financial institutions worldwide. We help banks and financial services companies detect and prevent suspicious activities with cutting-edge technology and compliance expertise."
          />
          <AboutCard
            title="Our Approach"
            content="We combine artificial intelligence, machine learning, and regulatory expertise to create intelligent AML solutions. Our platform monitors transactions in real-time, identifies potential risks, and helps maintain compliance with global regulations including FATF, FinCEN, and OFAC requirements."
          />
          <FeatureList />
        </div>
      </div>
    </div>
  );
}
