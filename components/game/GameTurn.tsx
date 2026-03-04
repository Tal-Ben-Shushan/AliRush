import { Animated, StyleSheet, View } from "react-native";
import { GameSettings, GameState } from "../../types/game";
import { GameOver } from "./GameOver";
import { GamePlaying } from "./GamePlaying";
import { GameReady } from "./GameReady";
import { GameTurnEnd } from "./GameTurnEnd";

interface TurnProps {
  gameState: GameState;
  settings: GameSettings;
  currentGroup: number;
  groupScores: number[];
  timeLeft: number;
  turnScore: number;
  currentWord: string;
  currentWords: string[];
  currentWordIndex: number;
  pan: Animated.ValueXY;
  panResponderHandlers: any;
  swipeHistory: ("left" | "right")[];
  isDark: boolean;
  chipBorderColor: string;
  chipBgActive: string;
  onStartTurn: () => void;
  onProceedToNextGroup: () => void;
  onReturnToSetup: () => void;
  onUndo: () => void;
}

export function GameTurn({
  gameState,
  settings,
  currentGroup,
  groupScores,
  timeLeft,
  turnScore,
  currentWord,
  currentWords,
  currentWordIndex,
  pan,
  panResponderHandlers,
  swipeHistory,
  isDark,
  chipBorderColor,
  chipBgActive,
  onStartTurn,
  onProceedToNextGroup,
  onReturnToSetup,
  onUndo,
}: TurnProps) {
  return (
    <View style={styles.container}>
      {gameState === GameState.Ready && (
        <GameReady
          currentGroup={currentGroup}
          groupScores={groupScores}
          targetPoints={settings.targetPoints}
          onStartTurn={onStartTurn}
        />
      )}

      {gameState === GameState.Playing && (
        <GamePlaying
          timeLeft={timeLeft}
          roundTimer={settings.roundTimer}
          turnScore={turnScore}
          currentWord={currentWord}
          pan={pan}
          panResponderHandlers={panResponderHandlers}
          isDark={isDark}
          chipBorderColor={chipBorderColor}
          onUndo={onUndo}
          canUndo={swipeHistory.length > 0}
        />
      )}

      {gameState === GameState.TurnEnd &&
        (() => {
          const startIndex = currentWordIndex - swipeHistory.length;
          const correctWords: string[] = [];
          const failedWords: string[] = [];

          swipeHistory.forEach((swipe, i) => {
            const word = currentWords[startIndex + i];
            if (word) {
              if (swipe === "right") correctWords.push(word);
              else failedWords.push(word);
            }
          });

          return (
            <GameTurnEnd
              currentGroup={currentGroup}
              turnScore={turnScore}
              totalGroupScore={groupScores[currentGroup]}
              correctWords={correctWords}
              failedWords={failedWords}
              onProceedToNextGroup={onProceedToNextGroup}
            />
          );
        })()}

      {gameState === GameState.GameOver && (
        <GameOver
          groupScores={groupScores}
          chipBgActive={chipBgActive}
          onReturnToSetup={onReturnToSetup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
