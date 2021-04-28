import { getTodoList } from "./action-creators";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  data: null,
  pagination: {
    page: 1,
    per_page: 10,
  },
  filters: [],
  sortBy: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [getTodoList.pending.type]: (state, action) => {
      state.loading = true;
    },
    [getTodoList.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    [getTodoList.pending.type]: (state, action) => {
      state.loading = false;
    },
  },
});

export default todoSlice;
