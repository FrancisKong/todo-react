/* eslint-disable no-console */
/* eslint-disable no-unused-vars*/

const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

const TodoFilters = {
  [VisibilityFilters.SHOW_ALL]: () => true,
  [VisibilityFilters.SHOW_COMPLETED]: todo => todo.done,
  [VisibilityFilters.SHOW_ACTIVE]: todo => !todo.done,
};

// Todo item component
class TodoItem extends React.Component {

  static propTypes = {
    text: React.PropTypes.string.isRequired,
    done: React.PropTypes.bool.isRequired,
    handleClick: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    handleDelete: React.PropTypes.func.isRequired,
  };

  render() {
    const { text, done, handleClick, index, handleDelete } = this.props;
    return (
      <div className="row">
        <div className="col-xs-9">
          <div className="checkbox">
            <label>
              <input type="checkbox" checked={done} onChange={() => handleClick(index)}/>
              {done ? (<del>{text}</del>) : text}
            </label>
          </div>
        </div>
        <div className="col-xs-3">
          <button type="button" className="btn btn-danger" onClick={() => handleDelete(index)}>
            删除
          </button>
        </div>
      </div>
    );
  }
}

// Todo list component
class TodoList extends React.Component {
  static propTypes = {
    todoList: React.PropTypes.array.isRequired,
    handleClick: React.PropTypes.func.isRequired,
    filter: React.PropTypes.string.isRequired,
  };
  render() {
    const todoList = this.props.todoList.filter(TodoFilters[this.props.filter]);
    const { handleClick, handleDelete } = this.props;
    return (
      <div id="todo-list" className="row">
        <div className="col-sm-4 col-sm-offset-4">
          {todoList.map((todo, index) => <TodoItem key={index} index={index}
           handleClick={handleClick} handleDelete={handleDelete} {...todo} />)}
        </div>
      </div>
    );
  }
}

// Todo form component
class TodoForm extends React.Component {

  static propTypes = {
    updateTodoList: React.PropTypes.func.isRequired,
  };

  handleSubmit(e) {
    e.preventDefault();
    const todo = { text: this.refs.text.value, done: false };
    superagent.post('/api/todos')
      .send(todo)
      .end((err, res) => {
        if (err) return console.error(err);
        this.props.updateTodoList(res.body);
      });
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-8 col-sm-offset-2 text-center">
          <form>
             <div className="form-group">
                <input type="text" className="form-control input-lg text-center" ref="text"
                autofocus placeholder="I want to buy a puppy that will love me forever"/>
              </div>
              <button type="submit" className="btn btn-primary btn-lg"
               onClick={this.handleSubmit.bind(this)}>Add</button>
          </form>
         </div>
      </div>
    );
  }
}

// Filter component
class Filter extends React.Component {

  static propTypes = {
    handleShow: React.PropTypes.func.isRequired,
  }

  render() {
    const FilterTitle = {
      [VisibilityFilters.SHOW_ALL]: 'All',
      [VisibilityFilters.SHOW_ACTIVE]: 'Active',
      [VisibilityFilters.SHOW_COMPLETED]: 'Completed',
    };
    const filters = Object.keys(VisibilityFilters).map(key => VisibilityFilters[key]);
    return (
      <div className="row">
        <div className="col-sm-8 col-sm-offset-2 text-center">
          <div className="btn-group" role="group" aria-label="...">
            {filters.map(filter =>
              <button key={filter} type="button" className="btn btn-default"
              onClick={() => this.props.handleShow(filter)}>
                {FilterTitle[filter]}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

}

// Header component
class Header extends React.Component {
  static propTypes = {
    todoList: React.PropTypes.array.isRequired,
  };

  render() {
    const completedList = this.props.todoList.filter(TodoFilters[VisibilityFilters.SHOW_ACTIVE]);
    return (
      <div className="jumbotron text-center">
        <h1>Im a Todo-aholic
          <span className="label label-info">{completedList.length}</span>
        </h1>
      </div>
    );
  }
}

class Todo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { todoList: [], filter: VisibilityFilters.SHOW_ALL };
  }

  componentDidMount() {
    superagent.get('/api/todos')
      .end((err, res) => {
        if (err) return console.error(err);
        this.setState({
          todoList: res.body,
        });
        console.log(res.body);
      });
  }

  updateTodoList(todoList) {
    this.setState({ todoList });
  }

  handleClick(index) {
    const todoList = this.state.todoList;
    if (index < 0 || index > todoList.length) {
      console.error('index out of bounds');
    } else {
      todoList[index].done = !todoList[index].done;
      this.setState({ todoList });
      superagent.put('/api/todos')
        .send(todoList[index])
        .end((err, res) => {
          if (err) return console.error(err);
          console.log(res.body);
        });
    }
  }

  handleDelete(index) {
    const todoList = this.state.todoList;
    if (index < 0 || index > todoList.length) {
      console.error('index out of bounds');
    } else {
      const todo = todoList[index];
      delete todoList[index];
      this.setState({ todoList });
      superagent.del(`/api/todos/${todo._id}`)
        .end((err, res) => {
          if (err) console.error(err);
          console.log(res.body);
        });
    }
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  render() {
    const todoList = this.state.todoList;
    return (
      <div>
        <Header todoList={todoList}/>
        <Filter handleShow={this.handleShow.bind(this)}/>
        <TodoList {...this.state} handleClick={this.handleClick.bind(this)}
        handleDelete={this.handleDelete.bind(this)}/>
        <TodoForm updateTodoList={this.updateTodoList.bind(this)}/>
      </div>
    );
  }
}

ReactDOM.render(<Todo />, document.getElementById('app'));
