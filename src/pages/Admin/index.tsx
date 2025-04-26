import RenderContent from "@/pages/Admin/components/RenderContent.tsx";
import RenderBody from "@/pages/Admin/components/RenderBody.tsx";

const AdminHome = () => {
  return (
    <div className="flex flex-col">
      <RenderContent />
      <RenderBody />
    </div>
  );
};

export default AdminHome;
