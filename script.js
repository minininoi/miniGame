// 캔버스와 펜
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


// 볼
let x = canvas.width / 2; // 240
let y = canvas.height - 30; // 220
let ballRadius = 10;
let dx = 2;
let dy = -2;


// 패들
let paddleHeight = 5;
let paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2;
let leftPressed = false;
let rightPressed = false;


// 벽돌
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetLeft = 30;
let brickOffsetTop = 30;
let bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1}
  }
}

console.log(bricks);

// 점수
let score = 0;

// 목숨
let lives = 3;


// 벽돌 그리기
function drawBricks() {
  
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brick = bricks[c][r];

      brick.x = c * (brickWidth + brickPadding) + brickOffsetLeft;
      brick.y = r * (brickHeight + brickPadding) + brickOffsetTop;


      // 살아있는 벽돌만 그린다
      if (brick.status === 1) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.closePath();

        // 볼이 벽돌에 충돌했을 때
        if (
          x > brick.x 
          && x < brick.x + brickWidth
          && y > brick.y
          && y < brick.y + brickHeight
        ) {
          dy = -dy;
          // 벽돌이 비활성화된다
          brick.status = 0;
          score++;

          // 게임 종료
          if (score === brickColumnCount * brickRowCount) {
            alert('YOU WIN');
            document.location.reload();
          }
        }
      }

    }
  }

}

// 키를 누를 때
document.addEventListener('keydown', (e) => {
  console.log('keydown', e.key);

  if (e.key === 'ArrowRight') {
    rightPressed = true;
  }
  if (e.key === 'ArrowLeft') {
    leftPressed = true;
  }
})

// 키에서 손을 뗄 때
document.addEventListener('keyup', (e) => {
  console.log('keyup', e.key);

  if (e.key === 'ArrowRight') {
    rightPressed = false;
  }
  if (e.key === 'ArrowLeft') {
    leftPressed = false;
  }
})

function draw() {
  
  // 직사각형 내부를 지운다
  // 캔버스 전체를 지운다
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath(); // 그리기 시작
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath(); // 그리기 끝


  // 패들 그리기
  ctx.beginPath();
  // rect(left, top, width, height)
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.closePath();

  // 벽돌 그리기
  drawBricks();

  // 점수 그리기
  ctx.font = '16px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(`Score: ${score}`, 8, 20);

  // 목숨 그리기
  ctx.font = '16px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)

  // 방향키 조작
  if (leftPressed) {
    paddleX -= 6;

    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  if (rightPressed) {
    paddleX += 6;

    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }

  // 상단에 부딪혔을 때
  if (y < 0 + ballRadius) {
    dy = -dy;
  }

  // 우측면에 부딪혔을 때
  if (x > canvas.width - ballRadius) {
    dx = -dx;
  }

  // 좌측면에 부딪혔을 때
  if (x < 0 + ballRadius) {
    dx = -dx;
  }

  // 바닥에 부딪혔을 때
  if (y > canvas.height - ballRadius) {
    
    // 볼이 패들안으로 들어올 때
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    // 볼이 패들밖으로 떨어질 때
    } else {
      // 목숨 1 감소
      lives--;

      // 게임 오버 OTL
      if (!lives) {
        alert('GAME OVER');
        // 새로고침
        return document.location.reload();
      }

      // 볼 위치 초기화
      x = canvas.width / 2;
      y = canvas.height - 30;
      // 볼의 진행방향 초기화
      dx = 2;
      dy = -2;

      // 패들 위치 초기화
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }

  x += dx;
  y += dy;
}

setInterval(draw, 10);

