import React from 'react'
import Task from "./components/Task"
import moment from "moment"
import {formatDuration} from "./lib/Utils"
import StorageManager from "./lib/StorageManager"
import TaskOverview from "./components/TaskOverview";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: StorageManager.get("tasks", []),
            showOverview: false
        };

        this.interval = null;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.forceUpdate();
        }, 1000);

        setInterval(() => {
            StorageManager.set("tasks", this.state.tasks);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onTaskUpdate(task, index, data) {
        const tasks = this.state.tasks.concat([]);

        tasks[index] = Object.assign(tasks[index], data);

        this.setState({
            tasks: tasks
        });
    }

    onTaskStop(index) {
        const tasks = this.state.tasks.concat([]);

        tasks[index].end = moment();
        tasks[index].duration = moment.duration(tasks[index].end.diff(tasks[index].start));

        this.setState({
            tasks: tasks
        });
    }

    onTaskResume(index) {
        const tasks = this.state.tasks.concat([]);

        tasks[index].start = moment().subtract(moment.duration(tasks[index].duration).asMinutes(), "minutes");
        tasks[index].end = null;

        this.setState({
            tasks: tasks
        });
    }

    onTaskRound(index) {
        const tasks = this.state.tasks.concat([]);
        const end = tasks[index].end ? moment(tasks[index].end) : moment();
        const duration = moment.duration(end.diff(tasks[index].start));

        if (duration.asMinutes() < 5 || duration.asMinutes() % 15 > 5) {
            duration.add(15 - duration.asMinutes() % 15, "minutes");
        } else {
            duration.subtract(duration.asMinutes() % 15, "minutes");
        }

        tasks[index].start = end.subtract(duration.asMinutes(), "minutes");
        tasks[index].duration = duration;

        this.setState({
            tasks: tasks
        });
    }

    onTaskModifyDuration(index, amount) {
        const tasks = this.state.tasks.concat([]);
        if (tasks[index].end) {
            tasks[index].end = moment(tasks[index].end).add(amount, "minutes");
        } else {
            tasks[index].start = moment(tasks[index].start).subtract(amount, "minutes");
        }
        tasks[index].duration = moment.duration(moment(tasks[index].end).diff(moment(tasks[index].start)));

        this.setState({
            tasks
        });
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

    onTaskAdd(item) {
        this.setState({
            tasks: this.state.tasks.concat([item])
        });
    }

    onTaskRemove(index) {
        const tasks = this.state.tasks.concat([]);

        tasks.splice(index, 1);

        this.setState({
            tasks
        });
    }

    getTotal() {
        const duration = moment.duration();
        this.state.tasks.forEach((task) => {
            const start = moment(task.start);
            const end = task.end ? moment(task.end) : moment();
            duration.add(end.diff(start));
        });
        return duration;
    }

    getMissing() {
        return moment.duration().add(8, "hours").subtract(this.getTotal().asMinutes(), "minutes");
    }

    getToFullDay() {
        return moment.duration(8, "hours").subtract(this.getTotal().asMinutes(), "minutes");
    }

    onToggleOverview(event, state) {
        this.setState({
            showOverview: state !== undefined ? state : !this.state.showOverview
        });
    }

    renderTracker() {
        const missingDuration = this.getMissing();
        const total = this.getTotal();
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
                    (<Task key={index} data={task} onTaskUpdate={this.onTaskUpdate.bind(this, task, index)}
                           onTaskRemove={this.onTaskRemove.bind(this, index)}
                           onTaskStop={this.onTaskStop.bind(this, index)}
                           onTaskResume={this.onTaskResume.bind(this, index)}
                           onTaskRound={this.onTaskRound.bind(this, index)}
                           onTaskUp={this.onTaskModifyDuration.bind(this, index, 15)}
                           onTaskDown={this.onTaskModifyDuration.bind(this, index, -15)}
                    />)
                )}
                <button type="button" className="btn btn-primary w-100 mb-2" onClick={this.onTaskAdd.bind(this, {
                    name: "Task",
                    start: moment(),
                    end: null,
                    paid: false
                })}>
                    <i className="fas fa-plus"/>
                </button>
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="time-wrapper">
                <div className="card mb-2">
                    <div className="card-body text-primary bg-dark">
                        <h5 className="mb-0">Time Tracking</h5>
                    </div>
                </div>
                {this.state.showOverview ? <TaskOverview tasks={this.state.tasks} getTotal={this.getTotal.bind(this)}/> : this.renderTracker()}
                <button type="button" className="btn btn-secondary w-100" onClick={this.onToggleOverview.bind(this)}>
                    <i className="fas fa-random"/>
                </button>
            </div>
        );
    }
}
