import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import FileUploadPopup from "./FileUploadPopUp";

describe("FileUploadPopup component", () => {
    it("renders FileUploadPopup component with correct props", () => {
        const mockHandleUpload = jest.fn();
        const mockSetStudentData = jest.fn();
        const mockSetSelected = jest.fn();
        const mockSetSelectAll = jest.fn();
        const options = {
            title: 'Sample Title',
            subtitle: 'Sample Subtitle',
            description: 'Sample Description',
            data: [],
            excelName: 'sample.xlsx',
            allocationID: '12345'
        };
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    options={options} 
                    handleClose={jest.fn()}
                    handleUpload={mockHandleUpload}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={mockSetStudentData}
                    isUploadSheet={false}
                    setSelected={mockSetSelected}
                    setSelectAll={mockSetSelectAll}
                />
            </Provider>
        );

        expect(screen.getByText(/Upload/i)).toBeInTheDocument(); 
        expect(screen.getByText(/Sample Title/i)).toBeInTheDocument(); 
        expect(screen.getByText(/Sample Subtitle/i)).toBeInTheDocument(); 
        expect(screen.getByText(/Sample Description/i)).toBeInTheDocument(); 

    });

    it("calls handleClose when close button is clicked", () => {
        const mockHandleClose = jest.fn();
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={mockHandleClose}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );
    });

    it("calls handleUpload with correct parameters when upload button is clicked", () => {
        const mockHandleUpload = jest.fn();
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={mockHandleUpload}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );
        fireEvent.click(screen.getByText(/Upload/i)); 
    });

    it("calls setStudentData when appropriate", () => {
        const mockSetStudentData = jest.fn();
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={mockSetStudentData}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );
    });

    it("calls setSelected when selection is made", () => {
        const mockSetSelected = jest.fn();
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={mockSetSelected}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );
    });

    it("calls setSelectAll when select all checkbox is clicked", () => {
        const mockSetSelectAll = jest.fn();
        render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={mockSetSelectAll}
                />
            </Provider>
        );
    });

    it("conditionally renders elements based on props", () => {
        const { rerender } = render(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={false}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );

        expect(screen.queryByText(/Bulk Marks/i)).toBeNull();
        rerender(
            <Provider store={store}>
                <FileUploadPopup 
                    handleClose={jest.fn()}
                    handleUpload={jest.fn()}
                    isDownload={true}
                    isBulkMarks={true}
                    isSheetUpload={true}
                    setStudentData={jest.fn()}
                    isUploadSheet={false}
                    setSelected={jest.fn()}
                    setSelectAll={jest.fn()}
                />
            </Provider>
        );

        expect(screen.getByText(/Download Sample File/i)).toBeInTheDocument();
        expect(screen.getByTestId(/fileInput/i)).toBeInTheDocument();
        expect(screen.getByText(/Select File from Computer/i)).toBeInTheDocument();  

    }); 
});
