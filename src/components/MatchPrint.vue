<template>
  <div class="game">
    <div class="top">
      <div>1-1</div>
      <div>場地</div>
    </div>
    <ul class="middle">
      <li>
        <div>隊伍1</div>
        <div>10</div>
      </li>
      <li>
        <div>隊伍2</div>
        <div>2</div>
      </li>
    </ul>
    <div class="bottom">
      <div>2022/01/01</div>
      <div>10:20</div>
    </div>
  </div>
</template>

<script>
export default {};
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
