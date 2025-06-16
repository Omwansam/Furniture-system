const AdminRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/admin/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          navigate("/admin/overview", { replace: true });
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
