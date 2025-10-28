import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import z from "zod";
import type { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const schema = z.
    object({
        email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
        password: z
            .string()
            .min(8, { message: "비밀번호는 8자 이상이어야 합니다.", })
            .max(20, { message: "비밀번호는 20자 이하여야 합니다.",}),
        passwordCheck: z.string()
            .min(8, { message: "비밀번호는 8자 이상이어야 합니다.",})
            .max(20, { message: "비밀번호는 20자 이하여야 합니다.",}),
        name: z.string().min(1, { message: "이름을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {  // password와 passwordCheck가 일치하는지 검사
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type FormFields = z.infer<typeof schema>;   // shcema 타입을 추론

const SignupPage = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: 이메일, 2: 비밀번호/비밀번호 확인, 3: 닉네임/회원가입 완료
    const [showPassword, setShowPassword] = useState({
        password: false, 
        passwordCheck: false,
    }); // 비밀번호 표시 여부

    const navigate = useNavigate();  // 회원가입 완료 후 리다이렉트 위해

    const {
        register, 
        control,
        handleSubmit, 
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: { name: "", email: "", password: "", passwordCheck: "",},
        resolver: zodResolver(schema),  // zod 스키마를 리졸버로 사용 -> 유효성 검사
        mode: "onBlur",
    });

    // form 값 실시간 감지
    const watchEmail = useWatch({ control, name: "email" });
    const watchPassword = useWatch({ control, name: "password" });
    const watchPasswordCheck = useWatch({ control, name: "passwordCheck" });
    const watchName = useWatch({ control, name: "name" });

        // 다음 버튼 활성화 조건
    const isStep1Valid = watchEmail && !errors.email;
    const isStep2Valid =
        watchPassword && watchPasswordCheck && !errors.password && !errors.passwordCheck;
    const isStep3Valid = watchName && !errors.name;

    // 폼 제출 핸들러
    const onsubmit:SubmitHandler<FormFields>= async (data) => { 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars  // passwordCheck 제외
        const { passwordCheck, ...rest } = data; // passwordCheck 제외한 나머지 값들
        const response : ResponseSignupDto = await postSignup(rest);  // 회원가입 API 호출
        console.log(response);
        navigate("/");// 회원가입 완료 후 홈 화면으로 이동
    };

    // 비밀번호 표시/숨기기 토글
    const togglePassword = (field: "password" | "passwordCheck") => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // 뒤로 가기
    const goBack = () => {
        if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
            {/* 상단 UI */}
            <div className="flex items-center w-[300px] justify-between mb-4">
                <button onClick={goBack} className="text-xl font-bold">
                    &lt;
                </button>
                <h2 className="text-lg font-semibold">회원가입</h2>
                <div className="w-6" /> {/* 오른쪽 여백 */}
            </div>

            {/* 🔹 구글 로그인 버튼 */}
            <button
                type="button"
                className="flex items-center justify-center w-[300px] border border-gray-400 py-2 rounded-md hover:bg-gray-100 transition"
            >
                <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
                />
                구글 로그인
            </button>

            <div className="flex items-center w-[300px] my-0">
                <hr className="flex-grow border-gray-400 h-px m-0" />
                <span className="mx-2 text-gray-500 text-sm ">OR</span>
                <hr className="flex-grow border-gray-400 h-px m-0" />
            </div>

            <form
                onSubmit={handleSubmit(onsubmit)}
                className="flex flex-col items-center gap-4 w-[300px]"
            >  

                {step === 1 && (
                    <div className="flex flex-col gap-3 w-full">
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="이메일"
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                            ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm">
                                {errors.email.message}
                            </div>
                        )}
                        <button 
                            type="button" 
                            disabled={!isStep1Valid}
                            onClick={() => setStep(2)}
                            className={`w-full py-3 rounded-md text-white ${
                                isStep1Valid
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            다음
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center gap-2 text-sm mb-1">✉️ {watchEmail}</div>   {/* 입력한 이메일 표시 */}
                        
                        <div className="relative">
                            <input
                                {...register('password')}
                                type={showPassword.password ? "text" : "password"}
                                placeholder="비밀번호"
                                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                                ${errors.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword("password")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                            >
                                {showPassword.password ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="text-red-500 text-sm">
                                {errors.password.message}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                {...register('passwordCheck')}
                                type={showPassword.passwordCheck ? "text" : "password"}
                                placeholder="비밀번호 확인"
                                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                                ${errors.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePassword("passwordCheck")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                            >
                                {showPassword.passwordCheck ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.passwordCheck && (
                            <div className="text-red-500 text-sm">
                                {errors.passwordCheck.message}
                            </div>
                        )}

                        <button 
                            type="button" 
                            disabled={!isStep2Valid}
                            onClick={() => setStep(3)}
                            className={`w-full py-3 rounded-md text-white ${
                                isStep2Valid
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            다음
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-3">
                        {/* 프로필 이미지 UI */}
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 overflow-hidden mx-auto">
                            <svg className="w-20 h-20 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>

                        <input
                            {...register('name')}
                            type={"name"}
                            placeholder="이름"
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                            ${errors.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm">
                                {errors.name.message}
                            </div>
                        )}
                
                        <button
                            type="submit"
                            disabled={!isStep3Valid || isSubmitting}  // 제출 중일 때 버튼 비활성화
                            className={`w-full py-3 rounded-md text-white ${
                                isStep3Valid
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`} 
                        >
                            회원가입 완료
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SignupPage;