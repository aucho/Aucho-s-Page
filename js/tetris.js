
/*
coordinate:
(1,1)
.—— —— ——— —> x
|
|
|
V y

*/
//const moveObj = -1;
const staticObj  = 1,
    emptyBlock = 0,
    moveDownInterval = 300,
    staticColor = '#336',
    emptyColor = '#fff';//'#e3e3ee';
var that = this
  tbody=$('#t_table tbody')
  wall= [1,1,1,1,1,1,1,1,1,1]
  emptyLine= [0,0,0,0,0,0,0,0,0,0]
  bigTetris = {
      tetrisArr : []
  }
  t_score = 0
  running =false
  timer = null; 
var tetrisColor = function(){
   r = Math.floor(Math.random()*128 + 64).toString(16);
   g = Math.floor(Math.random()*128 + 64).toString(16);
   b = Math.floor(Math.random()*128 + 64).toString(16);
   return '#'+r+g+b;
}
//表格
var table = {
  width : 10,
  height : 20,
}

//绘制表格和对应数组
var drawTable = function(){
  var tr = '<tr></tr>'
  var td = '<td class=\'t_block\'></td>'
  var arrTable = new Array();
  for(let i=0;i<that.table.height;i++)
  {
      tbody.append(()=>{return tr});
      let _tr = tbody.find('tr:last-child');
      arrTable.push([])
      for(let j=0;j<that.table.width;j++)
      {
          _tr.append(td);
          arrTable[i].push(0);
      }
  }
  arrTable[-1] = emptyLine;
  arrTable.push(that.wall);       //底部不可见墙
  // 数组值 ： 0 tetris       1 墙或静态方块        /* -1 移动中的方块->useless*/
  return arrTable
}

var arrTable = drawTable();

//凑齐一行，取消上方静态
var clearArrTable = function(rowIndex){
  for(let i = 0;i<=rowIndex;i++)
  for(let j = 0;j< that.table.width;j++)
      that.arrTable[i][j]=emptyBlock;
  that.arrTable[20] = wall;
}

//方块坐标定位
var position = function(x, y){ 
  var line = tbody.find('tr:nth-child(' + y +')');
  var block = line.find('td:nth-child(' + x + ')');
  return block;
}

//tetris 对象
function tetris(x =0, y=0, color='#000'){
  this.x = x;
  this.y = y;
  this.color = color;
  that.position(this.x, this.y).css('background',this.color);
  this.fillTable = ()=>{
      that.position(this.x, this.y).css('background',this.color);
  }
  this.rotate = (Ox,Oy)=>{
      var [_x,_y] = [Ox-(this.y-Oy), (this.x-Ox)+Oy] // this.x = Ox - y的相对坐标; this.y = Oy + x的相对坐标;
      if(    _y>that.table.height
          || _x>that.table.width
          || _x<1
          || that.arrTable[_y-1][_x-1]===staticObj)
          return 1;
      else{
          this.y = _y;
          this.x = _x;
          return 0;
      }
  }
  this.undoRotate = (Ox,Oy)=>{
  [this.x, this.y ]= [Ox+(this.y-Oy),Oy-(this.x-Ox)]
}
}


//清空视图层table 更新动态
var clearTable = function(){
      that.arrTable.forEach( (childArr,_y) => {
          childArr.forEach( (value, _x) =>{
              if(value !== staticObj)
                  that.position(_x+1, _y+1).css('background',emptyColor);
          })
      })
  }

//方块自动向下移动（第一次interval相当于没有执行）
var moveDown = function (te){
  //var a = $.extend(true,[], bigTetris.tetrisArr);
  var down = function(){
      var stopFlag = 0;
      that.clearTable();    //更新视图
      te.tetrisArr.forEach( t=> { 
          t.y ++;
          t.fillTable();  //更新视图
          if(that.arrTable[t.y][t.x-1] === staticObj) //触底不动
          {
              stopFlag = 1;
              clearInterval(timer);
          }
      });
      if(stopFlag){
          te.tetrisArr.forEach(tt=>{
                  //if(te.tetrisArr === allTetrisAbove.tetrisArr)
                  //{
                      that.clearTable();
                      tt.color = staticColor;
                      that.position(tt.x, tt.y).css('background',staticColor);//触底再渲染
                  //}
                  that.arrTable[tt.y-1][tt.x-1] = staticObj;
                  if(that.bigTetris !== te && $.inArray(tt,that.bigTetris.tetrisArr) ===-1){
                      let c = $.extend(true,new tetris,tt);
                      that.bigTetris.tetrisArr.push(c);//加入bigTetris
                  }
              })
          that.onStop();
      }
  }
  timer = setInterval(down,moveDownInterval);
  $(document).on('keydown',function(event){
      if(event.keyCode === 40 || event.keyCode === 83 ){
          clearInterval(timer);
          timer = setInterval(down,80);               
      }

  })
}

//左右移动 旋转
var LRMove = function(te){
  $(document).on('keydown',function(event){
  switch(event.keyCode){
      case 65:
      case 37:        //键盘左键
          let flag = 0;
          te.tetrisArr.forEach(
                 t=>{
                     try{
                      flag = ((
                          t.x <=1 || 
                          that.arrTable[t.y-1][t.x-1-1] === staticObj ||  //test
                          that.arrTable[t.y-1+1][t.x-1-1] === staticObj
                          )? 1:0) + flag;
                     }
                     catch(e){
                         console.log(t.y);
                     }
                     
              })
          if(!flag)      //方块左移动边界
          {
              that.clearTable();
              te.tetrisArr.forEach(t=>{
                  t.x --;
                  t.fillTable();
              })
          }
          break;
      case 68:
      case 39:    //键盘右键
          let flag2 = 0;
          te.tetrisArr.forEach(
                 t=>{
                     flag2 = ((t.x >= that.table.width || 
                     that.arrTable[t.y-1][t.x-1+1] === staticObj ||
                     that.arrTable[t.y-1+1][t.x-1+1] === staticObj)
                     ? 1:0) + flag2;
              })
          if(!flag2)      //方块右移动边界
          {
              that.clearTable();
              te.tetrisArr.forEach(
                  t=>{
                      t.x ++;
                      t.fillTable();
                  })
          }
          break;
      case 87:
      case 38:    //键盘上键，旋转
          let flag3 = 0;
          te.tetrisArr.forEach(
              t=>{   
                     let _y =(t.x-te.t1.x)+te.t1.y;
                     let _x =te.t1.x-(t.y-te.t1.y)
                     flag3 = ((
                     _y>that.table.height|| 
                     _x>that.table.width || 
                     _x<1|| 
                     that.arrTable[_y-1][_x-1]===staticObj)?1:0)+flag3
                  })
          if(!flag3)
          {   
              that.clearTable();
              te.tetrisArr.forEach(
              t=>{
                      t.rotate(te.t1.x, te.t1.y);
                      t.fillTable();
                  })
          }
          break;
      default:
              console.log('');
  }
})
}
//方块触底执行判定
var onStop = function(){
  let temp = [];           //储存希望删除的数组(成行的)的index
  let ata = [];             
  let shallWeGenTetris = 1;//是否继续生成新Tetris的flag
  let shallWeAddScore = 0; //是否有整行flag
  let fullRow=[];
  allTetrisAbove.tetrisArr=[];
  //游戏结束判断
  if($.inArray(1, that.arrTable[1]) !== -1) {
          shallWeGenTetris = 0;
          t_gameOver();
          return
      }
  that.arrTable.forEach(
      (childArr,index) =>{
          //成行加分判断
          if(childArr.join('') === that.wall.join('') && index !==20)
          {
              shallWeAddScore = 1;
              fullRow.push(index+1);                          //index 是删除行的行号（数组）
              that.bigTetris.tetrisArr.forEach(               //index+1 是 行号（Tetris方块）
                  (t,indexT) => {                             //t是大T数组里的方块，
                      if(t.y === index+1)  temp.push(indexT);
                  }
              )
          }
          //游戏结束判断
          else if($.inArray(1,childArr) !== -1 && index === 0){
              t_gameOver(index);
              shallWeGenTetris = 0;
              return
          }
      }
  )
  if(shallWeAddScore){
      that.bigTetris.tetrisArr.forEach(
                  (t,indexT) => {
                      console.log(Math.min.apply(null,fullRow))
                      if(t.y< Math.min.apply(null,fullRow)){
                          allTetrisAbove.tetrisArr.push(t);
                      }
                          
                  }
              )
      for(let i=0;i<temp.length;i++)
      {
        t_score ++;
        that.bigTetris.tetrisArr.splice(temp[i]-i,1);//落地Tetris数组去除凑齐的行
      }
      $('.tetris span').text('score:'+ t_score)
      that.clearArrTable(Math.max.apply(null,fullRow)-1);//传入（数组的）删除行的行号
      shallWeGenTetris = (allTetrisAbove.tetrisArr[0] === undefined)? 1 : 0;//加分后没有剩余静态方块，直接生成新方块
      if(allTetrisAbove.tetrisArr[0] !== undefined) that.moveDown(allTetrisAbove);
  }
  if(shallWeGenTetris)    genTeris();
}


//形状方块
function shapeTetris(arr, defColor){      //arr为相对位置数组，存储中心点以外的tetris相对位置
  this.color = tetrisColor();
  this.t1 = new tetris(5,1,defColor||this.color);  //t1作为旋转中心 (5,0)可替换成(a,b)接收传值
  this.tetrisArr = [this.t1];
  arr.forEach(pos =>{
      let t = new tetris(5+pos.x, 1+pos.y,this.color);
      this.tetrisArr.push(t);
  })
}

var allTetrisAbove = null    //存储成行数组上方的tetris

var All =
[
  [{x: 1,y:0},{x:-1,y: 0},{x:-1,y:-1}],//Ltetris
  [{x:-1,y:0},{x: 1,y: 0},{x: 1,y:-1}],//Jtetris 
  [{x:-1,y:0},{x: 1,y: 0},{x: 0,y:-1}],//Ttetris 
  [{x: 1,y:0},{x: 0,y:-1},{x: 1,y:-1}],//Otetris 
  [{x:-1,y:0},{x: 1,y: 0},{x: 2,y: 0}],//——tetris 
  [{x: 1,y:0},{x: 0,y:-1},{x:-1,y:-1}],//Ztetris 
  [{x:-1,y:0},{x: 0,y:-1},{x: 1,y:-1}] //Htetris
]

var genTeris = function(){
  $(document).off('keydown');
  let te = new shapeTetris(All[Math.floor(Math.random()*7)]);
  moveDown(te);
  LRMove(te);
}
let t_init = function(){
  that.t_score = 0
  $('.tetris span').text('score:'+t_score)
  that.allTetrisAbove = new shapeTetris([],emptyColor)    //存储成行数组上方的tetris
  that.allTetrisAbove.t1 = null
  that.allTetrisAbove.tetrisArr.splice(0,1);
  that.bigTetris = {
    tetrisArr : []
  }
  that.clearArrTable(19)
}
var t_gameOver = function(){
  if (!running) return
  running = false
  alert('game over!  score:'+ that.t_score)
  $(document).off('keydown');
  clearInterval(that.timer)
  t_init();
  clearTable();
  $('.tetris button').css('visibility','visible')
}
var t_gameStart = function(){
  if (running) return
    running = true
  t_init();
  clearTable();
  genTeris()
}

$('.tetris button').click(function(){
  t_gameStart()
  $(this).css('visibility','hidden')
})

$('.tetris a').click(function(){
  if (running)
    t_gameOver()
  $('.archive-list').css('left','0')
  $('.tetris').removeClass('slideIn')
  setTimeout(()=>{
    $('.tetris').css('display','none')
  },1000)
})


/*aucho*/