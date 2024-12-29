import React, { useState, useEffect, useRef, useContext } from "react";
import WebViewer from '@pdftron/webviewer'
import WebViewerContext from "../../../../context/webviewwer";

type Props = {
  cLink: any,
  renderPath: any,
}
const ReadPdftron: React.FC<Props> = ({ cLink, renderPath }) => {


  const  { setInstance }  = useContext<any>(WebViewerContext); 

  const viewer = useRef<any>(null);
  
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    WebViewer(
      {
        path: '/assess/pdftron',
        initialDoc: cLink,
        disabledElements: [
          'leftPanel',
          'searchButton',
          'panToolButton',
          'selectToolButton',
          "toolsButton"
        ],
        isReadOnly: true,
        extension: 'docx',
        uiPath: renderPath,
        enableAnnotations: false,
        enableViewStateAnnotations: false
      },
      viewer?.current,
    ).then((instance: any) => {
      setInstance(instance);
      instance.UI.disableElements(["menuButton", "leftPanelButton", "viewControlsButton", 'printButton' , "downloadButton"]);
      const { documentViewer, annotationManager, Tools } = instance.Core;
      var FitMode = instance.UI.FitMode;
      Tools.Tool.ENABLE_TEXT_SELECTION = false;
      instance.UI.setFitMode(FitMode.FitWidth);

      documentViewer?.addEventListener('annotationsLoaded', () => {
        const annots = annotationManager?.getAnnotationsList();
        annotationManager?.deleteAnnotations(annots, { force: true });
      });
      // you can now call WebViewer APIs here...
    });
  }, [])

  return (
    <>
      <div className="MyComponent">
        <div className="webviewer" ref={viewer} style={{ height: "100vh" }} data-testid="pdf-view"></div>
      </div>
    </>
  )
}

export default ReadPdftron;