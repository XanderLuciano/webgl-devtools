define(["jsx!tab_bar_element"], function (TabBarElement) {
    return React.createClass({
        getInitialState: function() {
            return {
                clicked: 0,
            };
        },

        handleClick: function(i) {
            this.setState({ clicked: i });
            this.props.changeTab(i);
        },

        getTabs: function() {
            const tabResult = [];
            for (let i = 0; i < this.props.tabs.length; i++) {
                let el = <TabBarElement name={this.props.tabs[i]}
                        selected={this.state.clicked == i}
                        onClick={this.handleClick.bind(this, i)} />;
                tabResult.push(el);
            }
            return tabResult
        },

        render() {
            return <div className="tab-bar">
                { this.getTabs() }
            </div>;
        }
    });
});
