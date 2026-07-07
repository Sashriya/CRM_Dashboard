import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";
import AIAssistant from "./components/AIAssistant.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Overview from "./pages/Overview.jsx";
import Contacts from "./pages/Contacts.jsx";
import Leads from "./pages/Leads.jsx";
import Deals from "./pages/Deals.jsx";
import Tasks from "./pages/Tasks.jsx";

function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px" } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout onOpenAssistant={() => setAssistantOpen(true)}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/tasks" element={<Tasks />} />
                </Routes>
              </AppLayout>
              <AIAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
