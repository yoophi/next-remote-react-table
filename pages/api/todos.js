import todos from "./todos.json";

function paginate(array, pageSize, pageNumber) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

const parseFilters = (filters) => {
  if (!filters || typeof filters !== "string") {
    return {};
  }

  return filters.split(",").reduce((result, filter) => {
    try {
      const [key, ...values] = filter.split(":");
      if (key && values) {
        result[key] = values.join(", ");
      }
    } catch (err) {}
    return result;
  }, {});
};

const getFilteredTodos = (todos, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return todos;
  }

  return todos.filter((todo) => {
    let matched = true;
    if (filters?.userId) {
      matched = matched && todo.userId === parseInt(filters.userId);
    }
    if (filters?.completed) {
      const completed = JSON.parse(filters.completed.toLowerCase());
      matched = matched && todo.completed === completed;
    }

    return matched;
  });
};

export default (req, res) => {
  const page = parseInt(req.query?.page) || 1;
  const per_page = parseInt(req.query?.per_page) || 10;
  const filters = parseFilters(req.query?.filters);
  const filteredTodos = getFilteredTodos(todos, filters);

  const total = filteredTodos.length;
  const total_page = Math.ceil(total / per_page);
  const has_next = page < total_page;
  const pagination = {
    page,
    per_page,
    total,
    total_page,
    has_next,
  };
  res.status(200).json({
    data: paginate(filteredTodos, per_page, page),
    pagination,
  });
};
