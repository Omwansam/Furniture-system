import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      if (!token) {
        navigate("/admin");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.is_admin) {
            navigate("/admin/overview", { replace: true });
          } else {
            navigate("/admin");
          }
        } else {
          navigate("/admin");
        }
      } catch {
        navigate("/admin");
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Checking admin session...</div>;
};

export default AdminRedirectHandler;
