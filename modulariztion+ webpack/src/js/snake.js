import $ from 'jquery'
let scene = $('#scene')[0]
let ctx = scene.getContext('2d')
  // requestAnimationFrame
let raf = 0
let gameRunning=false;


scene.width = 0.8 * window.innerWidth
scene.height = 0.7 * window.innerHeight

function gameStart(){
// snake.draw()
  if (gameRunning) 
    return
  gameRunning = true
  $('#start').css('display','none')
  $('#end').css('display','block')
  food.createFood()
  init()
  requestAnimationFrame(move)
  turn()
}


function gameOver(){
  if(!gameRunning) return
  gameRunning = false
  $('#end').css('display','none')
  $('#start').css('display','block')
  cancelAnimationFrame(raf)
  ctx.clearRect(0,0,scene.width, scene.height)
  alert(`game over:\n score:${score.score}`)
  score.updateScore()
}

// 蛇对象
var snake = {
  // 各节坐标， pos[0] 为头
  pos: [
    { x: 100, y: 100, speedX: 1,speedY:0},
    { x: 80, y: 100, speedX: 1,speedY:0 },
    { x: 60, y: 100, speedX: 1,speedY:0 },
  ],
  speed: 2,
  turnPos: [],
  eatPos:{x:0, y:0},
  draw: function(){
    ctx.fillStyle = '#999'
    this.pos.forEach( p =>{
      ctx.fillRect(p.x-10, p.y-10, 20, 20)
    })
    this.turnPos.forEach( p =>{
      ctx.fillRect(p.x-10, p.y-10, 20, 20)
    })
  }
}

// 食物对象
var food = {
  x: 0,
  y: 0,
  c: 0,
  createFood: function(){
    this.x = Math.floor(Math.random()*(scene.width-20)+10)
    this.y = Math.floor(Math.random()*(scene.height-20)+10)
  },
  drawFood: function(){
    // 渐变色
    ctx.fillStyle = `rgb(${Math.sin(this.c)*64+191},${16},${16})`
    ctx.fillRect(this.x-10,this.y-10,20,20)
    this.c+=0.06;
  },
}
// score对象
var score ={
  score:0,
  updateScore: function(){
    ctx.fillStyle = '#f5f5f5'
    ctx.font = '22px serif'
    ctx.beginPath()
    ctx.fillText('score:' + this.score,20,20)
    ctx.closePath()
  }
}
// 初始化
function init()
{
score.score = 0
snake.pos = [
  { x: 100, y: 100, speedX: 1,speedY:0},
  { x: 80, y: 100, speedX: 1,speedY:0 },
  { x: 60, y: 100, speedX: 1,speedY:0 },
],
snake.speed= 2
snake.turnPos= []
snake.eatPos={x:0, y:0}
}
// 移动
function move(){
raf = requestAnimationFrame(move)
var head = snake.pos[0]
// 刷新canvas
ctx.clearRect(0,0,scene.width, scene.height)
// 运动
snake.pos.forEach( (p, index) => {
  p.x += p.speedX * snake.speed
  p.y += p.speedY * snake.speed
  // 判断是否需要转向
  snake.turnPos.forEach( tp =>{
    // 如果snake的某节坐标在turnPos上，把它变成turnPos的状态
    if (tp.x === p.x && tp.y === p.y){
      p.speedX = tp.speedX
      p.speedY = tp.speedY
    // snake最后一截经过时 把该turnPos取消
    if (index === snake.pos.length-1)
      snake.turnPos.shift()
    }
  })

  // 判断是否撞到自己
  if (index > 2 && 
       Math.sqrt((p.x-head.x)*(p.x-head.x)+(p.y-head.y)*(p.y-head.y))<20 
     )
    gameOver()
  })

  // 判断有吃到食物
  if (Math.abs(head.x-food.x)<20 && Math.abs(head.y-food.y)<20 ){// 横纵距离20以内
    score.score ++;
    food.createFood()
    // $('#score').text(score)
    snake.eatPos.x = head.x
    snake.eatPos.y = head.y
    // snake.speed++
  }

  // 判断尾部是否到达上一个食物的点
  if (snake.pos[snake.pos.length-1].x === snake.eatPos.x && 
      snake.pos[snake.pos.length-1].y === snake.eatPos.y)
      {
        grow()
        snake.eatPos.x = snake.eatPos.y = 0          
      }

  // 判断头部是否触碰边界
  if ( head.x > scene.width 
    || head.y > scene.height 
    || head.x < 0 
    || head.y < 0 )
        gameOver()

    // 每帧需要渲染的东西
    food.drawFood()
    snake.draw()
    score.updateScore()
}


// 转向
function turn(){
// 开启键盘监听
$('body').on('keydown', event => {
  var e = event || window.event
  // w:87  a:65 s:83 d:68
  // up:38  left:37 down:40 right:39
  switch(e.keyCode){
    // 上
    case 87:
    case 38:
    // 判断当前运动方向是否为水平方向 如是则将该时刻的点加入turnPos
      // if (snake.pos[0].speedX && !snake.pos[0].speedY){
      //   var tp = {
      //     x: snake.pos[0].x,
      //     y: snake.pos[0].y,
      //     speedX:0,
      //     speedY:-1
      //   }
      //   snake.pos[0].speedX = 0
      //   snake.pos[0].speedY = -1
      //   snake.turnPos.push(tp)
      // }
    // 封装这段 到changePos
      changePos(0,-1)
    break
    // 左
    case 65:
    case 37:
      changePos(-1,0)
    break
    // 下
    case 83:
    case 40:
      changePos(0,1)
    break
    // 右
    case 68:
    case 39:
      changePos(1,0)
    break
  }
})
}

//封装的转向代码
function changePos(sX,sY){
if (sY && snake.pos[0].speedX && !snake.pos[0].speedY //水平方向只接受上下的控制
  ||sX && !snake.pos[0].speedX && snake.pos[0].speedY)//竖直方向只接受左右的控制
{
  var tp = {
    x: snake.pos[0].x,
    y: snake.pos[0].y,
    speedX:sX,
    speedY:sY
  }
  snake.pos[0].speedX = sX
  snake.pos[0].speedY = sY
  snake.turnPos.push(tp)
}
}

// 变长
function grow(){
var tail = snake.pos[snake.pos.length-1]
var p = {
  x:tail.x-20*tail.speedX,
  y:tail.y-20*tail.speedY,
  speedX:tail.speedX,
  speedY:tail.speedY
}
snake.pos.push(p)
}

score.updateScore()

$('#start').click(()=>{
  gameStart()
})
$('#end').click(()=>{
  gameOver()
})

$('.snake a').click(function(){
  if (gameRunning)
    gameOver()
  $('.archive-list').css('left','0')
  $('.snake').removeClass('slideIn')
  setTimeout(()=>{
    $('.snake').css('display','none')
  },1000)
})