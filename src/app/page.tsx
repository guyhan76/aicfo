export default function HomePage() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4"
      translate="no"  // ← 이 줄 추가!
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-3xl">AI</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            AICFO
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Financial Intelligence Infrastructure
          </p>
          <p className="text-gray-500">
            ChatGPT answers questions. AICFO watches companies.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <a
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Started →
          </a>
          <a
            href="/demo"
            className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
          >
            View Demo
          </a>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Risk Intelligence</h3>
            <p className="text-gray-600">
              Automatic detection of financial risks before they become problems. US GAAP compliant.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Public Company Lookup</h3>
            <p className="text-gray-600">
              Search any US public company. Instant analysis from SEC EDGAR data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Action Tracking</h3>
            <p className="text-gray-600">
              From risk detection to resolution. Track actions, assign owners, measure results.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">3,500+</div>
            <div className="text-gray-600">US Public Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">30 Years</div>
            <div className="text-gray-600">Financial Data</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10+ Rules</div>
            <div className="text-gray-600">Risk Detection</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 w-full">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            © 2026 AICFO. Built for global CFOs, investors, and financial professionals.
          </p>
          <p className="text-sm text-gray-500">
            Developed by <span className="font-semibold text-gray-700">Dongseok Han</span> · Version 0.1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
