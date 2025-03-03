export const Rock = () => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" fill="gray" />
            <path d="M9 15h6" stroke="black" strokeWidth="2" />
        </svg>
    )
}
export const Paper = () => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect
                x="7"
                y="4"
                width="10"
                height="16"
                fill="white"
                stroke="black"
            />
            <line x1="9" y1="8" x2="15" y2="8" stroke="black" />
            <line x1="9" y1="12" x2="15" y2="12" stroke="black" />
            <line x1="9" y1="16" x2="15" y2="16" stroke="black" />
        </svg>
    )
}

export const Scissors = () => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="6" cy="6" r="3" fill="white" stroke="black" />
            <circle cx="18" cy="6" r="3" fill="white" stroke="black" />
            <line x1="6" y1="9" x2="12" y2="18" stroke="black" />
            <line x1="18" y1="9" x2="12" y2="18" stroke="black" />
        </svg>
    )
}
