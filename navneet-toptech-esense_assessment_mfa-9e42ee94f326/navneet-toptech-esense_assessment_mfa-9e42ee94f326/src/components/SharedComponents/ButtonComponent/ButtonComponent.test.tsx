import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import ButtonComponent from "./ButtonComponent";

describe("ButtonComponent", () => {
    it("renders without crashing with required props", () => {
        render(
            <Provider store={store}>
                <ButtonComponent 
                    type="contained"
                    label="Test Button"
                    textColor="white"
                    buttonSize="Medium"
                    minWidth="100"
                />
            </Provider>
        );
        expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("calls onClick handler when clicked", () => {
        const mockOnClick = jest.fn(); // Mock function
        render(
            <Provider store={store}>
                <ButtonComponent 
                    type="contained"
                    label="Test Button"
                    textColor="white"
                    buttonSize="Medium"
                    minWidth="100"
                    onClick={mockOnClick} 
                />
            </Provider>
        );

        fireEvent.click(screen.getByText("Test Button")); 
        expect(mockOnClick).toHaveBeenCalled();
    });
});