import axios from "axios";
import qs from "qs";
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { SearchForm } from "../components/SearchForm";
import { Table } from "../components/TableRQ";


export async function fetchTodoList(
  page,
  per_page = 10,
  filters = {},
  sort = []
) {
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

const TodoWithReactQueryPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(0);

  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        sortable: true,
      },
      {
        Header: "Title",
        accessor: "title",
        sortable: true,
      },
      {
        Header: "User",
        accessor: "userId",
        sortable: true,
      },
      {
        Header: "Completed",
        accessor: (d) => (d.completed ? "true" : "false"),
      },
    ],
    []
  );

  const [pageCount, setPageCount] = React.useState(0);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [filters, setFilters] = React.useState({});
  const [sortBy, setSortBy] = React.useState({});

  useEffect(() => {
    setPageIndex(0);
  }, [filters, sortBy]);

  const {
    isLoading,
    status,
    data,
    error,
    isFetching,
    isPreviousData,
  } = useQuery(
    ["projects", { pageIndex, pageSize, filters, sortBy }],
    async ({ queryKey }) => {
      const [_key, { pageIndex, pageSize, filters, sortBy }] = queryKey;
      const page = pageIndex + 1;
      const response = await fetchTodoList(page, pageSize, filters, sortBy);
      setPageCount(response.data.pagination.total_page);
      return response.data;
    },
    { keepPreviousData: true, staleTime: 5000 }
  );

  // Prefetch the next page!
  useEffect(() => {
    if (data?.pagination.has_next) {
      queryClient.prefetchQuery(
        ["projects", { pageIndex: pageIndex + 1, pageSize, filters, sortBy }],
        async ({ queryKey }) => {
          const [_key, { pageIndex, pageSize, filters, sortBy }] = queryKey;
          const page = pageIndex + 1;
          const response = await fetchTodoList(page, pageSize, filters, sortBy);
          setPageCount(response.data.pagination.total_page);
          return response.data;
        }
      );
    }
  }, [data, pageIndex, pageSize, filters, sortBy, queryClient]);

  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setPage(Number(e.target.value));
          }}
          value={page}
        />
      </div>
      <pre>{JSON.stringify({ page, pageSize }, null, 2)}</pre>
      <SearchForm filters={filters} setFilters={setFilters} />
      <Table
        columns={columns}
        data={data?.data || []}
        loading={isLoading}
        pageCount={pageCount}
        controlledPageIndex={pageIndex}
        setControlledPage={setPageIndex}
        controlledPageSize={pageSize}
        setControlledPageSize={setPageSize}
        controlledSortBy={sortBy}
        setControlledSortBy={setSortBy}
      />
      <hr />
      <div>
        <h3>Controlled PageIndex block</h3>
        <div>
          <button
            onClick={() => {
              setPageIndex(pageIndex + 1);
            }}
          >
            next page
          </button>
          <button
            onClick={() => {
              setPageSize(20);
            }}
          >
            setPageSize(20)
          </button>
        </div>
      </div>
    </>
  );
};

export default TodoWithReactQueryPage;
