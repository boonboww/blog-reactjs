import { Sidebar } from "../components/layout/Sidebar";
import { DirectMessages } from "../components/features/messaging/DirectMessages";
import { useNavigate } from "react-router-dom";

/**
 * Instagram-style Messages Page
 * Standalone page accessible via /messages route
 */
export function MessagesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        activeView="messages"
        onNavigate={(view) => {
          if (view === "home") navigate("/");
        }}
        onCreatePost={() => {}}
      />

      {/* Messages Content - Fixed to viewport */}
      <div className="fixed inset-0 lg:left-64 bg-white">
        <DirectMessages />
      </div>
    </div>
  );
}
