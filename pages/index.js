import React from "react";
import TodoTable from "../components/TodoTable";
import Nav from "../components/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <div>
        <TodoTable
          debug={true}
          pageSize={5}
          sortBy={[
            {
              id: "title",
              desc: true,
            },
          ]}
        />
      </div>
    </>
  );
}
