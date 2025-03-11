import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/auth/Login";
import Browse from "./components/Browse";
import LogInHelp from "./components/auth/LoginHelp";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/help" element={<LogInHelp />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
