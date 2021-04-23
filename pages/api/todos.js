import todos from "./todos.json";

function paginate(array, pageSize, pageNumber) {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export default (req, res) => {
  const page = parseInt(req.query?.page) || 1;
  const per_page = parseInt(req.query?.per_page) || 10;
  const total = todos.length;
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
    data: paginate(todos, per_page, page),
    pagination,
  });
};
