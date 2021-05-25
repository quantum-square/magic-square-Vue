<template>

  <div class="passage">
    <p>
      In recreational mathematics, a square array of numbers, usually positive integers, is called a <b>magic square</b>
      if the sums of the numbers in each row, each column, and both main diagonals are the same. The order of the magic
      square is the number of integers along one side (n), and the constant sum is called the magic constant. If the
      array includes just the positive integers 1, 2,..., n<sup>2</sup>, the magic square is
      said to be normal. Some authors take magic square to mean normal magic square.
    </p>
    <p>
      Magic squares that include repeated entries do not fall under this definition and are referred to as trivial. Some
      well-known examples, including the Sagrada Família magic square and the Parker square are trivial in this sense.
      When all the rows and columns but not both diagonals sum to the magic constant we have semimagic squares
      (sometimes called orthomagic squares).
    </p>
  </div>
</template>

<script>
export default {
  name: "index",

}
</script>

<style scoped>
.passage {
  font-size: 18px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>