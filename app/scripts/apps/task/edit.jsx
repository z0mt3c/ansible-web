var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var Actions = require('../../actions/taskActions');
var Stores = require('../../stores/taskStores');
var RepositoryActions = require('../../actions/repositoryActions');
var RepositoryStores = require('../../stores/repositoryStores');

var SelectProject = React.createClass({
    mixins: [Reflux.connect(RepositoryStores.List, 'repositorys')],
    componentDidMount() {
        RepositoryActions.list();
    },
    render() {
        var options = [{id: '', name: 'Nothing'}].concat(this.state.repositorys);

        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(repository) {
                return (<option value={repository.id} key={repository.id}>{repository.name}</option>);
            })
        );
    }
});

var SelectPlaybook = React.createClass({
    mixins: [Reflux.connect(RepositoryStores.Files, 'files'), Reflux.connect(Stores.Get, 'repository')],
    propTypes: {
        repository: React.PropTypes.string
    },
    componentDidMount() {
        RepositoryActions.files(this.props.repository);
    },
    render() {
        var options = [].concat(this.state.files);

        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(file) {
                return (<option value={file} key={file}>{file}</option>);
            })
        );
    },
    componentWillReceiveProps: function(nextProps) {
        RepositoryActions.files(nextProps.repository);
    }
});


var JobForm = React.createClass({
    mixins: [Router.State, Reflux.connect(Stores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    componentDidMount() {
        var params = this.getParams();

        if (params.id) {
            Actions.get(params.id);
        }

        this.listenTo(Actions.update.completed, this.completed);
        this.listenTo(Actions.create.completed, this.completed);
        this.listenTo(Actions.update.failed, this.failed);
        this.listenTo(Actions.create.failed, this.failed);
    },
    completed() {
        this.props.onSave();
    },
    failed(xhr) {
        var body = JSON.parse(xhr.response);
        var state = this.state || {};
        state._error = body;
        this.setState(state);
    },
    submit(e) {
        e.preventDefault();
        var params = this.getParams();

        if (params.id) {
            Actions.update(this.state);
        } else {
            Actions.create(this.state);
        }
    },
    render() {
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

        var repository = this.state.repository;
        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                       valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                       valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>
                <SelectProject label="Project" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                               valueLink={this.linkState('repository')} bsStyle={bsStyle.repository}/>
                <SelectPlaybook label="Playbook" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                                ref="selectPlaybook" repository={repository} valueLink={this.linkState('playbook')}
                                bsStyle={bsStyle.playbook}/>

                <Input type="select" label="Verbosity" labelClassName="col-xs-2" wrapperClassName="col-xs-10"
                       valueLink={this.linkState('verbosity')} bsStyle={bsStyle.verbosity}>
                    <option value="default">Default</option>
                    <option value="verbose">Verbose</option>
                    <option value="debug">Debug</option>
                </Input>

                <Input type="submit" value="Save" wrapperClassName="col-xs-offset-2 col-xs-10"/>
            </form>
        );
    }
});

module.exports = React.createClass({
    mixins: [Router.Navigation, Router.State],
    componentDidMount() {
    },
    save() {
        this.transitionTo('task_list');
    },
    render() {
        var params = this.getParams();

        return (
            <div className="page-main">
                <h2>
                    {params.id ? 'Edit task' : 'Create task'}
                </h2>

                <JobForm id={params.id} onSave={this.save}/>
            </div>
        );
    }
});