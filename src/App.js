import MyProvider from "./InfiniteScroll";

const App = () => {
  return <MyProvider />;
};

// eslint-disable-next-line
export default () => {
  return (
    <MyProvider>
      <App />
    </MyProvider>
  );
};
