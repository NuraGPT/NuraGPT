import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import Auth from "./pages/Auth.tsx";
import Chat from "./pages/Chat.tsx";
import Psychologist from "./pages/Psychologist.tsx";
import Pricing from "./pages/Pricing.tsx";
import ProfessionalGateway from "./pages/ProfessionalGateway.tsx";
import ProfessionalOnboarding from "./pages/ProfessionalOnboarding.tsx";
import ProfessionalDashboard from "./pages/ProfessionalDashboard.tsx";
import ProfessionalReviews from "./pages/ProfessionalReviews.tsx";
import ProfessionalTransactions from "./pages/ProfessionalTransactions.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/psychologist" element={<Psychologist />} />
          <Route path="/professional" element={<ProfessionalGateway />} />
          <Route path="/professional/onboarding" element={<ProfessionalOnboarding />} />
          <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/professional/reviews" element={<ProfessionalReviews />} />
          <Route path="/professional/transactions" element={<ProfessionalTransactions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
