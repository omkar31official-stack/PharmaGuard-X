import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { DrugSelectionPage } from "./pages/DrugSelectionPage";
import { ResultsPage } from "./pages/ResultsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/select-drugs",
    Component: DrugSelectionPage,
  },
  {
    path: "/results",
    Component: ResultsPage,
  },
]);
