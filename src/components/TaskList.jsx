import React from "react"
import Task from "./Task";
import moment from "moment";
import {formatDuration} from "../lib/Utils";

export default class TaskList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks
        };
    }

    onCreateMissingTask() {
        const start = moment().subtract(this.getMissing().asMinutes(), "minutes");
        this.onTaskAdd({
            name: "Task",
            start: start,
            end: moment(),
            duration: moment.duration(moment().diff(moment(start))),
            paid: false
        });
    }

    getMissing() {
        return moment.duration().add(8, "hours").subtract(this.props.getTotal().asMinutes(), "minutes");
    }

    getToFullDay() {
        return moment.duration(8, "hours").subtract(this.props.getTotal().asMinutes(), "minutes");
    }

    onTaskUpdate(index, data) {
        const tasks = this.state.tasks.concat([]);
        tasks[index] = Object.assign(tasks[index], data);
        this.props.onTasksUpdate(tasks);
    }

    onTaskToggle(task, index) {
        this.onTaskUpdate(task, index, {closed: !task.closed});
    }

    onTaskStop(task, index) {
        const start = moment(task.start);
        const end = moment();
        const duration = moment.duration(end.diff(start));
        this.onTaskUpdate(index, {end, duration});
    }

    onTaskResume(task, index) {
        this.onTaskUpdate(index, {
            end: null,
            start: moment().subtract(moment.duration(task.duration).asMinutes(), "minutes")
        });
    }

    onTaskRound(task, index) {
        const end = task.end ? moment(task.end) : moment();
        const duration = moment.duration(end.diff(task.start));

        if (duration.asMinutes() < 5 || duration.asMinutes() % 15 > 5) {
            duration.add(15 - duration.asMinutes() % 15, "minutes");
        } else {
            duration.subtract(duration.asMinutes() % 15, "minutes");
        }

        this.onTaskUpdate(index, {
            start: end.subtract(duration.asMinutes(), "minutes"),
            end,
            duration
        });
    }

    onTaskModifyDuration(task, index, amount) {
        if (task.end) {
            task.end = moment(task.end).add(amount, "minutes");
        } else {
            task.start = moment(task.start).subtract(amount, "minutes");
        }
        const end = task.end ? moment(task.end) : moment();
        task.duration = moment.duration(end.diff(moment(task.start)));
        this.onTaskUpdate(index, task);
    }

    onTaskAdd(item) {
        this.setState({
            tasks: this.state.tasks.concat([item])
        });
    }

    onTaskRemove(task, index) {
        const tasks = this.state.tasks.concat([]);
        tasks.splice(index, 1);
        this.setState({
            tasks
        });
    }

    render() {
        const missingDuration = this.getMissing();
        const total = this.props.getTotal();
        const toFullDay = this.getToFullDay();

        return (
            <React.Fragment>
                <div className="card text-white bg-secondary mb-2">
                    <div className="card-body" style={{textAlign: "center"}}>
                        <p>{formatDuration(total)} {toFullDay.asMinutes() > 0 ? "/ " + formatDuration(toFullDay) : null}</p>
                        {missingDuration && missingDuration.asMinutes() > 0 ?
                            (<button type="button" className="btn btn-danger btn-sm"
                                     onClick={this.onCreateMissingTask.bind(this)}>
                                <i className="fas fa-plus fa-sm"/> {formatDuration(missingDuration)}
                            </button>) : null}
                    </div>
                </div>
                {this.state.tasks.map((task, index) =>
                    (<Task key={index + String(task.start) + String(task.duration)}
                           data={task}
                           onTaskUpdate={this.onTaskUpdate.bind(this, index)}
                           onTaskRemove={this.onTaskRemove.bind(this, task, index)}
                           onTaskStop={this.onTaskStop.bind(this, task, index)}
                           onTaskResume={this.onTaskResume.bind(this, task, index)}
                           onTaskRound={this.onTaskRound.bind(this, task, index)}
                           onTaskUp={this.onTaskModifyDuration.bind(this, task, index, 15)}
                           onTaskDown={this.onTaskModifyDuration.bind(this, task, index, -15)}
                           onTaskToggle={this.onTaskToggle.bind(this, task, index)}
                    />)
                )}
                <div className="btn-group w-100 mb-2">
                    <button type="button" className="btn btn-primary" onClick={this.onTaskAdd.bind(this, {
                        name: "Task",
                        start: moment(),
                        end: null,
                        paid: false
                    })}>
                        <i className="fas fa-plus"/>
                    </button>
                </div>
            </React.Fragment>
        );
    }
}