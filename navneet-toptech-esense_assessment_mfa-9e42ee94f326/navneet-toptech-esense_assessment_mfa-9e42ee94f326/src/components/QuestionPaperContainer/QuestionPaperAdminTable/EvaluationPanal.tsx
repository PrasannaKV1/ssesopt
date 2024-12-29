import './QuestionPaperTable.css';
import styles from './QuestionPaperTable.module.css';

import React, { useEffect, useState, Dispatch } from 'react';
import { Box } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useSelector, useDispatch } from 'react-redux';

import MultiSelectComponentforFilters from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import { RootStore } from '../../../redux/store';
import { getLocalStorageDataBasedOnKey, resetLocalStorage } from '../../../constants/helper';
import { baseFilterApi, baseGradeApi } from '../../../Api/AssessmentTypes';
import { State } from '../../../types/assessment';
import { qGradeEventActions, qSubjectEventActions } from '../../../redux/actions/assesmentQListEvent';
import { searchFilterEventActions } from '../../../redux/actions/searchFilterEventAction';

interface EvaluationPanalPropsInterface {
  setSearchApiFilter: any
  questions: any[]
  questionsCount: number;
}
const EvaluationPanal = (props: EvaluationPanalPropsInterface) => {
  const { setSearchApiFilter, questions, questionsCount } = props;
  const dispatch = useDispatch()
  const greads = useSelector((state: RootStore) => state?.qMenuEvent?.qGrade);
  const subjects = useSelector((state: RootStore) => state?.qMenuEvent?.qSubjects) || [];
  const paperTypes = useSelector((state: RootStore) => state?.qMenuEvent?.qPaperType);
  const allSearchFIlter = useSelector((state: RootStore) => state?.searchFilterEvents?.searchFilter);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;

  const [questionpaperData, setQuestionpaperData] = useState([] as any);
  const [marksPreSet, setMarksPreSet] = React.useState<any | null>({ min: allSearchFIlter?.minMarks || null, max: allSearchFIlter?.maxMarks || null });
  const [subjectFiltered, setSubjectFiltered] = useState<any[]>([]);
  const [allFilters, setAllFilters] = useState(allSearchFIlter);

  const cloneObj = {
    gradeId: '',
    subjectId: '',
    questionPaperTypeId: '',
    minMarks: '',
    maxMarks: '',
  } as any;

  const getQueryPoints = (param: string, type: string) => {
    if (type == 'min') {
      setAllFilters((prev: any) => {
        const updatedFilters = { ...prev, minMarks: param };
        setSearchApiFilter(updatedFilters);
        dispatch(searchFilterEventActions(updatedFilters))
        return updatedFilters;
      });
    }
    if (type == 'max') {
      setAllFilters((prev: any) => {
        const updatedFilters = { ...prev, maxMarks: param };
        setSearchApiFilter(updatedFilters);
        dispatch(searchFilterEventActions(updatedFilters))
        return updatedFilters;
      });
    }
    if (type == 'empty') {
      setAllFilters((prev: any) => {
        const updatedFilters = {
          ...prev,
          maxMarks: allFilters?.maxMarks !== undefined ? '' : allFilters.maxMarks,
          minMarks: allFilters?.minMarks !== undefined ? '' : allFilters.minMarks
        };

        setSearchApiFilter(updatedFilters);
        dispatch(searchFilterEventActions(updatedFilters))
        return updatedFilters;
      });
    }
  };
  const findDuplicates = (arr: any) => arr.filter((item: any, index: any) => arr.indexOf(item) !== index);

  const getSubjectByApi = async (greadsIdList: any[]) => {
    const response = await baseFilterApi('subjects', {
      gradeId: greadsIdList || [],
      staffId: stateDetails.login.userData.userRefId,
      publicationId: 0,
    });

    const courseList: string[] = response?.data?.map((x: any) => x.courseName);
    const uniqueSubjectList = findDuplicates(courseList);

    if (uniqueSubjectList.length > 0) {
      const newSearchValue = response?.data?.map((item: any) => {
        if (uniqueSubjectList?.includes(item?.courseName)) {
          return { ...item, courseName: `${item.courseName}(${item.grade})` };
        } else {
          return item;
        }
      });
      dispatch(qSubjectEventActions(newSearchValue))
    } else {
      dispatch(qSubjectEventActions(response?.data))
    }
  };

  const updateUser = (data: any, filter: string) => {
    switch (filter) {
      case 'gradeId':
        let gradeFilter: string = '';
        data.forEach((ele: number) => {
          gradeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, gradeId: gradeFilter.slice(0, -1), subjectId: '' };
          setSearchApiFilter(updatedFilters);
          dispatch(searchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
      case 'subjectId':
        let subFilter: string = '';
        data.forEach((ele: number) => {
          subFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, subjectId: subFilter.slice(0, -1) };
          setSearchApiFilter(updatedFilters);
          dispatch(searchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
      case 'questionPaperTypeId':
        let typeFilter: string = '';
        data.forEach((ele: number) => {
          typeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, questionPaperTypeId: typeFilter.slice(0, -1) };
          setSearchApiFilter(updatedFilters);
          dispatch(searchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
    }
  };

  const filterSubjects = () => {
    let filteredSubjects = subjects; // Start with all questions

    // Apply search query filter
    if (allFilters?.gradeId) {
      const gradeIds = allFilters.gradeId.split(',').map((id: any) => id.trim()); // Split by comma and trim whitespace
      filteredSubjects = filteredSubjects.filter((subject: { gradeId: string; }) => gradeIds.includes(`${subject.gradeId}`));
    } else {
      const payload = subjects;
      if (payload && payload.length) {
        filteredSubjects = payload;
      }
    }

    setSubjectFiltered(filteredSubjects);
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@ Loading all the Subject at a time @@@@@@@@@@@@@@@@@@@@@
  useEffect(() => {
    if (greads && greads?.length) {
      let greadsIdList: any[] = []
      const allGreadIds = greads?.filter((item: { es_gradeid: any, grade: string }) => {
        if (item?.es_gradeid) {
          greadsIdList.push(item?.es_gradeid)
          return;
        }
      });

      // TODO : Calling the Api to load all the Subjects
      getSubjectByApi(greadsIdList);
    }
  }, [greads]);

  useEffect(() => {
    if (greads && greads.length !== 0) {
      const handleGetGrade = async () => {
        try {
          const response = await baseGradeApi('grade', stateDetails.login.userData.userRefId);
          if (response?.status === '200') {
            dispatch(qGradeEventActions(response?.data));

          }
        } catch (error) {
          console.error("Error while calling gread api in Evaluation", error);
        }
      };

      /**
       *  @function handleGetGrade 
       *  @description calling the api is data is Not exist in redux store and setring the data to store
       */
      handleGetGrade();
    }
  }, [])

  useEffect(() => {
    if (allFilters?.gradeId && allFilters?.gradeId !== "") {
      filterSubjects()
    }
  }, [allFilters?.gradeId])

  return (
    <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-2`} sx={{ width: '100%' }}>
      <TabContext value={'1'}>
        <TabPanel value='1' className='px-0'>
          <div className='d-flex filter-file' style={{ justifyContent: 'space-between' }}>
            <div className='selectTransBtnSect createNewTemplateSelectLeft' style={{ display: 'flex', gap: '10px' }}>
              <MultiSelectComponentforFilters
                lsName={'grade'}
                options={greads}
                values={allFilters.gradeId}
                multiType={'Multi1'}
                addableFiled='All Grades'
                showableField='grade'
                selectableField='es_gradeid'
                onChange={(e: any) => {
                  updateUser(e, 'gradeId');
                }}
                disable={questionsCount === 0}
              />
              <MultiSelectComponentforFilters
                lsName={'subject'}
                options={subjectFiltered}
                values={allFilters.subjectId}
                multiType={'Multi1'}
                addableFiled='All Subject'
                showableField='courseDisplayName'
                selectableField='courseId'
                onChange={(e: any) => {
                  updateUser(e, 'subjectId');
                }}
                disable={(allFilters?.gradeId === "" || questions.length === 0) && !(allFilters?.subjectId) ? true : false}
              />
            </div>
            <div className='d-flex gap-2'>
              <div className='selQuesPaperFilter'>
                <MultiSelectComponentforFilters
                  lsName={'qpType'}
                  options={paperTypes}
                  onChange={(e: any) => {
                    updateUser(e, 'questionPaperTypeId');
                  }}
                  disable={questions.length === 0 && !(allFilters?.questionPaperTypeId) ? true : false}
                  multiType={'Multi1'}
                  addableFiled='All Question Paper Types'
                  showableField='name'
                  selectableField='id'
                  values={allFilters.questionPaperTypeId}
                />
              </div>
              <PointFilter
                preSetVal={marksPreSet}
                getQueryPoints={(param: string, type: string) => {
                  getQueryPoints(param, type);
                }}
                disable={questions.length === 0 && !(allFilters?.maxMarks && allFilters?.minMarks) ? true : false}
                label={'marks'}
              />
            </div>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EvaluationPanal;