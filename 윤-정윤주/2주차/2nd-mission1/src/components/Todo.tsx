import { useState, type FormEvent } from "react";
import type { TTodo } from "../types/todo";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);   // 할 일 상태 관리
    const [completedTodos, setCompletedTodos] = useState<TTodo[]>([]);   // 완료된 할 일 상태 관리
    const [inputText, setInputText] = useState<string>('');   // 입력창 상태 관리
    
    const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();  // 폼 제출 시 페이지 새로고침 방지
        if (inputText.trim() === '') return;  // 빈 문자열 입력 방지
    
        if (inputText) {
            const newTodo: TTodo = {
                id: Date.now(),  // 고유 ID 생성
                text: inputText,
            };
            setTodos((prevTodos) => [...prevTodos, newTodo]);  // 새로운 할 일 추가
            setInputText('');  // 입력창 초기화
        }
    };
    
    const handleCompleteTodo = (todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setCompletedTodos((prevCompleted) => [...prevCompleted, todo]);
    };
    
    const handleDeleteTodo = (todo: TTodo) => {
        setCompletedTodos((prevCompleted) => prevCompleted.filter((t) => t.id !== todo.id));
    };
    
    return (
    <div className="todo-container">
        <h1 className="todo-container__header">TODO LIST</h1>
        <TodoForm 
            inputText={inputText}
            setInputText={setInputText}
            handleAddTodo={handleAddTodo}
        /> {/* Props로 상태와 함수 전달 */}
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