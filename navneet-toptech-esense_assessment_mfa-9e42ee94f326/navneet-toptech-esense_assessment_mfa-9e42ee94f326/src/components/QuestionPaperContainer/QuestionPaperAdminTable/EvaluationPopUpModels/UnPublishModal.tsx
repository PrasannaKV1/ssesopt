import React from "react";
import { Typography, Modal, Button } from "@mui/material";
import closeIcon from "../../../../assets/images/closeIcon.svg";
import red_info_icon from "../../../../assets/images/red_info_icon.svg";
import './UnPublishModal.css';
import ButtonComponent from "../../../SharedComponents/ButtonComponent/ButtonComponent";

interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    deleteHandler: any;
    SubTitle1?: any;
    SubTitle2: any;
    btnlabel?: any;
}
const UnPublishModal: React.FC<Props> = ({ open, onClose, title, deleteHandler, SubTitle1, SubTitle2, btnlabel }) => {

    const handleDeleteClick = () => {
        deleteHandler()
    }
    return (
        <>
            <Modal
                className="UnPublishModalPopover"
                open={open} onClose={onClose}
            >
                <div className="UnPublishModalPopoverBody">
                    <div className="UnPublishModalPopoverBodyPadd">
                        <div className="d-flex justify-content-center mb-2">
                            <img src={red_info_icon} width="52px" className="text-center" />
                        </div>
                        <div className="closeDeleteIcon" onClick={onClose}>
                            <img src={closeIcon} style={{ width: "16px" }} />
                        </div>
                        <div className="text-center">
                            <Typography variant="h2" className="w-100 UnPublishModalHead">
                                {title}
                            </Typography>
                        </div>

                        <Typography className="UnPublishModalDesc text-center" variant="h4">
                            {SubTitle1}

                            <span>

                                {SubTitle2}

                            </span>
                        </Typography>
                        <div className="UnPublishModalActionBtn">
                            <ButtonComponent icon={""} image={""} textColor="#fff" backgroundColor="#01B58A" disabled={false} buttonSize="Large" type="contained" onClick={handleDeleteClick} label={btnlabel} minWidth="200" />
                            <ButtonComponent icon={""} image={""} textColor="#1B1C1E" backgroundColor={"#9A9A9A"} disabled={false} buttonSize="Large" type="outlined" onClick={onClose} label={"cancel"} minWidth="200" />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UnPublishModal;
