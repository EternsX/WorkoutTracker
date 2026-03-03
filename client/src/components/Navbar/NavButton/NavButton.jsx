import './NavButton.css'

export default function NavButton({text, onClick = null}) {
    return (
        <button className='nav-btn' onClick={onClick}>{text}</button>
    )
}