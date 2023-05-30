function IconMoreHorizontal(props) {
    return (
        <svg
            cursor="pointer"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M13 12 A1 1 0 0 1 12 13 A1 1 0 0 1 11 12 A1 1 0 0 1 13 12 z" />
            <path d="M20 12 A1 1 0 0 1 19 13 A1 1 0 0 1 18 12 A1 1 0 0 1 20 12 z" />
            <path d="M6 12 A1 1 0 0 1 5 13 A1 1 0 0 1 4 12 A1 1 0 0 1 6 12 z" />
        </svg>
    );
}

export default IconMoreHorizontal