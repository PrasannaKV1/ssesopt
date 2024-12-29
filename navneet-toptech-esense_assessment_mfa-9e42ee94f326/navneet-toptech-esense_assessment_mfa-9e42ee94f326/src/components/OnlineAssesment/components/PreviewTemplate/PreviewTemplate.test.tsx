import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import PreviewTemplate from "./PreviewTemplate";
import { QuestionPaperViewApi } from "../../../../Api/QuestionTypePaper";

// Mock the API call
jest.mock('../../../../Api/QuestionTypePaper', () => ({
  QuestionPaperViewApi: jest.fn(),
}));

describe("PreviewTemplate component", () => {
  const mockHandleClose = jest.fn();

  const mockPreviewJson = {
    id: 1,
    templateID: 2,
  };

  it("renders PreviewTemplate component", () => {
    render(
      <Provider store={store}>
        <PreviewTemplate
          open={false}
          handleClose={mockHandleClose}
          previewJson={undefined}
        />
      </Provider>
    );
  });

  it("renders the modal when open is true", () => {
    render(
      <Provider store={store}>
        <PreviewTemplate
          open={true}
          handleClose={mockHandleClose}
          previewJson={mockPreviewJson}
        />
      </Provider>
    );

    expect(screen.getByText(/Total questions/i)).toBeInTheDocument();
  });

  it("calls handleClose when the Go Back button is clicked", () => {
    render(
      <Provider store={store}>
        <PreviewTemplate
          open={true}
          handleClose={mockHandleClose}
          previewJson={mockPreviewJson}
        />
      </Provider>
    );

    const goBackButton = screen.getByText(/Go Back/i);
    fireEvent.click(goBackButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("logs an error if the API call fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('API Error');
    
    (QuestionPaperViewApi as jest.Mock).mockRejectedValue(mockError);

    render(
      <Provider store={store}>
        <PreviewTemplate
          open={true}
          handleClose={mockHandleClose}
          previewJson={mockPreviewJson}
        />
      </Provider>
    ); 

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching radioResponse: ', mockError);
    });

    consoleErrorSpy.mockRestore();
  }); 
});
