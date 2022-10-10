import './App.css';
import { AuthContextProvider } from './context/AuthContext';
import MainWrapper from './components/main/MainWrapper';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    document.title = import.meta.env.KL_APP_TITLE;
  }, [])

  return (
    <AuthContextProvider>
      <MainWrapper />
    </AuthContextProvider>
  );
}

export default App;
