import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan} from '@fortawesome/free-solid-svg-icons';
import EditTodos from './EditTodos';

//this is the TodoList , that is created right after the first todo is added.
const AddTodos = ({ toggleTodo, handleEdit , deleteTodo , updateTask, setSearchWord ,searchWord ,searchItem, handleSort , dragOverItem, dragItem}) => {

    return (
    <div className='todo-list'>
        <div className='searchbtn'>
            <input
                type="text"
                className='searchInput'
                placeholder='Search a task...'
                value={searchWord}
                onChange={(e)=>{setSearchWord(e.target.value)}}
            />
        </div>
    {searchItem.map( (allTodo,index) => {
        return (
        <div className='list' key={allTodo.id}>
            {!allTodo.edited?
                (
                <ul>
                    <li
                    key={allTodo.id}
                    draggable
                    onDragStart={(e) => dragItem.current = index}
                    onDragEnter={(e) => dragOverItem.current = index}
                    onDragEnd={handleSort}
                    onDragOver={ (e)=> e.preventDefault }
                    >
                        {!allTodo.completed &&
                        (<label>
                            <div className='listlabel'>
                                <div className='list-item'>
                                    <input
                                        type="checkbox"
                                        name="checkbox"
                                        checked={allTodo.completed}
                                        onChange={e=>{toggleTodo(allTodo.id,e.target.checked)}}
                                    />
                                    <p>{allTodo.task}</p>
                                </div>
                                <div className='btn-group'>
                                    <button
                                        className='btn btn-edit'
                                        onClick={()=>{handleEdit(allTodo.id)}}
                                    >
                                    <FontAwesomeIcon icon={faPencil} size="m"/>
                                    </button><br/>
                                    <button
                                        className='btn btn-danger'
                                        onClick={()=>{deleteTodo(allTodo.id)}}
                                     >
                                    <FontAwesomeIcon icon={faTrashCan} size="m"/>
                                    </button><br/>
                                </div>
                            </div>
                        </label>)
                        }
                    </li>
                </ul>
                ) :
                <EditTodos
                    allTodo={allTodo}
                    updateTask={updateTask}
                />
                }
        </div>
        )
    })}
    </div>
  )
}

export default AddTodos;