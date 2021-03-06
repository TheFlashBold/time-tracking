import React from "react"
import moment from "moment"

export default class TaskTable extends React.Component {

    getDuration(task) {
        const start = moment(task.start);
        const end = task.end ? moment(task.end) : moment();
        return moment.duration().add(end.diff(start)).asHours().toFixed(2);
    }

    render() {
        return (
            <div>
                <table className="table table-sm table-dark">
                    <thead>
                    <tr>
                        <th scope="col">Task</th>
                        <th scope="col">Duration</th>
                        <th scope="col">$</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.tasks.map((task, index) =>
                            (
                                <tr key={index}>
                                    <th scope="row">{task.name}</th>
                                    <td>{this.getDuration(task)}</td>
                                    <td>{task.paid ? "$" : null}</td>
                                </tr>
                            )
                        )
                    }
                    <tr>
                        <th scope="row">Total:</th>
                        <td>{this.props.getTotal().asHours().toFixed(2)}</td>
                        <td/>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}