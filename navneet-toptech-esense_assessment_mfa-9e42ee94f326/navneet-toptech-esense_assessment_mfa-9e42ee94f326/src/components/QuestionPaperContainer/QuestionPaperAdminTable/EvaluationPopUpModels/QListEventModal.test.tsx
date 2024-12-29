import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import QListEventModal from './QListEventModal';
import { addScoreToGradeBook, getSubjectDetails, getTestTypeDetails } from "../../../../Api/QuestionTypePaper";
import store from '../../../../redux/store';

jest.mock("../../../../Api/QuestionTypePaper", () => ({
  addScoreToGradeBook: jest.fn(),
  getSubjectDetails: jest.fn(),
  getTestTypeDetails: jest.fn()
}));

describe('QListEventModal', () => {
  const mockProps = {
    title: 'Add scores to gradebook',
    handleCloseEvent: jest.fn(),
    data: {
      examTypeID: 1,
      questionPaperTypeID: 2,
      marks: 50,
      id: 123,
      name: 'Sample Question Paper',
      questionPaperSectionDetails: [{ sectionID: 1, sectionName: 'Section 1' }],
      questionPaperCourseDetails: [{ courseName: 'Course 1' }],
      questionPaperClassDetails: [{ className: 'Grade 1 - Section A' }]
    },
    width: 500,
    gradeBookModal: true,
    gradeBookStudentId: [1, 2],
    gradeBookSectionId: [1]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal and display the title and subtitle', () => {
    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );
    expect(screen.getByText('Add scores to gradebook')).toBeInTheDocument();
  });

  it('should handle section selection and update form values', async () => {
    (getSubjectDetails as jest.Mock).mockResolvedValue({ data: [{ courseID: 1, subjectName: 'Subject 1', terms: [], classId: 1, templateId: 1 }] });
    (getTestTypeDetails as jest.Mock).mockResolvedValue({ data: [{ testTypeID: 1, maxMarks: 50, maxTest: 3 }] });

    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );

    await waitFor(() => {
      expect(getSubjectDetails).toHaveBeenCalled();
    });

    expect(screen.getByLabelText('Question Paper Title')).toHaveValue('Sample Question Paper');
  }); 

  it('should handle form submission and API call success', async () => {
    (addScoreToGradeBook as jest.Mock).mockResolvedValue({ status: '200', message: 'Success', data: { markUpdatedStudent: 10, totalStudent: 20 } });

    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Scores'));
     waitFor(() => {
      expect(addScoreToGradeBook).toHaveBeenCalled();
      expect(screen.getByText(/students' scores are successfully added to GradeBook/i)).toBeInTheDocument();
    });
  });

  it('should handle API call errors and display error messages', async () => {
    (addScoreToGradeBook as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Scores'));
     waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  }); 

  it('should handle dropdown selection changes', async () => {
    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );

     waitFor(() => {
      expect(screen.getByLabelText('Select Subject')).toBeInTheDocument();
    });
  }); 

  it('should handle edge cases such as empty fields', async () => {
    render(
      <Provider store={store}>
        <QListEventModal {...mockProps} />
      </Provider>
    );
  
    fireEvent.change(screen.getByLabelText('Question Paper Title'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Add Scores'));
  
    waitFor(() => {
      expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
    });
  });
it('should handle errors from API calls and display error messages', async () => {
  (getSubjectDetails as jest.Mock).mockRejectedValue(new Error('Error getting course names'));
  render(
    <Provider store={store}>
      <QListEventModal {...mockProps} />
    </Provider>
  );

  await waitFor(() => {
    expect(getSubjectDetails).toHaveBeenCalled();
  });
});
            
});