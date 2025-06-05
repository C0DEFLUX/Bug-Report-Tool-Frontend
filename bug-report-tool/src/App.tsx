import {Route, BrowserRouter as Router, Routes} from "react-router-dom";

import {
    HomePage,
    BugReportPage,
    AddBugReportPage
} from "./pages"

const App = () => {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage/>}/>
              <Route path="/bug-reports" element={<BugReportPage/>}/>
              <Route path="/add-bug-report" element={<AddBugReportPage/>}/>
          </Routes>
      </Router>
  )
}

export default App
