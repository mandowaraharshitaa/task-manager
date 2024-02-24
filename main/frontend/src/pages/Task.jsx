import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DateInput, Input, Textarea,TimeInput } from '../components/utils/Inp';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = () => {

  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);

  const [formData, setFormData] = useState({
    title:"",
    description: "",
    duedate: '', // Example date in "YYYY-MM-DD" format
    duetime: "12:00"
  });
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);
  


  useEffect(() => {
    if (mode === "update") 
    {
      
      const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        
        setTask(data.task);
      
        setFormData({ title:data.task.title,
                     description:data.task.description, 
                     duedate:data.task.duedate.split('-').reverse().join('-'), 
                     duetime:data.task.duetime});
      });
    }
  }, [mode, authState, taskId, fetchData]);



  const handleChange = e => {
  
    setFormData({

      ...formData, [e.target.name]: e.target.value
      
    });
    
  }

  const handleReset = e => {
    e.preventDefault();
   
    setFormData({
      title:"",
      description:"",
      duedate:'',
      duetime:''
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === "add") {
      
      const config = { url: "/tasks", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        
        navigate("/");
      });
    }
    else {
      const config = { url: `/tasks/${taskId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  }


  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  )

  return (
    <>
      <MainLayout>
        <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md'>
          {loading ? (
            <Loader />
          ) : (
            <>
              <h2 className='text-center mb-4'>{mode === "add" ? "Add New Task" : "Edit Task"}</h2>
              <div className="mb-4">
              <label htmlFor="title">Title</label>
                <Input type="title" name="title" id="title" value={formData.title} placeholder="Write here.." onChange={handleChange} />
                {fieldError("title")}
              
                <label htmlFor="description">Description</label>
                <Textarea type="description" name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
                {fieldError("description")}
                 
                <label htmlFor="duedate">DueDate</label>
                <DateInput type="date"  name="duedate" id="duedate" value={formData.duedate.toString} placeholder="write" onChange={handleChange} />
                {fieldError("duedate")}

                <label htmlFor="duetime">DueTime</label>
                
                <TimeInput type="time" name="duetime" id="duetime" value={formData.duetime} placeholder="Write here.." onChange={handleChange} />
                {fieldError("duetime")}

              </div>

              <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === "add" ? "Add task" : "Update Task"}</button>
              <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>
              {mode === "update" && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
            </>
          )}
        </form>
      </MainLayout>
    </>
  )
}

export default Task