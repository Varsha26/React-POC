
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DeckOfCards from './DeckOfCards/DeckOfCards.component';

const  App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={DeckOfCards} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
