import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="app">
      <div className="task-container">
        <TaskList />
      </div>
      <ToastContainer />
    </div>
  );
}

export const URL = process.env.REACT_APP_SERVER_URL;

export default App;
