import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/error-boundary";
import { ThemeProvider } from "./contexts/theme-context";
import Home from "./pages/home";
import Geographic from "./pages/geographic";
import Segments from "./pages/segments";
import Sentiment from "./pages/sentiment";
import Pipeline from "./pages/pipeline";
import Chatbot from "./pages/chatbot";
import Predictions from "./pages/predictions";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/geographic"} component={Geographic} />
      <Route path={"/segments"} component={Segments} />
      <Route path={"/sentiment"} component={Sentiment} />
      <Route path={"/pipeline"} component={Pipeline} />
      <Route path={"/predictions"} component={Predictions} />
      <Route path={"/chatbot"} component={Chatbot} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
