import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
    <Routes>
          <Route path="/" element={<div>
            <HomePage/>
            
          </div>} />
          <Route path="/chats" element={<div>
            <ChatPage/>
            
          </div>} />
    </Routes>
    </div>
  );
}

export default App;
