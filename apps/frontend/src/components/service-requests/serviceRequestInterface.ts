import Status from "../../../../../packages/common/src/algorithms/Requests/Status.ts";
import {Priorities} from "../../../../../packages/common/src/algorithms/Requests/Request.ts";


export interface requestFilters {
    statusFilter:Status;
    priorityFilter: Priorities;
    employeeFilter:string;
    locationFilter:string;
}

export interface requestFiltersForProtectedTable {
    statusFilter:Status;
    employeeFilter:string;
    locationFilter:string;
}
