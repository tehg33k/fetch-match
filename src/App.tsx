import { useState } from "react";
import "./App.css";
import { Login } from "./components/login";
import { Match } from "./components/match";
import { Page } from "./components/page";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>
      <Page>
        {isLoggedIn ? <Match /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      </Page>
    </>
  );
}

export default App;
