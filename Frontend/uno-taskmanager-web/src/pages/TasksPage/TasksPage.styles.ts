export const tasksContainerStyles = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  py: 2,
  width: "100%",
  display: "flex",
};

export const tasksHeaderStyles = {
  mb: 2,
};

export const tasksTitleStyles = {
  fontWeight: 700,
  color: "#1a1a1a",
  mb: 0.5,
  fontSize: "2rem",
};

export const tasksSubtitleStyles = {
  color: "#666",
  fontSize: "0.95rem",
};

export const createTaskCardStyles = {
  padding: 2,
  mb: 2,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

export const loadingBoxStyles = {
  display: "flex",
  justifyContent: "center",
  py: 2,
};

export const errorCardStyles = {
  padding: 1.5,
  background: "#ffebee",
  border: "1px solid #ef5350",
  mb: 2,
};

export const errorTextStyles = {
  color: "#c62828",
  fontSize: "0.9rem",
};

export const emptyStateCardStyles = {
  padding: 2,
  textAlign: "center" as const,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

export const emptyStateTextStyles = {
  color: "#999",
  fontSize: "1rem",
};

export const tasksGridStyles = {
  display: "grid",
  gap: 1.5,
};

export const taskCardStyles = (isCompleted: boolean) => ({
  padding: 1.75,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: isCompleted ? "#f0f9ff" : "#fff",
  border: isCompleted ? "1px solid #b3e5fc" : "1px solid #e0e0e0",
  borderRadius: 1.5,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
});

export const taskTitleStyles = (isCompleted: boolean) => ({
  fontSize: "1rem",
  color: isCompleted ? "#999" : "#1a1a1a",
  textDecoration: isCompleted ? "line-through" : "none",
  fontWeight: 500,
});