import React from "react";

interface SoftDeleteTaskProps {
  taskId: number;
  onDelete: () => void;
}

export const SoftDeleteTask: React.FC<SoftDeleteTaskProps> = ({ taskId, onDelete }) => {
  const handleSoftDelete = async () => {
    try {
      await softDeleteTask(taskId);  // Assuming you already have the API function
      alert("Task soft-deleted!");
      onDelete();
    } catch (error) {
      console.error("Error soft-deleting task:", error);
      alert("Failed to soft-delete task.");
    }
  };

  return (
    <button onClick={handleSoftDelete} style={{ margin: "10px", padding: "10px", backgroundColor: "red", color: "white" }}>
      Soft Delete
    </button>
  );
};
