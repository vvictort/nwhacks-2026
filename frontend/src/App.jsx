import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn Tailwind CSS', completed: false },
    { id: 2, text: 'Build something awesome', completed: false },
  ])

  const addTask = () => {
    const newTask = { id: Date.now(), text: `Task ${tasks.length + 1}`, completed: false }
    setTasks([...tasks, newTask])
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-8 mb-8">
            <img src={viteLogo} className="h-24 w-24 hover:scale-110 transition-transform duration-300" alt="Vite logo" />
            <img src={reactLogo} className="h-24 w-24 animate-spin-slow hover:animate-spin" alt="React logo" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Tailwind CSS v3 Demo
          </h1>
          <p className="text-xl text-gray-300">A fully styled interactive app</p>
        </div>

        {/* Counter Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Counter Demo</h2>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Decrease
              </button>
              <div className="text-5xl font-bold text-white bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                {count}
              </div>
              <button
                onClick={() => setCount(count + 1)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Increase
              </button>
            </div>
          </div>
        </div>

        {/* Task List Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Task List</h2>
              <button
                onClick={addTask}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add Task
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${task.completed
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-white/40'
                      }`}>
                      {task.completed && <span className="text-white font-bold">✓</span>}
                    </div>
                    <span className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-white'
                      }`}>
                      {task.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Built with <span className="text-red-500">♥</span> using Vite + React + Tailwind CSS v3
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
