import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/Login";
import Browse from "./components/Browse";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
