import React,{FC} from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box } from "@mui/system";
import './InformativeIconComponent.css'
import { styled } from "@mui/material/styles";
type Props={
  color:string,
  label:string,
  title:string
}
const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
const InformativeIconComponent:FC<Props>= ({color,label,title}) => {
  return (
            <>
                <Box className="informativeIcon">
                  <HtmlTooltip
                  className="informativeIconTool"
                  arrow
                    title={
                      <React.Fragment>
                        <p dangerouslySetInnerHTML={{ __html: title}} />
                      </React.Fragment>
                    }
                  >
                  <IconButton>
                      <InfoOutlinedIcon sx={{color:`${color}`}}/>
                      {label}
                  </IconButton>
                  </HtmlTooltip>
                </Box>
            </>
  );
};
export default InformativeIconComponent;