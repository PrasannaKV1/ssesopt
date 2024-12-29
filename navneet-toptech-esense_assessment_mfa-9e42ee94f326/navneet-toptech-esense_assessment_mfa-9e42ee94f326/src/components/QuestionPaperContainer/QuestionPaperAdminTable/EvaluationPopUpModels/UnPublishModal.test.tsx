import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import UnPublishModal from "./UnPublishModal";

describe("UnPublishModal component", () => {

    it("renders UnPublishModal component", () => {
        render(
            <Provider store={store}>
                <UnPublishModal 
                  open={false}
                  title={""}
                  onClose={jest.fn()}
                  deleteHandler={undefined} 
                  SubTitle2={undefined}                                  
                />
            </Provider>
        );
    });

    it("calls deleteHandler when delete button is clicked", () => {
        const mockDeleteHandler = jest.fn();
        render(
            <Provider store={store}>
                <UnPublishModal 
                  open={true}
                  title="Test Title"
                  onClose={jest.fn()}
                  deleteHandler={mockDeleteHandler} 
                  SubTitle2="Test Subtitle"                                  
                  btnlabel="Delete"
                />
            </Provider>
        );

        const deleteButton = screen.getByText("Delete");
        fireEvent.click(deleteButton);

        expect(mockDeleteHandler).toHaveBeenCalled();
    });

    it("calls onClose when cancel button is clicked", () => {
        const mockOnClose = jest.fn();
        render(
            <Provider store={store}>
                <UnPublishModal 
                  open={true}
                  title="Test Title"
                  onClose={mockOnClose}
                  deleteHandler={jest.fn()} 
                  SubTitle2="Test Subtitle"                                  
                  btnlabel="Delete"
                />
            </Provider>
        );

        const cancelButton = screen.getByText("cancel");
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

});
