import { useState } from "react";
import type { FormEvent } from "react";
import type { TTodo } from "../types/todo";

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
            <form onSubmit={handleAddTodo} className="todo-container__form">
                <input 
                value={inputText}   // inputText 상태와 입력창 값 동기화
                onChange={(e) => setInputText(e.target.value)}  // 입력창 값 변경 시 inputText 상태 업데이트
                type="text" 
                className="todo-container__input" 
                placeholder="할 일 입력"
                required
                />
                <button type="submit" className="todo-container__button">
                    추가
                </button>
            </form>
            <div className="render-container">
                <div className="render-container__section">
                    <h2 className="render-container__title">할 일</h2>
                    <ul id="todo-list" className="render-container__list">
                        {todos.map((todo) => (
                            <li key={todo.id} className="render-container__item">
                                <span className="render-container__item-text">{todo.text}</span>
                                <button
                                onClick={() => handleCompleteTodo(todo)}  // todo라는 특정 값을 인자로 전달하여 함수 호출
                                style={{
                                    backgroundColor: '#28a745',
                                }} 
                                className="render-container__item-button">완료</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="render-container__section">
                    <h2 className="render-container__title">완료</h2>
                    <ul id="todo-list" className="render-container__list">
                        {completedTodos.map((todo) => (
                            <li key={todo.id} className="render-container__item">
                                <span className="render-container__item-text">{todo.text}</span>
                                <button
                                onClick={() => handleDeleteTodo(todo)}
                                style={{
                                    backgroundColor: '#dc3545',
                                }} 
                                className="render-container__item-button">삭제</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Todo;