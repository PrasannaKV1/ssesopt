import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import ModalPopup from "./ModalPopup";
import { MemoryRouter, useNavigate } from "react-router";

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
})); 

describe("ModalPopup component", () => {
    const mockClickHandler = jest.fn();
    const mockOnClose = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    it("renders ModalPopup component when open is true", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ModalPopup
                        open={true}
                        clickHandler={mockClickHandler}
                        onClose={mockOnClose}
                        pathname="/test-path"
                        search="?query=123"
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText("Unsaved Changes")).toBeInTheDocument();
    });

    it("does not render ModalPopup component when open is false", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ModalPopup
                        open={false}
                        clickHandler={mockClickHandler}
                        onClose={mockOnClose}
                        pathname="/test-path"
                        search="?query=123"
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText("Unsaved Changes")).not.toBeInTheDocument();
    });

    it("calls onClose when the CloseIcon is clicked", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ModalPopup
                        open={true}
                        clickHandler={mockClickHandler}
                        onClose={mockOnClose}
                        pathname="/test-path"
                        search="?query=123"
                    />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByTestId('CloseIcon'));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("calls clickHandler when 'Save and Continue' button is clicked", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ModalPopup
                        open={true}
                        clickHandler={mockClickHandler}
                        onClose={mockOnClose}
                        pathname="/test-path"
                        search="?query=123"
                    />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText("Save and Continue"));
        expect(mockClickHandler).toHaveBeenCalledTimes(1);
    });

    it("calls navigate with the correct arguments when 'Continue Without Saving' button is clicked", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <ModalPopup
                        open={true}
                        clickHandler={mockClickHandler}
                        onClose={mockOnClose}
                        pathname="/test-path"
                        search="?query=123"
                    />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText("Continue Without Saving"));
        expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/test-path", search: "?query=123" });
    }); 
}); 