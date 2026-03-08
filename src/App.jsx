import { BrowserRouter, Routes, Route } from "react-router-dom";

import Classes from "./components/Classes";
import Subjects from "./components/Subjects";
import Papers from "./components/Papers";

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