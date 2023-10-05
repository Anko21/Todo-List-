import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import React, { useRef } from 'react'
import AddTodos from './AddTodos';
import CompletedTodos from './CompletedTodos';
import useAutoFocus from "./useAutoFocus"
import { useMemo } from 'react';

function App() {

const [title , setTitle] = useState() ;
const [newItem , setNewItem] = useState() ;
const [allTodos,setAllTodos]=useState(() => JSON.parse(localStorage.getItem("MyTodos")) || []);
const [showAllTasks, setShowAlltasks] = useState();
const [searchWord , setSearchWord] = useState();
const itemInput=useAutoFocus();

//creating an array to store the new todos
const addTodo = () => {
const newTodo = {
    task:newItem,
    id:crypto.randomUUID(),
    edited:false,
    completed:false
    }
    setAllTodos([
        ...allTodos , newTodo
    ])
}

const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
    setNewItem('');
    setSearchWord('')
}

useEffect(()=>{
    localStorage.setItem('MyTodos',JSON.stringify(allTodos))
  },[allTodos])

//Check item as completed
const toggleTodo = (id) => {
    setAllTodos((currentTodos) => {
        return currentTodos.map(todo => {
            if (todo.id === id) {
            return {...todo, completed:!todo.completed}
            }
            return todo
        })
    })
}

//Delete Todo item
const deleteTodo = (id) => {
    const newTodos = allTodos.filter(todo => todo.id !== id)
    setAllTodos(newTodos)
}

//Edit todo item
function handleEdit(id) {
    setAllTodos((todos) => {
        let newArray=[]
        for (let i=0; i < todos.length; i++) {
        const todo = todos[i]
        if (todo.id === id) {
            newArray.unshift({ ...todo, edited : !todo.edited })
        } else {
            newArray.push(todo)
        }
        }
    return newArray
    })
}

//Update edited todo item/ update task buton
const updateTask= ( updatedTodo , id)=>{
    setAllTodos(allTodos.map(todo=>todo.id===id ? {
      ...todo,  task : updatedTodo, edited:!todo.edited
      }: todo
  ))}

//Add search functionality
const searchWordToLowerCase = () => {
    return searchWord.toLowerCase()
}

const searchItem =  useMemo(() =>{
    if(searchWord){
        return allTodos.filter( todo => {
        return todo.task.toLowerCase().includes(searchWordToLowerCase())
        })
    } else {
    return allTodos
}
  }, [allTodos , searchWord])


//Add drag and drop functionality 
//dragItem and dragOverItem store
const dragItem = useRef(null)
const dragOverItem = useRef(null)

//handle sorting
const handleSort = () => {
    let allTodoAfterDrag = [...allTodos]

    //remove and save dragged item content
    const draggedItemContent = allTodoAfterDrag.splice(dragItem.current, 1)[0]

    //switch the position
    allTodoAfterDrag.splice(dragOverItem.current, 0 , draggedItemContent)

    //reset the position
    dragItem.current = null
    dragOverItem.current = null

    //update the Alltodos arrray
    setAllTodos(allTodoAfterDrag)
}

  return(
  <div className = 'container'>
    <div className = 'box'>
        <form className = 'form' onSubmit={handleSubmit}>
            <div className='header'>
                <input
                type="text"
                className='title'
                placeholder='Title'
                name="Title"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
                ref={itemInput}
                />
                <div className="remaining-tasks">
                    Remaining Todos : {allTodos.filter((allTodo)=>!allTodo.completed).length}
                </div>
            </div>
            <div  className = 'add-item'>
                <input
                type='text'
                id='newItem'
                placeholder='Add a task'
                name="newItem"
                className='new-item'
                value={newItem}
                onChange={(e)=>{setNewItem(e.target.value)}}
                />
                <button className='btn'type="submit" disabled={!newItem}>Add</button>
            </div>
        </form>
        <div className='filter'>
            <p>Filter :</p>
            <select
                className='viewOptions'
                name='viewOptions'
                value={showAllTasks}
                onChange={(e)=>{setShowAlltasks(e.target.value)}}
                >
                    <option value="" selected >All Tasks</option>
                    <option value = "completed-only">Completed Tasks</option>
            </select>
        </div>

        {showAllTasks !== "completed-only" ?
        <>
        <AddTodos
            searchItem={searchItem}
            toggleTodo = {toggleTodo}
            handleEdit = {handleEdit}
            deleteTodo = {deleteTodo}
            updateTask = {updateTask}
            searchWord = {searchWord}
            setSearchWord = {setSearchWord}
            handleSort = {handleSort}
            dragOverItem= {dragOverItem} 
            dragItem = {dragItem}
        />
        <CompletedTodos
            searchItem={searchItem}
            toggleTodo = {toggleTodo}
            deleteTodo = {deleteTodo}
        />
        </>
        :
        <CompletedTodos
        searchItem={searchItem}
        toggleTodo = {toggleTodo}
        deleteTodo = {deleteTodo}
    />
    }
    </div>
  </div>
  )
}

export default App;
