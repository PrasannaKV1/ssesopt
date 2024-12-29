import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import EditingModal from "./EditingModal";
import { MemoryRouter, useNavigate } from "react-router";

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe("EditingModal component", () => {
  const mockOnClose = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    localStorage.setItem('topAssessData', JSON.stringify({ url: '/test-url' }));
  }); 

  it("renders the EditingModal component when open is true", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={true}
            onClose={mockOnClose}
            pathname="/test-path"
            search="?query=test"
            isFromTeacherWeb={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
    expect(screen.getByText("Continue Editing")).toBeInTheDocument();
    expect(screen.getByText("Exit")).toBeInTheDocument();
  });

  it("does not render the EditingModal component when open is false", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={false}
            onClose={mockOnClose}
            pathname="/test-path"
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
  });

  it("calls onClose when CloseIcon is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={true}
            onClose={mockOnClose}
            pathname="/test-path"
          /> 
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("CloseIcon"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when 'Continue Editing' button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={true}
            onClose={mockOnClose}
            pathname="/test-path"
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Continue Editing"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("navigates correctly when 'Exit' button is clicked and isFromTeacherWeb is true", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={true}
            onClose={mockOnClose}
            pathname="/test-path"
            isFromTeacherWeb={true}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Exit"));
  });

  it("navigates correctly when 'Exit' button is clicked and isFromTeacherWeb is false", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditingModal
            open={true}
            onClose={mockOnClose}
            pathname="/test-path"
            search="?query=test"
            isFromTeacherWeb={false}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Exit"));
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/test-path", search: "?query=test" });
  }); 
}); 