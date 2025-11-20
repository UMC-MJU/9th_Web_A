import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {4
    const [scrollY, setScrollY] = useState<number>(0);

    const handleScroll = useThrottle(() => {
        setScrollY(window.scrollY);
    }, 2000);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="h-dev flex flex-col itmes-center justify-center">
            <div>
                <h1>쓰로틀링이 무엇일까요?</h1>
                <p>ScrollY:{scrollY}px</p>
            </div>
        </div>
    );
};

export default ThrottlePage;