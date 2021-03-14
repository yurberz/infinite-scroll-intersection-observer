import { useState, useEffect, useReducer, useContext, useRef, createContext } from "react";
import styled from "styled-components";

const Div = styled.div`
  margin: 0 auto;
  max-width: 600px;

  li {
    padding: 16px;
    margin: 16px;
    min-height: 100px;
    background-color: salmon;
  }

  span {
    display: block;
    padding: 16px 0px;
  }
`;

const allData = new Array(45).fill(0).map((_val, i) => i + 1);

const perPage = 10;

const types = {
  start: "START",
  loaded: "LOADED",
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.start:
      return { ...state, loading: true };
    case types.loaded:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.newData],
        more: action.newData.length === perPage,
        after: state.after + action.newData.length,
      };
    default:
      throw new Error("Don't understand action");
  }
};

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    more: true,
    data: [],
    after: 0,
  });

  const { loading, data, after, more } = state;

  const load = () => {
    dispatch({ type: types.start });

    setTimeout(() => {
      const newData = allData.slice(after, after + perPage);
      dispatch({ type: types.loaded, newData });
    }, 300);
  };

  return <MyContext.Provider value={{ loading, data, more, load }}>{children}</MyContext.Provider>;
};

const App = () => {
  const { data, loading, more, load } = useContext(MyContext);

  const loader = useRef(load);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loader.current();
        }
      },
      { threshold: 1 }
    )
  );

  const [element, setElement] = useState(null);

  useEffect(() => {
    loader.current = load;
  }, [load]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <Div>
      <ul>
        {data.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
      {!loading && more && <div ref={setElement}></div>}
      {loading && <p>Loading...</p>}
    </Div>
  );
};

// eslint-disable-next-line
export default () => {
  return (
    <MyProvider>
      <App />
    </MyProvider>
  );
};
