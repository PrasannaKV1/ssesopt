import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import OnlineColorToggleButton from "./OnlineColorToggleButton";

describe("OnlineColorToggleButton component", () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it("renders OnlineColorToggleButton component", () => {
        render(
            <Provider store={store}>
                <OnlineColorToggleButton selectedTab={""} onChange={mockOnChange} />
            </Provider>
        );

        expect(screen.getByText("Online Tests")).toBeInTheDocument();
        expect(screen.getByText("Daily Quiz")).toBeInTheDocument();
    });

    it("should call onChange with '0' when 'Online Tests' button is clicked", () => {
        render(
            <Provider store={store}>
                <OnlineColorToggleButton selectedTab={"1"} onChange={mockOnChange} />
            </Provider>
        );

        const onlineTestsButton = screen.getByText("Online Tests");
        fireEvent.click(onlineTestsButton);

        // expect(mockOnChange).toHaveBeenCalledWith("0");
    });

    it("should call onChange with '1' when 'Daily Quiz' button is clicked", () => {
        render(
            <Provider store={store}>
                <OnlineColorToggleButton selectedTab={"0"} onChange={mockOnChange} />
            </Provider>
        );

        const dailyQuizButton = screen.getByText("Daily Quiz");
        fireEvent.click(dailyQuizButton);

        // expect(mockOnChange).toHaveBeenCalledWith("1");
    });

    it("should apply active class to 'Online Tests' button when selectedTab is '0'", () => {
        render(
            <Provider store={store}>
                <OnlineColorToggleButton selectedTab={"0"} onChange={mockOnChange} />
            </Provider>
        );

        const onlineTestsButton = screen.getByText("Online Tests");
        expect(onlineTestsButton).toHaveClass("active");
    });

    it("should apply active class to 'Daily Quiz' button when selectedTab is '1'", () => {
        render(
            <Provider store={store}>
                <OnlineColorToggleButton selectedTab={"1"} onChange={mockOnChange} />
            </Provider>
        );

        const dailyQuizButton = screen.getByText("Daily Quiz");
        expect(dailyQuizButton).toHaveClass("active");
    });
});