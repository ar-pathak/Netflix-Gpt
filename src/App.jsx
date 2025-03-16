import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./context/UserContext";
import Profile from "./components/auth/Profile";

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </UserProvider>
  )
}

export default App;
