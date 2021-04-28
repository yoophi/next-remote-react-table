import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTodoList } from "../store/reducers/todo/action-creators";

export default function Home() {
  const todo = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodoList(1, 10, null, null));
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(todo, null, 2)}</pre>
    </div>
  );
}
