import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, IconButton, InputAdornment, Paper, Box, FormControl, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, Input, Grid, InputLabel } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import OnlineColorToggleButton from './OnlineColorToggleButton';
import MultiSelectComponentforFilters from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';
import { RootStore } from '../../../redux/store';
import { baseFilterApi } from '../../../Api/AssessmentTypes';
import { getLocalStorageDataBasedOnKey } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { currentGradeSectionName, onlineAssementQpSubjectEventActions } from '../../../redux/actions/onlineAssement';
import InputBar from './OnlineInputBar'; // Import InputBar component
import OnlineAssesmentDataFilter from './OnlineAssesmentDataFilter';
import { AllFilters } from '../interface/online-assesment-interface';
import { onlineSearchFilterEventActions } from '../../../redux/actions/onlineSearchFilters';
import DesktopCalenderDatePicker from './DesktopCalenderDatePicker';
import CALENDER_ICONS from '../assets/calender.svg';
import moment from 'moment';
import { getGradeAndSectionDetails } from '../../../Api/ChapterChallenge';
import { useSearchParams } from 'react-router-dom';

interface OnlineAssesmentQuestionPaperfilterProps {
  setSearchFilter: any;
  emptyScreen?: any;
  questionsCount?: number | undefined
  questions: any
  isFromTeacherWeb?: boolean;
  academicDateRange?: any;
  setSelectedTabVal?:any;
  selectedOption?: any;
  chapterSearchFilter?: any;
  setChapterSearchFilter?: any;
}

const OnlineAssesmentQuestionPaperfilter = (props: OnlineAssesmentQuestionPaperfilterProps) => {
  const { setSearchFilter, emptyScreen, questionsCount, questions, isFromTeacherWeb, academicDateRange, setSelectedTabVal, selectedOption, chapterSearchFilter, setChapterSearchFilter } = props;
  const dispatch = useDispatch();
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
  const notifyDate = JSON.parse(localStorage.getItem("assessNotificationData") as string);
  const chapterNotifyDate = JSON.parse(localStorage.getItem("chapterNotificationData") as string);
  const allSearchFIlter = useSelector((state: RootStore) => state?.onlineSearchFilterEvents?.searchFilter);
  const [searchParams] = useSearchParams();
  const reloadFilters = searchParams?.get('refreshFilter');
  const allGreads = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qGrade);
  const subjects = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qSubjects) || [];
  const allChaptersDetails = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpChapters);
  const allQpList = useSelector((state: RootStore) => state?.onlineAssesmentMenuEvent?.qpListOnlineAssesment);
  const [subjectFiltered, setSubjectFiltered] = useState<any[]>([]);
  const [allFilters, setAllFilters] = useState<AllFilters | any>(allSearchFIlter || {});
  const [allChapters, setAllChapters] = useState<any>(allChaptersDetails);
  const [chapterOptions, setChaptersOnptions] = useState<any>([]);
  const [openCalender, setOpenCalender] = useState(false);
  const [seletedDateRange, setSelectedDateRange] = useState("");
  const [anchorPosition, seAnchorPOsition] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [date, setDate] = useState<any>(!!notifyDate && notifyDate?.notificationDate ? [moment(notifyDate?.notificationDate).format('YYYY-MM-DD'), moment(notifyDate?.notificationDate).format('YYYY-MM-DD')] : chapterNotifyDate && chapterNotifyDate?.notificationDate ? [moment(chapterNotifyDate?.notificationDate).format('YYYY-MM-DD'), moment(chapterNotifyDate?.notificationDate).format('YYYY-MM-DD')] : []);
  const [labelValue, setLabelValue] = useState<any>('All')
  const [chapterGrades, setChapterGrades] = useState<any>([]);
  const [chapterSubjects, setChapterSubjects] = useState<any>([]);
  const lmsAssessData: any = isFromTeacherWeb && JSON.parse(localStorage.getItem("topAssessData") as string);
  const [state, setState] = useState<any>([
    {
      startDate: chapterNotifyDate?.notificationDate ? new Date(chapterNotifyDate?.notificationDate) : selectedOption == "1" ? new Date() : (!!notifyDate && notifyDate?.hasOwnProperty("notificationDate")) ? new Date(notifyDate?.notificationDate) : academicDateRange[0]?.startDate,
      endDate: chapterNotifyDate?.notificationDate ? new Date(chapterNotifyDate?.notificationDate) : selectedOption == "1" ? new Date() : (!!notifyDate && notifyDate?.hasOwnProperty("notificationDate")) ? new Date(notifyDate?.notificationDate) : academicDateRange[0]?.endDate,
      key: "selection",
    },
  ]);
  const [mixMaxDate, setMinMaxDate] = useState([{
    minStartDate: academicDateRange[0]?.startDate,
    minEndDate: academicDateRange[0]?.endDate,
  }])

  const opencalenderRange = (event: any) => {
    setAnchorEl(document.getElementById("parentAppointmentDatePicker"));
    seAnchorPOsition(event.target.getBoundingClientRect());
    setOpenCalender(!openCalender);
  };
  // const chapterIds = allQpList?.map((item: any) => item?.chapterId);
  // const idsString = chapterIds.join(',');

  const findDuplicates = (arr: any) => arr.filter((item: any, index: any) => arr.indexOf(item) !== index);

  const handleOptionChange = (newValue: string, tabStringValue: any) => {
    //setSelectedOption(newValue);
    setSelectedTabVal(tabStringValue)
    // Additional logic based on selected option
  };

  const updateUser = (data: any, filter: string) => {
    switch (filter) {
      case 'gradeId':
        let gradeFilter: string = '';
        data.forEach((ele: number) => {
          gradeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, gradeId: gradeFilter.slice(0, -1), subjectId: '', chapterId: "", startDate: "", endDate: "" };
          setSearchFilter(updatedFilters);
          setChaptersOnptions([]);
          dispatch(onlineSearchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
      case 'subjectId':
        // Convert the data array of subject IDs to a comma-separated string
        let subFilter = data.join(',');

        // Update the filters in state
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, subjectId: subFilter, chapterId: "", startDate: "", endDate: "" };
          setSearchFilter(updatedFilters); // Update search filter state
          dispatch(onlineSearchFilterEventActions(updatedFilters)); // Dispatch filter event
          return updatedFilters;
        });

        // Update chapters based on subjectId
        if (allChapters?.length) {
          // Convert subFilter string back to an array of IDs
          const subFilterArray = subFilter.split(',');
          let filteredChapters: any[] = []

          if (subFilterArray.length === 0) {
            setChaptersOnptions([]);
          } else {
            subFilterArray.forEach((element: string | number) => {
              const data = allChapters.filter((items: any) => {
                if (element == items?.courseId) {
                  filteredChapters = [...filteredChapters, ...items?.chapters]
                }
              })
            });
          }
          setChaptersOnptions(filteredChapters)
        }
        break;
      case 'chapters':
        let typeFilter: string = '';
        data.forEach((ele: number) => {
          typeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, chapterId: typeFilter.slice(0, -1), startDate: "", endDate: "" };
          setSearchFilter(updatedFilters);
          dispatch(onlineSearchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
        break;
    }
  };



  const updateChapterUser = (data: any, filter: string) => {
    switch (filter) {
      case 'gradeId':
        const gradeSelected = data.target.value;

        if (gradeSelected) {
          const filteredData = chapterGrades.filter((grade: any) => grade.classId === gradeSelected);
          const gradeSectionName = filteredData[0]?.className;
          const subjects = filteredData[0]?.subjects?.filter((item: any) => item?.courseId)?.filter((item: any) => item?.isSelected)
          const groupSubject = filteredData[0]?.subjects?.filter((item: any) => item?.courseGroupId)[0]?.courses?.filter((item: any) => item?.isSelected) || []
          const allSubjects = [...subjects, ...groupSubject].filter((subject: any) => subject.isChapterChallengeEnable);
          dispatch(currentGradeSectionName(gradeSectionName));
          setChapterSearchFilter((prevState: any) => {
            const newFilters = { ...prevState, gradeId: filteredData[0].gradeId, classId: filteredData[0].classId, subjectId: allSubjects[0]?.courseId, chapterId: "", startDate: "", endDate: "", sectionId: filteredData[0]?.sectionId };
            localStorage.setItem('filters', JSON.stringify(newFilters));
            return newFilters;
          });
          setChapterSubjects(allSubjects);
        }
        setSelectedDateRange("")
        setState([{
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        }])
        setLabelValue("All")
        break;
      case 'subjectId':
        const subFilter = data.target.value;
        setChapterSearchFilter((prevState: any) => {
          const newFilters = { ...prevState, subjectId: subFilter, chapterId: "", startDate: "", endDate: "" };
          localStorage.setItem('filters', JSON.stringify(newFilters));
          return newFilters;
        });
        setSelectedDateRange("")
        setState([{
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        }]);
        setLabelValue("All")
        break;
      case 'chapterId':
        let typeFilter = '';
        data.forEach((ele: number) => {
          typeFilter += `${ele},`;
        });
        setChapterSearchFilter((prevState: any) => {
          const newFilters = { ...prevState, chapterId: typeFilter.slice(0, -1) };
          localStorage.setItem('filters', JSON.stringify(newFilters));
          return newFilters;
        });
        break;
    }
  }

  const handleDatePickerCancel = () => {
    setOpenCalender(false);
  };

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
      dispatch(onlineAssementQpSubjectEventActions(newSearchValue));
    } else {
      dispatch(onlineAssementQpSubjectEventActions(response?.data));
    }
  };

  const filterSubjects = () => {
    let filteredSubjects = subjects;
    let gradeIds: any[];
    if (allFilters?.gradeId) {
      if (selectedOption == "1") {
        let ids = allFilters?.gradeId?.split(',').map((id: any) => id.trim());
        let grades: any[] = chapterGrades.filter((el: any) => ids?.includes(String(el?.classId)))?.map((grade: any) => grade.gradeId);
        filteredSubjects = filteredSubjects?.filter((subject: { gradeId: string }) => grades.includes(subject.gradeId));
      } else {
        gradeIds = allFilters?.gradeId?.split(',').map((id: any) => id.trim());
        filteredSubjects = filteredSubjects?.filter((subject: { gradeId: string }) => gradeIds.includes(`${subject.gradeId}`));
      }
      filteredSubjects = filteredSubjects.sort((a: any, b: any) => {
        if (a.courseDisplayName < b.courseDisplayName) {
          return -1;
        }
        if (a.courseDisplayName > b.courseDisplayName) {
          return 1;
        }
        return 0;
      });
    }
    // setSubjectFiltered(filteredSubjects);
    setSubjectFiltered(filteredSubjects.filter((subj: any) => subj.isOnlineTestEnable === true))
  };

  const convertDate = (dateStr: any) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }


  // "-------------------Chapter Challenge APis---------------------"
  const fetchGradeAndSectionDetails = async () => {
    try {
      const response = await getGradeAndSectionDetails(stateDetails.login.userData.userRefId);
      if (response.status === "200") {
        const gradeAndSection = response?.data?.grades
          ?.filter((item: any) => item?.isSelected === true)
          .map((el: any) => el?.classes
            ?.filter((item: any) => item?.isSelected === true)
            .map((rest: any) => rest))?.flat() || [];
        const gradeSectionName = gradeAndSection[0]?.className;
        dispatch(currentGradeSectionName(gradeSectionName));
        setChapterGrades(gradeAndSection);
        const savedFilters = localStorage.getItem('filters');
        if (savedFilters) {
          const filters = JSON.parse(savedFilters);
          const allMainSubjects = gradeAndSection.find((item: any) => item.classId == filters.classId).subjects
          const subjects = allMainSubjects?.filter((item: any) => item?.courseId)?.filter((item: any) => item?.isSelected)
          const groupSubject = allMainSubjects?.filter((item: any) => item?.courseGroupId)[0]?.courses?.filter((item: any) => item?.isSelected) || []
          const allSubjects = [...subjects, ...groupSubject].filter((subject: any) => subject.isChapterChallengeEnable);
          setChapterSubjects(allSubjects);
          setChapterSearchFilter(filters);

          if (chapterNotifyDate?.notificationDate) {
            const convertedDate = moment(chapterNotifyDate?.notificationDate).format('YYYY-MM-DD');
            filters["startDate"] = convertedDate;
            filters["endDate"] = convertedDate;
            setChapterSearchFilter(filters);
          }
        }
      }
    } catch (error) {
      console.error("Error while fetching chapter challenge grade and section API:", error);
    }
  };

  useEffect(() => {
    fetchGradeAndSectionDetails();
  }, []);

  useEffect(() => {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setChapterSearchFilter(filters);
    }
  }, []);


  useEffect(() => {
    if (allGreads && allGreads?.length) {
      let greadsIdList: any[] = []
      const allGreadIds = allGreads?.filter((item: { es_gradeid: any, grade: string }) => {
        if (item?.es_gradeid) {
          greadsIdList.push(item?.es_gradeid)
          return;
        }
      });
      getSubjectByApi(greadsIdList);
    }
  }, [allGreads]);

  useEffect(() => {
    if (allFilters?.gradeId && allFilters?.gradeId !== "") {
      filterSubjects()
    }
  }, [allFilters?.gradeId])

  useEffect(() => {
    if (allFilters?.subjectId && allFilters?.subjectId !== "") {
      filterSubjects()
    }
  }, [allFilters?.subjectId])

  useEffect(() => {
    if (allChaptersDetails?.length) {
      setAllChapters(allChaptersDetails);
    }
  }, [allChaptersDetails])

  useEffect(() => {
    if (date && date.length) {
      const startDate = notifyDate?.notificationDate || chapterNotifyDate?.notificationDate ? date?.[0] : moment(date?.[0]).format("YYYY-MM-DD");
      const endDate = notifyDate?.notificationDate || chapterNotifyDate?.notificationDate ? date?.[1] : moment(date?.[1]).format("YYYY-MM-DD");
      if (startDate) {
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, startDate: startDate };
          setSearchFilter(updatedFilters);
          if (selectedOption == "1" || chapterNotifyDate?.notificationDate) {
            setChapterSearchFilter((prevState: any) => ({
              ...prevState, startDate: startDate
            }));
          }
          dispatch(onlineSearchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
      }

      if (endDate) {
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, endDate: endDate };
          setSearchFilter(updatedFilters);
          if (selectedOption == "1" || chapterNotifyDate?.notificationDate) {
            setChapterSearchFilter((prevState: any) => ({
              ...prevState, endDate: endDate
            }));
          }
          dispatch(onlineSearchFilterEventActions(updatedFilters))
          return updatedFilters;
        });
      }
    }
    if (date && date.length === 0 && !reloadFilters) {
      setAllFilters((prev: any) => {
        const updatedFilters = { ...prev, startDate: "", endDate: "" };
        setSearchFilter(updatedFilters);
        if (selectedOption == "1") {
          setChapterSearchFilter((prevState: any) => ({
            ...prevState, startDate: "", endDate: ""
          }));
        }
        dispatch(onlineSearchFilterEventActions(updatedFilters))
        return updatedFilters;
      });
    }

  }, [date, notifyDate?.notificationDate, selectedOption])

  useEffect(() => {
    if (selectedOption == "1") {
      const updatedFilters = {
        gradeId: '',
        subjectId: '',
        chapterId: '',
        startDate: '',
        endDate: ''
      }
      setSearchFilter(updatedFilters);
      setAllFilters(updatedFilters)
      dispatch(onlineSearchFilterEventActions(updatedFilters))
    }
    if (selectedOption == "0" && notifyDate == null) {
      setDate([])
    }
  }, [selectedOption])

  useEffect(() => {
    if (reloadFilters) {
      const filter = {
        "gradeId": "",
        "subjectId": "",
        "chapterId": "",
        "startDate": "",
        "endDate": ""
      }
      setSearchFilter(filter);
      setAllFilters(filter);
      dispatch(onlineSearchFilterEventActions(filter));
    }
  }, [reloadFilters])

  useEffect(() => {
    if (allQpList && allQpList.length && selectedOption == "1") {
      const chapterIds = allQpList.map((item: any) => item?.chapterId)
      chapterIds.unshift(0);
      const result = chapterIds.map(String).join(',');
      setChapterSearchFilter((prevState: any) => ({
        ...prevState, chapterId: result
      }));
    }
  }, [allQpList, selectedOption])

  useEffect(() => {
    if (!!lmsAssessData && Object.keys(lmsAssessData).length > 0 && allChapters?.length > 0) {
      let gradeFilter: string = '';
      [lmsAssessData?.gradeId]?.forEach((ele: number) => {
        gradeFilter += `${ele},`;
      });
      let subjectFilter: string = '';
      [lmsAssessData?.courseId]?.forEach((ele: number) => {
        subjectFilter += `${ele}`
      })

      if (allSearchFIlter.gradeId === "" || allSearchFIlter.subjectId === "") {
        setAllFilters((prev: any) => {
          const updatedFilters = { ...prev, gradeId: gradeFilter?.slice(0, -1), subjectId: subjectFilter, chapterId: "", startDate: "", endDate: "" };
          setSearchFilter(updatedFilters); // Update search filter state
          dispatch(onlineSearchFilterEventActions({ ...allSearchFIlter, gradeId: gradeFilter?.slice(0, -1) || "", subjectId: subjectFilter || "" }))
          return updatedFilters;
        });
      };
      const chapters = allChapters?.filter((item: any) => item?.courseId === lmsAssessData?.courseId)?.[0]?.chapters;
      setChaptersOnptions(chapters || []);
    }
  }, [lmsAssessData, allChapters])

  useEffect(() => {
    if (!!notifyDate && !notifyDate?.hasOwnProperty("notificationDate") && !!chapterNotifyDate && !chapterNotifyDate?.hasOwnProperty("notificationDate")) {
      setState([
        {
          startDate: selectedOption == "1" ? new Date() : academicDateRange[0]?.startDate,
          endDate: selectedOption == "1" ? new Date() : academicDateRange[0]?.endDate,
          key: "selection",
        }
      ])
    }
    setMinMaxDate([{
      minStartDate: academicDateRange[0]?.startDate,
      minEndDate: academicDateRange[0]?.endDate,
    }])

    if (!!notifyDate && !notifyDate?.hasOwnProperty("notificationDate") && !!chapterNotifyDate && !chapterNotifyDate?.hasOwnProperty("notificationDate")) {
      setDate([]);
      setLabelValue("All")
    } else {
      const givenDate = moment(chapterNotifyDate?.notificationDate);
      const currentDate = moment().startOf('day');
      const yesterday = moment().subtract(1, 'days').startOf('day');
      if (givenDate.isBefore(yesterday)) {
        setLabelValue("Custom")
      } else if (givenDate.isBefore(currentDate)) {
        setLabelValue("Yesterday");
      } else {
        setLabelValue("Today");
      }
    }

    if (selectedOption == "0" && selectedOption != null) {
      // reset the chapter challenge  while switching the tab 
      setChapterSearchFilter((prev: any) => ({ ...prev, gradeId: "", classId: "", subjectId: "", sectionId: "", chapterId: "", startDate: "", endDate: "" }));
    } else {
      if (chapterNotifyDate && chapterNotifyDate?.notificationDate && chapterGrades && chapterGrades[0]) {
        // reset the online test filter while switching the tab
        const updatedFilters = {
          gradeId: '',
          subjectId: '',
          chapterId: '',
          startDate: '',
          endDate: ''
        }
        setSearchFilter(updatedFilters);
        setAllFilters(updatedFilters)
        dispatch(onlineSearchFilterEventActions(updatedFilters))
        const subjects = chapterGrades[0]?.subjects?.filter((item: any) => item?.courseId)?.filter((item: any) => item?.isSelected)
        const groupSubject = chapterGrades[0]?.subjects?.filter((item: any) => item?.courseGroupId)[0]?.courses?.filter((item: any) => item?.isSelected) || []
        const allSubjects: any = [...subjects, ...groupSubject].filter((subject: any) => subject.isChapterChallengeEnable);
        setChapterSubjects(allSubjects);
        // setting the date filter form the notification
        const convertedDate = moment(chapterNotifyDate?.notificationDate).format('YYYY-MM-DD');
        setChapterSearchFilter({ gradeId: chapterGrades[0]?.gradeId, classId: chapterGrades[0]?.classId, subjectId: allSubjects[0]?.courseId, sectionId: chapterGrades[0]?.sectionId, startDate: convertedDate, endDate: convertedDate });
      } else if (chapterGrades && chapterGrades[0] && !localStorage.getItem('filters')) {
        // setting the filter the from localStorage after viewing the QP or Report 
        const subjects = chapterGrades[0]?.subjects?.filter((item: any) => item?.courseId)?.filter((item: any) => item?.isSelected)
        const groupSubject = chapterGrades[0]?.subjects?.filter((item: any) => item?.courseGroupId)[0]?.courses?.filter((item: any) => item?.isSelected) || []
        const allSubjects: any = [...subjects, ...groupSubject].filter((subject: any) => subject.isChapterChallengeEnable);
        setChapterSubjects(allSubjects);
        setChapterSearchFilter((prev: any) => ({ ...prev, gradeId: chapterGrades[0]?.gradeId, classId: chapterGrades[0]?.classId, subjectId: allSubjects[0]?.courseId, sectionId: chapterGrades[0]?.sectionId }));
    }
    }
  }, [academicDateRange, selectedOption, chapterGrades])

  useEffect(() => {
    if (notifyDate?.notificationDate) {
      const formattedDate = moment(notifyDate.notificationDate).format('YYYY-MM-DD');
      setDate([formattedDate, formattedDate]);
    }
  }, [notifyDate?.notificationDate])

  useEffect(() => {
    if (chapterNotifyDate?.notificationDate) {
      const formattedDate = moment(chapterNotifyDate.notificationDate).format('YYYY-MM-DD');
      setDate([formattedDate, formattedDate]);
    }
  }, [chapterNotifyDate?.notificationDate])

  return (
    <div className='online-aasesment-qp-filtes' style={{ marginBottom: "6px" }}>
      <div className='selectTransBtnSect createNewTemplateSelectLeft' style={{ display: 'flex', alignItems: "center", height: "52px" }}>
        {/* Moved Toggle Button Component from this component to Parent Component */}
        {/* <div>
          <OnlineColorToggleButton selectedTab={selectedOption} onChange={handleOptionChange} />
        </div> */}
        <div style={{ display: "flex", justifyContent: "end", width: "100%", gap: "8px", alignItems: "center" }}>
        {/* Multi-select for grades */}
          {!isFromTeacherWeb && selectedOption == "0" &&
          <MultiSelectComponentforFilters
            lsName={'grade'}
            options={allGreads}
            values={allFilters?.gradeId}
            multiType={'Multi1'}
            addableFiled='All grades'
            showableField={'grade'}
            selectableField={'es_gradeid'}
            onChange={(e: any) => {
              updateUser(e, 'gradeId');
            }}
            disable={false}
          />
          }

          {
            !isFromTeacherWeb && selectedOption == "1" &&
            <Grid item xs={4} style={{ paddingTop: '8px', width: "140px", height: "83px" }} className="chapter-challenge-single-select">
                <FormControl sx={{ m: 1 }} fullWidth>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="gradeID"
                  value={chapterSearchFilter?.classId || ""}
                    onChange={(e: any) => {
                      updateChapterUser(e, 'gradeId')
                    }}
                    label="Grade"
                  disabled={false}
                  fullWidth
                  // MenuProps={{ClassNames:"hello"}}
                  MenuProps={{ className: "SectionMenuItem" }}
                >
                  {chapterGrades && chapterGrades.map((grade: any) => (

                    <MenuItem key={grade.classId} value={grade.classId}>
                      {grade?.className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
          }
        {/* Multi-select for subjects */}
          {!isFromTeacherWeb && selectedOption == "0" &&
          <MultiSelectComponentforFilters
            lsName={'subject'}
            options={subjectFiltered}
            values={allFilters?.subjectId || ""}
            multiType={'Multi1'}
            addableFiled='All Subjects'
            showableField='courseDisplayName'
            selectableField='courseId'
            onChange={(e: any) => {
              updateUser(e, 'subjectId');
            }}
            disable={selectedOption == "1" ? false : (allFilters?.gradeId === "" || questions?.length === 0) && !(allFilters?.subjectId) ? true : false}
            //disable={(allFilters?.gradeId === "" || questions?.length === 0) && !(allFilters?.subjectId) ? true : false}
          />
        }

          {
            !isFromTeacherWeb && selectedOption == "1" &&
            <Grid item xs={4} style={{ paddingTop: '8px', width: "140px", height: "83px" }} className="chapter-challenge-single-select">
                <FormControl sx={{ m: 1 }} fullWidth>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="subjectID"
                  value={chapterSearchFilter?.subjectId || ""}
                  onChange={(e: any) => {
                    updateChapterUser(e, 'subjectId')
                  }}
                  label="Subject"
                  disabled={false}
                  fullWidth
                  // MenuProps={{ClassNames:"hello"}}
                  MenuProps={{ className: "SectionMenuItem" }}
                >
                  {chapterSubjects && chapterSubjects.map((course: any) => (

                    <MenuItem key={course.courseId} value={course.courseId}>
                      {course?.courseDisplayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
          }
        <div className='selChapterPaperFilter'>
          <MultiSelectComponentforFilters
            lsName={'name'}
              options={selectedOption == "1" ? allQpList?.length ? allQpList : '' : chapterOptions}
            onChange={(e: any) => {
              selectedOption == "1" ? updateChapterUser(e, 'chapterId') :
              updateUser(e, 'chapters');
            }}
              disable={selectedOption == "1" ? (questions?.length === 0 && (chapterSearchFilter?.chapterId == "")) : (questions?.length === 0 && !(allFilters?.chapterId)) || chapterOptions?.length === 0}
            multiType={'Multi1'}
              addableFiled='All Chapters'
              showableField={selectedOption == "1" ? 'chapterName' : 'name'}
              selectableField={selectedOption == "1" ? 'chapterId' : 'id'}
              values={selectedOption == "1" ? chapterSearchFilter?.chapterId : allFilters?.chapterId || ""}
          />
        </div>
        {/* TextField with Calendar Icon */}
          <div className="multi-date-container selQuesPaperFilter">
          <Input
            type="text"
            placeholder=""
            disableUnderline
            readOnly
            className="input-field-container"
              value={labelValue}
            startAdornment={
              <InputAdornment position="start">Date:</InputAdornment>
            }
            endAdornment={
              <img
                src={CALENDER_ICONS}
                alt="Calendar"
                className={!(questions?.length === 0 && (selectedOption == "0" ? !(allFilters?.startDate) : !(chapterSearchFilter?.startDate))) ? "input-image" : "no-data-input-image"}
                onClick={(event) => !(questions?.length === 0 && (selectedOption == "0" ? !(allFilters?.startDate) : !(chapterSearchFilter?.startDate))) && opencalenderRange(event)}
                id="parentAppointmentDatePicker"
              />
            }
            // Disable the input field if qpList.length is 0
              disabled={(questions?.length === 0 && (selectedOption == "0" ? !(allFilters?.startDate) : !(chapterSearchFilter?.startDate)))}
          />
          </div>
          <DesktopCalenderDatePicker
          onClose={handleDatePickerCancel}
          state={state}
          setState={setState}
          setDate={setDate}
          selectedDateRange={setSelectedDateRange}
          anchorEl={anchorEl}
          anchorPosition={anchorPosition}
          teacherAppoiDate={openCalender}
          setTeacherAppoiDate={setOpenCalender}
          className="appointCalender"
            mixMaxDate={mixMaxDate}
            setLabelValue={setLabelValue}
            selectedOption={selectedOption}
          />
        </div>
      </div>
    </div>
  );
}

export default OnlineAssesmentQuestionPaperfilter;
