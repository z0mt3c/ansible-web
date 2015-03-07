var React = require('react/addons'),
    Router = require('react-router'),
    { Alert, Input } = require('react-bootstrap'),
    _ = require('lodash'),
    $ = require('jquery');

var Reflux = require('reflux');
var JobActions = require('../../actions/jobActions');
var JobStores = require('../../stores/jobStores');
var ProjectActions = require('../../actions/projectActions');
var ProjectStores = require('../../stores/projectStores');

var SelectProject = React.createClass({
    mixins: [Reflux.connect(ProjectStores.List, 'projects')],
    componentDidMount() {
        ProjectActions.list();
    },
    render() {
        var options = [{id: '', name: 'Nothing'}].concat(this.state.projects);

        return React.createElement(Input, React.__spread({}, this.props, {
                type: 'select',
                ref: 'input',
                key: 'input'
            }),
            _.map(options, function(project) {
                return (<option value={project.id} key={project.id}>{project.name}</option>);
            })
        );
    }
});

var SelectPlaybook = React.createClass({
    mixins: [Reflux.connect(ProjectStores.Files, 'files'), Reflux.connect(JobStores.Get, 'project')],
    propTypes: {
        project: React.PropTypes.string
    },
    componentDidMount() {
        ProjectActions.files(this.props.project);
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
        ProjectActions.files(nextProps.project);
    }
});


var JobForm = React.createClass({
    mixins: [Router.State, Reflux.connect(JobStores.Get), React.addons.LinkedStateMixin, Reflux.ListenerMixin],
    componentDidMount() {
        var params = this.getParams();

        if (params.id) {
            JobActions.get(params.id);
        }

        this.listenTo(JobActions.update.completed, this.completed);
        this.listenTo(JobActions.create.completed, this.completed);
        this.listenTo(JobActions.update.failed, this.failed);
        this.listenTo(JobActions.create.failed, this.failed);
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
            JobActions.update(this.state);
        } else {
            JobActions.create(this.state);
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

        var project = this.state.project;
        return (
            <form className="form-horizontal" onSubmit={this.submit}>
                {error}

                <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('name')} bsStyle={bsStyle.name}/>
                <Input type="textarea" label="Description" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('description')} bsStyle={bsStyle.description}/>
                <SelectProject label="Project" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('project')} bsStyle={bsStyle.project}/>
                <SelectPlaybook label="Playbook" labelClassName="col-xs-2" wrapperClassName="col-xs-10" ref="selectPlaybook" project={project} valueLink={this.linkState('playbook')} bsStyle={bsStyle.playbook}/>

                <Input type="select" label="Verbosity" labelClassName="col-xs-2" wrapperClassName="col-xs-10" valueLink={this.linkState('verbosity')} bsStyle={bsStyle.verbosity}>
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
        this.transitionTo('job_list');
    },
    render() {
        var params = this.getParams();

        return (
            <div className="page-main">
                <h2>
                    {params.id ? 'Edit job' : 'Create job'}
                </h2>

                <JobForm id={params.id} onSave={this.save} />
            </div>
        );
    }
});