import React from "react";
import { useQuery } from "react-apollo";
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

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div>
      {data.todos.map((todo) => (
        <p key={todo.id}>
          <span>{todo.text}</span>
          <button>&times;</button>
        </p>
      ))}
    </div>
  );
}

export default App;
