import React, { useState } from 'react';
import './Card.css';

const Card = ({ value, suit, image }) => {
	const [ { x, y, angle } ] = useState({
		x     : Math.random() * 40 - 20,
		y     : Math.random() * 40 - 20,
		angle : Math.random() * 90 - 45
	});

	const transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
	return <img className="Card" alt={`${value} OF ${suit}`} src={image} style={{ transform }} />;
};

export default Card;
