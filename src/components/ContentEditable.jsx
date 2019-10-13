import React from "react"

export default class ContentEditable extends React.Component {
    constructor(props) {
        super(props);
        this.element = React.createRef();

        this.emitChange = this.emitChange.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.html !== this.element.current.innerHTML;
    }

    componentDidUpdate() {
        if (this.props.html !== this.element.current.innerHTML) {
            this.element.current.innerHTML = this.props.html;
        }
    }

    emitChange() {
        const html = this.element.current.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange(this.props.useText ? this.element.current.innerText : this.element.current.innerHTML);
        }
        this.lastHtml = html;
    }

    render() {
        return React.createElement(this.props.tag, {
            onInput: this.emitChange,
            onBlur: this.emitChange,
            className: this.props.className,
            contentEditable: true,
            dangerouslySetInnerHTML: {
                __html: this.props.html
            },
            ref: this.element
        });
    }
}