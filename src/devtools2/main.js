define(["jsx!panel", "jsx!disabled_panel"],
function (Panel, DisabledPanel) {
    const Main = React.createClass({

        getInitialState: function() {
            return {
                enabled: false,
            }
        },

        componentWillMount: function() {
            chrome.storage.sync.get({"glpEnabled": false}, items => {
                this.setState({ enabled: items["glpEnabled"] });
            });
        },

        render() {
            const panel = this.state.enabled ? <Panel /> : <DisabledPanel />;
            return <div className="main">
                { panel }
            </div>
        }
    });

    ReactDOM.render(
        <Main />,
        document.body
    );
});
