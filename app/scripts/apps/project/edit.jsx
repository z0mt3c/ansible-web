var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var ProjectActions = require('../../actions/projectActions');
var ProjectStores = require('../../stores/projectStores');

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State, Reflux.connect(ProjectStores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    componentDidMount: function() {
        var params = this.getParams();

        if (params.id) {
            ProjectActions.get(params.id);
        }

        this.listenTo(ProjectActions.update.completed, this.completed);
        this.listenTo(ProjectActions.create.completed, this.completed);
        this.listenTo(ProjectActions.update.failed, this.failed);
        this.listenTo(ProjectActions.create.failed, this.failed);
    },
    completed: function() {
        this.transitionTo('project_list');
    },
    failed: function(xhr) {
        var error = JSON.parse(xhr.response);
        var state = this.state || {};
        state._error = error;
        this.setState(state);
    },
    submit: function(e) {
        e.preventDefault();
        var params = this.getParams();

        if (params.id) {
            ProjectActions.update(this.state);
        } else {
            ProjectActions.create(this.state);
        }
    },
    render: function() {
        var params = this.getParams();
        var error = '';
        var state = this.state;

        var bsStyle = {};

        if (this.state._error) {
            var message = this.state._error.message;
            error = <Alert bsStyle="danger">{message}</Alert>;

            _.reduce(state._error.validation.keys, function(memo, key) {
                memo[key] = 'error';
                return memo;
            }, bsStyle)
        }

        return (
            <div className="page-main">
                <h2>
                    {params.id ? 'Edit project' : 'Create project'}
                </h2>

                {error}

                <form className="form-horizontal" onSubmit={this.submit}>
                    <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                    <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>
                    <Input type="select" label="Type" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('type')} bsStyle={bsStyle.type}>
                        <option value="">Choose</option>
                        <option value="git">Git</option>
                    </Input>
                    <Input type="text" label="URL" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('url')} bsStyle={bsStyle.url}/>
                    <Input type="text" label="Branch" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('branch')} bsStyle={bsStyle.branch}/>

                    <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10"/>
                </form>
            </div>
        );
    }
});