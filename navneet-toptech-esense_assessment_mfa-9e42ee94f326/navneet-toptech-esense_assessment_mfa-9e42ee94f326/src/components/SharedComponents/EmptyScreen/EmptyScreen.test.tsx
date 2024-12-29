import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import EmptyScreen from "./EmptyScreen";
import store from "../../../redux/store";

jest.mock("../ButtonComponent/ButtonComponent", () => (props:any) => (
    <button onClick={props.onClick}>{props.label}</button>
));

describe("empty screen component", () => {
    it("renders without crashing", () => {
        render(
            <Provider store={store}>
                <EmptyScreen title="Test Title" desc="Test Description" />
            </Provider>
        );
    });

    it("renders ButtonComponent when emptyBtnTxt is provided", () => {
        render(
            <Provider store={store}>
                <EmptyScreen title="Test Title" desc="Test Description" emptyBtnTxt="Click Me" />
            </Provider>
        );
        expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("calls onClickBtn when ButtonComponent is clicked and createButtonActionObj is not provided", () => {
        const onClickBtnMock = jest.fn();
        render(
            <Provider store={store}>
                <EmptyScreen
                    title="Test Title"
                    desc="Test Description"
                    emptyBtnTxt="Click Me"
                    onClickBtn={onClickBtnMock}
                />
            </Provider>
        );
        fireEvent.click(screen.getByText("Click Me"));
        expect(onClickBtnMock).toHaveBeenCalled();
    });

}); 
