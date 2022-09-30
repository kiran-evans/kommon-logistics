import './App.css';
import { AuthContextProvider } from './context/AuthContext';
import MainWrapper from './components/main/MainWrapper'

function App() {

  return (
    <AuthContextProvider>
      <MainWrapper />
    </AuthContextProvider>
  );
}

export default App;
