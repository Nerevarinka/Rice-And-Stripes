import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import App from "./app";

import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(
	document.getElementById("root")!
).render(
	<StrictMode>
		<HashRouter>
			<App />
		</HashRouter>
	</StrictMode>,
);
