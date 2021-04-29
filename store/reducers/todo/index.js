import { getTodoList } from "./action-creators";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  data: [],
  pagination: {
    page: 1,
    per_page: 10,
    total: 0,
    total_page: 0,
  },
  pageCount: null, // pagination.total_page == Math.ceil(pagination.total / per_page)
  pageIndex: 0, // page
  pageSize: 10, // per_page
  filters: [],
  sortBy: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setPageCount(state, action) {
      state.pageCount = action.payload;
    },
    setPageIndex(state, action) {
      state.pageIndex = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    usersLoading(state, action) {
      // Use a "state machine" approach for loading state instead of booleans
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    },
    usersReceived(state, action) {
      if (state.loading === "pending") {
        state.loading = "idle";
        state.users = action.payload;
      }
    },
  },
  extraReducers: {
    [getTodoList.pending.type]: (state, action) => {
      state.loading = true;
    },
    [getTodoList.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.pageCount = action.payload.pagination.total_page;
    },
    [getTodoList.rejected.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export const {
  setFilters,
  setSort,
  setPageIndex,
  setPageSize,
} = todoSlice.actions;
export default todoSlice;
