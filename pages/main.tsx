import { createRoot } from "react-dom/client";
import Bureau from "../app/page";
import "../app/globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("The bureau's application root is missing.");
createRoot(root).render(<Bureau />);
