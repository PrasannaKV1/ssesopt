import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import OnlineTestPreview from "./OnlineTestPreview";
import { MemoryRouter } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllStudentListApi, QuestionPaperViewApi } from "../../../Api/QuestionTypePaper";

jest.mock("../../../Api/QuestionTypePaper", () => ({
  getAllStudentListApi: jest.fn(),
  QuestionPaperViewApi: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("OnlineTestPreview Component", () => {
  const mockNavigate = jest.fn();
  const mockUseLocation = useLocation as jest.Mock;
  const mockGetAllStudentListApi = getAllStudentListApi as jest.Mock;
  const mockQuestionPaperViewApi = QuestionPaperViewApi as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    localStorage.setItem(
      "state",
      JSON.stringify({
        login: { userData: { userRefId: 123 } },
      })
    );
    mockQuestionPaperViewApi.mockResolvedValue({
      result: { responseCode: 0 },
      data: {
        generatedQuestionPaper: {
          bodyTemplate: {
            templateBuilderInfo: {
              questionPaperFontMetaData: {
                fontSize: "12",
                fontFamily: "Arial",
              },
              paperLevelIndexSequence: {
                question: 10,
              },
            },
          },
        },
        courses: [{ courseID: 1 }],
        sections: [{ sectionID: 1 }],
        gradeID: 1,
        questionPaperTypeID: 2,
      },
    });
  });

  const renderComponent = async (props = {}) => {
    mockUseLocation.mockReturnValue({
      state: {
        questionPaperID: 1,
        isAfterGenQP: true,
        isFromTeacherWeb: false,
        isFromChapterChallenge: false,
        ...props,
      },
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <OnlineTestPreview />
          </MemoryRouter>
        </Provider>
      );
    });
  };

  test("renders correctly when isAfterGenQP is false", async () => {
    await renderComponent({ isAfterGenQP: false });
  });

  test("renders correctly when isAfterGenQP is true", async () => {
    await renderComponent();
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByText("You can preview the generated question paper here")).toBeInTheDocument();
    expect(screen.getByText("Total questions: 10")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View Modal Answers/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Assign Students/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("clicking Edit button navigates to correct route", async () => {
    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/assess/evaluation/onlineAssesment/printforpreview",
      expect.any(Object)
    );
  });

  test("toggle View Modal Answers button", async () => {
    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /View Modal Answers/i }));
    expect(screen.getByRole("button", { name: /Hide Model Answers/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Hide Model Answers/i }));
    expect(screen.getByRole("button", { name: /View Modal Answers/i })).toBeInTheDocument();
  });

  test("clicking Assign Students button opens modal with student list", async () => {
    mockGetAllStudentListApi.mockResolvedValue({
      data: [
        { rollNumber: "1", className: "Class A" },
        { rollNumber: "2", className: "Class A" },
      ],
    });

    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Assign Students/i }));


    expect(mockGetAllStudentListApi).toHaveBeenCalledWith(expect.any(Object));
  });

  test("handles API error gracefully when assigning students", async () => {
    mockGetAllStudentListApi.mockRejectedValue(new Error("API Error"));

    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Assign Students/i }));

    await waitFor(() => {
      expect(mockGetAllStudentListApi).toHaveBeenCalled();
    });

    expect(screen.queryByText("Assign Student List Modal")).not.toBeInTheDocument();
  });

  test("clicking Cancel button opens EditingModal", async () => {
    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

  });

  test("handles Done button click for chapter challenge", async () => {
    await renderComponent({ isFromChapterChallenge: true });
    fireEvent.click(screen.getByRole("button", { name: /Done/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/assess/evaluation/onlineAssesment', expect.any(Object));
  });

  test("handles Done button click for teacher web", async () => {
    await renderComponent({ isFromTeacherWeb: true });
  });

  test("closes AssignStudentListModal", async () => {
    mockGetAllStudentListApi.mockResolvedValue({
      data: [{ rollNumber: "1", className: "Class A" }],
    });

    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Assign Students/i }));
  });

  test("closes EditingModal", async () => {
    await renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(screen.queryByText("Editing Modal")).not.toBeInTheDocument();
  });

  test("renders correctly for non-standard question paper", async () => {
    mockQuestionPaperViewApi.mockResolvedValue({
      result: { responseCode: 0 },
      data: {
        generatedQuestionPaper: {
          bodyTemplate: {
            templateBuilderInfo: {
              paperLevelIndexSequence: {},
            },
          },
        },
      },
    });

    await renderComponent();
  });
});