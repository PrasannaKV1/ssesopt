import React, {FC} from 'react'
import Modal from '@mui/material/Modal'
import {Box, Container} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ButtonComponent from '../../../SharedComponents/ButtonComponent/ButtonComponent';
import {Typography} from '@material-ui/core'
import Divider from '@mui/material/Divider'
import "./PreviewModalImage.css"

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  height: '600px',
  background: '#FFFFFF',
  borderRadius: '12px',
  p: 4,
}

type Props = {
  header: string
  openPreview: boolean
  setOpenPreview: (e: boolean) => void
  setContent: (e: string) => void
  content: string
}

const PreviewModalImage: FC<Props> = ({
  header,
  openPreview,
  setOpenPreview,
  setContent,
  content,
}) => {
  const handleClose = () => {
    setOpenPreview(false)
    setContent('')
  }

  return (
    <div>
      <Modal open={openPreview} onClose={handleClose}>
        <Container className='imagePreviewModal' sx={style}>
          <div className='alignHeader'>
            <Box style={{width: '100%'}}>
              <Typography id='modal-modal-title'>Image</Typography>
            </Box>
            <Box>
              <CloseIcon style={{cursor: 'pointer',position:"absolute",right:"20px"}} onClick={handleClose} />
            </Box>
          </div>
          <br />
          <Divider className='divider' />
          <div className='previewQuestionScroll previewImgScrollSect' style={{display: 'flex', justifyContent:'center', alignItems:'center', height: '400px'}}>
            <Box sx={{marginTop: '25px'}}>
              <div dangerouslySetInnerHTML={{__html: content}} />
            </Box>
          </div>
          <Divider className="divider" />
          <Box className="d-flex justify-content-end mt-4">
              <ButtonComponent type="outlined" buttonSize="Medium" label="Back" onClick={handleClose}
                  textColor="black" minWidth="150" backgroundColor="#01B58A"
              />
          </Box>
        </Container>
      </Modal>
    </div>
  )
}

export default PreviewModalImage