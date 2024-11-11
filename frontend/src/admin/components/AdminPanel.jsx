import React from "react";
import AdminDashboard from "../AdminDashboard";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <AdminDashboard></AdminDashboard>
  );
};

export default AdminPanel;
