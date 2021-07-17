export default {
  state: {
    todos: [],
  },
  getters: {
    getTodos(state) {
      return state.todos;
    },
  },
  mutations: {
    setTodos(state, todos) {
      state.todos = todos;
    },
    unshiftTodo(state, todo) {
      state.todos.unshift(todo);
    },
    changeTodoWithId(state, todo) {
      state.todos = state.todos.map((todoElem) => {
        if (todoElem.id === todo.id) {
          return todo;
        } else {
          return todoElem;
        }
      });
    },
  },
  actions: {
    async fetchTodos(context) {
      const user = context.getters.getUser;

      const res = await fetch(
        process.env.VUE_APP_API_SERVER + "/api/UserTodos/",
        {
          method: "GET",
          headers: {
            Authorization: user.id + ":" + user.hash,
          },
        }
      );

      const todos = await res.json();

      if (todos instanceof Array) {
        context.commit("setTodos", todos);

        return todos;
      } else {
        return [];
      }
    },
    async createTodo(context, form) {
      const user = context.getters.getUser;

      const res = await fetch(
        process.env.VUE_APP_API_SERVER + "/api/UserTodos/",
        {
          method: "POST",
          headers: {
            Authorization: user.id + ":" + user.hash,
          },
          body: JSON.stringify({
            title: form.title,
            text: form.text,
          }),
        }
      );

      const todo = await res.json();

      context.commit("unshiftTodo", todo);

      return todo;
    },
    async completeTodo(context, id) {
      const user = context.getters.getUser;

      const res = await fetch(
        process.env.VUE_APP_API_SERVER + "/api/UserTodos/?id=" + id,
        {
          method: "PATCH",
          headers: {
            Authorization: user.id + ":" + user.hash,
          },
          body: JSON.stringify({
            key: "complete",
            to: 1,
          }),
        }
      );

      const todo = await res.json();

      context.commit("changeTodoWithId", todo);

      return todo;
    },
    async deleteTodo(id) {
      const user = context.getters.getUser;

      const res = await fetch(
        process.env.VUE_APP_API_SERVER + "/api/UserTodos/?id=" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: user.id + ":" + user.hash,
          },
        }
      );

      const deletedTodo = await res.json();

      context.commit("deleteTodo", deletedTodo);

      return deletedTodo;
    },
  },
};
