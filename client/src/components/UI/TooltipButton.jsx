import './TooltipButton.css'

export default function TooltipButton({
    label,
    children,
    className = "",
    ...props
}) {
    return (
        <button className={`icon-btn ${className}`} {...props}>
            {children}
            <span className="tooltip">{label}</span>
        </button>
    );
}