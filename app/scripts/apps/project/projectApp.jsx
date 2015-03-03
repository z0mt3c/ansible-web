var React = require('react'),
    Router = require('react-router'),
    Bootstrap = require('react-bootstrap'),
    Table = Bootstrap.Table,
    Link = Router.Link;

var Projects = React.createClass({
    render: function() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Abc</th>
                        <th>Abc</th>
                        <th>Abc</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Abc</td>
                        <td>Abc</td>
                        <td>Abc</td>
                    </tr>
                    <tr>
                        <td>Abc</td>
                        <td>Abc</td>
                        <td>Abc</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
});


var Main = module.exports = React.createClass({
    mixins: [Router.Navigation],
    render: function() {
        return (
            <div className="page-main">
                <h2>
                    Projects
                </h2>

                <Projects/>
            </div>
        );
    }
});
