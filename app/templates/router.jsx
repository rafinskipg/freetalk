var Dashboard = require('./users.jsx').Dashboard;

var App = React.createClass({
  render: function () {
    return (
      <div>
        <div className="header">
          <ul className="nav nav-pills pull-right">
            <li className="active"><Link to="app">Dashboard</Link></li>
            <li><Link to="app">Dashboard</Link></li>
          </ul>
          <h3 className="text-muted">webrtcbase</h3>
        </div>

        {/* this is the important part */}
        <RouteHandler/>
      </div>
    );
  }
});



function start () {
  var routes = (
    <Route name="app" path="/" handler={App}>
      <DefaultRoute handler={Dashboard} />
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
  });
}

module.exports = {
  start: start
}