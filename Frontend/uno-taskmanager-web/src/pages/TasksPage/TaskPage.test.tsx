import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TasksPage from "./TasksPage";
import { taskService } from "../../services/taskService";
import type { Task } from "../../models/task";

vi.mock("../../services/taskService");

vi.mock("../../auth/AuthContext", () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { id: "1", username: "admin" },
    isAuthenticated: true,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Test description 1",
    dueDate: "2026-02-01T00:00:00",
    isCompleted: false,
    createdAt: "2026-01-20T00:00:00",
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Test description 2",
    dueDate: "2026-02-15T00:00:00",
    isCompleted: true,
    createdAt: "2026-01-20T00:00:00",
  },
];

describe.skip("TasksPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title", async () => {
    (taskService.getAll as any).mockResolvedValue([]);

    render(<TasksPage />);

    expect(screen.getByText(/My Tasks/i)).toBeInTheDocument();
  });

  it("shows empty state when no tasks exist", async () => {
    (taskService.getAll as any).mockResolvedValue([]);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    });
  });

  it("renders tasks when they exist", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    (taskService.getAll as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(<TasksPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows error state when loading fails", async () => {
    (taskService.getAll as any).mockRejectedValue(new Error("Failed to load"));

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Error loading tasks")).toBeInTheDocument();
    });
  });

  it("opens edit dialog when edit button is clicked", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: "" });
    const editButton = editButtons[0];

    editButton.click();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Task 1")).toBeInTheDocument();
    });
  });

  it("closes edit dialog when cancel is clicked", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: "" });
    editButtons[0].click();

    await waitFor(() => {
      expect(screen.getByText("Edit Task")).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    cancelButton.click();

    await waitFor(() => {
      expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
    });
  });

  it("saves edited task when save button is clicked", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);
    (taskService.update as any).mockResolvedValue(undefined);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole("button", { name: "" });
    editButtons[0].click();

    await waitFor(() => {
      expect(screen.getByText("Edit Task")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Test Task 1") as HTMLInputElement;
    titleInput.value = "Updated Task Title";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const saveButton = screen.getByRole("button", { name: /Save/i });
    saveButton.click();

    await waitFor(() => {
      expect(taskService.update).toHaveBeenCalled();
    });
  });

  it("deletes task when delete button is clicked", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);
    (taskService.remove as any).mockResolvedValue(undefined);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", { name: "" });
    const deleteButton = deleteButtons[1];

    deleteButton.click();

    await waitFor(() => {
      expect(taskService.remove).toHaveBeenCalledWith("1");
    });
  });

  it("toggles task completion when task is clicked", async () => {
    (taskService.getAll as any).mockResolvedValue(mockTasks);
    (taskService.update as any).mockResolvedValue(undefined);

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    const taskTitle = screen.getByText("Test Task 1");
    taskTitle.click();

    await waitFor(() => {
      expect(taskService.update).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          isCompleted: true,
        })
      );
    });
  });
});
