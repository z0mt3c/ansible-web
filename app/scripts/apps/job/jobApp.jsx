var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery'),
    List = require('../../components/list').List;

var columns = [
    { key: 'id', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'description', value: 'Description' }
];

var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Jobs
                </h2>

                <List url="/api/job" columns={columns}/>
            </div>
        );
    }
});
