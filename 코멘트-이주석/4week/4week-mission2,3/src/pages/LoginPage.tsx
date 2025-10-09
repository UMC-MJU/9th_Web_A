import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    console.log(values);
  };

  const isValid =
    !Object.values(errors || {}).some((e) => e.length > 0) &&
    !Object.values(values).some((v) => v === "");

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      <div className="relative flex flex-col w-[380px] gap-5 items-center text-center bg-transparent">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-2 text-2xl text-white cursor-pointer hover:text-gray-300 hover:brightness-90 transition-all duration-150"
        >
          &lt;
        </button>

        <h1 className="text-2xl font-bold mb-2">로그인</h1>

        {/* 구글 로그인 버튼 */}
        <button className="relative flex items-center justify-center w-full border border-gray-400 rounded-md py-3 hover:bg-gray-800 transition-all cursor-pointer">
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google 로고"
            className="absolute left-4 w-5 h-5"
          />
          <span className="text-sm">구글 로그인</span>
        </button>

        {/* OR 구분선 */}
        <div className="flex items-center w-full text-gray-400 text-xs gap-2 my-1">
          <div className="flex-1 h-[1px] bg-gray-600" />
          <span>OR</span>
          <div className="flex-1 h-[1px] bg-gray-600" />
        </div>

        {/* 이메일 입력 */}
        <input
          {...getInputProps("email")}
          className={`w-full bg-black text-white border rounded-md p-3 text-base placeholder-gray-400
            ${
              errors.email && touched.email
                ? "border-red-500"
                : "border-gray-500 focus:border-white"
            }`}
          type="email"
          placeholder="이메일을 입력해주세요!"
        />
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm -mt-2">{errors.email}</p>
        )}

        {/* 비밀번호 입력 */}
        <input
          {...getInputProps("password")}
          className={`w-full bg-black text-white border rounded-md p-3 text-base placeholder-gray-400
            ${
              errors.password && touched.password
                ? "border-red-500"
                : "border-gray-500 focus:border-white"
            }`}
          type="password"
          placeholder="비밀번호를 입력해주세요!"
        />
        {errors.password && touched.password && (
          <p className="text-red-500 text-sm -mt-2">{errors.password}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-3 rounded-md text-base font-semibold transition-all duration-200 ${
            isValid
              ? "bg-[#f72585] hover:brightness-90 cursor-pointer"
              : "bg-[#141414] text-gray-300 cursor-not-allowed"
          }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};
