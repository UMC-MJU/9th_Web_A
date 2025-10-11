import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),

    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),

    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),

    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

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
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const { passwordCheck, ...rest } = data;
    console.log(rest);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-[320px] flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold mb-2">로그인</h2>

        <button className="flex items-center justify-center gap-2 w-full border border-gray-500 py-2 rounded-md hover:bg-gray-800 transition">
          구글 로그인
        </button>

        <div className="flex items-center w-full my-2">
          <hr className="flex-1 border-gray-600" />
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-600" />
        </div>
        <input
          {...register("email")}
          type="email"
          placeholder="이메일을 입력해주세요"
          className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
          focus:outline-none  
          ${
            errors?.email ? "border-red-500 bg-red-900/20" : "border-gray-500"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs -mt-2">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
          focus:outline-none  
          ${
            errors?.password
              ? "border-red-500 bg-red-900/20"
              : "border-gray-500"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-xs -mt-2">
            {errors.password.message}
          </p>
        )}

        <input
          {...register("passwordCheck")}
          type="password"
          placeholder="비밀번호를 다시 한 번 입력해주세요."
          className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
          focus:outline-none 
          ${
            errors?.passwordCheck
              ? "border-red-500 bg-red-900/20"
              : "border-gray-500"
          }`}
        />
        {errors.passwordCheck && (
          <p className="text-red-500 text-xs -mt-2">
            {errors.passwordCheck.message}
          </p>
        )}

        <input
          {...register("name")}
          type="name"
          placeholder="이름을 입력해주세요"
          className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm text-white
          focus:outline-none 
          ${errors?.name ? "border-red-500 bg-red-900/20" : "border-gray-500"}`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs -mt-2">{errors.name.message}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-gray-700 text-white py-2 rounded-md text-sm font-medium 
                   hover:bg-[#807bff] transition-colors 
                   disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
