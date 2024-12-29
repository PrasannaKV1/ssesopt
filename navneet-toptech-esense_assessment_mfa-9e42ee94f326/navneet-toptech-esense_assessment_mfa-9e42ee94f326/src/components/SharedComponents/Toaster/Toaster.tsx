import { IconButton, Snackbar } from "@mui/material";
import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { CloseIcon } from "@esense/wrapper";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
    onClose: () => void;
    severity: any;
    text: string;
    snakeBar: boolean
};

const Toaster: React.FC<Props> = ({ onClose, severity, text, snakeBar }) => {
    const action = (
        <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit">
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <>
            <Snackbar
                open={snakeBar}
                autoHideDuration={2000}
                onClose={onClose}
                action={action}
            >
                <Alert
                    onClose={onClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                >
                    {text}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Toaster;
