import { useState, version } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="flex gap-8 mb-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 hover:drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl font-bold mb-8">Vite + React</h1>
      <p className="text-slate-400 mb-8">React {version}</p>
      <div className="p-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-slate-800 rounded-lg border border-transparent hover:border-indigo-500 transition-colors"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="font-mono bg-slate-800 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-slate-400 mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
