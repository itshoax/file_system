import './App.css'
import DirectoryView from './components/DirectoryView'
import ShowCurrentFile from './components/ShowCurrentFile'
import { DirectoryProvider } from './context/DirectoryContext'
import data from './data.json'

function App() {
  return (
    <DirectoryProvider initialData={data}>
      <div className='flex gap-10'>
        <DirectoryView />
        <ShowCurrentFile />
      </div>
    </DirectoryProvider>
  )
}

export default App
