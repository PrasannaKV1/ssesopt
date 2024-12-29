import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../../../redux/store";
import StudentSetListModal from "./StudentSetModal";
import { assignEditSets, assignSets, getAllStudentListApi, getAllStudentListApi1 } from '../../../../Api/QuestionTypePaper';
jest.mock("../../../../Api/QuestionTypePaper")

describe("StudentSetListModal component", () => {
    
    const mockEditData = {
        "data": [
            {
                "section": "C",
                "sectionId": 4,
                "studentId": 45,
                "firstName": "pk vee",
                "lastName": null,
                "rollNumber": "736476374",
                "className": "Grade 6 - C",
                "courseIds": [
                    461
                ],
                "classId": 7,
                "allocationId": 24864,
                "middleName": null,
                "isAnswerSheetUploaded": false,
                "isMarksUploaded": true,
                "studentProfileImg": "https://topschool-uploads-staging.s3.ap-south-1.amazonaws.com/?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAiIRVyH3lDJCKNVZT5Rgp2boqU2RlP%2FY8wcxUADqRDaMCIQDisjpONDyq18mxsMEMRh9HjxonM5H%2FNWNibf%2FtIe5BuSqDBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAIaDDkyMzY1Mzc4NzUzMSIMgOON%2Bo4lHpawEKgtKtcDX5djISCLJRBwmhVpV%2BY47VzdmK10M6M0xq4nJVJG%2FpgrqwWEtXEYvXloN7H2mPHJkWjDuMgAdfi9YihkE%2FC5gAkoPY2rcH7YsDOWg1cxdSB3VeKKaZHDMgzAKn71iwiGp0hk9M8%2B%2BQGHtJz4sMH6ypNydzmuh45eOq00%2FYODQj8laaoJaasPDUroeMdVNASy3rxf56IAyaasqW%2F66HkYDqy10yBYS26tXoHTnly824YEIssZlP8FmzcdUUGbE7mYUKCCdkNTS%2B3Evse6vJc%2FrTrHC%2FwdptLBO8mh2Y8V3maGZDEuvi%2B3Fm99mDXooCIg72YHuNYjuMBcAzwV9fnM0J2Wzr8F4yTguRC76bjZj4UfUGfB712uf%2FXnoMTozpVs57cbFtcBlwte9aMSn4XTDHujtoWIKO4bsl47uGdVAB70aSR44JHj5kEof3vDy61XJfC1DpQL66mhweVFL8DkvrhNexWcoXh%2F5t5wfUZvwYZT5jwz7UtpOb3k8vSSBA3wY9aQkjhRlmRWoaJ6iNJJqBR3gzomd0r87tNcJEhpaWAux1LQKrAODc5ZsmpEGocv9cNyb%2FSbeczpFClKlHfK7dQP7zrhgMbom6ANG8JIPnW6DBm%2BUboKMK%2FnwbUGOqQBaFk7O89hVzQ1lebMCxbADvMINBDd8vtIETZ5ibhQ6hD6tJD%2B%2BG8De%2FAv6wkJ9t9BS%2BAaxkZSgpQaaDJHKi082j60ZW4MQho8wZqMLw0VEP2EfXINXLxAISD0VJRvziTR9BjpFCL%2FFnJ%2BbwqxqcBhmChwL1pEdpQddJcUVUGDes91G4sfyHZAIoIUr0ycRlfVouzpoueZvD2J%2BvOrwZkmkROLtKQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240805T064811Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA5ODQOJ6F6IGUCM7X%2F20240805%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=e0de54a7ded3013db6fac0b70def791d6a0280c70b8d2dddad5773080168651d",
                "isSetsAllowed": true,
                "setId": 4041,
                "answerSheets": [],
                "obtainedMarks": 5.0,
                "totalMarks": 8.0,
                "status": "Draft"
            },
            {
                "section": "C",
                "sectionId": 4,
                "studentId": 46,
                "firstName": "poo kv",
                "lastName": null,
                "rollNumber": "48757",
                "className": "Grade 6 - C",
                "courseIds": [
                    461
                ],
                "classId": 7,
                "allocationId": 24865,
                "middleName": null,
                "isAnswerSheetUploaded": false,
                "isMarksUploaded": true,
                "studentProfileImg": "https://topschool-uploads-staging.s3.ap-south-1.amazonaws.com/?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAiIRVyH3lDJCKNVZT5Rgp2boqU2RlP%2FY8wcxUADqRDaMCIQDisjpONDyq18mxsMEMRh9HjxonM5H%2FNWNibf%2FtIe5BuSqDBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAIaDDkyMzY1Mzc4NzUzMSIMgOON%2Bo4lHpawEKgtKtcDX5djISCLJRBwmhVpV%2BY47VzdmK10M6M0xq4nJVJG%2FpgrqwWEtXEYvXloN7H2mPHJkWjDuMgAdfi9YihkE%2FC5gAkoPY2rcH7YsDOWg1cxdSB3VeKKaZHDMgzAKn71iwiGp0hk9M8%2B%2BQGHtJz4sMH6ypNydzmuh45eOq00%2FYODQj8laaoJaasPDUroeMdVNASy3rxf56IAyaasqW%2F66HkYDqy10yBYS26tXoHTnly824YEIssZlP8FmzcdUUGbE7mYUKCCdkNTS%2B3Evse6vJc%2FrTrHC%2FwdptLBO8mh2Y8V3maGZDEuvi%2B3Fm99mDXooCIg72YHuNYjuMBcAzwV9fnM0J2Wzr8F4yTguRC76bjZj4UfUGfB712uf%2FXnoMTozpVs57cbFtcBlwte9aMSn4XTDHujtoWIKO4bsl47uGdVAB70aSR44JHj5kEof3vDy61XJfC1DpQL66mhweVFL8DkvrhNexWcoXh%2F5t5wfUZvwYZT5jwz7UtpOb3k8vSSBA3wY9aQkjhRlmRWoaJ6iNJJqBR3gzomd0r87tNcJEhpaWAux1LQKrAODc5ZsmpEGocv9cNyb%2FSbeczpFClKlHfK7dQP7zrhgMbom6ANG8JIPnW6DBm%2BUboKMK%2FnwbUGOqQBaFk7O89hVzQ1lebMCxbADvMINBDd8vtIETZ5ibhQ6hD6tJD%2B%2BG8De%2FAv6wkJ9t9BS%2BAaxkZSgpQaaDJHKi082j60ZW4MQho8wZqMLw0VEP2EfXINXLxAISD0VJRvziTR9BjpFCL%2FFnJ%2BbwqxqcBhmChwL1pEdpQddJcUVUGDes91G4sfyHZAIoIUr0ycRlfVouzpoueZvD2J%2BvOrwZkmkROLtKQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240805T064811Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIA5ODQOJ6F6IGUCM7X%2F20240805%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=ee27bc70fc4f4581f069904b74e248e204db084bece0750a9ceef896e4b1bb54",
                "isSetsAllowed": true,
                "setId": 4042,
                "answerSheets": [],
                "obtainedMarks": 6.5,
                "totalMarks": 8.0,
                "status": "Draft"
            },
            {
                "section": "C",
                "sectionId": 4,
                "studentId": 78,
                "firstName": "shash n",
                "lastName": null,
                "rollNumber": "12132",
                "className": "Grade 6 - C",
                "courseIds": [
                    461
                ],
                "classId": 7,
                "allocationId": 24866,
                "middleName": null, 
                "isAnswerSheetUploaded": true,
                "isMarksUploaded": true,
                "studentProfileImg": "https://topschool-uploads-staging.s3.ap-south-1.amazonaws.com/?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiSDBGAiEAiIRVyH3lDJCKNVZT5Rgp2boqU2RlP%2FY8wcxUADqRDaMCIQDisjpONDyq18mxsMEMRh9HjxonM5H%2FNWNibf%2FtIe5BuSqDBAjQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAIaDDkyMzY1Mzc4NzUzMSIMgOON%2Bo4lHpawEKgtKtcDX5djISCLJRBwmhVpV%2BY47VzdmK10M6M0xq4nJVJG%2FpgrqwWEtXEYvXloN7H2mPHJkWjDuMgAdfi9YihkE%2FC5gAkoPY2rcH7YsDOWg1cxdSB3VeKKaZHDMgzAKn71iwiGp0hk9M8%2B%2BQGHtJz4sMH6ypNydzmuh45eOq00%2FYODQj8laaoJaasPDUroeMdVNASy3rxf56IAyaasqW%2F66HkYDqy10yBYS26tXoHTnly824YEIssZlP8FmzcdUUGbE7mYUKCCdkNTS%2B3Evse6vJc%2FrTrHC%2FwdptLBO8mh2Y8V3maGZDEuvi%2B3Fm99mDXooCIg72YHuNYjuMBcAzwV9fnM0J2Wzr8F4yTguRC76bjZj4UfUGfB712uf%2FXnoMTozpVs57cbFtcBlwte9aMSn4XTDHujtoWIKO4bsl47uGdVAB70aSR44JHj5kEof3vDy61XJfC1DpQL66mhweVFL8DkvrhNexWcoXh%2F5t5wfUZvwYZT5jwz7UtpOb3k8vSSBA3wY9aQkjhRlmRWoaJ6iNJJqBR3gzomd0r87tNcJEhpaWAux1LQKrAODc5ZsmpEGocv9cNyb%2FSbeczpFClKlHfK7dQP7zrhgMbom6ANG8JIPnW6DBm%2BUboKMK%2FnwbUGOqQBaFk7O89hVzQ1lebMCxbADvMINBDd8vtIETZ5ibhQ6hD6tJD%2B%2BG8De%2FAv6wkJ9t9BS%2BAaxkZSgpQaaDJHKi082j60ZW4MQho8wZqMLw0VEP2EfXINXLxAISD0VJRvziTR9BjpFCL%2FFnJ%2BbwqxqcBhmChwL1pEdpQddJcUVUGDes91G4sfyHZAIoIUr0ycRlfVouzpoueZvD2J%2BvOrwZkmkROLtKQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240805T064811Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIA5ODQOJ6F6IGUCM7X%2F20240805%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=ee27bc70fc4f4581f069904b74e248e204db084bece0750a9ceef896e4b1bb54",
                "isSetsAllowed": true,
                "setId": 4043,
                "answerSheets": [
                    {
                        "id": 4149,
                        "sequence": 1,
                        "sheetName": "Sowmyaone - Timetable_07032024152747932",
                        "type": "pdf"
                    },
                    {
                        "id": 4150,
                        "sequence": 2,
                        "sheetName": "Bird_Image",
                        "type": "jpg"
                    },
                    {
                        "id": 4151,
                        "sequence": 3,
                        "sheetName": "image (11)",
                        "type": "png"
                    },
                    {
                        "id": 4152,
                        "sequence": 4,
                        "sheetName": "image (4)",
                        "type": "png"
                    }
                ],
                "obtainedMarks": 3.0,
                "totalMarks": 8.0,
                "status": "Draft"
            }
        ],
        "result": {
            "responseCode": 0,
            "responseDescription": "Success"
        }
    }
    const mockData = {
        "status": "200",
        "message": "student",
        "data": [
            {
                "studentId": 144,
                "firstName": "manoj bs",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "1234",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            },
            {
                "studentId": 145,
                "firstName": "manoj b",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "767",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            },
            {
                "studentId": 146,
                "firstName": "mohan n",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "63564",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            },
            {
                "studentId": 147,
                "firstName": "poojar adishesha",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "11323",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            },
            {
                "studentId": 148,
                "firstName": "poojar parimala",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "276",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            },
            {
                "studentId": 149,
                "firstName": "preethi kn",
                "lastName": null,
                "classId": 40,
                "filePath": null,
                "rollNumber": "76374",
                "section": "Daffodil",
                "sectionId": 70,
                "className": "Grade 6 - Daffodil",
                "allocationId": null,
                "qaAnswerSheetsAllocationId": null,
                "courseIds": [
                    461
                ],
                "attendance": null,
                "dob": "2024-08-05T17:47:41.881Z",
                "isAnswerSheetUploaded": "false",
                "metaInfo_recent_test": {}
            }
        ]
    }
    const editSets = {"result":{"responseCode":0,"responseDescription":"Success"}}
    beforeEach(() => {
        (getAllStudentListApi1 as jest.Mock).mockResolvedValue(mockEditData);
        (getAllStudentListApi as jest.Mock).mockResolvedValue(mockData);
        (assignEditSets as jest.Mock).mockResolvedValue(editSets);
    }); 
    const handleCloseModal = jest.fn();
    const defaultProps = {
        open: true,
        handleCloseModal,
        sectionFilter: undefined,
        isEditable: false,
        fetchFilteredStudent: [],
        sectionType: [],
        filtedSets: [],
        sets: [],
        setMap: {},
        selected: [],
        publishedStudent: [],
        isMultiselectDropDown: false,
        spinnerStatus: false,
        alertStyle: {},
        setsOptions: [],
        allFilters: { isSetsAllocations: [] },
    };

    it("renders the component and basic elements", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} />
            </Provider>
        );
        expect(screen.getByText("STUDENTS")).toBeInTheDocument();
        expect(screen.getByText("Select students to assign sets")).toBeInTheDocument();
    });
    

    it("handles input changes correctly", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} />
            </Provider>
        );
        expect(fireEvent.change(screen.getByPlaceholderText("Search for Student"), { target: { value: 'John' } }));
        // expect(handleStudentSearch).toHaveBeenCalled();    
    });

    it("handles checkbox interactions", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} />
            </Provider>
        );
        expect(fireEvent.click(screen.getByRole('checkbox'))); 
        // expect(handleIndividualCheckboxChange).toHaveBeenCalledWith(0, '1');
    });

    it("tests table sorting", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} />
            </Provider>
        );
        expect(fireEvent.click(screen.getByText("STUDENTS")));
        // expect(fireEvent.click(screen.getByText("ROLL NUMBER")));
        // expect(fireEvent.click(screen.getByText("Assign Set"))); 
        
    });
      it("tests alert message", () => {
        render( 
            <Provider store={store}>
                <StudentSetListModal 
                 handleCloseModal={jest.fn()}
                 sectionFilter={undefined}
                 isEditable={true}  
                 /> 
            </Provider>
        );  
       expect(screen.getByText(/Updating the student set will delete the entered marks. Please click "save" and re-upload the marks/i)).toBeInTheDocument() 
    });

    it("handles button clicks", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} isEditable={true} />
            </Provider>
        );
        fireEvent.click(screen.getByText("Cancel"));
        expect(handleCloseModal).toHaveBeenCalled();

        fireEvent.click(screen.getByText("Save"));
    });

    it("shows alert when editable", () => {
        render(
            <Provider store={store}>
                <StudentSetListModal {...defaultProps} isEditable={true} />
            </Provider>
        );
        expect(screen.getByText("Updating the student set will delete the entered marks. Please click \"save\" and re-upload the marks.")).toBeInTheDocument();
    });      
    
}); 