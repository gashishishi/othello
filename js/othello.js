jQuery(function($){
    // 先手 黒 1, 後手 白 -1
let choice = 1;
// モーダルでなんかやってチョイスを変更。とりあえず先手である黒固定
let first = true;
let yourColor = 'black';
let yourNum = 1;
let opColor = 'white';
let opNum = -1;
let turn = 1;

// 先手は黒

// board初期設定
let board = new Array();
for(let i = 0; i < 8; i++){
    board.push(new Array(8));
}
board[3][3] = -1;
board[4][4] = -1;
board[3][4] = 1;
board[4][3] = 1;


    // クリックされたとき
    $('.grid').on('click',function(){
        let grid = $(this).attr('id');

        if(canSet(grid)){
            setStone(grid);
            turn += 1;
            // 手番の交代
            let stone = changeStone(first);
            yourColor = stone[0];
            yourNum = stone[1];
            opColor = stone[2];
            opNum = stone[3];
    
        }


        // debug コンソールログに表示。
        console.log(turn);
        console.log(yourColor);
console.log(opColor);
        let ij = getIJ(grid);
        let i = ij[0];
        let j = ij[1];
        // console.log(i);
        // console.log(j);
        });

// 手番によりを交換する。
function changeStone(first = true){
    if(first){
        if (turn % 2 === 0){
            return ['white',-1,'black',1];
        } else {
            return ['black',1,'white',-1];
        }
    } else {
        if (turn % 2 === 0){
            return ['black',1,'white',-1];
        } else {
            return ['white',-1,'black',1];
        }
    }
}

/**
 * 石を画面に追加する。
 * @param {*} grid 
 */
function setStone(grid){
    $('#' + grid).html("<div class='stone " + yourColor +"'></div>");
}


/**
 * boardの石配置を変更する。
 */
function changeBoard(){

}

/**
 * クリック箇所に石が置けるか調べる
 * @param {*} grid 
 * @returns bool
 */
function canSet(grid){
    // [上、右上、右、右下、下、左下、左、左上]
    let y = [1,1,0,-1,-1,-1, 0, 1];
    let x = [0,1,1, 1, 0,-1,-1,-1];

    let ij = getIJ(grid);
    let i = ij[0];
    let j = ij[1];

    for(let l = 0; l < 8; l++){
        let opStone = false;
        let iy = i;
        let jx = j;
        for (let m = 0; m < 8; m++){
            iy += y[l]; 
            jx += x[l];
            if(iy < 0 || 7 < iy || jx < 0 || 7 < jx){
                continue;
            }
            // 自分の石がある場合
            console.log(iy,jx);
            if(board[iy][jx] === yourNum){
                // この時点までに相手の石があったなら成立
                if(opStone){
                    console.log('canset');
                    console.log(board);
                    return true;
                // なければbreak
                } else {
                    opStone = false
                    break;
                }
            // 相手の石がある場合flagをtrueに
            } else if (board[iy][jx] === opNum){
                opStone = true;
            // なにもない場合break
            } else {
                opStone = false;
                break;
            }
            
        }
    }
    // ここまでreturnされてなければfalseを返す。
    console.log("置けません");
    return false;
}

/**
 * タグのid grid-(数字)の数字を取り出す。
 * @param {*} grid 
 * @returns int
 */
function gridToNum(grid){
    let num = parseInt(grid.substr(5),10);
    return num;
}

/**
 * gridをもとに、クリックされたマスの座標を取得する。
 * @param {*} grid 
 * @returns 
 */
function getIJ(grid){
    let num = gridToNum(grid);
    let i = Math.floor(num / 8);
    let j = num % 8;
    return [i,j];

}



        
});
