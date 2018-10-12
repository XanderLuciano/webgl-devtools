define([], function () {
    return React.createClass({
        render() {
            let className = "context-bar-element";
            if (this.props.selected) {
                className += " context-bar-element-selected";
            }
            return <div className={className} onClick={this.props.onClick}>{this.props.name}</div>;
        }
    });
});
