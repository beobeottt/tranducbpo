import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <Header title={title} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
