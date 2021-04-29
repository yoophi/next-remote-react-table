import qs from "qs";
import axios from "axios";

export async function fetchTodoList(page, per_page, filters, sort) {
  const params = { page, per_page };
  const paramsArray = Object.keys(filters).reduce((acc, curr) => {
    try {
      const value = filters[curr];
      if (value !== null && value !== "") {
        acc.push(`${curr}:${value}`);
      }
    } catch (err) {}

    return acc;
  }, []);

  if (paramsArray.length > 0) {
    params.filters = paramsArray.join(",");
  }
  if (sort.length) {
    const { id, desc } = sort[0];
    params.sort = `${id}:${desc ? "desc" : "asc"}`;
  }

  const queryString = qs.stringify(params);
  return await axios.get(`/api/todos?${queryString}`);
}
