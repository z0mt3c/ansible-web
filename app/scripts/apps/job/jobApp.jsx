var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    _ = require('lodash'),
    $ = require('jquery'),
    List = require('../../components/list').List;

var columns = [
    { key: 'id', value: 'ID' },
    { key: 'title', value: 'Title' },
    { key: 'body', value: 'Body' }
];

var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Jobs
                </h2>

                <List url="http://jsonplaceholder.typicode.com/posts" columns={columns}/>
            </div>
        );
    }
});
