var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStores = require('../../stores/jobStores.jsx');

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State, Reflux.connect(JobStores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    componentDidMount: function() {
        var params = this.getParams();

        if (params.id) {
            JobActions.get(params.id);
        }

        this.listenTo(JobActions.update.completed, this.completed);
        this.listenTo(JobActions.create.completed, this.completed);
        this.listenTo(JobActions.update.failed, this.failed);
        this.listenTo(JobActions.create.failed, this.failed);
    },
    completed: function() {
        this.transitionTo('job_list');
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
            JobActions.update(this.state);
        } else {
            JobActions.create(this.state);
        }
    },
    render: function() {
        var params = this.getParams();
        var error = '';
        var state = this.state;

        function bsStyle(field) {
            return state._error && state._error.validation.keys.indexOf(field) !== -1 ? 'error' : null;
        };

        if (this.state._error) {
            error = <Alert bsStyle="danger">{this.state._error.message}</Alert>;
        }

        return (
            <div className="page-main">
                <h2>
                    {params.id ? 'Edit job' : 'Create job'}
                </h2>

                {error}

                <form className="form-horizontal" onSubmit={this.submit}>
                    <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('name')} bsStyle={bsStyle('name')}/>
                    <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('description')}bsStyle={bsStyle('description')}/>
                    <Input type="text" label="Project" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('project')} bsStyle={bsStyle('project')}/>
                    <Input type="text" label="Playbook" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('playbook')} bsStyle={bsStyle('playbook')}/>
                    <Input type="select" label="Verbosity" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('verbosity')}>
                        <option value="default">Default</option>
                        <option value="verbose">Verbose</option>
                        <option value="debug">Debug</option>
                    </Input>

                    <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10"/>
                </form>
            </div>
        );
    }
});