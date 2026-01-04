import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersPage from "../pages/UsersPage";
import HomePage from "../pages/HomePage";
import EventsPage from "../pages/EventsPage";
import ShopsPage from "../pages/ShopsPage";
import LoginPage from "../pages/LoginPage";
import ChabibaPage from "../pages/ChabibaPage";
import ForsanPage from "../pages/ForsanPage";
import Tala2e3Page from "../pages/Tala2e3Page";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/chabiba" element={<ChabibaPage />} />
          <Route path="/forsan" element={<ForsanPage />} />
          <Route path="/tala2e3" element={<Tala2e3Page />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
