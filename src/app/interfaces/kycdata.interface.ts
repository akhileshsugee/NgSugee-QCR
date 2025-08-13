export interface Bank {
  bank_code: string;
  bank_name: string;
  active: string;
  gid: string;
}

export interface User {
  aadhar_no: string;
  father_name: string;
  pan_no: string;
  address: string;
  name: string;
  dob: string;
  gender: string;
  account_number: string;
  cif_number: string;
}

export interface Aadhaar {
  aadhar_number: string,
  dob: string,
  name: string,
  address: string,
  person_name?: string,
  relation?: string,
  relation_name?: string,
  gender: string
}

export interface KYCEntries {
  gid: string;
  pan_page1_url: string;
  bank_code: string;
  aadhar_page1_url: string;
  aadhar_page2_url: string;
  selie_url: string;
  customer_guid: string;
  account_number: string;
  branch_code: string;
  cif_number: string;
  sign_url: string;
  aadhar_page1_path: string;
  aadhar_page2_path: string;
  aadhar_json: Aadhaar;
  created_on: string;
  pan_page1_path: string;
  selfie_path: string;
  sign_path: string;
  status: string;
  user_json: User,
  pan_josn: Pan,
}
export interface Member {
  user_id: string;
  name: string;
  mobile: string;
  active: string;
  role: string;
}

export interface Remark {
  gid: string,
  category: string,
  remarks: string,
  display_order: string,
  active: string
}

export type Image = {
  url: string;
  key: string;
};

export type ImageStatus = {
  status: '' | 'ok' | 'not_ok' | null;
  reason: string;
  key: string;
};

export interface Pan {
  pan_number: string,
  father_name: string,
  dob: string,
  name: string
}

export interface Banks {
  status: string;
  message: string;
  data: Bank[];
}

export interface Branch {
  bank_code: string;
  bank_name: string;
  branch_name: string;
  branch_code: string;
  ifsc_code: string;
  active: string;
  gid: string;
}

export interface Branchs {
  status: string;
  message: string;
  data: Branch[];
}


export interface BranchCustomer {
  gid: string;
  bank_code: string;
  branch_code: string;
  account_number: string;
  cif_number: string;
  id_number: string;
  name: string;
}

export interface BranchCustomers {
  status: string;
  message: string;
  data: BranchCustomer[];
}


export interface KYCResponse {
  status: string;
  message: string;
  data: KYCData[];
}

export interface KYCData {
  gid: string;
  bank_code: string;
  branch_code: string;
  account_number: string;
  cif_number: string;
  customer_guid: string;
  aadhar_page1_path: string;
  aadhar_page1_url: string;
  aadhar_page2_path: string;
  aadhar_page2_url: string;
  pan_page1_path: string;
  pan_page1_url: string;
  selie_path: string;
  selie_url: string;
  sign_path: string;
  sign_url: string;
  status: string;
  created_on: string;
  aadhar_json: string;
  pan_json: string;
  user_json: string;
  status_remarks: string;
  selfie_status: string;
  selfie_status_remarks: string;
  sign_status: string;
  sign_status_remarks: string;
  aadhaar_status: string;
  aadhaar_status_remarks: string;
  pan_status: string;
  pan_status_remarks: string;
}


export interface relation {
  text: string,
  value: string
}

export interface relations {
  status: string,
  message: string,
  data: relation[]
}

export interface ExportResponse {
  status: string;
  message: string;
  data: number;
  Url: string[];
}