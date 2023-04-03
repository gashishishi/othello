jQuery(function($){

class Othello {
    constructor(){
        // 先手後手
        this.first = true;

        // 石の色の設定
        this.yourColor = 'black';
        this.yourNum = 1;
        this.opColor = 'white';
        this.opNum = -1;

        // ターン数
        this.turn = 1;
        // 手番スキップ判定
        this.skipTurn = false;


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
        console.log('changeturn');
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
                console.log('yy');
                console.log(yy);
                console.log('xx');
                console.log(xx);
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
     * @returns 
     */
    canSet(yx){
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
        console.log(comsYX);
        this.y = comsYX[0];
        this.x = comsYX[1];
        this.yx = new Array(this.y,this.x);
        this.gridIdNum = comsYX.join("");
        this.gridId = 'grid-' + this.gridIdNum;
    }


    /**
     * comのプレイをまとめて実行する。
     */
    playCom(){
        // comが石を置くマスの座標とid、y,xなどを設定する。
        this.gridsInfoForCom = this.getComsYX();
        // comが変更する石の配列
        const changeStonesArr = this.getChangeStonesArray(this.yx);

        // 石の設置
        this.addStone();
        // 石の変更
        this.changeStones(changeStonesArr);
        // 手番の交代
        this.changeTurn();

    }

}

//ゲームプレイ

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
    setTimeout( function(){ game.playCom() }, 500 );
    console.log('first');
console.log(game.first);
console.log('turn');
console.log(game.turn);

});

console.log('first');
console.log(game.first);
console.log('turn');
console.log(game.turn);
// 自分の手番ならクリックをトリガーにする
if(game.first && game.turn % 2 === 1 || !game.first && game.turn % 2 ===0){
// クリックされたとき
$('.grid').on('click',function(){
    
    // board上なら石が置けるか調べ、可能なら石を置く。

    // idの情報、座標を設定する
    let clickedGrid = $(this).attr('id');
    // プロパティ設定
    game.gridsInfo = clickedGrid;

    // 石が置ける場合
    if(game.canSet([game.y,game.x])){
        // クリックした位置に石を追加
        game.addStone();
        // 変更する石の配列を取得して、石を変更する
        let stonesArr = game.getChangeStonesArray(game.yx);
        game.changeStones(stonesArr);

        // 手番の交代
        game.changeTurn();

        // comターンの開始
        setTimeout( function(){ game.playCom() }, 500 );
    }

});
}

});