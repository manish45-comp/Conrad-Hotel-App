export enum RouteKey {
  Home = "home",
  // EmployeeList = "employee-list",
  VisitorList = "visitor-list",
}

export const ROUTES: Record<RouteKey, string> = {
  [RouteKey.Home]: "/dashboard/home",
  // [RouteKey.EmployeeList]: "/dashboard/employee-list",
  [RouteKey.VisitorList]: "/dashboard/visitor-list",
};

export const ROUTE_TITLES: Record<RouteKey, string> = {
  [RouteKey.Home]: "Dashboard",
  // [RouteKey.EmployeeList]: "Employee List",
  [RouteKey.VisitorList]: "Visitors List",
};

export const ROUTE_ICONS: Record<RouteKey, string> = {
  [RouteKey.Home]: "view-dashboard",
  // [RouteKey.EmployeeList]: "account-tie",
  [RouteKey.VisitorList]: "account-group",
};
