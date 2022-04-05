import { Route, Routes } from "react-router-dom";
import { AcceptRoutes } from "./routes";

const AppRoutes = () => {
  return (
    <Routes>
      {AcceptRoutes.Routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}

      <Route
        path="*"
        element={<h1 style={{ textAlign: "center" }}>404 Not Found</h1>}
      />
    </Routes>
  );
};

export default AppRoutes;
