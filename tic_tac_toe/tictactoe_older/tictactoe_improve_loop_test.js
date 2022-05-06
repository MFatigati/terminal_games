function alternatePlayer(currentPlayer) {
  return currentPlayer === "player" ? "computer" : "player";
}

console.log(alternatePlayer("player"))