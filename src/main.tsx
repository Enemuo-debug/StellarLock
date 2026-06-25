import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { App } from "@/App"
import { WalletProvider } from "@/hooks/useWallet"
import { ContractEventProvider } from "@/hooks/useContractEventContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <WalletProvider>
            <ContractEventProvider>
              <App />
            </ContractEventProvider>
          </WalletProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
