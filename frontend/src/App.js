import './App.css';
import { Routes, Route } from 'react-router-dom'
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={< Homepage />} exact />
        <Route path='/chats' element={< Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
