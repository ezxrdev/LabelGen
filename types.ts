export interface LabelData {
  productName: string;
  productModel: string;
  productionYear: string;
  qcStatus: string;
  qcDate: string;
  companyName: string;
  website: string;
  address: string;
  email: string;
}

export const DEFAULT_LABEL_DATA: LabelData = {
  productName: "AR内容工作站",
  productModel: "EZAE1",
  productionYear: "2025",
  qcStatus: "已检验",
  qcDate: "2025.05",
  companyName: "杭州易现先进科技有限公司",
  website: "https://www.ezxr.com/",
  address: "浙江省杭州市萧山区天人大厦3101室",
  email: "pm@service.ezxr.com",
};