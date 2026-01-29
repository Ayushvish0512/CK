import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Landing: React.FC = () => {
  const skills = [
    'Visual Design',
    'Interaction Design',
    'Usability Testing',
    'Wireframing & Prototyping',
    'User Research',
    'Design Systems',
    'Figma',
    'Adobe Creative Suite',
  ];

  const experiences = [
    {
      title: 'Senior UI/UX Designer',
      company: 'Creative Agency Co.',
      period: '2022 - Present',
      bullets: [
        'Led design system implementation across 5 product teams',
        'Increased user engagement by 40% through UX improvements',
        'Mentored junior designers and conducted design reviews',
      ],
    },
    {
      title: 'UI/UX Designer',
      company: 'Tech Startup Inc.',
      period: '2019 - 2022',
      bullets: [
        'Designed mobile and web applications from concept to launch',
        'Conducted user research and usability testing sessions',
        'Collaborated with developers to ensure design fidelity',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-resume-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <DecorativeBlob className="absolute top-20 right-10 w-32 h-32 animate-float" color="hsl(var(--resume-accent))" />
      <DecorativeBlob className="absolute bottom-40 left-10 w-24 h-24 animate-float-slow" color="hsl(var(--resume-highlight))" />
      <DecorativeDots className="absolute top-40 left-20" />
      <DecorativeDots className="absolute bottom-20 right-32" />
      <DecorativeCurve className="absolute top-1/3 right-0" />
      <DecorativeArrow className="absolute bottom-1/4 left-1/4" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="flex items-center gap-2 text-resume-text">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-resume-text">
              <Mail className="w-4 h-4" />
              <span className="text-sm">hello@yourname.com</span>
            </div>
          </div>
          <DecorativeDots />
        </header>

        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-resume-accent text-lg mb-2">Hello, I'm</p>
            <h1 className="text-5xl lg:text-7xl font-bold text-resume-heading mb-4">
              Your Name
            </h1>
            <p className="text-2xl lg:text-3xl text-resume-card mb-6">
              UI/UX Designer
            </p>
            <p className="text-resume-text text-lg leading-relaxed max-w-lg">
              I create intuitive digital experiences that connect users with products 
              through thoughtful design and research-driven solutions.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-resume-card flex items-center justify-center border-4 border-resume-accent">
                <span className="text-resume-card-foreground text-6xl font-bold">YN</span>
              </div>
              <DecorativeBracket className="absolute -top-4 -left-4" />
              <DecorativeBracket className="absolute -bottom-4 -right-4 rotate-180" />
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - About & Experience */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <section className="bg-resume-card rounded-3xl p-8 relative overflow-hidden">
              <DecorativeCorner className="absolute top-0 right-0" />
              <h2 className="text-2xl font-bold text-resume-card-foreground mb-4">About Me</h2>
              <p className="text-resume-card-foreground/90 leading-relaxed">
                With over 5 years of experience in UI/UX design, I specialize in creating 
                user-centered digital products that solve real problems. My approach combines 
                strategic thinking with creative execution, ensuring every design decision 
                is backed by research and delivers measurable results. I'm passionate about 
                accessibility, design systems, and mentoring the next generation of designers.
              </p>
            </section>

            {/* Experience Section */}
            <section>
              <h2 className="text-2xl font-bold text-resume-heading mb-8">Work Experience</h2>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-resume-muted">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-resume-highlight" />
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-resume-heading">{exp.title}</h3>
                      <p className="text-resume-card">{exp.company}</p>
                      <p className="text-resume-muted text-sm">{exp.period}</p>
                    </div>
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="text-resume-text flex items-start gap-2">
                          <span className="text-resume-highlight mt-1.5">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Skills & Education */}
          <div className="space-y-12">
            {/* Skills Section */}
            <section>
              <h2 className="text-2xl font-bold text-resume-heading mb-6">Skills</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-resume-skill-bg text-resume-text rounded-full text-sm 
                               transition-all duration-300 hover:bg-resume-accent hover:text-white 
                               hover:scale-105 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section>
              <h2 className="text-2xl font-bold text-resume-heading mb-6">Education</h2>
              <div className="bg-resume-muted/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-resume-heading">
                  Bachelor of Fine Arts
                </h3>
                <p className="text-resume-card">Graphic Design</p>
                <p className="text-resume-text text-sm mt-1">
                  University of Design • 2015 - 2019
                </p>
              </div>
            </section>

            {/* Decorative Quote */}
            <div className="relative">
              <DecorativeQuote className="absolute -top-4 -left-2 w-8 h-8 text-resume-accent opacity-50" />
              <p className="text-resume-text italic pl-8">
                "Design is not just what it looks like. Design is how it works."
              </p>
              <p className="text-resume-muted text-sm pl-8 mt-2">— Steve Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Decorative Components
const DecorativeBlob: React.FC<{ className?: string; color: string }> = ({ className, color }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={color}
      d="M47.5,-57.2C59.9,-46.8,67.5,-30.5,70.4,-13.4C73.3,3.7,71.5,21.6,63.1,35.8C54.7,50,39.7,60.5,23.2,66.5C6.7,72.5,-11.3,74,-27.5,68.5C-43.7,63,-58.1,50.5,-66.3,34.8C-74.5,19.1,-76.5,0.2,-72.1,-16.5C-67.7,-33.2,-56.9,-47.7,-43.4,-57.9C-29.9,-68.1,-14.9,-74,1.2,-75.5C17.3,-77,35.1,-67.6,47.5,-57.2Z"
      transform="translate(100 100)"
    />
  </svg>
);

const DecorativeDots: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex gap-1.5 ${className}`}>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="w-2 h-2 rounded-full bg-resume-accent/60" />
    ))}
  </div>
);

const DecorativeCurve: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="100" height="200" viewBox="0 0 100 200" fill="none">
    <path
      d="M100 0C100 0 50 50 50 100C50 150 100 200 100 200"
      stroke="hsl(var(--resume-muted))"
      strokeWidth="2"
      strokeDasharray="8 8"
    />
  </svg>
);

const DecorativeArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none">
    <path
      d="M10 50L50 10M50 10H20M50 10V40"
      stroke="hsl(var(--resume-highlight))"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DecorativeBracket: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none">
    <path
      d="M0 10V0H10M30 0H40V10M40 30V40H30M10 40H0V30"
      stroke="hsl(var(--resume-accent))"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const DecorativeCorner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="80" cy="0" r="60" fill="hsl(var(--resume-accent))" opacity="0.3" />
    <circle cx="80" cy="0" r="40" fill="hsl(var(--resume-accent))" opacity="0.2" />
  </svg>
);

const DecorativeQuote: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
  </svg>
);

export default Landing;
