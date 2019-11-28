import React from "react";
import "./App.css";
import { Container } from "semantic-ui-react";
import AppHeader from "./components/Header/index.js";
import Login from "./components/Login/index.js";
function App() {
  return (
    <div className="App">
      <Container>
        <AppHeader></AppHeader>
        <Login></Login>
      </Container>
    </div>
  );
}

export default App;
