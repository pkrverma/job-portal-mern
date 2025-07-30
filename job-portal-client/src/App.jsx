import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";

function App() {
  return (
    <div className="app-container flex min-h-screen flex-col">
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
