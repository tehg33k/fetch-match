import { useState } from "react";
import "./App.css";
import { Login } from "./components/login";
import { Match } from "./components/match";
import { Page } from "./components/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryOnMount: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      },
    },
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Page>
          {isLoggedIn ? <Match /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        </Page>
      </QueryClientProvider>
    </>
  );
}

export default App;
