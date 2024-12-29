import React, { useEffect, useRef, useState } from 'react';
import {useDispatch} from "react-redux";

import './QuestionPaperTable.css';
import styles from './QuestionPaperTable.module.css';
import TableStyles from './QuestionTable.module.css';
import InputFieldComponent from '../../SharedComponents/InputFieldComponent/InputFieldComponent';
import {
  Collapse,
  IconButton,
  Pagination,
  Table,
  AlertColor,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
} from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CheckBoxCompleted from '../../SharedComponents/CheckBoxComponent/CheckBoxComponent';
import AddIcon from '@mui/icons-material/Add';
import UpPolygon from '../../../assets/images/UpPolygon.svg';
import Polygon from '../../../assets/images/Polygon.svg';
import ActionButtonComponent from '../../SharedComponents/ActionButtonComponent/ActionButtonComponent';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { tabElement } from '../../../../src/constants/urls';
import MultiSelectComponentforFilters from '../../SharedComponents/MultiSelectComponent/MultiSelectComponentNew';
import {
  getQuestionPaperList,
  QuestionPaperTypeapi,
  QuestionPaperModeApi,
  delQuestionPaperApi,
  GetQuestionPaperAcademicId,
  delSetQuestionPaperApi,
  QuestionPaperTemplatePreviewApi,
} from '../../../../src/Api/QuestionTypePaper';
import DeleteModalComponent from '../../SharedComponents/DeleteModalComponent/DeleteModalComponent';
import { getLocalStorageDataBasedOnKey, resetLocalStorage } from '../../../constants/helper';
import { State } from '../../../types/assessment';
import { baseFilterApi, baseGradeApi, getVersionHistory } from '../../../Api/AssessmentTypes';
import EmptyScreen from '../../SharedComponents/EmptyScreen/EmptyScreen';
import MultiSelectComponent from '../../SharedComponents/MultiSelectComponent/MultiSelectComponent';
import CreateNewQuestionPaperModal from '../../SharedComponents/QuestionPaperSharedComponent/CreateNewQuestionPaperModal/CreateNewQuestionPaperModal';
import QuestionPaperIcon from '../../../assets/images/QuestionPaperIcon.svg';
import QuestionPaperIconwithApprove from '../../../assets/images/QuestionPaperIconwithApprove.svg';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import offline from '../../../assets/images/offline.svg';
import Desktop from '../../../assets/images/Desktop.svg';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Spinner from '../../SharedComponents/Spinner/index';
import ButtonColorComponent from '../../SharedComponents/ButtonColorComponent/ButtonColorComponent';
import useDebounce from '../../../hooks/useDebounce';
import { ReactComponent as Chevrondown } from '../../../assets/images/chevrondown.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import PointFilter from '../../AssessmentsContainer/pointerFilter';
import Toaster from '../../SharedComponents/Toaster/Toaster';
import SelectBoxComponent from '../../SharedComponents/SelectBoxComponent/SelectBoxComponent';
import { Buffer } from 'buffer';
import DuplicateEntryPopup from '../../SharedComponents/ModalPopup/DuplicateEntryPopup';
import QuestionPaperTemplatePreview from './QuestionPaperTemplatePreview';
import { fontDeatailsDropdown, questionPaperDuplicatePostAPI } from '../../../Api/QuestionPaper';
import PrintDateFieldModalPopup from '../../SharedComponents/ModalPopup/PrintDateFieldModalPopup';
import PrintQuestionPaperTemplate from '../../ManualQuestionPaperContainer/MIFQuestionPaperPreviewforPrint/printDoc/PrintQuestionPaperTemplate';
import { useReactToPrint } from 'react-to-print';
import ButtonPopupComponent from '../../SharedComponents/ButtonPopupComponent/ButtonPopupComponent';
import AutoGeneration from '../../../assets/images/Auto_generation.svg';
import MaualGeneration from '../../../assets/images/Manual_generation.svg';
import CreateOnlineQuestionPaperPreview from '../CreateOnlineQuestionPaperPreview/CreateOnlineQuestionPaperPreview';
import { qGradeEventActions, qModeEventActions, qPaperTypeEventActions } from '../../../redux/actions/assesmentQListEvent';

const QuestionPaperTable = () => {
  const dispatch = useDispatch();
  const [tableAllRowSelected, setTableAllRowSelected] = useState(false);
  const [value, setValue] = useState<string>('1');
  const [questionpaperData, setQuestionpaperData] = useState([] as any);
  const [tableRowSelected, setTableRowSelected] = useState<number[]>([]);
  const [questionId, setQuestionId] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [grade, setGrade] = useState<any>([]);
  const [subjectFilter, setSubjectFilter] = useState<any>([]);
  const [questionpapermode, setQuestionpapermode] = useState<any>([]);
  const [questionpaperstatus, setQuestionpaperstatus] = useState<any>([]);
  const [QuestionPaperType, setQuestionPaperType] = useState<any>([]);
  const deBounceSearchterm = useDebounce(searchTerm, 500);
  const [pgNo, setPgNo] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
  const [createnewquespaper, setCreatenewquespaper] = useState(false);
  const [showgoback, setshowgoBack] = useState(false);
  const [spinnerStatus, setSpinnerStatus] = useState(true);
  const [snackBar, setSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>('');
  const [SnackBarSeverity, setSnackBarSeverity] = useState<AlertColor>('success');
  const [sortDetails, setSortDetails] = useState({
    sortColName: '',
    sortColOrder: '',
  });
  const [academicYearData, setAcademicYearData] = useState<any>({});
  const [academicYearDataInfo, setAcademicYearDataInfo] = useState([]);
  const [academicYearDataSelected, setAcademicYearDataSelected] = useState('');
  const [delSet, setDel] = useState<any>({ set: null, parentId: null });
  const [openDel, setOpenDel] = useState<boolean>(false);
  const [printWithAnswer, setPrintWithAnswer] = useState<boolean>(false);
  let history = useNavigate();
  const [anchorElCreatePopup, setAnchorElCreatePopup] = React.useState<HTMLButtonElement | null>(null);
  const [createButtonActionObj, setCreateButtonActionObj] = useState([
    {
      icon: AutoGeneration,
      headerContent: 'Auto generation',
      desciption: 'Recommended ',
      id: 2,
    },
    {
      icon: MaualGeneration,
      headerContent: 'Manual generation',
      desciption: '',
      id: 1,
    },
  ]);
  const [generationQpId, setGenerationQpId] = useState();
  const [allFilters, setAllFilters] = useState({
    gradeId: '',
    subjectId: '',
    questionPaperTypeId: '',
    minMarks: '',
    maxMarks: '',
  });
  const cloneObj = {
    gradeId: '',
    subjectId: '',
    questionPaperTypeId: '',
    minMarks: '',
    maxMarks: '',
  } as any;
  const [minMaxCall, setMinMaxCall] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const [multifileID, setMultifileID] = useState(null);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [subList, setSubList] = useState<any>([]);
  const [duplicateEntryOpen, setDuplicateEntryOpen] = useState(false);
  const [previewTemplateJsonOpen, setPreviewTemplateJsonOpen] = useState(false);
  const [previewTemplateJson, setPreviewTemplateJson] = useState({});
  const [duplicateTemplateReq, setDuplicateTemplateReq] = useState();
  const [saveBtnDisable, setSaveBtnDisable] = useState(false);
  const [openPrintModel, setOpenPrintModel] = useState<boolean>(false);
  const [printedData, setPrintedData] = useState<string>('');
  const [qpId, setQpId] = useState<any>([]);
  const [examSubName, setExamSubName] = useState<any>('');
  const [qpSetId, setQpSetId] = useState<number>();
  const [showAssignQPModal, setShowAssignQPModal] = useState<boolean>(false);
  const [duplicateReqBody, setDuplicateReqBody] = useState<any>({
    questionPaperID: null,
  });
  const [versionHistoryData, setVersionHistoryData] = useState<any>([]);
  const [questionPaperIdToAssign, setQuestionPaperIdToAssign] = useState('');
  const location = useLocation();
  const [printConfig, setPrintConfig] = useState()
  const [markUploaded, setMarkUploaded] = useState<boolean>(false);
  const [markUploaded2, setMarkUploaded2] = useState<boolean>(false);
  const [isSetsAllocated, setIsSetsAllocated] = useState<boolean>();
  const [isWorksheetSet, setIsWorksheetSet] = useState(false)

  const sortToggle = (data: string) => {
    const sortdata: any = {
      sortColName: data,
      sortColOrder: sortDetails.sortColOrder === 'Asc' ? 'Desc' : 'Asc',
    };
    setSortDetails(sortdata);
  };
  const getClassName = (key: string) => {
    if (key === sortDetails.sortColName) {
      return sortDetails.sortColOrder === 'Asc' ? 'activeUpArrow' : 'activeDownArrow';
    }
    return '';
  };

  const componentRef: any = useRef();

  const printQuesion = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      size: auto;
      margin: 11mm 17mm 17mm 17mm;

      @bottom-right {
          content: "Page " counter(page);
      }`,
    documentTitle: '',
    copyStyles: true,
  });

  const [templateFontDetails, setTemplateFontDetails] = React.useState();
  const fontDetailsSelectValue = async () => {
    const response = await fontDeatailsDropdown();
    if (response?.result?.responseCode == 0) {
      setTemplateFontDetails(response?.data);
    }
  };
  React.useEffect(() => {
    fontDetailsSelectValue();
  }, []);

  const handleGetGrade = async () => {
    try {
      const response = await baseGradeApi('grade', stateDetails.login.userData.userRefId);
      if (response?.status === '200') {
        /**
         * @developer shivrajkhetri@navneettoptech.com
         *  @description this api payload we are using in Evaluation Component 
         */
        setGrade(response?.data);
        dispatch(qGradeEventActions(response?.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleQuestionPaperMode = async () => {
    const mode = await QuestionPaperModeApi();
    /**
     *  @developer shivrajkhetri@navneettoptech.com
     *  @description this data we are are using for evaluation tab
     */
    if (mode?.length > 0) {
      setQuestionpapermode(mode);
      dispatch(qModeEventActions(mode));
    } else {
      setQuestionpapermode([]);
    }
  };

  let findDuplicates = (arr: any) => arr.filter((item: any, index: any) => arr.indexOf(item) !== index);

  const getSubjectByApi = async () => {
    const gradePostObj = {
      gradeIds: allFilters?.gradeId?.split(',').map((e: any) => +e),
    };
    const response = await baseFilterApi('subjects', {
      gradeId: gradePostObj.gradeIds,
      staffId: stateDetails.login.userData.userRefId,
      publicationId: 0,
    });
    const courseList = response?.data?.map((x: any) => x.courseName);
    const dupli = findDuplicates(courseList);
    if (dupli.length > 0) {
      const newSearchValue = response?.data?.map((item: any) => {
        if (dupli?.includes(item?.courseName)) {
          return { ...item, courseName: `${item.courseName}(${item.grade})` };
        } else {
          return item;
        }
      });
      setSubjectFilter(newSearchValue);
    } else {
      setSubjectFilter(response?.data);
    }
    // setAllFilters({...allFilters, subjectId: "" })
  };

  const updateUser = (data: any, filter: string) => {
    switch (filter) {
      case 'gradeId':
        let gradeFilter = '';
        if (data?.length === 0) {
          resetLocalStorage(['grade', 'subject'], 'qpList_history');
        }
        data.forEach((ele: number) => {
          gradeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => ({ ...prev, gradeId: gradeFilter.slice(0, -1), subjectId: '' }));
        break;
      case 'subjectId':
        let subFilter = '';
        if (data?.length === 0) {
          resetLocalStorage(['subject'], 'qpList_history');
        }
        data.forEach((ele: number) => {
          subFilter += `${ele},`;
        });
        setAllFilters((prev: any) => ({ ...prev, subjectId: subFilter.slice(0, -1) }));
        break;
      case 'questionPaperTypeId':
        let typeFilter = '';
        data.forEach((ele: number) => {
          typeFilter += `${ele},`;
        });
        setAllFilters((prev: any) => ({ ...prev, questionPaperTypeId: typeFilter.slice(0, -1) }));
        break;
    }
  };

  const handleButtonClick = () => {
    console.log('buttonclick');
  };
  const qpListHistoryHandler = () => {
    const storageObj = {
      pageNumber: pgNo,
      search: searchTerm,
      grade: allFilters?.gradeId,
      subject: allFilters?.subjectId,
      qpType: allFilters?.questionPaperTypeId,
      minMarks: allFilters?.minMarks,
      maxMarks: allFilters?.maxMarks,
      academicYear: academicYearDataSelected,
    };
    const StorageObj = JSON.stringify(storageObj);
    localStorage.setItem('qpList_history', StorageObj);
  };
  const handleEdit = (data: any) => {
    qpListHistoryHandler();
    history(
      `${
        data?.generationModeID === 1
          ? '/MIFprintForPreview'
          : data?.questionPaperTypeID == 1
          ? '/assess/questionpaper/informal-autoflow/printforpreview'
          : '/assess/questionpaper/formal-autoflow/printforpreview'
      }`,
      {
        state: {
          state: true,
          templateId: data?.id,
          print: false,
          questionPaperTypeID: data.questionPaperTypeID,
          enablebtnPrint:
            data?.questionPaperTypeID == 2 ? (data.statusID === 2 || data.statusID === 6 ? false : true) : false,
          disableBtnPrint:
            data?.questionPaperTypeID == 2
              ? data.statusID === 2 || data.statusID === 6 || data.statusID === 5
                ? true
                : false
              : false,
        },
      },
    );
  };

  const initialstorageObj = {
    pageNumber: 0,
    search: '',
    grade: '',
    subject: '',
    qpType: '',
    minMarks: '',
    maxMarks: '',
    academicYear: '',
  };

  const hanldecreatequestionpaper = (event: any) => {
    setAnchorElCreatePopup(event.currentTarget);
  };
  const buttonPopupHandler = (dataValue: string, dataList: any) => {
    setGenerationQpId(dataList[dataValue].id);
    setAnchorElCreatePopup(null);
    setTimeout(() => {
      setCreatenewquespaper(true);
    }, 200);
  };

  const handleCheck = (checkStatus: boolean, index: number) => {
    let selectedPaper = tableRowSelected;
    if (selectedPaper.includes(index)) {
      selectedPaper = selectedPaper.filter((e: any) => e !== index);
    } else {
      selectedPaper.push(index);
    }
    setTableRowSelected([...selectedPaper]);
    let array = [] as any;
    let marUploaded = [] as any
    questionpaperData?.forEach((a: any, i: number) => {
      if (selectedPaper.includes(i)) {
        array.push(a?.id);
        marUploaded.push(a?.isMarksUploaded);
      }
    });
    if (marUploaded.includes(true)) {
      setMarkUploaded2(true)
    } else {
      setMarkUploaded2(false)

    }
    if (checkStatus = false) {
      setMarkUploaded2(false)
    }
    if (array.length > 0) {
      setQuestionId([array]);
    }
  };

  const handleAllCheck = (checkStatus: boolean) => {
    let tableRowList: any = [];
    let tableDataListArray: any = questionpaperData;
    tableDataListArray?.map((data: any, index: number) => {
      checkStatus ? tableRowList.push(data?.statusID != 5 ? index : null) : (tableRowList = []);
    });
    setTableRowSelected(tableRowList.filter((x: any) => x != null));
    let array = [] as any;
    let marUploaded = [] as any
    questionpaperData?.forEach((a: any, i: number) => {
      array.push(a?.id);
      marUploaded.push(a?.isMarksUploaded)
    });
    if (marUploaded.includes(true)) {
      setMarkUploaded2(true)
    }
    if (checkStatus === false) {
      setMarkUploaded2(false)
    }
    if (array.length > 0) {
      setQuestionId([array]);
    } else {
      setQuestionId([]);
    }
  };

  useEffect(() => {
    if (
      tableRowSelected?.length &&
      tableRowSelected?.length ===
        questionpaperData?.map((a: any, i: number) => (a?.statusID == 5 ? null : i))?.filter((x: any) => x != null)
          ?.length
    ) {
      setTableAllRowSelected(true);
    } else {
      setTableAllRowSelected(false);
    }
  }, [tableRowSelected]);

  const deleteQuestion = () => {
    setBulkDelete(true);
    setDeleteModalOpen(true);
  };

  const getKeyHandler = (data: any) => {
    setQuestionId(data?.id);
  };
  const qpSetDelHandler = (setId: any, parentID: any, isSetsAllocated:any) => {
    setOpenDel(true);
    setDel({ set: setId?.id, parentId: parentID });
    setIsSetsAllocated(isSetsAllocated);
  };
  const maxGreatMin =
    +allFilters?.maxMarks > +allFilters?.minMarks || +allFilters?.minMarks == +allFilters?.maxMarks ? true : false;
  const mincondiCheck = +allFilters?.minMarks && +allFilters?.minMarks > 0 && maxGreatMin ? true : false;
  const maxcondiCheck = +allFilters?.maxMarks && +allFilters?.maxMarks > 0 && maxGreatMin ? true : false;

  const minMaxApiHandler = () => {
    if (minMaxCall) {
      if (mincondiCheck && maxcondiCheck) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };
  const getquestionPaperCall = async (pgreset: boolean) => {
    const markHandler = minMaxApiHandler();
    if (!markHandler) {
      if(!localStorage.hasOwnProperty('qpList_history')) setSpinnerStatus(true);
      let postObj = {
        gradeIds: allFilters.gradeId ? allFilters.gradeId?.split(',')?.map((e: any) => +e) : [],
        courseIds: allFilters.subjectId ? allFilters.subjectId?.split(',')?.map((e: any) => +e) : [],
        searchKey: deBounceSearchterm ? Buffer.from(deBounceSearchterm.trim()).toString('base64') : '',
        sortKey: sortDetails?.sortColName || '',
        sortKeyOrder: sortDetails?.sortColOrder || '',
        questionPaperTypeId: allFilters.questionPaperTypeId
          ? allFilters.questionPaperTypeId?.split(',')?.map((e: any) => +e)
          : [],
        questionPaperStatus: '',
        pageNo: pgreset ? 0 : pgNo,
        pageSize: 10,
        minMarks: mincondiCheck ? allFilters?.minMarks : '',
        maxMarks: maxcondiCheck ? allFilters?.maxMarks : '',
        academicYearIds: academicYearData[academicYearDataSelected]?.acadamicId
          ? academicYearData[academicYearDataSelected]?.acadamicId
          : '',
      };
      if (academicYearData[academicYearDataSelected]?.acadamicId) {

        const resp = await getQuestionPaperList(postObj);
        if (resp) {
          let response = resp?.baseResponse?.data;
          setQuestionpaperData(response || []);
          //setQuestionpaperData([]);
          setTotalPages(resp?.totalPages);
          // setPgNo(resp?.pageNo)
        }
      }
      if(!localStorage.hasOwnProperty('qpList_history')) setSpinnerStatus(false);
    }
  };
  const deleteQuestionHandler = async () => {
    let res: any;
    if (openDel) {
      setOpenDel(false);
      res = await delSetQuestionPaperApi(delSet?.parentId, delSet?.set);
      if (res?.result?.responseCode == 0) {
        setSnackBarText('Question paper has been deleted');
        setSubList([]);
        setExpanded(false);
        setMultifileID(null);
      }
    } else {
      res = await delQuestionPaperApi(questionId);
      if (res?.result?.responseCode == 0) {
        setSnackBarText(
          `${
            tableRowSelected?.length && bulkDelete
              ? `${tableRowSelected?.length} Question papers has been deleted`
              : `${questionpaperData?.find((x: any) => x?.id == questionId)?.name} has been deleted`
          }`,
        );
      }
    }
    setDeleteModalOpen(false);
    setBulkDelete(false);
    setTableAllRowSelected(false);
    setTableRowSelected([]);
    if (res?.result?.responseCode == 0) {
      setPgNo(0);
      getquestionPaperCall(true);
      setSnackBar(true);
      setSnackBarSeverity('success');
    } else {
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(`Something went wrong!`);
    }
  };

  const QuestionPaperTypeAPi = async () => {
    const res = await QuestionPaperTypeapi();
    if (res) {
      setQuestionPaperType(res);
      /**
       *  @developer shivrajkhetri@navneettoptech.com
       *  @description this Api details we are using at Evaluation Tab
       */
      dispatch(qPaperTypeEventActions(res));
    }
  };

  const getQueryPoints = (param: string, type: string) => {
    setMinMaxCall(true);
    if (type == 'min') {
      setAllFilters((prev: any) => ({ ...prev, minMarks: param }));
    }
    if (type == 'max') {
      setAllFilters((prev: any) => ({ ...prev, maxMarks: param }));
    }
    if (type == 'empty') {
      setAllFilters((prev: any) => ({ ...prev, maxMarks: '', minMarks: '' }));
      if (allFilters?.minMarks == '' && allFilters?.maxMarks == '') {
        getquestionPaperCall(false);
        setMinMaxCall(false);
      }
    }
  };
  const disableFilter = (type: string) => {
    switch (type) {
      case 'grade':
        if ((!questionpaperData?.length && JSON.stringify(cloneObj) === JSON.stringify(allFilters)) || !grade?.length) {
          return true;
        } else {
          return false;
        }
      case 'subject':
        if (
          (!questionpaperData?.length && JSON.stringify(cloneObj) === JSON.stringify(allFilters)) ||
          !grade?.length ||
          !subjectFilter?.length ||
          !allFilters?.gradeId?.split(',')?.length ||
          (allFilters?.gradeId?.split(',')?.length == 1 && allFilters?.gradeId?.split(',')[0] == '')
        ) {
          return true;
        } else {
          return false;
        }
    }
  };
  useEffect(() => {
    if (allFilters?.minMarks && allFilters?.maxMarks) {
      getquestionPaperCall(false);
    }
    if (allFilters?.minMarks == '' && allFilters?.maxMarks == '') {
      getquestionPaperCall(false);
      setMinMaxCall(false);
    }
  }, [allFilters?.minMarks, allFilters?.maxMarks, academicYearDataSelected, academicYearDataInfo]);

  const [timeoutId, setTimeoutId] = React.useState(null);
  let newTimeoutId: any;
  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    newTimeoutId = setTimeout(() => {
      getquestionPaperCall(false);
    }, 500);
    setTimeoutId(newTimeoutId);
  }, [pgNo, allFilters, sortDetails, deBounceSearchterm]);

  const [marksPreSet, setMarksPreSet] = React.useState<any | null>(null);
  useEffect(() => {
    if (localStorage.hasOwnProperty('qpList_history')) {
      const {
        search = '',
        minMarks = '',
        maxMarks = '',
        academicYear = '',
      } = JSON.parse(localStorage.getItem('qpList_history') || '{}');
      if (searchTerm !== search) {
        setSearchTerm(search);
      }
      setAcademicYearDataSelected(academicYear);
      if (minMarks != '' || maxMarks !== '') {
        setMarksPreSet({
          min: minMarks,
          max: maxMarks,
        });
      }
    }
  }, []);

  useEffect(() => {
    handleGetGrade();
    handleQuestionPaperMode();
    QuestionPaperTypeAPi();
  }, []);
  useEffect(() => {
    if (allFilters?.gradeId) {
      getSubjectByApi();
    } else {
      setAllFilters((prev: any) => ({ ...prev, subjectId: '' }));
      setSubjectFilter([]);
    }
  }, [allFilters?.gradeId]);
  useEffect(() => {
    setPgNo(0);
  }, [allFilters]);
  useEffect(() => {
    setTableAllRowSelected(false);
    setTableRowSelected([]);
  }, [pgNo]);
  const handleAssementorExaminationclick = (id: number, mode: number) => {
    if (id == 1)
      history(generationQpId == 2 ? '/assess/questionpaper/informal-autoflow/new' : '/MIFQuestionpaper', {
        state: { questionPaperTypeID: id, questionPaperViewMode: mode, questionPaperGenerationId: generationQpId },
      });
    else
      history(generationQpId == 2 ? '/assess/questionpaper/formal-autoflow/new' : '/MIFQuestionpaper', {
        state: { questionPaperTypeID: id, questionPaperViewMode: mode, questionPaperGenerationId: generationQpId },
      });
  };

  //required for createnew question paper modal
  const modalData = [
    {
      header: 'Formative (Informal)',
      image: QuestionPaperIcon,
      content: 'Create question paper to conduct class tests/informal tests',
      id: 1,
      buttons: [
        {
          label: 'Create Assessment',
          type: 'contained',
          textColor: 'white',
          backgroundColor: '#01B58A',
          minWidth: '182px',
          buttonSize: 'Medium',
          icon: <ArrowForwardIcon />, //icon need to be passed as a component
          onClick: (qpType: number, qpModeType: number) => handleAssementorExaminationclick(qpType, qpModeType),
        },
      ],
    },
    {
      header: 'Summative (Formal)',
      image: QuestionPaperIconwithApprove,
      content: 'Create question paper and send for approval to HOD before assigning',
      id: 2,
      buttons: [
        {
          label: 'Create Assessment',
          type: 'contained',
          textColor: 'white',
          backgroundColor: '#01B58A',
          minWidth: '182px',
          buttonSize: 'Medium',
          icon: <ArrowForwardIcon />,
          onClick: (qpType: number, qpModeType: number) => handleAssementorExaminationclick(qpType, qpModeType),
        },
      ],
    },
  ];

  const modalDatagoback = [
    {
      header: 'Online',
      image: Desktop,
      content: 'Assign and track students progress online',
      buttons: [
        {
          label: 'Create Assessment',
          type: 'contained',
          textColor: 'white',
          backgroundColor: '#01B58A',
          minWidth: '182px',
          buttonSize: 'Medium',
          icon: <ArrowForwardIcon />, //icon need to be passed as a component
          onClick: () => handleButtonClick(),
        },
      ],
    },
    {
      header: 'offline',
      image: offline,
      content: 'Print question for in class test',
      buttons: [
        {
          label: 'Create Assessment',
          type: 'contained',
          textColor: 'white',
          backgroundColor: '#01B58A',
          minWidth: '182px',
          buttonSize: 'Medium',
          icon: <ArrowForwardIcon />,
          onClick: () => handleButtonClick(),
        },
      ],
    },
  ];

  const histroy = [
    {
      date: 'Cycle Test (Set 1)',
      mode: 'Offline',
      type: 'Informal',
      marks: 20,
      status: 'Print',
    },
    {
      date: 'Cycle Test (Set 2)',
      mode: 'Offline',
      type: 'Formal',
      marks: 20,
      status: 'Print',
    },
  ];

  const handleToggle = (id: any, list: any, isMarksUploaded: any) => {
    setSubList(list);
    setMarkUploaded(isMarksUploaded)
    if (multifileID === id) {
      if (expanded) {
        setExpanded(false);
        setMultifileID(null);
      }
      if (!expanded) {
        setExpanded(true);
        setMultifileID(id);
      }
    } else {
      setExpanded(true);
      setMultifileID(id);
    }
  };

  const getAcademicYear = async () => {
    const response = await GetQuestionPaperAcademicId();
    if (response?.status === '200') {
      let academicYears = response?.data?.academicData?.filter((year: any) => year?.academicStatusId < 1);
      academicYears = academicYears.sort((a: any, b: any) => b?.academicStatusId - a?.academicStatusId);
      setAcademicYearData(academicYears);
      let academicData: any = [];
      academicYears.map((e: any, index: number) => {
        let academicLabel = e.acadamicYear + (e.academicStatusId == 0 ? ' (Current)' : '');
        academicData.push(academicLabel);
        if (e?.academicStatusId == 0) {
          const { academicYear = '' } = JSON.parse(localStorage.getItem('qpList_history') || '{}');
          if (academicYear && academicYear !== index.toString()) {
            setAcademicYearDataSelected(academicYear);
          } else if (!academicYear) {
            setAcademicYearDataSelected(index.toString());
          }
        }
      });
      setAcademicYearDataInfo(academicData);
    }
  };

  const AcademicYearSelectHandler = (indexData: number) => {
    setPgNo(0);
    setSearchTerm('');
    setAllFilters({
      gradeId: '',
      subjectId: '',
      questionPaperTypeId: '',
      minMarks: '',
      maxMarks: '',
    });
    setMarksPreSet({
      min: '',
      max: '',
    });
    setAcademicYearDataSelected(indexData.toString());
  };

  useEffect(() => {
    getAcademicYear();
  }, []);
  const [type, setType] = useState<string>('');

  const ReplaceSetExamName = (content: any, examSetName: any) => {
    let headerPart: any;
    const traverseJson = (obj: any) => {
      headerPart = obj;
      headerPart?.headerDetails?.map((section: any) => {
        if (section?.sectionTypeKey === 'examNameSection') {
          section?.sectionDetails?.sectionFields?.map((secItem: any) => {
            if (secItem?.fieldKey === 'examName') {
              secItem.fieldValue = examSetName;
            }
            return;
          });
        }
      });
    };
    traverseJson(content);
    return headerPart;
  };

  const previewTemplateDetails = async (id: any, setId: number, type: string, setName?: any, isWorkSheetStyle?:any) => {
    setQpSetId(setId);
    setQpId(id);
    setExamSubName(setName);
    setType(type);
    const templateData = await QuestionPaperTemplatePreviewApi(id.toString(), setId.toString());
    if (type == 'preview' || type == 'print') {
      if (setName) {
        const updatedJson = ReplaceSetExamName(templateData?.data?.generatedQuestionPaper, setName);
        if("printConfig" in templateData?.data) setPrintConfig(templateData?.data?.printConfig)      
        setPreviewTemplateJson(updatedJson);
      } else {
        setPreviewTemplateJson(templateData?.data?.generatedQuestionPaper);
      }
      setPreviewTemplateJsonOpen(true);
    }
    setPrintConfig(templateData?.data?.printConfig)
    setIsWorksheetSet(isWorkSheetStyle)
  };

  const duplicateQuestionPaper = async (templateId: string, setId?: string) => {
    const sets = setId && { setID: Number(setId) };
    setDuplicateReqBody({
      ...sets,
      questionPaperID: Number(templateId),
    });
    setDuplicateEntryOpen(true);
    setSaveBtnDisable(true);
  };

  const duplicatePostApi = async (duplicateValue: string) => {
    setSpinnerStatus(true);
    let postObj = {
      name: String(duplicateValue),
      ...duplicateReqBody,
    };
    setSaveBtnDisable(false);
    const response = await questionPaperDuplicatePostAPI(postObj);
    if (response?.result?.responseCode == 0 || response?.result?.responseDescription === 'Success') {
      setSpinnerStatus(false);
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`${duplicateValue} created Successfully`);
      setDuplicateEntryOpen(false);
      getquestionPaperCall(true);
    } else {
      setSpinnerStatus(false);
      setSaveBtnDisable(true);
      setSnackBar(true);
      setSnackBarSeverity('error');
      setSnackBarText(
        response?.responseDescription
          ? response?.responseDescription
          : response?.result?.responseDescription ?? 'something went wrong',
      );
    }
  };
  const listPrintHandler = (
    statusId: any,
    qpId: any,
    modeId: any,
    event: any,
    questionPaperTypeID: number,
    enable: boolean,
    disable: boolean,
  ) => {
    if (statusId == 2 || statusId == 6) {
      history(
        `${
          modeId === 1
            ? '/MIFprintForPreview'
            : questionPaperTypeID == 1
            ? '/assess/questionpaper/informal-autoflow/printforpreview'
            : '/assess/questionpaper/formal-autoflow/printforpreview'
        }`,
        {
          state: {
            state: false,
            templateId: qpId,
            print: true,
            questionPaperTypeID: questionPaperTypeID,
            enablebtnPrint: enable,
            disableBtnPrint: disable,
          },
        },
      );
      event?.stopPropagation();
    }
  };

  const getVersions = async () => {
    let res = await getVersionHistory(Number(qpId));
    setVersionHistoryData(res?.data);
  };

  useEffect(() => {
    if (qpId > 0) getVersions();
  }, [qpId]);

  useEffect(() => {
    if (location?.state?.formalState && location?.search === '?saved=true') {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`${location?.state?.message} Saved Successfully`);
      history('/assess/questionpaper');
      // window.history.replaceState({url: "/assess/questionpaper"}, document.title)
    }

    if (location?.state?.severity && location?.search === '?saved=true') {
      setSnackBar(true);
      setSnackBarSeverity('success');
      setSnackBarText(`${location?.state?.text}`);
      history('/assess/questionpaper');
    }
  }, [location]);

  setTimeout(() => {
    setSpinnerStatus(false);
    localStorage.removeItem("qpList_history");
  },1500)

  return (
    <>
      <div className='questionPaperAcademicTable'>
        <SelectBoxComponent
          variant={'fill'}
          selectedValue={academicYearDataSelected}
          clickHandler={(e: number) => {
            AcademicYearSelectHandler(e);
          }}
          selectLabel={'Academic Year:'}
          selectList={academicYearDataInfo}
          mandatory={false}
        />
      </div>
      {/* <div className='assessmentParentContainer'> */}
      {/* <div className={styles.assessmentContainerSect}> */}
      {/* <h1 className='assessmentTitles'>Assessments</h1> */}
      <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-2`} sx={{ width: '100%' }}>
        <TabContext value={value}>
          {/* <Box >
                                <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    {tabElement.map((tab:any, index:any) => <Tab key={index} label={tab.label} value={`${index + 1}`} />)}
                                </TabList>
                            </Box> */}
          <TabPanel value='1' className='px-0'>
            <div className='d-flex filter-file' style={{ justifyContent: 'space-between' }}>
              <div className='selectTransBtnSect createNewTemplateSelectLeft' style={{ display: 'flex', gap: '10px' }}>
                <MultiSelectComponentforFilters
                  lsName={'grade'}
                  options={grade}
                  disable={disableFilter('grade')}
                  values={allFilters.gradeId}
                  onChange={(e: any) => {
                    updateUser(e, 'gradeId');
                  }}
                  multiType={'Multi1'}
                  addableFiled='All Grades'
                  showableField='grade'
                  selectableField='es_gradeid'
                />
                <MultiSelectComponentforFilters
                  lsName={'subject'}
                  options={subjectFilter}
                  disable={disableFilter('subject')}
                  values={allFilters.subjectId}
                  onChange={(e: any) => {
                    updateUser(e, 'subjectId');
                  }}
                  multiType={'Multi1'}
                  addableFiled='All Subject'
                  showableField='courseDisplayName'
                  selectableField='courseId'
                />
              </div>
              <div className='d-flex gap-2'>
                <div className='selQuesPaperFilter'>
                  <MultiSelectComponentforFilters
                    lsName={'qpType'}
                    options={QuestionPaperType}
                    disable={
                      JSON.stringify(allFilters) == JSON.stringify(cloneObj) && questionpaperData?.length == 0
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      updateUser(e, 'questionPaperTypeId');
                    }}
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
                  disable={
                    JSON.stringify(allFilters) == JSON.stringify(cloneObj) && questionpaperData?.length == 0
                      ? true
                      : false
                  }
                  label={'marks'}
                />
              </div>
            </div>
            {questionpaperData?.length == 0 &&
            !allFilters.gradeId &&
            !allFilters.questionPaperTypeId &&
            !allFilters.questionPaperTypeId &&
            !searchTerm &&
            !allFilters?.minMarks &&
            !allFilters?.maxMarks ? (
              <EmptyScreen
                emptyBtnTxt={'Create New Question Paper'}
                title={'You haven’t created any question papers yet'}
                desc={'Press the button below to create a new question Paper'}
                onClickBtn={() => setCreatenewquespaper(true)}
                btnDisable={academicYearData[academicYearDataSelected]?.academicStatusId != 0}
                createButtonActionObj={createButtonActionObj}
                buttonPopupHandler={(param: any, data: any) => {
                  buttonPopupHandler(param, data);
                }}
              />
            ) : (
              <>
                <div className='questionPaperTableSect'>
                  <div className='searchAndBtn'>
                    <InputFieldComponent
                      label={'Search Question Papers...'}
                      required={false}
                      inputType={'text'}
                      defaultval={searchTerm}
                      onChange={(e: any) => setSearchTerm(e.target.value)}
                      inputSize={'Medium'}
                      variant={'searchIcon'}
                    />
                    <div className='position-relative'>
                      <ButtonComponent
                        icon={<AddIcon />}
                        image={''}
                        textColor=''
                        backgroundColor='#01B58A'
                        disabled={academicYearData[academicYearDataSelected]?.academicStatusId != 0}
                        buttonSize='Medium'
                        type='contained'
                        onClick={hanldecreatequestionpaper}
                        label='Create New Question Paper'
                        minWidth='200'
                      />
                      <ButtonPopupComponent
                        btnPopObj={createButtonActionObj}
                        anchorPoint={anchorElCreatePopup}
                        setAnchorElCreatePopup={setAnchorElCreatePopup}
                        clickHandler={(data: any) => {
                          buttonPopupHandler(data, createButtonActionObj);
                        }}
                        onClose={() => {}}
                      />
                    </div>
                  </div>
                  <div className='questionPaperTableScroll'>
                    <TableContainer className='assessmentTableSect ps-3'>
                      <Table sx={{ width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: '70px', textAlign: 'center' }}>
                              <CheckBoxCompleted
                                checkLabel='Label'
                                disable={false}
                                checkStatus={tableAllRowSelected}
                                onChangeHandler={handleAllCheck}
                              />
                            </TableCell>
                            <TableCell style={{ width: '25%', cursor: 'pointer' }}>
                              <div className='tableHeadArrowSect'>
                                Question Paper Name
                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "name"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("name")}/>
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("name")}/>
                                                                </span> */}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                              <div className='tableHeadArrowSect'>
                                Style
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '6%' }}>
                              <div className='tableHeadArrowSect' style={{ marginLeft: '5px' }}>
                                Mode
                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "mode"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("mode")} />
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("mode")}/>
                                                                </span> */}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '10%' }}>
                              <div className='tableHeadArrowSect' style={{ marginLeft: '4px' }}>
                                Type
                                {/* <span className={`resrTableSortArrow ${getClassName(
                                                                            "type"
                                                                          )}`}>
                                                                    <img width="10px" alt="" src={UpPolygon} onClick={(e) => sortToggle("type")}/>
                                                                    <img width="10px" alt="" src={Polygon} onClick={(e) => sortToggle("type")}/>
                                                                </span> */}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '10%', cursor: 'pointer' }}>
                              <div className='tableHeadArrowSect' style={{ marginLeft: '-15px' }}>
                                <span
                                  className={`resrTableSortArrow questionPaperArrow ${getClassName('marks')}`}
                                  onClick={(e) => sortToggle('marks')}
                                >
                                  Marks
                                  <div>
                                    <img width='10px' alt='' src={UpPolygon} />
                                    <img width='10px' alt='' src={Polygon} />
                                  </div>
                                </span>
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '25%' }}>
                              <div className='tableHeadArrowSect' style={{ marginLeft: '45px' }}>
                                Status
                                {/* <span className={`resrTableSortArrow activeUpArrow`}>
                                                                    <img width="10px" alt="" src={UpPolygon} />
                                                                    <img width="10px" alt="" src={Polygon} />
                                                                </span> */}
                              </div>
                            </TableCell>
                            <TableCell style={{ width: '100px' }}>
                              <div className='tableHeadArrowSect' style={{ marginLeft: '45px' }}>
                                Actions
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {questionpaperData?.length > 0 ? (
                            questionpaperData?.map((dataList: any, index: any) => {
                              const disableEdit = dataList?.statusID == 5 && dataList?.questionPaperTypeID == 2;
                              const disableAssign = dataList?.statusID != 6 && dataList?.questionPaperTypeID == 2;
                              const disableItems = [];
                              if (disableAssign) {
                                disableItems.push('Assign');
                              }
                              if (disableEdit) {
                                disableItems.push('Edit');
                              }
                              let data = questionpaperstatus?.filter((e: any) => e?.id == dataList?.statusID);
                              let typeName = QuestionPaperType?.filter(
                                (e: any) => e?.id == dataList?.questionPaperTypeID,
                              );
                              let modeName = questionpapermode?.filter((e: any) => e?.id == dataList?.examTypeID);
                              return (
                                <>
                                  <TableRow
                                    style={{ cursor: 'pointer' }}
                                    onClick={(event: any) => {
                                      if (dataList?.questionPaperSetsInfo?.length > 0) {
                                        handleToggle(dataList.id, dataList?.questionPaperSetsInfo, dataList?.isMarksUploaded);
                                        event.stopPropagation();
                                      } else {
                                        // history(`${dataList?.generationModeID === 1 ? '/MIFprintForPreview' : dataList.questionPaperTypeID == 1 ? '/assess/questionpaper/informal-autoflow/printforpreview' : '/assess/questionpaper/formal-autoflow/printforpreview'}`, { state:{ state:false, templateId:dataList?.id ,print:false,questionPaperTypeID:dataList?.questionPaperTypeID,enablebtnPrint:dataList?.questionPaperTypeID== 2 ? (dataList.statusID === 2||dataList.statusID ===6) ? false:true :false,disableBtnPrint:dataList?.questionPaperTypeID== 2 ? (dataList.statusID === 2||dataList.statusID ===6||dataList.statusID ===5) ? true:false :false, editStatus: academicYearData[academicYearDataSelected]?.academicStatusId != 0 ? true : false} })
                                        // qpListHistoryHandler()
                                      }
                                    }}
                                    key={index}
                                  >
                                    <TableCell style={{ width: '70px', textAlign: 'center' }}>
                                      <CheckBoxCompleted
                                        checkLabel='Label'
                                        disable={dataList?.statusID == 5 ? true : false}
                                        checkStatus={tableRowSelected.includes(index)}
                                        onChangeHandler={(e: any) => handleCheck(e, index)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <p
                                        className={`mb-0  ${TableStyles.ellipseText}`}
                                        title={dataList?.name}
                                        dangerouslySetInnerHTML={{ __html: dataList?.name }}
                                      ></p>
                                    </TableCell>
                                    <TableCell>{dataList?.isWorkSheetStyle ? 'Worksheet' : 'Question Paper '}</TableCell>
                                    <TableCell>{modeName[0]?.name}</TableCell>
                                    <TableCell>{typeName[0]?.name}</TableCell>
                                    <TableCell>{dataList?.marks}</TableCell>
                                    <TableCell>
                                      {dataList?.questionPaperSetsInfo?.length > 0 &&
                                      dataList?.questionPaperTypeID == 2 &&
                                      dataList?.statusID == 6 ? (
                                        <ButtonColorComponent
                                          buttonVariant='contained'
                                          borderColor='#FFFFFF !important'
                                          textColor='#01B58A !important'
                                          label={'Approved'}
                                          width='154px'
                                          height='25px'
                                          backgroundColor='rgba(1, 181, 138, 0.1) !important'
                                        />
                                      ) : dataList?.questionPaperSetsInfo == undefined &&
                                        dataList?.questionPaperTypeID == 2 &&
                                        dataList?.statusID == 6 ? (
                                        <ButtonColorComponent
                                          buttonVariant='outlined'
                                          textColor='#01B58A !important'
                                          borderColor='#01B58A !important'
                                          label={'Print'}
                                          width='154px'
                                          height='25px'
                                          backgroundColor=''
                                          onClick={(e: any) => {
                                            (typeof dataList?.questionPaperSetsInfo === 'undefined' ||
                                              (dataList?.questionPaperSetsInfo &&
                                                dataList?.questionPaperSetsInfo?.length === 0)) &&
                                              listPrintHandler(
                                                dataList?.statusID,
                                                dataList.id,
                                                dataList?.generationModeID,
                                                e,
                                                dataList?.questionPaperTypeID,
                                                dataList?.questionPaperTypeID == 2
                                                  ? dataList.statusID === 2 || dataList.statusID === 6
                                                    ? false
                                                    : true
                                                  : false,
                                                dataList?.questionPaperTypeID == 2
                                                  ? dataList.statusID === 2 ||
                                                    dataList.statusID === 6 ||
                                                    dataList.statusID === 5
                                                    ? true
                                                    : false
                                                  : false,
                                              );
                                            qpListHistoryHandler();
                                            setPrintWithAnswer(false);
                                          }}
                                        />
                                      ) : dataList?.statusID == 3 ||
                                        dataList?.statusID == 1 ||
                                        dataList?.statusID == 6 ? (
                                        <ButtonColorComponent
                                          buttonVariant='contained'
                                          borderColor='#FFFFFF !important'
                                          textColor='#01B58A !important'
                                          label={dataList?.statusName}
                                          width='150px'
                                          height='25px'
                                          backgroundColor='rgba(1, 181, 138, 0.1) !important'
                                        />
                                      ) : dataList?.statusID == 7 ? (
                                        <ButtonColorComponent
                                          buttonVariant='outlined'
                                          borderColor='#F95843 !important'
                                          textColor='#F95843 !important'
                                          label={dataList?.statusName}
                                          width='154px'
                                          height='25px'
                                          backgroundColor=''
                                          onClick={(e: any) => {
                                            history(
                                              `${
                                                dataList?.generationModeID === 1
                                                  ? '/MIFprintForPreview'
                                                  : dataList.questionPaperTypeID == 1
                                                  ? '/assess/questionpaper/informal-autoflow/printforpreview'
                                                  : '/assess/questionpaper/formal-autoflow/printforpreview'
                                              }`,
                                              {
                                                state: {
                                                  state: dataList.statusID === 7 ? true : false,
                                                  templateId: dataList?.id,
                                                  print: false,
                                                  questionPaperTypeID: dataList?.questionPaperTypeID,
                                                  enablebtnPrint:
                                                    dataList?.questionPaperTypeID == 2
                                                      ? dataList.statusID === 2 || dataList.statusID === 6
                                                        ? false
                                                        : true
                                                      : false,
                                                  disableBtnPrint:
                                                    dataList?.questionPaperTypeID == 2
                                                      ? dataList.statusID === 2 ||
                                                        dataList.statusID === 6 ||
                                                        dataList.statusID === 5
                                                        ? true
                                                        : false
                                                      : false,
                                                },
                                              },
                                            );
                                            qpListHistoryHandler();
                                            e?.stopPropagation();
                                          }}
                                        />
                                      ) : dataList?.statusID == 5 ? (
                                        <ButtonColorComponent
                                          buttonVariant='contained'
                                          textColor='#F6BC0C !important'
                                          label={dataList?.statusName}
                                          width='154px'
                                          height='25px'
                                          backgroundColor=' #F6BC0C1A !important '
                                        />
                                      ) : (
                                        <ButtonColorComponent
                                          buttonVariant='outlined'
                                          textColor='#01B58A !important'
                                          borderColor='#01B58A !important'
                                          label={dataList?.statusName}
                                          width='154px'
                                          height='25px'
                                          backgroundColor=''
                                          onClick={(e: any) => {
                                            (typeof dataList?.questionPaperSetsInfo === 'undefined' ||
                                              (dataList?.questionPaperSetsInfo &&
                                                dataList?.questionPaperSetsInfo?.length === 0)) &&
                                              listPrintHandler(
                                                dataList?.statusID,
                                                dataList.id,
                                                dataList?.generationModeID,
                                                e,
                                                dataList?.questionPaperTypeID,
                                                dataList?.questionPaperTypeID == 2
                                                  ? dataList.statusID === 2 || dataList.statusID === 6
                                                    ? false
                                                    : true
                                                  : false,
                                                dataList?.questionPaperTypeID == 2
                                                  ? dataList.statusID === 2 ||
                                                    dataList.statusID === 6 ||
                                                    dataList.statusID === 5
                                                    ? true
                                                    : false
                                                  : false,
                                              );
                                            qpListHistoryHandler();
                                          }}
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div
                                        className={`${TableStyles.actionBtnSect} ${
                                          dataList?.questionPaperSetsInfo?.length > 0 ? 'expandIcon' : ''
                                        }`}
                                      >
                                        {dataList?.questionPaperSetsInfo?.length > 0 ? (
                                          <p className='m-0 viewAllSet'>View all Sets</p>
                                        ) : (
                                          <ActionButtonComponent
                                            disableBtn={dataList?.statusID == 5 ? true : false}
                                            approvalEditDisable={
                                              dataList?.statusID == 6 ||
                                              academicYearData[academicYearDataSelected]?.academicStatusId != 0
                                                ? true
                                                : false
                                            }
                                            dataList={dataList}
                                            modalOpen={(param: boolean) => setDeleteModalOpen(param)}
                                            getKeyId={(a: any) => getKeyHandler(a)}
                                            editKey={(e: any) => handleEdit(e)}
                                            duplicateKey={(e) => {
                                              duplicateQuestionPaper(dataList?.id);
                                            }}
                                            isActive={true}
                                            disableKey={disableItems}
                                            setShowAssignQPModal={setShowAssignQPModal}
                                            setQuestionPaperIdToAssign={() => setQuestionPaperIdToAssign(dataList.id)}
                                            showAssignBtn={true}
                                          />
                                        )}
                                        <IconButton
                                          onClick={(event: any) => {
                                            qpListHistoryHandler();
                                            if (dataList?.questionPaperSetsInfo?.length > 0) {
                                              handleToggle(dataList.id, dataList?.questionPaperSetsInfo, dataList?.isMarksUploaded);
                                              event.stopPropagation();
                                            } else {
                                              history(
                                                `${
                                                  dataList?.generationModeID === 1
                                                    ? '/MIFprintForPreview'
                                                    : dataList.questionPaperTypeID == 1
                                                    ? '/assess/questionpaper/informal-autoflow/printforpreview'
                                                    : '/assess/questionpaper/formal-autoflow/printforpreview'
                                                }`,
                                                {
                                                  state: {
                                                    state: false,
                                                    templateId: dataList?.id,
                                                    print: false,
                                                    questionPaperTypeID: dataList?.questionPaperTypeID,
                                                    enablebtnPrint:
                                                      dataList?.questionPaperTypeID == 2
                                                        ? dataList.statusID === 2 || dataList.statusID === 6
                                                          ? false
                                                          : true
                                                        : false,
                                                    disableBtnPrint:
                                                      dataList?.questionPaperTypeID == 2
                                                        ? dataList.statusID === 2 ||
                                                          dataList.statusID === 6 ||
                                                          dataList.statusID === 5
                                                          ? true
                                                          : false
                                                        : false,
                                                    editStatus:
                                                      academicYearData[academicYearDataSelected]?.academicStatusId != 0
                                                        ? true
                                                        : false,
                                                    markStatus: dataList?.isMarksUploaded,
                                                    isSetsAllocated : dataList?.isSetsAllocated
                                                  },
                                                },
                                              );
                                              event.stopPropagation();
                                            }
                                          }}
                                        >
                                          {expanded && multifileID === dataList.id ? (
                                            <Chevrondown />
                                          ) : (
                                            <KeyboardArrowRightIcon />
                                          )}
                                          {/* <KeyboardArrowRightIcon /> */}
                                        </IconButton>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                  {expanded && multifileID === dataList.id && (
                                    <TableRow>
                                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={expanded} timeout='auto' unmountOnExit>
                                          <Box sx={{ margin: 1 }}>
                                            <Table size='small' aria-label='purchases'>
                                              <TableBody>
                                                {subList &&
                                                  subList?.map((historyRow: any, index: number) => {
                                                    let subtypeName = QuestionPaperType?.filter(
                                                      (e: any) => e?.id == historyRow?.questionPaperTypeID,
                                                    );
                                                    return (
                                                      <TableRow
                                                        key={index}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                          previewTemplateDetails(
                                                            dataList.id,
                                                            historyRow?.id,
                                                            'preview',
                                                            historyRow?.name,
                                                            dataList?.isWorkSheetStyle
                                                          );
                                                        }}
                                                      >
                                                        <TableCell
                                                          style={{ width: '70px', textAlign: 'center' }}
                                                          component='th'
                                                        >
                                                          <CheckBoxCompleted
                                                            checkLabel='Label'
                                                            disable={historyRow?.statusID == 5 ? true : false}
                                                            checkStatus={false}
                                                            onChangeHandler={() => {}}
                                                          />
                                                        </TableCell>
                                                        <TableCell style={{ width: '28%' }} component='th' scope='row'>
                                                          <p
                                                            className={`mb-0  ${TableStyles.ellipseText}`}
                                                            title={historyRow?.name}
                                                            dangerouslySetInnerHTML={{ __html: historyRow?.name }}
                                                          ></p>
                                                        </TableCell>
                                                        <TableCell style={{ width: '10%' }} component='th'>{dataList?.isWorkSheetStyle ? 'Worksheet' : 'Question Paper '}</TableCell>
                                                        <TableCell style={{ width: '10%' }} component='th'>
                                                          {modeName[0]?.name}
                                                        </TableCell>
                                                        <TableCell style={{ width: '10%' }} component='th'>
                                                          {subtypeName[0]?.name}
                                                        </TableCell>
                                                        <TableCell style={{ width: '13%' }} component='th'>
                                                          {historyRow.marks}
                                                        </TableCell>

                                                        <TableCell className='listExpandTd' style={{ width: '29%' }}>
                                                          {historyRow?.statusID == 3 ||
                                                          historyRow?.statusID == 1 ||
                                                          historyRow?.statusID == 6 ? (
                                                            <ButtonColorComponent
                                                              buttonVariant='contained'
                                                              textColor='#01B58A !important'
                                                              borderColor='#FFFFFF !important'
                                                              label={historyRow?.statusName}
                                                              width='150px'
                                                              height='25px'
                                                              backgroundColor='rgba(1, 181, 138, 0.1) !important'
                                                            />
                                                          ) : historyRow?.statusID == 7 ? (
                                                            <ButtonColorComponent
                                                              buttonVariant='outlined'
                                                              borderColor='#F95843 !important'
                                                              textColor='#F95843 !important'
                                                              label={historyRow?.statusName}
                                                              width='154px'
                                                              height='25px'
                                                              backgroundColor=''
                                                            />
                                                          ) : historyRow?.statusID == 5 ? (
                                                            <ButtonColorComponent
                                                              buttonVariant='contained'
                                                              borderColor='#F6BC0C !important'
                                                              textColor='#F6BC0C !important'
                                                              label={historyRow?.statusName}
                                                              width='154px'
                                                              height='25px'
                                                              backgroundColor=' #F6BC0C1A !important '
                                                            />
                                                          ) : (
                                                            <ButtonColorComponent
                                                              buttonVariant='outlined'
                                                              textColor='#01B58A !important'
                                                              borderColor='#01B58A !important'
                                                              label={historyRow?.statusName}
                                                              width='154px'
                                                              height='25px'
                                                              backgroundColor=''
                                                              onClick={(e: any) => {
                                                                historyRow?.statusID == 2 &&
                                                                  previewTemplateDetails(
                                                                    dataList.id,
                                                                    historyRow?.id,
                                                                    'print',
                                                                    historyRow?.name,
                                                                    dataList?.isWorkSheetStyle
                                                                  );
                                                                setPrintWithAnswer(false);
                                                                e.stopPropagation();
                                                              }}
                                                            />
                                                          )}
                                                        </TableCell>
                                                        <TableCell style={{ width: '90px' }}>
                                                          <div className={TableStyles.actionBtnSect}>
                                                            <ActionButtonComponent
                                                              disableBtn={historyRow?.statusID == 5 ? true : false}
                                                              approvalEditDisable={
                                                                historyRow?.statusID == 6 ? true : false
                                                              }
                                                              dataList={historyRow}
                                                              modalOpen={(param: boolean) => setDeleteModalOpen(param)}
                                                              getKeyId={(a: any) => qpSetDelHandler(a, dataList.id, dataList.isSetsAllocated)}
                                                              editKey={(e: any) => handleEdit(dataList)}
                                                              duplicateKey={() => {
                                                                duplicateQuestionPaper(dataList.id, historyRow?.id);
                                                              }}
                                                              isActive={true}
                                                              disableKey={['Edit']}
                                                              showAssignBtn={true}
                                                              markUploaded={markUploaded}
                                                            />
                                                            <IconButton>
                                                              <KeyboardArrowRightIcon />
                                                            </IconButton>
                                                          </div>
                                                        </TableCell>
                                                      </TableRow>
                                                    );
                                                  })}
                                              </TableBody>
                                            </Table>
                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  )}

                                  {/* <Modal className='acb' open={showAssignQPModal} onClose={setShowAssignQPModal}>
                                    <div
                                      style={{
                                        backgroundColor: 'white',
                                        height: '85%',
                                        width: '65%',
                                        margin: '30px auto',
                                        overflow: 'auto',
                                        padding: '10px',
                                        borderRadius: '10px',
                                      }}
                                    >
                                      <CreateOnlineQuestionPaperPreview
                                        handleDone={() => setShowAssignQPModal(false)}
                                        classesId=''
                                        courseId=''
                                        staffId=''
                                        dataList={dataList}
                                      />
                                    </div>
                                  </Modal> */}
                                  {showAssignQPModal && questionPaperIdToAssign === dataList.id && (
                                    <CreateOnlineQuestionPaperPreview
                                      handleDone={() => setShowAssignQPModal(false)}
                                      classesId=''
                                      courseId=''
                                      staffId=''
                                      dataList={dataList}
                                      setSpinnerStatus={setSpinnerStatus}
                                      setSnackBar={setSnackBar}
                                      setSnackBarText={setSnackBarText}
                                      setSnackBarSeverity={setSnackBarSeverity}
                                      
                                    />
                                  )}
                                </>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7}>
                                <div className='' style={{ textAlign: 'center' }}>
                                  {'No Match Found'}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <DeleteModalComponent
                    open={deleteModalOpen}
                    onClose={() => {
                      setDeleteModalOpen(false);
                      setBulkDelete(false);
                    }}
                    descriptionText={`${
                      tableRowSelected?.length > 1 && bulkDelete
                        ? `You selected ${tableRowSelected?.length} Question papers which will be deleted from the list,do you wish to continue?`
                        : isSetsAllocated ? 'Selected Question paper will be deleted from the list and the students assigned to the sets will be unassigned in evaluation. Do you wish to continue?' : 'Selected Question paper will be deleted from the list, do you wish to continue?'
                    }`}
                    title={`Delete ${
                      tableRowSelected?.length > 1 && bulkDelete
                        ? tableRowSelected?.length.toString() + ' Question Papers?'
                        : 'Question Paper?'
                    }`}
                    deleteHandler={deleteQuestionHandler}
                  />
                  {tableRowSelected.length > 0 && (
                    <div className={TableStyles.tableFooter}>
                      <h4 className='fontW800 mb-0'>
                        {tableRowSelected.length} Question Paper{tableRowSelected.length > 1 ? 's' : ''} Selected
                      </h4>
                      <ButtonComponent
                        icon={<DeleteIcon />}
                        image={''}
                        textColor='#9A9A9A'
                        backgroundColor='#01B58A'
                          disabled={markUploaded2}
                        buttonSize=''
                        type='transparent'
                        onClick={deleteQuestion}
                        label={`Delete Question Paper${tableRowSelected.length > 1 ? 's' : ''}`}
                        minWidth=''
                        hideBorder={true}
                      />
                    </div>
                  )}
                </div>
                <div
                  className='assessPagenation'
                  style={{ display: 'flex', justifyContent: 'start', paddingTop: '1rem' }}
                >
                  <Pagination
                    count={totalPages}
                    page={pgNo + 1}
                    onChange={(e, p: number) => {
                      setPgNo(p - 1);
                      // setSupportPg(true)
                    }}
                    shape='rounded'
                  />
                </div>
              </>
            )}
          </TabPanel>
          {/* <TabPanel value="2" className="px-0">
                            </TabPanel>
                            <TabPanel value="3" className="px-0">
                            </TabPanel>
                            <TabPanel value="4" className="px-0">
                            </TabPanel> */}
        </TabContext>
      </Box>
      {/* </div> */}
      {/* </div> */}
      {createnewquespaper && (
        <CreateNewQuestionPaperModal
          modalData={modalData}
          onClose={() => setCreatenewquespaper(false)}
          gobackreq={false}
        />
      )}
      {/* {showgoback &&
                <CreateNewQuestionPaperModal modalData={modalDatagoback} onClose={() => {setshowgoBack(false);setCreatenewquespaper(false)}} gobackreq={true}/>
             } */}
      {spinnerStatus && <Spinner />}
      <Toaster
        onClose={() => {
          setSnackBar(false);
        }}
        severity={SnackBarSeverity}
        text={snackBarText}
        snakeBar={snackBar}
      />
      {duplicateEntryOpen && (
        <DuplicateEntryPopup
          open={duplicateEntryOpen}
          onClose={() => setDuplicateEntryOpen(false)}
          duplicateText={(e) => {
            duplicatePostApi(e);
          }}
          saveBtnDisable={saveBtnDisable}
        />
      )}
      {previewTemplateJsonOpen && (
        <QuestionPaperTemplatePreview
          open={previewTemplateJsonOpen}
          handleClose={() => {
            setPreviewTemplateJsonOpen(false);
          }}
          previewJson={previewTemplateJson}
          print={() => {
            setOpenPrintModel(true);
          }}
          type={type}
          qpId={qpId}
          setPrintWithAnswer={setPrintWithAnswer}
          directPrint={() => {
            printQuesion();
          }}
          printConfig={printConfig}
          isWorksheetSet={isWorksheetSet}
          
        />
      )}
      {openPrintModel && (
        <PrintDateFieldModalPopup
          open={openPrintModel}
          onClose={() => setOpenPrintModel(false)}
          questionPaperId={Number(qpId)}
          previewData={previewTemplateJson}
          printedData={(e: any) => setPrintedData(e)}
          setId={qpSetId}
          openPrintwindow={() => {
            setSpinnerStatus(true);
            qpSetId && qpId && previewTemplateDetails(qpId, qpSetId, 'preview', examSubName,isWorksheetSet);
            setTimeout(() => {
              printQuesion();
              setSpinnerStatus(false);
            }, 500);
          }}
          errorMsg={() => {
            setSnackBar(true);
            setSnackBarSeverity('error');
            setSnackBarText(`Something went wrong!`);
            setSpinnerStatus(false);
          }}
        />
      )}
      <div className='preview-eval-hidden'>
        <PrintQuestionPaperTemplate
          ref={componentRef}
          templateFontDetails={templateFontDetails}
          ReqBody={previewTemplateJson}
          replace={undefined}
          replaceQp={undefined}
          templatePrintEdit={undefined}
          previewMode={undefined}
          setAnchorEl={undefined}
          templateJson={undefined}
          changedPopoverValue={undefined}
          setChangedPopoverValue={undefined}
          triggerReqBody={undefined}
          dragPositionHeader={undefined}
          printForPreviewEdit={undefined}
          previewDate={undefined}
          versionHistoryData={versionHistoryData}
          printWithAnswer={printWithAnswer}
          printConfig={printConfig}
          workbookStyle={isWorksheetSet}
        />
      </div>
    </>
  );
};

export default QuestionPaperTable;
