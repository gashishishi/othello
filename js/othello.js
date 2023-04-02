jQuery(function($){
// 先手 黒 1, 後手 白 -1

// 手番の設定
let first = true;
console.log('id-second');
console.log($('#second'));


let yourColor = 'black';
let yourNum = 1;
let opColor = 'white';
let opNum = -1;

let turn = 1;

// board初期設定
let board = new Array();
for(let i = 0; i < 8; i++){
    board.push(new Array(8).fill(0));
}

// クリックされた箇所のid
let grid = null;
// クリックされた箇所のidについている番号
let gridIdNum = null;
// クリックされたマスの座標
let y = null;
let x = null;

board[3][3] = -1;
board[4][4] = -1;
board[3][4] = 1;
board[4][3] = 1;

// board初期設定ここまで
// サイドボード初期設定
initSideboard();

// debug コンソールログに表示。
console.log('起動時');
console.log('turn');
console.log(turn);
console.log('yourColor');
console.log(yourColor);
console.log('yourNum');
console.log(yourNum);
console.log('opColor');
console.log(opColor);
console.log('opNum');
console.log(opNum);
console.log(board);
    console.log(getComsYX());


// ゲームの開始。プレイヤーのクリックをトリガーにゲームを進行する。
// プレイヤーが後手ならcomから開始。
$('#second').on('click',function(){
    first = false;
    initSideboard();
    setTimeout( function(){playCom()}, 500 );
});

// 自分の手番ならクリックをトリガーにする
if(first && turn % 2 === 1 || !first && turn % 2 ===0){
    // クリックされたとき
    $('.grid').on('click',function(){
        
        // board上なら石が置けるか調べ、可能なら石を置く。

        // idの情報、座標を設定する
        grid = $(this).attr('id');
        gridIdNum = getGridIdNum(grid);
        yx = getYX(gridIdNum);
        y = yx[0];
        x = yx[1];

        let skipTurn = true;

        // 石が置ける場合
        if(canSet(yx)){
            // クリックした位置に石を追加
            setStone(grid, yx);
            // 変更する石の配列を取得して、石を変更する
            let stonesArr = getChangeStonesArray(yx);
            changeStones(stonesArr);

            // 手番の交代
            changeTurn();

            // comターンの開始
            setTimeout( function(){playCom()}, 500 );
        }

    });
}


// function initSecondPlay(){
//     yourColor = 'white';
//     yourNum = -1;
//     opColor = 'black';
//     opNum = 1;
//     console.log('initsecondplay');
// console.log('turn');
// console.log(turn);
// console.log('yourColor');
// console.log(yourColor);
// console.log('yourNum');
// console.log(yourNum);
// console.log('opColor');
// console.log(opColor);
// console.log('opNum');
// console.log(opNum);
    
// // サイドボード初期設定
// initSideboard();

// }


/**
 * 手番によりyouとopponentの色と数字を交換する
 * @param {*} first 先手後手。falseでプレイヤーが後手の場合
 * @returns 
 */
function changeTurn(){
    if(yourColor === 'black'){
        yourColor = 'white';
        yourNum = -1;
        opColor = 'black';
        opNum = 1;
    } else {
        yourColor = 'black';
        yourNum = 1;
        opColor = 'white';
        opNum = -1;
    }
    turn += 1;
    // サイドボード情報の更新
    updateSideboard();
}

function initSideboard(){
    if(first){
        $('#your-stone').html('<div class="stone ' + yourColor + '"></div>');
        $('#op-stone').html('<div class="stone ' + opColor + '"></div>');
        $('#now-player').html('<div class="stone ' + yourColor + '"></div>');
    } else {
        $('#your-stone').html('<div class="stone ' + opColor + '"></div>');
        $('#op-stone').html('<div class="stone ' + yourColor + '"></div>');
        $('#now-player').html('<div class="stone ' + yourColor + '"></div>');
    }

}

function updateSideboard(){
    $('#now-player').html('<div class="stone ' + yourColor + '"></div>');
    $('#turn-num').text(turn);
}

/**
 * 石を画面に追加し、boardを更新する。
 * @param {*} grid タグのid
 */
function setStone(grid, yx){
    $('#' + grid).html("<div class='stone " + yourColor +"'></div>");
    board[yx[0]][yx[1]] = yourNum;
}

/**
 * boardの値と画面に表示される石を変更する。
 * @param {*} changes 
 */
function changeStones( changes ){
    for(let yx of changes){
        let y = yx[0];
        let x = yx[1];
        board[y][x] = yourNum;
        $('#grid-' + yx.join("")).html("<div class='stone " + yourColor +"'></div>");
    }
}

/**
 * 変更する石の座標を二次元配列で返す。
 * @param {} yx 
 * @returns 
 */
function getChangeStonesArray(yx){
    let y = yx[0];
    let x = yx[1];

    // [上、右上、右、右下、下、左下、左、左上]
    let dy = [1,1,0,-1,-1,-1, 0, 1];
    let dx = [0,1,1, 1, 0,-1,-1,-1];
    let changeStones = Array();

    for(let i = 0; i < 8; i++){
        let tempChanges = Array();
        let yy = y;
        let xx = x;
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
            if(board[yy][xx] === 0){
                tempChanges = Array();
                break;
            
            // 調べた先が自分の色なら、変更候補の石を確定。
            }else if(board[yy][xx] === yourNum){
                if(tempChanges.length > 0){
                    changeStones = changeStones.concat(tempChanges);
                }
                tempChanges = Array();
                break;
            // 調べた先が相手の色なら、変更候補の石として値を保存。
            }else if(board[yy][xx] === opNum){
                tempChanges.push([yy,xx]);
            }
        }
    }
 
    return changeStones;
}

/**
 * 指定の座標のboardの値を取得する。
 * @param {*} yx 座標配列[y,x]
 * @returns 
 */
function getBoardNum(yx){
    return board[yx[0]][yx[1]];
}

/**
 * クリック箇所に石が置けるか調べる
 * @param {*} yx クリックされたマスの座標。[y,x]
 * @returns 
 */
function canSet(yx){
    // [上、右上、右、右下、下、左下、左、左上]
    let dy = [1,1,0,-1,-1,-1, 0, 1];
    let dx = [0,1,1, 1, 0,-1,-1,-1];

    let y = yx[0];
    let x = yx[1];

    for(let i = 0; i < 8; i++){
        let opFlag = false;
        let yy = y;
        let xx = x;
        for (let j = 0; j < 8; j++){
            yy += dy[i]; 
            xx += dx[i];
            if(yy < 0 || 7 < yy || xx < 0 || 7 < xx){
                opFlag = false
                continue;
            }
            // 自分の石がある場合
            if(board[yy][xx] === yourNum){
                // この時点までに相手の石があったなら成立
                if(opFlag){
                    return true;
                // なければbreak
                } else {
                    opFlag = false
                    break;
                }
            // 相手の石がある場合flagをtrueに
            } else if (board[yy][xx] === opNum){
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
 * タグのid、「grid-(数字)」の数字を取り出す。
 * @param {*} grid タグのid
 * @returns idの数字部分の文字列
 */
function getGridIdNum(grid){
    let num = grid.substr(5);
    return num;
}

/**
 * gridのidについている数字をもとに、クリックされたマスの座標を取得する。
 * @param {*} gridIdNum gridのidについている数字
 * @returns intの配列
 */
function getYX(gridIdNum){
    let y = parseInt(gridIdNum.charAt(0), 10);
    let x = parseInt(gridIdNum.charAt(1), 10);
    return [y,x];

}


/**
 * comが石を置くマスを取得する。
 * @returns comが石を置くマスの座標。 
 */
function getComsYX(){
    let zero = Array();
    let candidate = Array();

    // 石を置く候補地を探索する。boardの値が0である場所を探す。
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            if(board[i][j] === 0){
                zero.push([i,j]);
            } else {
                continue;
            }
        }

    }

    // 石を置ける場所を記録する
    for(let yx of zero){
        if(canSet(yx)){
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
        let changes = getChangeStonesArray(yx)
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
 * comのプレイをまとめて実行する。
 */
function playCom(){
    // comが石を置くマスの座標とid
    let comyx = getComsYX();
    let comgrid = 'grid-' + comyx.join("");

    // comが変更する石の配列
    let comStonesArr = getChangeStonesArray(comyx);

    // 石の設置
    setStone(comgrid, comyx);
    // 石の変更
    changeStones(comStonesArr);
    // 手番の交代
    changeTurn();

}


});
