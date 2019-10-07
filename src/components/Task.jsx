import React from "react"
import moment from "moment"
import ContentEditable from "./ContentEditable";

export default class Task extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.props.data;
    }

    onChange(key, event) {
        const value = !event.target ? event : event.target.value;
        this.props.onTaskUpdate({[key]: value});
    }

    getDuration() {
        const start = moment(this.state.start);
        const end = this.state.end ? moment(this.state.end) : moment();
        const diff = end.diff(start);

        if (diff < 0) {
            return "you destroyed it you fool!";
        }

        return moment.utc(diff).format("HH:mm:ss");
    }

    getPaid() {
        if (this.state.paid) {
            return (<button type="button" className="btn btn-light btn-sm" onClick={this.onChange.bind(this, "paid", false)}>
                <i className="fas fa-dollar-sign"/>
            </button>);
        } else {
            return (<button type="button" className="btn btn-light btn-sm" onClick={this.onChange.bind(this, "paid", true)}>
                <i className="fas fa-dollar-sign" style={{color: "#dc3240"}}/>
            </button>);
        }
    }

    getStartStop() {
        if (this.state.end) {
            return (<button type="button" className="btn btn-success btn-sm" onClick={this.props.onTaskResume}>
                <i className="fas fa-play"/>
            </button>);
        } else {
            return (<button type="button" className="btn btn-danger btn-sm" onClick={this.props.onTaskStop}>
                <i className="fas fa-pause"/>
            </button>)
        }
    }

    render() {
        return (
            <div className="task toast show mb-2">
                <div className="toast-header">
                    <ContentEditable tag="strong" className="mr-auto" html={this.state.name} onChange={this.onChange.bind(this, "name")}/>
                    <small className="text-muted"><b>{this.getDuration()}</b></small>
                    <button type="button" className="ml-2 mb-1 close" onClick={this.props.onTaskRemove}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="toast-body">
                    <div className="btn-group">
                        {this.getPaid()}
                        {this.getStartStop()}
                        <button type="button" className="btn btn-primary btn-sm" onClick={this.props.onTaskRound}>
                            <i className="fas fa-magic"/>
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.onTaskUp}>
                            <i className="fas fa-plus"/>
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.onTaskDown}>
                            <i className="fas fa-minus"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}