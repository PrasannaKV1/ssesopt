import './MIFQuestionPaper.css'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import InputFieldComponent from '../../SharedComponents/InputFieldComponent/InputFieldComponent';
import SelectBoxComponent from '../../SharedComponents/SelectBoxComponent/SelectBoxComponent';
import ButtonComponent from '../../SharedComponents/ButtonComponent/ButtonComponent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckBoxComponent from '../../SharedComponents/CheckBoxComponent/CheckBoxComponent';
import { Avatar, Box, Button, Modal, Tooltip } from '@mui/material';
import PreviewMultiSelectComponent from '../../SharedComponents/PrefixMultiSelectComponent/PrefixMultiSelectComponent';

function createData(
  name: string,
  rollno: string,
  grade: string,
  section: string,
  AssignedSet: string,
) {
  return { name, rollno, grade, section, AssignedSet };
}

const rows = [
  createData('Devon Lane', 'Roll No. 1', 'VII', 'Barbados Cherry', 'Select'),
  createData('Ronald Richards', 'Roll No. 2', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Barbados Cherry', 'Roll No. 3', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Darrell Steward', 'Roll No. 4', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Robert Fox', 'Roll No. 5', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Devon Lane', 'Roll No. 6', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Ronald Richards', 'Roll No. 7', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Darrell Steward', 'Roll No. 4', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Robert Fox', 'Roll No. 5', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Devon Lane', 'Roll No. 6', 'VII', 'Barbados Cherry', 'Set A'),
  createData('Ronald Richards', 'Roll No. 7', 'VII', 'Barbados Cherry', 'Set A'),
];
// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: "763px",
//   height: "507px",
//   bgcolor: "#FFFFFF",
//   borderRadius: "19px",
//   p: 4,
// };

const QuestionPaper18 = () => {

  const [selectedGrade, setSelectedGrade] = React.useState<string[]>([]);
  const handleSelectGrade = (values: string[]) => {
    setSelectedGrade(values);
  };
  const [selectedSection, setSelectedSection] = React.useState<string[]>([]);
  const handleSelectSection = (values: string[]) => {
    setSelectedSection(values);
  };

  const [selectedButton, setSelectedbutton] = React.useState<string[]>([])
  const handlebutton = (values: string[]) => {
    setSelectedbutton(values)
  }

  const btn = ['SET A', 'SET B']
  const grades = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const options = ['1', '2', '3']

  return (
    <>
      <Button onClick={undefined}>Open modal</Button>
      <Modal
        open={true}
        onClose={undefined}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">

        <div className='questionPaper18'>
          <div className='questionPaperheader'>
            <div>
              <h3 className='Paperheader'>Assign Set A to Students</h3>
              <p>Select students you want to assign this question paper to</p>
            </div>
            <div>
              <CloseIcon />
            </div>
          </div>
          <div className='questionPaperheader'>
            <div style={{ width: "164px", height: "40px" }}>
              <InputFieldComponent label={'Search student'} required={false} inputType={"text"} onChange={() => {}} inputSize={"Medium"} variant={"searchIcon"} />
            </div>

            <div style={{ width: "164px", height: "0px" }}>
              <PreviewMultiSelectComponent id="grade" label="Grade: " variant="fill" minwidth="164px" options={grades} prefixLabel="Grade:" selectedValues={selectedGrade} onChange={handleSelectGrade} />
            </div>

            <div style={{ width: "164px", height: "0px" }}>
              <PreviewMultiSelectComponent id="section" label="Section:" variant="fill" minwidth="164px" options={options} prefixLabel="Section: " selectedValues={selectedSection} onChange={handleSelectSection} />
            </div>

            <div>
              <Tooltip className='tooltip' title="Randomly assign different question paper set to students" arrow >
                <div className='button'>
                  <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#9A9A9A"} disabled={false} buttonSize="Medium" type="outlined" onClick={undefined} label="Randomize" minWidth="150" />
                </div>
              </Tooltip>
            </div>
          </div>


          <TableContainer style={{ maxHeight: 450 }}>
            <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right" style={{ width: "390px",fontWeight:"400",fontSize:"14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "0px" }}>
                      <CheckBoxComponent checkLabel={''} disable={false} onChangeHandler={undefined} checkStatus={false} />
                      NAME & ROLL NO
                    </div>
                  </TableCell>
                  <TableCell align="left" style={{fontWeight:"400",fontSize:"14px" }}>GRADE</TableCell>
                  <TableCell align="left" style={{fontWeight:"400",fontSize:"14px" }}>SECTION</TableCell>
                  <TableCell align="left" style={{fontWeight:"400",fontSize:"14px" }}>AssignedSet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {rows.map((row) => (
                  <TableRow >
                    <TableCell align="right">
                      <div style={{ display: "flex", gap: "10px", marginLeft: "0px" }}>
                        <div style={{ display: "flex", gap: "7px" }}>
                          <CheckBoxComponent checkLabel={''} disable={false} onChangeHandler={undefined} checkStatus={false} />
                          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </div>
                        <div>
                          <div style={{ color: '#1B1C1E' }}> {row.name}</div>
                          <div style={{ textAlign: "left", color: '#9A9A9A' }}>{row.rollno}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">{row.grade}</TableCell>
                    <TableCell align="left">{row.section}</TableCell>
                    <TableCell align="left">
                      <div className="selectcontainer">
                        <SelectBoxComponent variant={'fill'} selectedValue={''} clickHandler={handlebutton} selectLabel={row.AssignedSet} selectList={btn} mandatory={false} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className='footerdiv'>
            <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#01B58A"} disabled={false} buttonSize="Medium" type="outlined" onClick={() => alert('aman')} label="Cancel" minWidth="201" />
            <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#01B58A"} disabled={false} buttonSize="Medium" type="contained" onClick={() => alert('aman')} label="Assign To All" minWidth="201" />
            <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#01B58A"} disabled={true} buttonSize="Medium" type="contained" onClick={() => alert('aman')} label="Assign" minWidth="201" />
          </div>
        </div>
      </Modal>
    </>

  )
}

export default QuestionPaper18