import { Typography } from "@mui/material";
import React, { useEffect } from "react";

import './bulkUploadMessage.css';
import { TICKER } from "../Utils/EvaluationAssets";

type Props = {
    openPopover: boolean;
    message: string;
    onClose: any;
};

const BulkUploadSuccess: React.FC<Props> = ({ openPopover, message, onClose }) => {
    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 2000);

    }, []);
    return (
        <div className="deleteMsgPopover">
            <div className="deleteMsgPopoverSect">
                <span data-testid="delete-icon">
                    <img src={TICKER} alt="Course Edit" />
                </span>
                <Typography variant="h5">{message}</Typography>
            </div>
        </div>
    );
};

export default BulkUploadSuccess;
