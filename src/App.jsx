import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Session from "./pages/Session";
import Workout from "./pages/Workout";
import ProgramInfo from "./pages/ProgramInfo";
import Quick from "./pages/Quick";
import Exercises from "./pages/Exercises";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/session/:sessionId" element={<Session />} />
            <Route path="/workout/:sessionId" element={<Workout />} />
            <Route path="/programme/:programId" element={<ProgramInfo />} />
            <Route path="/quick" element={<Quick />} />
            <Route path="/exos" element={<Exercises />} />
          </Routes>
          <Navigation />
        </div>
      </HashRouter>
    </ErrorBoundary>
  );
}
