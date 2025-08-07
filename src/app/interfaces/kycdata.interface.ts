export interface Bank {
    bank_code: string;
    bank_name: string;
    active: string;
    gid: string;
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