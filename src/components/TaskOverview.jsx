import React from "react"
import moment from "moment"

export default class TaskOverview extends React.Component {

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
                        <th scope="col">#</th>
                        <th scope="col">Task</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Paid?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.tasks.map((task, index) =>
                            (
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>{task.name}</td>
                                    <td>{this.getDuration(task)}</td>
                                    <td>{task.paid ? <i className="fas fa-check"/> : null}</td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}