import { request } from "../../utils/apiHelpers";
import { getHistoryURL } from "../../api/history.api";

export const getHistoryApi = () =>
  request(getHistoryURL, { method: "GET" });
