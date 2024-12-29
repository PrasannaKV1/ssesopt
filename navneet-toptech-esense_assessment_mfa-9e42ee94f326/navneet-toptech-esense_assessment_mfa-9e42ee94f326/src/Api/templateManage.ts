import { TemplateAPI } from ".";


export const getTemplateData = async (obj: any) => {
    try {
      const res = await TemplateAPI.post(`template-management/template`, obj);
      if (res?.status === 200 || res?.status === 201) {
        return res.data;
      }
      return {};
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  export const getPreviewTemplate = async (id:number) =>{
    try {
        const res = await TemplateAPI.get(`template-management/templateData/${id}`);
        if (res.status === 200 || res.status === 201) {
            return res.data
        }
        return {}
    }
    catch (err) {
        console.error(err)
        return err
    }
 }