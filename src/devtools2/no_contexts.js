define(["jsx!refresh_icon"], function (RefreshIcon) {
    return React.createClass({
        render: () => {
            return <div className="center">
                <div className="heading">WebGL devtools</div>
                <RefreshIcon />
                <div>No WebGL context found on page. Click the refresh button to check again.</div>
           </div>;
        }
    });
});
