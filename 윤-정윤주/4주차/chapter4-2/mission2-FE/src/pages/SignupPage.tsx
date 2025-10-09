import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import type { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";

const schema = z.
    object({
        email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
        password: z
            .string()
            .min(8, {
                message: "비밀번호는 8자 이상이어야 합니다.",
            })
            .max(20, { 
                message: "비밀번호는 20자 이하여야 합니다."
            }),
        passwordCheck: z.string()
            .min(8, {
                message: "비밀번호는 8자 이상이어야 합니다.",
            })
            .max(20, { 
                message: "비밀번호는 20자 이하여야 합니다."
            }),
        name: z.string().min(1, { message: "이름을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {  // password와 passwordCheck가 일치하는지 검사
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
    });

type FormFields = z.infer<typeof schema>;   // shcema 타입을 추론

const SignupPage = () => {
    const {
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),  // zod 스키마를 리졸버로 사용 -> 유효성 검사
        mode: "onBlur",
    });

    const onsubmit:SubmitHandler<FormFields>= async (data) => { 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars  // passwordCheck 제외
        const { passwordCheck, ...rest } = data; // passwordCheck 제외한 나머지 값들
        
        const response : ResponseSignupDto = await postSignup(rest);  // 회원가입 API 호출
        
        console.log(response);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <input
                    {...register('email')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"email"}
                    placeholder="이메일"
                />
                {errors.email && (
                    <div className="text-red-500 text-sm">
                        {errors.email.message}
                    </div>
                )}

                <input
                    {...register('password')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder="비밀번호"
                />
                {errors.password && (
                    <div className="text-red-500 text-sm">
                        {errors.password.message}
                    </div>
                )}

                <input
                    {...register('passwordCheck')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"password"}
                    placeholder="비밀번호 확인"
                />
                {errors.passwordCheck && (
                    <div className="text-red-500 text-sm">
                        {errors.passwordCheck.message}
                    </div>
                )}

                <input
                    {...register('name')}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                    ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                    type={"name"}
                    placeholder="이름"
                />
                {errors.name && (
                    <div className="text-red-500 text-sm">
                        {errors.name.message}
                    </div>
                )}

                <button 
                    disabled={isSubmitting}  // 제출 중일 때 버튼 비활성화
                    type="button" 
                    onClick={handleSubmit(onsubmit)} 
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default SignupPage;