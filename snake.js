window.onload = () => {
  let canvasHeight = 600;
  let canvasWidth = 900;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let snakee;
  let applee;

  // Innitialise le canvas
  const init = () => {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    refreshCanvas();
  };
  // Raffraichi le canvas et lui donne une nouvelle position
  const refreshCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snakee.draw();
    snakee.advance();
    setTimeout(refreshCanvas, delay);
  };
  const drawBlock = (ctx, position) => {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  };

  //   Class constructeur Snake (corps, position , direction , function lui permettant d'avancer , de déssiner son prochain emplacement ect... )

  class Snake {
    constructor(body, direction) {
      this.body = body;
      this.direction = direction;

      //   Function draw snake
      this.draw = () => {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        for (let i = 0; i < this.body.length; i++) {
          drawBlock(ctx, this.body[i]);
        }
        ctx.restore();

        // Function advance
        this.advance = () => {
          // Créé une variable et Copie une image du serpent a un endroit E
          let nextPosition = this.body[0].slice();
          // Permet
          switch (this.direction) {
            case "left":
              nextPosition[0] -= 1;
              break;
            case "right":
              nextPosition[0] += 1;
              break;
            case "down":
              nextPosition[1] += 1;
              break;
            case "up":
              nextPosition[1] -= 1;
              break;
            default:
              throw "Invalid driection";
          }
          //   Incrémente la nouvelle position sur l'axe X
          this.body.unshift(nextPosition);
          //   Enlève la dernière partie de l'array
          this.body.pop();
        };
        this.setDirection = (newDirection) => {
          let allowedDirections;

          switch (this.direction) {
            case "left":
            case "right":
              allowedDirections = ["up", "down"];
              break;
            case "down":
            case "up":
              allowedDirections = ["left", "right"];
              break;
            default:
              throw "Invalid direction";
          }
          if (allowedDirections.indexOf(newDirection) > -1) {
            this.direction = newDirection;
          }
        };
      };
    }
  }
  init();

  document.addEventListener("keydown", (e) => {
    let key = e.key;
    let newDirection;
    switch (key) {
      case "ArrowLeft":
        newDirection = "left";
        break;
      case "ArrowRight":
        newDirection = "right";
        break;
      case "ArrowDown":
        newDirection = "down";
        break;
      case "ArrowUp":
        newDirection = "up";
        break;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  });
};

document.body.style.overflow = "hidden";
