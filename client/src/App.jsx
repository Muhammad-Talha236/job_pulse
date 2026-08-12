// src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <AppRoutes />
      </JobProvider>
    </AuthProvider>
  );
}

export default App;