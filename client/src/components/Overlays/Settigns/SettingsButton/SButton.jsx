import './SButton.css'

export default function SButton({text, onClick = null}) {
    return (
        <button className='s-btn' onClick={onClick}>{text}</button>
    )
}