import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Create from "./components/Create";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/create" element={<Create />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
