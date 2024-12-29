import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import CardComp from "./CardComp";

describe("CardComp component", () => {
    it("renders card component with required props", () => {
        render(
            <Provider store={store}>
                <CardComp 
                    text={"Avg Answer"}
                    textNumber={10}
                    image={undefined}
                    background={undefined}                    
                /> 
            </Provider>
        );

        expect(screen.getByText("Avg Answer")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("renders card component with subText", () => {
        render(
            <Provider store={store}>
                <CardComp 
                    text={"Avg Answer"}
                    textNumber={10}
                    image={undefined}
                    background={undefined}
                    subText={"Additional Information"}                   
                /> 
            </Provider>
        );
        expect(screen.getByText("Additional Information")).toBeInTheDocument();
    });
 
});
