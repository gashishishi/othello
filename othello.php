<!doctype html>
<html lang="jp">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="style.css">
  <style>

  </style>
  <title>オセロ</title>
</head>

<body>
  <div class="container">
    <div class="board-wrapper">
      <div class="board row" id="board">
        <?php for ($i = 0; $i < 8; $i++) : ?>
          <?php for ($j = 0; $j < 8; $j++) : ?>
            <?php if ($i . $j === '33' || $i . $j === '44') : ?>
              <div class="grid-col grid" id="grid-<?= $i . $j; ?>">
                <div class="stone white"></div>
              </div>
            <?php elseif ($i . $j === '34' || $i . $j === '43') : ?>
              <div class="grid-col grid" id="grid-<?= $i . $j; ?>">
                <div class="stone black"></div>
              </div>
            <?php else : ?>
              <div class="grid-col grid" id="grid-<?= $i . $j; ?>">
                <div class="stone"></div>
              </div>
            <?php endif; ?>
          <?php endfor; ?>
        <?php endfor; ?>
      </div>
    </div>
    <div class="sideboard" id="sideboard">

      <div class="opponent h-33 w-33 outer" id="opponent">
        <div class="w-70 m-auto inner">

          <p>相手</p>
          <div class="player-stone-outer">

            <div class="player-stone-inner" id="op-stone">

            </div>

          </div>

        </div>
      </div>


      <div class="now h-33 d-flex flex-column space-between w-33" id="now">
        <div class="w-70 m-auto">
          <p>手番</p>
          <div class="player-stone-outer">

            <div class="now-player m-auto player-stone-inner" id="now-player">
            </div>

          </div>
        </div>
        <div>
          <div class="time" id="time">
            <p id="timer">00:00:00</p>
          </div>
          <div class="turn" id="turn">
            <p>turn: </p>
            <p id="turn-num">1</p>
          </div>
        </div>
      </div>



      <div class="you h-33 w-33 outer">
        <div class="w-70 m-auto inner">

          <p>あなた</p>
          <div class="player-stone-outer">

            <div class="player-stone-inner" id="your-stone">

            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
  <!-- modal -->
  <!-- ゲーム開始時のモーダル -->
  <div id="startModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h1>ゲーム開始</h1>
      </div>
      <div class="modal-body">
        <p>先手後手を選択してください</p>
        <div id="first-second">
          <button class="choice-button modal-close" id="first"><span>先手</span></button>
          <button class="choice-button modal-close" id="second"><span>後手</span></button>
        </div>
      </div>
    </div>
  </div>
  <!-- ゲーム開始時のモーダルここまで -->
  <!-- ゲーム終了時のモーダル -->
  <div id="endModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h1>ゲーム終了</h1>
        <span class="modal-close">×</span>
      </div>
      <div class="modal-body" id="result">
      </div>
    </div>
  </div>
  <!-- ゲーム終了時のモーダルここまで -->

  <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
  <script src="js/modal.js"></script>
  <script src="js/othello.js"></script>
  <script src="js/timer.js"></script>


</body>

</html>