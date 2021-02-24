import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from 'axios';
import './Deck.css';

const Deck = () => {
	const API = 'https://deckofcardsapi.com/api/deck';

	const [ deck, setDeck ] = useState(null);
	const [ drawn, setDrawn ] = useState([]);
	const [ autoDraw, setAutoDraw ] = useState(false);
	const timerRef = useRef();
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

	useEffect(
		() => {
			async function drawCard() {
				const { deck_id } = deck;

				try {
					const draw = await axios.get(`${API}/${deck_id}/draw/`);
					console.log(draw.data);
					if (draw.data.remaining === 0 && !draw.data.success) {
						setAutoDraw(false);
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
			}
			if (autoDraw && !timerRef.current) {
				timerRef.current = setInterval(async () => {
					await drawCard();
				}, 1000);
			}

			return () => {
				clearInterval(timerRef.current);
				timerRef.current = null;
			};
		},
		[ autoDraw, setAutoDraw, deck ]
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

	const toggleAutoDraw = () => {
		setAutoDraw((a) => !a);
	};

	const shuffleDeck = async () => {
		try {
			const newDeck = await axios.get(`${API}/new/shuffle`);
			setDeck(newDeck.data);
			setDrawn([]);
			setAutoDraw(false);
		} catch (error) {
			alert(error);
		}
	};
	return (
		<div className="Deck">
			{!autoDraw && <button onClick={drawCard}>Draw Single Card</button>}
			<button onClick={toggleAutoDraw}>{autoDraw ? 'Stop Drawing' : 'Start Drawing'}</button>
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
