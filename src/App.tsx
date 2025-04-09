import { useRoutes } from "react-router-dom";

import "@/styles/globals.css";
import routes from "@/routes";

function App() {
  return useRoutes(routes);
}

export default App;
