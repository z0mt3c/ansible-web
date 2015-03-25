var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input, PageHeader } = require('react-bootstrap'),
    _ = require('lodash');

var Reflux = require('reflux');
var Actions = require('../../actions/repositoryActions');
var Stores = require('../../stores/repositoryStores');

module.exports = React.createClass({
    contextTypes: {router: React.PropTypes.func},
    mixins: [Reflux.connect(Stores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    componentDidMount: function() {
        var params = this.context.router.getCurrentParams();

        if (params.id) {
            Actions.get(params.id);
        }
    },
    completed: function() {
        this.context.router.transitionTo('repository_list');
    },
    failed: function(xhr) {
        var error = JSON.parse(xhr.response);
        var state = this.state || {};
        state._error = error;
        this.setState(state);
    },
    submit: function(e) {
        e.preventDefault();
        var params = this.context.router.getCurrentParams();

        if (params.id) {
            Actions.update.triggerPromise(this.state).then(this.completed, this.failed);
        } else {
            Actions.create.triggerPromise(this.state).then(this.completed, this.failed);
        }
    },
    render: function() {
        var params = this.context.router.getCurrentParams();
        var error = '';
        var state = this.state;

        var bsStyle = {};

        if (this.state._error) {
            var message = this.state._error.message;
            error = <Alert bsStyle="danger">{message}</Alert>;

            _.reduce(state._error.validation.keys, function(memo, key) {
                memo[key] = 'error';
                return memo;
            }, bsStyle);
        }

        return (
            <div className="page-main">
                <PageHeader> {params.id ? 'Edit repository' : 'Create repository'}
                    <small></small>
                </PageHeader>

                {error}

                <form className="form-horizontal" onSubmit={this.submit}>
                    <Input type="text" label="Name" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                    <Input type="textarea" label="Description" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>
                    <Input type="select" label="Type" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('type')} bsStyle={bsStyle.type}>
                        <option value="">Choose</option>
                        <option value="git">Git</option>
                    </Input>
                    <Input type="text" label="URL" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('url')} bsStyle={bsStyle.url}/>
                    <Input type="text" label="Branch" labelClassName="col-sm-2" wrapperClassName="col-sm-10" valueLink={this.linkState('branch')} bsStyle={bsStyle.branch}/>

                    <Input type="submit" value="Save" wrapperClassName="col-sm-offset-2 col-sm-10"/>
                </form>
            </div>
        );
    }
});