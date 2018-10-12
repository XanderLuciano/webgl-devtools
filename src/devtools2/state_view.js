isEditable = [
    "DEPTH_CLEAR_VALUE",
    "LINE_WIDTH",
    "PACK_ALIGNMENT",
    "POLYGON_OFFSET_FACTOR",
    "POLYGON_OFFSET_UNITS",
    "STENCIL_REF",
    "STENCIL_BACK_REF",
];

define(["messages"], function (Messages) {
    return React.createClass({

        getInitialState: function() {
            return {
                enabled     : false,
                stateVars   : {},
                enumOptions : {},
            };
        },

        componentWillMount: function() {
            Messages.connection.onMessage.addListener( (msg) => {
                if (msg.source !== "content") return;

                if (msg.type === messageType.STATE_VARS) {
                    const stateVars   = JSON.parse(msg.data.stateVars);
                    const enumOptions = JSON.parse(msg.data.enumOptions);

                    this.setState({
                        stateVars   : stateVars,
                        enumOptions : enumOptions,
                    });
                }
            });
        },

        getVariableColumn: function(data) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                let className = "profile-table-column-element";
                if (i === 0) {
                    className += " profile-table-column-element-header";
                }
                const el = <div className={className}>{data[i]}</div>;
                result.push(el);
            }
            return <div className="profile-table-column">
                {result}
            </div>;
        },

        sendBoolUpdate: function(variableName, value) {
            Messages.sendMessage(this.props.activeContext, messageType.STATE_VARS, {
                type     : "bool",
                variable : variableName,
                enable   : value,
            });
        },

        sendEnumUpdate: function(variableName, value) {
            Messages.sendMessage(this.props.activeContext, messageType.STATE_VARS, {
                type     : "enum",
                variable : variableName,
                value    : value,
            });
        },

        sendNumberUpdate: function(variableName, value) {
            Messages.sendMessage(this.props.activeContext, messageType.STATE_VARS, {
                type     : "num",
                variable : variableName,
                value    : Number(value),
            });
        },

        boolChange: function(variableName, e) {
            const value = e.target.checked;
            this.sendBoolUpdate(variableName, value);
        },

        enumChange: function(variableName, e) {
            const value  = e.target.value;
            this.sendEnumUpdate(variableName, value);
        },

        numberChange: function(variableName, e) {
            const value = e.target.value;
            this.sendNumberUpdate(variableName, value);
        },

        getStateColumn: function(data) {
            const result = [];
            for (let i = 0; i < data.length; i++) {
                let className = "profile-table-column-element";
                let subEl;

                if (i === 0) {
                    className += " profile-table-column-element-header";
                    subEl = "State";
                } else {

                    const name  = data[i - 1];
                    const type  = this.state.stateVars[name].type;
                    const value = this.state.stateVars[name].value;

                    if (type === "bool") {

                        subEl = <input type="checkbox"
                                       checked={value}
                                       onClick={this.boolChange.bind(this, name)}/>;

                    } else if (type === "enum") {

                        if (this.state.enumOptions[name] && this.state.enumOptions[name].length > 1) {
                            const options = this.state.enumOptions[name];
                            const optionEls = [];
                            for (let j=0; j<options.length; j++) {
                                optionEls.push(
                                    <option value={options[j]}>{options[j]}</option>
                                );
                            }
                            subEl = <select defaultValue={value} onChange={this.enumChange.bind(this, name)}>{optionEls}</select>
                        } else {
                            subEl = <div>{value}</div>; // Setting not supported
                        }

                    } else if (type === "number") {

                        if (isEditable.indexOf(name) > 0) {
                            subEl = <input type="number"
                                           defaultValue={value}
                                           onChange={this.numberChange.bind(this, name)}/>;
                        } else {
                            subEl = <div>{value}</div>; // Setting not supported
                        }
                    }
                }
                const el = <div className={className}>{subEl}</div>;
                result.push(el);
            }
            return <div className="profile-table-column">
                {result}
            </div>;
        },

        getStateColumns: function(data) {
            const columns = [];

            const vList = Object.keys(this.state.stateVars).sort();
            const variables = ["Variable"].concat(vList);

            columns.push(this.getVariableColumn(variables));
            columns.push(this.getStateColumn(vList));
            return columns;
        },

        getTabs: function() {
            return <div className="split-view-table-element split-view-table-element-selected">
                <div className="split-view-table-element-text">
                    State Editor
                </div>
            </div>;
        },

        toggleStateEditor: function() {
            let enabled = this.refs.stateEditor.checked;
            let data = {"enabled": enabled};

            Messages.sendMessage(this.props.activeContext, messageType.TOGGLE_STATE_VARS, data);

            if (enabled) {
                Messages.sendMessage(this.props.activeContext, messageType.STATE_VARS, "getStateVariables");
            }

            this.setState(data);
        },

        render: function() {
            let table = null;

            if (this.state.enabled) {
                table = <div className="profile-table">
                    {this.getStateColumns()}
                </div>
            }

            return <div className="split-view">
                <div className="split-view-table">{this.getTabs()}</div>
                <div className="split-view-content">
                    <div className="state-container">
                        <div className="state-container-child">
                            <div className="heading">States</div>
                            <div>Edit WebGL states. </div>
                            <div>
                                Enable State Editor&nbsp;&nbsp;
                                <input ref="stateEditor" type="checkbox" onClick={this.toggleStateEditor} />
                            </div>
                        </div>
                        {table}
                    </div>
                </div>
            </div>
        }
    });
});
