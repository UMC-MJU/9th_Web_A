interface LpContentProps {
    title: string;
    content: string;
    thumbnail: string;
    isEditMode: boolean;
    editTitle: string;
    editContent: string;
    onTitleChange: (value: string) => void;
    onContentChange: (value: string) => void;
}

export function LpContent({
    title,
    content,
    thumbnail,
    isEditMode,
    editTitle,
    editContent,
    onTitleChange,
    onContentChange,
}: LpContentProps) {
    return (
        <>
        {/* 제목 */}
        {!isEditMode ? (
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            {title}
            </h1>
        ) : (
            <input
            type="text"
            className="text-2xl md:text-3xl font-bold text-center mb-6 w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="제목을 입력하세요"
            />
        )}

        {/* 이미지 */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black shadow-2xl flex items-center justify-center overflow-hidden">
            <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.fallback) {
                    target.src = "/fallback-image.png";
                    target.dataset.fallback = "true";
                }
                }}
            />
            </div>
        </div>

        {/* 본문 */}
        {!isEditMode ? (
            <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line text-center px-6 mb-6">
            {content}
            </div>
        ) : (
            <textarea
            className="w-full text-gray-300 text-sm md:text-base leading-relaxed px-6 mb-6 bg-gray-800 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={editContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
            />
        )}
        </>
    );
}
