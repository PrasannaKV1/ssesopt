import React, { useState } from 'react';
import './AdminQuestionPaperTable.css';
import TabList from '@mui/lab/TabList';
import styles from "../../AssessmentsContainer/AssessmentsContainer.module.css";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Box from '@mui/material/Box';
import InputFieldComponent from "../../SharedComponents/InputFieldComponent/InputFieldComponent";
import PrefixMultipleSelect from "../../SharedComponents/PrefixMultiSelectComponent/PrefixMultiSelectComponent";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import UpPolygon from "../../../assets/images/UpPolygon.svg";
import Polygon from "../../../assets/images/Polygon.svg";
import { TableBody } from '@mui/material';
import ButtonColorComponent from '../../SharedComponents/ButtonColorComponent/ButtonColorComponent';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Pagination } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import { adminQuesPapTabElement } from '../../../constants/urls';


const adminquesPaperTableData = [
  { title: "Term 1 science question paper (Set 1)", createdBy: ["Tr. Swati Jadhav"], grade: "I", subject: "Social Science", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper (Set 2)", createdBy: ["Tr. Swati Jadhav"], grade: "I", subject: "Social Science", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Sripad Rai"], grade: "III", subject: "Math", status: ["Rejected"] },
  { title: "Term 1 science question paper (Set 1)", createdBy: ["Tr. Swati Jadhav"], grade: "IV", subject: "Geography", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper (Set 2)", createdBy: ["Tr. Swati Jadhav", "Tr. Rahul Gupta", "yashwanth"], grade: "IV", subject: "Math", status: ["Rejected"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Rahul Gupta"], grade: "LKG", subject: "Social Science", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Sripad Rai"], grade: "UKG", subject: "Biology", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Rahul Gupta"], grade: "Lower KG", subject: "Math", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Rahul Gupta"], grade: "x", subject: "Social Science", status: ["Approve", "Reject"] },
  { title: "Term 1 science question paper", createdBy: ["Tr. Rahul Gupta", "Tr. Rahul Gupta", "yashwanth","Aman"], grade: "X", subject: "Social Science", status: ["Approve", "Reject"] },
]

const AdminQuestionPaperTable = () => {
  const [value, setValue] = useState<string>('3');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectStatus, setSelectedStatus] = React.useState<string[]>([]);

  const handleStatus = (values:string[]) =>{
    setSelectedStatus(values)
  }

  const statusOpt = ["Set A", "Set B"];

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  };


  return (
    <div className='questionPaperAdminTabContain'>
      <p className="quesPapAdminHeader">Question Papers</p>
      <Box className={`${styles.assessmentTabPadd} assessmentTabStyling mt-4`} sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 0, borderColor: 'none', display: "flex", justifyContent: "space-between" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {adminQuesPapTabElement.map((tab:any, index:number) => <Tab key={index} label={tab.label} value={`${index + 1}`} />)}
            </TabList>
            <div className="adminQuePapInputField" style={{ display: "flex", gap: "30px" }}>
              <InputFieldComponent label={'Search Question Papers..'} required={false} inputType={"text"} onChange={handleChange} inputSize={"Medium"} variant={"searchIcon"} />
              <PrefixMultipleSelect id="Status" label="Status:" variant="fill" minwidth="164px" options={statusOpt} prefixLabel="Status:" selectedValues={selectStatus} onChange={handleStatus} />
            </div>
          </Box>
          <TabPanel value="1" className="px-0"></TabPanel>
          <TabPanel value="2" className="px-0"></TabPanel>
          <TabPanel value="3" className="px-0">
            <div className='adminquesPapTableSect'>
              <TableContainer className="assessmentTableSect">
                <Table sx={{ width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "30%" }}>
                        <div className='tableHeadArrowSect'>
                          Question Paper Title
                          <span className={`resrTableSortArrow activeUpArrow`}>
                            <img width="10px" alt="" src={UpPolygon} />
                            <img width="10px" alt="" src={Polygon} />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "18%" }}>
                        <div className='tableHeadArrowSect'>
                          Created By
                          <span className={`resrTableSortArrow activeUpArrow`}>
                            <img width="10px" alt="" src={UpPolygon} />
                            <img width="10px" alt="" src={Polygon} />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "13%" }} >
                        <div className='tableHeadArrowSect'>
                          Grade
                          <span className={`resrTableSortArrow activeUpArrow`}>
                            <img width="10px" alt="" src={UpPolygon} />
                            <img width="10px" alt="" src={Polygon} />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "18%" }}>
                        <div className='tableHeadArrowSect'>
                          Subject
                          <span className={`resrTableSortArrow activeUpArrow`}>
                            <img width="10px" alt="" src={UpPolygon} />
                            <img width="10px" alt="" src={Polygon} />
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ width: "5%" }}>
                        <div className='tableHeadArrowSect'>
                          Status
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {adminquesPaperTableData?.map((data: any, index: any) => (
                      <TableRow style={{ cursor: "pointer" }} onClick={() => { }} key={index}>
                        <TableCell>{data?.title}</TableCell>
                        <TableCell>{data?.createdBy.length > 1 ? <>  {data?.createdBy[0]} <span className="createdByStyling"> + {(data?.createdBy?.length - 1)} </span> </> : data.createdBy}</TableCell>
                        <TableCell>{data?.grade}</TableCell>
                        <TableCell>{data?.subject}</TableCell>
                        <TableCell sx={{ display: "flex", gap: "10px" }}>
                          {data?.status.length > 0 && data?.status.map((stat: any) => (
                            (stat == "Approve") ?
                              <ButtonColorComponent buttonVariant="outlined" textColor='#01B58A' label={stat} width="71px" height="24px" backgroundColor="#FFFFF" /> :
                              (stat == "Reject") ?
                                <ButtonColorComponent buttonVariant="outlined" textColor='#D85564' label={stat} width="71px" height="24px" backgroundColor="#FFFFF" /> :
                                (stat == "Rejected") ?
                                  <ButtonColorComponent buttonVariant="contained" textColor='#D85564' label={stat} width="71px" height="24px" backgroundColor=" #FEEEEC" /> : ''
                          ))}
                        </TableCell>
                        <TableCell ><KeyboardArrowRightIcon sx={{ color: "#9A9A9A", width: "25px", marginLeft: "6px" }} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Pagination
              className="assessPagenation" style={{ padding: "15px 5px" }} count={10} shape="rounded" page={pageNumber} onChange={(e, p: number) => { setPageNumber(p) }} />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default AdminQuestionPaperTable;