import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

// Mock useAuth
vi.mock("../../auth/AuthContext", () => ({
  useAuth: () => ({
    logout: vi.fn(),
    loginUser: vi.fn(),
    isAuthenticated: true,
  }),
}));