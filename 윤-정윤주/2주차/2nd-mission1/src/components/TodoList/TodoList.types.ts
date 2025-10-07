import type { TTodo } from "../../types/todo";

export interface TodoListProps {
    title: string;
    todos: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onClick: (todo: TTodo) => void;
}