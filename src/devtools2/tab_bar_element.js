define([],
function () {
    return React.createClass({
        render() {
            let className = "tab-bar-element";
            if (this.props.selected) {
                className += " tab-bar-element-selected";
            }
            return <div className={className} onClick={this.props.onClick}>
                {this.props.name}
            </div>;
        }
    });
});
