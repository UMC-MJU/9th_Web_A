// HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// Todo 데이터 타입 정의
type Todo = {
    id: number;  // 고유 아이디
    text: string;
}

// 할 일 목록 초기 상태 설정
let todos: Todo[] = [];
let doneTasks: Todo[] = [];