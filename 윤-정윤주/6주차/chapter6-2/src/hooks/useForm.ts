import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
    initialValues: T;  // { email: '', password: '' }
    validate: (values: T) => Record<keyof T, string>;  // { email: '이메일 형식이 아닙니다.', password: '비밀번호는 8자 이상이어야 합니다.' }
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<string, boolean>>();
    const [errors, setErrors] = useState<Record<string, string>>();

    // 사용자가 입력값을 변경할 때마다 호출되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values,  // 불변성 유지(기존 값 유지)
            [name]: text,
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        });
    };

    // 이메일 또는 비밀번호 input 속성들을 가져오는 것
    const getInputProps = (name: keyof T) => {
        const value = values[name];

        const onChange =(
            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return { value, onChange, onBlur };
    };

    // values 값이 변경될 때마다 유효성 검사 수행
    useEffect(() => {
        const validationErrors = validate(values);
        setErrors(validationErrors);  // 오류 상태 업데이트
    }, [values, validate]);

    return { values, errors, touched, getInputProps };
}

export default useForm;