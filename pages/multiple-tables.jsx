import TodoTable from "../components/TodoTable";
import Nav from '../components/nav'

export default function MultipleTables() {
	return (
		<>
			<Nav />
		  <h1>Multiple Tables</h1>

			<div style={{ border: '1px solid blue', padding: '8px'}}>
				<h3>default</h3>
				<div>
					<TodoTable />
				</div>
			</div>
			<div style={{ border: '1px solid blue', padding: '8px'}}>
				<h3>sort by user_id</h3>
				<div>
					<TodoTable />
				</div>
			</div>
			<div style={{ border: '1px solid blue', padding: '8px'}}>
				<h3>filter by completed=true</h3>
				<div>
					<TodoTable />
				</div>
			</div>
		</>
	)
}