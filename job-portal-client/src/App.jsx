import { Outlet } from "react-router";
import "./App.css";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <div className="app-container flex min-h-screen flex-col">
        <Navbar />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
