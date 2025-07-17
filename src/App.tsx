
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<div className="p-6"><h1 className="text-2xl font-bold">Rechercher médecin</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="/appointments" element={<Appointments />} />            
            <Route path="/medical-file" element={<div className="p-6"><h1 className="text-2xl font-bold">Dossier médical</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="/emergency" element={<div className="p-6"><h1 className="text-2xl font-bold">Urgences</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="/messages" element={<div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="/reminders" element={<div className="p-6"><h1 className="text-2xl font-bold">Rappels</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Mon profil</h1><p className="text-muted-foreground">Page en construction...</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
