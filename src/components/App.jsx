import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import AppContextProvider from "../contexts/AppContext";

const App = () => (
  <AppContextProvider>
    <Header />
    <Main />
    <Footer />
  </AppContextProvider>
);

export default App;
