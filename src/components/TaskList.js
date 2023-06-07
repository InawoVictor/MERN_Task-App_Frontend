import { useState } from 'react'
import { toast } from 'react-toastify';
import Task from './Task';
import TaskForm from './TaskForm';
import axios from "axios";
import { URL } from '../App';
import { useEffect } from 'react';
import loader from "../assets/loader.gif"

//http://localhost:5000/api/tasks


const TaskList = () => {

  const [tasksData, setTasksData] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskId, setTaskId] = useState('');


  const[formData, setFormData] = useState({
    name: "",
    completed: false
  })

  const {name} = formData;

  // Handle OnChange
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  }

  // Get All The Tasks
  const getTasks = async () => {
    setIsLoading(true)
      try {
        const {data} = await axios.get(`${URL}/api/tasks`);
        setTasksData(data)
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
  }


  useEffect(() => {
    getTasks()
  }, [])

  //  Create A New Task
  const createTask = async (e) => {
    e.preventDefault();
    if (name === ''){
        return toast.error("Input field cannot be empty");
    }
    try {
        await axios.post(`${URL}/api/tasks`, formData);
        toast.success("Task added successfully");
        setFormData({...formData, name: ""});
        getTasks();
    } catch (error) {
        toast.error(error.message)
    }
  }

  // Delete Task
  const deleteTask = async(id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
      toast.success("Task deleted successfully")
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  // Completed Tasks
  useEffect(() => {
    const cTask = tasksData.filter((task) => {
      return task.completed === true
    })
    setCompletedTasks(cTask)
  }, [tasksData])

  // Get A SIngle Task
  const getSingleTask = async (task) => {
    setFormData({
      name: task.name,
      completed: false
    })
    setTaskId(task._id);
    setIsEditing(true);
  }

 // Update Task
  const updateTask = async (e, id) => {
    e.preventDefault();
    if(name === ""){
      toast.error("Input field can not be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskId}`, formData)
      setFormData({
        ...formData, name: ""
      })
      setIsEditing(false);
      getTasks();
      toast.success("Task successfully edited")
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Set To Completed
  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      getTasks();      
    } catch (error){
      toast.error(error.message)
    }
  }

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm 
        name={name} 
        handleInputChange={handleInputChange} 
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {
        tasksData.length > 0 && (
          <div className="--flex-between --pb">
            <p>
              <b>Total Tasks:</b> {tasksData.length}
            </p>
            <p>
              <b>Completed Tasks:</b> {completedTasks.length}
            </p>
          </div>
        ) 
      }
      <hr/>
      {
        isLoading && (
          <div className='--flex-center'>
            <img src={loader} alt="Loading..." />
          </div>
        )
      }
      {
        !isLoading && tasksData.length === 0 ? (
        <p className='--py'>No task added. Please add a task</p>
        ) : (
          <>
            {
              tasksData.map((task, index) => {
                return(
                  <Task 
                    key={task._id} 
                    task={task} 
                    index={index} 
                    deleteTask={deleteTask}
                    getSingleTask={getSingleTask}
                    setToComplete={setToComplete}
                  /> 
                )
              })
            }
          </>
        )
      }
          
    </div>
  )
}

export default TaskList
