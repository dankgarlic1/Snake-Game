import pygame
import sys
import os
import random
import math

pygame.init()
pygame.display.set_caption("Snake Game")
pygame.font.init()
random.seed()

# Global constants 
speed = 0.30
SNAKE_SIZE = 9
APPLE_SIZE = SNAKE_SIZE
SEPARATION = 10 # between 2 pixels
SCREEN_HEIGHT = 600
SCREEN_WIDTH = 800
FPS = 25
KEY = {"UP": 1, "DOWN": 2, "LEFT": 3, "RIGHT": 4}

# Initialize screen
screen = pygame.display.set_mode((SCREEN_HEIGHT, SCREEN_WIDTH), pygame.HWSURFACE)

# Resources
score_font = pygame.font.Font(None, 38)
score_numb_font = pygame.font.Font(None, 28)
game_over_font = pygame.font.Font(None, 48)
play_again_font = score_numb_font
score_msg = score_font.render("Score: ", 1, pygame.Color("green"))
score_msg_size = score_font.size("Score")
background_color = pygame.Color(0, 0, 0)
black = pygame.Color(0, 0, 0)

# Clock
gameClock = pygame.time.Clock()

# Keys 
def getKey():
    for event in pygame.event.get():
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                return KEY["UP"]
            elif event.key == pygame.K_DOWN:
                return KEY["DOWN"]
            elif event.key == pygame.K_LEFT:
                return KEY["LEFT"]
            elif event.key == pygame.K_RIGHT:
                return KEY["RIGHT"]
            # For exit
            elif event.key == pygame.K_ESCAPE:
                return "exit"
            # Continue playing
            elif event.key == pygame.K_y:
                return "yes"
            # Quit
            elif event.key == pygame.K_n:
                return "no"
        if event.type == pygame.QUIT:
            sys.exit(0)

def endGame():
    print("Game Over")
    sys.exit()

# Placeholder for the rest of your game logic
