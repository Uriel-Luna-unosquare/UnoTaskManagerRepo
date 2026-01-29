


import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateTaskForm from "./CreateTaskForm";

vi.mock("../../services/taskService", () => ({
  taskService: {
    create: vi.fn(),
    getAll: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("CreateTaskForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
  });

  it("renders form elements", () => {
    const onTaskCreated = vi.fn();

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("renders form title", () => {
    const onTaskCreated = vi.fn();

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });

  it("shows validation error when only title is provided", async () => {
    const user = userEvent.setup();
    const onTaskCreated = vi.fn();

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await user.type(titleInput, "New Task");

    const submitButton = screen.getByRole("button", { name: /Create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title and due date are required")).toBeInTheDocument();
    });
  });
});