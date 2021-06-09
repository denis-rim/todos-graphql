import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import { gql } from "apollo-boost";

// todo: list todos
// todo: add todos
// todo: toggle todos
// todo: delete todos

const GET_TODOS = gql`
  query getTodos {
    todos {
      id
      done
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        text
        id
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

function App() {
  const [todoText, setTodoText] = useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(""),
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  const handleToggleTodo = async ({ id, done }) => {
    const data = await toggleTodo({ variables: { id, done: !done } });
    console.log("toggle todo: ", data);
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (!todoText.trim()) return;
    const data = await addTodo({
      variables: { text: todoText },
      refetchQueries: [{ query: GET_TODOS }],
    });
    console.log("add todo: ", data);
    // setTodoText("");
  };

  const handleDeleteTodo = async ({ id }) => {
    const isConfirmed = window.confirm("Delete this todo?");
    if (isConfirmed) {
      const data = await deleteTodo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newTodos = prevData.todos.filter((todo) => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
        },
      });
      console.log("delete todo: ", data);
    }
  };

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="ft-l">GraphQL Checklist</h1>
      <form onSubmit={handleAddTodo} className="mb3">
        <input
          className="pa2 f4 b--dashed"
          type="text"
          placeholder="What ToDo?"
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
        />
        <button className="pa2 f4 bg-green" type="submit">
          Add ToDo
        </button>
      </form>
      <div className="flex flex-center justify-center flex-column">
        {data.todos.map((todo) => (
          <p onClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa1 f3 ${todo.done && "strike"}`}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo)}
              className="bg-transparent bn f4"
            >
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
