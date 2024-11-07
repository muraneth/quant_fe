/** HTTP request method to indicate the desired action to be performed for a given resource. */
export enum HttpMethod {
  /** The CONNECT method establishes a tunnel to the server identified by the target resource. */
  CONNECT = 'connect',
  /** The DELETE method deletes the specified resource. */
  DELETE = 'delete',
  /** The GET method requests a representation of the specified resource. Requests using GET should only retrieve data. */
  GET = 'get',
  /** The HEAD method asks for a response identical to that of a GET request, but without the response body. */
  HEAD = 'head',
  /** The OPTIONS method is used to describe the communication options for the target resource. */
  OPTIONS = 'options',
  /** The PATCH method is used to apply partial modifications to a resource. */
  PATCH = 'patch',
  /** The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server. */
  POST = 'post',
  /** The PUT method replaces all current representations of the target resource with the request payload. */
  PUT = 'put',
  /** The TRACE method performs a message loop-back test along the path to the target resource. */
  TRACE = 'trace',
}

/** HTTP request protocol. */
export enum HttpProtocol {
  /** Unencrypted HTTP protocol. */
  HTTP = 'http',
  /** Encrypted HTTPS protocol. */
  HTTPS = 'https',
}

export interface ApiResponse<T> {
  code: number;
  data: T;
}

/**
 * OverviewResourceMetricReq，Overview场景中 资源指标Request通用结构定义
 */
export interface OverviewRequest {
  filter?: Filter;
  metric_mode?: string;
  time_range?: TimeRange;
}

/**
 * Filter，资源指标查询过滤条件
 */
export interface Filter {
  workspace_id?: string | null;
  allocate_status?: string;
  cluster_id?: string;
  compute_group_id?: string;
  logic_compute_group_id?: string;
  node_id?: string;
  node_name_keyword?: string;
  node_status?: string;
  task_id?: string;
  task_name_keyword?: string;
  task_type?: string;
  user_id?: string;
  ip?: string;
  location?: string;
  name?: string;
  schedule_type?: string;
  sn?: string;
  status?: string;
}

export enum NodeStatus {
  NotReady = 'NOT_READY',
  Ready = 'READY',
  SchedulingDisabled = 'SCHEDULING_DISABLED',
  UnknownNodeStatus = 'UNKNOWN_NODE_STATUS',
}

export enum MetricMode {
  LogicAllocated = 'LOGIC_ALLOCATED',
  RealUsed = 'REAL_USED',
}

/**
 * TimeRange，时间范围选取
 */
export interface TimeRange {
  end_timestamp?: string;
  interval_second?: string;
  start_timestamp?: string;
}

/**
 * ListResourceMetricReq，资源指标列表Request通用结构定义
 */
export interface ListRequest {
  filter?: Filter;
  order_by?: OrderByField[];
  page_num?: number;
  page_size?: number;
}

/**
 * OrderByField，排序字段
 */
export interface OrderByField {
  desc?: boolean;
  field?: string;
}
