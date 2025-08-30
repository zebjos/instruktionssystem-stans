import AdminGate from "../components/admin/AdminGate";
import AdminPanel from "../components/admin/AdminPanel";

function Admin() {
  return (
    <AdminGate>
      <AdminPanel />
    </AdminGate>
  );
}

export default Admin;