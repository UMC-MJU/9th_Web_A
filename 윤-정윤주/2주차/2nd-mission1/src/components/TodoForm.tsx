interface TodoFormProps {
    inputText: string;
    setInputText: (input: string) => void;
    handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => void;
}

const TodoForm = ({ inputText, setInputText, handleAddTodo }:
    TodoFormProps) => {
    return (
        <form 
        onSubmit={handleAddTodo} 
        className="todo-container__form">
            <input 
            value={inputText}   // inputText 상태와 입력창 값 동기화
            onChange={(e) : void => setInputText(e.target.value)}  // 입력창 값 변경 시 inputText 상태 업데이트
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