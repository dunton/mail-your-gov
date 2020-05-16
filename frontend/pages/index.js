import Editor from "../components/Editor";
import Venmo from "../components/Venmo";

const Home = (props) => (
  <div>
    <Editor {...props} />
    <Venmo />
  </div>
);

export default Home;
