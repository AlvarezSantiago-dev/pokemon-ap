import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { PokeCardDetails } from './components'
import { Home } from './pages/Home'




function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon/:id" element={<PokeCardDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
