// ── UPDATE YOUR App.jsx with these routes ──
// Add the new imports + routes as shown below

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Classes from "./components/classes";       // or wherever your files are
import Subjects from "./components/Subjects";
import Papers from "./components/papers";
import Bookmarks from "./components/Bookmarks";   // NEW
import About from "./components/About";           // NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Classes />} />
        <Route path="/subjects/:classId"  element={<Subjects />} />
        <Route path="/papers/:subjectId"  element={<Papers />} />
        <Route path="/bookmarks"          element={<Bookmarks />} />   {/* NEW */}
        <Route path="/about"             element={<About />} />        {/* NEW */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
