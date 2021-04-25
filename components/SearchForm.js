import React, { useCallback, useState } from "react";

export const SearchForm = ({ filters, setFilters }) => {
  const [userId, setUserId] = useState(null);
  const [completed, setCompleted] = useState("default");
  const onSubmit = useCallback(() => {
    setFilters({ ...filters, userId });
  }, [filters, setFilters, userId]);

  const onSearchReset = useCallback(() => {
    setUserId(null);
    setFilters({ ...filters, userId: null });
  }, [filters, setFilters, userId]);

  const onCompletedChanged = useCallback(
    (e) => {
      const completed = e.target.value;
      setCompleted(completed);
      setFilters({
        ...filters,
        completed: completed !== "default" ? completed : null,
      });
    },
    [completed, filters, setFilters]
  );

  return (
    <div>
      <form>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId ? userId : ""}
            onChange={(e) => {
              setUserId(e.target.value ? e.target.value : null);
            }}
          />
        </div>
        <div>
          <label>Completed:</label>
          <select value={completed} onChange={onCompletedChanged}>
            <option value="default">default</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>

        <div>
          <input type="button" value="search" onClick={onSubmit} />
          <input type="button" value="reset" onClick={onSearchReset} />
        </div>
      </form>
    </div>
  );
};
