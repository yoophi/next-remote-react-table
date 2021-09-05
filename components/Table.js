import React, { useCallback, useEffect, useMemo } from "react";
import { usePagination, useSortBy, useTable } from "react-table";

export function Table({
  columns,
  data,
  loading,
  pageCount: controlledPageCount,
  controlledPageSize,
  setControlledPageSize,
  controlledPageIndex,
  setControlledPage,
  controlledSortBy,
  setControlledSortBy,
  debug = false,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    // Get the state from the instance
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      manualSortBy: true,
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
      useControlledState: (state) => {
        return useMemo(
          () => ({
            ...state,
            pageIndex: controlledPageIndex,
            pageSize: controlledPageSize,
            sortBy: controlledSortBy,
          }),
          [state, controlledPageIndex, controlledPageSize]
        );
      },
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setControlledPageSize(pageSize);
  }, [setControlledPageSize, pageSize]);
  useEffect(() => {
    setControlledSortBy(sortBy);
  }, [sortBy]);

  const gotoPage = useCallback((page) => {
    setControlledPage(page);
  }, []);
  const nextPage = useCallback(() => {
    setControlledPage(pageIndex + 1);
  }, [pageIndex]);
  const previousPage = useCallback(() => {
    setControlledPage(pageIndex - 1);
  }, [pageIndex]);
  const setPageSize = useCallback(
    (newPageSize) => {
      setControlledPageSize(newPageSize);
      if (pageSize !== newPageSize) {
        setControlledPage(0);
      }
    },
    [pageSize, setControlledPage, setControlledPageSize]
  );

  // Render the UI for your table
  return (
    <>
      {debug && (
        <pre>
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
              },
              null,
              2
            )}
          </code>
        </pre>
      )}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.sortable && column.getSortByToggleProps()
                  )}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan="10000">Loading...</td>
            ) : (
              <td colSpan="10000">
                Showing {page.length} of ~{controlledPageCount * pageSize}{" "}
                results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
