import React, {useState} from "react";
import "./style.scss";

interface ReadmoreProps {
    children: string
}

const ReadMore = ({ children }: ReadmoreProps) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <p className="text">
            {isReadMore ? text.slice(0, 300) : text}
            <span onClick={toggleReadMore} className="read-or-hide">
                {isReadMore ? "...read more" : " show less"}
            </span>
        </p>
    );
};

export default ReadMore;