import React, { useState, useEffect, useRef, useContext } from "react";
import WebViewer from '@pdftron/webviewer'
import WebViewerContext from "../../../../context/webviewwer";

type Props = {
  cLink: any,
  renderPath: any,
}

const ReadPpt: React.FC<Props> = ({ cLink, renderPath }) => {


  const { setInstance } = useContext<any>(WebViewerContext);

  const viewer = useRef<any>(null);

  useEffect(() => {
    WebViewer(
      {
        path: '/assess/pdftron',
        initialDoc: cLink,
        disabledElements: [
          'searchButton',
          'panToolButton',
          'selectToolButton',
          "toolsButton"
        ],
        isReadOnly: true,
        extension: 'pptx',
        uiPath: renderPath,
        enableAnnotations: false,
        enableViewStateAnnotations: false
      },
      viewer?.current,
    ).then((instance) => {
      setInstance(instance);
      const { documentViewer, annotationManager, Tools } = instance.Core;
      let FitMode = instance.UI.FitMode;
      Tools.Tool.ENABLE_TEXT_SELECTION = false;
      instance.UI.setFitMode(FitMode.FitWidth);
      instance.UI.disableElements(['printButton', "downloadButton"]);
      instance.UI.toggleElementVisibility('leftPanel');
      instance.UI.disableElements(['documentControl', 'leftPanelTabs', 'thumbnailsSizeSlider']);

      documentViewer?.addEventListener('annotationsLoaded', () => {
        const annots = annotationManager?.getAnnotationsList();
        annotationManager?.deleteAnnotations(annots, { force: true });
      });

    });
  }, [])

  return (
    <>
      <div className="MyComponent">
        <div className="webviewer" ref={viewer} style={{ height: "100vh" }} data-testid="ppt-view"></div>
      </div>
    </>
  )
}

export default ReadPpt;