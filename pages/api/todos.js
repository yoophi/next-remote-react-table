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

const parseSort = (sort) => {
  if (!sort || typeof sort !== "string") {
    return {
      key: "id",
      ascending: "asc",
    };
  }

  const result = {};
  try {
    const [key, ...values] = sort.split(":");
    if (key && values) {
      result.key = key;
      result.ascending = values.join("").toLowerCase() === "asc";
    }
  } catch (err) {}

  return result;
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

const getSortedTodos = (todos, sort) => {
  if (!sort || Object.keys(sort).length === 0) {
    return todos;
  }

  return todos.sort((a, b) => {
    const direction = sort.ascending ? 1 : -1;
    if (sort.key === "id") {
      if (a.id === b.id) {
        return 0;
      }

      return direction * (a.id > b.id ? 1 : -1);
    } else if (sort.key === "userId") {
      if (a.userId === b.userId) {
        return 0;
      }

      return direction * (a.userId > b.userId ? 1 : -1);
    } else if (sort.key === "title") {
      if (a.title === b.title) {
        return 0;
      }

      return direction * (a.title > b.title ? 1 : -1);
    }

    return 0;
  });
};

export default (req, res) => {
  const page = parseInt(req.query?.page) || 1;
  const per_page = parseInt(req.query?.per_page) || 10;
  const filters = parseFilters(req.query?.filters);
  const sort = parseSort(req.query?.sort);
  const filteredTodos = getFilteredTodos(todos, filters);
  const sortedTodos = getSortedTodos(filteredTodos, sort);

  const total = sortedTodos.length;
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
    data: paginate(sortedTodos, per_page, page),
    pagination,
  });
};
