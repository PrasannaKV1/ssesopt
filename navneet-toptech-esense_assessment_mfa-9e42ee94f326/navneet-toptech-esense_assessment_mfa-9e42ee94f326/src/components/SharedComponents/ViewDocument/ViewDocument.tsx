import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styles from './ViewDocument.module.css';
import CloseIcon from "@mui/icons-material/Close";
import ReadPdftron from "./ReadPdftron/ReadPdftron"
import ReadPdf from './ReadPdf/ReadPdf';
import WebViewerContext from '../../../context/webviewwer';
import ReadPpt from './ReadPpt/ReadPpt';
import './FileViewer.css'

type Props = {
    open: boolean,
    viewFileURL: any,
    viewFileExtension: any,
    handleClose: () => void,
    fileName?: any
    fileType?:any
    fileURL?:any
}

const ViewDocument: React.FC<Props> = ({ open, handleClose, viewFileURL, viewFileExtension, fileName, fileType, fileURL }) => {
  
    const [openModal, setOpenModal] = React.useState(open);
    const [instance, setInstance] = React.useState();
    const closePopup = () => {
        handleClose()
    }

    return (
      <div>
        <Modal open={openModal} onClose={closePopup} className="classResPeviewPopup">
          <Box className={`classResPeviewPopupWrapper file_pop_m ${fileType == "image" ? "img" : ""}`}>
            <div className="classResPrevCloseIcon"> <CloseIcon onClick={closePopup} /> </div>
            <div className="classResPrevSect">

            {(viewFileExtension === "doc" || viewFileExtension === "docx" || viewFileExtension === "document") &&
                <WebViewerContext.Provider value={{ instance, setInstance }}>
                  <ReadPdftron cLink={viewFileURL} renderPath={"./ui/index.html"} />
                </WebViewerContext.Provider>
            }

            {(viewFileExtension === "pdf" || viewFileExtension === "PDF") &&
                <WebViewerContext.Provider value={{ instance, setInstance }}>
                  <ReadPdf cLink={viewFileURL} renderPath={"./ui/index.html"} />
                </WebViewerContext.Provider>
            }

            {viewFileExtension == "presentation" && viewFileURL ?
              <WebViewerContext.Provider value={{ instance, setInstance }}>
                <ReadPpt cLink={viewFileURL} renderPath={"./ui/index.html"} />
              </WebViewerContext.Provider>
              : ''
            }

            {(viewFileExtension === "png" || viewFileExtension === "JPEG" || viewFileExtension === "jpg" || viewFileExtension === "JPG" || viewFileExtension === "jpeg") &&
              <div className="img-container">
                <img src={viewFileURL} alt="" className={styles.imagePreview} />
              </div>
            }

            </div>
          </Box>
        </Modal>
      </div>
    )
}

export default ViewDocument