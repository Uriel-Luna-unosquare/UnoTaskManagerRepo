import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateTaskForm from "./CreateTaskForm";
import { taskService } from "../../services/taskService";

vi.mock("../../services/taskService");

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

  it("shows validation error when required fields are empty", async () => {
    const onTaskCreated = vi.fn();

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText("Title and due date are required")).toBeInTheDocument();
    });
  });

  it("shows validation error when only title is provided", async () => {
    const onTaskCreated = vi.fn();

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText("Title and due date are required")).toBeInTheDocument();
    });
  });

  it("calls taskService.create when form is submitted with valid data", async () => {
    const onTaskCreated = vi.fn();
    (taskService.create as any).mockResolvedValue({});

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const descriptionInput = screen.getByLabelText(/Description/i) as HTMLInputElement;
    descriptionInput.value = "Task description";
    descriptionInput.dispatchEvent(new Event("change", { bubbles: true }));

    // For date picker, we need to set the date via the input
    const dateInputs = screen.getAllByDisplayValue("");
    if (dateInputs.length > 0) {
      const dateInput = dateInputs[0] as HTMLInputElement;
      dateInput.value = "2026-02-01";
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(taskService.create).toHaveBeenCalled();
    });
  });

  it("calls onTaskCreated callback after successful creation", async () => {
    const onTaskCreated = vi.fn();
    (taskService.create as any).mockResolvedValue({});

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const dateInputs = screen.getAllByDisplayValue("");
    if (dateInputs.length > 0) {
      const dateInput = dateInputs[0] as HTMLInputElement;
      dateInput.value = "2026-02-01";
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(onTaskCreated).toHaveBeenCalled();
    });
  });

  it("clears form inputs after successful creation", async () => {
    const onTaskCreated = vi.fn();
    (taskService.create as any).mockResolvedValue({});

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const descriptionInput = screen.getByLabelText(/Description/i) as HTMLInputElement;
    descriptionInput.value = "Task description";
    descriptionInput.dispatchEvent(new Event("change", { bubbles: true }));

    const dateInputs = screen.getAllByDisplayValue("");
    if (dateInputs.length > 0) {
      const dateInput = dateInputs[0] as HTMLInputElement;
      dateInput.value = "2026-02-01";
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(titleInput.value).toBe("");
      expect(descriptionInput.value).toBe("");
    });
  });

  it("shows error message when task creation fails", async () => {
    const onTaskCreated = vi.fn();
    (taskService.create as any).mockRejectedValue(new Error("Failed to create"));

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const dateInputs = screen.getAllByDisplayValue("");
    if (dateInputs.length > 0) {
      const dateInput = dateInputs[0] as HTMLInputElement;
      dateInput.value = "2026-02-01";
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitButton = screen.getByRole("button", { name: /Create/i });
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByText("Failed to create task")).toBeInTheDocument();
    });
  });

  it("disables submit button while loading", async () => {
    const onTaskCreated = vi.fn();
    (taskService.create as any).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<CreateTaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
    titleInput.value = "New Task";
    titleInput.dispatchEvent(new Event("change", { bubbles: true }));

    const dateInputs = screen.getAllByDisplayValue("");
    if (dateInputs.length > 0) {
      const dateInput = dateInputs[0] as HTMLInputElement;
      dateInput.value = "2026-02-01";
      dateInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const submitButton = screen.getByRole("button", { name: /Create/i }) as HTMLButtonElement;
    submitButton.click();

    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
      expect(screen.getByText("Creating...")).toBeInTheDocument();
    });
  });
});
