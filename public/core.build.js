'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TodoFilters;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-disable no-console */
/* eslint-disable no-unused-vars*/

var VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

var TodoFilters = (_TodoFilters = {}, _defineProperty(_TodoFilters, VisibilityFilters.SHOW_ALL, function () {
  return true;
}), _defineProperty(_TodoFilters, VisibilityFilters.SHOW_COMPLETED, function (todo) {
  return todo.done;
}), _defineProperty(_TodoFilters, VisibilityFilters.SHOW_ACTIVE, function (todo) {
  return !todo.done;
}), _TodoFilters);

// Todo item component

var TodoItem = function (_React$Component) {
  _inherits(TodoItem, _React$Component);

  function TodoItem() {
    _classCallCheck(this, TodoItem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoItem).apply(this, arguments));
  }

  _createClass(TodoItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var text = _props.text;
      var done = _props.done;
      var handleClick = _props.handleClick;
      var index = _props.index;
      var handleDelete = _props.handleDelete;

      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-9' },
          React.createElement(
            'div',
            { className: 'checkbox' },
            React.createElement(
              'label',
              null,
              React.createElement('input', { type: 'checkbox', checked: done, onChange: function onChange() {
                  return handleClick(index);
                } }),
              done ? React.createElement(
                'del',
                null,
                text
              ) : text
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3' },
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-danger', onClick: function onClick() {
                return handleDelete(index);
              } },
            '删除'
          )
        )
      );
    }
  }]);

  return TodoItem;
}(React.Component);

// Todo list component


TodoItem.propTypes = {
  text: React.PropTypes.string.isRequired,
  done: React.PropTypes.bool.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,
  handleDelete: React.PropTypes.func.isRequired
};

var TodoList = function (_React$Component2) {
  _inherits(TodoList, _React$Component2);

  function TodoList() {
    _classCallCheck(this, TodoList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoList).apply(this, arguments));
  }

  _createClass(TodoList, [{
    key: 'render',
    value: function render() {
      var todoList = this.props.todoList.filter(TodoFilters[this.props.filter]);
      var _props2 = this.props;
      var handleClick = _props2.handleClick;
      var handleDelete = _props2.handleDelete;

      return React.createElement(
        'div',
        { id: 'todo-list', className: 'row' },
        React.createElement(
          'div',
          { className: 'col-sm-4 col-sm-offset-4' },
          todoList.map(function (todo, index) {
            return React.createElement(TodoItem, _extends({ key: index, index: index,
              handleClick: handleClick, handleDelete: handleDelete }, todo));
          })
        )
      );
    }
  }]);

  return TodoList;
}(React.Component);

// Todo form component


TodoList.propTypes = {
  todoList: React.PropTypes.array.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  filter: React.PropTypes.string.isRequired
};

var TodoForm = function (_React$Component3) {
  _inherits(TodoForm, _React$Component3);

  function TodoForm() {
    _classCallCheck(this, TodoForm);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TodoForm).apply(this, arguments));
  }

  _createClass(TodoForm, [{
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this4 = this;

      e.preventDefault();
      var todo = { text: this.refs.text.value, done: false };
      superagent.post('/api/todos').send(todo).end(function (err, res) {
        if (err) return console.error(err);
        _this4.props.updateTodoList(res.body);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-sm-8 col-sm-offset-2 text-center' },
          React.createElement(
            'form',
            null,
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement('input', { type: 'text', className: 'form-control input-lg text-center', ref: 'text',
                autofocus: true, placeholder: 'I want to buy a puppy that will love me forever' })
            ),
            React.createElement(
              'button',
              { type: 'submit', className: 'btn btn-primary btn-lg',
                onClick: this.handleSubmit.bind(this) },
              'Add'
            )
          )
        )
      );
    }
  }]);

  return TodoForm;
}(React.Component);

// Filter component


TodoForm.propTypes = {
  updateTodoList: React.PropTypes.func.isRequired
};

var Filter = function (_React$Component4) {
  _inherits(Filter, _React$Component4);

  function Filter() {
    _classCallCheck(this, Filter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Filter).apply(this, arguments));
  }

  _createClass(Filter, [{
    key: 'render',
    value: function render() {
      var _FilterTitle,
          _this6 = this;

      var FilterTitle = (_FilterTitle = {}, _defineProperty(_FilterTitle, VisibilityFilters.SHOW_ALL, 'All'), _defineProperty(_FilterTitle, VisibilityFilters.SHOW_ACTIVE, 'Active'), _defineProperty(_FilterTitle, VisibilityFilters.SHOW_COMPLETED, 'Completed'), _FilterTitle);
      var filters = Object.keys(VisibilityFilters).map(function (key) {
        return VisibilityFilters[key];
      });
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-sm-8 col-sm-offset-2 text-center' },
          React.createElement(
            'div',
            { className: 'btn-group', role: 'group', 'aria-label': '...' },
            filters.map(function (filter) {
              return React.createElement(
                'button',
                { key: filter, type: 'button', className: 'btn btn-default',
                  onClick: function onClick() {
                    return _this6.props.handleShow(filter);
                  } },
                FilterTitle[filter]
              );
            })
          )
        )
      );
    }
  }]);

  return Filter;
}(React.Component);

// Header component


Filter.propTypes = {
  handleShow: React.PropTypes.func.isRequired
};

var Header = function (_React$Component5) {
  _inherits(Header, _React$Component5);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Header).apply(this, arguments));
  }

  _createClass(Header, [{
    key: 'render',
    value: function render() {
      var completedList = this.props.todoList.filter(TodoFilters[VisibilityFilters.SHOW_ACTIVE]);
      return React.createElement(
        'div',
        { className: 'jumbotron text-center' },
        React.createElement(
          'h1',
          null,
          'Im a Todo-aholic',
          React.createElement(
            'span',
            { className: 'label label-info' },
            completedList.length
          )
        )
      );
    }
  }]);

  return Header;
}(React.Component);

Header.propTypes = {
  todoList: React.PropTypes.array.isRequired
};

var Todo = function (_React$Component6) {
  _inherits(Todo, _React$Component6);

  function Todo(props, context) {
    _classCallCheck(this, Todo);

    var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(Todo).call(this, props, context));

    _this8.state = { todoList: [], filter: VisibilityFilters.SHOW_ALL };
    return _this8;
  }

  _createClass(Todo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this9 = this;

      superagent.get('/api/todos').end(function (err, res) {
        if (err) return console.error(err);
        _this9.setState({
          todoList: res.body
        });
        console.log(res.body);
      });
    }
  }, {
    key: 'updateTodoList',
    value: function updateTodoList(todoList) {
      this.setState({ todoList: todoList });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(index) {
      var todoList = this.state.todoList;
      if (index < 0 || index > todoList.length) {
        console.error('index out of bounds');
      } else {
        todoList[index].done = !todoList[index].done;
        this.setState({ todoList: todoList });
        superagent.put('/api/todos').send(todoList[index]).end(function (err, res) {
          if (err) return console.error(err);
          console.log(res.body);
        });
      }
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(index) {
      var todoList = this.state.todoList;
      if (index < 0 || index > todoList.length) {
        console.error('index out of bounds');
      } else {
        var todo = todoList[index];
        delete todoList[index];
        this.setState({ todoList: todoList });
        superagent.del('/api/todos/' + todo._id).end(function (err, res) {
          if (err) console.error(err);
          console.log(res.body);
        });
      }
    }
  }, {
    key: 'handleShow',
    value: function handleShow(filter) {
      this.setState({ filter: filter });
    }
  }, {
    key: 'render',
    value: function render() {
      var todoList = this.state.todoList;
      return React.createElement(
        'div',
        null,
        React.createElement(Header, { todoList: todoList }),
        React.createElement(Filter, { handleShow: this.handleShow.bind(this) }),
        React.createElement(TodoList, _extends({}, this.state, { handleClick: this.handleClick.bind(this),
          handleDelete: this.handleDelete.bind(this) })),
        React.createElement(TodoForm, { updateTodoList: this.updateTodoList.bind(this) })
      );
    }
  }]);

  return Todo;
}(React.Component);

ReactDOM.render(React.createElement(Todo, null), document.getElementById('app'));
