import { Outlet } from "react-router";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-200">
      
      {/* Left Sidebar (Fixed width) */}
      <DashboardSidebar />

      {/* Right Content Area (Takes remaining space) */}
      <div className="flex-1 lg:ml-64 p-8 transition-all duration-300">
        <Outlet /> {/* This will render Dashboard.jsx, Profile.jsx, etc. */}
      </div>

    </div>
  );
};

export default DashboardLayout;