jQuery(function($){

class Othello {
    constructor(){
        // ゲームの終了判定
        this.end = false;
        // 先手後手
        this.first = true;
        // 合わせてターンの判定に使う
            // プレイヤーのクリックを受け付けるかを判定する変数
            this.playerTurn = true;
            // comターンのループ処理に使う変数
            this.comTurn = false;

        // 勝敗の結果を表示するためのプレイヤー情報。
        this.you = 1;
        this.opponent = -1;

        // 石の色の設定
        this.yourColor = 'black';
        this.yourNum = 1;
        this.opColor = 'white';
        this.opNum = -1;

        // ターン数
        this.turn = 1;
        // 手番スキップ判定
        this.yourSkip = false;
        this.comSkip = false;


        // board初期設定
        this.board = new Array();
        for(let i = 0; i < 8; i++){
            this.board.push(new Array(8).fill(0));
        }
        this.board[3][3] = -1;
        this.board[4][4] = -1;
        this.board[3][4] = 1;
        this.board[4][3] = 1;

        // クリックされた箇所のid
        this.gridId = null;
        // クリックされた箇所のidについている番号
        this.gridIdNum = null; //strings
        // クリックされたマスの座標
        this.yx = null; //配列
        this.y = null;
        this.x = null;

        this.initSideboard();
    }

    /**
     * 手番によりyouとopponentの色と数字を交換する
     */
    changeTurn(){
        if(this.yourColor === 'black'){
            this.yourColor = 'white';
            this.yourNum = -1;
            this.opColor = 'black';
            this.opNum = 1;
        } else {
            this.yourColor = 'black';
            this.yourNum = 1;
            this.opColor = 'white';
            this.opNum = -1;
        }
        this.turn += 1;
        // サイドボード情報の更新
        this.updateSideboard();
    }

    switchTurn(){
        [this.playerTurn, this.comTurn] = [this.comTurn, this.playerTurn];
    }

/**
 * ゲームが終了していたらthis.endをtrueにする。
 * @returns boolean 終了ならtrueを返す
 */
    checkEnd(){
        if(this.yourSkip && this.comSkip){
            this.end = true;
            return true;
        }
        // 全てのマスが埋まっているかを判定する。
        let zeroCount = 0;
        let white = 0;
        let black = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.board[i][j] === 0){
                    zeroCount += 1;
                } else if(0 < this.board[i][j]){
                    black += 1;
                } else if(this.board[i][j] < 0){
                    white += 1;
                }
            }
        }
        // 全てのマスが埋まっている or どちらかの石がゼロならゲーム終了
        if(zeroCount === 0 || white === 0 || black === 0){
            this.end = true;
            return true;
        }
        return false
    }

    /**
     * ターンのスキップを判定する。
     * @returns boolean スキップされるならtrueを返す。
     */
    checkSkip(){
        let noSkip = false;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                noSkip = this.canSet([i,j]);
                if (noSkip){
                    return false;
                }
            }
        }

        return true;
    }

    // ゲームの勝者を判定する
    judgeWinner(){
        let winner = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                winner += this.board[i][j];
                }
            }

        return winner;
    }

    showResult(){
        const endModal = $('#endModal');
        const endModalBody = $('#result');
        const winner = this.judgeWinner();
        console.log('winner');
        console.log(winner);
        let msg = '';
        if (this.you < 0){
            if(winner < 0){
                msg = '<p>あなたの勝利です!<p>';
            } else {
                msg = '<p>対戦相手の勝利です。</p>';
            }
        } else if(0 < this.you){
            if (0 < winner){
                msg = '<p>あなたの勝利です!<p>';
            } else {
                msg = '<p>対戦相手の勝利です。</p>';
            }
        } else {
            msg = '<p>引き分けです。</p>';
        }

        // モーダルのメッセージの設定
        endModalBody.html(msg)
        endModal.css('display','block');
    }

    /**
     * サイドボードの初期設定を行う
     */
    initSideboard(){
        if(this.first){
            $('#your-stone').html('<div class="stone ' + this.yourColor + '"></div>');
            $('#op-stone').html('<div class="stone ' + this.opColor + '"></div>');
            $('#now-player').html('<div class="stone ' + this.yourColor + '"></div>');
        } else {
            $('#your-stone').html('<div class="stone ' + this.opColor + '"></div>');
            $('#op-stone').html('<div class="stone ' + this.yourColor + '"></div>');
            $('#now-player').html('<div class="stone ' + this.yourColor + '"></div>');
        }

    }

    /**
     * サイドボードを更新する。
     */
    updateSideboard(){
        $('#now-player').html('<div class="stone ' + this.yourColor + '"></div>');
        $('#turn-num').text(this.turn);
    }

    /**
     * 石を追加する処理を行う。画面に追加し、boardを更新する。
     * @param {*} grid タグのid
     */
    addStone(){
        $('#' + this.gridId).html("<div class='stone " + this.yourColor +"'></div>");
        this.board[this.y][this.x] = this.yourNum;
    }

    /**
     * 石をひっくり返す処理。boardの値と画面に表示される石を変更する。
     * @param {*} changes 変更される石の座標の配列
     */
    changeStones( changes ){
        for(let change of changes){
            let y = change[0];
            let x = change[1];
            this.board[y][x] = this.yourNum;
            $('#grid-' + change.join("")).html("<div class='stone " + this.yourColor +"'></div>");
        }
    }

    /**
     * 変更する石の座標を二次元配列で返す。
     * @returns 
     */
    getChangeStonesArray(yx){
        // [上、右上、右、右下、下、左下、左、左上]
        let dy = [1,1,0,-1,-1,-1, 0, 1];
        let dx = [0,1,1, 1, 0,-1,-1,-1];
        let changeStones = Array();

        for(let i = 0; i < 8; i++){
            let tempChanges = Array();
            let yy = yx[0];
            let xx = yx[1];
            for(let j = 0; j < 8; j++){
                // 一方向を調べるこのループが終了するたびに、tempChanges = Array();を初期化する。
                yy += dy[i];
                xx += dx[i];
                // boardを出たらbreak
                if(yy < 0 || 7 < yy || xx < 0 || 7 < xx){
                    tempChanges = Array();
                    break;
                }
                // 調べた先に石がなければbreak
                if(this.board[yy][xx] === 0){
                    tempChanges = Array();
                    break;
                
                // 調べた先が自分の色なら、変更候補の石を確定。
                }else if(this.board[yy][xx] === this.yourNum){
                    if(tempChanges.length > 0){
                        changeStones = changeStones.concat(tempChanges);
                    }
                    tempChanges = Array();
                    break;
                // 調べた先が相手の色なら、変更候補の石として値を保存。
                }else if(this.board[yy][xx] === this.opNum){
                    tempChanges.push([yy,xx]);
                }
            }
        }
    
        return changeStones;
    }

    /**
     * 指定のマスに石が置けるか調べる。
     * @returns boolean
     */
    canSet(yx){
        if(this.board[yx[0]][yx[1]] !== 0){
            return false;
        }
        // [上、右上、右、右下、下、左下、左、左上]
        let dy = [1,1,0,-1,-1,-1, 0, 1];
        let dx = [0,1,1, 1, 0,-1,-1,-1];

        for(let i = 0; i < 8; i++){
            let opFlag = false;
            let yy = yx[0];
            let xx = yx[1];
            for (let j = 0; j < 8; j++){
                yy += dy[i]; 
                xx += dx[i];
                if(yy < 0 || 7 < yy || xx < 0 || 7 < xx){
                    opFlag = false
                    continue;
                }
                // 自分の石がある場合
                if(this.board[yy][xx] === this.yourNum){
                    // この時点までに相手の石があったなら成立
                    if(opFlag){
                        return true;
                    // なければbreak
                    } else {
                        opFlag = false
                        break;
                    }
                // 相手の石がある場合flagをtrueに
                } else if (this.board[yy][xx] === this.opNum){
                    opFlag = true;
                // なにもない場合break
                } else {
                    opFlag = false;
                    break;
                }
                
            }
        }
        // ここまでreturnされてなければfalseを返す。
        return false;
    }

    /**
     * クリックされたマスの情報を設定する。
     * @param {*} clickedGrid クリックされたマスのid。 $(this).attr('id')
     */
    set gridsInfo(clickedGrid){
        this.gridId = clickedGrid;
        this.gridIdNum = this.gridId.substr(5);
        this.y = parseInt(this.gridIdNum.charAt(0), 10);
        this.x = parseInt(this.gridIdNum.charAt(1), 10);
        this.yx = new Array(this.y,this.x);
    }

    /**
     * comが石を置くマスを取得する。
     * @returns comが石を置くマスの座標。 
     */
    getComsYX(){
        let zero = Array();
        let candidate = Array();

        // 石を置く候補地を探索する。boardの値が0である場所を探す。
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.board[i][j] === 0){
                    zero.push([i,j]);
                } else {
                    continue;
                }
            }
        }

        // 石を置ける場所を記録する
        for(let yx of zero){
            if(this.canSet(yx)){
                candidate.push(yx);
            }
        }
        // 変更できる石の数の最大・最小と、その時の座標を記録する。
        let changeStonesArray = Array();
        let maxChange = 0;
        let maxChangeYX = Array();
        let minChange = 10 ** 3;
        let minChangeYX = Array();

        for(let yx of candidate){
            let changes = this.getChangeStonesArray(yx)
            changeStonesArray.push(changes);
            if(maxChange < changes.length){
                maxChange = changes.length;
                maxChangeYX = yx;
            } else if(changes.length < minChange){
                minChange = changes.length;
                minChangeYX = yx;
            }
        }

        // 経過ターン数によって返す値を変更する
        if(turn < 10){
            return minChangeYX;
        } else {
            return maxChangeYX;
        }
    }

    /**
     * comのためにgrid関係のプロパティを設定する。
     * @param {*} comsYX yx配列.中身はint
     */
    set gridsInfoForCom( comsYX ){
        this.y = comsYX[0];
        this.x = comsYX[1];
        this.yx = new Array(this.y,this.x);
        this.gridIdNum = comsYX.join("");
        this.gridId = 'grid-' + this.gridIdNum;
    }


    /**
     * comのプレイをまとめて実行する。
     */
    setComStone(){
        // comが石を置くマスの座標とid、y,xなどを設定する。
        this.gridsInfoForCom = this.getComsYX();
        // comが変更する石の配列
        const changeStonesArr = this.getChangeStonesArray(this.yx);

        // 石の設置
        this.addStone();
        // 石の変更
        this.changeStones(changeStonesArr);
    }
    playCom(){
        // スキップの判定
        game.comSkip = game.checkSkip();

        if(game.checkEnd()){
            game.showResult();
        } else if(game.comSkip) {
            game.changeTurn();
            game.switchTurn();
            console.log('com skip');
            console.log(game.yourSkip,game.comSkip);

        } else{
            // comのプレイ
                game.setComStone();
                if(game.checkEnd()){
                    console.log(this.yourSkip && this.comSkip);
                    game.showResult();
                } else{
                // 手番の交代
                game.changeTurn();
                game.switchTurn();
                console.log('com to player');


                // プレイヤーのスキップを判定する。
                game.yourSkip = game.checkSkip();

                if(game.checkEnd()){
                    game.showResult();
                } else if(game.yourSkip){
                    game.changeTurn();
                    game.switchTurn();
                    console.log('player skip');
                console.log(game.yourSkip,game.comSkip);


                }
                console.log(game.yourSkip,game.comSkip);
                }
            }
    }


}

//ゲームプレイ

const game = new Othello();
// ゲームの開始。プレイヤーのクリックをトリガーにゲームを進行する。
// プレイヤーが後手ならcomから開始。
$('#second').on('click',function(){
    // プレイヤーの手番を後手に
    game.first = false;
    game.switchTurn();
    game.you = -1;
    game.opponent = 1;

    // サイドボード再設定
    game.initSideboard();
    // comターンの開始
    setTimeout( function(){ 
        game.setComStone();
        // 手番の交代
        game.changeTurn();
        game.switchTurn();
    }, 500 );
});

// ゲーム終了後は操作を無効に
if(!game.end){

    // 自分の手番ならクリックをトリガーにする
    if(game.first && game.turn % 2 === 1 || !game.first && game.turn % 2 ===0){

        /********** プレイヤーターン処理の開始 **********/
        if(game.playerTurn){
        $('.grid').on('click',function(){
            game.switchTurn(); // クリックされたらとりあえずプレイヤーが石を設置できなくする
                
            // idの情報、座標を設定する
            let clickedGrid = $(this).attr('id');
            // クラスのプロパティ設定
            game.gridsInfo = clickedGrid;

            if(!game.canSet([game.y,game.x])){
                game.switchTurn(); //石が置けないなら再びクリックできるように
            } else {
                // クリックした位置に石を追加
                game.addStone();

                let stonesArr = game.getChangeStonesArray(game.yx);
                game.changeStones(stonesArr);

                // 石を置いたらゲームの終了を判定する
                if(game.checkEnd()){
                    game.showResult();
                }

                // 手番の交代
                game.changeTurn(); // クリック時点でswitchTurn済み
                console.log('player to com');
                /********** プレイヤーターン処理の終了 **********/
                /********** comターン処理の開始 **********/
                console.log(!game.comTurn,game.end);
                for(let i =0; i <100; i++){
                    if(game.end || !game.comTurn){
                        break;
                    }
                    game.playCom();
                }
            }
        });
        }
    }
}

    });