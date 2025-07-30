import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsersProvider } from "@/contexts/UsersContext";
import Index from "./pages/Index";
import Requests from "./pages/Requests";
import NewRequest from "./pages/requests/NewRequest";
import Calendar from "./pages/Calendar";
import Balance from "./pages/Balance";
import Team from "./pages/Team";
import Approvals from "./pages/Approvals";
import Users from "./pages/admin/Users";
import NewUser from "./pages/admin/users/NewUser";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UsersProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/new" element={<NewRequest />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/team" element={<Team />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/new" element={<NewUser />} />
            <Route path="/admin/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UsersProvider>
  </QueryClientProvider>
);

export default App;
