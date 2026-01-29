export interface VisitorItem {
  VisitorId: number;
  VisitorName: string;
  ContactNumber: string;
  FromDate: string;
  InTime: string | null;
  OutTime: string | null;
  Purpose: string | null;
  AuthorityApproval: string | null;
  EmployeeApproval: string | null;
}
