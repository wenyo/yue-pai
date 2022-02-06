<template>
  <div class="game">
    <div class="top">
      <div>1-1</div>
      <div>{{ game.place }}</div>
    </div>
    <ul class="middle">
      <li>
        <div>{{ game.player1.id }}</div>
        <div>{{ game.player1.score }}</div>
      </li>
      <li>
        <div>{{ game.player2.id }}</div>
        <div>{{ game.player1.score }}</div>
      </li>
    </ul>
    <div class="bottom">
      <div>{{ game.date }}</div>
      <div>{{ game.time }}</div>
    </div>
  </div>
</template>

<script>
export default { props: ["game"] };
</script>
<style lang="scss" scoped>
.game {
  width: fit-content;
}
.top,
.bottom {
  display: flex;
  justify-content: space-between;
}

.middle {
  li {
    width: 150px;
    display: flex;
  }
  div {
    border: 1px solid $dark-100;
    padding: 2px;
    box-sizing: border-box;
    &:first-child {
      width: 70%;
    }
    &:last-child {
      width: 30%;
    }
  }
}
</style>
