import './OButton.css'

export default function OButton({text, onClick = null}) {
    return (
        <button className='o-btn' onClick={onClick}>{text}</button>
    )
}