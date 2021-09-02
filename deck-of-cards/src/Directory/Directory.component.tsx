import React, { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import { DectOfCardsArray } from "../Deck";
import "./Directory.component.scss";
import { DeckObj } from "./interface";

/*
    So initially we show only the shuffledCardArray as the main DECK
    1) when user clicks shuffle button, the deck should b randomly shuffled (AC1)
    2) when user clicks on draw from deck, move cards from deck to hand (AC2)
    that is _shuffledCardArray ==> _dropCardArray for the drawValue entered and remove the same from _shuffledCardArray
    3) when user clicks on sort cards, sort _dropCardArray based on Clubs, Spades, Hearts, Diamonds (low to high value) (AC3)
    4.a) when user clicks on save, both _shuffledCardArray and _dropCardArray are saved to local storage (AC4)
    4.b) when user clicks on reset, reset all state variables and local storage (AC4)
*/

const Directory: React.FC = () => {
  const [_shuffledCardArray, setShuffledCardArray] = useState<DeckObj[]>([]); // Using this as the main deck
  const [_dropCardArray, setDropCardArray] = useState<DeckObj[]>([]); // Using this for the cards in hand
  const [drawValue, setDrawValue] = useState<number | undefined>();


  const commonFunction = (array: DeckObj[]): DeckObj[] => {
    const items: any[] = [];
    for (let i = 0; i < array.length; i++) {
      let value =
        array[i].value === 11
          ? "J"
          : array[i].value === 12
          ? "Q"
          : array[i].value === 13
          ? "K"
          : array[i].value === 14
          ? "A"
          : array[i].value;
      let newObj: DeckObj = {
        ...array[i],
        suit: "",
        value: value + " of " + array[i].suit,
      };
      items.push(newObj);
    }
    return items;
  };

  // Using this to load data into state on page load.
  useEffect(() => {
    const persistedItem = JSON.parse(localStorage.getItem("cache") || "{}");
    setShuffledCardArray(persistedItem?._shuffledCardArray || DectOfCardsArray);
    setDropCardArray(persistedItem?._dropCardArray || []);
  }, []);

  const onReset = () => {
    // Changing all state variables to initial state
    setShuffledCardArray(DectOfCardsArray);
    setDropCardArray([]);
    setDrawValue(0);
    localStorage.removeItem("cache");
  };

  const onShuffle = () => {
    const list = [..._shuffledCardArray]; // Made a reference variable to fix your 1st bug
    let m = list.length,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      [list[m], list[i]] = [list[i], list[m]];
    }
    setShuffledCardArray(list);
  };

  const Drawcard = () => {
    if (drawValue) {
      const originalList = _shuffledCardArray.slice(0, drawValue);
      setDropCardArray([..._dropCardArray, ...originalList]);
      setShuffledCardArray(_shuffledCardArray.slice(drawValue));
    }
  };

  const Sortcard = () => {
    if (_dropCardArray.length > 0) {
      /* Sort array in ascending order based on value regardless of their suit.
      Form an object with the suit name and update state based on given suit order
      */
      const sorted: any = {};
      _dropCardArray
        .sort((a, b) => a.value - b.value)
        .forEach((value: any) => {
          sorted[value.suit] = Array.isArray(sorted[value.suit])
            ? [...sorted[value.suit], value]
            : [value];
        });
      setDropCardArray([
        ...(sorted?.clubs || []),
        ...(sorted?.spades || []),
        ...(sorted?.hearts || []),
        ...(sorted?.diamonds || []),
      ]);
    }
  };

  const saveCards = () => {
    localStorage.setItem(
      "cache",
      JSON.stringify({
        _shuffledCardArray,
        _dropCardArray,
      })
    );
    alert("Game saved!!!");
  };

  return (
    <div>
      <div className="directory-menu">
        <div className="menu-item">
          <div className="content">
            <h1 className="title">Reset</h1>
            <button
              className=" subtitle custom-button"
              onClick={() => onReset()}
            >
              Reset the Cards
            </button>
          </div>
        </div>
        <div className="menu-item">
          <div className="content">
            <h1 className="title">Shuffle</h1>
            <button
              className=" subtitle custom-button"
              onClick={() => onShuffle()}
            >
              Shuffle the Cards
            </button>
          </div>
        </div>
        <div className="menu-item">
          <div className="content">
            <h1 className="title">Draw Card from Deck</h1>
            <input
              type="number"
              min="0"
              value={drawValue}
              onChange={(e) => setDrawValue(parseInt(e.target.value))}
            />
            <br />
            <button className=" subtitle custom-button" onClick={Drawcard}>
              Draw cards from the deck
            </button>
          </div>
        </div>
        <div className="menu-item">
          <div className="content">
            <h1 className="title">Sort</h1>
            <button className=" subtitle custom-button" onClick={Sortcard}>
              Sort the Cards
            </button>
          </div>
        </div>
        <div className="menu-item">
          <div className="content">
            <h1 className="title">Save</h1>
            <button className=" subtitle custom-button" onClick={saveCards}>
              Save the Cards
            </button>
          </div>
        </div>
      </div>
      <CardDeck>
        <Card>
          <Card.Body>
            <Card.Title>Deck Of cards</Card.Title>
            <Card.Text>
              {commonFunction(_shuffledCardArray).map(
                (item: DeckObj, index: any) => {
                  return (
                    <li key={index}>
                      <span>{item.value}</span>
                    </li>
                  );
                }
              )}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Deck Of Cards in Hand</Card.Title>
            <Card.Text>
              {commonFunction(_dropCardArray).map(
                (item: DeckObj, index: any) => {
                  return (
                    <li key={index}>
                      <span>{item.value}</span>
                    </li>
                  );
                }
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </CardDeck>
    </div>
  );
};

export default Directory;
