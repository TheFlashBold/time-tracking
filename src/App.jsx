import React from 'react'
import moment from "moment"
import StorageManager from "./lib/StorageManager"
import TaskTable from "./components/TaskTable";
import TaskList from "./components/TaskList";

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

    onToggleOverview(event, state) {
        this.setState({
            showOverview: state !== undefined ? state : !this.state.showOverview
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

    onTasksUpdate(tasks) {
        this.setState({tasks});
    }

    render() {
        return (
            <div className="time-wrapper">
                <div className="card mb-2">
                    <div className="card-body text-primary bg-dark">
                        <h5 className="mb-0">Time Tracking</h5>
                    </div>
                </div>
                {this.state.showOverview ?
                    <TaskTable tasks={this.state.tasks} getTotal={this.getTotal.bind(this)}/> :
                    <TaskList tasks={this.state.tasks} onTasksUpdate={this.onTasksUpdate.bind(this)} getTotal={this.getTotal.bind(this)}/>}
                <button type="button" className="btn btn-secondary w-100" onClick={this.onToggleOverview.bind(this)}>
                    <i className="fas fa-random"/>
                </button>
            </div>
        );
    }
}
