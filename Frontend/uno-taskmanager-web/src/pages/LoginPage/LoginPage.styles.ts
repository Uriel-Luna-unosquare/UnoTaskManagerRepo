import type { SxProps, Theme } from "@mui/material";

export const loginContainerStyles: SxProps<Theme> = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const loginCardStyles: SxProps<Theme> = {
  padding: 4,
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  borderRadius: 2,
};

export const loginTitleStyles: SxProps<Theme> = {
  fontWeight: 700,
  mb: 1,
  color: "#1a1a1a",
};

export const loginSubtitleStyles: SxProps<Theme> = {
  color: "#666",
  mb: 4,
};

export const textFieldStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "#667eea" },
    "&.Mui-focused fieldset": { borderColor: "#667eea" },
  },
};

export const loginButtonStyles: SxProps<Theme> = {
  marginTop: 3,
  padding: "12px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    boxShadow: "0 5px 20px rgba(102, 126, 234, 0.4)",
  },
};
