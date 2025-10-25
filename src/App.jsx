import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UnitFormPage from "./pages/UnitFormPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function Header() {
  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <nav>
        <Link to="/" style={{ marginRight: 12 }}>
          Home
        </Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ padding: 12, borderTop: "1px solid #ddd", marginTop: 20 }}>
      RTW Editor
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <main style={{ padding: 12 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/editor/units" element={<UnitFormPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
