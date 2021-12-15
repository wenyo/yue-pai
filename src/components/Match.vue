<template>
  <li>
    <div>
      <input class="w-70" type="text" name="" id="" />
      <input class="w-30" type="number" name="" id="" />
    </div>
    <div>
      <input class="w-70" type="text" name="" id="" />
      <input class="w-30" type="number" name="" id="" />
    </div>
    <div>
      <input class="w-50" type="date" name="" id="" />
      <input class="w-50" type="text" name="" id="" />
    </div>
  </li>
</template>

<style lang="scss" scoped>
li {
  display: flex;
  flex-direction: column;
  & > div {
    width: 100%;
  }

  .w-70 {
    width: 70%;
  }
  .w-30 {
    width: 30%;
  }
  .w-50 {
    width: 50%;
  }
}
</style>