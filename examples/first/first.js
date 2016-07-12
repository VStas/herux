
const ACTION_TODO_ADD = 'TODO_ADD';
const ACTION_LIST_ADD = 'LIST_ADD';

class ListStore {
    constructor() {
        this.list = [];
    }
}

class TodosStore {

    constructor() {
        this.todos = [];
    }

    add(todo) {
        this.todos.push(todo);
        return true;
    }

    size() {
        return this.todos.length;
    }
}

TodosStore.name = /^todo\d+$/;
TodosStore.handlers = [
    {
        type: ACTION_TODO_ADD,
        handler: TodosStore.prototype.add.name
    }
];

