import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layouts/layout";
import Home from "./pages/home";
import Join from "./pages/join";
import ToDo from "./pages/toDo";
import Board from "./pages/board";
import BoardDetail from "./pages/boardDetail";
import BoardInsert from "./pages/boardInsert";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="join" element={<Join />} />
            <Route path="toDo" element={<ToDo />} />
            <Route path="board" element={<Board />} />
            <Route path="board/:num" element={<BoardDetail />} />
            <Route path="board/insert" element={<BoardInsert />} />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App;
