import type { SxProps, Theme } from "@mui/material";

export const tasksContainerStyles: SxProps<Theme> = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  paddingY: 4,
};

export const tasksHeaderStyles: SxProps<Theme> = {
  mb: 4,
};

export const tasksTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  color: "#1a1a1a",
  mb: 1,
};

export const tasksSubtitleStyles: SxProps<Theme> = {
  color: "#666",
};

export const formCardStyles: SxProps<Theme> = {
  padding: 3,
  mb: 3,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

export const loadingContainerStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  py: 4,
};

export const errorCardStyles: SxProps<Theme> = {
  padding: 2,
  background: "#ffebee",
  border: "1px solid #ef5350",
};

export const errorTextStyles: SxProps<Theme> = {
  color: "#c62828",
};

export const emptyStateCardStyles: SxProps<Theme> = {
  padding: 4,
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

export const emptyStateTextStyles: SxProps<Theme> = {
  color: "#999",
};

export const tasksGridStyles: SxProps<Theme> = {
  display: "grid",
  gap: 2,
};

export const taskCardStyles: SxProps<Theme> = {
  padding: 2.5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 1.5,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
};

export const getTaskCardBackgroundStyles = (isCompleted: boolean): SxProps<Theme> => ({
  ...taskCardStyles,
  background: isCompleted ? "#f0f9ff" : "#fff",
  border: isCompleted ? "1px solid #b3e5fc" : "1px solid #e0e0e0",
});

export const taskTitleStyles = (isCompleted: boolean): SxProps<Theme> => ({
  fontSize: "1.1rem",
  color: isCompleted ? "#999" : "#1a1a1a",
  textDecoration: isCompleted ? "line-through" : "none",
  fontWeight: 500,
});

export const taskCheckmarkStyles: SxProps<Theme> = {
  fontSize: "1.5rem",
  ml: 2,
};
