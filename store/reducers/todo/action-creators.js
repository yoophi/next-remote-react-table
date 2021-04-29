import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTodoList } from "./api";

export const getTodoList = createAsyncThunk(
  "todos/GET_TODO_LIST",
  async ({ page, per_page, filters, sort }) => {
    const response = await fetchTodoList(page, per_page, filters, sort);
    return response.data;
  }
);
