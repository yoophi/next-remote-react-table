import React, { useEffect } from "react";

import { SearchForm } from "../components/SearchForm";
import { Table } from "../components/Table";
import axios from "axios";
import qs from "qs";

export default function Home() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "User",
        accessor: "userId",
      },
      {
        Header: "Completed",
        accessor: (d) => (d.completed ? "true" : "false"),
      },
    ],
    []
  );

  const [data, setData] = React.useState([]);
  const [filters, setFilters] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);

  const fetchData = React.useCallback(
    ({ pageSize, pageIndex }) => {
      setLoading(true);
      const params = {
        page: pageIndex + 1,
        per_page: pageSize,
      };
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

      const queryString = qs.stringify(params);
      axios
        .get(`/api/todos?${queryString}`)
        .then((res) => {
          setData(res.data.data);
          setPageCount(Math.ceil(res.data.pagination.total / pageSize));
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    },
    [filters]
  );

  useEffect(() => {
    fetchData(pageCount, 1);
  }, [filters]);

  return (
    <>
      <pre>{JSON.stringify({ filters }, null, 2)}</pre>
      <SearchForm filters={filters} setFilters={setFilters} />
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
      />
    </>
  );
}
