import React from "react";
import { Table } from "../components/Table";
import axios from "axios";
import qs from "qs";

export default function Home() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Id",
            accessor: "id",
          },
          {
            Header: "Title",
            accessor: "title",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "User",
            accessor: "userId",
          },
          {
            Header: "Completed",
            accessor: "completed",
          },
        ],
      },
    ],
    []
  );

  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    setLoading(true);
    const queryString = qs.stringify({
      page: pageIndex + 1,
      per_page: pageSize,
    });
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
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
    />
  );
}
