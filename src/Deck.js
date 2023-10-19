import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import axios from 'axios';
import uuid from 'react-uuid';

const Deck = () => {
	const deckCount = useRef();
	const INITIAL_STATE = {
		id: '',
		cards: [],
	};
	const [deck, setDeck] = useState(INITIAL_STATE);

	useEffect(function setDeckOnRender() {
		async function setDeckAsync() {
			const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle');

			if (res.data.success) {
				setDeck({
					id: res.data.deck_id,
					cards: [],
				});
				deckCount.current = res.data.remaining;
			}
		}
		setDeckAsync();
	}, []);

	const handleDraw = async () => {
		if (deckCount.current > 0) {
			const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.id}/draw/?count=1`);

			if (res.data.success === true) {
				deckCount.current = res.data.remaining;
				let deckCopy = { ...deck };
				deckCopy.cards.push(res.data.cards[0]);
				setDeck(deckCopy);
			} else {
				alert('Error: problem drawing card!');
			}
		} else {
			alert('Error: no cards remaining!');
		}
	};

	const handleShuffle = async (evt) => {
		evt.target.disabled = true;
		const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.id}/shuffle`);

		if (res.data.success === true) {
			deckCount.current = res.data.remaining;
			setDeck({
				id: res.data.deck_id,
				cards: [],
			});
			evt.target.disabled = false;
		} else {
			alert('Error: problem shuffling deck!');
		}
	};

	return (
		<>
			<button className="Deck-Shuffle-Btn" onClick={handleShuffle}>
				Shuffle Deck
			</button>

			<button className="Deck-Draw-Btn" onClick={handleDraw}>
				Draw Card
			</button>

			<div className="Deck">
				{deck.cards.map((c) => (
					<Card img={c.image} suit={c.suit} val={c.value} key={uuid()} />
				))}
			</div>
		</>
	);
};

export default Deck;
