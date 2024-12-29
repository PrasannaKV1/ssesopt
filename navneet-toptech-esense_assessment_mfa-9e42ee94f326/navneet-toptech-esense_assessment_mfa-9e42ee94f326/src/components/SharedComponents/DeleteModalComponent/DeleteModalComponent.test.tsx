import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import DeleteModalComponent from "./DeleteModalComponent";

describe("DeleteModalComponent", () => {
    it("renders the component with provided props", () => {
        render(
            <Provider store={store}>
                <DeleteModalComponent 
                    open={true}
                    descriptionText="Are you sure you want to delete this item?"
                    title="Delete Item"
                    onClose={jest.fn()}
                    deleteHandler={jest.fn()}
                />
            </Provider>
        );
        expect(screen.getByText("Delete Item")).toBeInTheDocument();
        expect(screen.getByText("Are you sure you want to delete this item?")).toBeInTheDocument();
    });

    it("calls deleteHandler when Delete button is clicked", () => {
        const deleteHandler = jest.fn();
        render(
            <Provider store={store}>
                <DeleteModalComponent 
                    open={true}
                    descriptionText="Are you sure you want to delete this item?"
                    title="Delete Item"
                    onClose={jest.fn()}
                    deleteHandler={deleteHandler}
                />
            </Provider>
        );
        fireEvent.click(screen.getByText("Delete"));
        expect(deleteHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Cancel button is clicked", () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <DeleteModalComponent 
                    open={true}
                    descriptionText="Are you sure you want to delete this item?"
                    title="Delete Item"
                    onClose={onClose}
                    deleteHandler={jest.fn()}
                />
            </Provider>
        );
        fireEvent.click(screen.getByText("Cancel"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when close icon is clicked", () => {
        const onClose = jest.fn();
        render(
            <Provider store={store}>
                <DeleteModalComponent 
                    open={true}
                    descriptionText="Are you sure you want to delete this item?"
                    title="Delete Item"
                    onClose={onClose}
                    deleteHandler={jest.fn()}
                />
            </Provider>
        );
    }); 

    it("does not render modal content when open is false", () => {
        render(
            <Provider store={store}>
                <DeleteModalComponent 
                    open={false}
                    descriptionText="Are you sure you want to delete this item?"
                    title="Delete Item"
                    onClose={jest.fn()}
                    deleteHandler={jest.fn()}
                />
            </Provider>
        );
        expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
        expect(screen.queryByText("Are you sure you want to delete this item?")).not.toBeInTheDocument();
    });
});
