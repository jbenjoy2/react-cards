import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css';

const Deck = () => {
	const API = 'https://deckofcardsapi.com/api/deck';

	const [ deck, setDeck ] = useState(null);
	const [ drawn, setDrawn ] = useState([]);

	// on page load, go get new deck and save it to state! only do once!
	useEffect(
		() => {
			async function getDeck() {
				let deck = await axios.get(`${API}/new/shuffle/`);
				setDeck(deck.data);
			}
			getDeck();
		},
		[ setDeck ]
	);

	// grab a new card each time the button is clicked!
	const drawCard = async () => {
		try {
			const { deck_id } = deck;
			const draw = await axios.get(`${API}/${deck_id}/draw/`);
			console.log(draw.data);
			if (draw.data.remaining === 0 && !draw.data.success) {
				throw new Error('No more cards!');
			}
			const card = draw.data.cards[0];
			setDrawn((d) => [
				...d,
				{
					id    : card.code,
					value : card.value,
					suit  : card.suit,
					image : card.image
				}
			]);
		} catch (error) {
			alert(error);
		}
	};

	const shuffleDeck = async () => {
		try {
			const newDeck = await axios.get(`${API}/new/shuffle`);
			setDeck(newDeck.data);
			setDrawn([]);
			console.log(deck);
		} catch (error) {
			alert(error);
		}
	};
	return (
		<div className="Deck">
			<button onClick={drawCard}>Draw</button>
			<button onClick={shuffleDeck}>Shuffle</button>
			<div className="Deck-cards">
				{drawn.map((card) => (
					<Card key={card.id} value={card.value} suit={card.suit} image={card.image} />
				))}
			</div>
		</div>
	);
};

export default Deck;
