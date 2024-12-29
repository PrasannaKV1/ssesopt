import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../../redux/store";
import WarningModal from "./WarningModal";

describe("WarningModal component", () => {
    const mockHandleClose = jest.fn();
    const mockHandleUploadFile = jest.fn();
    
    const warnContent = {
        errorMessages: [
            { sheetNo: 1, rowNo: 5, errorMessage: "Invalid data format" },
            { sheetNo: 2, rowNo: 10, errorMessage: "Missing required field" }
        ]
    };
    
    const warnMsg = "There was an error processing your file.";

    it("renders WarningModal component when open", () => {
        render(
            <Provider store={store}>
                <WarningModal 
                    open={true}
                    handleClose={mockHandleClose}
                    handleUploadFile={mockHandleUploadFile}
                    warnContent={warnContent}
                />
            </Provider>
        );

        expect(screen.getByText("Error while Uploading Student Marks In Bulk")).toBeInTheDocument();
        expect(screen.getByText("Check row number(s):")).toBeInTheDocument();
    });

    it("renders WarningModal component with warnMsg", () => {
        render(
            <Provider store={store}>
                <WarningModal 
                    open={true}
                    handleClose={mockHandleClose}
                    handleUploadFile={mockHandleUploadFile}
                    warnMsg={warnMsg}
                />
            </Provider>
        );

        expect(screen.getByText("There was an error processing your file.")).toBeInTheDocument();
    });

    it("calls handleClose when close icon is clicked", () => {
        render(
            <Provider store={store}>
                <WarningModal 
                    open={true}
                    handleClose={mockHandleClose}
                    handleUploadFile={mockHandleUploadFile}
                />
            </Provider>
        );

        const closeIcon = screen.getByAltText("closeIcon");
        fireEvent.click(closeIcon);
        expect(mockHandleClose).toHaveBeenCalled();
    });

    it("calls handleUploadFile when Re-upload button is clicked", () => {
        render(
            <Provider store={store}>
                <WarningModal 
                    open={true}
                    handleClose={mockHandleClose}
                    handleUploadFile={mockHandleUploadFile}
                />
            </Provider>
        );

        const reuploadButton = screen.getByText("Re-upload");
        fireEvent.click(reuploadButton);
        expect(mockHandleUploadFile).toHaveBeenCalled();
    });

    it("calls handleClose when Cancel button is clicked", () => {
        render(
            <Provider store={store}>
                <WarningModal 
                    open={true}
                    handleClose={mockHandleClose}
                    handleUploadFile={mockHandleUploadFile}
                />
            </Provider>
        );

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(mockHandleClose).toHaveBeenCalled(); 
    });
});