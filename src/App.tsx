import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Unsubscribe from "./pages/Unsubscribe";
import MinhaConta from "./pages/MinhaConta";
import Dashboard from "./pages/crm/Dashboard";
import Leads from "./pages/crm/Leads";
import Pipeline from "./pages/crm/Pipeline";
import Contracts from "./pages/crm/Contracts";
import Partners from "./pages/crm/Partners";
import Financial from "./pages/crm/Financial";
import Commissions from "./pages/crm/Commissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="/crm" element={<Dashboard />} />
          <Route path="/crm/leads" element={<Leads />} />
          <Route path="/crm/pipeline" element={<Pipeline />} />
          <Route path="/crm/contracts" element={<Contracts />} />
          <Route path="/crm/partners" element={<Partners />} />
          <Route path="/crm/financial" element={<Financial />} />
          <Route path="/crm/commissions" element={<Commissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
