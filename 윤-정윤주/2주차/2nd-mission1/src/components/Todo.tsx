import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import { useTodo } from "../context/TodoContext";

const Todo = () => {
    const { todos, completedTodos, handleCompleteTodo, handleDeleteTodo } = useTodo();  // 구조 분해 할당으로 Context 값 가져오기

    return (
    <div className="todo-container">
        <h1 className="todo-container__header">TODO LIST</h1>
        <TodoForm />
        <div className="render-container">
            <TodoList 
            title="할 일" 
            todos={todos} 
            buttonLabel='완료'
            buttonColor='#28a745' 
            onClick={handleCompleteTodo}
            />  {/* props로 전달 */}
            <TodoList 
            title="완료" 
            todos={completedTodos}
            buttonLabel='삭제'
            buttonColor='#dc3545' 
            onClick={handleDeleteTodo}
            />  {/* props로 전달 */}
        </div>
    </div>
    );
}

export default Todo;