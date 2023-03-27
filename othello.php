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
      p{
        margin: 0;
      }
      .stone {
        background: red;
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }


    </style>
    <title>Hello, world!</title>
  </head>
  <body>
  <div class="container">
      <div class="board row">
        <?php for($i = 0; $i < 64; $i++): ?>
          <div class="grid-col grid" id="grid-<?= $i ;?>">

          </div>
        <?php endfor; ?>
      </div>

      <div class="sideboard">
          <div class="opponent">
            <p>相手</p>
          </div>

          <div class="time">
            <p>経過時間:</p><p>0000</p>
          </div>
          
          <div class="now">
            <p>手番</p>
          </div>

          <div class="turn">
            <p>turn: </p><p>0000</p>
          </div>


          <div class="you">
            <p>あなた</p>
          </div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
<script>
  let board = new Array();
  for(let i = 0; i < 8; i++){
    board.push(new Array(8));
  }
  console.log(board);
      jQuery(function($){
        $('.grid').on('click',function(event){
          let grid = $(this).attr('id');
          $('#' + grid).html('<div class="stone"></div>');
          let num = parseInt(grid.substr(5),10);
          let i = parseInt(num / 8, 10);
          let j = num % 8;
          console.log(board[i][j]);
        });
      });

    </script>

  </body>
</html>