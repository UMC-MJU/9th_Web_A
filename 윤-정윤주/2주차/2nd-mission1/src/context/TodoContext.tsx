import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
    todos: TTodo[];
    completedTodos: TTodo[];
    addTodo: (text: string) => void;
    handleCompleteTodo: (todo: TTodo) => void;
    handleDeleteTodo: (todo: TTodo) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>
(undefined);

export const TodoProvider = ({children}: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);   // 할 일 상태 관리
    const [completedTodos, setCompletedTodos] = useState<TTodo[]>([]);   // 완료된 할 일 상태 관리

    const addTodo = (text: string) => {
        const newTodo: TTodo = {
            id: Date.now(),
            text,
        };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const handleCompleteTodo = (todo: TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setCompletedTodos((prevCompleted) => [...prevCompleted, todo]);
    };
    
    const handleDeleteTodo = (todo: TTodo) => {
        setCompletedTodos((prevCompleted) => prevCompleted.filter((t) => t.id !== todo.id));
    };
    
    return (
        <TodoContext.Provider value={{
            todos,
            completedTodos,
            addTodo,
            handleCompleteTodo,
            handleDeleteTodo
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    // Context가 undefined인 경우 에러 처리
    if (!context) {
        throw new Error("useTodo를 사용하기 위해서는 TodoProvider로 감싸야 합니다.");
    }
    
    // Context가 정의된 경우 반환
    return context; 
}