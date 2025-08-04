import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Requests from "./pages/Requests";
import NewRequest from "./pages/requests/NewRequest";
import Calendar from "./pages/Calendar";
import Balance from "./pages/Balance";
import Team from "./pages/Team";
import TeamRequests from "./pages/TeamRequests";
import LeaveBalances from "./pages/LeaveBalances";
import AdminSettings from "./pages/AdminSettings";
import Approvals from "./pages/Approvals";
import Users from "./pages/admin/Users";
import NewUser from "./pages/admin/users/NewUser";
import Settings from "./pages/admin/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/requests" element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            } />
            <Route path="/requests/new" element={
              <ProtectedRoute>
                <NewRequest />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/balance" element={
              <ProtectedRoute>
                <LeaveBalances />
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute requiredRole="MANAGER">
                <TeamRequests />
              </ProtectedRoute>
            } />
            <Route path="/validations" element={
              <ProtectedRoute requiredRole="MANAGER">
                <TeamRequests />
              </ProtectedRoute>
            } />
            <Route path="/approvals" element={
              <ProtectedRoute requiredRole="MANAGER">
                <Approvals />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="ADMIN">
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/new" element={
              <ProtectedRoute requiredRole="ADMIN">
                <NewUser />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
