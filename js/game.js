jQuery(function($){
    const game = new Othello();
    console.log('test');
    // ゲームの開始。プレイヤーのクリックをトリガーにゲームを進行する。
    // プレイヤーが後手ならcomから開始。
    $('#second').on('click',function(){
        // プレイヤーの手番を後手に
        game.first = false;
        // サイドボード再設定
        game.initSideboard();
        // comターンの開始
        setTimeout( function(){game.playCom()}, 500 );
    });

    
// 自分の手番ならクリックをトリガーにする
if(game.first && game.turn % 2 === 1 || !game.first && game.turn % 2 ===0){
    // クリックされたとき
    $('.grid').on('click',function(){
        
        // board上なら石が置けるか調べ、可能なら石を置く。

        // idの情報、座標を設定する
        let clickedGrid = $(this).attr('id');
        game.gridsInfo( clickedGrid );

        // 石が置ける場合
        if(game.gamecanSet()){
            // クリックした位置に石を追加
            game.setStone();
            // 変更する石の配列を取得して、石を変更する
            let stonesArr = game.getChangeStonesArray();
            game.changeStones(stonesArr);

            // 手番の交代
            game.changeTurn();

            // comターンの開始
            game.setTimeout( function(){ game.playCom() }, 500 );
        }

    });
}
});