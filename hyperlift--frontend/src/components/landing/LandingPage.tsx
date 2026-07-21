import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity, FiTarget, FiTrendingUp, FiUsers, FiShield,
  FiZap, FiBarChart2, FiCalendar, FiMenu, FiX,
  FiArrowRight, FiCheckCircle, FiStar, FiChevronRight,
  FiPlay, FiSmartphone, FiLayers, FiAward,
} from 'react-icons/fi';
import { GiWeightLiftingUp, GiMuscleUp, GiRunningShoe, GiMeditation } from 'react-icons/gi';

const HERO_BG   = 'https://images.pexels.com/photos/17706044/pexels-photo-17706044.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600';
const FEAT_IMG  = 'https://hips.hearstapps.com/hmg-prod/images/cq5dam-ss20-trn-projrock-dj-shot-2-0449-scrn-v-2-1614961199.jpeg?crop=1xw:0.8453125xh;0,0.152xh&resize=980:*';
const CTA_IMG   = 'https://flex-web-media-prod.storage.googleapis.com/2024/11/man-at-gym.jpg';
const TEST_1    = 'https://images.pexels.com/photos/11433060/pexels-photo-11433060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300';
const TEST_2    = 'https://images.pexels.com/photos/35540076/pexels-photo-35540076.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300';
const TEST_3    = 'https://images.pexels.com/photos/12890881/pexels-photo-12890881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=300';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(id); }
      else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [visible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const nav = (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60 shadow-2xl shadow-black/40' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 py-4">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <GiWeightLiftingUp className="text-3xl text-orange-500 transition-transform group-hover:rotate-[-8deg]" />
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Hyper<span className="text-orange-500">Lift</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors no-underline">Features</a>
          <a href="#how" className="hover:text-white transition-colors no-underline">How It Works</a>
          <a href="#testimonials" className="hover:text-white transition-colors no-underline">Testimonials</a>
          <a href="#pricing" className="hover:text-white transition-colors no-underline">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors no-underline">Sign In</Link>
          <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25 no-underline">Get Started Free</Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-white text-2xl">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/60 px-5 pb-6 pt-2 animate-slide-down space-y-3">
          <a href="#features" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white no-underline">Features</a>
          <a href="#how" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white no-underline">How It Works</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white no-underline">Testimonials</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="block py-2 text-gray-300 hover:text-white no-underline">Pricing</a>
          <div className="flex gap-3 pt-3 border-t border-gray-800">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-gray-300 border border-gray-700 py-2.5 rounded-xl text-sm font-medium no-underline">Sign In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold no-underline">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <div className="bg-gray-950 min-h-screen overflow-hidden">
      {nav}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/70 to-gray-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-transparent to-gray-950/90" />
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/8 rounded-full blur-[150px] animate-float-delayed" />

        <div className="relative z-10 max-w-6xl mx-auto text-center px-5 pt-28 pb-16">
          <div className="animate-slide-up inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-8">
            <FiZap className="text-orange-400 text-sm" />
            <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">#1 Workout Tracker of 2026</span>
          </div>
          
          <h1 className="animate-slide-up-delay-1 text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
            Elevate Every<br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Rep. Set. PR.
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"><path d="M2 10C50 2 250 2 298 10" stroke="url(#ug)" strokeWidth="3" strokeLinecap="round"/><defs><linearGradient id="ug" x1="0" y1="0" x2="300" y2="0"><stop stopColor="#f97316"/><stop offset="1" stopColor="#ef4444"/></linearGradient></defs></svg>
            </span>
          </h1>

          <p className="animate-slide-up-delay-2 max-w-2xl mx-auto mt-7 text-gray-400 text-lg sm:text-xl leading-relaxed">
            The intelligent fitness platform that adapts to <em className="text-white not-italic font-medium">your goals</em>. 
            Log workouts, track progress, follow custom plans — and crush your personal records.
          </p>

          <div className="animate-slide-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/register" className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-0.5 no-underline flex items-center gap-2">
              Start Training Free <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#how" className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors no-underline">
              <span className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
                <FiPlay className="text-orange-500 ml-0.5" />
              </span>
              See How It Works
            </a>
          </div>


          <div className="animate-slide-up-delay-4 mt-16 flex flex-wrap justify-center gap-x-10 gap-y-4 text-gray-500 text-sm">
            <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Free forever plan</span>
            <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> No credit card</span>
            <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Works offline</span>
            <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> 50K+ athletes</span>
          </div>
        </div>


        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>

      <section className="relative -mt-4 z-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-pulse-glow">
            {[
              { val: 50000, suf: '+', label: 'Active Athletes' },
              { val: 2, suf: 'M+', label: 'Workouts Logged' },
              { val: 850, suf: '+', label: 'Exercises' },
              { val: 99, suf: '%', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-extrabold text-orange-500"><Counter end={s.val} suffix={s.suf} /></p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <SectionLabel icon={<FiZap />} text="Why HyperLift" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-center mt-4 leading-tight">
            Everything You Need to<br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Dominate Your Fitness</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 text-center mt-5 text-lg">
            From beginners to advanced lifters — HyperLift gives you the tools to track, plan, and progress like never before.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
            {[
              { icon: <FiActivity />,    color: 'orange', title: 'Smart Workout Logging',    desc: 'Record sets, reps and weight with lightning speed. Never miss a session again.' },
              { icon: <FiTarget />,       color: 'blue',   title: 'Custom Training Plans',    desc: 'Build weekly splits tailored to your goals — bulk, cut, maintain, or compete.' },
              { icon: <FiTrendingUp />,   color: 'green',  title: 'Visual Progress Tracking', desc: 'See your strength gains over time with intuitive charts and personal records.' },
              { icon: <FiBarChart2 />,    color: 'purple', title: 'Performance Analytics',    desc: 'Get insights into volume, frequency, and recovery to optimize every session.' },
              { icon: <FiCalendar />,     color: 'pink',   title: 'Workout Calendar',         desc: 'Visualize your training schedule and keep your consistency streak alive.' },
              { icon: <FiShield />,       color: 'red',    title: 'Admin Control Panel',      desc: 'Manage users, exercises, and content with a powerful admin dashboard.' },
            ].map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <RevealBlock>
            <div className="relative">
              <img src={FEAT_IMG} alt="Athlete training" className="rounded-2xl w-full object-cover shadow-2xl shadow-black/50" />
              <div className="absolute -bottom-5 -right-5 bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center"><FiTrendingUp className="text-green-400" /></div>
                  <div><p className="text-white text-sm font-bold">+24 kg</p><p className="text-gray-500 text-xs">Bench PR this month</p></div>
                </div>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock>
            <SectionLabel icon={<FiLayers />} text="Built Different" align="left" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-snug">
              Train Smarter,<br />Not Just Harder
            </h2>
            <p className="text-gray-400 mt-5 text-lg leading-relaxed">
              HyperLift combines intelligent exercise cataloging, customizable plans, and real-time progress insights so every session is deliberate and effective.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                '850+ exercises with muscle-group tagging',
                'Weekly split builder with drag-and-drop',
                'PR notifications & milestone badges',
                'Offline mode — sync when back online',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <FiCheckCircle className="text-orange-500 mt-1 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25 no-underline">
              Start for Free <FiChevronRight />
            </Link>
          </RevealBlock>
        </div>
      </section>

      <section id="how" className="py-24 sm:py-32 bg-gradient-to-b from-gray-950 via-gray-900/40 to-gray-950">
        <div className="max-w-6xl mx-auto px-5 md:px-10 text-center">
          <SectionLabel icon={<FiSmartphone />} text="Get Started in 3 Steps" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 leading-tight">
            From Zero to <span className="text-orange-500">Hero</span> in Minutes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { step: '01', icon: <FiUsers />,       title: 'Create Account',   desc: 'Sign up in seconds — no credit card needed. Set your goals and preferences.' },
              { step: '02', icon: <FiActivity />,     title: 'Log Workouts',     desc: 'Choose from 850+ exercises, build sets & reps, and save your session instantly.' },
              { step: '03', icon: <FiTrendingUp />,   title: 'Track & Grow',     desc: 'Watch your progress unfold with analytics, PRs, and streak tracking.' },
            ].map((s, i) => (
              <RevealBlock key={i}>
                <div className="relative bg-gray-900/80 border border-gray-800 rounded-2xl p-8 hover:border-orange-500/30 transition-all group">
                  <span className="absolute -top-4 left-6 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{s.step}</span>
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 text-2xl mx-auto mb-5 group-hover:bg-orange-500/20 transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 text-center">
          <SectionLabel icon={<GiMuscleUp />} text="Exercise Library" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Every Muscle Group. <span className="text-orange-500">Covered.</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              { icon: <GiMuscleUp />,       name: 'Chest',     count: 45 },
              { icon: <GiWeightLiftingUp />, name: 'Back',      count: 52 },
              { icon: <FiTarget />,          name: 'Shoulders', count: 38 },
              { icon: <FiActivity />,        name: 'Arms',      count: 64 },
              { icon: <GiRunningShoe />,     name: 'Legs',      count: 58 },
              { icon: <GiMeditation />,      name: 'Core',      count: 42 },
            ].map((g, i) => (
              <RevealBlock key={i}>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-orange-500/40 hover:bg-gray-900/80 transition-all cursor-pointer group">
                  <div className="text-3xl text-orange-500 mb-3 group-hover:scale-110 transition-transform">{g.icon}</div>
                  <p className="text-white font-bold text-sm">{g.name}</p>
                  <p className="text-gray-600 text-xs mt-1">{g.count}+ exercises</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 sm:py-32 bg-gradient-to-b from-gray-950 via-gray-900/30 to-gray-950">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <SectionLabel icon={<FiStar />} text="Loved by Athletes" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white text-center mt-4">
            What Our <span className="text-orange-500">Community</span> Says
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { img: TEST_1, name: 'Marcus Johnson', role: 'Powerlifter', text: 'HyperLift helped me add 40 kg to my total in just 12 weeks. The progress tracking is unmatched.' },
              { img: TEST_2, name: 'Daniel Carter', role: 'CrossFit Athlete', text: 'I used to track everything in a spreadsheet. HyperLift replaced it completely — cleaner, faster, better.' },
              { img: TEST_3, name: 'James Park', role: 'Bodybuilder', text: 'The custom split builder is a game-changer. My coach and I plan everything through HyperLift now.' },
            ].map((t, i) => (
              <RevealBlock key={i}>
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-7 hover:border-orange-500/20 transition-all h-full flex flex-col">
                  <div className="flex text-orange-400 gap-1 mb-4">{[...Array(5)].map((_, j) => <FiStar key={j} className="fill-current" />)}</div>
                  <p className="text-gray-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-800">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-5 md:px-10 text-center">
          <SectionLabel icon={<FiAward />} text="Simple Pricing" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4">
            Free to Start. <span className="text-orange-500">Pro to Dominate.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
            <RevealBlock>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-left h-full transition-transform duration-150 hover:-translate-y-1 active:scale-[0.98]">
                <p className="text-gray-400 font-semibold text-sm uppercase tracking-wide">Free</p>
                <p className="text-4xl font-extrabold text-white mt-3">$0<span className="text-base font-normal text-gray-500"> / forever</span></p>
                <ul className="mt-8 space-y-3 text-sm text-gray-400">
                  {['Unlimited workouts', 'Exercise library access', 'Basic progress tracking', 'Up to 3 workout plans', 'Community support'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><FiCheckCircle className="text-green-500 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block text-center border border-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-150 active:scale-95 no-underline">
                  Get Started
                </Link>
              </div>
            </RevealBlock>

            <RevealBlock>
              <div className="relative bg-gradient-to-b from-orange-500/10 to-gray-900 border-2 border-orange-500/40 rounded-2xl p-8 text-left h-full animate-pulse-glow transition-transform duration-150 hover:-translate-y-1 active:scale-[0.98]">
                <span className="absolute -top-3 right-6 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Popular</span>
                <p className="text-orange-400 font-semibold text-sm uppercase tracking-wide">Pro</p>
                <p className="text-4xl font-extrabold text-white mt-3">$9.99<span className="text-base font-normal text-gray-500"> / month</span></p>
                <ul className="mt-8 space-y-3 text-sm text-gray-300">
                  {['Everything in Free', 'Unlimited workout plans', 'Advanced analytics & charts', 'PR milestone badges', 'Priority support', 'Offline mode sync', 'Custom exercise creation'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><FiCheckCircle className="text-orange-500 shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all duration-150 active:scale-95 no-underline">
                  Upgrade to Pro
                </Link>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={CTA_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-950/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/15 via-transparent to-orange-600/15" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-5">
          <GiWeightLiftingUp className="text-6xl text-orange-500 mx-auto mb-6 animate-float" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Ready to Transform<br />Your Training?
          </h2>
          <p className="text-gray-400 text-lg mt-5 max-w-xl mx-auto">
            Join 50,000+ athletes who trust HyperLift to push past their limits. Your next PR is one click away.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 mt-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all hover:-translate-y-1 no-underline group">
            Get Started — It's Free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 no-underline mb-4">
                <GiWeightLiftingUp className="text-2xl text-orange-500" />
                <span className="text-xl font-extrabold text-white">Hyper<span className="text-orange-500">Lift</span></span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">The intelligent fitness platform for athletes who want results.</p>
            </div>

            {[
              { heading: 'Product', links: ['Features', 'Pricing', 'Exercises', 'Plans'] },
              { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.heading}</h4>
                <ul className="space-y-2">
                  {col.links.map((l, j) => (
                    <li key={j}><a href="#" className="text-gray-500 hover:text-gray-300 text-sm no-underline transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© 2026 HyperLift. All rights reserved.</p>
            <div className="flex items-center gap-6 text-gray-600 text-sm">
              <a href="#" className="hover:text-gray-300 no-underline transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-300 no-underline transition-colors">GitHub</a>
              <a href="#" className="hover:text-gray-300 no-underline transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

function SectionLabel({ icon, text, align = 'center' }: { icon: React.ReactNode; text: string; align?: string }) {
  return (
    <div className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="text-orange-500">{icon}</span>
      <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc, index }: { icon: React.ReactNode; color: string; title: string; desc: string; index: number }) {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20',
    blue:   'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20',
    green:  'bg-green-500/10 text-green-500 group-hover:bg-green-500/20',
    purple: 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20',
    pink:   'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500/20',
    red:    'bg-red-500/10 text-red-500 group-hover:bg-red-500/20',
  };
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`bg-gray-900/80 border border-gray-800 rounded-2xl p-7 hover:border-orange-500/30 transition-all duration-500 cursor-default group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-colors ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function RevealBlock({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
}
