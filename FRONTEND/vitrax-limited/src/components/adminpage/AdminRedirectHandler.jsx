const AdminRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
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
            navigate("/admin/login");
          }
        } else {
          navigate("/admin/login");
        }
      } catch {
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Checking admin session...</div>;
};
