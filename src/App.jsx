import React from 'react'
import moment from "moment"
import StorageManager from "./lib/StorageManager"
import TaskTable from "./components/TaskTable";
import TaskList from "./components/TaskList";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            day: moment(StorageManager.get("day")).format("DD.MM.YYYY"),
            tasks: StorageManager.get("tasks", []),
            days: StorageManager.get("days", [{date: "09.10.2019", tasks: []}]),
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
            StorageManager.set("days", this.state.days);
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

    onDayChange(event) {
        let days = this.state.days;
        let day = days.find(({date}) => date === this.state.day);

        if (day) {
            days[days.indexOf(day)] = {
                date: this.state.day,
                tasks: this.state.tasks
            };
            days.concat([]);
        } else {
            days.concat([{
                date: this.state.day,
                tasks: this.state.tasks
            }]);
        }

        const currentDay = days.find(({date}) => date === event.target.value);
        if (!currentDay) {
            days.concat([{
                date: event.target.value,
                tasks: []
            }]);
        }

        this.setState({
            days: days,
            day: event.target.value,
            tasks: currentDay ? currentDay.tasks : []
        });
    }

    render() {
        const today = moment().format("DD.MM.YYYY");
        return (
            <div className="time-wrapper">
                <div className="card mb-2">
                    <div className="card-body text-primary bg-dark">
                        <h5 className="mb-0">Time Tracking</h5>
                    </div>
                    <div className="form-group">
                        <select className="form-control form-control-sm" value={this.state.day} onChange={this.onDayChange.bind(this)}>
                            {this.state.days.map(({date}, index) =>
                                (<option key={index} value={date}>{date}</option>)
                            )}
                            {this.state.days.find(({date}) => date === today) ? null : (<option value={today}>{today}</option>)}
                        </select>
                    </div>
                </div>
                {this.state.showOverview ?
                    <TaskTable tasks={this.state.tasks} getTotal={this.getTotal.bind(this)}/> :
                    <TaskList tasks={this.state.tasks}
                              onTasksUpdate={this.onTasksUpdate.bind(this)}
                              onTaskAdd={this.onTaskAdd.bind(this)}
                              onTaskRemove={this.onTaskRemove.bind(this)}
                              getTotal={this.getTotal.bind(this)}
                    />}
                <button type="button" className="btn btn-secondary w-100" onClick={this.onToggleOverview.bind(this)}>
                    <i className="fas fa-random"/>
                </button>
            </div>
        );
    }
}
