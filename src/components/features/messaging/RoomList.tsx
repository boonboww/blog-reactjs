import { useState } from "react";
import { Users, UserPlus, LogOut } from "lucide-react";

interface Room {
  id: string;
  name: string;
  memberCount: number;
  isJoined: boolean;
}

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  onSelectRoom: (roomId: string) => void;
  selectedRoomId?: string;
}

export function RoomList({
  rooms,
  onJoinRoom,
  onLeaveRoom,
  onSelectRoom,
  selectedRoomId,
}: RoomListProps) {
  const [newRoomId, setNewRoomId] = useState("");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomId.trim()) {
      onJoinRoom(newRoomId.trim());
      setNewRoomId("");
    }
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Danh sách phòng
      </h3>

      {/* Create/Join Room Form */}
      <form onSubmit={handleCreateRoom} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
            placeholder="Room ID để tham gia..."
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tham gia
          </button>
        </div>
      </form>

      {/* Room List */}
      <div className="space-y-2">
        {rooms.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Chưa có phòng nào. Tạo phòng mới ở trên!
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedRoomId === room.id
                  ? "bg-blue-50 border-blue-300"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => onSelectRoom(room.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">
                    {room.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {room.memberCount} thành viên
                  </p>
                </div>
                {room.isJoined ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaveRoom(room.id);
                    }}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    Rời
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinRoom(room.id);
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <UserPlus className="w-3 h-3" />
                    Vào
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
