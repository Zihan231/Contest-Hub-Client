import { Outlet } from "react-router";
import { FaBars } from "react-icons/fa";
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* --- MAIN CONTENT --- */}
      <div className="drawer-content flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <div className="w-full navbar bg-base-100 lg:hidden shadow-sm sticky top-0 z-40 border-b border-base-200 px-4">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost text-primary drawer-button">
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-black text-xl">
            <span className="text-primary">Dashboard</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </div> 
      
      {/* --- SIDEBAR DRAWER --- */}
      <div className="drawer-side z-50">
        {/* This overlay acts as the background click-to-close */}
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <DashboardSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;