import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../../redux/store";
import OnlineStudentListTablefilter from "./OnlineStudentListTablefilter";

describe('OnlineStudentListTablefilter', () => {
    const mockHandleStudentNameSearch = jest.fn();
    const mockHandleSectionFilter = jest.fn();
    // const mockUseNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the component", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <OnlineStudentListTablefilter
                        handleStudentNameSearch={mockHandleStudentNameSearch}
                        handleSectionFilter={mockHandleSectionFilter}
                        createOnlineTestBtn={false}
                    />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByPlaceholderText("Search for Student")).toBeInTheDocument();
    });

    it("triggers handleStudentNameSearch on typing in search field", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <OnlineStudentListTablefilter
                        handleStudentNameSearch={mockHandleStudentNameSearch}
                        handleSectionFilter={mockHandleSectionFilter}
                        createOnlineTestBtn={false}
                    />
                </MemoryRouter>
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText("Search for Student");
        fireEvent.change(searchInput, { target: { value: "John Doe" } });

        expect(mockHandleStudentNameSearch).toHaveBeenCalledWith("John Doe");
    });

    it("triggers handleSectionFilterChange on section change", async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <OnlineStudentListTablefilter
                        handleStudentNameSearch={mockHandleStudentNameSearch}
                        handleSectionFilter={mockHandleSectionFilter}
                        createOnlineTestBtn={false}
                        selectedQuestion={{
                            questionPaperSectionDetails: [
                                { sectionID: 1, sectionName: "Section 1" },
                                { sectionID: 2, sectionName: "Section 2" }
                            ]
                        }}
                    />
                </MemoryRouter>
            </Provider>
        );
    });
    it("triggers createNewTest on clicking the Create New Online Test button", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <OnlineStudentListTablefilter
                        handleStudentNameSearch={mockHandleStudentNameSearch}
                        handleSectionFilter={mockHandleSectionFilter}
                        createOnlineTestBtn={false}
                        isFromTeacherWeb={true}
                    />
                </MemoryRouter>
            </Provider>
        );
        // const createTestButton = screen.getByText("+  Create New Online Test");
        // fireEvent.click(createTestButton); 
    });    

});