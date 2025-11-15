export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      // 문자열은 JSON.stringify로 한번 감싸서 저장
      const toStore =
        typeof value === "string"
          ? JSON.stringify(value)
          : JSON.stringify(value);
      window.localStorage.setItem(key, toStore);
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) return null;

      // 문자열이 따옴표로 감싸진 경우엔 JSON.parse로 복원
      // 단, 이미 파싱된 문자열이라면 그대로 반환
      try {
        return JSON.parse(item);
      } catch {
        return item.replace(/^"|"$/g, ""); // 문자열 양옆의 따옴표 제거
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};
