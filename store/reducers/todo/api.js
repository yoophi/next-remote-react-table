import qs from "qs";
import axios from "axios";

export async function fetchTodoList(page, per_page, filters, sort) {
  const params = {};
  const queryString = qs.stringify();
  return await axios.get(`/api/todos?${queryString}`);
}
