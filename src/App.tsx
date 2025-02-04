import "./App.css";
import { Page } from "./components/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContextHandler } from "./context/user";

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

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserContextHandler>
          <Page />
        </UserContextHandler>
      </QueryClientProvider>
    </>
  );
}

export default App;
