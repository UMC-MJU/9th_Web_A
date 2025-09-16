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

// 할 일 및 완료 목록 화면에 렌더링하는 함수
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    })

    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    })
};

// 할 일 상태 변경 함수 (완료로 이동)
const completeTodo = (todo: Todo): void => {
    //조건에 맞는 새 배열 만들어서 todos에 다시 할당
    todos = todos.filter((t): boolean => t.id !== todo.id);
    doneTasks.push(todo); // doneTasks 배열로 이동
    renderTasks();
};

// 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
};

// 할 일 아이템(li) 생성 함수
// 반환값: HTMLLIElement -> 생성된 li 태그 반환해서 renderTasks 함수에서 append 가능
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;  // li 안에 텍스트 노드 생성

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', (): void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;   // renderTasks에서 todoList.appendChild(li) 등으로 DOM에 삽입
};