/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SideNavigationBar , ThemeProvider } from '@esense/wrapper';
import { FeeAllocationStyleRoot } from './FeeAllocationLayoutStyle';
import SocketContext from '../constants/socket';
import { themeConfig as feetheme } from '../theme';
import { accessRights, getLocalStorageDataBasedOnKey } from '../constants/helper';
import { State } from '../types/assessment';
interface Props {
  children: React.ReactNode;
}

export const FeeAllocationLayout: React.FC<Props> = (props: Props) => {
  const socket = React.useContext(SocketContext);
  const [notifyCount, setNotifyCount] = useState<number>(0);
  const [socketData, setsocketData] = useState<any[]>([]);
  const stateDetails = JSON.parse(getLocalStorageDataBasedOnKey('state') as string) as State;
  const { userId } = stateDetails.login.userData;
  const { tenantId } = stateDetails.tenant;

  useEffect(() => {
    socket.on('notification_count', (response: any) => {setNotifyCount(response);});
    socket.emit('reminder', userId, tenantId);
    socket.emit('reminder_canlendarID', userId, tenantId);
    // socket.on("reminder", (response: any) => {// });
    socket.on('reminder_canlendarID', (response: any) => setsocketData(response?.map((d: any) => d?.toString()).join(',')));
    socket.on('error_handler', () => {socket.emit('reminder', userId, tenantId);});
  }, [socket]);

  useEffect(() => {
    accessRights();
  }, []);

  const navigate = useNavigate();
  const handleItemClick = (route: string) => {
    navigate(route);
  };

  const sideNavProps = {
    callBackFunction: handleItemClick,
    notifyCount,
    setNotifyCount,
    socketData,
    reportsBaseURL: process.env.REACT_APP_TEACHER_API_BASE_URL,
    notificationsBaseURL: `${process.env.REACT_APP_LIBRARY_API_BASE_URL}library/`,
    feeManagementBaseURL: process.env.REACT_APP_API_BASE_URL,
    admBaseUrl: process.env.REACT_APP_BASE_URL,
    fileBaseUrl: process.env.REACT_APP_FILE_URL,
    isOnline: process.env.REACT_APP_IS_ONLINE === '1',
    classesBaseUrl: process.env.REACT_APP_GRADE_URL
  };
  return (
    <>
      <ThemeProvider theme={feetheme}>
        <FeeAllocationStyleRoot>
          <div className="rootDiv m-0 pb-0 m-auto">
            <div className="sideBarDiv">
              <SideNavigationBar feeManagementPopoverProps={sideNavProps} />
            </div>
            <div className="contentDiv">{props.children}</div>
          </div>
        </FeeAllocationStyleRoot>
      </ThemeProvider>
    </>
  );
};

export default FeeAllocationLayout;
