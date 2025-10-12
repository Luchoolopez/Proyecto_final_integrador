import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './components/LoginRegister/Login.tsx';
import Register from './components/LoginRegister/Register.tsx';
import Home from './pages/Home.tsx';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/iniciar-sesion' element={<Login/>}/> 
        <Route path='/register' element={<Register/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App