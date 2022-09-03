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
  let score;
  let timeOut;

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
    score = 0;
    refreshCanvas();
  };

  // Fonction qui raffraichi et gère une bonne partie des fonctions en lien avec le jeu
  const refreshCanvas = () => {
    snakee.advance();
    if (snakee.checkColision()) {
      // Game over
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        // Le serpent a mangé la pomme this.ateApple prends la valeur true et empèche le this.body.pop() de la function advance()
        score++;
        snakee.ateApple = true;

        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snakee.draw();
      applee.draw();
      drawScore();
      timeOut = setTimeout(refreshCanvas, delay);
    }
  };

  const drawScore = () => {
    ctx.save();
    ctx.font = "100px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    ctx.strokeText(score.toString(), centerX, centerY);
    ctx.restore();
  };

  // Déssine un block position x et y
  const drawBlock = (ctx, position) => {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  };

  const gameOver = () => {
    ctx.save();
    ctx.fillText("Game Over", 5, 15);
    ctx.fillText("Appuyez sur la touche TAB pour rejouer ", 20, 35);
    ctx.restore();
  };

  // Relance le jeu si GameOver grace a la touche espace
  const restart = () => {
    snakee = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );
    applee = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeOut);
    refreshCanvas();
  };

  //   Class constructeur Snake (corps, position , direction , function lui permettant d'avancer , de déssiner son prochain emplacement ect... )

  class Snake {
    constructor(body, direction) {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;

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
        //   Enlève la dernière partie de l'array quand la valeur de ateApple = false si le serpent n'a pas mangé de pomme
        if (!this.ateApple) this.body.pop();
        // Sinon reinitialise la valeur de ateApple a false
        else this.ateApple = false;
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
        // Retourne true si le serpent s'est mangé un mur
        if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
          wallColision = true;
        }
        //  vérifie si la position x de la  tête du serpent ce trouve au même endroit que la position x du corps du serpent et fait le meme test pour l'axe y , si les deux index sont identiques le serpent s'est mordu la queue et la valeur passe a true ;
        for (let i = 0; i < rest.length; i++) {
          if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
            snakeColision = true;
          }
        }
        return wallColision || snakeColision;
      };
      // Méthode permettant de vérifier si le serpent a mangé une pomme
      this.isEatingApple = (appleToEat) => {
        let head = this.body[0];

        if (
          head[0] === appleToEat.position[0] &&
          head[1] === appleToEat.position[1]
        ) {
          return true;
        } else {
          return false;
        }
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
        let x = this.position[0] * blockSize + radius;
        // Récupère la position y de la future pomme et y ajoiute le rayon pour récupérer le centre du block sur l'axe y
        let y = this.position[1] * blockSize + radius;
        // Fonction qui permet de créer un cercle a partir de x,y, le rayon , l'angle de départ, l'angle de fin , dans le sens antihoraire
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      };
      // Permet de donner aléatoirement une nouvelle position x et y a la pomme et de que cette position soit un chiffre entier grace a Math.round
      this.setNewPosition = () => {
        let newX = Math.round(Math.random() * (widthInBlocks - 1));
        let newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
      };
      // Méthode permettant de vérifier si la pomme réaparait sur le serpent
      this.isOnSnake = (snakeToCheck) => {
        let isOnSnake = false;
        for (let i = 0; i < snakeToCheck.body.length; i++) {
          if (
            this.position[0] === snakeToCheck.body[i][0] &&
            this.position[1] === snakeToCheck.body[i][1]
          ) {
            isOnSnake = true;
          }
        }
        return isOnSnake;
      };
    }
  }

  // Récupère les intéractions du client avec le clavier et ajoute une nouvelle direction en fonction appelle la function setDirection de snakee et lui attribue newDirection
  document.addEventListener("keydown", (e) => {
    let key = e.key;
    let newDirection;
    switch (key) {
      case "ArrowLeft":
      case "q":
        newDirection = "left";
        break;
      case "ArrowRight":
      case "d":
        newDirection = "right";
        break;
      case "ArrowDown":
      case "s":
        newDirection = "down";
        break;
      case "ArrowUp":
      case "z":
        newDirection = "up";
        break;
      case " ":
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  });
  init();
};

document.body.style.overflow = "hidden";
