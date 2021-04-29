import { useDispatch, useSelector } from "react-redux";
import React, { useMemo, useCallback, useEffect } from "react";
import { getTodoList } from "../store/reducers/todo/action-creators";
import { SearchForm } from "../components/SearchForm";
import { Table } from "../components/Table";
import {
  setPageIndex,
  setPageSize,
  setFilters,
  setSort,
} from "../store/reducers/todo";

export default function Home() {
  const todo = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const { data, filters, sort, loading, pageIndex, pageSize, pageCount } = todo;

  const columns = useMemo(
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

  const fetchData = useCallback(
    ({ pageSize, pageIndex }) => {
      dispatch(
        getTodoList({ page: pageIndex + 1, per_page: pageSize, filters, sort })
      );
    },
    [filters, sort]
  );

  useEffect(() => {
    dispatch(setPageIndex(0));
    fetchData({ pageIndex: 0, pageSize: pageSize });
  }, [filters, sort]);

  return (
    <>
      <pre>{JSON.stringify({ filters }, null, 2)}</pre>
      <pre>{JSON.stringify({ pageCount, pageSize, sort }, null, 2)}</pre>
      <SearchForm
        filters={filters}
        setFilters={(filters) => dispatch(setFilters(filters))}
      />
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        controlledPageIndex={pageIndex}
        setControlledPage={(pageIndex) => dispatch(setPageIndex(pageIndex))}
        controlledPageSize={pageSize}
        setControlledPageSize={(pageSize) => dispatch(setPageSize(pageSize))}
        controlledSortBy={sort}
        setControlledSortBy={(sort) => dispatch(setSort(sort))}
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
          <button
            onClick={() => {
              setPageIndex(0);
              fetchData(pageSize, pageIndex);
            }}
          >
            fetchData()
          </button>
        </div>
      </div>
    </>
  );
}
