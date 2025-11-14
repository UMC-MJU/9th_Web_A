import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { vaildateSignin, type UserSigninInformation } from "../utils/validate";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // setter 필요 없음, login() 내부에서 토큰 업데이트 처리

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: vaildateSignin,
  });

  // useMutation으로 로그인 처리
  const loginMutation = useMutation({
    mutationFn: (signinData: UserSigninInformation) => login(signinData),
    onSuccess: (redirectPath) => {
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        alert("로그인 실패");
      }
    },
    onError: () => {
      alert("로그인 실패. 이메일 또는 비밀번호를 확인해주세요.");
    },
  });

  // 로그인 버튼 클릭 시
  const handleSubmit = () => {
    loginMutation.mutate(values);
  };

  // 구글 로그인 처리
  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="flex items-center w-[300px] justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-xl font-bold">
          &lt;
        </button>
        <h2 className="text-lg font-semibold">로그인</h2>
        <div className="w-6" />
      </div>

      {/* 구글 로그인 버튼 */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-[300px] border border-gray-400 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        구글 로그인
      </button>

      <div className="flex items-center w-[300px] mt-0 mb-0">
        <hr className="flex-grow border-gray-400 h-px" />
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-400 h-px" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-3">
          <input
            {...getInputProps("email")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="email"
            placeholder="이메일"
          />
          {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}

          <input
            {...getInputProps("password")}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            type="password"
            placeholder="비밀번호"
          />
          {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isDisabled || loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
