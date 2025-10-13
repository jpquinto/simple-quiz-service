
interface GameOverProps {
    score: number;
    handleRestart: () => void;
}

export const GameOver = ({ score, handleRestart }: GameOverProps) => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-xl mb-6">Final Score: {score}</p>
          <button
            onClick={handleRestart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
}