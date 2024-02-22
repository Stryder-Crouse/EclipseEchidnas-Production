import Status from "../../../../backend/src/algorithms/Requests/Status.ts";
import {Priorities} from "../../../../backend/src/algorithms/Requests/Request.ts";


export interface requestFilters {
    statusFilter:Status;
    priorityFilter: Priorities;
    employeeFilter:string;
    locationFilter:string;
}

