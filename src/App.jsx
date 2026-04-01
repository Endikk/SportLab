import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";
import Workout from "./pages/Workout";
import History from "./pages/History";
import Logs from "./pages/Logs";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/:sessionId" element={<Session />} />
          <Route path="/workout/:sessionId" element={<Workout />} />
          <Route path="/history/:exerciseId" element={<History />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
        <Navigation />
      </div>
    </HashRouter>
  );
}
