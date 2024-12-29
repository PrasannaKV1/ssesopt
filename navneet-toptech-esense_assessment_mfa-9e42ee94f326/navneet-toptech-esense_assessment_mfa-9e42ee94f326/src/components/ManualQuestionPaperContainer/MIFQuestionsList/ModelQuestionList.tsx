import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import closeIcon from '../../../assets/images/closeIcon.svg'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    bgcolor: 'background.paper',
    border: '2px solid grey',
    boxShadow: 24,
    p: 4,

};

type Props = {
    handleOpen: any;
    handleClose: any;
    selectedData: any;
    getQuestionTitle: any
};

const TransitionsModal: React.FC<Props> = ({ handleOpen, handleClose, selectedData, getQuestionTitle }) => {
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={handleOpen}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Box sx={style}>
                <img src={closeIcon} alt="closeIcon" onClick={handleClose}  style={{marginTop: "-17px",marginLeft: "96%",cursor:'pointer'}}/>
                    {selectedData?.length > 0 &&
                        <TableContainer sx={{ marginTop: '10px', border: "1px solid #DEDEDE", maxHeight: "75vH" }} >
                            <Table stickyHeader>
                                <TableHead >
                                    <TableRow>
                                        <TableCell >
                                            <div className="tableheaddata">
                                                question
                                            </div>
                                        </TableCell>
                                        <TableCell >
                                            <div className="tableheaddata">
                                                created by
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {selectedData?.map((data: any) => (
                                        <TableRow>
                                            <TableCell>
                                                <div className='tableDataQuestion' style={{ height: '38px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ flex: '1', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                                                        <div dangerouslySetInnerHTML={{ __html: getQuestionTitle(data) }}></div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className='tableDataCreatedBy'>
                                                    {data.createdByUser}
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))}

                                </TableBody>

                            </Table>
                        </TableContainer>

                    }
                </Box>
            </Modal>
        </div>
    );
}

export default TransitionsModal;
