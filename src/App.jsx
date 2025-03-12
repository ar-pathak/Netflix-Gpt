import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import LogInHelp from "./components/auth/LoginHelp";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/help" element={<LogInHelp />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App;
