import { useEffect, useRef, useState } from "react";
import { P2Start } from '@/styles/fonts';
import Player from "@/pages/games/modules/MathInvasors/Player";
import Missile from "@/pages/games/modules/MathInvasors/Missile";
import { generateEnemies } from "@/pages/games/modules/MathInvasors/Enemy";
import { GetRandomOperation, GetRandomNumber } from "@/pages/games/modules/MathInvasors/MathUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

function UnsetEvents(keyPressed, keyReleased) {
    window.removeEventListener("keydown", keyPressed);
    window.removeEventListener("keyup", keyReleased);
}

function SetEvents(keyPressed, keyReleased) {
    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyReleased);
}

export default function MathInvasors() {
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const missilesRef = useRef([]);
    const enemiesRef = useRef([]);
    const [Score, SetScore] = useState(0);
    const [Operation, SetOperation] = useState("");
    const CanvasWidth = 800;
    const CanvasHeight = 430;
    let Result = useRef(0);
    const [Playing, SetPlaying] = useState(false);
    const [GameOver, SetGameOver] = useState(false);
    const animationFrameRef = useRef(null);
    const [Info, SetInfo] = useState("");
    const [ButtonText, SetButtonText] = useState("Start");


    useEffect(() => {
        if (Playing) SetGameOver(false);
    }, [Playing]);

    useEffect(() => {
        if (GameOver) {
            SetInfo("GAME OVER")
            SetButtonText("Restart")
        }
    }, [GameOver]);

    useEffect(() => {
        SetInfo(Operation ? `Current Operation: ${Operation}` : "");
    }, [Operation]);


    useEffect(() => {
        console.log("ENTRÉ")
        if (!Playing || GameOver) return;
        console.log("ENTRÉ Y PASE")
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = CanvasWidth;
        canvas.height = CanvasHeight;
        playerRef.current = new Player(canvas.width, canvas.height);

        function SpawnWave(CanvasWidth) {
            const { operand1, operand2, operator, result } = GetRandomOperation();
            const newOperation = `${operand1} ${operator} ${operand2}`;
            SetOperation(newOperation)
            Result.current = result;
            const EnemiesWave = [GetRandomNumber(), GetRandomNumber(), result].sort(() => Math.random() - 0.5);
            enemiesRef.current = generateEnemies(CanvasWidth, EnemiesWave);
        }

        SpawnWave(canvas.width);

        const keyPressed = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft") playerRef.current.MoveLeft();
            if (e.key === "ArrowRight") playerRef.current.MoveRight();
            if (e.key === " ") {
                e.preventDefault();
                const shootPosition = playerRef.current.Shoot();
                if (!shootPosition) return;
                const newMissile = new Missile(shootPosition.x, shootPosition.y);
                missilesRef.current.push(newMissile);
            }
        };

        const keyReleased = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                playerRef.current.Stop();
            }
        };

        SetEvents(keyPressed, keyReleased);

        const UpdateAndDrawPlayer = (ctx) => {
            if (!playerRef.current) return;
            playerRef.current.Update(canvas.width);
            playerRef.current.Draw(ctx);
        };

        const UpdateEnemies = () => {
            enemiesRef.current = enemiesRef.current.filter((enemy) => {
                enemy.Move();
                return enemy.Y <= canvas.height;
            });
        }

        const DrawEnemies = (ctx) => {
            enemiesRef.current.forEach((enemies) => enemies.Draw(ctx));
        }

        const UpdateMissiles = () => {
            missilesRef.current.forEach((missile) => missile.Move());
            missilesRef.current = missilesRef.current.filter(
                (missile) => missile.Y > 0
            );
        };

        const DrawMissiles = (ctx) => {
            missilesRef.current.forEach((missile) => missile.Draw(ctx));
        };

        function animateMissiles() {
            UpdateMissiles();
            DrawMissiles(ctx);
        }

        function animateEnemies() {
            UpdateEnemies();
            DrawEnemies(ctx);
        }

        const CheckCollisions = () => {
            let hitCorrectEnemy = false;
            let hit = false;
            missilesRef.current = missilesRef.current.filter((missile) => {
                enemiesRef.current = enemiesRef.current.filter((enemy) => {
                    function missileIsInEnemySquare() {
                        const HitboxOffset = 1.05;
                        return missile.X < enemy.X + (enemy.Width * HitboxOffset) &&
                            missile.X >= (enemy.X * 0.9) &&
                            missile.Y < enemy.Y + (enemy.Height * HitboxOffset) &&
                            missile.Y >= (enemy.Y * 0.9);
                    }
                    if (missileIsInEnemySquare()) {
                        hit = true;
                        if (enemy.Number === Result.current) {
                            SetScore((prevScore) => prevScore + 1);
                            hitCorrectEnemy = true
                        }
                        return false;
                    }
                    return true;
                });
                return !hit;
            });
            if (hit && hitCorrectEnemy) {
                enemiesRef.current = [];
                SpawnWave(canvas.width);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            UpdateAndDrawPlayer(ctx);
            animateMissiles();
            animateEnemies();
            CheckCollisions();
            animationFrameRef.current = requestAnimationFrame(animate);
            if (enemiesRef.current.length === 0) {
                SetGameOver(true);
                SetPlaying(false);
                UnsetEvents(keyPressed, keyReleased);
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
        animate();

        return () => {
            UnsetEvents(keyPressed, keyReleased);
        };
    }, [Playing]);

    return (
        <>
            <div id={""} className={"app flex flex-col h-screen bg-PS-main-purple"}>
                <Header></Header>
                <main className="flex flex-col flex-1 items-center justify-center bg-PS-main-purple">
                    <section className={"flex flex-col"}>
                        <h1 className={`text-center text-2xl ${P2Start.className} text-PS-dark-yellow`}>Math Invasors</h1>
                        <h2 className={`text-center text-3xl ${P2Start.className} text-PS-dark-yellow`}>Score: {Score}</h2>
                        <h2 className={`text-center text-3xl ${P2Start.className} text-PS-dark-yellow`}>{Info}</h2>
                    </section>
                    <section className={"flex-1 flex items-center justify-center"}>
                        <canvas
                            ref={canvasRef}
                            width={CanvasWidth}
                            height={CanvasHeight}
                            className="border-4 border-PS-dark-yellow bg-PS-light-yellow mb-4"
                        ></canvas>
                    </section>
                    <section className={"mb-5"}>
                        {!Playing && ( // Button only appears when user is not playing
                            <Button id={"MainButton"} size={"large"} onClick={Start}>
                                {ButtonText}
                            </Button>
                        )}
                    </section>
                </main>
                <Footer></Footer>
            </div>
        </>
    );

    function Start() {
        SetScore(0)
        SetGameOver(false);
        SetPlaying(true);
    }
}