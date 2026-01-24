import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import TasksPage from "./pages/TasksPage/TasksPage";

function App() {
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Box>
  );
}

export default App;