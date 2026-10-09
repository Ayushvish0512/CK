import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Award,
  Brain,
  Briefcase,
  ChartColumn,
  ChartPie,
  Cloud,
  Code,
  Copy,
  Database,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Microchip,
  Phone,
  Printer,
  Quote,
  RefreshCw,
  Send,
  Shapes,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const EMAIL = "ayushvishwakarma0512@gmail.com";
const PHONE = "+91-7071387691";
const LINKEDIN = "https://www.linkedin.com/in/ayushvishwakarma0512";
const GITHUB = "https://github.com/Ayushvish0512";

const metrics = [
  {
    value: "₹3L / mo",
    label: "Cost Savings",
    note: "Recovered through Python, SQL and n8n workflow automation",
    text: "text-blue-400",
    hover: "hover:border-blue-500/40",
  },
  {
    value: "90%",
    label: "Manual Effort Reduced",
    note: "25+ automated workflows replacing manual operational overhead",
    text: "text-cyan-400",
    hover: "hover:border-cyan-500/40",
  },
  {
    value: "₹1Cr → ₹5L",
    label: "Shipment Losses",
    note: "Cut through proactive tracking and fraud detection at Flipkart",
    text: "text-emerald-400",
    hover: "hover:border-emerald-500/40",
  },
  {
    value: "3+ Yrs",
    label: "Domain Experience",
    note: "Backed by 4+ years of technical engagement and delivery",
    text: "text-amber-400",
    hover: "hover:border-amber-500/40",
  },
];

const experience = [
  {
    role: "Assistant Manager - Business Analyst",
    company: "BigBox International Private Limited",
    badge: "Current Role",
    period: "May 2026 - Present",
    location: "Gurugram, India",
    accent: "text-blue-400",
    bullets: [
      {
        title: "Financial & Expense Analytics:",
        body: "Managed ₹ lakhs in activity expenses, executing deep-dive variance analysis across bank statements, vendor payments, purchase orders, invoices, and utility bills to detect structural leakages and enforce strict cost control.",
      },
      {
        title: "Business Operations & Process Optimization:",
        body: "Created activity execution plans and standardized workflows for approvals, procurement, payments, sales, and promotions, improving operational control across the organization.",
      },
      {
        title: "Automation & Internal Tools:",
        body: "Built an internal web portal for user login, image-based attendance, sales tracking, and promotional activity management, reducing manual data handling across field teams.",
      },
      {
        title: "Business Intelligence & Reporting:",
        body: "Developed CEO/COO dashboards and a Python Telegram bot providing D-1 expense insights by Activity ID, enabling faster monitoring and decision-making.",
      },
    ],
    tags: [
      "Python",
      "PostgreSQL",
      "Power BI",
      "n8n Automation",
      "Financial Reconciliation",
      "Cost Control",
    ],
  },
  {
    role: "Business Analyst",
    company: "Laiqa",
    period: "April 2025 - May 2026",
    location: "Gurugram, India",
    accent: "text-cyan-400",
    bullets: [
      {
        title: "End-to-End Analytics:",
        body: "Owned marketing, sales, and operations analytics using SQL, Python, GA4, and CRM data to identify funnel gaps, improve conversion visibility, and support data-driven decisions.",
      },
      {
        title: "Automation & Process Optimization:",
        body: "Built 25+ n8n / API / webhook workflows for lead management, payment tracking, CRM sync, routing, and follow-ups, reducing manual effort by 90% and saving ~₹3L/month.",
      },
      {
        title: "Data & Funnel Optimization:",
        body: "Developed automated data pipelines and integrated WordPress, Razorpay, Meta Ads, Shopify, and CRM systems, improving data accuracy by 40%, reducing drop-offs by 25%, and improving conversions by 28%.",
      },
      {
        title: "AI & Business Impact:",
        body: "Applied Generative AI, Agentic AI, Python, and analytics to productivity and decision-support initiatives; collaborated with leadership on cost optimization, contributing to 2× revenue growth and improved renewal visibility.",
      },
    ],
    tags: [
      "SQL",
      "GA4",
      "n8n",
      "Meta Ads",
      "Shopify",
      "Razorpay",
      "Funnel Analysis",
    ],
  },
  {
    role: "Executive Data Analyst",
    company: "Flipkart",
    period: "April 2024 - April 2025",
    location: "India",
    accent: "text-amber-400",
    bullets: [
      {
        title: "Data Extraction & Automation:",
        body: "Processed 5+ lakh rows/day via VPN; automated Google Sheets updates using Excel & Pandas, saving 4 hrs/day in manual effort.",
      },
      {
        title: "Reporting & Dashboarding:",
        body: "Built regional dashboards in Power BI & Google Sheets, improving decision-making speed by 30% for 20+ stakeholders.",
      },
      {
        title: "Workforce & Logistics Planning:",
        body: "Optimized hub-level manpower allocation, reducing costs by 18% and improving delivery efficiency.",
      },
      {
        title: "Escalation & Returns Management:",
        body: "Reduced shipment losses from ₹1 Cr → ₹5 Lakh through proactive tracking and fraud detection.",
      },
      {
        title: "Customer & Cross-Team Metrics:",
        body: "Increased satisfaction scores from 6.4 → 9.3/10, reduced return rates by 22%, and coordinated with Zonal & Central teams to streamline escalation workflows.",
      },
    ],
    tags: [
      "Pandas",
      "Power BI",
      "Google Sheets",
      "Logistics Analytics",
      "Fraud Detection",
      "MS Excel",
    ],
  },
  {
    role: "Business Analyst Intern",
    company: "Webmobi360",
    period: "September 2023 - March 2024",
    location: "India",
    accent: "text-rose-400",
    bullets: [
      {
        title: "Process Documentation Framework:",
        body: "Developed a structured documentation framework for BA processes, improving workflow efficiency and reducing turnaround time by 25%.",
      },
      {
        title: "Cross-Functional Collaboration:",
        body: "Collaborated with AI/ML, marketing, and cross-functional teams to align analytical solutions with business goals.",
      },
      {
        title: "Delivery & Client Satisfaction:",
        body: "Delivered 50+ projects in 4 months with high-quality outputs and 100% client satisfaction.",
      },
      {
        title: "AI-Driven Content Automation:",
        body: "Implemented AI-driven content automation tools, improving visual quality and increasing social media visibility by 20%.",
      },
    ],
    tags: ["Business Analysis", "AI Automation", "Documentation", "Client Delivery"],
  },
  {
    role: "Programming Mentor",
    company: "Sharp Programmer Technology",
    period: "April 2022 - June 2023",
    location: "Kanpur, India",
    accent: "text-sky-400",
    bullets: [
      {
        title: "Batch Mentorship & Evaluation:",
        body: "Monitored and evaluated student progress across 4 batches (15–30 students each), improving performance and course completion rates by 85%.",
      },
      {
        title: "Interactive Teaching:",
        body: "Delivered interactive sessions on Microsoft Office, CCC, ‘O’ Level, and basic computer skills, ensuring strong engagement and understanding.",
      },
      {
        title: "Hands-On Learning Environment:",
        body: "Created hands-on learning environments with real-world exercises, enhancing student confidence and problem-solving skills.",
      },
    ],
    tags: ["Mentoring", "Microsoft Office", "CCC", "O Level", "Tally ERP 9"],
  },
];

const education = [
  {
    title: "Post Graduation in Analytics & Machine Learning",
    institution: "Imarticus Learning, Lucknow",
    period: "2023 - 2024",
    detail:
      "Exploratory Data Analysis, model building, database management, graphical representation, data visualization, big data analytics, data mining and pattern recognition, business intelligence and decision support systems.",
    accent: "text-blue-400",
  },
  {
    title: "Bachelor of Commerce",
    institution: "Dayanand Anglo-Vedic (PG) College, Kanpur",
    period: "2020",
    detail: "Commerce and accounting foundation with business management and financial studies.",
    accent: "text-cyan-400",
  },
  {
    title: "XII (CBSE) - Commerce with Maths",
    institution: "Air Force School Chakeri, Kanpur",
    period: "2020",
    detail: "Secondary education with mathematics and commerce.",
    accent: "text-emerald-400",
  },
  {
    title: "X (CBSE)",
    institution: "Air Force School Chakeri, Kanpur",
    period: "2018",
    detail: "Secondary school certification.",
    accent: "text-amber-400",
  },
];

const certifications = [
  { title: "Programming Mentor", issuer: "Sharp Programmer Technology, Kanpur", period: "2022 - 2023" },
  { title: "‘O’ Level", issuer: "Sharp Programmer Technology, Kanpur", period: "2022" },
  { title: "Course on Computer Concepts (CCC)", issuer: "Sharp Programmer Technology, Kanpur", period: "2021" },
  { title: "Tally ERP 9", issuer: "Sharp Programmer Technology, Kanpur", period: "2021" },
];

const projects = [
  {
    title: "Recommendation System",
    icon: Sparkles,
    accent: "text-blue-400",
    border: "border-blue-500/30",
    gradient: "from-blue-500/20 to-cyan-500/20",
    body: "Developed a book and movie recommendation system using the K-nearest neighbor (KNN) algorithm, collecting data from IMDb and Kaggle for real-time recommendations and performance optimization.",
    tags: ["Python", "KNN", "Pandas", "Scikit-Learn"],
  },
  {
    title: "Object Detection & Tracking",
    icon: RefreshCw,
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
    gradient: "from-cyan-500/20 to-blue-500/20",
    body: "Built a Convolutional Neural Network to detect and track electronic items such as keyboards, mice, and routers, managing data collection, labeling, misclassification issues, and model optimization.",
    tags: ["CNN", "Computer Vision", "Python", "DL"],
  },
  {
    title: "YouTube Comment Analysis",
    icon: ChartPie,
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    gradient: "from-emerald-500/20 to-teal-500/20",
    body: "Analyzed sentiment and trends in YouTube comments using NLP tools like NLTK, spaCy, and sklearn with the YouTube Data API v3, applying entity recognition and sentiment summarization.",
    tags: ["NLP", "NLTK", "spaCy", "YouTube API"],
  },
  {
    title: "AI Video & Ad Analysis System",
    icon: ChartColumn,
    accent: "text-amber-400",
    border: "border-amber-500/30",
    gradient: "from-amber-500/20 to-orange-500/20",
    body: "Built a system to analyze marketing videos and ads using NLP techniques to extract tone, sentiment, hooks, and engagement patterns, processing clicks, impressions, CTR, and unstructured inputs for performance insights.",
    tags: ["NLP", "ML", "Campaign Analytics", "Python"],
  },
  {
    title: "Agentic AI Workflow System",
    icon: Workflow,
    accent: "text-purple-400",
    border: "border-purple-500/30",
    gradient: "from-purple-500/20 to-pink-500/20",
    body: "Designed modular AI agents that fetch data from APIs, process it through Python and LLM reasoning, and trigger automated actions such as CRM updates, alerts, and reports using n8n orchestration with FastAPI backends.",
    tags: ["n8n", "FastAPI", "Agentic AI", "LLM"],
  },
  {
    title: "Earthquake Analysis",
    icon: Database,
    accent: "text-rose-400",
    border: "border-rose-500/30",
    gradient: "from-rose-500/20 to-orange-500/20",
    body: "Conducted research on earthquake patterns using large global datasets, performing data cleaning, exploratory data analysis, and time series forecasting to predict intensity from trends and conclude with data-proven findings.",
    tags: ["Time Series", "EDA", "Forecasting", "Research"],
  },
];

const references = [
  {
    name: "Mr. Kuber Datta",
    role: "Trainer - Imarticus Learning",
    phone: "+91-8130822837",
  },
  {
    name: "Mr. Nitin K Singh",
    role: "Program Manager - Imarticus Learning",
    phone: "+91 98919 51475",
    email: "nitin.kumar@imarticus.com",
  },
  {
    name: "Mrs. Anjali Thankur",
    role: "Sales Head - Laiqa Wellness",
    phone: "+91 89996 42358",
  },
];

type SkillCategory = "analytics" | "ai" | "automation" | "business";

const skillFilters: { key: SkillCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "analytics", label: "Analytics & BI" },
  { key: "ai", label: "AI / ML" },
  { key: "automation", label: "Automation" },
  { key: "business", label: "Business Tools" },
];

const skillGroups: {
  title: string;
  category: SkillCategory;
  icon: typeof Code;
  accent: string;
  mono?: boolean;
  wide?: boolean;
  skills: string[];
}[] = [
  {
    title: "Languages",
    category: "analytics",
    icon: Code,
    accent: "text-blue-400",
    mono: true,
    skills: ["Python", "SQL", "HTML", "CSS"],
  },
  {
    title: "Data Analytics",
    category: "analytics",
    icon: ChartPie,
    accent: "text-cyan-400",
    skills: [
      "Data Analysis",
      "Statistical Analysis",
      "EDA",
      "Root Cause Analysis",
      "Funnel Analysis",
      "Financial & Operational Analytics",
    ],
  },
  {
    title: "Business Intelligence",
    category: "analytics",
    icon: ChartColumn,
    accent: "text-amber-400",
    skills: ["Power BI", "Tableau", "Qlik Sense", "GA4", "MS Excel", "Google Sheets", "Metabase"],
  },
  {
    title: "Automation & Integration",
    category: "automation",
    icon: RefreshCw,
    accent: "text-emerald-400",
    skills: ["n8n", "Zapier", "Google Apps Script", "REST APIs", "Webhooks", "API Integration"],
  },
  {
    title: "AI & Machine Learning",
    category: "ai",
    icon: Brain,
    accent: "text-purple-400",
    skills: [
      "Generative AI",
      "Agentic AI",
      "Applied ML",
      "Predictive Modeling",
      "Classification",
      "Regression",
      "NLP",
      "Scikit-Learn",
      "Pandas / NumPy",
      "NLTK & spaCy",
    ],
  },
  {
    title: "Platforms & Tools",
    category: "business",
    icon: Shapes,
    accent: "text-rose-400",
    skills: ["Meta Ads", "Shopify", "WordPress", "Razorpay", "LeadSquared", "Zoho Campaigns", "CRM Systems"],
  },
  {
    title: "Cloud & Development",
    category: "automation",
    icon: Cloud,
    accent: "text-sky-400",
    mono: true,
    skills: ["FastAPI", "PostgreSQL", "Git / GitHub", "Render", "Netlify", "AWS"],
  },
  {
    title: "Business & Process Mastery",
    category: "business",
    icon: Workflow,
    accent: "text-indigo-400",
    wide: true,
    skills: [
      "Process Optimization",
      "Financial Analysis",
      "Cost Control",
      "Business Planning",
      "Cross-functional Collaboration",
      "Problem Solving & Critical Thinking",
    ],
  },
];

const summary =
  "Business & Data Analytics Specialist with 3+ years of professional experience (backed by 4+ years of technical engagement) in business analysis, financial and operational analytics, automation, and AI-enabled solutions. Proven track record of optimizing business operations, managing ₹ lakhs in activity expenses, saving ₹3L/month in operational costs, and reducing manual effort by 90% through Python, SQL, n8n, APIs, and workflow automation. Experienced in delivering end-to-end analytical solutions—from financial reconciliation and business dashboards to Agentic AI tools and automated data systems—to improve cost control, decision-making, revenue growth, and operational efficiency.";

const competencyLines = [
  { label: "Languages", value: "Python, SQL, HTML, CSS" },
  {
    label: "Data Analytics",
    value:
      "Data Analysis, Statistical Analysis, EDA, Root Cause Analysis, Funnel Analysis, Financial & Operational Analytics",
  },
  {
    label: "Business Intelligence",
    value: "Power BI, Tableau, Qlik Sense, GA4, MS Excel, Google Sheets, Metabase",
  },
  {
    label: "Automation & Integration",
    value: "n8n, Zapier, Google Apps Script, REST APIs, Webhooks, API Integration",
  },
  {
    label: "AI & Machine Learning",
    value:
      "Generative AI, Agentic AI, Applied Machine Learning, Predictive Modeling, Classification, Regression, NLP, Scikit-Learn, Pandas, NumPy, NLTK, spaCy",
  },
  {
    label: "Platforms & Business Tools",
    value: "Meta Ads, Shopify, WordPress, Razorpay, LeadSquared, Zoho Campaigns, CRM Systems",
  },
  { label: "Cloud & Development", value: "FastAPI, PostgreSQL, Git/GitHub, Render, Netlify, AWS" },
  {
    label: "Business & Process",
    value:
      "Process Optimization, Financial Analysis, Cost Control, Business Planning, Cross-functional Collaboration, Problem Solving, Critical Thinking",
  },
];

function copyEmail() {
  navigator.clipboard
    .writeText(EMAIL)
    .then(() => toast.success("Email copied to clipboard"))
    .catch(() => toast.error("Could not copy email"));
}

function SectionHeading({
  icon: Icon,
  iconClass,
  title,
  subtitle,
}: {
  icon: typeof Briefcase;
  iconClass: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 ${iconClass}`}
        >
          <Icon className="w-4 h-4" />
        </span>
        {title}
      </h2>
      <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>
    </div>
  );
}

function InteractiveView({ isMobile }: { isMobile: boolean }) {
  const [filter, setFilter] = useState<SkillCategory | "all">("all");

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-24">
      {/* Hero card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl mb-10"
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 opacity-[0.04] pointer-events-none hidden sm:block">
          <ChartColumn className="w-[280px] h-[280px] text-white" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-mono">
            <Terminal className="w-3 h-3" />
            Business &amp; Data Analytics Specialist
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mt-4 text-white">
            Ayush Vishwakarma
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mt-4">
            Business &amp; Data Analytics Specialist with{" "}
            <span className="text-slate-200 font-semibold">
              3+ years of professional experience
            </span>{" "}
            (backed by 4+ years of technical engagement) in business analysis,
            financial and operational analytics, automation, and AI-enabled solutions.
          </p>

          <p className="text-sm text-slate-400 leading-relaxed mt-3">
            Proven track record of optimizing business operations, managing ₹ lakhs in
            activity expenses, saving{" "}
            <span className="text-blue-400 font-semibold">₹3L/month</span> in operational
            costs, and reducing manual effort by{" "}
            <span className="text-cyan-400 font-semibold">90%</span> through Python, SQL,
            n8n, APIs, and workflow automation.
          </p>

          <div className="pt-4 flex flex-wrap gap-2 sm:gap-3 text-xs">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/50 hover:text-white transition-all break-all"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE.replace(/-/g, "")}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500/50 hover:text-white transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {PHONE}
            </a>
            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              Gurugram, India
            </span>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white transition-all"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-purple-500 hover:text-white transition-all"
            >
              <Github className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              GitHub
            </a>
          </div>
        </div>
      </motion.section>

      {/* Key metrics */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group ${metric.hover} transition-all duration-300`}
            >
              <div
                className={`text-xl sm:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200 ${metric.text}`}
              >
                {metric.value}
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {metric.label}
              </div>
              {!isMobile && (
                <div className="text-[11px] text-slate-500 mt-1">{metric.note}</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-14">
        <SectionHeading
          icon={Briefcase}
          iconClass="bg-blue-500/10 border-blue-500/30 text-blue-400"
          title="Professional Experience"
          subtitle="Six roles across e-commerce, wellness, logistics and education"
        />

        <div className="space-y-6">
          {experience.map((job, jobIndex) => (
            <motion.article
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(jobIndex, 3) * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-8 hover:border-blue-500/30 transition-all relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-white">{job.role}</h3>
                    {job.badge && (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
                        {job.badge}
                      </span>
                    )}
                  </div>
                  <p className={`${job.accent} font-semibold text-sm mt-0.5`}>
                    {job.company}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400 font-mono">
                  <span>{job.period}</span>
                  {job.location && (
                    <>
                      <span>•</span>
                      <span>{job.location}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                {job.bullets.map((bullet, bulletIndex) => (
                  <div key={bullet.title} className="flex items-start gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        [
                          "bg-blue-400",
                          "bg-cyan-400",
                          "bg-emerald-400",
                          "bg-amber-400",
                          "bg-rose-400",
                        ][bulletIndex % 5]
                      }`}
                    />
                    <p className="leading-relaxed">
                      <strong className="text-white font-semibold">{bullet.title}</strong>{" "}
                      {bullet.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-5 border-t border-white/10 mt-6">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs bg-white/5 text-slate-300 border border-white/10 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="mb-14">
        <SectionHeading
          icon={GraduationCap}
          iconClass="bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
          title="Education & Certifications"
          subtitle="Post graduation in analytics & machine learning, plus computer certifications"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {education.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className={`text-sm ${item.accent} font-semibold mt-0.5`}>
                      {item.institution}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {item.period}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mt-3">{item.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:border-emerald-500/30 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{cert.title}</h3>
                  <p className="text-xs text-slate-400 truncate">
                    {cert.issuer} • {cert.period}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal projects */}
      <section className="mb-14">
        <SectionHeading
          icon={Sparkles}
          iconClass="bg-purple-500/10 border-purple-500/30 text-purple-400"
          title="Personal Projects"
          subtitle="Applied machine learning, NLP and agentic AI builds"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className={`group relative rounded-3xl overflow-hidden border ${project.border} bg-gradient-to-br ${project.gradient} backdrop-blur-xl p-6 sm:p-8`}
            >
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
              <div className="relative z-10">
                <div className={`mb-4 p-3 w-fit rounded-2xl bg-white/5 border border-white/10`}>
                  <project.icon className={`w-6 h-6 ${project.accent}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{project.body}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs bg-slate-900/60 text-slate-300 border border-white/10 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Competencies */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <SectionHeading
            icon={Microchip}
            iconClass="bg-blue-500/10 border-blue-500/30 text-blue-400"
            title="Core Competencies & Technical Stack"
            subtitle="Filter specialized skills across data analytics, engineering, and business operations"
          />

          <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl self-start">
            {skillFilters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  filter === item.key
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {skillGroups
            .filter((group) => filter === "all" || group.category === filter)
            .map((group) => (
              <motion.div
                key={group.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-white/5 border border-white/10 rounded-2xl p-5 transition-all duration-300 ${
                  group.wide ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-2.5 mb-3 font-semibold text-sm ${group.accent}`}
                >
                  <group.icon className="w-4 h-4" />
                  <h3>{group.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 text-xs bg-slate-900/60 border border-white/10 rounded-lg text-slate-300 ${
                        group.mono ? "font-mono" : ""
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* References */}
      <section className="mb-14">
        <SectionHeading
          icon={UserCheck}
          iconClass="bg-amber-500/10 border-amber-500/30 text-amber-400"
          title="References"
          subtitle="Available on request"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {references.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all"
            >
              <Quote className="w-5 h-5 text-amber-400/60 mb-3" />
              <h3 className="font-bold text-white">{person.name}</h3>
              <p className="text-sm text-slate-400">{person.role}</p>
              <a
                href={`tel:${person.phone.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mt-3"
              >
                <Phone className="w-3 h-3" />
                {person.phone}
              </a>
              {person.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mt-1 break-all"
                >
                  <Mail className="w-3 h-3" />
                  {person.email}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-24 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="max-w-2xl relative z-10">
            <span className="text-xs uppercase font-mono tracking-widest text-blue-400 font-bold">
              End-to-End Solutions
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-white mt-1 mb-3">
              Bridging Business Analysis with AI Automation
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Translating complex business dilemmas into lean, robust codebases.
              Specializing in audit automations, financial variance reduction, and
              Agentic AI tools that provide actionable insights directly to
              decision-makers.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                <Send className="w-4 h-4" />
                Initiate Discussion
              </a>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all border border-slate-700"
              >
                <Copy className="w-4 h-4" />
                Copy Email
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AtsView() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-200">
        <div className="text-center pb-4 border-b border-slate-900 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Ayush Vishwakarma
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-700">
            <span className="font-medium text-slate-900">{PHONE}</span>
            <span>|</span>
            <a href={`mailto:${EMAIL}`} className="text-blue-700 font-medium">
              {EMAIL}
            </a>
            <span>|</span>
            <span className="text-slate-800 font-medium">Gurugram</span>
            <span>|</span>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium"
            >
              LinkedIn
            </a>
            <span>|</span>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-medium"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-xs sm:text-[13px] leading-relaxed text-slate-800 text-justify">
            {summary}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Core Competencies
          </h2>
          <ul className="text-xs sm:text-[12.5px] space-y-1.5 text-slate-800 leading-normal">
            {competencyLines.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience
          </h2>

          {experience.map((job) => (
            <div key={`${job.company}-${job.period}`} className="mb-5">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-xs sm:text-[13px] text-slate-800">
                  Designation:{" "}
                  <strong className="text-slate-900 font-bold">{job.role}</strong>
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 underline decoration-slate-400 underline-offset-2">
                  {job.company}
                </span>
                <span className="text-xs font-semibold text-slate-700">{job.period}</span>
              </div>
              <p className="text-xs text-slate-800 font-semibold mb-1">
                Roles &amp; Responsibilities:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-[12px] space-y-1.5 text-slate-800 text-justify">
                {job.bullets.map((bullet) => (
                  <li key={bullet.title}>
                    <strong>{bullet.title}</strong> {bullet.body}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Education
          </h2>
          <ul className="text-xs sm:text-[12.5px] space-y-1.5 text-slate-800">
            {education.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong> - {item.institution} ({item.period})
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Certifications
          </h2>
          <ul className="text-xs sm:text-[12.5px] space-y-1.5 text-slate-800">
            {certifications.map((cert) => (
              <li key={cert.title}>
                <strong>{cert.title}</strong> - {cert.issuer} ({cert.period})
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            Personal Projects
          </h2>
          <ul className="text-xs sm:text-[12.5px] space-y-1.5 text-slate-800 list-disc pl-5">
            {projects.map((project) => (
              <li key={project.title}>
                <strong>{project.title}:</strong> {project.body}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
            References
          </h2>
          <ul className="text-xs sm:text-[12.5px] space-y-1.5 text-slate-800">
            {references.map((person) => (
              <li key={person.name}>
                <strong>{person.name}</strong> - {person.role}, {person.phone}
                {person.email ? `, ${person.email}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Displaying exact high-fidelity ATS print layout.</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-all"
          >
            Print Document
          </button>
        </div>
      </div>
    </section>
  );
}

{/* 
  REMOVED FROM PROFESSIONAL EXPERIENCE - Not in source PDF resume
  This entry was a skills summary disguised as a role with no dates ("Prior Technical Engagements")
  Content overlaps with Projects, Skills, and other roles (Laiqa, BigBox)
  Kept here for reference only

  {
    role: "Data Analyst & Automation Specialist",
    company: "Consulting & Applied Analytical Solutions",
    period: "Prior Technical Engagements",
    location: "",
    accent: "text-emerald-400",
    bullets: [
      {
        title: "Agentic AI & Intelligent Workflows:",
        body: "Implemented autonomous Agentic AI and Generative AI pipelines connecting LLM models, custom webhooks, and REST APIs to auto-triage inbound inquiries, score lead quality, and draft analytical digests for operations.",
      },
      {
        title: "Predictive Modeling & Machine Learning:",
        body: "Built supervised predictive models in Python (Scikit-Learn, Pandas) for classification and regression tasks including churn likelihood, forecast modeling, and exploratory data analysis (EDA).",
      },
      {
        title: "API Ecosystem Integrations:",
        body: "Developed webhook receivers and custom API connectors using FastAPI to seamlessly pipe conversion events between payment gateways (Razorpay), CRM systems (Zoho/LeadSquared), and Google Sheets data hubs.",
      },
    ],
    tags: ["Agentic AI", "Machine Learning", "FastAPI", "REST APIs", "Tableau"],
  },
*/}

export default function AboutMe() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"interactive" | "ats">("interactive");
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-blue-500/30 relative overflow-x-hidden">
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Background ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_60%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#030712]/85 border-b border-white/5 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 shrink-0">
              AV
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white tracking-tight flex items-center gap-2">
                <span className="truncate">Ayush Vishwakarma</span>
                {!isMobile && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse" />
                    Available for Impact Roles
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isMobile && (
              <div className="hidden sm:flex bg-slate-900/60 border border-white/10 p-1 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setView("interactive")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    view === "interactive"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Interactive View
                </button>
                <button
                  onClick={() => setView("ats")}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    view === "ats"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Clean ATS View
                </button>
              </div>
            )}

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              disabled={isDownloading}
              onClick={async () => {
                setIsDownloading(true);
                try {
                  const res = await fetch('/api/download-resume');
                  const contentType = res.headers.get('content-type') || '';
                  const isPdf = contentType.includes('application/pdf') || contentType.includes('application/octet-stream');
                  
                  if (res.ok && isPdf) {
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Ayush-Vishwakarma-Resume.pdf';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    const source = res.headers.get('X-Resume-Source');
                    toast.success(source === 'google-drive' ? 'Downloaded from Google Drive' : 'Downloaded (local fallback)');
                  } else {
                    // Handle errors or non-PDF responses (like SPA fallback HTML)
                    let err;
                    try {
                      err = await res.json();
                    } catch {
                      err = { fallbackUrl: true }; // Assume fallback if not JSON
                    }
                    if (err.fallbackUrl || !isPdf) {
                      toast.warning('Drive link failed, giving ATS print command');
                      setView('ats');
                      setTimeout(() => window.print(), 100);
                    } else {
                      toast.error(err.message || 'Download failed');
                    }
                  }
                } catch {
                  toast.error('Download failed');
                } finally {
                  setIsDownloading(false);
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden md:inline">Preparing...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Download / Print</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {view === "interactive" ? <InteractiveView isMobile={isMobile} /> : <AtsView />}

      {/* Mobile-only view switch */}
      {isMobile && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 no-print flex items-center gap-1 p-1 rounded-2xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl shadow-black/80 text-xs">
          <button
            onClick={() => setView("interactive")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              view === "interactive" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setView("ats")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              view === "ats" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Resume
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 bg-slate-950/50 py-8 no-print text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Ayush Vishwakarma • Business &amp; Data Analytics Specialist • Gurugram, India
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${EMAIL}`} className="hover:text-blue-400 transition-colors">
              Email
            </a>
            <a
              href={`tel:${PHONE.replace(/-/g, "")}`}
              className="hover:text-cyan-400 transition-colors"
            >
              Call
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
