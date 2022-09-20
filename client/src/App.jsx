import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home/Home";
import DriverPage from './components/Driver/DriverPage';
import ManagerPage from './components/Manager/ManagerPage';
import Header from './components/Header/Header';

function App() {

  const [currentUser, setCurrentUser] = useState('');

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className='mainContainer'>
          <Routes>
            <Route exact path="/" element={<Home setCurrentUser={setCurrentUser} />} />
            <Route exact path="/driver" element={<DriverPage currentUser={currentUser} />} />
            <Route exact path="/manager" element={<ManagerPage currentUser={currentUser} />} />
          </Routes>  
        </div>    
      </div>
    </BrowserRouter>
  );
}

export default App;
