import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import OnlineAssesmentTabMenu from "./OnlineAssesmentTabMenu";

describe("OnlineAssesmentTabMenu component", () => {
    it("renders the component correctly", () => {
        const { getByText } = render(
            <Provider store={store}>
                <OnlineAssesmentTabMenu />
            </Provider>
        );

        expect(getByText("Online Tests")).toBeInTheDocument();
    }); 
});