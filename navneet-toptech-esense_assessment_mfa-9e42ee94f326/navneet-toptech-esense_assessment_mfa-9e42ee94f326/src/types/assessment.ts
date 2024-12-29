export interface State {
    tenant: {
      tenantId: string;
      instituteName: string;
    };
    login: {
      userData: {
        userId: number;
        UserRoleID: number;
        profilePhoto: string;
        userRefId: number
      };
    };
    currentAcademic:{
      acadamicId: number,
      startDate: Date,
      endDate: Date
    }
  }
  export interface LocalStorageState {
    onboardingAction: {
      tenant: {
        tenantId: string;
        instituteName: string;
      };
    },
    tenant: {
      tenantId: string
    }
  }