import "./App.css";
import Home from "./Pages/Home";
import Web3 from "web3";
function App() {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
  }

 
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
