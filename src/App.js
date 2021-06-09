import React from "react";
import { useMutation, useQuery } from "react-apollo";
import { gql } from "apollo-boost";

// todo: list todos
// todo: add todos
// todo: toggle todos
// todo: delete todos
// todo: edit todos

const GET_TODOS = gql`
  query getTodos {
    todos {
      id
      done
      text
    }
  }
`;

const TOGGLE_TODOS = gql`
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

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODOS);

  const handleToggleTodo = async ({ id, done }) => {
    const data = await toggleTodo({ variables: { id, done: !done } });
    console.log(data);
  };

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="ft-l">GraphQL Checklist</h1>
      <form className="mb3">
        <input
          className="pa2 f4 b--dashed"
          type="text"
          placeholder="What ToDo?"
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
            <button className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
