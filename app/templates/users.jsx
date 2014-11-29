var events = require('../scripts/events');

var UserRow = React.createClass({
  getInitialState: function() {
    return {setting: this.props.setting};
  },
  handleClick: function(ev){
    events.trigger('startCall', this.props.user);
  },
  render: function() {
    return (
      <div onClick={this.handleClick}>
        {this.props.user.name}
      </div>
    );
  }
});

var UsersBox = React.createClass({
  getInitialState: function(props){
    //Suscribe to users data
    events.suscribe('users', function(users){
      if(this.isMounted()){
        this.setState({users: users});
      }
    }.bind(this));

    props = props || this.props;

    // Set initial application state using props
    return {
      users: props.users || []
    };

  },

  render: function() {
      var self = this;
      var rows = [];
      
      this.state.users.forEach(function(user) {
        rows.push(<UserRow user={user} />);
      });

      return (
          <div>
            <h4>Users connected</h4>
            {rows}
          </div>
      );
  }
});


var Dashboard = React.createClass({
  render: function() {
      return (
          <div className="row">
            <div className="col-xs-4 leftColumn">
              <UsersBox/>
            </div>
            <div className="col-xs-8 rightColumn">
              <video id="video" autoplay></video>
            </div>
          </div>
      );
  }
});


module.exports = {
  Dashboard: Dashboard
}