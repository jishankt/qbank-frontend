import { BrowserRouter, Routes, Route } from "react-router-dom";

import Classes from "./components/classes";
import Subjects from "./components/Subjects";
import Papers from "./components/papers";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Classes />} />
        <Route path="/subjects/:classId" element={<Subjects />} />
        <Route path="/papers/:subjectId" element={<Papers />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;