import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </UserProvider>
  )
}

export default App;
