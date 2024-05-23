import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Survey from "./pages/Survey";
import ViewSurveyAnswer from "./pages/ViewSurveyAnswer";
import Dashboard from "./pages/Dashboard";
import Response from "./pages/Response";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Toast from "./components/Toast/Toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "edit/:id",
        element: <Edit />,
      },
      {
        path: "survey/:id",
        element: <Survey />,
      },
      {
        path: "view-survey/:id",
        element: <ViewSurveyAnswer />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "response/:id",
        element: <Response />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

function App() {
  return (
    <main className="2xl:container mx-auto font-WorkSans">
      <Toast/>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
