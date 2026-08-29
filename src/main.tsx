import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import "./index.css"
import App from "./App.tsx"
import { QueryProvider } from "@/providers/QueryProvider"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
)
