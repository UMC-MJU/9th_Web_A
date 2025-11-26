import { useState, useEffect } from "react";

export const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    // ESC 키로 사이드바 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
            close();
        }
        };

        window.addEventListener("keydown", handleKeyDown);

        // 클린업 함수: 메모리 누수 방지
        return () => {
        window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    // 사이드바 열렸을 때 배경 스크롤 방지
    useEffect(() => {
        if (isOpen) {
        // 현재 스크롤 위치 저장
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        } else {
        // 스크롤 위치 복원
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }

        // 클린업 함수
        return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        };
    }, [isOpen]);

    return { isOpen, open, close, toggle };
};