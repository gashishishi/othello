<!doctype html>
<html lang="jp">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
      body *{
        box-sizing: border-box;
      }
      .board>div{
        height: 12.5%;
      }

      .board>div, .sideboard{        
        border: 2px black solid;
      }

      .container{
        display: flex;
        margin: auto;
        width: 800px;
      }

      .board{
        background-color: green;
        width: 600px;
        height: 600px;
      }
      .sideboard{
        display: flex;
        flex-direction: column;
        height: 600px;
      }
      .grid-col {
        width : 12.5%;
      }

      .row{
        display: flex;
        flex-wrap: wrap;
      }

      .sideboard{
        width: 200px;
      }

      .time, .turn {
        display: flex;
        justify-content: space-around;
        border: 1px black solid;
        height: 40px;
      }

      .opponent, .you, .now{
        border: 1px black solid;

        height: 200px;
      }

      #op-stone, #your-stone, #now-player{
        width: 100px;
        height: 100px;
      }

      p{
        margin: 0;
      }
      .stone.black, .stone.white {
        border: 1px solid black;
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      .white {
        background-color: white;
      }
      .black{
        background-color: black;
      }


    </style>
    <title>Hello, world!</title>
  </head>
  <body>
  <div class="container">
      <div class="board row" id="board">
        <?php for($i = 0; $i < 8; $i++): ?>
          <?php for($j = 0; $j < 8; $j++): ?>
              <?php if($i .$j === '33' || $i .$j=== '44'): ?>
                <div class="grid-col grid" id="grid-<?= $i .$j ;?>">
                  <div class="stone white"></div>
                </div>
              <?php elseif($i .$j === '34' || $i .$j === '43'): ?>
                <div class="grid-col grid" id="grid-<?= $i .$j ;?>">
                  <div class="stone black"></div>
                </div>
              <?php else: ?>
                <div class="grid-col grid" id="grid-<?= $i .$j ;?>">
                <div class="stone"></div>
                </div>
                <?php endif; ?>
          <?php endfor; ?>
        <?php endfor; ?>
      </div>

      <div class="sideboard" id="sideboard">
          <div class="opponent" id="opponent">
            <p>相手</p>
            <div  id="op-stone">
          </div>

          <div class="time" id="time">
            <p>経過時間:</p><p id="time">0000</p>
          </div>
          
          <div class="now" id="now">
            <p>手番</p>
            <div class="now-player" id="now-player">

            </div>
          </div>

          <div class="turn" id="turn">
            <p>turn: </p><p id="turn-num">1</p>
          </div>


          <div class="you">
            <p>あなた</p>
            <div id="your-stone"></div>
          </div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
<script src="js/othello.js">

    </script>

  </body>
</html>