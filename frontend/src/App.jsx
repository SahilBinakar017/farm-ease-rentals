import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Machines from "./pages/Machines";
import Booking from "./pages/Booking";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import OwnerBookings from "./pages/OwnerBookings";
import AddMachine from "./pages/AddMachine";
import MyMachines from "./pages/MyMachines";
import EditMachine from "./pages/EditMachine";
import AdminMachines from "./pages/AdminMachines";
import AdminBookings from "./pages/AdminBookings";
import AdminFarmers from "./pages/AdminFarmers";
import AdminOwners from "./pages/AdminOwners";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/owner-bookings" element={<OwnerBookings />} />
          <Route path="add-machine" element={<AddMachine />} />
          <Route path="my-machines" element={<MyMachines />} />
          <Route path="/edit-machine/:id" element={<EditMachine />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/machines" element={<AdminMachines />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/owners" element={<AdminOwners />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
