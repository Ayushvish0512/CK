const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-400 to-purple-600 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-shadow">CK Marketing & Automation</h1>
        <p className="text-xl opacity-90">We help businesses generate leads & automate follow-ups</p>
      </header>

      <section className="glass-home p-8 mb-8">
        <h2 className="text-3xl mb-6 text-white">Our Services</h2>
        <ul className="list-none p-0">
          <li className="py-3 border-b border-white/20 text-lg last:border-b-0">Lead Generation (Meta & Google Ads)</li>
          <li className="py-3 border-b border-white/20 text-lg last:border-b-0">WhatsApp & Email Automation</li>
          <li className="py-3 border-b border-white/20 text-lg last:border-b-0">CRM & Funnel Setup</li>
        </ul>
      </section>

      <section className="glass-home p-8 mb-8">
        <h2 className="text-3xl mb-6 text-white">Contact</h2>
        <p className="my-2 text-lg">Email: ayushvishwakarma0512@gmail.com</p>
        <p className="my-2 text-lg">WhatsApp: +91XXXXXXXXXX</p>
      </section>

      <footer className="mt-auto p-4 opacity-80 text-sm">
        <p>© 2025 CK Marketing</p>
      </footer>
    </div>
  );
};

export default Home;
