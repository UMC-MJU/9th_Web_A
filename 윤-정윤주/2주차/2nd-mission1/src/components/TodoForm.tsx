import { useState, type FormEvent } from "react";
import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
        const [inputText, setInputText] = useState<string>('');
        const { addTodo } = useTodo();  // Context 사용

        const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const text = inputText.trim();
            if (text) {
                addTodo(text);  // Context의 addTodo 함수 호출
                setInputText('');
            }
        };

    return (
        <form 
        onSubmit={handleAddTodo} 
        className="todo-container__form">
            <input 
            value={inputText}
            onChange={(e) : void => setInputText(e.target.value)}
            type="text" 
            className="todo-container__input" 
            placeholder="할 일 입력"
            required
            />
            <button type="submit" className="todo-container__button">
                추가
            </button>
        </form>
    );
};

export default TodoForm;