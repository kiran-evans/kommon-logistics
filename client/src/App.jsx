import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home/Home";
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import NotFound from './components/Error/NotFound';

function App() {

  const [currentUser, setCurrentUser] = useState('');

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className='mainContainer'>
          <Routes>
            <Route exact path="/" element={<Home setCurrentUser={setCurrentUser} />} />
            <Route exact path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>  
        </div>    
      </div>
    </BrowserRouter>
  );
}

export default App;
