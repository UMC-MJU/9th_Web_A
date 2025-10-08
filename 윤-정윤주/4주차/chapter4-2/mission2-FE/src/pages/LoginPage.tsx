import useForm from "../hooks/useForm";
import { vaildateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValues: {
            email: '', 
            password: '' 
        },
        validate: vaildateSignin,
    });

    const handleSubmit = () => {};

    // 이메일 또는 비밀번호가 비어있거나, 에러 메시지가 존재하면 버튼 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) ||  // 오류가 있으면 true
        Object.values(values).some((value) => value === "");   // 빈 값이 있으면 true

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps('email')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder="이메일"
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input
                    {...getInputProps('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder="비밀번호"
                />
                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    로그인
                </button>
            </div>
        </div>
    );
};

export default LoginPage;