import React from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Tooltip, Select, MenuItem, OutlinedInput, SelectChangeEvent } from '@mui/material';

interface MarksBreakupTableProps {
  tableData: any[]; // Replace 'any' with your specific type
  isEditMode: boolean;
  isReport?: boolean;
  handleChangeMarks?: (e: React.ChangeEvent<HTMLInputElement>, index: number, item: any) => void; // Adjust 'any' to your specific item type, make it optional
  handleMultiSelectChange?: (e: SelectChangeEvent<{ value: unknown }>, index: number, item: any) => void; // Adjust 'any' to your specific item type, make it optional
}

const MarksBreakupTable: React.FC<MarksBreakupTableProps> = ({ tableData, isEditMode, handleChangeMarks, handleMultiSelectChange, isReport }) => {
  
  const handleMarksChange = (e: any, itemIndex: number) => {
    if (handleChangeMarks) {
      handleChangeMarks(e, itemIndex, tableData[itemIndex]);
    }
  };
  const getMaxLength = (actualMarks: any) => {
    return actualMarks <= 9 ? 3 : 4;
  };

  return (
    <div className="inner-container-main-div">
      {!isReport && isReport === undefined && <div style={{ fontWeight: "700", fontSize: "18px" }}>
        Marks Breakup & Analytics
      </div>}
      <div className="student-mark-table">
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {tableData[0]?.part !== '' && <TableCell>
                  <div className='tableHeadArrowSect'>
                    <span>PART</span>
                  </div>
                </TableCell>}
                {tableData[0]?.section !== '' && <TableCell>
                  <div className='tableHeadArrowSect'>
                    <span>SECTION</span>
                  </div>
                </TableCell>}
                {tableData[0]?.questionNo !== '' && <TableCell>
                  <div className='tableHeadArrowSect'>
                    <span>MAIN QUESTION NO.</span>
                  </div>
                </TableCell>}
                <TableCell sx={tableData[0]?.section !== '' ? { width: "250px" } : {}}>
                  <div className='tableHeadArrowSect'>
                    <span>QUESTION NO.</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='tableHeadArrowSect'>
                    <span>MARKS</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='tableHeadArrowSect'>
                    <span>ERROR</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ background: "#fff" }}>
              {tableData.length && tableData.map((item: any, index: any) => {
                const errors = item?.error ? item?.error?.filter((err: any) => err.isSelected && err.error.trim() !== '')?.map((err: any) => err?.error?.trim()) : [];
                const displayError = errors?.length > 0 ? errors[0] : '';
                const remainingErrorsCount = errors?.length > 1 ? errors.length - 1 : 0;
                return (
                  <TableRow key={index}>
                    {tableData[0]?.part !== '' && <TableCell>{item?.part}</TableCell>}
                    {tableData[0]?.section !== '' && <TableCell>{item?.section}</TableCell>}
                    {tableData[0]?.questionNo !== '' && <TableCell>{item?.questionNo}</TableCell>}
                    <TableCell>{item?.subQuestionNo}</TableCell>
                    <TableCell>
                    <input
                      type="text"
                      value={item.obtainedMarks}
                      onChange={(e) => {
                        let inputValue: any = e.target.value.replace(/[^0-9.]/g, '');
                        const maxLength = getMaxLength(item.actualMarks);
                        if (inputValue.length > maxLength) {
                          inputValue = inputValue.slice(0, maxLength);
                        }
                        const [integerPart, decimalPart] = inputValue.split('.');
                        if (decimalPart && decimalPart.length > 1) {
                          inputValue = `${integerPart}.${decimalPart.slice(0, 1)}`;
                        }
                        // const value = e.target.value.slice(0, 3);
                        handleMarksChange({ ...e, target: { ...e.target, value: inputValue } }, index);
                      }}
                      disabled={!isEditMode}
                      style={{ width: "30px" }}
                    />
                      <span> / {parseFloat(item.actualMarks).toFixed(0)}</span>
                      </TableCell>
                    {!isEditMode ? (
                      <TableCell>
                        <Tooltip
                          title={
                            <React.Fragment>
                              {errors.map((err: any, errIndex: any) => (
                                <div key={errIndex}>{err}</div>
                              ))}
                            </React.Fragment>
                          }
                        >
                          <div>
                            {displayError} {remainingErrorsCount > 0 && `...+${remainingErrorsCount}`}
                          </div>
                        </Tooltip>
                      </TableCell>
                    ) :
                      <TableCell>
                        <div className="evaluation-select-box">
                          <Select
                            key={index}
                            labelId={`error-select-label-${index}`}
                            id={`error-select-${index}`}
                            multiple
                            value={item?.error?.filter((error: any) => error.isSelected).map((error: any) => error.errorId)}
                            sx={{ minWidth: 250 }}
                            onChange={(e: any) => handleMultiSelectChange && handleMultiSelectChange(e, index, item)}
                            input={<OutlinedInput label="Errors" />}
                            disabled={item?.error?.length === 0}
                            MenuProps={{ className: "evaluation-select-menuItem" }}
                            renderValue={(selected: any) => {
                              if (selected.length === 0) {
                                return '';
                              }
                              const selectedError = item?.error?.find((error: any) => error.errorId === selected[0]);
                              return `${selectedError.error} ${selected.length > 1 ? `...+${selected.length - 1} ` : ''}`;
                            }}
                          >
                            {item?.error?.map((error: any, errorIndex: number) => (
                              <MenuItem key={errorIndex} value={error.errorId}>
                                {error.error}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      </TableCell>}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MarksBreakupTable;
