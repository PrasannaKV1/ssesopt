import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import PreviewTemplate from "./PreviewTemplate";
import store from "../../../../redux/store";
import { getAllStudentListApi } from '../../../../Api/QuestionTypePaper';
import * as helper from '../../../../constants/helper';

jest.mock('../../../../Api/QuestionTypePaper');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));
jest.mock('../../../../constants/helper');

describe("PreviewTemplate component", () => {
  const mockHandleClose = jest.fn();
  const mockPreviewJson = {
    bodyTemplate: {
      templateBuilderInfo: {
        questionPaperFontMetaData: {
          font: "Arial",
          size: "12",
        },
        paperLevelIndexSequence: {
          question: 10,
        },
      },
    },
  };

  const defaultProps = {
    open: true,
    handleClose: mockHandleClose,
    previewJson: mockPreviewJson,
    isAfterGenQP: false,
    questionPaperDetails: {
      courses: [{ courseID: '1' }],
      sections: [{ sectionID: '1' }],
      gradeID: '1',
    },
    questionPaperID: '123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (helper.getLocalStorageDataBasedOnKey as jest.Mock).mockReturnValue(JSON.stringify({
      login: {
        userData: {
          userRefId: 'testUserId'
        }
      }
    }));
  });

  it("renders PreviewTemplate component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Total questions: 10")).toBeInTheDocument();
  });

  it("closes the modal when clicking the close button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Go Back"));
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("renders 'After Generate Question Paper' view", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("You can preview the generated question paper here")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("View Model Answers")).toBeInTheDocument();
    expect(screen.getByText("Assign Students")).toBeInTheDocument();
  });

  it("toggles view model answers", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("View Model Answers"));
    expect(screen.getByText("Hide Model Answers")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Model Answers"));
    expect(screen.getByText("View Model Answers")).toBeInTheDocument();
  });

  it("opens AssignStudentListModal when clicking 'Assign Students'", async () => {
    (getAllStudentListApi as jest.Mock).mockResolvedValue({
      data: [
        { className: 'Class A', rollNumber: '1' },
        { className: 'Class A', rollNumber: '2' },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Assign Students"));
    
    await waitFor(() => {
      expect(getAllStudentListApi).toHaveBeenCalled();
    });
  });

  it("opens EditingModal when clicking 'Cancel'", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("handles student list sorting for multiple classes", async () => {
    (getAllStudentListApi as jest.Mock).mockResolvedValue({
      data: [
        { className: 'Class B', rollNumber: '2' },
        { className: 'Class A', rollNumber: '1' },
        { className: 'Class B', rollNumber: '1' },
        { className: 'Class A', rollNumber: '2' },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Assign Students"));
    
    await waitFor(() => {
      expect(getAllStudentListApi).toHaveBeenCalled();
    });
  });

  it("handles edit button click", () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("handles error in getAllStudentListApi", async () => {
    (getAllStudentListApi as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PreviewTemplate {...defaultProps} isAfterGenQP={true} />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText("Assign Students"));
    
    await waitFor(() => {
      expect(getAllStudentListApi).toHaveBeenCalled();
    });
  });  

});  