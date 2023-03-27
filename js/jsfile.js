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
