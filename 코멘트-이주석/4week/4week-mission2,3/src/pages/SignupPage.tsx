import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postSignup, postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const SignupSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    passwordCheck: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
    name: z.string().min(1, "닉네임을 입력해주세요."),
  })
  .refine((d) => d.password === d.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type SignupForm = z.infer<typeof SignupSchema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  // ✅ 객체 반환형 훅 사용 (튜플 아님)
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", passwordCheck: "", name: "" },
  });

  // 이메일 → 비밀번호
  const goNextFromEmail = async () => {
    const ok = await trigger("email");
    if (ok) setStep(2);
  };

  // 비밀번호 → 닉네임
  const goNextFromPassword = async () => {
    const ok = await trigger(["password", "passwordCheck"]);
    const { password, passwordCheck } = getValues();
    if (ok && password === passwordCheck) setStep(3);
  };

  // 최종 제출: 회원가입 → 즉시 로그인 → 토큰 저장 → 홈 이동
  const onSubmit = async (data: SignupForm) => {
    const { email, password, name } = data;

    // 1) 회원가입 (signup 응답엔 토큰 없음) :contentReference[oaicite:4]{index=4}
    await postSignup({ email, password, name });

    // 2) 로그인으로 토큰 발급 받기 (여기에 accessToken 있음) :contentReference[oaicite:5]{index=5}
    const signInRes = await postSignin({ email, password });

    // 3) 토큰 저장 (useLocalStorage는 JSON.stringify로 저장) :contentReference[oaicite:6]{index=6}
    setItem(signInRes.data.accessToken);

    // 4) 홈으로 이동
    navigate("/");
  };

  const emailOk = !!getValues("email") && !errors.email;
  const pwOk =
    !!getValues("password") &&
    !!getValues("passwordCheck") &&
    !errors.password &&
    !errors.passwordCheck;
  const nameOk = !!getValues("name") && !errors.name;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative px-6">
      {/* 뒤로가기 */}
      <button
        onClick={() =>
          step === 1 ? navigate(-1) : setStep((s) => (s === 2 ? 1 : 2))
        }
        className="absolute left-4 top-4 text-2xl text-white cursor-pointer hover:text-gray-300 transition-all"
      >
        &lt;
      </button>

      <h1 className="text-2xl font-bold mb-8">회원가입</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col space-y-5"
      >
        {step === 1 && (
          <>
            <div>
              <input
                type="email"
                placeholder="이메일을 입력해주세요."
                {...register("email")}
                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={goNextFromEmail}
              disabled={!emailOk}
              className={`w-full py-3 rounded-md text-base font-semibold transition-all ${
                emailOk
                  ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                  : "bg-[#141414] text-gray-300 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                {...register("password")}
                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white cursor-pointer"
              >
                {showPw ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPwCheck ? "text" : "password"}
                placeholder="비밀번호를 다시 입력해주세요."
                {...register("passwordCheck")}
                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585]"
              />
              <button
                type="button"
                onClick={() => setShowPwCheck((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-white cursor-pointer"
              >
                {showPwCheck ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.passwordCheck && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.passwordCheck.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={goNextFromPassword}
              disabled={!pwOk}
              className={`w-full py-3 rounded-md text-base font-semibold transition-all ${
                pwOk
                  ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                  : "bg-[#141414] text-gray-300 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-6">
            {/* 프로필 이미지 (기본 회색 원 + 사용자 아이콘) */}
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-inner">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="기본 프로필"
                className="w-16 h-16 opacity-80"
              />
            </div>

            {/* 닉네임 입력 */}
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                {...register("name")}
                className="w-full px-4 py-3 rounded-md bg-[#141414] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f72585] text-white text-center"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* 회원가입 완료 버튼 */}
            <button
              type="submit"
              disabled={!nameOk}
              className={`w-full py-3 rounded-md text-base font-semibold transition-all ${
                nameOk
                  ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
                  : "bg-[#141414] text-gray-300 cursor-not-allowed"
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
