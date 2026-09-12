import UserRegisterCard from "../components/UserRegisterCard";
import type { Registrant } from "../libs/Registrant";
// 6
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("registrants");
    if (savedData) {
      setRegistrants(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {/* Conditional Rendering + Render Component */}
      {registrants.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          ยังไม่มีผู้ลงทะเบียน
        </div>
      ) : (
        <div className="mt-3">
          <div className="my-3">ผู้ลงทะเบียนแล้ว ({registrants.length} คน)</div>
          {registrants.map((item) => (
            <UserRegisterCard key={item.id} registrant={item} />
          ))}
        </div>
      )}
    </div>
  );
}
