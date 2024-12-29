
import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
// import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import React, { useEffect, useState } from 'react'
import "./EvaluationWrapperFilter.css"
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Button from '@mui/material/Button';
import MultiSelectComponentforFiltersData from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { searchFilterEventActions } from '../../../redux/actions/searchFilterEventAction';
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import PointerFilterWrapper from "../../AssessmentsContainer/PointerFilterWrapper"
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import MultiSelectWrapperNew from '../../SharedComponents/MultiSelectComponent/MultiSelectWrapperNew';
import { baseFilterApi } from '../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { qSubjectEventActions } from '../../../redux/actions/assesmentQListEvent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Spinner from '../../SharedComponents/Spinner';


import { useEffect, useState } from 'react';
const drawerBleeding = 56;
const filterData = ["Type", "Showing", "Grades", "Subjects"]

interface EvaluationPanalPropsInterface {
    setSearchApiFilter: any
    questions: any[]
    questionsCount: number;
    setFilterCancel:any
  }

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  // ...theme.applyStyles('dark', {
  //   backgroundColor: theme.palette.background.default,
  // }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  // ...theme.applyStyles('dark', {
  //   backgroundColor: grey[800],
  // }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  // ...theme.applyStyles('dark', {
  //   backgroundColor: grey[900],
  // }),
}));

const EvaluationWrapperFilter = (props:any) => {
  const { window } = props;
  const [open, setOpen] = React.useState(false);
  const { setSearchApiFilter, questions, questionsCount, setFilterCancel } = props;
  const greads = useSelector((state: RootStore) => state?.qMenuEvent?.qGrade);

  const allSearchFIlter = useSelector((state: RootStore) => state?.searchFilterEvents?.searchFilter);
  const subjects = useSelector((state: RootStore) => state?.qMenuEvent?.qSubjects) || [];

  const paperTypes = useSelector((state: RootStore) => state?.qMenuEvent?.qPaperType);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;



  const dispatch = useDispatch()

  const [allFilters, setAllFilters] = useState(allSearchFIlter);

  const [subjectFiltered, setSubjectFiltered] = useState<any[]>([]);

  const [marksPreSet, setMarksPreSet] = React.useState<any | null>({ min: allSearchFIlter?.minMarks || null, max: allSearchFIlter?.maxMarks || null });
  const [isLoading, setIsLoading] = useState(false)
  
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
  const findDuplicates = (arr: any) => arr.filter((item: any, index: any) => arr.indexOf(item) !== index);

  


  const updateUser = (data: any, filter: string) => {
    switch (filter) {
      case 'gradeId':
        let gradeFilter: string = '';
        data.forEach((ele: number) => {
          gradeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, gradeId: gradeFilter.slice(0, -1), subjectId: '' };
          // setSearchApiFilter(updatedFilters);
          // dispatch(searchFilterEventActions(updatedFilters))
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
          // setSearchApiFilter(updatedFilters);
          // dispatch(searchFilterEventActions(updatedFilters))
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
          // setSearchApiFilter(updatedFilters);
          // dispatch(searchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
    }
  };

  const filterSubjects = () => {
    setIsLoading(true)

    let filteredSubjects = subjects;

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
    setTimeout(()=>{
      setIsLoading(false)
    }, 1000)
  };
  const getQueryPoints = (param: string, type: string) => {
    if (type == 'min') {
      setAllFilters((prev: any) => {
        const updatedFilters = { ...prev, minMarks: param };
        // setSearchApiFilter(updatedFilters);
        // dispatch(searchFilterEventActions(updatedFilters))
        return updatedFilters;
      });
    }
    if (type == 'max') {
      setAllFilters((prev: any) => {
        const updatedFilters = { ...prev, maxMarks: param };
        // setSearchApiFilter(updatedFilters);
        // dispatch(searchFilterEventActions(updatedFilters))
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

  const handleApply = ()=>{
    setIsLoading(true)
    setSearchApiFilter(allFilters);
    dispatch(searchFilterEventActions(allFilters))
    setOpen(false)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  
  }

  useEffect(() => {
    if (allFilters?.gradeId && allFilters?.gradeId !== "") {
      filterSubjects()
    }
  }, [allFilters?.gradeId, subjects])

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

  const handleCancdel = ()=>{
    setOpen(false)

  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      gradeId: '',  
      subjectId: '',         
      questionPaperTypeId: '',
      minMarks: '',
      maxMarks: ''            
    };
    setAllFilters({
      gradeId: '',  
      subjectId: '',         
      questionPaperTypeId: '',
      minMarks: '',
      maxMarks: ''            
    });
  
    setSubjectFiltered([]);
    setMarksPreSet({ min: null, max: null });
    dispatch(searchFilterEventActions({
      gradeId: '',
      subjectId: '',
      questionPaperTypeId: '',
      minMarks: '',
      maxMarks: ''
    }));
    setSearchApiFilter(clearedFilters);
    dispatch(searchFilterEventActions(clearedFilters))
    setOpen(false)
  };
  

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Root>
      {isLoading && <Spinner/>}
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        className='sweperContainer'
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            boxShadow: "0px -4px 4px 0px rgba(0, 0, 0, 0.25)"

          }}
           className='sweperContainerChild'
        >
          {
            open && <Puller />
          }
          {
            !open && <>
          <Typography sx={{ p: 2, color: 'text.secondary'}}>
          <div style={{
            border:"1px solid #DEDEDE",
            width:"100%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            borderRadius:"8px",
            height:"40px",
            marginTop:"-8px" 
            
          }}
          className='filterButtonText'
          ><span>Filter</span><span><KeyboardArrowDownIcon/></span></div>
           </Typography>
            </>
          }
          
        </StyledBox>
        <StyledBox sx={{height: '100%', overflow: 'auto', p:1 }} className='pankaj'>
        <div>
            <div className='evaluationFilterCont'>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div className='wrapperFilterText'>Filters</div>
                <ButtonComponent type={undefined} label={'Clear All'} textColor={''} buttonSize={undefined} minWidth={''} onClick={handleClearAll}/>
              </div>
              <div className='evaluationFilterContChild'>
                {
                  filterData?.map((items: any) => {
                    return <>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          {items}
                        </AccordionSummary>
                        {
                          items === "Type" ? <AccordionDetails>
                            <MultiSelectWrapperNew
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
                          </AccordionDetails> : items === "Showing" ?
                            // <PointFilter
                            //   preSetVal={marksPreSet}
                            //   getQueryPoints={(param: string, type: string) => {
                            //     getQueryPoints(param, type);
                            //   }}
                            //   disable={questions.length === 0 && !(allFilters?.maxMarks && allFilters?.minMarks) ? true : false}
                            //   label={'marks'}
                            // />
                            <PointerFilterWrapper 
                            getQueryPoints={(param: string, type: string) => {
                              getQueryPoints(param, type);
                            }}
                            disable={questions.length === 0 && !(allFilters?.maxMarks && allFilters?.minMarks) ? true : false}

                            preSetVal={marksPreSet}
  label="marks"
/>

                            : items === "Grades" ?
                              <MultiSelectWrapperNew
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
                              /> : items === "Subjects" ?
                                <MultiSelectWrapperNew
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
                                /> : ""
                        }
                      </Accordion>
                    </>
                  })
                }
              </div>
            </div>
            <div className='filterButton'>
                <ButtonComponent type={undefined} label={'Cancel'} textColor={''} buttonSize={"Medium"} minWidth={''} onClick={handleCancdel} />
                <ButtonComponent type={"contained"} label={'Apply'} textColor={''} buttonSize={"Medium"} minWidth={''} onClick={handleApply} />
              </div>
    </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  )
}

export default EvaluationWrapperFilter