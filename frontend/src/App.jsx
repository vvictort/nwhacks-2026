import { useState } from 'react'

function App() {
  const [activeNav, setActiveNav] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <div className="min-h-screen bg-neo-bg-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neo-bg-100 rounded-full shadow-neo px-8 py-4">
            <ul className="flex items-center justify-center gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveNav(item.id)}
                    className={`
                      px-6 py-2 rounded-full font-medium transition-all duration-200
                      ${activeNav === item.id
                        ? 'bg-neo-primary-500 text-white shadow-lg scale-105'
                        : 'bg-white/60 text-neo-bg-700 hover:bg-white/80 hover:scale-110 hover:shadow-xl hover:-translate-y-1 hover:text-neo-primary-700'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-neo-primary-800 mb-6">
              Welcome to Neumorphism
            </h1>
            <p className="text-xl text-neo-bg-700 mb-8">
              A modern design approach with soft, extruded shapes
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="bg-neo-bg-100 rounded-3xl shadow-neo p-8 hover:shadow-neo-lg transition-all duration-300">
              <div className="bg-neo-bg-100 rounded-full shadow-neo-inset w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-neo-primary-700 mb-4">Design</h3>
              <p className="text-neo-bg-700">
                Beautiful neumorphic interfaces with soft shadows and subtle depth effects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-neo-bg-100 rounded-3xl shadow-neo p-8 hover:shadow-neo-lg transition-all duration-300">
              <div className="bg-neo-bg-100 rounded-full shadow-neo-inset w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-neo-primary-700 mb-4">Performance</h3>
              <p className="text-neo-bg-700">
                Fast and responsive components built with modern web technologies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-neo-bg-100 rounded-3xl shadow-neo p-8 hover:shadow-neo-lg transition-all duration-300">
              <div className="bg-neo-bg-100 rounded-full shadow-neo-inset w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-neo-primary-700 mb-4">Innovation</h3>
              <p className="text-neo-bg-700">
                Cutting-edge features that push the boundaries of user experience.
              </p>
            </div>
          </div>

          {/* Interactive Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-neo-bg-100 rounded-3xl shadow-neo p-10">
              <h2 className="text-4xl font-bold text-neo-primary-800 mb-8 text-center">
                Interactive Elements
              </h2>

              {/* Button Group */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button className="bg-neo-bg-100 shadow-neo hover:shadow-neo-lg active:shadow-neo-inset px-8 py-4 rounded-full font-semibold text-neo-primary-700 transition-all duration-200">
                  Button
                </button>
                <button className="bg-neo-primary-600 shadow-neo hover:shadow-neo-lg px-8 py-4 rounded-full font-semibold text-white transition-all duration-200">
                  Primary
                </button>
                <button className="bg-neo-accent-500 shadow-neo hover:shadow-neo-lg px-8 py-4 rounded-full font-semibold text-white transition-all duration-200">
                  Accent
                </button>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter something..."
                  className="w-full bg-neo-bg-100 shadow-neo-inset rounded-full px-6 py-4 text-neo-bg-800 placeholder:text-neo-bg-500 focus:outline-none focus:ring-2 focus:ring-neo-primary-400 transition-all"
                />
              </div>

              {/* Toggle Switches */}
              <div className="flex justify-center gap-8">
                <div className="bg-neo-bg-100 shadow-neo-inset rounded-full px-6 py-3 flex items-center gap-3">
                  <span className="text-neo-bg-700 font-medium">Dark Mode</span>
                  <div className="w-12 h-6 bg-neo-bg-100 shadow-neo-inset rounded-full relative cursor-pointer">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-neo-primary-600 shadow-neo-sm rounded-full transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
