import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import BaseOlgaPage from "./pages/BaseOlga";
import CorreosPage from "./pages/Correos";
import NexuraPage from "./pages/Nexura";
import TrasladosPage from "./pages/Traslados";
import ResolucionesPage from "./pages/Resoluciones";
import FiscalizacionPage from "./pages/Fiscalizacion";
import TutelasPage from "./pages/Tutelas";
import ReportesPage from "./pages/Reportes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/BASE-LYD/">
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/base-olga" element={<BaseOlgaPage />} />
            <Route path="/correos" element={<CorreosPage />} />
            <Route path="/nexura" element={<NexuraPage />} />
            <Route path="/traslados" element={<TrasladosPage />} />
            <Route path="/resoluciones" element={<ResolucionesPage />} />
            <Route path="/fiscalizacion" element={<FiscalizacionPage />} />
            <Route path="/tutelas" element={<TutelasPage />} />
            <Route path="/reportes" element={<ReportesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
