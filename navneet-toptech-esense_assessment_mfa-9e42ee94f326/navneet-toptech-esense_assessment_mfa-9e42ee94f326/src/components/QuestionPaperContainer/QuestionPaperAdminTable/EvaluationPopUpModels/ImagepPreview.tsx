import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton } from '@mui/material';
import { PDF_ICON } from "../Utils/EvaluationAssets";

interface ImagePreviewProps {
  image: File;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  const imageUrl = URL.createObjectURL(image);
  const isPDF = image.type === "application/pdf";

  return (
    <Box
      width={100}
      height={100}
      m={2}
      position="relative"
      marginRight={0}
      style={{ flex: '0 0 auto' }} // Ensure each box maintains fixed size
    >
      {isPDF ? (
        <img src={PDF_ICON} alt="PDF Icon" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <IconButton
        aria-label="remove"
        onClick={onRemove}
        style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }} // Positioning the icon at the right side
      >
        <CancelIcon />
      </IconButton>
    </Box>
  );
};

export default ImagePreview;
