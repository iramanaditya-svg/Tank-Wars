import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import firebaseconfig from "./config.js";

const app = initializeApp(firebaseconfig);

const auth = getAuth(app);

const db=getFirestore(app)

const colref=collection(db, 'Matches')
function savematch(p1, p2, winner) {
  return addDoc(colref, {
    player1: p1,
    player2: p2,
    winner: winner,
    createdAt: serverTimestamp(),
  });
}
const gamehisbtn=document.getElementById("gamehisbtn");
const historyDiv=document.getElementById("gamehis");
function loadhistory(){
const q=query(colref, orderBy('createdAt'))
getDocs(q)
    .then((snapshot)=>{
        snapshot.forEach((doc) => {
        const data = doc.data();

        const row = document.createElement("div");
        row.classList.add("match-card");

        row.innerHTML = `
        <div class="players">
            <span class="p1">${data.player1}</span>
            <span class="vs">VS</span>
            <span class="p2">${data.player2}</span>
        </div>
        <div class="winner">
        🏆 Winner: ${data.winner}
        </div>
        `;
    historyDiv.appendChild(row);
    });
    const   hisclose = document.createElement("div");
            hisclose.id = "hisclose";

            const btn = document.createElement("button");
            btn.classList.add("closebtn");
            btn.id="hiscls"
            btn.textContent = "HOMESCREEN";

            hisclose.appendChild(btn);
            historyDiv.appendChild(hisclose);   
            
            const hiscls=document.getElementById("hiscls");
            hiscls.addEventListener("click", ()=>{
            location.reload();
})
})
.catch((err) => {
      console.error("Error loading history:", err);
});
}
const leaderref=collection(db, 'Leaderboard');
function savewins(winner){
    const windoc = doc(db, "Leaderboard", winner);
    getDoc(windoc).then((snap) => {
    if (snap.exists()) {
    updateDoc(windoc, { 
        wins: snap.data().wins + 1 
    });
  } else {
    setDoc(windoc, { 
        winner: winner,
        wins: 1, 
    });
  }
});

}
const leaderboard=document.getElementById("leaderboard");
function createleaderboard(){
    const qu=query(leaderref, orderBy("wins", "desc"));
    getDocs(qu)
    .then((snap)=>{
        snap.forEach((doc)=>{
            const data=doc.data();

            const row=document.createElement("div");
            row.classList.add("leaderboard-card");
            
            row.innerHTML=`
            <div class="winners">
            <li><span class="Winner">${data.winner}</span>
            ✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘-✘
            <span class="wins">${data.wins} 🏆</span>
            </li>
            </div>`;

            leaderboard.appendChild(row);

        });
            const leadClose = document.createElement("div");
            leadClose.id = "leadclose";

            const btn = document.createElement("button");
            btn.classList.add("closebtn");
            btn.id="leadcls"
            btn.textContent = "HOMESCREEN";

            leadClose.appendChild(btn);
            leaderboard.appendChild(leadClose);   
            
            const leadcls=document.getElementById("leadcls");
            leadcls.addEventListener("click", ()=>{
            location.reload();
})

    })
    .catch(()=>{
        console.error(error.message);
    });
}


const leader_board=document.getElementById("leader_board");
leader_board.addEventListener("click", ()=>{
    startmenu.classList.add("hidden");
    gameover.classList.add("hidden");
    gamescreen.classList.add("hidden");
    leaderboard.classList.remove("hidden");
    createleaderboard();
})
const loginbtn = document.getElementById("loginbtn");
const authscreen = document.getElementById("authscreen");

const name1 = document.getElementById("name1");
const email1 = document.getElementById("email1");
const pass1 = document.getElementById("pass1");

const name2 = document.getElementById("name2");
const email2 = document.getElementById("email2");
const pass2 = document.getElementById("pass2");

let player1Name = "PLAYER 1";
let player2Name = "PLAYER 2";

loginbtn.addEventListener("click", () => {
    signInWithEmailAndPassword(auth, email1.value, pass1.value)
        .then((cred1) => {
            player1Name = cred1.user.displayName || name1.value;
            loginPlayer2();
        })
        .catch(() => {
            createUserWithEmailAndPassword(auth, email1.value, pass1.value)
                .then((cred1) => {

                    updateProfile(cred1.user, {
                        displayName: name1.value
                    })
                        .then(() => {
                            player1Name = name1.value;
                            loginPlayer2();
                        });

                })
                .catch((err) => alert(err.message));
        });

});
function loginPlayer2() {

    signInWithEmailAndPassword(auth, email2.value, pass2.value)
        .then((cred2) => {
            player2Name = cred2.user.displayName || name2.value;
            startGameAfterLogin();
        })
        .catch(() => {

            createUserWithEmailAndPassword(auth, email2.value, pass2.value)
                .then((cred2) => {

                    updateProfile(cred2.user, {
                        displayName: name2.value
                    })
                        .then(() => {
                            player2Name = name2.value;
                            startGameAfterLogin();
                        });

                })
                .catch((err) => alert(err.message));
        });
}
function logoutPlayers() {
    signOut(auth).then(() => {
        console.log("Players logged out");
    });
}

const startbtn = document.getElementById("startbtn");
const rulesbtn = document.getElementById("rulesbtn");
const closerulesbtn = document.getElementById("closerulesbtn");

const startmenu = document.getElementById("startmenu");
const rulespopup = document.getElementById("rulespopup");
const gamescreen = document.getElementById("gamescreen");

const gameover = document.getElementById("gameover");
const homescreen = document.getElementById("homescreen");
const p1hidden = document.getElementById("p1hidden");
const p2hidden = document.getElementById("p2hidden");
const mapscreen = document.getElementById("mapscreen");
const snowmap = document.getElementById("snowmap");

const desertmap = document.getElementById("desertmap");

const snow = document.getElementById("snow");
const desert = document.getElementById("desert");


gamehisbtn.addEventListener("click", ()=>{
    startmenu.classList.add("hidden");
    historyDiv.classList.remove("hidden");
    loadhistory();
})
rulesbtn.addEventListener("click", () => {
    rulespopup.classList.remove("hidden");
    startmenu.classList.add("hidden");
});


closerulesbtn.addEventListener("click", () => {
    rulespopup.classList.add("hidden");
    startmenu.classList.remove("hidden");
});

homescreen.addEventListener("click", () => {
    location.reload();

});


startbtn.addEventListener("click", () => {
    authscreen.classList.remove("hidden");
    mapscreen.classList.add("hidden");
    startmenu.classList.add("hidden");
    rulespopup.classList.add("hidden");
});
function startGameAfterLogin() {
    authscreen.classList.add("hidden");
    mapscreen.classList.remove("hidden");
}

snowmap.addEventListener("click", () => {
    mapscreen.classList.add("hidden");
    gamescreen.classList.remove("hidden");
    maingame(snow);
});
desertmap.addEventListener("click", () => {
    mapscreen.classList.add("hidden");
    gamescreen.classList.remove("hidden");
    maingame(desert);
});

let controlsinitialized = false;

function initcontrols(player1, player2) {
    if (controlsinitialized) return;
    controlsinitialized = true;

    document.addEventListener("keydown", (e) => {

        if (e.key === "w") player1.movingUp = true;
        if (e.key === "s") player1.movingDown = true;
        if (e.key === "a") player1.rotatingLeft = true;
        if (e.key === "d") player1.rotatingRight = true;

        if (e.key === "ArrowUp") player2.movingUp = true;
        if (e.key === "ArrowDown") player2.movingDown = true;
        if (e.key === "ArrowLeft") player2.rotatingLeft = true;
        if (e.key === "ArrowRight") player2.rotatingRight = true;

    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "w") player1.movingUp = false;
        if (e.key === "s") player1.movingDown = false;
        if (e.key === "a") player1.rotatingLeft = false;
        if (e.key === "d") player1.rotatingRight = false;

        if (e.key === "ArrowUp") player2.movingUp = false;
        if (e.key === "ArrowDown") player2.movingDown = false;
        if (e.key === "ArrowLeft") player2.rotatingLeft = false;
        if (e.key === "ArrowRight") player2.rotatingRight = false;
    });
}

function maingame(map) {
    const p1Name = player1Name;
    const p2Name = player2Name;

    let p1hasleft = false;
    let p2hasleft = false;

    let gamerunning = true;
    const canvas = document.getElementById("gamecanvas");
    const ctx = canvas.getContext("2d");

    const tankblue = document.getElementById("bluetank");
    const tankred = document.getElementById("redtank");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shield = document.getElementById("shield_");
    const player1 = {
        x: 30,
        y: 350,
        width: 100,
        height: 100,
        speed: 4,
        health: 100,
        angle: 0,
        movingUp: false,
        movingDown: false,
        rotatingLeft: false,
        rotatingRight: false,
        shield: false,
        shieldon: false,
    };

    const player2 = {
        x: 1340,
        y: 350,
        width: 100,
        height: 100,
        speed: 4,
        health: 100,
        angle: Math.PI,
        movingUp: false,
        movingDown: false,
        rotatingLeft: false,
        rotatingRight: false,
        shield: false,
        shieldon: false,
    };
    player1.image = tankblue;
    player2.image = tankred;

    class Bullet {
        constructor(x, y, angle, owner) {
            this.x = x;
            this.y = y;
            this.radius = 5;
            this.speed = 8;
            this.angle = angle;
            this.owner = owner;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        }

        draw() {
            ctx.fillStyle = "grey";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    let bullets = [];


    document.addEventListener("keydown", (e) => {


        if (e.key === "f") {
            const bulletX = player1.x + player1.width / 2 + Math.cos(player1.angle) * (player1.width / 2);
            const bulletY = player1.y + player1.height / 2 + Math.sin(player1.angle) * (player1.height / 2);

            bullets.push(new Bullet(bulletX, bulletY, player1.angle, player1));
        }



        if (e.key === "Enter") {
            const bulletX = player2.x + player2.width / 2 + Math.cos(player2.angle) * (player2.width / 2);
            const bulletY = player2.y + player2.height / 2 + Math.sin(player2.angle) * (player2.height / 2);

            bullets.push(new Bullet(bulletX, bulletY, player2.angle, player2));
        }

    });

    initcontrols(player1,player2);


    function drawTank(p) {

        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.rotate(p.angle + Math.PI / 2);
        ctx.drawImage(
            p.image,
            -p.width / 2,
            -p.height / 2,
            p.width,
            p.height
        );

        ctx.restore();
    }
    function bullethitstank(b, p) {
        return (
            b.x > p.x &&
            b.x < p.x + p.width &&
            b.y > p.y &&
            b.y < p.y + p.height
        );
    }
    const lives = document.getElementById("lives");
    const arr1 = [];
    for (let i = 0; i < 3; i++) {
        arr1[i] = lives;
    }

    const arr2 = [];
    for (let i = 0; i < 3; i++) {
        arr2[i] = lives;
    }
    let k1 = 2, k2 = 2;
    function homehit() {
        if (player2.x <= 200) {
            player2.angle = Math.PI;
            player2.x = 1340;
            player2.y = 350;
            arr2.splice(k2, 1);
            p2hasleft = false;
            k2--;
        }
        if (player1.x >= 1170) {
            player1.angle = 0;
            player1.x = 30;
            player1.y = 350;
            arr1.splice(k1, 1);
            p1hasleft = false;
            k1--;
        }
        if (arr1[0] == null) {
            player1.health = 0;
        }
        if (arr2[0] == null) {
            player2.health = 0;
        }
    }

    function updateMovement(p) {

        const rotatingspeed = 0.05;
        if (p.rotatingLeft) p.angle -= rotatingspeed;
        if (p.rotatingRight) p.angle += rotatingspeed;

        if (p.movingUp) {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
        }
        if (p.movingDown) {
            p.x -= Math.cos(p.angle) * p.speed;
            p.y -= Math.sin(p.angle) * p.speed;
        }

        homehit();
        if (p.x < 0) p.x = 0;
        if (p.x + p.width > canvas.width) {
            p.x = canvas.width - p.width;
        }
        if (p.y < 0) p.y = 0;
        if (p.y + p.height > canvas.height) {
            p.y = canvas.height - p.height;
        }
    }



    function drawBottomHealthBars() {
        const barWidth = canvas.width * 0.35;
        const barHeight = 20;
        const padding = 20;


        const p1X = 40;
        const p1Y = canvas.height - barHeight - padding;


        const p2X = canvas.width - barWidth - 40;
        const p2Y = canvas.height - barHeight - padding;

        ctx.fillStyle = "#555";
        ctx.beginPath();
        ctx.roundRect(p1X, p1Y, barWidth, barHeight, 10);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.roundRect(p2X, p2Y, barWidth, barHeight, 10);
        ctx.fill();
        ctx.closePath();


        const p1Percent = player1.health / 100;
        ctx.fillStyle = p1Percent > 0.5 ? "limegreen" : p1Percent > 0.2 ? "orange" : "red";
        ctx.beginPath();
        ctx.roundRect(p1X, p1Y, barWidth * p1Percent, barHeight, 10);
        ctx.fill();
        ctx.closePath();

        const p2Percent = player2.health / 100;
        ctx.fillStyle = p2Percent > 0.5 ? "limegreen" : p2Percent > 0.2 ? "orange" : "red";
        ctx.beginPath();
        ctx.roundRect(p2X, p2Y, barWidth * p2Percent, barHeight, 10);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "Black";
        ctx.font = "16px Arial";
        ctx.fillText(p1Name.toUpperCase(), p1X, p1Y - 6);
        ctx.fillText(p2Name.toUpperCase(), p2X, p2Y - 6);


        if (p1Percent <= 0) {
            gamerunning = false;
            gameover.classList.remove("hidden");
            gamescreen.classList.add("hidden");
            p2hidden.classList.remove("hidden");
            p2hidden.textContent = `🏆 ${p2Name.toUpperCase()} WINS 🏆`;

            p1hidden.classList.add("hidden");
            savewins(p2Name);
            savematch(p1Name, p2Name, p2Name)
            .then(() => {
            console.log("Match saved successfully");
            logoutPlayers();
            })
            .catch((err) => {
            console.error("Failed to save match", err);
        });

        }

        if (p2Percent <= 0) {
            gamerunning = false;
            gameover.classList.remove("hidden");
            gamescreen.classList.add("hidden");
            p1hidden.classList.remove("hidden");
            p1hidden.textContent = `🏆 ${p1Name.toUpperCase()} WINS 🏆`;
            savewins(p1Name);

            savematch(p1Name, p2Name, p1Name)
            .then(() => {
            console.log("Match saved successfully");
            logoutPlayers();
            })
            .catch((err) => {
            console.error("Failed to save match", err);
        });
        }

    }


    let powerup1 = null;
    let powerup2 = null;
    function randomreturn1() {
        let x = 200 + Math.random() * (canvas.width - 400);
        let y = 200 + Math.random() * (canvas.height - 400);
        return { x, y };
    }
    function randomreturn2() {
        let x = 200 + Math.random() * (canvas.width - 400);
        let y = 200 + Math.random() * (canvas.height - 400);
        return { x, y };
    }
    function powerups1() {
        setInterval(() => {
            powerup1 = randomreturn1();

            setTimeout(() => {
                powerup1 = null;
            }, 5000);
        }, 10000);
    }
    powerups1();

    function powerups2() {
        setInterval(() => {
            powerup2 = randomreturn2();

            setTimeout(() => {
                powerup2 = null;
            }, 6000);
        }, 12000);
    }
    powerups2();
    let colcheck = false;
    function gainpower2x(p) {
        if (!powerup1) return;

        const pw = 20;
        const ph = 20;

        if (
            p.x < powerup1.x + pw &&
            p.x + p.width > powerup1.x &&
            p.y < powerup1.y + ph &&
            p.y + p.height > powerup1.y
        ) {
            colcheck = true;
            p.speed = 8;
            powerup1 = null;
            setTimeout(() => p.speed = 4, 5000);
        }
    }

    function bullethitsshield(b, p) {
        let X = b.x - (p.x + p.width / 2);
        let Y = b.y - (p.y + p.height / 2);
        let dist = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));

        return dist;
    }

    function gainshield(p) {
        if (!powerup2) return;

        const pw = 20;
        const ph = 20;

        if (
            p.x < powerup2.x + pw &&
            p.x + p.width > powerup2.x &&
            p.y < powerup2.y + ph &&
            p.y + p.height > powerup2.y
        ) {
            p.shieldon = true;
            colcheck = true;
            p.shield = true;
            powerup2 = null;
            setTimeout(() => {
                p.shieldon = false;
                p.shield = false;
            }, 5000);
        }
    }

    function increase_health(p) {
        p.health += 0.1;
        if (p.health > 100) p.health = 100;
    }
    let cool_length1 = 0.35 * canvas.width;
    let cool_length2 = 0.35 * canvas.width;
    const max1 = cool_length1;
    const max2 = cool_length2;
    const _2x = document.getElementById("2x");



    function gameLoop() {
        colcheck = false;
        if (!gamerunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(map, 0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = "#801700";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();


        if (player1.x > 200) {
            p1hasleft = true;
        }


        if (player2.x < 1170) {
            p2hasleft = true;
        }


        if (player1.x < 200 && p1hasleft) {

            let coolx = (0.65 * canvas.width) / 2;
            let cooly = 70;

            ctx.beginPath();
            ctx.fillStyle = "#555";
            ctx.roundRect(coolx, cooly, 0.35 * canvas.width, 20, 10);
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "Black";
            ctx.font = "30px Arial";
            ctx.fillText("GET OUTSIDE ASAP!!!", coolx + 90, cooly - 10);

            ctx.beginPath();
            ctx.fillStyle = "orange";
            ctx.roundRect(coolx, cooly, cool_length1, 20, 10);
            ctx.fill();
            ctx.closePath();
            cool_length1 -= 1.5;
            increase_health(player1);
            if (cool_length1 < 0) {
                cool_length1 = max1;
                arr1.splice(k1, 1);
                k1--;
            }
        }
        if (player2.x > 1170 && p2hasleft) {
            let coolx = (0.65 * canvas.width) / 2;
            let cooly = 70;

            ctx.beginPath();
            ctx.fillStyle = "#555";
            ctx.roundRect(coolx, cooly, 0.35 * canvas.width, 20, 10);
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle = "Black";
            ctx.font = "30px Arial";
            ctx.fillText("GET OUTSIDE ASAP!!!", coolx + 90, cooly - 10);

            ctx.beginPath();
            ctx.fillStyle = "orange";
            ctx.roundRect(coolx, cooly, cool_length2, 20, 10);
            ctx.fill();
            ctx.closePath();
            cool_length2 -= 1.5;
            increase_health(player2);
            if (cool_length2 < 0) {
                cool_length2 = max2;
                arr2.splice(k2, 1);
                k2--;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = "#2C5B93";
        ctx.fillRect(150, 0, 50, 900);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#C33124";
        ctx.fillRect(1270, 0, 50, 900);
        ctx.closePath();

        let lives1x = 40;
        const lives1Y = canvas.height - 100;

        for (let i = 0; i < arr1.length; i++) {
            ctx.drawImage(arr1[i], lives1x, lives1Y, 40, 40);
            lives1x += 50;
        }
        let lives2x = 0.65 * canvas.width - 40;
        const lives2Y = canvas.height - 100;

        for (let i = 0; i < arr2.length; i++) {
            ctx.drawImage(arr2[i], lives2x, lives2Y, 40, 40);
            lives2x += 50;
        }

        updateMovement(player1);
        updateMovement(player2);

        drawTank(player1);
        drawTank(player2);

        if (powerup1) {
            if (!colcheck) {
                ctx.drawImage(_2x, powerup1.x, powerup1.y, 64, 64);
            }
            gainpower2x(player1);
            gainpower2x(player2);
        }

        if (powerup2) {
            if (!colcheck) {
                ctx.drawImage(shield, powerup2.x, powerup2.y, 64, 64);
            }
            gainshield(player1);
            gainshield(player2);
        }

        if (player1.shield) {
            ctx.beginPath();
            ctx.arc(player1.x + 50, player1.y + 50, 70, 0, Math.PI * 2);
            ctx.strokeStyle = "#801700";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.closePath();
        }
        if (player2.shield) {
            ctx.beginPath();
            ctx.arc(player2.x + 50, player2.y + 50, 70, 0, Math.PI * 2);
            ctx.strokeStyle = "#801700";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.closePath();
        }
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.update();
            b.draw();

            if ((player1.shieldon && bullethitsshield(b, player1) <= 75) && b.owner !== player1) {
                bullets.splice(i, 1);
                continue;
            }
            if ((player2.shieldon && bullethitsshield(b, player2) <= 75) && b.owner !== player2) {
                bullets.splice(i, 1);
                continue;
            }
            if (b.owner !== player1 && bullethitstank(b, player1)) {
                player1.health -= 5;
                bullets.splice(i, 1);
                continue;
            }

            if (b.owner === player1 && b.x > 1270) {
                bullets.splice(i, 1);
                continue;
            }

            if (b.owner === player2 && b.x < 200) {
                bullets.splice(i, 1);
                continue;
            }
            if (b.owner !== player2 && bullethitstank(b, player2)) {
                player2.health -= 5;
                bullets.splice(i, 1);
                continue;
            }

            if (b.x < 0 || b.x > canvas.width) {
                bullets.splice(i, 1);
            }
        }

        drawBottomHealthBars();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
