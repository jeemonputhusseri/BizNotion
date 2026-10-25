import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = () => "Login page";
const RegisterPage = () => "Register page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App