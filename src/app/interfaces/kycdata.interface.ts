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