window.onload = () => {
  let canvasHeight = 600;
  let canvasWidth = 900;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let snakee;
  let applee;
  let widthInBlocks = canvasWidth / blockSize;
  let heightInBlocks = canvasHeight / blockSize;

  // Innitialise le canvas
  const init = () => {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.background = "teal";
    canvas.style.position = "absolute";
    canvas.style.top = "10%";
    canvas.style.left = "50%";
    canvas.style.translate = ("-50%", "-50%");
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
      applee = new Apple([10, 10]);
      refreshCanvas();
    };
    
    // Fonction qui raffraichi le canvas et donne une position au serpent
    const refreshCanvas = () => {
      snakee.advance();
      if (snakee.checkColision()) {
        // Game over
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snakee.draw();
        applee.draw();
      setTimeout(refreshCanvas, delay);
    }
  };
  
  // Déssine un block position x et y
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
      };

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

        //Permet une nouvelle direction au serpent

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

          // Vérifie si la touche frapée par l'utilisateur est une direction autorisée si oui elle renvoit soit 0 soit 1 et autorise la nouvelle direction , dans le cas contraire renvoit -1 et rien ne ce produit ;
          if (allowedDirections.indexOf(newDirection) > -1) {
            this.direction = newDirection;
          }
        };
        this.checkColision = () => {
          // Vérifie la collision du serpent sur lui et sur les murs innitialise les valeurs a false
          let wallColision = false;
          let snakeColision = false;
          let head = this.body[0];
          let rest = this.body.slice(1);
          // Défini la position x de la tête du serpent et la pos y
          let snakeX = head[0];
          let snakeY = head[1];
          //Défini jusqu'a quel block le serpent peut ce déplacer sur les axes X , Y
          let minX = 0;
          let minY = 0;
          // Width in Blocks est le resultat de la taille du canvas / taille d'un block ce qui donne 30 cases sur l'axe X et 20 sur l'axe Y (donc [0,29] = X , [0,19] = Y)
          let maxX = widthInBlocks - 1;
          let maxY = heightInBlocks - 1;
          // vérifie que la tête du serpent ce trouve bien entre les valeurs données au dessus
          let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
          let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

          if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
            wallColision = true;
          }

          for (let i = 0; i < rest.length; i++) {
            if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
              snakeColision = true;
            }
          }
          return wallColision || snakeColision;
        };
    }
  }
  class Apple {
    constructor(position) {
      this.position = position;
      this.draw = () => {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();

        let radius = blockSize / 2;
        // Récupère la position x de la future pomme et y ajoiute le rayon pour récupérer le centre du block sur l'axe x
        let x = position[0] * blockSize + radius;
        // Récupère la position y de la future pomme et y ajoiute le rayon pour récupérer le centre du block sur l'axe y
        let y = position[1] * blockSize + radius;
        // Fonction qui permet de créer un cercle a partir de x,y, le rayon , l'angle de départ, l'angle de fin , dans le sens antihoraire
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      };
    }
  }


  // Récupère les intéractions du client avec le clavier et ajoute une nouvelle direction en fonction appelle la function setDirection de snakee et lui attribue newDirection
  document.addEventListener("keydown", (e) => {
    let key = e.key;
    let newDirection;
    switch (key) {
      case "ArrowLeft":
      case "q" : 
        newDirection = "left";
        break;
      case "ArrowRight":
      case "d" : 
        newDirection = "right";
        break;
      case "ArrowDown":
      case "s" : 
        newDirection = "down";
        break;
      case "ArrowUp":
      case "z" : 

        newDirection = "up";
        break;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  });
  init();
};

document.body.style.overflow = "hidden";
