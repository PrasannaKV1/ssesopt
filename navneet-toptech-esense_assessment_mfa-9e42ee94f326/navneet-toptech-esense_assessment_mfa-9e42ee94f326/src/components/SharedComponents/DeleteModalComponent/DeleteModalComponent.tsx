import React from "react";
import { Typography, Modal, Button } from "@mui/material";
import closeIcon from "../../../assets/images/closeIcon.svg";
import deleteIcon from "../../../assets/images/delete.svg";
import './DeleteModalComponent.css';
import ButtonComponent from "../ButtonComponent/ButtonComponent";
interface Props {
  open: boolean;
  descriptionText: string;
  title: string;
  onClose: () => void;
  deleteHandler: any
  lables?: any,
  subText?: string;
}
const DeleteModalComponent: React.FC<Props> = ({ open, lables, onClose, descriptionText, title, deleteHandler, subText }) => {

  const deleteLabel = lables?.Delete || "Delete";
  const cancelLabel = lables?.Cancel || "Cancel";

  const handleDeleteClick = () => {
    deleteHandler()
  }
  return (
    <>
      <Modal
        className="deleteModalPopover"
        open={open} onClose={onClose}
      >
        <div className="deleteModalPopoverBody">
          <div className="deleteModalPopoverBodyPadd">
            <div className="d-flex justify-content-center mb-2">
              <img src={deleteIcon} width="52px" className="text-center" />
            </div>

            <div className="closeDeleteIcon" onClick={onClose}>
              <img src={closeIcon} style={{ width: "16px" }} />
            </div>
            <div className="text-center">
              <Typography variant="h2" className="w-100 deleteModalHead">
                {title}
              </Typography>
            </div>

            <Typography className="deleteModalDesc text-center" variant="h4">
              {descriptionText}
            </Typography>
            <Typography className="deleteModalDesc text-center" variant="h4">
              {subText}
            </Typography>

            <div className="deleteModalActionBtn">
              <ButtonComponent icon={""} image={""} textColor="#fff" backgroundColor="#F95843" disabled={false} buttonSize="Large" type="contained" onClick={handleDeleteClick} label={deleteLabel} minWidth="200" />
              <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#9A9A9A"} disabled={false} buttonSize="Large" type="outlined" onClick={onClose} label={cancelLabel} minWidth="200" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteModalComponent;
