"use client";

//styles
import "./button.scss";

const Button = ({text, onClick}) =>{
    return(
        <div className="button-container" onClick={onClick}>
            <div className="button-text">
                {text}
            </div>
        </div>
    )
}

export default Button;